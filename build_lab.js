// noixzy lab — generator: stamps the shared engine + each piece's render() into
// self-contained HTML files. Edit the engine ONCE here; every piece inherits it.
const fs=require("fs"), path=require("path");

// ---------------- shared engine (no backticks / no ${} inside) ----------------
const ENGINE = (cfg) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>noixzy // ${cfg.title}</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
<style>
  :root { --bg:#0e0e10; --panel:#1a1a1d; --ink:#e8e8ea; --accent:#ed5700; --dim:#7a7a7e; }
  html,body { margin:0; overflow:hidden; background:var(--bg); color:var(--ink);
              font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace; }
  .stage { position:fixed; inset:0; background:#000; }
  .stage canvas { display:block; width:100vw; height:100vh; }
  .panel { position:fixed; top:14px; right:14px; width:248px;
           max-height:calc(100vh - 28px); overflow-y:auto;
           background:rgba(16,16,20,0.58); -webkit-backdrop-filter:blur(13px); backdrop-filter:blur(13px);
           border:1px solid rgba(255,255,255,0.09); padding:12px 14px; border-radius:9px;
           box-shadow:0 10px 34px rgba(0,0,0,0.45); }
  .panel.hidden { opacity:0; pointer-events:none; }
  .panel h1 { font-size:13px; letter-spacing:.12em; text-transform:lowercase; margin:0 0 6px; color:var(--accent); }
  details { border-top:1px solid #262629; padding:6px 0; }
  details[open] summary { color:var(--accent); }
  summary { cursor:pointer; list-style:none; padding:4px 0; letter-spacing:.1em;
            text-transform:uppercase; font-size:11px; color:var(--dim); }
  summary::-webkit-details-marker { display:none; }
  summary::before { content:"+ "; } details[open] summary::before { content:"– "; }
  .row { margin:7px 0; }
  .row label { display:flex; justify-content:space-between; margin-bottom:3px; opacity:.85; }
  input[type=range] { width:100%; accent-color:var(--accent); }
  .seed { display:flex; gap:8px; align-items:center; margin-top:10px; }
  .seed input { width:96px; background:#000; color:var(--ink); border:1px solid #333; padding:5px 6px; font:inherit; }
  button { background:#000; color:var(--ink); border:1px solid #333; padding:6px 9px; font:inherit; cursor:pointer; border-radius:4px; }
  button:hover { border-color:var(--accent); color:var(--accent); }
  .read { margin-top:10px; opacity:.6; }
  .btns { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
  .favs { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
  .chip { display:flex; align-items:center; gap:5px; background:#000; border:1px solid #333; border-radius:4px; padding:4px 6px; cursor:pointer; font-size:11px; }
  .chip:hover { border-color:var(--accent); } .chip b { color:var(--accent); }
  .chip .sw { width:9px; height:9px; border-radius:2px; display:inline-block; }
  .chip .x { opacity:.45; padding:0 2px; } .chip .x:hover { opacity:1; color:var(--accent); }
</style>
</head>
<body>
<div class="stage" id="stage"></div>
<div class="panel">
  <h1>noixzy // ${cfg.title}</h1>
  <div id="groups"></div>
  <div class="seed"><input id="seedField" type="number" value="1"><button id="newSeed">new seed</button></div>
  <div class="btns"><button id="pin">★ pin</button><button id="reset">reset</button><button id="pause">pause</button><button id="save">save png</button></div>
  <div id="favs" class="favs"></div>
  <div class="btns" id="favBtns" style="display:none;"><button id="exportFavs">export ★</button><button id="clearFavs">clear ★</button></div>
  <div class="read">seed: <span id="seedRead">1</span> &nbsp; <span style="opacity:.5">[h] hide</span></div>
</div>
<script>
let W=820,H=820; const PIECE="${cfg.id}", FAVKEY="noixzy_"+PIECE+"_favs";
let seed=1, running=true, t0, pauseT=0, dirty=true;
let raw, scene, glowBuf, vigTex, grainTex, specTex;

// piece-specific SYSTEM params
const SYSTEM=${JSON.stringify(cfg.system)};
// shared layers (identical across all pieces)
const SHARED=[
  {k:"metallic",g:"material",label:"metallic", min:0,max:1,step:.01,v:0},
  {k:"rough",   g:"material",label:"roughness",min:0,max:1,step:.01,v:.5},
  {k:"sheen",   g:"material",label:"sheen",    min:0,max:1,step:.01,v:0},
  {k:"alpha",   g:"material",label:"opacity",  min:.1,max:1,step:.01,v:1},
  {k:"zoom",    g:"frame",   label:"zoom",     min:.4,max:2,step:.01,v:1},
  {k:"rot",     g:"frame",   label:"rotate",   min:-1,max:1,step:.01,v:0},
  {k:"mirror",  g:"frame",   label:"symmetry", min:0,max:2,step:1,v:0,rr:true},
  {k:"contrast",g:"look",    label:"contrast", min:0,max:1,step:.01,v:.4},
  {k:"vig",     g:"look",    label:"vignette", min:0,max:1,step:.01,v:.4},
  {k:"grain",   g:"look",    label:"grain",    min:0,max:1,step:.01,v:.14},
  {k:"glow",    g:"look",    label:"glow",     min:0,max:1,step:.01,v:.25},
  {k:"speed",   g:"motion",  label:"speed",    min:0,max:1,step:.01,v:0},
  {k:"drift",   g:"motion",  label:"drift",    min:0,max:1,step:.01,v:0},
];
SYSTEM.forEach(p=>{p.g="system"; p.sys=true;});
const PARAMS=SYSTEM.concat(SHARED);
const P={}; PARAMS.forEach(p=>P[p.k]=p.v);
const GROUPS=["system","material","frame","look","motion"];

const PALETTES=[
  ["#0e0e10","#ed5700","#e8e8ea"],["#0b1a1a","#1d725e","#cfe8df"],["#16121f","#3c3c83","#b9b9e6"],
  ["#1a1208","#79461d","#f0d8b8"],["#0c0c0c","#888888","#f2f2f2"],["#0a0e14","#2a557e","#cfe4ff"],
  ["#0a0f08","#46781f","#d4f0a0"],["#140807","#8a2420","#f0c2b2"],["#0c0a04","#6a5418","#f5e2a4"],
  ["#0c0814","#7a2a6a","#aef0ff"]];
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
function makeField(N,fn){ const img=createImage(N,N); img.loadPixels();
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){ const c=fn(x,y); const i=4*(y*N+x);
    img.pixels[i]=c[0];img.pixels[i+1]=c[1];img.pixels[i+2]=c[2];img.pixels[i+3]=c.length>3?c[3]:255; }
  img.updatePixels(); return img; }

// Shared isometric/heightfield renderer
function renderHeightfield(g,heights,G,pal,opts={}){
  // heights: Float32Array length G*G with values 0..1
  const MAX_DEPTH = Math.min(g.width,g.height)*0.28; // world units for extrude scale
  const cellW = g.width / G; const cellH = g.height / G;
  g.noStroke();
  // draw back-to-front: start from bottom row to top row
  for(let j=G-1;j>=0;j--){ for(let i=0;i<G;i++){
    const idx = i + j*G; const h = (heights && heights[idx]!==undefined)?heights[idx]:0;
    if(!h||h<=0.001) continue; // skip zero-height
    const z = h * P.extrude * MAX_DEPTH; // world z offset
    // base quad screen positions (top-left of the cell)
    const x0 = i * cellW; const y0 = j * cellH;
    // apply a simple oblique/iso offset for the top surface
    const sx = x0 + z * 0.5;
    const sy = y0 - z;
    // corners of the top quad
    const x1 = sx, y1 = sy;
    const x2 = sx + cellW, y2 = sy;
    const x3 = sx + cellW, y3 = sy + cellH;
    const x4 = sx, y4 = sy + cellH;
    // top color: ramp between accent and ink by height
    const topCol = [ lerp(pal[1][0], pal[2][0], h), lerp(pal[1][1], pal[2][1], h), lerp(pal[1][2], pal[2][2], h) ];
    // brighten top slightly based on metallic/rough
    const sheen = Math.min(1, P.metallic*(1-P.rough)+P.sheen);
    const bright = 1 + 0.25 * sheen;
    g.fill(topCol[0]*bright, topCol[1]*bright, topCol[2]*bright);
    g.quad(x1,y1, x2,y2, x3,y3, x4,y4);
    // side visible (assume right/down faces visible) - draw two side quads
    const sideDark = 0.6; // darkness factor for sides
    const sideCol = [ topCol[0]*sideDark, topCol[1]*sideDark, topCol[2]*sideDark ];
    // right face (east)
    g.fill(sideCol[0], sideCol[1], sideCol[2]);
    g.quad(x2,y2, x2,y2+z, x3,y3+z, x3,y3);
    // bottom face (south)
    g.fill(sideCol[0]*0.85, sideCol[1]*0.85, sideCol[2]*0.85);
    g.quad(x4,y4, x3,y3, x3,y3+z, x4,y4+z);
  }}
}


/* ================= PIECE CODE ================= */
${cfg.code}
/* ============================================== */

function setup(){
  const c=createCanvas(windowWidth,windowHeight); c.parent("stage"); pixelDensity(1);
  W=width; H=height; allocBuffers(); t0=millis();
  buildSystem(); buildUI(); loadFavs();
}
function allocBuffers(){
  raw=createGraphics(W,H); scene=createGraphics(W,H);
  glowBuf=createGraphics(Math.floor(W/3),Math.floor(H/3));
  vigTex=createGraphics(W,H);
  const vg=vigTex.drawingContext.createRadialGradient(W/2,H/2,Math.min(W,H)*0.28,W/2,H/2,Math.hypot(W/2,H/2));
  vg.addColorStop(0,"rgba(0,0,0,0)"); vg.addColorStop(1,"rgba(0,0,0,1)");
  vigTex.drawingContext.fillStyle=vg; vigTex.drawingContext.fillRect(0,0,W,H);
  specTex=createGraphics(W,H);
  const sg=specTex.drawingContext.createLinearGradient(0,0,W,H);
  sg.addColorStop(0,"rgba(255,255,255,0)"); sg.addColorStop(.46,"rgba(255,255,255,.35)");
  sg.addColorStop(.5,"rgba(255,255,255,.85)"); sg.addColorStop(.54,"rgba(255,255,255,.35)"); sg.addColorStop(1,"rgba(255,255,255,0)");
  specTex.drawingContext.fillStyle=sg; specTex.drawingContext.fillRect(0,0,W,H);
  grainTex=createGraphics(320,320); grainTex.loadPixels();
  for(let i=0;i<grainTex.pixels.length;i+=4){ const v=128+(Math.random()-0.5)*255;
    grainTex.pixels[i]=grainTex.pixels[i+1]=grainTex.pixels[i+2]=v; grainTex.pixels[i+3]=255; }
  grainTex.updatePixels();
}
function windowResized(){ resizeCanvas(windowWidth,windowHeight); W=width; H=height; allocBuffers(); buildSystem(); }
function keyPressed(){ if(document.activeElement&&document.activeElement.tagName==="INPUT")return;
  if(key==="h"||key==="H") document.querySelector(".panel").classList.toggle("hidden"); }

function buildSystem(){ randomSeed(seed); noiseSeed(seed); build(); dirty=true; }
function renderScene(){
  randomSeed(seed); noiseSeed(seed);
  raw.clear();
  // If the piece provides a heightField(G) function and extrude is active, render as heightfield
  try{
    const palLocal = PALETTES[P.pal].map(hx);
    if(typeof heightField === 'function' && P.extrude>0.01){ const G=130; const heights = heightField(G);
      if(heights && heights.length===G*G){ renderHeightfield(raw,heights,G,palLocal,{}); }
      else { render(raw,palLocal); }
    }else{ render(raw,palLocal); }
  }catch(e){ console.warn('heightfield render failed, falling back to flat render',e); render(raw, PALETTES[P.pal].map(hx)); }
  // bake symmetry into scene (screen-space clip on untransformed raw)
  scene.clear(); const m=Math.round(P.mirror);
  if(m===0){ scene.image(raw,0,0); }
  else if(m===1){ bake(0,0,W/2,H,1,1,0,0); bake(W/2,0,W/2,H,-1,1,W,0); }
  else { bake(0,0,W/2,H/2,1,1,0,0); bake(W/2,0,W/2,H/2,-1,1,W,0); bake(0,H/2,W/2,H/2,1,-1,0,H); bake(W/2,H/2,W/2,H/2,-1,-1,W,H); }
  glowBuf.clear(); glowBuf.image(scene,0,0,glowBuf.width,glowBuf.height); glowBuf.filter(BLUR,3);
}
function bake(cx,cy,cw,ch,sx,sy,tx,ty){
  scene.push(); scene.drawingContext.beginPath(); scene.drawingContext.rect(cx,cy,cw,ch); scene.drawingContext.clip();
  scene.translate(tx,ty); scene.scale(sx,sy); scene.image(raw,0,0); scene.pop();
}
function draw(){
  const time=(running?(millis()-t0)/1000:pauseT);
  const animate=(P.speed>0||P.drift>0);
  if(dirty){ renderScene(); dirty=false; }
  const pal=PALETTES[P.pal].map(hx);
  background(pal[0][0],pal[0][1],pal[0][2]);
  // FRAME + MOTION transform applied to the baked scene
  const dz=1+(P.drift>0?Math.sin(time*0.6)*0.045*P.drift:0);
  const ar=(P.speed>0?time*0.08*P.speed:0);
  push();
  translate(W/2,H/2); scale(P.zoom*dz); rotate(P.rot*Math.PI+ar); translate(-W/2,-H/2);
  drawingContext.filter = P.contrast>0 ? "contrast("+((100+P.contrast*120)|0)+"%)" : "none";
  tint(255,255*P.alpha); image(scene,0,0);
  drawingContext.filter="none";
  if(P.glow>0.01){ blendMode(ADD); tint(255,110*P.glow); image(glowBuf,0,0,W,H); blendMode(BLEND); }
  pop(); noTint();
  // MATERIAL sheen (screen-space)
  const sheen=Math.min(1,P.metallic*(1-P.rough)+P.sheen);
  if(sheen>0.01){ push(); blendMode(ADD); tint(255,150*sheen); image(specTex,0,0,W,H); pop(); blendMode(BLEND); noTint(); }
  if(P.vig>0.01){ push(); tint(255,255*P.vig); image(vigTex,0,0,W,H); pop(); noTint(); }
  if(P.grain>0.01){ push(); blendMode(OVERLAY); tint(255,200*P.grain);
    const ox=-Math.random()*60,oy=-Math.random()*60; image(grainTex,ox,oy,W-ox,H-oy); pop(); blendMode(BLEND); noTint(); }
  select("#seedRead").html(seed);
}

function buildUI(){
  const host=document.getElementById("groups");
  GROUPS.forEach((g,gi)=>{ const det=document.createElement("details"); if(gi<2)det.open=true;
    const sum=document.createElement("summary"); sum.textContent=g; det.appendChild(sum);
    PARAMS.filter(p=>p.g===g).forEach(p=>{ const row=document.createElement("div"); row.className="row";
      const lab=document.createElement("label"); const span=document.createElement("span"); span.id="v_"+p.k;
      lab.append(p.label+" ",span);
      const inp=document.createElement("input"); inp.type="range"; inp.min=p.min; inp.max=p.max; inp.step=p.step; inp.value=p.v; inp.id="p_"+p.k;
      const fmt=()=> span.textContent=(p.step>=1)?P[p.k]:(+P[p.k]).toFixed(2);
      inp.addEventListener("input",()=>{ P[p.k]=parseFloat(inp.value); fmt();
        if(p.sys) buildSystem(); else if(p.rr) dirty=true; });
      fmt(); row.append(lab,inp); det.appendChild(row); });
    host.appendChild(det); });
  document.getElementById("seedField").addEventListener("change",e=>{seed=parseInt(e.target.value)||0;buildSystem();});
  document.getElementById("newSeed").addEventListener("click",()=>{seed=Math.floor(Math.random()*1e6);document.getElementById("seedField").value=seed;buildSystem();});
  document.getElementById("pause").addEventListener("click",e=>{ if(running){pauseT=(millis()-t0)/1000;running=false;e.target.textContent="play";}else{t0=millis()-pauseT*1000;running=true;e.target.textContent="pause";}});
  document.getElementById("save").addEventListener("click",()=>saveCanvas("noixzy_"+PIECE+"_"+seed,"png"));
  document.getElementById("pin").addEventListener("click",pinFav);
  document.getElementById("reset").addEventListener("click",()=>{const d={};PARAMS.forEach(p=>d[p.k]=p.v);applyConfig({seed:1,P:d});flash("reset","reset ✓");});
  document.getElementById("exportFavs").addEventListener("click",()=>{const txt=JSON.stringify(favs);
    if(navigator.clipboard)navigator.clipboard.writeText(txt).then(()=>flash("exportFavs","copied ✓"),()=>prompt("favorites:",txt)); else prompt("favorites JSON:",txt);});
  document.getElementById("clearFavs").addEventListener("click",()=>{if(confirm("clear all favorites?")){favs=[];saveFavs();renderFavs();}});
}
let favs=[];
function loadFavs(){ try{favs=JSON.parse(localStorage.getItem(FAVKEY)||"[]");}catch(e){favs=[];} renderFavs(); }
function saveFavs(){ try{localStorage.setItem(FAVKEY,JSON.stringify(favs));}catch(e){} }
function pinFav(){ favs.push({seed,P:JSON.parse(JSON.stringify(P))}); saveFavs(); renderFavs(); flash("pin","★ pinned"); }
function flash(id,msg){ const b=document.getElementById(id); const o=b.textContent; b.textContent=msg; setTimeout(()=>{b.textContent=o;},1100); }
function applyConfig(cfg){ if(cfg.seed!==undefined){seed=cfg.seed;document.getElementById("seedField").value=seed;}
  PARAMS.forEach(p=>{ if(cfg.P&&cfg.P[p.k]!==undefined){ P[p.k]=cfg.P[p.k];
    const el=document.getElementById("p_"+p.k); if(el)el.value=P[p.k];
    const sp=document.getElementById("v_"+p.k); if(sp)sp.textContent=(p.step>=1)?P[p.k]:(+P[p.k]).toFixed(2); }});
  buildSystem(); }
function renderFavs(){ const host=document.getElementById("favs"); if(!host)return; host.innerHTML="";
  document.getElementById("favBtns").style.display=favs.length?"flex":"none";
  favs.forEach((f,i)=>{ const chip=document.createElement("div"); chip.className="chip";
    const pal=PALETTES[Math.round(f.P.pal)||0];
    chip.innerHTML='<span class="sw" style="background:'+pal[1]+'"></span><b>★'+(i+1)+'</b><span class="x">×</span>';
    chip.addEventListener("click",e=>{ if(e.target.classList.contains("x"))return; applyConfig(f); });
    chip.querySelector(".x").addEventListener("click",()=>{favs.splice(i,1);saveFavs();renderFavs();});
    host.appendChild(chip); }); }
</script>
</body>
</html>
`;

// ---------------- per-piece definitions ----------------
const PIECES=[
{ id:"flow_field", title:"flow field",
  system:[{k:"density",label:"density",min:0,max:1,step:.01,v:.6},{k:"scale",label:"scale",min:0,max:1,step:.01,v:.4},{k:"turbulence",label:"turbulence",min:0,max:1,step:.01,v:.5},{k:"pal",label:"palette",min:0,max:9,step:1,v:0}],
  code:`
function build(){}
function render(g,pal){
  const n=floor(map(P.density,0,1,400,4500)), s=map(P.scale,0,1,0.0008,0.006), turb=map(P.turbulence,0,1,1,7);
  g.noStroke();
  for(let i=0;i<n;i++){ let x=random(g.width), y=random(g.height); const c=random()<0.5?pal[1]:pal[2];
    for(let j=0;j<70;j++){ g.fill(c[0],c[1],c[2],26); g.circle(x,y,1.4);
      const a=noise(x*s,y*s)*TWO_PI*turb; x+=cos(a)*1.6; y+=sin(a)*1.6;
      if(x<0||x>g.width||y<0||y>g.height) break; } }
}` },

{ id:"reaction_diffusion", title:"reaction diffusion",
  system:[{k:"feed",label:"feed",min:0,max:1,step:.01,v:.45},{k:"kill",label:"kill",min:0,max:1,step:.01,v:.55},{k:"spots",label:"seed spots",min:0,max:1,step:.01,v:.4},{k:"pal",label:"palette",min:0,max:9,step:1,v:4}],
  code:`
let RDA,RDB,RDG;
function build(){
  const G=RDG=200; let a=new Float32Array(G*G).fill(1),b=new Float32Array(G*G),a2=new Float32Array(G*G),b2=new Float32Array(G*G);
  const spots=floor(map(P.spots,0,1,4,40));
  for(let s=0;s<spots;s++){ const cx=floor(random(G)),cy=floor(random(G)),r=floor(random(3,8));
    for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){ if(x*x+y*y<=r*r){const px=(cx+x+G)%G,py=(cy+y+G)%G; b[px+py*G]=1;} } }
  const f=map(P.feed,0,1,0.018,0.062), k=map(P.kill,0,1,0.045,0.07);
  const ws=[[-1,0,.2],[1,0,.2],[0,-1,.2],[0,1,.2],[-1,-1,.05],[1,-1,.05],[-1,1,.05],[1,1,.05]];
  for(let it=0;it<2200;it++){ for(let y=1;y<G-1;y++)for(let x=1;x<G-1;x++){ const i=x+y*G; let la=-a[i],lb=-b[i];
      for(const w of ws){const j=i+w[0]+w[1]*G; la+=a[j]*w[2]; lb+=b[j]*w[2];}
      const ab=a[i]*b[i]*b[i];
      a2[i]=Math.min(1,Math.max(0,a[i]+la-ab+f*(1-a[i]))); b2[i]=Math.min(1,Math.max(0,b[i]+0.5*lb+ab-(k+f)*b[i])); }
    let t=a;a=a2;a2=t; t=b;b=b2;b2=t; }
  RDA=a; RDB=b;
}
function render(g,pal){ const G=RDG;
  const img=makeField(G,(x,y)=>{ const v=Math.min(1,Math.max(0,RDA[x+y*G]-RDB[x+y*G]));
    return [lerp(pal[2][0],pal[0][0],v),lerp(pal[2][1],pal[0][1],v),lerp(pal[2][2],pal[0][2],v)]; });
  g.image(img,0,0,g.width,g.height); }` },

{ id:"voronoi", title:"voronoi",
  system:[{k:"density",label:"density",min:0,max:1,step:.01,v:.4},{k:"relax",label:"relax",min:0,max:1,step:.01,v:.4},{k:"edgefill",label:"edge / fill",min:0,max:1,step:.01,v:.5},{k:"pal",label:"palette",min:0,max:9,step:1,v:0}],
  code:`
let VPTS;
function build(){ const n=floor(map(P.density,0,1,12,120)); let pts=[]; for(let i=0;i<n;i++)pts.push([random(1),random(1)]);
  const iters=floor(map(P.relax,0,1,0,6));
  for(let k=0;k<iters;k++){ const sx=pts.map(()=>0),sy=pts.map(()=>0),cn=pts.map(()=>0); const S=56;
    for(let yy=0;yy<S;yy++)for(let xx=0;xx<S;xx++){ const px=xx/S,py=yy/S; let bi=0,bd=1e9;
      for(let i=0;i<pts.length;i++){const dx=px-pts[i][0],dy=py-pts[i][1],d=dx*dx+dy*dy; if(d<bd){bd=d;bi=i;}}
      sx[bi]+=px;sy[bi]+=py;cn[bi]++; }
    pts=pts.map((p,i)=>cn[i]?[sx[i]/cn[i],sy[i]/cn[i]]:p); }
  VPTS=pts; }
function render(g,pal){ const N=260, pts=VPTS, ef=P.edgefill;
  const cols=pts.map((p,i)=> i%2?pal[1]:pal[2]);
  const img=makeField(N,(x,y)=>{ const px=x/N,py=y/N; let b0=1e9,b1=1e9,bi=0;
    for(let i=0;i<pts.length;i++){const dx=px-pts[i][0],dy=py-pts[i][1],d=dx*dx+dy*dy; if(d<b0){b1=b0;b0=d;bi=i;}else if(d<b1)b1=d;}
    const edge=Math.sqrt(b1)-Math.sqrt(b0);
    if(edge<map(ef,0,1,0.005,0.0010)) return pal[1];
    const c=cols[bi], t=ef*0.85; return [lerp(pal[0][0],c[0],t),lerp(pal[0][1],c[1],t),lerp(pal[0][2],c[2],t)]; });
  g.image(img,0,0,g.width,g.height); }` },

{ id:"contour_field", title:"contour field",
  system:[{k:"scale",label:"scale",min:0,max:1,step:.01,v:.4},{k:"levels",label:"levels",min:0,max:1,step:.01,v:.5},{k:"turbulence",label:"turbulence",min:0,max:1,step:.01,v:.4},{k:"pal",label:"palette",min:0,max:9,step:1,v:0}],
  code:`
function build(){}
function render(g,pal){ const R=Math.max(5,Math.floor(g.width/200)), C=Math.floor(g.width/R), Rj=Math.floor(g.height/R);
  const s=map(P.scale,0,1,0.002,0.012), turb=map(P.turbulence,0,1,1,4);
  const fv=(x,y)=>{let v=0,amp=1,fr=1; for(let o=0;o<4;o++){v+=noise(x*s*fr,y*s*fr)*amp;amp*=.5;fr*=1.6*turb;} return v;};
  const fld=[]; for(let j=0;j<=Rj;j++){const row=[];for(let i=0;i<=C;i++)row.push(fv(i*R,j*R));fld.push(row);}
  let mn=1e9,mx=-1e9; for(const r of fld)for(const v of r){mn=Math.min(mn,v);mx=Math.max(mx,v);}
  const L=floor(map(P.levels,0,1,5,26));
  const ix=(p,q,va,vb)=>{const t=(thr-va)/((vb-va)||1e-6);return [lerp(p[0],q[0],t),lerp(p[1],q[1],t)];};
  let thr=0;
  for(let l=1;l<L;l++){ thr=mn+(mx-mn)*l/L; const t=l/L;
    g.stroke(lerp(pal[1][0],pal[2][0],t),lerp(pal[1][1],pal[2][1],t),lerp(pal[1][2],pal[2][2],t)); g.strokeWeight(1.1);
    for(let j=0;j<Rj;j++)for(let i=0;i<C;i++){
      const a=fld[j][i],b=fld[j][i+1],c=fld[j+1][i+1],d=fld[j+1][i],x=i*R,y=j*R;
      const TL=[x,y],TR=[x+R,y],BR=[x+R,y+R],BL=[x,y+R];
      let st=(a>thr?8:0)|(b>thr?4:0)|(c>thr?2:0)|(d>thr?1:0);
      const e={top:ix(TL,TR,a,b),right:ix(TR,BR,b,c),bottom:ix(BL,BR,d,c),left:ix(TL,BL,a,d)};
      const sg=(p,q)=>g.line(p[0],p[1],q[0],q[1]);
      if(st===1||st===14)sg(e.left,e.bottom); else if(st===2||st===13)sg(e.bottom,e.right);
      else if(st===3||st===12)sg(e.left,e.right); else if(st===4||st===11)sg(e.top,e.right);
      else if(st===5){sg(e.left,e.top);sg(e.bottom,e.right);} else if(st===6||st===9)sg(e.top,e.bottom);
      else if(st===7||st===8)sg(e.left,e.top); else if(st===10){sg(e.left,e.bottom);sg(e.top,e.right);} } }
}` },

{ id:"truchet", title:"truchet",
  system:[{k:"density",label:"density",min:0,max:1,step:.01,v:.45},{k:"weight",label:"weight",min:0,max:1,step:.01,v:.4},{k:"clustering",label:"clustering",min:0,max:1,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:0}],
  code:`
function build(){}
function render(g,pal){ const n=floor(map(P.density,0,1,6,40)), cs=Math.min(g.width,g.height)/n;
  const cols=Math.ceil(g.width/cs), rows=Math.ceil(g.height/cs);
  g.noFill(); g.strokeWeight(map(P.weight,0,1,1,cs*0.4)); g.strokeCap(SQUARE);
  const clus=map(P.clustering,0,1,0.001,0.06);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){ const x=i*cs,y=j*cs;
    const bias=clus>0.001?noise(i*clus*12,j*clus*12):random(); const flip=bias<0.5; const c=(i+j)%2?pal[1]:pal[2];
    g.stroke(c[0],c[1],c[2]);
    if(flip){ g.arc(x,y,cs,cs,0,HALF_PI); g.arc(x+cs,y+cs,cs,cs,PI,PI+HALF_PI); }
    else { g.arc(x+cs,y,cs,cs,HALF_PI,PI); g.arc(x,y+cs,cs,cs,-HALF_PI,0); } } }` },

{ id:"l_system", title:"l-system",
  system:[{k:"depth",label:"depth",min:0,max:1,step:.01,v:.6},{k:"angle",label:"angle",min:0,max:1,step:.01,v:.35},{k:"decay",label:"decay",min:0,max:1,step:.01,v:.5},{k:"pal",label:"palette",min:0,max:9,step:1,v:0}],
  code:`
let LS;
function build(){ const rules=["FF+[+F-F-F]-[-F+F+F]","F[+F]F[-F]F","FF-[-F+F+F]+[+F-F-F]","F-[[F]+F]+F[+FF]-F"];
  const rule=rules[floor(random(rules.length))]; const depth=floor(map(P.depth,0,1,3,6)); let s="F";
  for(let d=0;d<depth;d++){let ns="";for(const ch of s)ns+=ch==="F"?rule:ch;s=ns;} LS={s,depth}; }
function render(g,pal){ const s=LS.s, depth=LS.depth; const ang=map(P.angle,0,1,0.12,0.55), decay=map(P.decay,0,1,0.62,0.84);
  let len=map(depth,3,6,140,16)*(g.height/820);
  g.push(); g.translate(g.width/2,g.height*0.92); g.noFill(); const stack=[]; let lw=2.4;
  for(const ch of s){ if(ch==="F"){ const t=Math.max(0,Math.min(1,lw/2.4));
      g.stroke(lerp(pal[2][0],pal[1][0],t),lerp(pal[2][1],pal[1][1],t),lerp(pal[2][2],pal[1][2],t)); g.strokeWeight(Math.max(0.4,lw));
      g.line(0,0,0,-len); g.translate(0,-len); }
    else if(ch==="+")g.rotate(ang); else if(ch==="-")g.rotate(-ang);
    else if(ch==="["){stack.push([len,lw]);g.push();len*=decay;lw*=0.78;}
    else if(ch==="]"){g.pop();const st=stack.pop();len=st[0];lw=st[1];} }
  g.pop(); }` },

{ id:"cellular_erosion", title:"cellular erosion",
  system:[{k:"fill",label:"fill",min:0,max:1,step:.01,v:.48},{k:"iterations",label:"iterations",min:0,max:1,step:.01,v:.5},{k:"grain",label:"grain",min:0,max:1,step:.01,v:.4},{k:"pal",label:"palette",min:0,max:9,step:1,v:4}],
  code:`
let CEG,CED,CEGR,CE_MX;
function build(){ const G=CEG=200; let grid=new Uint8Array(G*G);
  const fillP=map(P.fill,0,1,0.35,0.62), grn=map(P.grain,0,1,0,0.5);
  for(let y=0;y<G;y++)for(let x=0;x<G;x++){const nn=noise(x*0.05,y*0.05)*(1-grn)+random()*grn; grid[x+y*G]=nn<fillP?1:0;}
  const iters=floor(map(P.iterations,0,1,1,8));
  for(let k=0;k<iters;k++){ const o=new Uint8Array(G*G); for(let y=0;y<G;y++)for(let x=0;x<G;x++){let su=0,c=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=G||ny>=G)continue;su+=grid[nx+ny*G];c++;} o[x+y*G]=su>c/2?1:0;} grid=o;}
  let d=new Float32Array(G*G); for(let i=0;i<d.length;i++)d[i]=grid[i]?9999:0;
  for(let p=0;p<60;p++){let ch=false; for(let y=1;y<G-1;y++)for(let x=1;x<G-1;x++){const i=x+y*G;if(!grid[i])continue;const m=Math.min(d[i-1],d[i+1],d[i-G],d[i+G])+1;if(m<d[i]){d[i]=m;ch=true;}} if(!ch)break;}
  let mx=1; for(const v of d)mx=Math.max(mx,v); CEGR=grid; CED=d; CE_MX=mx; }
function render(g,pal){ const G=CEG;
  const img=makeField(G,(x,y)=>{ const i=x+y*G; if(!CEGR[i]) return [0,0,0,0]; const t=CED[i]/CE_MX;
    return [lerp(pal[1][0],pal[2][0],t),lerp(pal[1][1],pal[2][1],t),lerp(pal[1][2],pal[2][2],t)]; });
  g.image(img,0,0,g.width,g.height); }` },

{ id:"recursive_grid", title:"recursive grid",
  system:[{k:"depth",label:"depth",min:0,max:1,step:.01,v:.6},{k:"threshold",label:"threshold",min:0,max:1,step:.01,v:.5},{k:"jitter",label:"jitter",min:0,max:1,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:0}],
  code:`
let RGL;
function build(){ RGL=[]; const maxD=floor(map(P.depth,0,1,3,8)); rgsub(0,0,1,1,0,maxD); }
function rgsub(x,y,w,h,d,maxD){ const s=map(P.threshold,0,1,0.85,0.18), n=noise(x*4,y*4,d*0.5);
  if(d<maxD&&(d<1||n>s)&&w>0.02&&h>0.02){ const jt=map(P.jitter,0,1,0.5,0.2), fx=random(jt,1-jt),fy=random(jt,1-jt),mx=w*fx,my=h*fy;
    rgsub(x,y,mx,my,d+1,maxD); rgsub(x+mx,y,w-mx,my,d+1,maxD); rgsub(x,y+my,mx,h-my,d+1,maxD); rgsub(x+mx,y+my,w-mx,h-my,d+1,maxD); }
  else RGL.push({x,y,w,h,d,maxD,r:random()}); }
function render(g,pal){ for(const c of RGL){ const x=c.x*g.width,y=c.y*g.height,w=c.w*g.width,h=c.h*g.height,r=c.r;
  if(r<0.18)g.fill(pal[1][0],pal[1][1],pal[1][2]);
  else if(r<0.34)g.fill(lerp(pal[0][0],pal[2][0],.55),lerp(pal[0][1],pal[2][1],.55),lerp(pal[0][2],pal[2][2],.55));
  else g.noFill();
  g.stroke(lerp(pal[2][0],pal[0][0],.4),lerp(pal[2][1],pal[0][1],.4),lerp(pal[2][2],pal[0][2],.4)); g.strokeWeight(map(c.d,0,c.maxD,2,0.6));
  g.rect(x+1.5,y+1.5,w-3,h-3); } }` },

{ id:"sdf", title:"sdf field",
  system:[{k:"count",label:"count",min:0,max:1,step:.01,v:.5},{k:"blend",label:"blend",min:0,max:1,step:.01,v:.5},{k:"warp",label:"warp",min:0,max:1,step:.01,v:.35},{k:"pal",label:"palette",min:0,max:9,step:1,v:0}],
  code:`
let SDFB;
function build(){ const n=floor(map(P.count,0,1,3,12)); SDFB=[]; for(let i=0;i<n;i++)SDFB.push([random(.18,.82),random(.18,.82),random(.06,.15)]); }
function render(g,pal){ const N=300, blobs=SDFB, k=map(P.blend,0,1,0.02,0.12), warp=P.warp, light=[-0.5,-0.72];
  const field=(px,py)=>{ let d=Math.hypot(px-blobs[0][0],py-blobs[0][1])-blobs[0][2];
    for(let i=1;i<blobs.length;i++){const sd=Math.hypot(px-blobs[i][0],py-blobs[i][1])-blobs[i][2];
      const h=Math.max(0,Math.min(1,0.5+0.5*(sd-d)/k)); d=sd*(1-h)+d*h-k*h*(1-h);} return d; };
  const baseDark=[lerp(pal[0][0],pal[1][0],.3),lerp(pal[0][1],pal[1][1],.3),lerp(pal[0][2],pal[1][2],.3)];
  const img=makeField(N,(X,Y)=>{ let px=X/N,py=Y/N;
    if(warp>0){ px+=warp*0.06*(noise(px*6,py*6)-0.5); py+=warp*0.06*(noise(px*6+9,py*6+9)-0.5); }
    const f=field(px,py); if(f>=0) return [0,0,0,0];
    const e=1/N; const gx=field(px+e,py)-field(px-e,py), gy=field(px,py+e)-field(px,py-e); const gl=Math.hypot(gx,gy)||1;
    const dif=Math.max(0,(gx/gl)*light[0]+(gy/gl)*light[1])*0.9+0.12; const rim=Math.pow(1-Math.min(1,-f/0.12),3);
    let r=lerp(baseDark[0],pal[1][0],dif), gg=lerp(baseDark[1],pal[1][1],dif), bb=lerp(baseDark[2],pal[1][2],dif);
    r=lerp(r,pal[2][0],rim*0.4); gg=lerp(gg,pal[2][1],rim*0.4); bb=lerp(bb,pal[2][2],rim*0.4);
    return [r,gg,bb]; });
  g.image(img,0,0,g.width,g.height); }` },
];

// ---------------- write files ----------------
const ROOT=__dirname;
for(const cfg of PIECES){
  const dir=path.join(ROOT,cfg.id);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,"noixzy_"+cfg.id+".html"), ENGINE(cfg));
  console.log("wrote",cfg.id);
}
console.log("done:",PIECES.length,"pieces");
