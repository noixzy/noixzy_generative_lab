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
<link rel="icon" href="data:,">
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
<style>
  :root { --bg:#0e0e10; --panel:#1a1a1d; --ink:#e8e8ea; --accent:#ed5700; --dim:#7a7a7e; }
html,body { margin:0; height:100%; background:var(--bg); color:var(--ink); font:13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace; }
body { display:flex; flex-direction:column; }
/* App layout: stage (flexible) + panel (fixed-width side panel). */
.app { display:flex; flex-direction:row; align-items:stretch; flex:1; min-height:0; }
.stage { position:relative; flex:1 1 auto; min-width:0; background:#000; }
.stage canvas { display:block; width:100%; height:100%; }
.panel { position:relative; width:316px; min-width:300px; max-width:min(420px,44vw); box-sizing:border-box; margin:14px; max-height:calc(100vh - 56px); overflow-y:auto;
           background:rgba(16,16,20,0.58); -webkit-backdrop-filter:blur(13px); backdrop-filter:blur(13px);
         border:1px solid rgba(255,255,255,0.09); padding:12px 14px; border-radius:9px; box-shadow:0 10px 34px rgba(0,0,0,0.45); }
.panel.hidden { opacity:0; pointer-events:none; }
.panel h1 { font-size:13px; letter-spacing:.12em; text-transform:lowercase; margin:0 0 6px; color:var(--accent); }
details { border-top:1px solid #262629; padding:6px 0; }
details[open] summary { color:var(--accent); }
summary { cursor:pointer; list-style:none; padding:4px 0; letter-spacing:.1em; text-transform:uppercase; font-size:11px; color:var(--dim); }
summary::-webkit-details-marker { display:none; }
summary::before { content:"+ "; } details[open] summary::before { content:"– "; }
.row { margin:7px 0; }
.row label { display:flex; justify-content:space-between; margin-bottom:3px; opacity:.85; }
input[type=range] { width:100%; height:22px; accent-color:var(--accent); cursor:pointer; }
input[type=range]::-webkit-slider-runnable-track { height:4px; border-radius:2px; }
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
.colorRow { display:flex; justify-content:space-between; align-items:center; margin:7px 0; }
.colorRow label { opacity:.85; font-size:12px; }
input[type=color] { width:44px; height:26px; padding:1px; border:1px solid #333; background:#000; border-radius:3px; cursor:pointer; }
input[type=color]:hover { border-color:var(--accent); }
select { background:#000; color:var(--ink); border:1px solid #333; padding:5px 6px; font:inherit; border-radius:4px; cursor:pointer; }
select:hover { border-color:var(--accent); }
#kbHelp { position:fixed; inset:0; background:rgba(0,0,0,0.72); display:none; align-items:center; justify-content:center; z-index:998; }
.kbCard { min-width:260px; max-width:min(420px,calc(100vw - 40px)); background:rgba(16,16,20,0.92); color:var(--ink); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:18px 20px; box-shadow:0 18px 48px rgba(0,0,0,0.5); }
.kbCard h2 { margin:0 0 14px; color:var(--accent); font-size:13px; letter-spacing:.12em; text-transform:lowercase; }
.kbGrid { display:grid; grid-template-columns:auto 1fr; gap:7px 18px; font-size:12px; }
.kbGrid b { color:var(--accent); font-weight:400; white-space:pre; }
.pbrOverlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:999; cursor:pointer; }
.pbrGrid { display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:18px; background:rgba(16,16,20,0.95); border:1px solid rgba(255,255,255,0.09); border-radius:9px; }
.pbrCell { display:flex; flex-direction:column; align-items:center; gap:5px; }
.pbrCell img { width:220px; height:220px; object-fit:cover; border-radius:4px; border:1px solid #333; display:block; }
.pbrCell span { font-size:11px; letter-spacing:.1em; text-transform:uppercase; opacity:.55; }
.pbrHint { grid-column:1/-1; text-align:center; font-size:11px; opacity:.4; margin-top:4px; }
/* Responsive: stack panel below preview on narrow screens */
@media (max-width:900px){ .app{flex-direction:column;} .panel{width:100%; margin:0; max-height:40vh;} .stage{height:calc(100vh - 40vh);} }
/* Module nav bar */
.navBar { flex:0 0 28px; display:flex; align-items:center; justify-content:space-between; padding:0 12px; background:#0a0a0c; border-bottom:1px solid #1c1c1f; z-index:10; }
.navBar a { color:var(--dim); text-decoration:none; font-size:11px; letter-spacing:.07em; padding:4px 6px; border-radius:3px; }
.navBar a:hover { color:var(--accent); }
.navCurrent { color:var(--accent) !important; }
/* Stage overlay — bottom toolbar */
.stageFavs { position:absolute; left:50%; bottom:64px; transform:translateX(-50%); z-index:22; display:flex; justify-content:center; flex-wrap:wrap; gap:6px; max-width:min(72vw,720px); pointer-events:auto; }
.stageFavs .chip { margin:0; }
#favs { display:none !important; }
.stageTools { position:absolute; left:50%; bottom:14px; transform:translateX(-50%); z-index:21; display:flex; align-items:center; gap:10px; padding:7px 10px; border-radius:12px; background:rgba(0,0,0,0.52); border:1px solid rgba(255,255,255,0.14); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); box-shadow:0 10px 30px rgba(0,0,0,0.35); }
.stageToolGroup { display:flex; align-items:center; gap:6px; }
.stageTools button,.stageTools select { min-height:30px; background:rgba(0,0,0,0.50); border-color:rgba(255,255,255,0.14); padding:4px 8px; margin:0; white-space:nowrap; }
.stageTools select { width:auto; min-width:52px; }
/* Stage overlay — left module rail */
.stageThumbs { pointer-events:auto; position:absolute; left:14px; top:50%; transform:translateY(-50%); z-index:20; width:70px; max-height:min(640px,74vh); padding:8px; border-radius:12px; background:rgba(0,0,0,0.50); border:1px solid rgba(72,223,255,0.18); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); opacity:.42; transition:opacity .22s ease; display:flex; flex-direction:column; gap:6px; }
.stageThumbs:hover { opacity:1; }
.stageThumbs .label { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--dim); margin-bottom:2px; }
.thumbScrollBtn { border:1px solid rgba(72,223,255,0.3); background:rgba(0,0,0,.46); color:var(--accent); border-radius:5px; height:22px; cursor:pointer; padding:0; }
.thumbScrollBtn:hover { border-color:var(--accent); }
.thumbRow { display:flex; flex-direction:column; gap:6px; max-height:min(500px,58vh); overflow-y:auto; overflow-x:hidden; padding:0; scrollbar-width:none; }
.thumbRow::-webkit-scrollbar { display:none; }
.navThumb { flex:0 0 auto; opacity:.55; transition:opacity .15s; }
.navThumb:hover,.navThumb.active,.navThumb.selected { opacity:1; }
.navThumb img { width:50px; height:38px; object-fit:cover; border-radius:4px; border:1px solid #2a2a2d; display:block; }
.navThumb.active img { border-color:#fff; box-shadow:0 0 0 1px rgba(255,255,255,0.55); }
.navThumb.selected img { border-color:var(--accent); }
/* Panel console controls */
.consoleLabel { margin-top:10px; color:var(--dim); font-size:11px; letter-spacing:.1em; text-transform:uppercase; }
.cycleLine { display:grid; grid-template-columns:30px minmax(0,1fr) 30px; gap:6px; align-items:center; margin-bottom:8px; }
.cycleLine select { width:100%; margin:0; }
.cycleBtn { min-width:30px; padding-left:0; padding-right:0; }
.consoleRule { height:1px; background:color-mix(in srgb, var(--accent) 36%, transparent); margin:16px 0 14px; opacity:.72; }
.consoleBtns { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.consoleBtns button { flex:1 1 calc(33.333% - 8px); min-width:82px; }
.presetStatus { margin-top:8px; min-height:16px; color:var(--dim); font-size:11px; letter-spacing:.04em; }
.presetLine { display:grid; grid-template-columns:minmax(0,1fr) 96px; gap:8px; margin-top:8px; }
.presetLine.triple { grid-template-columns:minmax(0,1fr) 72px 82px; }
.presetLine input,.presetLine select {
  width:100%; min-width:0; box-sizing:border-box; background:#000; color:var(--ink);
  border:1px solid #333; border-radius:4px; padding:5px 6px; font:inherit;
}
.presetLine input::placeholder { color:var(--dim); opacity:1; }
.seedLabel { display:block; line-height:1.12; }
.seedRead { display:block; margin-top:4px; color:var(--dim); font-size:10px; line-height:1; letter-spacing:.08em; }
</style>
</head>
<body>
<div class="navBar">
  <a id="navPrev" href="#">← prev</a>
  <a href="../gallery/index.html" class="navCurrent">⊞ gallery</a>
  <a id="navNext" href="#">next →</a>
</div>
<div class="app">
  <div class="stage" id="stage">
    <div id="stageFavs" class="stageFavs"></div>
    <div class="stageTools" id="stageTools">
      <div class="stageToolGroup">
        <button id="pin" type="button" onclick="pinFav();return false;">★ pin</button>
        <button id="exportFavs">export ★</button>
        <button id="copyP">copy</button>
        <button id="pasteP">paste</button>
      </div>
      <div class="stageToolGroup">
        <button id="btnAudio">audio</button>
        <button id="clearFavs">clear ★</button>
      </div>
      <div class="stageToolGroup">
        <button id="thumb">→ thumb</button>
        <button id="rec">video</button>
        <select id="recDur" title="video duration"><option value="2">2s</option><option value="4" selected>4s</option><option value="8">8s</option><option value="16">16s</option></select>
        <button id="save">save png</button>
        <button id="save2x">save 2x</button>
        <button id="savePBR">pbr</button>
      </div>
    </div>
    <div class="stageThumbs" id="stageThumbs">
      <div class="label">modules</div>
      <button id="thumbUp" class="thumbScrollBtn" type="button">▲</button>
      <div class="thumbRow" id="moduleThumbStrip"></div>
      <button id="thumbDown" class="thumbScrollBtn" type="button">▼</button>
    </div>
  </div>
  <div class="panel">
  <h1>noixzy // ${cfg.title}</h1>
  <div id="themeDet">
    <div class="consoleLabel">theme</div>
    <div class="cycleLine">
      <button id="themePrev" class="cycleBtn" type="button">‹</button>
      <select id="themeSelect">
        <option value="ember">ember</option>
        <option value="teal">teal</option>
        <option value="violet">violet</option>
        <option value="amber">amber</option>
        <option value="graphite" selected>graphite</option>
        <option value="cyan">cyan</option>
        <option value="acid">acid</option>
        <option value="magenta">magenta</option>
        <option value="gold">gold</option>
        <option value="neutral">neutral</option>
      </select>
      <button id="themeNext" class="cycleBtn" type="button">›</button>
    </div>
    <div class="consoleRule"></div>
    <div class="consoleBtns">
      <button id="randomAll" type="button">randomize<br>unlocked</button>
      <button id="randomForm" type="button">randomize<br>form</button>
      <button id="randomColor" type="button">randomize<br>color</button>
      <button id="newSeed" type="button"><span class="seedLabel">new<br>seed</span><span id="vSeed" class="seedRead">—</span></button>
      <button id="reset" type="button">reset</button>
      <button id="pause" type="button">pause</button>
    </div>
    <div class="presetLine">
      <input id="presetName" type="text" placeholder="preset name">
      <button id="savePreset" type="button">save preset</button>
    </div>
    <div class="presetLine triple">
      <select id="localPreset"><option>no local presets</option></select>
      <button id="loadPreset" type="button">load</button>
      <button id="deletePreset" type="button">delete</button>
    </div>
    <div id="presetStatus" class="presetStatus"></div>
  </div>
  <div class="seed" style="display:none;"><input id="seedField" type="number" value="1"><span id="seedRead" style="opacity:.55;font-size:11px;">1</span></div>
  <div id="groups"></div>
  <details id="colorDet"><summary>color</summary>
    <div class="colorRow"><label>bg</label><input type="color" id="p_bgc"></div>
    <div class="colorRow"><label>accent</label><input type="color" id="p_acc"></div>
    <div class="colorRow"><label>ink</label><input type="color" id="p_ink"></div>
  </details>
  <div id="audioPanel" style="display:none;margin-top:10px;padding:8px;background:#111;border-radius:6px;font-size:12px;">
    <div id="audioDropZone" style="border:1px dashed #444;border-radius:5px;padding:10px 8px;text-align:center;cursor:pointer;margin-bottom:8px;color:var(--dim);transition:border-color .2s;">
      drop audio file &nbsp;·&nbsp; <span style="color:var(--accent);">click to browse</span>
      <input type="file" id="audioFileInput" accept="audio/*" style="display:none;">
    </div>
    <div id="audioStatus" style="display:none;align-items:center;gap:8px;margin-bottom:8px;">
      <button id="audioPlayPause" style="font-size:13px;padding:2px 8px;">▶</button>
      <span id="audioFilename" style="color:var(--dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;"></span>
      <button id="btnMic" title="mic input" style="font-size:10px;padding:2px 6px;opacity:.6;">mic</button>
    </div>
    <div style="color:var(--accent);margin-bottom:6px;letter-spacing:.08em;">audio → params</div>
    <div id="audioBands"></div>
  </div>
  <div id="favs" class="favs"></div>
  <div class="read" style="margin-top:10px;opacity:.4;font-size:11px;">h hide · s save · ? help</div>
</div>
<div id="kbHelp" aria-hidden="true"><div class="kbCard"><h2>keyboard shortcuts</h2><div class="kbGrid"><b>h</b><span>hide / show panel</span><b>?</b><span>this help</span><b>space</b><span>pause / play</span><b>[ / ]</b><span>cycle theme</span><b>s</b><span>save png</span></div></div></div>
<script>
let W=820,H=820; const PIECE="${cfg.id}", FAVKEY="noixzy_"+PIECE+"_favs";
let seed=1, running=true, t0, pauseT=0, dirty=true;
let raw, scene, glowBuf, vigTex, specTex;
let animT=0;
let audioCtx,analyser,audioData,audioActive=false;
const ABANDS={bass:0,mid:0,high:0,presence:0};
const AMAP={bass:null,mid:null,high:null,presence:null};
const ADEPTH={bass:0.5,mid:0.5,high:0.5,presence:0.5};
let _audioSaved={};

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
  {k:"cx",      g:"frame",   label:"center x", min:-1,max:1,step:.01,v:0},
  {k:"cy",      g:"frame",   label:"center y", min:-1,max:1,step:.01,v:0},
  {k:"mirror",  g:"frame",   label:"symmetry", min:0,max:2,step:1,v:0,rr:true},
  {k:"contrast",g:"look",    label:"contrast", min:0,max:1,step:.01,v:.4},
  {k:"vig",     g:"look",    label:"vignette", min:0,max:1,step:.01,v:.4},
  {k:"glow",    g:"look",    label:"glow",     min:0,max:1,step:.01,v:.25},
  {k:"speed",   g:"motion",  label:"speed",    min:0,max:1,step:.01,v:.18},
  {k:"drift",   g:"motion",  label:"drift",    min:0,max:1,step:.01,v:.12},
];
SYSTEM.forEach(p=>{ p.g=p.g||"system"; if(!p.rr) p.sys=true; });
const PARAMS=SYSTEM.concat(SHARED);
const P={}; PARAMS.forEach(p=>P[p.k]=p.v);
const GROUPS=["system","extrude","material","frame","look","motion"];

const PALETTES=[
  ["#0e0e10","#5a2400","#ed8a3a"],  // 0 ember
  ["#071414","#0f403a","#7fe0c2"],  // 1 mineral
  ["#100c18","#2c2660","#b7b0ff"],  // 2 violet
  ["#140d06","#5a3414","#f0c890"],  // 3 amber
  ["#0c0c0c","#3a3a3a","#f2f2f2"],  // 4 graphite
  ["#071018","#103f5a","#72d8ff"],  // 5 cyan
  ["#0a1207","#2d4f13","#c7ff4a"],  // 6 acid
  ["#16070e","#5a1232","#ff6aa6"],  // 7 magenta
  ["#15100a","#6b4514","#ffe0a0"],  // 8 gold
  ["#0f1115","#222b34","#b7c1ca"]]  // 9 neutral
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
let colorState={bg:"",acc:"",ink:""};
function initColorState(i){
  const p=PALETTES[Math.min(PALETTES.length-1,Math.max(0,Math.round(i)||0))];
  colorState={bg:p[0],acc:p[1],ink:p[2]};
}
function getPal(){ return [hx(colorState.bg),hx(colorState.acc),hx(colorState.ink)]; }
function syncColorUI(){
  const b=document.getElementById("p_bgc"),a=document.getElementById("p_acc"),k=document.getElementById("p_ink");
  if(b)b.value=colorState.bg; if(a)a.value=colorState.acc; if(k)k.value=colorState.ink;
}
const THEMES=[
  {name:"ember",   accent:"#ed5700", bg:"#0e0e10", ink:"#e8e8ea", dim:"#7a7a7e"},
  {name:"teal",    accent:"#7fe0c2", bg:"#071414", ink:"#d8f4ee", dim:"#6a8a84"},
  {name:"violet",  accent:"#b7b0ff", bg:"#100c18", ink:"#e0deff", dim:"#7a7490"},
  {name:"amber",   accent:"#f0c890", bg:"#140d06", ink:"#f5e8d0", dim:"#8a7a60"},
  {name:"graphite",accent:"#c8c8c8", bg:"#0c0c0c", ink:"#f2f2f2", dim:"#7a7a7a"},
  {name:"cyan",    accent:"#72d8ff", bg:"#071018", ink:"#d0eeff", dim:"#5a7888"},
  {name:"acid",    accent:"#c7ff4a", bg:"#0a1207", ink:"#e0ffc0", dim:"#6a8040"},
  {name:"magenta", accent:"#ff6aa6", bg:"#16070e", ink:"#ffd0e4", dim:"#8a5068"},
  {name:"gold",    accent:"#ffe0a0", bg:"#15100a", ink:"#fff0d0", dim:"#8a7850"},
  {name:"neutral", accent:"#b7c1ca", bg:"#0f1115", ink:"#d8dde2", dim:"#6a7078"},
];
const THEMEKEY="noixzy_lab_theme";
let activeTheme=null;
function applyTheme(name){
  const idx=THEMES.findIndex(t=>t.name===name);
  const th=THEMES[idx]; if(!th) return;
  activeTheme=name;
  const r=document.documentElement.style;
  r.setProperty('--accent',th.accent);
  r.setProperty('--bg',th.bg);
  r.setProperty('--ink',th.ink);
  r.setProperty('--dim',th.dim);
  const sel=document.getElementById('themeSelect'); if(sel)sel.value=name;

  if(idx>=0 && typeof P!=="undefined"){
    P.pal=idx;
    initColorState(idx);
    syncColorUI();
    const palEl=document.getElementById("p_pal"); if(palEl) palEl.value=idx;
    const palRead=document.getElementById("v_pal"); if(palRead) palRead.textContent=idx;
    if(typeof buildSystem==="function") buildSystem();
  }

  try{localStorage.setItem(THEMEKEY,name);}catch(e){}
}
function cycleTheme(dir){
  const idx=THEMES.findIndex(t=>t.name===activeTheme);
  applyTheme(THEMES[((idx<0?0:idx)+dir+THEMES.length)%THEMES.length].name);
}
function makeField(N,fn){ const img=createImage(N,N); img.loadPixels();
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){ const c=fn(x,y); const i=4*(y*N+x);
    img.pixels[i]=c[0];img.pixels[i+1]=c[1];img.pixels[i+2]=c[2];img.pixels[i+3]=c.length>3?c[3]:255; }
  img.updatePixels(); return img; }

// Nearest-neighbour pixel-size quantisation for heightfields.
// Fades heights to zero within 15% of each edge, with a smooth 15–30% transition.
// Call before _pxQ in every heightField() so borders stay flat.
function _edgeMask(out,G){ const G1=G-1;
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    const u=i/G1, v=j/G1;
    const e=Math.min(u,v,1-u,1-v);
    const m=e<0.15?0:e<0.30?(e-0.15)/0.15:1;
    out[i+j*G]*=m;
  }
}

// Downsamples out[G×G] to cells×cells then upsamples back, creating hard-edged iso blocks.
// Call at the end of any heightField() that exposes a P.pix param.
function _pxQ(out,G){ const c=Math.max(4,Math.floor(map(P.pix||0,0,1,G,4))); if(c>=G-1) return;
  const r=new Float32Array(c*c);
  for(let j=0;j<c;j++)for(let i=0;i<c;i++){ const si=Math.min(G-1,Math.floor((i+.5)/c*G)),sj=Math.min(G-1,Math.floor((j+.5)/c*G)); r[i+j*c]=out[si+sj*G]; }
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){ const ci=Math.min(c-1,Math.floor(i/G*c)),cj=Math.min(c-1,Math.floor(j/G*c)); out[i+j*G]=r[ci+cj*c]; } }

// Shared isometric heightfield renderer — oblique iso, sign-aware
function renderHeightfield(g,heights,G,pal,opts={}){
  const MAX_DEPTH=Math.min(g.width,g.height)*0.28;
  const cW=g.width/G, cH=g.height/G;
  const shn=Math.min(1,P.metallic*(1-P.rough)+P.sheen);
  // Apply visual z-depth first, then extrude from the staged plane.
  // Most new modules use P.zdepth. contour_field keeps its original P.depth slider.
  const zDep=(P.zdepth!==undefined)?P.zdepth:((typeof PIECE!=="undefined"&&PIECE==="contour_field"&&P.depth!==undefined)?P.depth:0);
  const cx=g.width/2, cy=g.height/2;
  // Support new extrude group params (height/hvar/light) with fallback to legacy P.extrude
  const hasNew=(P.height!==undefined);
  const extH=hasNew?P.height:Math.abs(P.extrude||0);
  const extVar=hasNew?(P.hvar!==undefined?P.hvar:0.5):0.8;
  const lF=hasNew?lerp(0.25,0.85,P.light!==undefined?P.light:0.5):0.55;
  const neg=hasNew?false:(P.extrude||0)<0;
  g.noStroke();
  for(let jj=0;jj<G;jj++){ for(let ii=0;ii<G;ii++){
    const j=neg?G-1-jj:jj, i=neg?G-1-ii:ii;
    const h=heights[i+j*G]||0; if(h<=0.001) continue;
    const hEff=extH*lerp(1.0,h,extVar);
    const z=hEff*MAX_DEPTH;
    const bx0=i*cW, by0=j*cH, bx1=bx0+cW, by1=by0+cH;
    const tf=(j+0.5)/G, zp=tf*2-1;
    const planeS=Math.abs(zDep)>0.01?1-zp*0.36*zDep:1;
    const planeY=Math.abs(zDep)>0.01?zp*cy*0.34*zDep:0;
    const stage=(x,y)=>[cx+(x-cx)*planeS, cy+(y-cy)*planeS+planeY];
    const A=stage(bx0,by0), B=stage(bx1,by0), C=stage(bx1,by1), D=stage(bx0,by1);
    const ox=(neg?-1:1)*z*0.5*(0.85+0.15*planeS), oy=(neg?1:-1)*z*(0.85+0.15*planeS);
    const x0=A[0], y0=A[1], x1=B[0], y1=B[1], x2=C[0], y2=C[1], x3=D[0], y3=D[1];
    const tx0=x0+ox, ty0=y0+oy, tx1=x2+ox, ty1=y2+oy;
    const tA=[x0+ox,y0+oy], tB=[x1+ox,y1+oy], tC=[x2+ox,y2+oy], tD=[x3+ox,y3+oy];
    const t=Math.min(1,h*(1+0.25*shn));
    const tc=[lerp(pal[1][0],pal[2][0],t),lerp(pal[1][1],pal[2][1],t),lerp(pal[1][2],pal[2][2],t)];
    if(neg){
      g.fill(tc[0]*lF,tc[1]*lF,tc[2]*lF);
      g.quad(x0,y0, tA[0],tA[1], tD[0],tD[1], x3,y3);
      g.fill(tc[0]*lF*0.7,tc[1]*lF*0.7,tc[2]*lF*0.7);
      g.quad(x0,y0, x1,y1, tB[0],tB[1], tA[0],tA[1]);
    }else{
      g.fill(tc[0]*lF,tc[1]*lF,tc[2]*lF);
      g.quad(x1,y1, tB[0],tB[1], tC[0],tC[1], x2,y2);
      g.fill(tc[0]*lF*0.7,tc[1]*lF*0.7,tc[2]*lF*0.7);
      g.quad(x3,y3, x2,y2, tC[0],tC[1], tD[0],tD[1]);
    }
    g.fill(tc[0],tc[1],tc[2]);
    g.quad(tA[0],tA[1], tB[0],tB[1], tC[0],tC[1], tD[0],tD[1]);
    if(P.caps>=1){
      const cx=tx0+cW*0.5, cy=ty0+cH*0.5;
      const hl=Math.min(1.35,1.05+(1-h)*0.22);
      g.fill(Math.min(255,tc[0]*hl),Math.min(255,tc[1]*hl),Math.min(255,tc[2]*hl));
      if(P.caps>=2){
        // level 2: full 360° sphere sitting on the column top
        g.ellipse(cx, cy-cH*0.55, cW, cW);
        const sx=Math.min(255,tc[0]*1.85),sy=Math.min(255,tc[1]*1.85),sz=Math.min(255,tc[2]*1.85);
        g.fill(sx,sy,sz,190);
        g.ellipse(cx-cW*0.14, cy-cH*1.02, cW*0.28, cH*0.22);
      } else {
        // level 1: 180° semicircle dome
        g.arc(cx,cy,cW,cH*2.2,Math.PI,Math.PI*2,'chord');
      }
    }
  }}
}


/* ================= PIECE CODE ================= */
${cfg.code}
/* ============================================== */

function setup(){
  const container=document.getElementById("stage"); const c=createCanvas(container.clientWidth,container.clientHeight); c.parent("stage"); pixelDensity(1);
  W=width; H=height; allocBuffers(); t0=millis();
  buildSystem();
  try{ buildUI(); }catch(e){ console.warn('buildUI failed during setup',e); }
  buildNav();
  loadFavs();
  applyTheme(localStorage.getItem(THEMEKEY)||'graphite');
  // If this is the SDF piece, ensure it has minimal motion defaults so it animates on load
  if(PIECE=="sdf"){
    if((P.speed===0||P.speed===undefined) && (P.drift===0||P.drift===undefined)){
      P.speed=0.18; P.drift=0.12;
    }
    // sync UI controls to reflect these defaults
    setTimeout(()=>{
      try{
        const s=document.getElementById('p_speed'); if(s) s.value = P.speed;
        const vs=document.getElementById('v_speed'); if(vs) vs.textContent = (P.speed).toFixed(2);
        const d=document.getElementById('p_drift'); if(d) d.value = P.drift;
        const vd=document.getElementById('v_drift'); if(vd) vd.textContent = (P.drift).toFixed(2);
      }catch(e){}
    },80);
  }
  // Reaction diffusion: reduce default glow so texture edges stay crisp.
  if(PIECE=="reaction_diffusion"){
    if(P.glow!==undefined) P.glow=0.05;
    setTimeout(()=>{
      try{
        const g=document.getElementById('p_glow'); if(g) g.value = P.glow;
        const vg=document.getElementById('v_glow'); if(vg) vg.textContent = (P.glow).toFixed(2);
      }catch(e){}
    },80);
  }

  // ensure first frame renders and t0 is valid
  try{ t0 = isFinite(t0)? t0 : millis(); renderScene(); dirty=false; }catch(e){ console.warn('initial render failed',e); }
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") toggleKbHelp(false); });
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
}
function windowResized(){ const container=document.getElementById("stage"); resizeCanvas(container.clientWidth,container.clientHeight); W=width; H=height; allocBuffers(); buildSystem(); }
function toggleKbHelp(show){
  const el=document.getElementById("kbHelp"); if(!el)return;
  const on=show===undefined ? el.style.display!=="flex" : !!show;
  el.style.display=on?"flex":"none";
  el.setAttribute("aria-hidden",on?"false":"true");
}
function togglePause(){
  const b=document.getElementById("pause");
  if(running){pauseT=(millis()-t0)/1000;running=false;if(b)b.textContent="play";}
  else{t0=millis()-pauseT*1000;running=true;if(b)b.textContent="pause";}
}
function triggerSavePNG(){ saveCanvas("noixzy_"+PIECE+"_"+seed,"png"); }
let _thumbDir=null;
async function saveThumb(){
  try{
    if(!_thumbDir) _thumbDir=await window.showDirectoryPicker({mode:"readwrite",startIn:"downloads"});
    const c=document.createElement("canvas"); c.width=400; c.height=300;
    const ctx=c.getContext("2d"); ctx.drawImage(document.querySelector("canvas"),0,0,400,300);
    const blob=await new Promise(res=>c.toBlob(res,"image/png"));
    const fh=await _thumbDir.getFileHandle(PIECE+".png",{create:true});
    const w=await fh.createWritable(); await w.write(blob); await w.close();
    const btn=document.getElementById("thumb");
    if(btn){btn.textContent="✓ saved";setTimeout(()=>btn.textContent="→ thumb",1400);}
  }catch(e){
    if(e.name!=="AbortError"){
      // fallback: plain download if File System Access not supported
      const c=document.createElement("canvas"); c.width=400; c.height=300;
      const ctx=c.getContext("2d"); ctx.drawImage(document.querySelector("canvas"),0,0,400,300);
      c.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=PIECE+".png";a.click();},"image/png");
    }
  }
}
function keyPressed(){ const tag=document.activeElement&&document.activeElement.tagName;
  if(tag==="INPUT"||tag==="SELECT")return;
  if(key==="?"||(key==="/"&&keyIsDown(SHIFT))){ toggleKbHelp(); return false; }
  if(key==="Escape"){ toggleKbHelp(false); return false; }
  if(key==="h"||key==="H") document.querySelector(".panel").classList.toggle("hidden");
  if(key===" "||keyCode===32){ togglePause(); return false; }
  if(key==="s"||key==="S"){ triggerSavePNG(); return false; }
  if(key==="[") cycleTheme(-1); if(key==="]") cycleTheme(1); }

const ALL_MODULES=[
  {id:"grid_extrude",title:"grid extrude"},{id:"sdf_raymarch",title:"sdf raymarch"},
  {id:"gyroid",title:"gyroid"},{id:"displacement",title:"displacement"},
  {id:"displacement_primitives",title:"displacement primitives"},
  {id:"mandelbulb",title:"mandelbulb"},{id:"fold",title:"fold"},
  {id:"metafluid",title:"metafluid"},
  {id:"moire_field",title:"moire field"},{id:"particle_orbitals",title:"particle orbitals"},
  {id:"radial_noise",title:"radial noise"},
  {id:"topographic_rings",title:"topographic rings"},{id:"ribbon_flow",title:"ribbon flow"},
  {id:"glyph_field",title:"glyph field"},
  {id:"crystal_growth",title:"crystal growth"},{id:"vector_scope",title:"vector scope"},
  {id:"wave_lattice",title:"wave lattice"},
  {id:"fractal_tiles",title:"fractal tiles"},{id:"plasma_membrane",title:"plasma membrane"},
  {id:"flow_field",title:"flow field"},{id:"reaction_diffusion",title:"reaction diffusion"},
  {id:"voronoi",title:"voronoi"},{id:"contour_field",title:"contour field"},
  {id:"truchet",title:"truchet"},{id:"truchet_b",title:"truchet // color"},
  {id:"l_system",title:"l-system"},{id:"cellular_erosion",title:"cellular erosion"},
  {id:"recursive_grid",title:"recursive grid"},{id:"wave_interference",title:"wave interference"},
  {id:"stipple",title:"stipple"},
  {id:"hex_grid",title:"hex grid"},{id:"rose_curve",title:"rose curve"},
  {id:"lissajous_mesh",title:"lissajous mesh"},{id:"torus_knot",title:"torus knot"},
];
function _flashConsole(msg){ const el=document.getElementById("presetStatus"); if(el) el.textContent=msg; }
function buildNav(){
  const idx=ALL_MODULES.findIndex(m=>m.id===PIECE);
  const safeIdx=idx>=0?idx:0;
  const prev=ALL_MODULES[(safeIdx-1+ALL_MODULES.length)%ALL_MODULES.length];
  const next=ALL_MODULES[(safeIdx+1)%ALL_MODULES.length];
  const np=document.getElementById("navPrev"); if(np){ np.href="../"+prev.id+"/noixzy_"+prev.id+".html"; np.title=prev.title; }
  const nn=document.getElementById("navNext"); if(nn){ nn.href="../"+next.id+"/noixzy_"+next.id+".html"; nn.title=next.title; }

  const rail=document.getElementById("stageThumbs");
  if(rail){
    ["pointerdown","mousedown","mouseup","touchstart"].forEach(type=>{
      rail.addEventListener(type,e=>e.stopPropagation(),true);
    });
    rail.addEventListener("wheel",e=>{
      e.preventDefault();
      e.stopPropagation();
      const strip=document.getElementById("moduleThumbStrip");
      if(strip) strip.scrollTop += e.deltaY;
    },{capture:true,passive:false});
  }

  const strip=document.getElementById("moduleThumbStrip"); if(!strip) return;
  strip.innerHTML="";
  let railSelected=safeIdx;

  function selectThumb(i){
    const links=[...strip.querySelectorAll(".navThumb")];
    if(!links.length) return;
    railSelected=(i+links.length)%links.length;
    links.forEach(a=>a.classList.remove("selected"));
    links[railSelected].classList.add("selected");
    links[railSelected].scrollIntoView({block:"nearest",inline:"nearest",behavior:"smooth"});
  }

  ALL_MODULES.forEach(m=>{
    const a=document.createElement("a"); a.href="../"+m.id+"/noixzy_"+m.id+".html"; a.title=m.title;
    a.className="navThumb"+(m.id===PIECE?" active":"");
    a.onclick=e=>{ e.preventDefault(); e.stopPropagation(); window.location.href=a.href; };
    const img=document.createElement("img"); img.src="../gallery/thumbs/"+m.id+".png"; img.alt=m.title;
    a.appendChild(img); strip.appendChild(a);
  });

  const up=document.getElementById("thumbUp");
  const dn=document.getElementById("thumbDown");
  if(up){ up.onclick=e=>{ e.preventDefault(); e.stopPropagation(); selectThumb(railSelected-1); }; }
  if(dn){ dn.onclick=e=>{ e.preventDefault(); e.stopPropagation(); selectThumb(railSelected+1); }; }

  setTimeout(()=>{ const el=strip.querySelector(".active"); if(el){ el.scrollIntoView({block:"center",inline:"nearest"}); } },50);
}
let _dragOnCanvas=false;
function mousePressed(){
  _dragOnCanvas = (mouseX>=0&&mouseX<=W&&mouseY>=0&&mouseY<=H);
}
function _clampP(k){ const par=PARAMS.find(p=>p.k===k); if(!par)return; P[k]=Math.min(par.max,Math.max(par.min,P[k])); }
function _syncSlider(k){ const inp=document.getElementById("p_"+k); const sp=document.getElementById("v_"+k); if(!inp||!sp)return; inp.value=P[k]; const par=PARAMS.find(p=>p.k===k); sp.textContent=(par&&par.step>=1)?P[k]:(+P[k]).toFixed(2); }
function mouseDragged(e){
  if(!_dragOnCanvas) return;
  const el=document.elementFromPoint(e.clientX,e.clientY);
  if(el&&el.closest('.panel')) return;
  if(e.altKey){
    P.rot=+(P.rot + movedX/W * 1.4).toFixed(3);
    _clampP("rot"); _syncSlider("rot");
  } else {
    P.cx=+(P.cx + movedX/W * 2).toFixed(3);
    P.cy=+(P.cy - movedY/H * 2).toFixed(3);
    _clampP("cx"); _clampP("cy");
    _syncSlider("cx"); _syncSlider("cy");
  }
  dirty=true; return false;
}
function mouseWheel(event){
  const el=document.elementFromPoint(event.clientX,event.clientY);
  if(el&&el.closest('.panel')) return;
  P.zoom=+(P.zoom - event.delta*0.0008).toFixed(3);
  _clampP("zoom"); _syncSlider("zoom");
  dirty=true; return false;
}

function buildSystem(){ randomSeed(seed); noiseSeed(seed); build(); dirty=true; }
function renderScene(){
  randomSeed(seed); noiseSeed(seed);
  raw.clear();
  // If the piece provides a heightField(G) function and extrude is active, render as heightfield
  try{
    const palLocal = getPal();
    if(typeof heightField === 'function' && (Math.abs(P.extrude||0)>0.01||(P.height||0)>0.01)){ const G=220; const heights = heightField(G);
      if(heights && heights.length===G*G){ renderHeightfield(raw,heights,G,palLocal,{}); }
      else { render(raw,palLocal); }
    }else{ render(raw,palLocal); }
  }catch(e){ console.warn('heightfield render failed, falling back to flat render',e); render(raw, getPal()); }
  // MATERIAL sheen — applied to forms only via source-atop (no bleed onto background)
  const sheenV=Math.min(1,P.metallic*(1-P.rough)+P.sheen);
  if(sheenV>0.01){ const dc=raw.drawingContext; dc.save(); dc.globalCompositeOperation='source-atop'; dc.globalAlpha=Math.min(1,0.6*sheenV); dc.drawImage(specTex.elt,0,0,raw.width,raw.height); dc.restore(); }
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
  // First-frame layout check: flexbox may not finish before setup() reads clientWidth
  if(!draw._sized){
    draw._sized=true;
    const st=document.getElementById("stage");
    const cw=st.clientWidth,ch=st.clientHeight;
    if(cw>10&&ch>10&&(Math.abs(cw-W)>4||Math.abs(ch-H)>4)){
      resizeCanvas(cw,ch); W=width; H=height; allocBuffers(); buildSystem();
    }
  }
  // guard against uninitialized t0 or NaN from millis()-t0
  if(running && !isFinite(t0)) t0 = millis();
  const time = (running ? (isFinite(millis()-t0) ? (millis()-t0)/1000 : (t0=millis(),0)) : pauseT);
  const animate=(P.speed>0||P.drift>0||audioActive);
  animT = time;
  _audioApply();
  if(dirty || animate){ renderScene(); dirty=false; }
  _audioRestore();
  const pal=getPal();
  background(pal[0][0],pal[0][1],pal[0][2]);
  // FRAME + MOTION transform applied to the baked scene
  const frameDrift=(PIECE=="reaction_diffusion")?0:P.drift;
  const dz=1+(frameDrift>0?Math.sin(time*0.6)*0.045*frameDrift:0);
  const ar=(PIECE=="reaction_diffusion")?0:(P.speed>0?time*0.08*P.speed:0);
  push();
  translate(W/2 + P.cx * W * 0.45, H/2 - P.cy * H * 0.45); scale(P.zoom*dz); rotate(P.rot*Math.PI); translate(-W/2,-H/2);
  drawingContext.filter = P.contrast>0 ? "contrast("+((100+P.contrast*120)|0)+"%)" : "none";
  tint(255,255*P.alpha); image(scene,0,0);
  drawingContext.filter="none";
  if(P.glow>0.01){ blendMode(ADD); tint(255,110*P.glow); image(glowBuf,0,0,W,H); blendMode(BLEND); }
  pop(); noTint();
  if(P.vig>0.01){ push(); tint(255,255*P.vig); image(vigTex,0,0,W,H); pop(); noTint(); }
  const _sr=document.getElementById("seedRead"); if(_sr) _sr.textContent=seed; const _vs=document.getElementById("vSeed"); if(_vs) _vs.textContent=seed;
}

function normalizePastedP(src){
  if(src===undefined||src===null) return null;
  if(Array.isArray(src)){ const out={}; PARAMS.forEach((p,i)=>{ if(src[i]!==undefined) out[p.k]=src[i]; }); return out; }
  if(typeof src==="object") return src;
  return null;
}
function copyParams(){
  const txt=JSON.stringify({seed:seed,P:P,theme:activeTheme});
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(()=>flash("copyP","copied ✓"),()=>{prompt("params JSON:",txt);flash("copyP","copied ✓");});
  }else{ prompt("params JSON:",txt); flash("copyP","copied ✓"); }
}
function pasteParams(){
  const fail=()=>flash("pasteP","✗ invalid");
  if(!(navigator.clipboard&&navigator.clipboard.readText)){fail();return;}
  navigator.clipboard.readText().then(txt=>{
    if(!txt){fail();return;}
    let data; try{ data=JSON.parse(txt); }catch(e){ fail(); return; }
    if(!data||typeof data!=="object"){fail();return;}
    const cfg={}; let touched=false;
    if(data.seed!==undefined){ const n=parseInt(data.seed,10); if(Number.isFinite(n)){ cfg.seed=n; touched=true; } }
    const nextP=normalizePastedP(data.P);
    if(nextP){ cfg.P=nextP; touched=true; }
    if(data.theme!==undefined) applyTheme(data.theme);
    if(!touched&&data.theme===undefined){ fail(); return; }
    if(touched){
      if(typeof applyConfig==="function") applyConfig(cfg);
      else { if(cfg.seed!==undefined) seed=cfg.seed; if(cfg.P) Object.keys(cfg.P).forEach(k=>{ if(P[k]!==undefined) P[k]=cfg.P[k]; }); dirty=true; }
    }
    flash("pasteP","pasted ✓");
  },fail);
}
function getRecDuration(){
  const el=document.getElementById("recDur");
  const v=el?parseInt(el.value,10):4;
  return [2,4,8,16].includes(v)?v:4;
}
function save2xPNG(){
  const btn=document.getElementById("save2x"), old=btn?btn.textContent:"save 2x";
  if(btn){ btn.textContent="rendering…"; btn.disabled=true; }
  setTimeout(()=>{
    let g2=null;
    try{
      g2=createGraphics(W*2,H*2); if(g2.pixelDensity) g2.pixelDensity(1);
      randomSeed(seed); noiseSeed(seed);
      const pal=getPal();
      g2.background(pal[0][0],pal[0][1],pal[0][2]);
      if(typeof heightField==='function'&&(Math.abs(P.extrude||0)>0.01||(P.height||0)>0.01)){ const G=260, heights=heightField(G);
        if(heights&&heights.length===G*G) renderHeightfield(g2,heights,G,pal,{});
        else render(g2,pal);
      }else{ render(g2,pal); }
      pbrSave(g2,"noixzy_"+PIECE+"_"+seed+"_2x.png");
      setTimeout(()=>{ if(g2)g2.remove(); },500);
    }catch(e){ if(g2)g2.remove(); if(btn)btn.textContent="✗ error"; }
    setTimeout(()=>{ if(btn){ btn.disabled=false; btn.textContent=old; } },900);
  },30);
}
function _audioApply(){
  _audioSaved={};
  if(!audioActive||!analyser) return;
  analyser.getByteFrequencyData(audioData);
  const N=audioData.length;
  const avg=(s,e)=>{let v=0;for(let i=s;i<e;i++)v+=audioData[i];return v/((e-s)*255);};
  ABANDS.bass=avg(0,4); ABANDS.mid=avg(4,20); ABANDS.high=avg(20,60); ABANDS.presence=avg(0,N);
  for(const band of ['bass','mid','high','presence']){
    const k=AMAP[band]; if(!k||P[k]===undefined) continue;
    _audioSaved[k]=P[k];
    const par=PARAMS.find(p=>p.k===k);
    const mn=par?par.min:0, mx=par?par.max:1;
    P[k]=Math.min(mx,Math.max(mn,P[k]+ABANDS[band]*ADEPTH[band]*(mx-mn)));
  }
}
function _audioRestore(){ for(const k of Object.keys(_audioSaved)) P[k]=_audioSaved[k]; _audioSaved={}; }
function buildUI(){
  const host=document.getElementById("groups");

  let rg=0;
  GROUPS.forEach(g=>{
    const gp=PARAMS.filter(p=>p.g===g); if(!gp.length) return;
    const det=document.createElement("details"); if(rg<2) det.open=true; rg++;
    const sum=document.createElement("summary"); sum.textContent=g; det.appendChild(sum);
    gp.forEach(p=>{ const row=document.createElement("div"); row.className="row";
      const lab=document.createElement("label"); lab.htmlFor="p_"+p.k;
      const span=document.createElement("span"); span.id="v_"+p.k;
      lab.append(p.label+" ",span);
      const inp=document.createElement("input"); inp.type="range"; inp.min=p.min; inp.max=p.max; inp.step=p.step; inp.value=p.v; inp.id="p_"+p.k;
      const fmt=()=> span.textContent=(p.step>=1)?P[p.k]:(+P[p.k]).toFixed(2);
      inp.addEventListener("input",()=>{ P[p.k]=parseFloat(inp.value); fmt();
        if(p.k==='pal'){ initColorState(P.pal); syncColorUI(); }
        if(p.sys) buildSystem(); else dirty=true; });
      inp.addEventListener("dblclick",()=>{ P[p.k]=p.v; inp.value=p.v; fmt();
        if(p.k==='pal'){ initColorState(P.pal); syncColorUI(); }
        if(p.sys) buildSystem(); else dirty=true; });
      fmt(); row.append(lab,inp); det.appendChild(row); });
    host.appendChild(det); });
  document.getElementById("seedField").addEventListener("change",e=>{seed=parseInt(e.target.value)||0;document.getElementById("seedRead").textContent=seed; const vs=document.getElementById("vSeed"); if(vs) vs.textContent=seed; buildSystem();});
  document.getElementById("newSeed").addEventListener("click",()=>{seed=Math.floor(Math.random()*1e6);document.getElementById("seedField").value=seed;document.getElementById("seedRead").textContent=seed; const vs=document.getElementById("vSeed"); if(vs) vs.textContent=seed; buildSystem();_flashConsole("seed "+seed);});
  document.getElementById("pause").addEventListener("click",togglePause);
  document.getElementById("reset").addEventListener("click",()=>{const d={};PARAMS.forEach(p=>d[p.k]=p.v);applyConfig({seed:1,P:d});_flashConsole("reset");});
  document.getElementById("save").addEventListener("click",triggerSavePNG);
  document.getElementById("save2x").addEventListener("click",save2xPNG);
  document.getElementById("savePBR").addEventListener("click",makePBRMaps);
  document.getElementById("rec").addEventListener("click",()=>recordClip(getRecDuration()));
  document.getElementById("thumb").addEventListener("click",saveThumb);
  document.getElementById("copyP").addEventListener("click",copyParams);
  document.getElementById("pasteP").addEventListener("click",pasteParams);
  document.getElementById("randomAll").addEventListener("click",_randomizeAll);
  document.getElementById("randomForm").addEventListener("click",_randomizeForm);
  document.getElementById("randomColor").addEventListener("click",_randomizeColor);
  document.getElementById("themePrev").addEventListener("click",()=>cycleTheme(-1));
  document.getElementById("themeNext").addEventListener("click",()=>cycleTheme(1));
  if(typeof renderSVG === 'function'){
    const svgBtn=document.createElement('button');
    svgBtn.id='svg'; svgBtn.textContent='svg';
    document.querySelector('.btns').appendChild(svgBtn);
    svgBtn.addEventListener('click',renderSVG);
  }
  // audio
  const btnAudio=document.getElementById("btnAudio");
  const audioPanel=document.getElementById("audioPanel");
  const audioBands=document.getElementById("audioBands");
  const audioDropZone=document.getElementById("audioDropZone");
  const audioFileInput=document.getElementById("audioFileInput");
  const audioStatus=document.getElementById("audioStatus");
  const audioPlayPause=document.getElementById("audioPlayPause");
  const audioFilename=document.getElementById("audioFilename");
  const btnMic=document.getElementById("btnMic");
  let audioSource=null, audioBuffer=null, audioPlaying=false, micStream=null;

  function _ensureCtx(){
    if(!audioCtx){ audioCtx=new AudioContext(); analyser=audioCtx.createAnalyser(); analyser.fftSize=512; audioData=new Uint8Array(analyser.frequencyBinCount); }
    if(audioCtx.state==="suspended") audioCtx.resume();
  }
  async function _loadFile(file){
    _ensureCtx();
    if(audioSource){ try{audioSource.stop();}catch(e){} audioSource=null; }
    const ab=await file.arrayBuffer();
    audioBuffer=await audioCtx.decodeAudioData(ab);
    audioFilename.textContent=file.name;
    audioStatus.style.display="flex";
    _playBuffer();
  }
  function _playBuffer(){
    if(!audioBuffer) return;
    if(audioSource){ try{audioSource.stop();}catch(e){} }
    audioSource=audioCtx.createBufferSource();
    audioSource.buffer=audioBuffer; audioSource.loop=true;
    audioSource.connect(analyser); analyser.connect(audioCtx.destination);
    audioSource.start(); audioPlaying=true; audioPlayPause.textContent="⏸";
    audioActive=true;
  }
  audioPlayPause.addEventListener("click",()=>{
    if(audioPlaying){ try{audioSource.stop();}catch(e){} audioPlaying=false; audioActive=false; audioPlayPause.textContent="▶"; }
    else { _playBuffer(); }
  });
  async function _loadFileData(file){ if(file&&file.type.startsWith("audio/")) await _loadFile(file); }
  audioDropZone.addEventListener("click",()=>audioFileInput.click());
  audioFileInput.addEventListener("change",e=>{ if(e.target.files[0]) _loadFileData(e.target.files[0]); });
  audioDropZone.addEventListener("dragover",e=>{ e.preventDefault(); audioDropZone.style.borderColor="var(--accent)"; });
  audioDropZone.addEventListener("dragleave",()=>{ audioDropZone.style.borderColor="#444"; });
  audioDropZone.addEventListener("drop",e=>{ e.preventDefault(); audioDropZone.style.borderColor="#444"; _loadFileData(e.dataTransfer.files[0]); });
  btnMic.addEventListener("click",async()=>{
    if(micStream){ micStream.getTracks().forEach(t=>t.stop()); micStream=null; btnMic.textContent="mic"; btnMic.style.opacity=".6"; if(!audioPlaying) audioActive=false; return; }
    try{
      _ensureCtx();
      micStream=await navigator.mediaDevices.getUserMedia({audio:true});
      audioCtx.createMediaStreamSource(micStream).connect(analyser);
      audioActive=true; btnMic.textContent="mic ●"; btnMic.style.opacity="1";
    }catch(e){ alert("mic access denied"); }
  });
  btnAudio.addEventListener("click",()=>{
    const open=audioPanel.style.display==="none";
    audioPanel.style.display=open?"block":"none";
    btnAudio.style.color=open?"var(--accent)":"";
  });

  // band mapping rows
  const mappableParams=PARAMS.filter(p=>!p.sys&&p.k!=='pal');
  ['bass','mid','high','presence'].forEach(band=>{
    const row=document.createElement("div");
    row.style.cssText="display:flex;align-items:center;gap:6px;margin-bottom:5px;";
    const lbl=document.createElement("span"); lbl.textContent=band; lbl.style.cssText="width:68px;color:var(--dim);";
    const sel=document.createElement("select");
    sel.style.cssText="flex:1;background:#1a1a1d;color:var(--ink);border:1px solid #333;border-radius:4px;padding:2px 4px;font-size:11px;";
    const none=document.createElement("option"); none.value=""; none.textContent="— off —"; sel.appendChild(none);
    mappableParams.forEach(p=>{ const o=document.createElement("option"); o.value=p.k; o.textContent=p.label||p.k; sel.appendChild(o); });
    sel.addEventListener("change",()=>{ AMAP[band]=sel.value||null; });
    const dep=document.createElement("input"); dep.type="range"; dep.min=0; dep.max=1; dep.step=.01; dep.value=0.5;
    dep.style.cssText="width:55px;";
    dep.addEventListener("input",()=>{ ADEPTH[band]=parseFloat(dep.value); });
    row.append(lbl,sel,dep); audioBands.appendChild(row);
  });
  const pinBtn=document.getElementById("pin");
  if(pinBtn){
    let pinLock=0;
    const doPin=e=>{
      if(e){ e.preventDefault(); e.stopPropagation(); }
      const now=Date.now();
      if(now-pinLock<250) return;
      pinLock=now;
      pinFav();
    };
    ["pointerdown","mousedown","click"].forEach(type=>{
      pinBtn.addEventListener(type,doPin,{capture:true});
    });
  }
  document.getElementById("exportFavs").addEventListener("click",()=>{const txt=JSON.stringify(favs);
    if(navigator.clipboard)navigator.clipboard.writeText(txt).then(()=>_flashConsole("copied ✓"),()=>prompt("favorites:",txt)); else prompt("favorites JSON:",txt);});
  document.getElementById("clearFavs").addEventListener("click",()=>{if(confirm("clear all favorites?")){favs=[];saveFavs();renderFavs();}});
  const bgEl=document.getElementById("p_bgc"),accEl=document.getElementById("p_acc"),inkEl=document.getElementById("p_ink");
  if(bgEl) bgEl.addEventListener("input",e=>{colorState.bg=e.target.value;dirty=true;});
  if(accEl) accEl.addEventListener("input",e=>{colorState.acc=e.target.value;dirty=true;});
  if(inkEl) inkEl.addEventListener("input",e=>{colorState.ink=e.target.value;dirty=true;});
  initColorState(P.pal); syncColorUI();
  const tSel=document.getElementById('themeSelect');
  if(tSel){
    tSel.addEventListener('change',e=>applyTheme(e.target.value));

    const palIdx=Math.max(0,Math.min(THEMES.length-1,Math.round(P.pal)||0));
    const startTheme=THEMES[palIdx].name;
    tSel.value=startTheme;
    applyTheme(startTheme);
    tSel.value=startTheme;
    requestAnimationFrame(()=>{ tSel.value=startTheme; });
  }
}
function _randomizeAll(){
  SYSTEM.forEach(p=>{
    if(p.k==='pal'){ P.pal=Math.floor(Math.random()*PALETTES.length); initColorState(P.pal); }
    else { const v=p.min+Math.random()*(p.max-p.min); P[p.k]=p.step>=1?Math.round(v):+(v.toFixed(3)); }
    const el=document.getElementById("p_"+p.k); if(el) el.value=P[p.k];
    const sp=document.getElementById("v_"+p.k); if(sp) sp.textContent=(p.step>=1)?P[p.k]:(+P[p.k]).toFixed(2);
  });
  syncColorUI(); buildSystem(); _flashConsole("randomized");
}
function _randomizeForm(){
  for(const spec of PARAMS){
    if(spec.k==="pal" || spec.g==="color") continue;
    if(spec.rr===false) continue;
    const min=spec.min??0, max=spec.max??1, step=spec.step??.01;
    let v=min+Math.random()*(max-min);
    if(step>=1) v=Math.round(v);
    else v=Math.round(v/step)*step;
    P[spec.k]=Math.max(min,Math.min(max,v));

    const el=document.getElementById("p_"+spec.k); if(el) el.value=P[spec.k];
    const sp=document.getElementById("v_"+spec.k); if(sp) sp.textContent=(step>=1)?P[spec.k]:(+P[spec.k]).toFixed(2);
  }
  buildSystem(); _flashConsole("form randomized");
}
function _randomizeColor(){
  const idx=Math.floor(Math.random()*Math.min(PALETTES.length,THEMES.length));
  applyTheme(THEMES[idx].name);
  dirty=true; _flashConsole("color randomized");
}
let favs=[];
function loadFavs(){ try{favs=JSON.parse(localStorage.getItem(FAVKEY)||"[]");}catch(e){favs=[];} renderFavs(); }
function saveFavs(){ try{localStorage.setItem(FAVKEY,JSON.stringify(favs));}catch(e){} }
function pinFav(){
  favs.push({seed,P:JSON.parse(JSON.stringify(P)),cs:{...colorState}});
  saveFavs();
  renderFavs();
  _flashConsole("★ pinned");
}
function flash(id,msg){ const b=document.getElementById(id); if(!b)return; const o=b.textContent; b.textContent=msg; setTimeout(()=>{b.textContent=o;},1100); }
function applyConfig(cfg){ if(cfg.seed!==undefined){seed=cfg.seed;document.getElementById("seedField").value=seed;}
  PARAMS.forEach(p=>{ if(cfg.P&&cfg.P[p.k]!==undefined){ P[p.k]=cfg.P[p.k];
    const el=document.getElementById("p_"+p.k); if(el)el.value=P[p.k];
    const sp=document.getElementById("v_"+p.k); if(sp)sp.textContent=(p.step>=1)?P[p.k]:(+P[p.k]).toFixed(2); }});
  if(cfg.cs){ colorState={...colorState,...cfg.cs}; }else{ initColorState(P.pal); }
  syncColorUI(); buildSystem(); }
function renderFavs(){
  const host=document.getElementById("stageFavs")||document.getElementById("favs"); if(!host)return;
  host.innerHTML="";
  favs = (Array.isArray(favs)?favs:[]).filter(f=>f && f.P);
  favs.forEach((f,i)=>{
    const chip=document.createElement("div"); chip.className="chip";
    const palIdx=Math.max(0,Math.min(PALETTES.length-1,Math.round((f.P&&f.P.pal)||0)||0));
    const accentHex=(f.cs&&f.cs.acc)?f.cs.acc:PALETTES[palIdx][1];
    chip.innerHTML='<span class="sw" style="background:'+accentHex+'"></span><b>★'+(i+1)+'</b><span class="x">×</span>';
    chip.addEventListener("click",e=>{ if(e.target.classList.contains("x"))return; applyConfig(f); });
    chip.querySelector(".x").addEventListener("click",e=>{e.stopPropagation();favs.splice(i,1);saveFavs();renderFavs();});
    host.appendChild(chip);
  });
  saveFavs();
}
function pbrSave(g,name){
  g.elt.toBlob(b=>{ const u=URL.createObjectURL(b);
    const a=document.createElement('a'); a.href=u; a.download=name; a.click(); URL.revokeObjectURL(u); }); }
function makePBRMaps(){
  flash("savePBR","generating…");
  const SZ=1024, base="noixzy_"+PIECE+"_"+seed;
  const hasHF=typeof heightField==='function';
  const heights=hasHF?heightField(SZ):null;
  // height
  const hmG=createGraphics(SZ,SZ); hmG.loadPixels();
  for(let i=0;i<SZ*SZ;i++){ const h=heights?Math.round((heights[i]||0)*255):128;
    hmG.pixels[i*4]=hmG.pixels[i*4+1]=hmG.pixels[i*4+2]=h; hmG.pixels[i*4+3]=255; }
  hmG.updatePixels();
  // normal (tangent-space OpenGL, Y+up)
  const nmG=createGraphics(SZ,SZ); nmG.loadPixels();
  for(let y=0;y<SZ;y++) for(let x=0;x<SZ;x++){
    let rx=128,ry=128,rz=255;
    if(heights){
      const gh=(gx,gy)=>heights[Math.min(SZ-1,Math.max(0,gx))+Math.min(SZ-1,Math.max(0,gy))*SZ]||0;
      const dx=(gh(x+1,y)-gh(x-1,y))*4, dy=(gh(x,y+1)-gh(x,y-1))*4;
      const len=Math.sqrt(dx*dx+dy*dy+1);
      rx=Math.round((-dx/len*0.5+0.5)*255);
      ry=Math.round((-dy/len*0.5+0.5)*255);
      rz=Math.round((1/len*0.5+0.5)*255);
    }
    const i=(y*SZ+x)*4; nmG.pixels[i]=rx; nmG.pixels[i+1]=ry; nmG.pixels[i+2]=rz; nmG.pixels[i+3]=255;
  }
  nmG.updatePixels();
  // albedo — flat render at canvas res
  const alG=createGraphics(SZ,SZ); randomSeed(seed); noiseSeed(seed); render(alG,getPal());
  // ao — neighbor height occlusion
  const aoG=createGraphics(SZ,SZ); aoG.loadPixels(); const R=3;
  for(let y=0;y<SZ;y++) for(let x=0;x<SZ;x++){
    let v=255;
    if(heights){ const self=heights[x+y*SZ]||0; let occ=0,cnt=0;
      for(let dy2=-R;dy2<=R;dy2++) for(let dx2=-R;dx2<=R;dx2++){ if(!dx2&&!dy2) continue;
        const nx=Math.min(SZ-1,Math.max(0,x+dx2)), ny=Math.min(SZ-1,Math.max(0,y+dy2));
        occ+=Math.max(0,(heights[nx+ny*SZ]||0)-self); cnt++; }
      v=Math.round(Math.max(0,1-occ/cnt*7)*255); }
    const i=(y*SZ+x)*4; aoG.pixels[i]=aoG.pixels[i+1]=aoG.pixels[i+2]=v; aoG.pixels[i+3]=255;
  }
  aoG.updatePixels();
  const maps=[[hmG,"height"],[nmG,"normal"],[alG,"albedo"],[aoG,"ao"]];
  showPBRPreview(maps);
  maps.forEach(([g,sfx],i)=>{
    setTimeout(()=>{ pbrSave(g,base+"_"+sfx+".png"); setTimeout(()=>g.remove(),400); },i*350);
  });
}
function showPBRPreview(maps){
  const ov=document.createElement('div'); ov.className='pbrOverlay';
  const grid=document.createElement('div'); grid.className='pbrGrid';
  maps.forEach(([g,label])=>{
    const cell=document.createElement('div'); cell.className='pbrCell';
    const img=document.createElement('img'); img.src=g.elt.toDataURL();
    const lbl=document.createElement('span'); lbl.textContent=label;
    cell.append(img,lbl); grid.appendChild(cell);
  });
  const hint=document.createElement('div'); hint.className='pbrHint'; hint.textContent='click anywhere to close  ·  files downloading';
  grid.appendChild(hint);
  ov.appendChild(grid);
  ov.addEventListener('click',()=>ov.remove());
  document.body.appendChild(ov);
}
function svgNum(v){ return (Math.round(v*1000)/1000).toString(); }
function svgColor(c){
  return "#"+[0,1,2].map(i=>{ const v=Math.max(0,Math.min(255,Math.round(c[i]||0))); return v.toString(16).padStart(2,"0"); }).join("");
}
function downloadSVG(svg){
  const blob=new Blob([svg],{type:"image/svg+xml"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='noixzy_'+PIECE+'_'+seed+'.svg'; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function recordClip(dur=4){
  const btn=document.getElementById('rec');
  if(btn._recording) return;
  const canvas=document.querySelector('#stage canvas');
  if(!canvas||!canvas.captureStream){btn.textContent='unsupported';setTimeout(()=>btn.textContent='video',2000);return;}
  const mimeType=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t))||'';
  const stream=canvas.captureStream(30);
  const rec=new MediaRecorder(stream,mimeType?{mimeType}:{});
  const chunks=[];
  rec.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
  rec.onstop=()=>{
    btn._recording=false;
    const blob=new Blob(chunks,{type:mimeType||'video/webm'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='noixzy_'+PIECE+'_'+seed+'.webm'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    btn.textContent='video';
  };
  btn._recording=true;
  rec.start();
  let t=dur;
  btn.textContent='● '+t+'s';
  const iv=setInterval(()=>{
    t--;
    if(t>0){ btn.textContent='● '+t+'s'; }
    else { clearInterval(iv); btn.textContent='saving…'; rec.stop(); stream.getTracks().forEach(tr=>tr.stop()); }
  },1000);
}
</script>
</body>
</html>
`;

// ---------------- per-piece definitions ----------------
const PIECES=[

{ id:"moire_field", title:"moire field",
  system:[
    {k:"density",label:"density",min:0,max:1,step:.01,v:.62,sys:true},
    {k:"spacing",label:"spacing",min:0,max:1,step:.01,v:.42,rr:true},
    {k:"rotation",label:"rotation",min:0,max:1,step:.01,v:.38,rr:true},
    {k:"warp",label:"warp",min:0,max:1,step:.01,v:.34,rr:true},
    {k:"contrast",label:"contrast",min:0,max:1,step:.01,v:.72,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.35},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.55,rr:true}
  ],
  code:`
function build(){}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2;
  const dep=P.zdepth||0;
  const dens=Math.floor(map(P.density,0,1,46,210));
  const spacing=map(P.spacing,0,1,7,28);
  const rotA=map(P.rotation,0,1,-Math.PI*.33,Math.PI*.33);
  const rotB=-rotA*0.72+Math.sin(animT*.17)*0.13;
  const warp=map(P.warp,0,1,0,58);
  const contrast=map(P.contrast,0,1,35,230);
  const t=animT*map(P.speed,0,1,0.08,1.3);
  g.background(
    Math.min(255,pal[0][0]*1.18+10),
    Math.min(255,pal[0][1]*1.18+10),
    Math.min(255,pal[0][2]*1.18+10)
  );

  // soft stage highlight window
  const hg=g.drawingContext;
  const grad=hg.createRadialGradient(cx,cy,Math.min(W,H)*.08,cx,cy,Math.min(W,H)*.58);
  grad.addColorStop(0,"rgba(255,255,255,0.16)");
  grad.addColorStop(.42,"rgba(255,255,255,0.08)");
  grad.addColorStop(1,"rgba(255,255,255,0)");
  hg.fillStyle=grad;
  hg.fillRect(0,0,W,H);

  g.noFill();
  g.blendMode(BLEND);
  function bandLayer(angle,col,phase,alphaMul,weightMul){
    const ca=Math.cos(angle),sa=Math.sin(angle);
    const diag=Math.sqrt(W*W+H*H);
    const count=dens;
    g.strokeWeight(map(P.density,0,1,2.8,.55)*weightMul);
    for(let i=-count;i<=count;i++){
      const off=i*spacing+Math.sin(i*.19+t+phase)*spacing*.45;
      const pts=[];
      const steps=120;
      for(let s=-steps;s<=steps;s++){
        const u=s/steps*diag;
        const v=off;
        const z=(v/(diag*.72));
        const scl=Math.abs(dep)>0.01?1-z*.22*dep:1;
        let x=cx+(u*ca-v*sa)*scl;
        let y=cy+(u*sa+v*ca)*scl+z*cy*.18*dep;
        const n=noise(x*.0035+phase,y*.0035,t*.22);
        const wob=(n-.5)*warp;
        x+=Math.cos(angle+Math.PI/2)*wob;
        y+=Math.sin(angle+Math.PI/2)*wob;
        pts.push([x,y]);
      }
      const pulse=.55+.45*Math.sin(i*.11+t*1.8+phase);
      g.stroke(col[0],col[1],col[2],contrast*alphaMul*(.45+.55*pulse));
      g.beginShape();
      for(const p of pts) g.curveVertex(p[0],p[1]);
      g.endShape();
    }
  }
  bandLayer(rotA,pal[1],0,0.78,1.22);
  bandLayer(rotB,pal[2],2.1,0.66,1.05);
  g.blendMode(ADD);
  bandLayer(rotA+rotB*.2,pal[2],4.2,0.30,.72);
  g.blendMode(BLEND);
}
function heightField(G){
  const out=new Float32Array(G*G);
  const dens=Math.floor(map(P.density,0,1,46,210));
  const spacing=map(P.spacing,0,1,.018,.065);
  const rotA=map(P.rotation,0,1,-Math.PI*.33,Math.PI*.33);
  const rotB=-rotA*.72;
  const warp=map(P.warp,0,1,0,.08);
  const sharp=map(P.contrast,0,1,1.2,5.5);
  const t=animT*map(P.speed,0,1,.08,1.3);
  function layer(x,y,a,phase){
    const ca=Math.cos(a),sa=Math.sin(a);
    const v=(x-.5)*-sa+(y-.5)*ca;
    const n=noise(x*3.2+phase,y*3.2,t*.22);
    const vv=v+(n-.5)*warp;
    const d=Math.abs(Math.sin((vv/spacing+t*.04+phase)*Math.PI));
    return Math.pow(1-d,sharp);
  }
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    const x=i/(G-1), y=j/(G-1);
    const h=Math.max(layer(x,y,rotA,0),layer(x,y,rotB,2.1)*.88,layer(x,y,rotA+rotB*.2,4.2)*.55);
    out[i+j*G]=Math.min(1,h);
  }
  _edgeMask(out,G); return out;
}` },

{ id:"particle_orbitals", title:"particle orbitals",
  system:[
    {k:"count",label:"count",min:0,max:1,step:.01,v:.54,sys:true},
    {k:"radius",label:"radius",min:0,max:1,step:.01,v:.52,rr:true},
    {k:"orbit",label:"orbit speed",min:0,max:1,step:.01,v:.42},
    {k:"trails",label:"trails",min:0,max:1,step:.01,v:.58,rr:true},
    {k:"attraction",label:"attraction",min:0,max:1,step:.01,v:.48,rr:true},
    {k:"jitter",label:"jitter",min:0,max:1,step:.01,v:.26,rr:true},
    {k:"thickness",label:"thickness",min:0,max:1,step:.01,v:.36,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.6,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.6,rr:true}
  ],
  code:`
let ORB_PARTS=[];
function build(){
  const n=Math.floor(map(P.count,0,1,80,1300));
  ORB_PARTS=[];
  for(let i=0;i<n;i++){
    ORB_PARTS.push({
      a:random(TWO_PI),
      r:Math.pow(random(),.62),
      ph:random(TWO_PI),
      sp:random(.35,1.8)*(random()<.5?-1:1),
      lane:Math.floor(random(5)),
      wob:random(.2,1.4)
    });
  }
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2;
  const dep=P.zdepth||0;
  const baseR=map(P.radius,0,1,70,Math.min(W,H)*.46);
  const orb=map(P.orbit,0,1,.08,2.4);
  const trails=Math.floor(map(P.trails,0,1,4,34));
  const att=map(P.attraction,0,1,0,1);
  const jit=map(P.jitter,0,1,0,38);
  const thick=map(P.thickness,0,1,.45,4.8);
  const t=animT*orb;
  g.background(pal[0][0],pal[0][1],pal[0][2]);
  g.noFill();
  g.blendMode(ADD);
  const attractors=[
    [cx+Math.cos(t*.37)*baseR*.26,cy+Math.sin(t*.31)*baseR*.20],
    [cx+Math.cos(t*.29+2.2)*baseR*.34,cy+Math.sin(t*.41+1.2)*baseR*.28],
    [cx+Math.cos(t*.23+4.4)*baseR*.18,cy+Math.sin(t*.35+3.8)*baseR*.36]
  ];
  for(const p of ORB_PARTS){
    const lane=(p.lane+1)/5;
    const rr=baseR*(.18+p.r*.86)*(1+Math.sin(t*.4+p.ph)*.06);
    const aa=p.a+t*p.sp*(.35+lane)+Math.sin(t*.3+p.ph)*att*.55;
    const z=(lane-.5)*2;
    const scl=Math.abs(dep)>0.01?1-z*.24*dep:1;
    let x=cx+Math.cos(aa)*rr*scl;
    let y=cy+Math.sin(aa*(1+lane*.08))*rr*(.62+lane*.38)*scl+z*cy*.13*dep;
    const at=attractors[p.lane%attractors.length];
    x=lerp(x,at[0],att*.18*Math.sin(t+p.ph)*.5+att*.11);
    y=lerp(y,at[1],att*.18*Math.cos(t+p.ph)*.5+att*.11);
    const n=noise(p.r*8+10,p.ph*2,t*.18);
    x+=(n-.5)*jit*p.wob;
    y+=(noise(p.ph*2,p.r*8+20,t*.18)-.5)*jit*p.wob;
    const col=p.lane%2?pal[1]:pal[2];
    g.stroke(col[0],col[1],col[2],map(p.r,0,1,70,210));
    g.strokeWeight(thick*(.35+p.r*.9));
    g.point(x,y);
    if(trails>5){
      g.stroke(col[0],col[1],col[2],map(P.trails,0,1,18,95));
      g.strokeWeight(thick*.35);
      g.beginShape();
      for(let k=0;k<trails;k++){
        const kk=k/trails;
        const aaa=aa-kk*(.35+p.r*.9)*p.sp;
        const rrr=rr*(1-kk*.025);
        const tx=cx+Math.cos(aaa)*rrr;
        const ty=cy+Math.sin(aaa*(1+lane*.08))*rrr*(.62+lane*.38);
        g.curveVertex(tx,ty);
      }
      g.endShape();
    }
  }
  g.blendMode(BLEND);
  g.noFill();
  for(const at of attractors){
    const c=pal[1];
    g.stroke(c[0],c[1],c[2],90);
    g.strokeWeight(1);
    g.circle(at[0],at[1],10+att*22);
  }
}
function heightField(G){
  const out=new Float32Array(G*G);
  const baseR=map(P.radius,0,1,.10,.46);
  const orb=map(P.orbit,0,1,.08,2.4);
  const trails=Math.floor(map(P.trails,0,1,4,34));
  const att=map(P.attraction,0,1,0,1);
  const jit=map(P.jitter,0,1,0,.045);
  const thick=map(P.thickness,0,1,.004,.022);
  const t=animT*orb;
  const attractors=[
    [.5+Math.cos(t*.37)*baseR*.26,.5+Math.sin(t*.31)*baseR*.20],
    [.5+Math.cos(t*.29+2.2)*baseR*.34,.5+Math.sin(t*.41+1.2)*baseR*.28],
    [.5+Math.cos(t*.23+4.4)*baseR*.18,.5+Math.sin(t*.35+3.8)*baseR*.36]
  ];
  const stamp=(x,y,r,val)=>{
    const i0=Math.max(0,Math.floor((x-r)*(G-1))), i1=Math.min(G-1,Math.ceil((x+r)*(G-1)));
    const j0=Math.max(0,Math.floor((y-r)*(G-1))), j1=Math.min(G-1,Math.ceil((y+r)*(G-1)));
    for(let jj=j0;jj<=j1;jj++)for(let ii=i0;ii<=i1;ii++){
      const dx=ii/(G-1)-x, dy=jj/(G-1)-y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<r){ const q=1-d/r; out[ii+jj*G]=Math.min(1,out[ii+jj*G]+q*q*val); }
    }
  };
  for(const p of ORB_PARTS){
    const lane=(p.lane+1)/5;
    const rr=baseR*(.18+p.r*.86)*(1+Math.sin(t*.4+p.ph)*.06);
    const aa=p.a+t*p.sp*(.35+lane)+Math.sin(t*.3+p.ph)*att*.55;
    let x=.5+Math.cos(aa)*rr;
    let y=.5+Math.sin(aa*(1+lane*.08))*rr*(.62+lane*.38);
    const at=attractors[p.lane%attractors.length];
    x=lerp(x,at[0],att*.18*Math.sin(t+p.ph)*.5+att*.11);
    y=lerp(y,at[1],att*.18*Math.cos(t+p.ph)*.5+att*.11);
    const n=noise(p.r*8+10,p.ph*2,t*.18);
    x+=(n-.5)*jit*p.wob;
    y+=(noise(p.ph*2,p.r*8+20,t*.18)-.5)*jit*p.wob;
    stamp(x,y,thick*(.45+p.r*.9),.45+p.r*.55);
    for(let k=0;k<trails;k+=2){
      const kk=k/Math.max(1,trails);
      const aaa=aa-kk*(.35+p.r*.9)*p.sp;
      const tx=.5+Math.cos(aaa)*rr*(1-kk*.025);
      const ty=.5+Math.sin(aaa*(1+lane*.08))*rr*(.62+lane*.38)*(1-kk*.025);
      stamp(tx,ty,thick*.45*(1-kk*.55),(.25+p.r*.45)*(1-kk));
    }
  }
  _edgeMask(out,G); return out;
}` },



{ id:"radial_noise", title:"radial noise",
  system:[
    {k:"rings",label:"rings",min:0,max:1,step:.01,v:.58,sys:true},
    {k:"spokes",label:"spokes",min:0,max:1,step:.01,v:.46,rr:true},
    {k:"noise",label:"noise",min:0,max:1,step:.01,v:.54,rr:true},
    {k:"twist",label:"twist",min:0,max:1,step:.01,v:.42,rr:true},
    {k:"contrast",label:"contrast",min:0,max:1,step:.01,v:.60,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.30},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.60,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.60,rr:true}
  ],
  code:`
function build(){}
function _radialVal(x,y,t){
  const dx=x-.5,dy=y-.5;
  let r=Math.sqrt(dx*dx+dy*dy);
  let a=Math.atan2(dy,dx);
  const n=noise(x*5.4+seed*.01,y*5.4+17,t*.16);
  a += (n-.5)*map(P.twist,0,1,.2,2.8);
  r += (noise(x*9+23,y*9+31,t*.12)-.5)*P.noise*.18;
  const rings=Math.sin(r*map(P.rings,0,1,18,74)-t*1.2)*.5+.5;
  const spokes=Math.sin(a*map(P.spokes,0,1,4,48)+t*.8)*.5+.5;
  const v=Math.max(rings,spokes*.82)*(.65+n*.35);
  return Math.max(0,Math.min(1,v*(1-r*.95)));
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const t=animT*map(P.speed,0,1,.08,1.25);
  const steps=Math.floor(map(P.rings,0,1,70,170));
  g.background(
    Math.min(255,pal[0][0]*1.18+12),
    Math.min(255,pal[0][1]*1.18+12),
    Math.min(255,pal[0][2]*1.18+12)
  );
  g.noFill();
  g.blendMode(ADD);

  for(let j=0;j<steps;j++){
    const rr=j/steps*.55;
    const v=_radialVal(.5+rr,.5,t);
    const col=j%2?pal[1]:pal[2];
    const z=(v-.5)*2;
    const scl=Math.abs(dep)>0.01?1-z*.16*dep:1;
    g.stroke(Math.min(255,col[0]*1.22+20),Math.min(255,col[1]*1.22+20),Math.min(255,col[2]*1.22+20),map(v,0,1,28,185));
    g.strokeWeight(map(P.contrast,0,1,.35,2.5));
    g.circle(cx,cy+z*cy*.08*dep,rr*Math.min(W,H)*2*scl);
  }

  const spokes=Math.floor(map(P.spokes,0,1,12,96));
  for(let i=0;i<spokes;i++){
    const a=i/spokes*TWO_PI+Math.sin(t*.3+i)*P.twist*.12;
    const col=i%2?pal[2]:pal[1];
    const v=.45+.55*noise(Math.cos(a)*2+10,Math.sin(a)*2+20,t*.18);
    g.stroke(Math.min(255,col[0]*1.2+18),Math.min(255,col[1]*1.2+18),Math.min(255,col[2]*1.2+18),map(v,0,1,22,140));
    g.strokeWeight(map(P.contrast,0,1,.3,1.9));
    g.line(cx,cy,cx+Math.cos(a)*Math.min(W,H)*.56,cy+Math.sin(a)*Math.min(W,H)*.56);
  }
  g.blendMode(BLEND);
}
function heightField(G){
  const out=new Float32Array(G*G);
  const t=animT*map(P.speed,0,1,.08,1.25);
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    const x=i/(G-1),y=j/(G-1),v=_radialVal(x,y,t);
    out[i+j*G]=Math.pow(v,map(P.contrast,0,1,2.2,.75));
  }
  _edgeMask(out,G); return out;
}` },

{ id:"topographic_rings", title:"topographic rings",
  system:[
    {k:"rings",label:"rings",min:0,max:1,step:.01,v:.58,sys:true},
    {k:"levels",label:"levels",min:0,max:1,step:.01,v:.48,rr:true},
    {k:"scale",label:"scale",min:0,max:1,step:.01,v:.42,rr:true},
    {k:"warp",label:"warp",min:0,max:1,step:.01,v:.52,rr:true},
    {k:"ridge",label:"ridge",min:0,max:1,step:.01,v:.50,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.30},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.58,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.58,rr:true}
  ],
  code:`
function build(){}
function _topoVal(x,y,t){
  const sc=map(P.scale,0,1,1.2,5.8);
  const warp=map(P.warp,0,1,0,.38);
  const dx=x-.5,dy=y-.5;
  let r=Math.sqrt(dx*dx+dy*dy);
  let a=Math.atan2(dy,dx);
  const n=noise(x*sc+10,y*sc+20,t*.16);
  r+=(n-.5)*warp*.22;
  const swirl=Math.sin(a*map(P.rings,0,1,3,18)+r*map(P.levels,0,1,16,56)-t*1.6)*.15;
  const field=noise(x*sc*1.35+swirl,y*sc*1.35-swirl,t*.11);
  return Math.max(0,Math.min(1,field*.55+(1-r*1.25)*.35+swirl*.25));
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const levels=Math.floor(map(P.levels,0,1,7,32));
  const ridge=map(P.ridge,0,1,1.2,4.5);
  const t=animT*map(P.speed,0,1,.08,1.2);
  g.background(
    Math.min(255,pal[0][0]*1.14+10),
    Math.min(255,pal[0][1]*1.14+10),
    Math.min(255,pal[0][2]*1.14+10)
  );
  const dc=g.drawingContext;
  const grad=dc.createRadialGradient(cx,cy,Math.min(W,H)*.08,cx,cy,Math.min(W,H)*.58);
  grad.addColorStop(0,"rgba(255,255,255,0.14)");
  grad.addColorStop(.45,"rgba(255,255,255,0.07)");
  grad.addColorStop(1,"rgba(255,255,255,0)");
  dc.fillStyle=grad; dc.fillRect(0,0,W,H);

  g.noFill();
  for(let lev=1;lev<levels;lev++){
    const th=lev/levels;
    const col=lev%2?pal[1]:pal[2];
    g.stroke(col[0],col[1],col[2],map(lev,1,levels,58,210));
    g.strokeWeight(map(P.ridge,0,1,.45,2.8));
    const loops=Math.floor(map(P.rings,0,1,5,18));
    for(let l=0;l<loops;l++){
      g.beginShape();
      const pts=220;
      for(let i=0;i<=pts+3;i++){
        const a=i/pts*TWO_PI;
        const base=(l+1)/loops*.46;
        const wob=(_topoVal(.5+Math.cos(a)*base,.5+Math.sin(a)*base,t)-th);
        const rr=(base+wob*.13*ridge)*Math.min(W,H);
        const z=(l/loops)*2-1;
        const scl=Math.abs(dep)>0.01?1-z*.22*dep:1;
        const x=cx+Math.cos(a)*rr*scl;
        const y=cy+Math.sin(a)*rr*scl+z*cy*.13*dep;
        g.curveVertex(x,y);
      }
      g.endShape(CLOSE);
    }
  }
}
function heightField(G){
  const out=new Float32Array(G*G);
  const t=animT*map(P.speed,0,1,.08,1.2);
  const levels=Math.floor(map(P.levels,0,1,7,32));
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    const x=i/(G-1),y=j/(G-1);
    const v=_topoVal(x,y,t);
    const q=Math.abs(v*levels-Math.round(v*levels));
    const ridge=Math.pow(Math.max(0,1-q*map(P.ridge,0,1,3,11)),2);
    out[i+j*G]=Math.min(1,ridge*(.45+v*.7));
  }
  _edgeMask(out,G); return out;
}` },

{ id:"ribbon_flow", title:"ribbon flow",
  system:[
    {k:"count",label:"count",min:0,max:1,step:.01,v:.46,sys:true},
    {k:"length",label:"length",min:0,max:1,step:.01,v:.62,rr:true},
    {k:"curl",label:"curl",min:0,max:1,step:.01,v:.56,rr:true},
    {k:"width",label:"width",min:0,max:1,step:.01,v:.42,rr:true},
    {k:"layering",label:"layering",min:0,max:1,step:.01,v:.50,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.34},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.62,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.60,rr:true}
  ],
  code:`
let RIBS=[];
function build(){
  const n=Math.floor(map(P.count,0,1,12,90));
  RIBS=[];
  for(let i=0;i<n;i++){
    RIBS.push({x:random(-.12,1.12),y:random(.08,.92),ph:random(TWO_PI),lane:random(),dir:random()<.5?-1:1});
  }
}
function _ribPt(r,u,t){
  const curl=map(P.curl,0,1,.4,5.6);
  const len=map(P.length,0,1,.12,.72);
  const x=r.x+(u-.5)*len;
  const wave=Math.sin(u*TWO_PI*curl+r.ph+t*1.25)*.12*P.curl;
  const y=r.y+wave+noise(x*2.4+r.ph,r.y*2.4,t*.2)*.10*P.curl;
  return [x,y];
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const t=animT*map(P.speed,0,1,.08,1.35);
  const width=map(P.width,0,1,1.2,18);
  const layers=Math.floor(map(P.layering,0,1,1,6));
  g.background(pal[0][0],pal[0][1],pal[0][2]);
  g.noFill();
  g.blendMode(ADD);
  for(const r of RIBS){
    for(let L=0;L<layers;L++){
      const off=(L-(layers-1)/2)*width*.42;
      const z=(r.lane*2-1);
      const scl=Math.abs(dep)>0.01?1-z*.24*dep:1;
      const col=(L+r.dir>0)?pal[1]:pal[2];
      g.stroke(col[0],col[1],col[2],map(r.lane,0,1,48,190));
      g.strokeWeight(width*(1-L*.10));
      g.beginShape();
      const steps=80;
      for(let i=0;i<=steps;i++){
        const u=i/steps;
        const p=_ribPt(r,u,t);
        const p2=_ribPt(r,Math.min(1,u+.01),t);
        const nx=-(p2[1]-p[1]), ny=(p2[0]-p[0]);
        const m=Math.sqrt(nx*nx+ny*ny)||1;
        const x=cx+(p[0]*W-cx)*scl+nx/m*off;
        const y=cy+(p[1]*H-cy)*scl+ny/m*off+z*cy*.14*dep;
        g.curveVertex(x,y);
      }
      g.endShape();
    }
  }
  g.blendMode(BLEND);
}
function heightField(G){
  const out=new Float32Array(G*G);
  const t=animT*map(P.speed,0,1,.08,1.35);
  const width=map(P.width,0,1,.006,.035);
  const stamp=(x,y,r,val)=>{
    const i0=Math.max(0,Math.floor((x-r)*(G-1))),i1=Math.min(G-1,Math.ceil((x+r)*(G-1)));
    const j0=Math.max(0,Math.floor((y-r)*(G-1))),j1=Math.min(G-1,Math.ceil((y+r)*(G-1)));
    for(let jj=j0;jj<=j1;jj++)for(let ii=i0;ii<=i1;ii++){
      const dx=ii/(G-1)-x,dy=jj/(G-1)-y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<r){const q=1-d/r;out[ii+jj*G]=Math.min(1,out[ii+jj*G]+q*q*val);}
    }
  };
  for(const r of RIBS){
    const steps=80;
    for(let i=0;i<=steps;i++){
      const u=i/steps,p=_ribPt(r,u,t);
      stamp(p[0],p[1],width,.35+r.lane*.65);
    }
  }
  _edgeMask(out,G); return out;
}` },

{ id:"glyph_field", title:"glyph field",
  system:[
    {k:"density",label:"density",min:0,max:1,step:.01,v:.52,sys:true},
    {k:"size",label:"size",min:0,max:1,step:.01,v:.46,rr:true},
    {k:"rotation",label:"rotation",min:0,max:1,step:.01,v:.44,rr:true},
    {k:"noise",label:"noise",min:0,max:1,step:.01,v:.52,rr:true},
    {k:"threshold",label:"threshold",min:0,max:1,step:.01,v:.46,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.26},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.52,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.58,rr:true}
  ],
  code:`
let GLYPHS=[];
function build(){
  const n=Math.floor(map(P.density,0,1,9,34));
  GLYPHS=[];
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){
    const x=(i+.5)/n,y=(j+.5)/n;
    const v=noise(x*5.1+seed*.01,y*5.1+17);
    if(v>P.threshold*.85) GLYPHS.push({x,y,v,kind:Math.floor(random(5)),rot:random(TWO_PI)});
  }
}
function _drawGlyph(g,x,y,sz,k,rot,col,alpha){
  g.push(); g.translate(x,y); g.rotate(rot); g.stroke(col[0],col[1],col[2],alpha); g.noFill(); g.strokeWeight(Math.max(1,sz*.09));
  if(k===0){ g.line(-sz*.4,0,sz*.4,0); g.line(0,-sz*.4,0,sz*.4); }
  else if(k===1){ g.rectMode(CENTER); g.rect(0,0,sz*.7,sz*.7); }
  else if(k===2){ g.circle(0,0,sz*.72); g.line(-sz*.35,0,sz*.35,0); }
  else if(k===3){ g.triangle(0,-sz*.44,sz*.42,sz*.32,-sz*.42,sz*.32); }
  else { g.line(-sz*.4,-sz*.4,sz*.4,sz*.4); g.line(sz*.4,-sz*.4,-sz*.4,sz*.4); }
  g.pop();
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const sz=map(P.size,0,1,10,52);
  const rotAmt=map(P.rotation,0,1,-Math.PI,Math.PI);
  const t=animT*map(P.speed,0,1,.08,1.0);
  g.background(pal[0][0],pal[0][1],pal[0][2]);
  for(const m of GLYPHS){
    const n=noise(m.x*7,m.y*7,t*.2);
    const z=(m.y*2-1);
    const scl=Math.abs(dep)>0.01?1-z*.20*dep:1;
    const x=cx+(m.x*W-cx)*scl+(n-.5)*P.noise*18;
    const y=cy+(m.y*H-cy)*scl+z*cy*.13*dep+(noise(m.y*7,m.x*7,t*.2)-.5)*P.noise*18;
    const col=m.kind%2?pal[1]:pal[2];
    _drawGlyph(g,x,y,sz*(.65+m.v*.7),m.kind,m.rot+rotAmt*n+t*.15,col,map(m.v,0,1,55,225));
  }
}
function heightField(G){
  const out=new Float32Array(G*G);
  const sz=map(P.size,0,1,.012,.045);
  const stamp=(x,y,r,val)=>{
    const i0=Math.max(0,Math.floor((x-r)*(G-1))),i1=Math.min(G-1,Math.ceil((x+r)*(G-1)));
    const j0=Math.max(0,Math.floor((y-r)*(G-1))),j1=Math.min(G-1,Math.ceil((y+r)*(G-1)));
    for(let jj=j0;jj<=j1;jj++)for(let ii=i0;ii<=i1;ii++){
      const dx=ii/(G-1)-x,dy=jj/(G-1)-y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<r){const q=1-d/r;out[ii+jj*G]=Math.min(1,out[ii+jj*G]+q*q*val);}
    }
  };
  for(const m of GLYPHS){
    stamp(m.x,m.y,sz*(.7+m.v*.9),.3+m.v*.7);
  }
  _edgeMask(out,G); return out;
}` },


{ id:"crystal_growth", title:"crystal growth",
  system:[
    {k:"branches",label:"branches",min:0,max:1,step:.01,v:.52,sys:true},
    {k:"spread",label:"spread",min:0,max:1,step:.01,v:.50,rr:true},
    {k:"segments",label:"segments",min:0,max:1,step:.01,v:.62,rr:true},
    {k:"jitter",label:"jitter",min:0,max:1,step:.01,v:.34,rr:true},
    {k:"thickness",label:"thickness",min:0,max:1,step:.01,v:.44,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.24},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.58,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.60,rr:true}
  ],
  code:`
let CRYS=[];
function build(){
  const arms=Math.floor(map(P.branches,0,1,5,18));
  CRYS=[];
  for(let a=0;a<arms;a++){
    const ang=a/arms*TWO_PI+random(-.12,.12);
    const len=random(.22,.48);
    const seg=Math.floor(map(P.segments,0,1,4,14));
    CRYS.push({ang,len,seg,ph:random(TWO_PI),fork:random(.25,.75)});
  }
}
function _crysPoint(c,u,t){
  const bend=Math.sin(u*PI+c.ph+t*.65)*P.jitter*.18;
  const a=c.ang+bend;
  const r=c.len*u*(.75+.25*Math.sin(t*.35+c.ph));
  return [.5+Math.cos(a)*r,.5+Math.sin(a)*r];
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const t=animT*map(P.speed,0,1,.08,1.2);
  const sw=map(P.thickness,0,1,.8,6.5);
  g.background(pal[0][0],pal[0][1],pal[0][2]);
  g.blendMode(ADD);
  for(const c of CRYS){
    const col=random()<.5?pal[1]:pal[2];
    g.stroke(col[0],col[1],col[2],180);
    g.strokeWeight(sw);
    g.noFill();
    g.beginShape();
    for(let i=0;i<=c.seg;i++){
      const u=i/c.seg,p=_crysPoint(c,u,t),z=(u*2-1);
      const scl=Math.abs(dep)>0.01?1-z*.20*dep:1;
      g.vertex(cx+(p[0]*W-cx)*scl,cy+(p[1]*H-cy)*scl+z*cy*.12*dep);
    }
    g.endShape();

    for(let f=.25;f<.9;f+=.22){
      const p=_crysPoint(c,f,t);
      const base=c.ang+(random()<.5?-1:1)*map(P.spread,0,1,.25,1.25);
      for(const side of [-1,1]){
        const a=base*side+c.ang*(1-side);
        const L=c.len*.22*(1-f);
        const z=(f*2-1);
        const scl=Math.abs(dep)>0.01?1-z*.20*dep:1;
        const x1=cx+(p[0]*W-cx)*scl,y1=cy+(p[1]*H-cy)*scl+z*cy*.12*dep;
        const x2=x1+Math.cos(a)*L*W,y2=y1+Math.sin(a)*L*H;
        g.strokeWeight(sw*.62); g.line(x1,y1,x2,y2);
      }
    }
  }
  g.blendMode(BLEND);
}
function heightField(G){
  const out=new Float32Array(G*G);
  const t=animT*map(P.speed,0,1,.08,1.2);
  const rad=map(P.thickness,0,1,.008,.035);
  const stamp=(x,y,r,val)=>{
    const i0=Math.max(0,Math.floor((x-r)*(G-1))),i1=Math.min(G-1,Math.ceil((x+r)*(G-1)));
    const j0=Math.max(0,Math.floor((y-r)*(G-1))),j1=Math.min(G-1,Math.ceil((y+r)*(G-1)));
    for(let jj=j0;jj<=j1;jj++)for(let ii=i0;ii<=i1;ii++){
      const dx=ii/(G-1)-x,dy=jj/(G-1)-y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<r){const q=1-d/r;out[ii+jj*G]=Math.min(1,out[ii+jj*G]+q*q*val);}
    }
  };
  for(const c of CRYS){
    for(let i=0;i<=c.seg*5;i++){
      const u=i/(c.seg*5),p=_crysPoint(c,u,t);
      stamp(p[0],p[1],rad,.35+u*.65);
    }
  }
  _edgeMask(out,G); return out;
}` },

{ id:"vector_scope", title:"vector scope",
  system:[
    {k:"traces",label:"traces",min:0,max:1,step:.01,v:.48,sys:true},
    {k:"gain",label:"gain",min:0,max:1,step:.01,v:.55,rr:true},
    {k:"phase",label:"phase",min:0,max:1,step:.01,v:.42,rr:true},
    {k:"fold",label:"fold",min:0,max:1,step:.01,v:.36,rr:true},
    {k:"glow",label:"glow",min:0,max:1,step:.01,v:.60,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.38},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.54,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.60,rr:true}
  ],
  code:`
function build(){}
function _scopePoint(u,t,layer){
  const gain=map(P.gain,0,1,.22,.48);
  const ph=map(P.phase,0,1,0,TWO_PI);
  const fold=Math.floor(map(P.fold,0,1,1,7));
  const a=u*TWO_PI;
  const x=Math.sin(a*(2+fold)+ph+t*.9+layer*.7)*gain + Math.sin(a*3+t*.4)*gain*.28;
  const y=Math.sin(a*(3+fold*.5)-ph+t*1.1+layer*1.3)*gain + Math.cos(a*2-t*.5)*gain*.24;
  return [.5+x,.5+y];
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const t=animT*map(P.speed,0,1,.08,1.45);
  const layers=Math.floor(map(P.traces,0,1,2,14));
  g.background(pal[0][0],pal[0][1],pal[0][2]);
  g.noFill();
  g.blendMode(ADD);
  for(let L=0;L<layers;L++){
    const col=L%2?pal[1]:pal[2];
    const z=(L/(layers-1||1))*2-1;
    const scl=Math.abs(dep)>0.01?1-z*.24*dep:1;
    g.stroke(col[0],col[1],col[2],map(P.glow,0,1,45,190));
    g.strokeWeight(map(P.glow,0,1,.8,3.8));
    g.beginShape();
    for(let i=0;i<=360;i++){
      const p=_scopePoint(i/360,t,L);
      g.curveVertex(cx+(p[0]*W-cx)*scl,cy+(p[1]*H-cy)*scl+z*cy*.14*dep);
    }
    g.endShape(CLOSE);
  }
  g.blendMode(BLEND);
}
function heightField(G){
  const out=new Float32Array(G*G);
  const t=animT*map(P.speed,0,1,.08,1.45);
  const layers=Math.floor(map(P.traces,0,1,2,14));
  const stamp=(x,y,r,val)=>{
    const i0=Math.max(0,Math.floor((x-r)*(G-1))),i1=Math.min(G-1,Math.ceil((x+r)*(G-1)));
    const j0=Math.max(0,Math.floor((y-r)*(G-1))),j1=Math.min(G-1,Math.ceil((y+r)*(G-1)));
    for(let jj=j0;jj<=j1;jj++)for(let ii=i0;ii<=i1;ii++){
      const dx=ii/(G-1)-x,dy=jj/(G-1)-y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<r){const q=1-d/r;out[ii+jj*G]=Math.min(1,out[ii+jj*G]+q*q*val);}
    }
  };
  for(let L=0;L<layers;L++)for(let i=0;i<260;i++){
    const p=_scopePoint(i/260,t,L);
    stamp(p[0],p[1],.018,.22+L/layers*.55);
  }
  _edgeMask(out,G); return out;
}` },

{ id:"wave_lattice", title:"wave lattice",
  system:[
    {k:"density",label:"density",min:0,max:1,step:.01,v:.54,sys:true},
    {k:"amp",label:"amplitude",min:0,max:1,step:.01,v:.52,rr:true},
    {k:"freq",label:"frequency",min:0,max:1,step:.01,v:.44,rr:true},
    {k:"phase",label:"phase",min:0,max:1,step:.01,v:.46,rr:true},
    {k:"warp",label:"warp",min:0,max:1,step:.01,v:.38,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.32},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.60,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.60,rr:true}
  ],
  code:`
function build(){}
function _waveVal(x,y,t){
  const f=map(P.freq,0,1,3,22);
  const w=P.warp*.35;
  const n=noise(x*3.2+8,y*3.2+13,t*.14);
  x+=(n-.5)*w; y+=(noise(y*3.2,x*3.2,t*.16)-.5)*w;
  const a=Math.sin((x+y)*f+t*1.2);
  const b=Math.sin((x-y)*f*1.13-t*.9+P.phase*TWO_PI);
  const c=Math.sin(Math.sqrt((x-.5)*(x-.5)+(y-.5)*(y-.5))*f*2.2-t*.7);
  return (a+b+c)/3*.5+.5;
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const t=animT*map(P.speed,0,1,.08,1.4);
  const n=Math.floor(map(P.density,0,1,14,58));
  const amp=map(P.amp,0,1,4,42);
  g.background(
    Math.min(255,pal[0][0]*1.22+14),
    Math.min(255,pal[0][1]*1.22+14),
    Math.min(255,pal[0][2]*1.22+14)
  );
  g.push();
  g.noStroke();
  g.fill(255,255,255,22);
  g.rect(0,0,W,H);
  g.pop();
  g.noFill();
  for(let pass=0;pass<2;pass++){
    const col=pass?pal[1]:pal[2];
    g.stroke(
      Math.min(255,col[0]*1.22+20),
      Math.min(255,col[1]*1.22+20),
      Math.min(255,col[2]*1.22+20),
      pass?205:150
    );
    g.strokeWeight(pass?2.2:1.25);
    for(let j=0;j<n;j++){
      g.beginShape();
      for(let i=0;i<n;i++){
        const x=i/(n-1),y=j/(n-1);
        const v=_waveVal(x,y,t);
        const z=(v-.5)*2;
        const scl=Math.abs(dep)>0.01?1-z*.18*dep:1;
        const px=cx+(x*W-cx)*scl;
        const py=cy+(y*H-cy)*scl+Math.sin(v*TWO_PI)*amp+z*cy*.10*dep;
        if(pass) g.vertex(px,py); else g.curveVertex(px,py);
      }
      g.endShape();
    }
    for(let i=0;i<n;i++){
      g.beginShape();
      for(let j=0;j<n;j++){
        const x=i/(n-1),y=j/(n-1);
        const v=_waveVal(x,y,t);
        const z=(v-.5)*2;
        const scl=Math.abs(dep)>0.01?1-z*.18*dep:1;
        const px=cx+(x*W-cx)*scl+Math.cos(v*TWO_PI)*amp*.22;
        const py=cy+(y*H-cy)*scl+z*cy*.10*dep;
        if(pass) g.vertex(px,py); else g.curveVertex(px,py);
      }
      g.endShape();
    }
  }
}
function heightField(G){
  const out=new Float32Array(G*G);
  const t=animT*map(P.speed,0,1,.08,1.4);
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    const x=i/(G-1),y=j/(G-1),v=_waveVal(x,y,t);
    out[i+j*G]=Math.pow(v,map(P.amp,0,1,1.8,.65));
  }
  _edgeMask(out,G); return out;
}` },


{ id:"fractal_tiles", title:"fractal tiles",
  system:[
    {k:"density",label:"density",min:0,max:1,step:.01,v:.56,sys:true},
    {k:"scale",label:"scale",min:0,max:1,step:.01,v:.48,rr:true},
    {k:"folds",label:"folds",min:0,max:1,step:.01,v:.58,rr:true},
    {k:"drift",label:"drift",min:0,max:1,step:.01,v:.36,rr:true},
    {k:"edge",label:"edge",min:0,max:1,step:.01,v:.50,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.28},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.56,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.60,rr:true}
  ],
  code:`
function build(){}
function _tileVal(x,y,t){
  const sc=map(P.scale,0,1,2.2,9.5);
  let px=(x-.5)*sc, py=(y-.5)*sc;
  const folds=Math.floor(map(P.folds,0,1,2,8));
  for(let i=0;i<folds;i++){
    px=Math.abs(px)-.62;
    py=Math.abs(py)-.62;
    const a=.55+Math.sin(t*.18+i)*.18;
    const nx=px*Math.cos(a)-py*Math.sin(a);
    const ny=px*Math.sin(a)+py*Math.cos(a);
    px=nx; py=ny;
  }
  const grid=Math.abs(Math.sin((px+py+t*P.drift)*PI))*Math.abs(Math.sin((px-py-t*P.drift*.7)*PI));
  const n=noise(x*6+seed*.01,y*6+19,t*.12);
  return Math.min(1,Math.max(0,grid*.72+n*.28));
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const t=animT*map(P.speed,0,1,.08,1.25);
  const cells=Math.floor(map(P.density,0,1,14,58));
  const cw=W/cells,ch=H/cells;
  g.background(Math.min(255,pal[0][0]*1.16+12),Math.min(255,pal[0][1]*1.16+12),Math.min(255,pal[0][2]*1.16+12));
  g.noStroke();
  for(let j=0;j<cells;j++)for(let i=0;i<cells;i++){
    const x=(i+.5)/cells,y=(j+.5)/cells;
    const v=_tileVal(x,y,t);
    if(v<map(P.edge,0,1,.12,.46)) continue;
    const z=(v-.5)*2;
    const scl=Math.abs(dep)>0.01?1-z*.18*dep:1;
    const px=cx+(x*W-cx)*scl,py=cy+(y*H-cy)*scl+z*cy*.10*dep;
    const col=v>.58?pal[2]:pal[1];
    g.fill(Math.min(255,col[0]*1.18+18),Math.min(255,col[1]*1.18+18),Math.min(255,col[2]*1.18+18),map(v,0,1,60,230));
    g.rectMode(CENTER);
    const sz=map(v,0,1,.25,.95);
    g.rect(px,py,cw*sz,ch*sz,Math.max(0,2*sz));
  }
}
function heightField(G){
  const out=new Float32Array(G*G);
  const t=animT*map(P.speed,0,1,.08,1.25);
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    const x=i/(G-1),y=j/(G-1),v=_tileVal(x,y,t);
    const e=map(P.edge,0,1,.10,.42);
    out[i+j*G]=v>e?Math.pow(v,1.35):0;
  }
  _edgeMask(out,G); return out;
}` },

{ id:"plasma_membrane", title:"plasma membrane",
  system:[
    {k:"cells",label:"cells",min:0,max:1,step:.01,v:.50,sys:true},
    {k:"flow",label:"flow",min:0,max:1,step:.01,v:.54,rr:true},
    {k:"softness",label:"softness",min:0,max:1,step:.01,v:.48,rr:true},
    {k:"veins",label:"veins",min:0,max:1,step:.01,v:.46,rr:true},
    {k:"glow",label:"glow",min:0,max:1,step:.01,v:.58,rr:true},
    {k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},
    {k:"speed",label:"speed",min:0,max:1,step:.01,v:.34},
    {k:"pal",label:"palette",min:0,max:9,step:1,v:4},
    {k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},
    {k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.60,rr:true},
    {k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.62,rr:true}
  ],
  code:`
function build(){}
function _plasmaVal(x,y,t){
  const sc=map(P.cells,0,1,2.5,8.5);
  const flow=map(P.flow,0,1,.08,.62);
  const n1=noise(x*sc+t*flow,y*sc-t*flow,seed*.01);
  const n2=noise(x*sc*2.1-n1*.7,y*sc*2.1+n1*.7,t*.16);
  const r=Math.sqrt((x-.5)*(x-.5)+(y-.5)*(y-.5));
  const membrane=Math.sin((n1+n2+r*.9+t*.12)*TWO_PI*map(P.veins,0,1,1.5,5.5))*.5+.5;
  return Math.max(0,Math.min(1,n1*.48+n2*.32+membrane*.20));
}
function render(g,pal){
  const W=g.width,H=g.height,cx=W/2,cy=H/2,dep=P.zdepth||0;
  const t=animT*map(P.speed,0,1,.08,1.35);
  const step=Math.floor(map(P.softness,0,1,16,6));
  g.background(Math.min(255,pal[0][0]*1.12+10),Math.min(255,pal[0][1]*1.12+10),Math.min(255,pal[0][2]*1.12+10));
  g.noStroke();
  for(let y=0;y<H;y+=step)for(let x=0;x<W;x+=step){
    const nx=x/W,ny=y/H;
    const v=_plasmaVal(nx,ny,t);
    const z=(v-.5)*2;
    const scl=Math.abs(dep)>0.01?1-z*.16*dep:1;
    const px=cx+(x-cx)*scl,py=cy+(y-cy)*scl+z*cy*.10*dep;
    const col=v>.55?pal[2]:pal[1];
    const a=map(v,0,1,38,210)*map(P.glow,0,1,.65,1.25);
    g.fill(Math.min(255,col[0]*1.18+18),Math.min(255,col[1]*1.18+18),Math.min(255,col[2]*1.18+18),a);
    g.circle(px,py,step*map(v,0,1,1.0,2.8));
  }
  g.noFill();
  g.stroke(pal[2][0],pal[2][1],pal[2][2],map(P.glow,0,1,35,145));
  g.strokeWeight(map(P.veins,0,1,.4,2.2));
  const rings=Math.floor(map(P.veins,0,1,4,18));
  for(let r=1;r<rings;r++){
    g.beginShape();
    const rad=r/rings*.46*Math.min(W,H);
    for(let i=0;i<=180;i++){
      const a=i/180*TWO_PI;
      const nx=.5+Math.cos(a)*rad/W,ny=.5+Math.sin(a)*rad/H;
      const v=_plasmaVal(nx,ny,t);
      const rr=rad+(v-.5)*map(P.flow,0,1,8,52);
      g.curveVertex(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);
    }
    g.endShape(CLOSE);
  }
}
function heightField(G){
  const out=new Float32Array(G*G);
  const t=animT*map(P.speed,0,1,.08,1.35);
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    const x=i/(G-1),y=j/(G-1),v=_plasmaVal(x,y,t);
    out[i+j*G]=Math.pow(v,map(P.softness,0,1,1.8,.75));
  }
  _edgeMask(out,G); return out;
}` },

{ id:"flow_field", title:"flow field",
  system:[{k:"density",label:"density",min:0,max:1,step:.01,v:.65},{k:"scale",label:"scale",min:0,max:1,step:.01,v:.4},{k:"turbulence",label:"turbulence",min:0,max:1,step:.01,v:.5},{k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4}],
  code:`
function build(){}
function render(g,pal){
  const n=floor(map(P.density,0,1,80,6000)), s=map(P.scale,0,1,0.0008,0.006), turb=map(P.turbulence,0,1,1,7);
  const dep=P.zdepth||0,cx=g.width/2,cy=g.height/2;
  g.noFill();
  for(let i=0;i<n;i++){
    let x=random(g.width), y=random(g.height);
    const y0=y;
    const c=random()<0.5?pal[1]:pal[2];
    const pts=[];
    for(let j=0;j<55;j++){
      pts.push(x,y);
      const a=noise(x*s,y*s,animT*P.speed*0.55)*TWO_PI*turb; x+=cos(a)*1.6; y+=sin(a)*1.6;
      if(x<0||x>g.width||y<0||y>g.height) break;
    }
    if(pts.length<6) continue;
    const tf=Math.max(0,Math.min(1,y0/g.height)), z=tf*2-1;
    // contour_field-style z staging
    const scl=Math.abs(dep)>0.01?1-z*0.36*dep:1, yOff=Math.abs(dep)>0.01?z*cy*0.34*dep:0;
    const alpha=Math.abs(dep)>0.01?Math.floor(lerp(80,220,tf*(1+dep*0.35))):45;
    const sw=Math.abs(dep)>0.01?1.1*(1+z*0.5*dep):1.1;
    g.strokeWeight(sw);
    g.stroke(min(255,c[0]*(1.25+0.5*tf*dep)),min(255,c[1]*(1.25+0.5*tf*dep)),min(255,c[2]*(1.25+0.5*tf*dep)),alpha);
    g.beginShape();
    for(let j=0;j<pts.length;j+=2){
      const px=cx+(pts[j]-cx)*scl, py=cy+(pts[j+1]-cy)*scl+yOff;
      g.curveVertex(px,py);
    }
    g.endShape();
  }
}` },

{ id:"reaction_diffusion", title:"reaction diffusion",
  system:[{k:"feed",label:"feed",min:0,max:.17,step:.01,v:.03},{k:"kill",label:"kill",min:.5,max:.75,step:.01,v:.51},{k:"spots",label:"seed spots",min:0,max:.30,step:.01,v:.30},{k:"pix",label:"pixel size",min:0,max:1,step:.01,v:.5},{k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4},{k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},{k:"esize",g:"extrude",label:"size",min:0,max:1,step:.01,v:.5,rr:true},{k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5,rr:true},{k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.5,rr:true}],
  code:`
let RDA,RDB,RDA2,RDB2,RDG,RDWS;
function build(){
  const G=RDG=170; let a=new Float32Array(G*G).fill(1),b=new Float32Array(G*G),a2=new Float32Array(G*G),b2=new Float32Array(G*G);
  const spots=floor(map(Math.min(P.spots,0.30),0,0.30,2,12));
  for(let s=0;s<spots;s++){ const cx=floor(random(G)),cy=floor(random(G)),r=floor(random(2,5));
    for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++){ if(x*x+y*y<=r*r){const px=(cx+x+G)%G,py=(cy+y+G)%G; b[px+py*G]=1;} } }
  const f=map(Math.min(P.feed,0.17),0,0.17,0.018,0.034), k=map(Math.min(Math.max(P.kill,0.5),0.75),0.5,0.75,0.052,0.066);
  const ws=RDWS=[[-1,0,.2],[1,0,.2],[0,-1,.2],[0,1,.2],[-1,-1,.05],[1,-1,.05],[-1,1,.05],[1,1,.05]];
  for(let it=0;it<1600;it++){ for(let y=1;y<G-1;y++)for(let x=1;x<G-1;x++){ const i=x+y*G; let la=-a[i],lb=-b[i];
      for(const w of ws){const j=i+w[0]+w[1]*G; la+=a[j]*w[2]; lb+=b[j]*w[2];}
      const ab=a[i]*b[i]*b[i];
      a2[i]=Math.min(1,Math.max(0,a[i]+la-ab+f*(1-a[i]))); b2[i]=Math.min(1,Math.max(0,b[i]+0.5*lb+ab-(k+f)*b[i])); }
    let t=a;a=a2;a2=t; t=b;b=b2;b2=t; }
  RDA=a; RDB=b; RDA2=a2; RDB2=b2;
}
function render(g,pal){ const G=RDG;
  // Animate the reaction field itself. This is form motion, not 2D frame motion.
  if(P.speed>0 && RDA && RDB && RDA2 && RDB2){
    let a=RDA, b=RDB, a2=RDA2, b2=RDB2;
    const ws=RDWS;
    const f=map(Math.min(P.feed,0.17),0,0.17,0.018,0.034);
    const k=map(Math.min(Math.max(P.kill,0.5),0.75),0.5,0.75,0.052,0.066);
    const steps=floor(map(P.speed,0,1,2,14));
    for(let it=0;it<steps;it++){
      for(let y=1;y<G-1;y++)for(let x=1;x<G-1;x++){
        const i=x+y*G; let la=-a[i],lb=-b[i];
        for(const w of ws){const j=i+w[0]+w[1]*G; la+=a[j]*w[2]; lb+=b[j]*w[2];}
        const ab=a[i]*b[i]*b[i];
        a2[i]=Math.min(1,Math.max(0,a[i]+la-ab+f*(1-a[i])));
        b2[i]=Math.min(1,Math.max(0,b[i]+0.5*lb+ab-(k+f)*b[i]));
      }
      let t=a;a=a2;a2=t; t=b;b=b2;b2=t;
    }
    RDA=a; RDB=b; RDA2=a2; RDB2=b2;
  }
  const cells=floor(map(P.pix,0,1,260,6));
  const img=makeField(G,(x,y)=>{
    const qx=Math.min(G-1,floor(floor(x/G*cells)/cells*G));
    const qy=Math.min(G-1,floor(floor(y/G*cells)/cells*G));
    const raw=Math.min(1,Math.max(0,RDA[qx+qy*G]-RDB[qx+qy*G])); const v=Math.min(1,raw*4.2);
    return [lerp(pal[2][0],pal[0][0],v),lerp(pal[2][1],pal[0][1],v),lerp(pal[2][2],pal[0][2],v)]; });
  const dep=P.zdepth||0;
  if(Math.abs(dep)>0.01){
    const cx=g.width/2, cy=g.height/2;
    for(let l=0;l<7;l++){
      const tf=l/6, z=tf*2-1;
      const scl=1-z*0.38*dep, yOff=z*cy*0.34*dep;
      g.push(); g.tint(255,Math.floor(lerp(42,185,tf)));
      g.translate(cx,cy+yOff); g.scale(scl); g.image(img,-g.width/2,-g.height/2,g.width,g.height);
      g.pop();
    }
    g.noTint();
  } else g.image(img,0,0,g.width,g.height); }
function heightField(G){ const sG=RDG, out=new Float32Array(G*G);
  // Keep reaction_diffusion animated even when extrusion is active.
  // The engine calls heightField() instead of render() for extrude mode.
  if(P.speed>0 && RDA && RDB && RDA2 && RDB2){
    let a=RDA, b=RDB, a2=RDA2, b2=RDB2;
    const ws=RDWS;
    const f=map(Math.min(P.feed,0.17),0,0.17,0.018,0.034);
    const k=map(Math.min(Math.max(P.kill,0.5),0.75),0.5,0.75,0.052,0.066);
    const steps=floor(map(P.speed,0,1,2,14));
    for(let it=0;it<steps;it++){
      for(let y=1;y<sG-1;y++)for(let x=1;x<sG-1;x++){
        const idx=x+y*sG; let la=-a[idx],lb=-b[idx];
        for(const w of ws){const jj=idx+w[0]+w[1]*sG; la+=a[jj]*w[2]; lb+=b[jj]*w[2];}
        const ab=a[idx]*b[idx]*b[idx];
        a2[idx]=Math.min(1,Math.max(0,a[idx]+la-ab+f*(1-a[idx])));
        b2[idx]=Math.min(1,Math.max(0,b[idx]+0.5*lb+ab-(k+f)*b[idx]));
      }
      let t=a;a=a2;a2=t; t=b;b=b2;b2=t;
    }
    RDA=a; RDB=b; RDA2=a2; RDB2=b2;
  }
  for(let j=0;j<G;j++) for(let i=0;i<G;i++){
    // Extrusion samples an inset version of the reaction field so border artifacts do not become geometry.
    const m=0.12;
    const u=m+(i/(G-1))*(1-2*m);
    const v=m+(j/(G-1))*(1-2*m);
    const si=Math.floor(u*(sG-1)), sj=Math.floor(v*(sG-1));

    const raw=Math.min(1,Math.max(0,RDA[si+sj*sG]-RDB[si+sj*sG]));
    const flatV=Math.min(1,raw*4.2);
    const form=1.0-flatV;

    // Extrude size controls how wide the raised particles/forms are.
    // Lower threshold = larger raised forms; higher threshold = tighter raised cores.
    const esize=(P.esize===undefined?0.5:P.esize); const sizeGate=0.88 - esize*0.78;
    let h=Math.min(1,Math.max(0,(form-sizeGate)*2.1));
    h=h*h*(3-2*h);

    out[i+j*G]=h;
  }
  _edgeMask(out,G); _pxQ(out,G); return out; }` },

{ id:"voronoi", title:"voronoi",
  system:[{k:"density",label:"density",min:0,max:1,step:.01,v:.55},{k:"relax",label:"relax",min:0,max:1,step:.01,v:.4},{k:"edgefill",label:"edge / fill",min:0,max:1,step:.01,v:.5},{k:"pix",label:"pixel size",min:0,max:1,step:.01,v:.5},{k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4},{k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},{k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5,rr:true},{k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.5,rr:true}],
  code:`
let VPTS;
function build(){ const n=floor(map(P.density,0,1,24,260)); let pts=[]; for(let i=0;i<n;i++)pts.push([random(1),random(1)]);
  const iters=floor(map(P.relax,0,1,0,6));
  for(let k=0;k<iters;k++){ const sx=pts.map(()=>0),sy=pts.map(()=>0),cn=pts.map(()=>0); const S=72;
    for(let yy=0;yy<S;yy++)for(let xx=0;xx<S;xx++){ const px=xx/S,py=yy/S; let bi=0,bd=1e9;
      for(let i=0;i<pts.length;i++){const dx=px-pts[i][0],dy=py-pts[i][1],d=dx*dx+dy*dy; if(d<bd){bd=d;bi=i;}}
      sx[bi]+=px;sy[bi]+=py;cn[bi]++; }
    pts=pts.map((p,i)=>cn[i]?[sx[i]/cn[i],sy[i]/cn[i]]:p); }
  VPTS=pts; }
function render(g,pal){ const F=840, ef=P.edgefill, dep=P.zdepth||0;
  const t=animT*P.speed*2.0;
  const pts=VPTS.map((p,i)=>[p[0]+Math.sin(t*0.55+i*1.91)*0.04,p[1]+Math.cos(t*0.43+i*2.73)*0.04]);
  const cols=pts.map((p,i)=> i%2?pal[1]:pal[2]);
  // Higher field resolution lowers the minimum visible pixel size.
  const cells=floor(map(P.pix,0,1,F,6));
  const img=makeField(F,(x,y)=>{ const px=floor(x/F*cells)/cells, py=floor(y/F*cells)/cells; let b0=1e9,b1=1e9,bi=0;
    for(let i=0;i<pts.length;i++){const dx=px-pts[i][0],dy=py-pts[i][1],d=dx*dx+dy*dy; if(d<b0){b1=b0;b0=d;bi=i;}else if(d<b1)b1=d;}
    const edge=Math.sqrt(b1)-Math.sqrt(b0);
    if(edge<map(ef,0,1,0.005,0.0010)) return pal[1];
    const c=cols[bi], t=ef*0.85;
    const z=(pts[bi][1]*2-1), sh=Math.abs(dep)>0.01?1+z*0.34*dep:1;
    return [Math.min(255,lerp(pal[0][0],c[0],t)*sh),Math.min(255,lerp(pal[0][1],c[1],t)*sh),Math.min(255,lerp(pal[0][2],c[2],t)*sh)]; });
  if(Math.abs(dep)>0.01){
    const cx=g.width/2, cy=g.height/2;
    // stacked / recursive plate feel for Voronoi
    for(let l=0;l<9;l++){
      const tf=l/8, z=tf*2-1;
      const scl=1-z*0.42*dep, yOff=z*cy*0.38*dep;
      g.push();
      g.tint(255,Math.floor(lerp(38,210,tf)));
      g.translate(cx,cy+yOff);
      g.scale(scl);
      g.image(img,-g.width/2,-g.height/2,g.width,g.height);
      g.pop();
    }
    g.noTint();
  } else g.image(img,0,0,g.width,g.height); }
function heightField(G){ const pts=VPTS, out=new Float32Array(G*G);
  const cH=pts.map((p,i)=>((i*1234567+987)%1000)/1000*0.8+0.2);
  for(let j=0;j<G;j++) for(let i=0;i<G;i++){
    const px=i/G, py=j/G; let b0=1e9,bi=0;
    for(let k=0;k<pts.length;k++){const dx=px-pts[k][0],dy=py-pts[k][1],d=dx*dx+dy*dy;if(d<b0){b0=d;bi=k;}}
    out[i+j*G]=cH[bi]; }
  _edgeMask(out,G); _pxQ(out,G); return out; }` },

{ id:"contour_field", title:"contour field",
  system:[{k:"scale",label:"scale",min:0,max:1,step:.01,v:.4},{k:"levels",label:"levels",min:0,max:1,step:.01,v:.5},{k:"turbulence",label:"turbulence",min:0,max:1,step:.01,v:.4},{k:"depth",label:"depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4},{k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},{k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.6,rr:true},{k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.5,rr:true}],
  code:`
function build(){}
function contourSegments(w,h,pal){ const R=Math.max(5,Math.floor(w/200)), C=Math.floor(w/R), Rj=Math.floor(h/R);
  const s=map(P.scale,0,1,0.002,0.012), turb=map(P.turbulence,0,1,1,4);
  const fv=(x,y)=>{let v=0,amp=1,fr=1; for(let o=0;o<4;o++){v+=noise(x*s*fr,y*s*fr,animT*P.speed*0.35+o*2.3)*amp;amp*=.5;fr*=1.6*turb;} return v;};
  const fld=[]; for(let j=0;j<=Rj;j++){const row=[];for(let i=0;i<=C;i++)row.push(fv(i*R,j*R));fld.push(row);}
  let mn=1e9,mx=-1e9; for(const r of fld)for(const v of r){mn=Math.min(mn,v);mx=Math.max(mx,v);}
  const L=floor(map(P.levels,0,1,5,26));
  const ix=(p,q,va,vb)=>{const t=(thr-va)/((vb-va)||1e-6);return [lerp(p[0],q[0],t),lerp(p[1],q[1],t)];};
  let thr=0, segs=[];
  for(let l=1;l<L;l++){ thr=mn+(mx-mn)*l/L; const t=l/L;
    const col=[lerp(pal[1][0],pal[2][0],t),lerp(pal[1][1],pal[2][1],t),lerp(pal[1][2],pal[2][2],t)];
    for(let j=0;j<Rj;j++)for(let i=0;i<C;i++){
      const a=fld[j][i],b=fld[j][i+1],c=fld[j+1][i+1],d=fld[j+1][i],x=i*R,y=j*R;
      const TL=[x,y],TR=[x+R,y],BR=[x+R,y+R],BL=[x,y+R];
      let st=(a>thr?8:0)|(b>thr?4:0)|(c>thr?2:0)|(d>thr?1:0);
      const e={top:ix(TL,TR,a,b),right:ix(TR,BR,b,c),bottom:ix(BL,BR,d,c),left:ix(TL,BL,a,d)};
      const sg=(p,q)=>segs.push({p:p,q:q,c:col,t:t});
      if(st===1||st===14)sg(e.left,e.bottom); else if(st===2||st===13)sg(e.bottom,e.right);
      else if(st===3||st===12)sg(e.left,e.right); else if(st===4||st===11)sg(e.top,e.right);
      else if(st===5){sg(e.left,e.top);sg(e.bottom,e.right);} else if(st===6||st===9)sg(e.top,e.bottom);
      else if(st===7||st===8)sg(e.left,e.top); else if(st===10){sg(e.left,e.bottom);sg(e.top,e.right);} } }
  return segs;
}
function chainContours(segs){
  const key=p=>Math.round(p[0]*2)+'_'+Math.round(p[1]*2);
  const map={};
  segs.forEach((s,i)=>{
    (map[key(s.p)]||(map[key(s.p)]=[])).push({i,end:'p'});
    (map[key(s.q)]||(map[key(s.q)]=[])).push({i,end:'q'});
  });
  const used=new Uint8Array(segs.length);
  const chains=[];
  for(let i=0;i<segs.length;i++){
    if(used[i]) continue; used[i]=1;
    const ch={pts:[segs[i].p,segs[i].q],c:segs[i].c,t:segs[i].t};
    for(let pass=0;pass<2;pass++){
      let go=true;
      while(go){ go=false;
        const tip=pass===0?ch.pts[ch.pts.length-1]:ch.pts[0];
        for(const {i:j,end} of (map[key(tip)]||[])){
          if(used[j]) continue; used[j]=1;
          const np=end==='p'?segs[j].q:segs[j].p;
          pass===0?ch.pts.push(np):ch.pts.unshift(np);
          go=true; break;
        }
      }
    }
    chains.push(ch);
  }
  return chains;
}
function render(g,pal){
  const chains=chainContours(contourSegments(g.width,g.height,pal));
  const dep=P.depth||0;
  const cx=g.width/2, cy=g.height/2;
  // sort back-to-front so front levels paint over back levels
  if(Math.abs(dep)>0.01) chains.sort((a,b)=>(a.t||0)-(b.t||0));
  g.noFill();
  for(const ch of chains){
    const tf=ch.t||0;
    const z=tf*2-1; // -1=back, +1=front
    const scl=Math.abs(dep)>0.01?1-z*0.36*dep:1;
    const yOff=Math.abs(dep)>0.01?z*cy*0.34*dep:0;
    const alpha=Math.abs(dep)>0.01?Math.floor(lerp(80,255,tf*(1+dep*0.4))):255;
    const sw=Math.abs(dep)>0.01?1.1*(1+z*0.5*dep):1.1;
    g.strokeWeight(sw);
    g.stroke(ch.c[0],ch.c[1],ch.c[2],alpha);
    const pts=ch.pts; if(pts.length<2) continue;
    g.beginShape();
    const tx=p=>[cx+(p[0]-cx)*scl, cy+(p[1]-cy)*scl+yOff];
    const f=tx(pts[0]); g.curveVertex(f[0],f[1]);
    for(const p of pts){const r=tx(p);g.curveVertex(r[0],r[1]);}
    const l=tx(pts[pts.length-1]); g.curveVertex(l[0],l[1]);
    g.endShape();
  }
}
function heightField(G){
  const out=new Float32Array(G*G);
  const s=map(P.scale,0,1,0.002,0.012), turb=map(P.turbulence,0,1,1,4);
  let mn=1e9,mx=-1e9;
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    let v=0,amp=1,fr=1;
    for(let o=0;o<4;o++){v+=noise(i*s*fr,j*s*fr,animT*P.speed*0.35+o*2.3)*amp;amp*=.5;fr*=1.6*turb;}
    out[i+j*G]=v; mn=Math.min(mn,v); mx=Math.max(mx,v);
  }
  const rng=mx-mn||1;
  const hv=map(P.hvar,0,1,0.2,1.0);
  for(let k=0;k<out.length;k++) out[k]=Math.pow((out[k]-mn)/rng,1)*hv;
  _edgeMask(out,G); return out;
}
function renderSVG(){
  randomSeed(seed); noiseSeed(seed);
  const pal=getPal(), segs=contourSegments(W,H,pal);
  let svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><rect width="'+W+'" height="'+H+'" fill="'+svgColor(pal[0])+'"/>';
  for(const s of segs){ svg+='<path d="M '+svgNum(s.p[0])+' '+svgNum(s.p[1])+' L '+svgNum(s.q[0])+' '+svgNum(s.q[1])+'" fill="none" stroke="'+svgColor(s.c)+'" stroke-width="1.1" stroke-linecap="round"/>'; }
  downloadSVG(svg+'</svg>');
}` },

{ id:"truchet", title:"truchet",
  system:[{k:"density",label:"density",min:0,max:1,step:.01,v:.45},{k:"weight",label:"weight",min:0,max:1,step:.01,v:.4},{k:"clustering",label:"clustering",min:0,max:1,step:.01,v:0},{k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4},{k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},{k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5,rr:true},{k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.5,rr:true}],
  code:`
function build(){}
function render(g,pal){ const n=floor(map(P.density,0,1,6,40)), cs=Math.min(g.width,g.height)/n;
  const cols=Math.ceil(g.width/cs), rows=Math.ceil(g.height/cs), dep=P.zdepth||0, cx=g.width/2, cy=g.height/2;
  g.noFill(); g.strokeCap(SQUARE);
  const ns=map(P.clustering,0,1,3.5,0.12), spd=map(P.speed,0,1,0,0.08), baseW=map(P.weight,0,1,1,cs*0.4);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){ const x=i*cs,y=j*cs;
    const tf=(j+0.5)/rows, z=tf*2-1;
    // contour_field-style z staging
    const scl=Math.abs(dep)>0.01?1-z*0.36*dep:1, yOff=Math.abs(dep)>0.01?z*cy*0.34*dep:0;
    const x2=cx+(x-cx)*scl, y2=cy+(y-cy)*scl+yOff, cs2=cs*scl;
    const bias=noise(i*ns,j*ns,animT*spd); const flip=bias<0.5; const c=(i+j)%2?pal[1]:pal[2];
    const sh=Math.abs(dep)>0.01?1+z*0.28*dep:1;
    g.strokeWeight(baseW*(1+tf*0.45*dep));
    g.stroke(Math.min(255,c[0]*sh),Math.min(255,c[1]*sh),Math.min(255,c[2]*sh),Math.abs(dep)>0.01?Math.floor(120+135*tf):255);
    if(flip){ g.arc(x2,y2,cs2,cs2,0,HALF_PI); g.arc(x2+cs2,y2+cs2,cs2,cs2,PI,PI+HALF_PI); }
    else { g.arc(x2+cs2,y2,cs2,cs2,HALF_PI,PI); g.arc(x2,y2+cs2,cs2,cs2,-HALF_PI,0); } } }
function trHeightField(G){
  const n=floor(map(P.density,0,1,6,40));
  const ns=map(P.clustering,0,1,3.5,0.12);
  const spd=map(P.speed,0,1,0,0.08);
  // half-width of arc ridge as fraction of tile — mirrors strokeWeight mapping
  const hw=map(P.weight,0,1,0.01,0.21);
  const out=new Float32Array(G*G);
  for(let j=0;j<G;j++) for(let i=0;i<G;i++){
    const px=i/G, py=j/G;
    const ti=Math.min(Math.floor(px*n),n-1), tj=Math.min(Math.floor(py*n),n-1);
    const lx=px*n-ti, ly=py*n-tj;
    const flip=noise(ti*ns,tj*ns,animT*spd)<0.5;
    let d;
    if(flip){
      const d1=Math.abs(Math.sqrt(lx*lx+ly*ly)-0.5);
      const d2=Math.abs(Math.sqrt((lx-1)*(lx-1)+(ly-1)*(ly-1))-0.5);
      d=Math.min(d1,d2);
    }else{
      const d1=Math.abs(Math.sqrt((lx-1)*(lx-1)+ly*ly)-0.5);
      const d2=Math.abs(Math.sqrt(lx*lx+(ly-1)*(ly-1))-0.5);
      d=Math.min(d1,d2);
    }
    const h=Math.max(0,1-d/hw);
    out[i+j*G]=h*h;
  }
  _edgeMask(out,G); return out;
}
function heightField(G){ return trHeightField(G); }
function svgArc(cx,cy,r,a0,a1){
  const x0=cx+Math.cos(a0)*r, y0=cy+Math.sin(a0)*r, x1=cx+Math.cos(a1)*r, y1=cy+Math.sin(a1)*r;
  return 'M '+svgNum(x0)+' '+svgNum(y0)+' A '+svgNum(r)+' '+svgNum(r)+' 0 0 1 '+svgNum(x1)+' '+svgNum(y1);
}
function renderSVG(){
  randomSeed(seed); noiseSeed(seed);
  const pal=getPal(), n=floor(map(P.density,0,1,6,40)), cs=Math.min(W,H)/n, r=cs/2;
  const cols=Math.ceil(W/cs), rows=Math.ceil(H/cs), sw=map(P.weight,0,1,1,cs*0.4), ns=map(P.clustering,0,1,3.5,0.12);
  let svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><rect width="'+W+'" height="'+H+'" fill="'+svgColor(pal[0])+'"/>';
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){ const x=i*cs,y=j*cs;
    const bias=noise(i*ns,j*ns); const flip=bias<0.5; const c=(i+j)%2?pal[1]:pal[2];
    if(flip){
      svg+='<path d="'+svgArc(x,y,r,0,HALF_PI)+'" fill="none" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(sw)+'" stroke-linecap="square"/>';
      svg+='<path d="'+svgArc(x+cs,y+cs,r,PI,PI+HALF_PI)+'" fill="none" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(sw)+'" stroke-linecap="square"/>';
    }else{
      svg+='<path d="'+svgArc(x+cs,y,r,HALF_PI,PI)+'" fill="none" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(sw)+'" stroke-linecap="square"/>';
      svg+='<path d="'+svgArc(x,y+cs,r,-HALF_PI,0)+'" fill="none" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(sw)+'" stroke-linecap="square"/>';
    }
  }
  downloadSVG(svg+'</svg>');
}` },

{ id:"truchet_b", title:"truchet // color",
  system:[{k:"density",label:"density",min:0,max:1,step:.01,v:.45},{k:"weight",label:"weight",min:0,max:1,step:.01,v:.4},{k:"clustering",label:"clustering",min:0,max:1,step:.01,v:.5},{k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4},{k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},{k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5,rr:true},{k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.5,rr:true}],
  code:`
function build(){}
function render(g,pal){ const n=floor(map(P.density,0,1,6,40)), cs=Math.min(g.width,g.height)/n;
  const cols=Math.ceil(g.width/cs), rows=Math.ceil(g.height/cs), dep=P.zdepth||0, cx=g.width/2, cy=g.height/2;
  g.noFill(); g.strokeCap(ROUND);
  const ns=map(P.clustering,0,1,3.5,0.12), spd=map(P.speed,0,1,0,0.08), baseW=map(P.weight,0,1,1,cs*0.4);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){ const x=i*cs,y=j*cs;
    const tf=(j+0.5)/rows, z=tf*2-1;
    // contour_field-style z staging
    const scl=Math.abs(dep)>0.01?1-z*0.36*dep:1, yOff=Math.abs(dep)>0.01?z*cy*0.34*dep:0;
    const x2=cx+(x-cx)*scl, y2=cy+(y-cy)*scl+yOff, cs2=cs*scl;
    const bias=noise(i*ns,j*ns,animT*spd); const flip=bias<0.5;
    const c=[lerp(pal[1][0],pal[2][0],bias),lerp(pal[1][1],pal[2][1],bias),lerp(pal[1][2],pal[2][2],bias)];
    const sh=Math.abs(dep)>0.01?1+z*0.28*dep:1;
    g.strokeWeight(baseW*(1+tf*0.45*dep));
    g.stroke(Math.min(255,c[0]*sh),Math.min(255,c[1]*sh),Math.min(255,c[2]*sh),Math.abs(dep)>0.01?Math.floor(120+135*tf):255);
    if(flip){ g.arc(x2,y2,cs2,cs2,0,HALF_PI); g.arc(x2+cs2,y2+cs2,cs2,cs2,PI,PI+HALF_PI); }
    else { g.arc(x2+cs2,y2,cs2,cs2,HALF_PI,PI); g.arc(x2,y2+cs2,cs2,cs2,-HALF_PI,0); } } }
function heightField(G){
  const n=floor(map(P.density,0,1,6,40));
  const ns=map(P.clustering,0,1,3.5,0.12);
  const spd=map(P.speed,0,1,0,0.08);
  const hw=map(P.weight,0,1,0.01,0.21);
  const out=new Float32Array(G*G);
  for(let j=0;j<G;j++) for(let i=0;i<G;i++){
    const px=i/G, py=j/G;
    const ti=Math.min(Math.floor(px*n),n-1), tj=Math.min(Math.floor(py*n),n-1);
    const lx=px*n-ti, ly=py*n-tj;
    const flip=noise(ti*ns,tj*ns,animT*spd)<0.5;
    let d;
    if(flip){
      const d1=Math.abs(Math.sqrt(lx*lx+ly*ly)-0.5);
      const d2=Math.abs(Math.sqrt((lx-1)*(lx-1)+(ly-1)*(ly-1))-0.5);
      d=Math.min(d1,d2);
    }else{
      const d1=Math.abs(Math.sqrt((lx-1)*(lx-1)+ly*ly)-0.5);
      const d2=Math.abs(Math.sqrt(lx*lx+(ly-1)*(ly-1))-0.5);
      d=Math.min(d1,d2);
    }
    const h=Math.max(0,1-d/hw);
    out[i+j*G]=h*h;
  }
  _edgeMask(out,G); return out;
}
function svgArc(cx,cy,r,a0,a1){
  const x0=cx+Math.cos(a0)*r, y0=cy+Math.sin(a0)*r, x1=cx+Math.cos(a1)*r, y1=cy+Math.sin(a1)*r;
  return 'M '+svgNum(x0)+' '+svgNum(y0)+' A '+svgNum(r)+' '+svgNum(r)+' 0 0 1 '+svgNum(x1)+' '+svgNum(y1);
}
function renderSVG(){
  randomSeed(seed); noiseSeed(seed);
  const pal=getPal(), n=floor(map(P.density,0,1,6,40)), cs=Math.min(W,H)/n, r=cs/2;
  const cols=Math.ceil(W/cs), rows=Math.ceil(H/cs), sw=map(P.weight,0,1,1,cs*0.4), ns=map(P.clustering,0,1,3.5,0.12);
  let svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><rect width="'+W+'" height="'+H+'" fill="'+svgColor(pal[0])+'"/>';
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){ const x=i*cs,y=j*cs;
    const bias=noise(i*ns,j*ns); const flip=bias<0.5;
    const c=[lerp(pal[1][0],pal[2][0],bias),lerp(pal[1][1],pal[2][1],bias),lerp(pal[1][2],pal[2][2],bias)];
    if(flip){
      svg+='<path d="'+svgArc(x,y,r,0,HALF_PI)+'" fill="none" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(sw)+'" stroke-linecap="round"/>';
      svg+='<path d="'+svgArc(x+cs,y+cs,r,PI,PI+HALF_PI)+'" fill="none" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(sw)+'" stroke-linecap="round"/>';
    }else{
      svg+='<path d="'+svgArc(x+cs,y,r,HALF_PI,PI)+'" fill="none" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(sw)+'" stroke-linecap="round"/>';
      svg+='<path d="'+svgArc(x,y+cs,r,-HALF_PI,0)+'" fill="none" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(sw)+'" stroke-linecap="round"/>';
    }
  }
  downloadSVG(svg+'</svg>');
}` },

{ id:"l_system", title:"l-system",
  system:[{k:"depth",label:"depth",min:0,max:1,step:.01,v:.6},{k:"angle",label:"angle",min:0,max:1,step:.01,v:.35},{k:"decay",label:"decay",min:0,max:1,step:.01,v:.5},{k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4},{k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},{k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5,rr:true},{k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.5,rr:true}],
  code:`
let LS;
function build(){ const rules=["FF+[+F-F-F]-[-F+F+F]","F[+F]F[-F]F","FF-[-F+F+F]+[+F-F-F]","F-[[F]+F]+F[+FF]-F"];
  const rule=rules[floor(random(rules.length))]; const depth=floor(map(P.depth,0,1,3,6)); let s="F";
  for(let d=0;d<depth;d++){let ns="";for(const ch of s)ns+=ch==="F"?rule:ch;s=ns;} LS={s,depth}; }
function render(g,pal){ const s=LS.s, depth=LS.depth; const ang=map(P.angle,0,1,0.12,0.55), decay=map(P.decay,0,1,0.62,0.84), dep=P.zdepth||0;
  let len=map(depth,3,6,196,24)*(g.height/820);
  g.push(); g.translate(g.width/2,g.height*0.95); g.noFill(); const stack=[]; let lw=2.4;
  for(const ch of s){ if(ch==="F"){ const t=Math.max(0,Math.min(1,lw/2.4));
      const z=t*2-1;
      // contour_field-style z staging, adapted to branch depth
      const scl=Math.abs(dep)>0.01?1-z*0.36*dep:1, yOff=Math.abs(dep)>0.01?z*(g.height/2)*0.34*dep:0;
      const a255=Math.abs(dep)>0.01?Math.floor(lerp(80,255,t*(1+dep*0.35))):255;
      g.stroke(lerp(pal[2][0],pal[1][0],t),lerp(pal[2][1],pal[1][1],t),lerp(pal[2][2],pal[1][2],t),a255); g.strokeWeight(Math.max(0.4,lw*(1+z*0.5*dep)));
      if(Math.abs(dep)>0.01){ g.line(0,yOff,0,-len*scl+yOff); } else { g.line(0,0,0,-len); }
      g.translate(0,-len); }
    else if(ch==="+")g.rotate(ang); else if(ch==="-")g.rotate(-ang);
    else if(ch==="["){stack.push([len,lw]);g.push();len*=decay;lw*=0.78;}
    else if(ch==="]"){g.pop();const st=stack.pop();len=st[0];lw=st[1];} }
  g.pop(); }
function renderSVG(){
  if(!LS) build();
  const pal=getPal(), s=LS.s, depth=LS.depth, ang=map(P.angle,0,1,0.12,0.55), decay=map(P.decay,0,1,0.62,0.84);
  let len=map(depth,3,6,196,24)*(H/820), lw=2.4, x=W/2, y=H*0.95, a=0;
  const stack=[];
  let svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><rect width="'+W+'" height="'+H+'" fill="'+svgColor(pal[0])+'"/>';
  for(const ch of s){
    if(ch==="F"){ const t=Math.max(0,Math.min(1,lw/2.4)), c=[lerp(pal[2][0],pal[1][0],t),lerp(pal[2][1],pal[1][1],t),lerp(pal[2][2],pal[1][2],t)];
      const nx=x+Math.sin(a)*len, ny=y-Math.cos(a)*len;
      svg+='<line x1="'+svgNum(x)+'" y1="'+svgNum(y)+'" x2="'+svgNum(nx)+'" y2="'+svgNum(ny)+'" stroke="'+svgColor(c)+'" stroke-width="'+svgNum(Math.max(0.4,lw))+'" stroke-linecap="round"/>';
      x=nx; y=ny;
    }else if(ch==="+")a+=ang; else if(ch==="-")a-=ang;
    else if(ch==="["){stack.push([x,y,a,len,lw]);len*=decay;lw*=0.78;}
    else if(ch==="]"){const st=stack.pop();x=st[0];y=st[1];a=st[2];len=st[3];lw=st[4];}
  }
  downloadSVG(svg+'</svg>');
}
function heightField(G){
  if(!LS) build();
  const s=LS.s, depth=LS.depth;
  const ang=map(P.angle,0,1,0.12,0.55), decay=map(P.decay,0,1,0.62,0.84);
  let len=map(depth,3,6,0.24,0.029), lw=0.013;
  const out=new Float32Array(G*G);
  const stack=[];
  let x=0.5, y=0.95, a=0;
  function paint(x0,y0,x1,y1,w){
    const steps=Math.ceil(Math.hypot((x1-x0)*G,(y1-y0)*G)*2)+1;
    const r=Math.max(1,Math.round(w*G*0.5));
    for(let t=0;t<=steps;t++){
      const px=x0+(x1-x0)*t/steps, py=y0+(y1-y0)*t/steps;
      const ix=Math.floor(px*G), iy=Math.floor(py*G);
      for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
        const nx=ix+dx, ny=iy+dy;
        if(nx<0||ny<0||nx>=G||ny>=G)continue;
        const d=Math.hypot(dx,dy)/(r+0.5);
        out[nx+ny*G]=Math.max(out[nx+ny*G], w*Math.max(0,1-d));
      }
    }
  }
  for(const ch of s){
    if(ch==="F"){const nx=x+Math.sin(a)*len,ny=y-Math.cos(a)*len;paint(x,y,nx,ny,lw);x=nx;y=ny;}
    else if(ch==="+")a+=ang; else if(ch==="-")a-=ang;
    else if(ch==="["){stack.push([x,y,a,len,lw]);len*=decay;lw*=0.78;}
    else if(ch==="]"){const st=stack.pop();x=st[0];y=st[1];a=st[2];len=st[3];lw=st[4];}
  }
  let mx=0; for(const v of out)mx=Math.max(mx,v);
  if(mx>0)for(let i=0;i<out.length;i++)out[i]/=mx;
  _edgeMask(out,G); return out;
}` },

{ id:"cellular_erosion", title:"cellular erosion",
  system:[{k:"fill",label:"fill",min:0,max:1,step:.01,v:.48},{k:"iterations",label:"iterations",min:0,max:1,step:.01,v:.5},{k:"pix",label:"pixel size",min:0,max:1,step:.01,v:.5},{k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4},{k:"height",g:"extrude",label:"height",min:0,max:1,step:.01,v:0,rr:true},{k:"hvar",g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5,rr:true},{k:"light",g:"extrude",label:"light",min:0,max:1,step:.01,v:.5,rr:true}],
  code:`
let CEG,CED,CEGR,CE_MX;
function build(){ const G=CEG=200; let grid=new Uint8Array(G*G);
  const fillP=map(P.fill,0,1,0.35,0.62);
  for(let y=0;y<G;y++)for(let x=0;x<G;x++){const nn=noise(x*0.05,y*0.05)*0.85+random()*0.15; grid[x+y*G]=nn<fillP?1:0;}
  const iters=floor(map(P.iterations,0,1,1,8));
  for(let k=0;k<iters;k++){ const o=new Uint8Array(G*G); for(let y=0;y<G;y++)for(let x=0;x<G;x++){let su=0,c=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=G||ny>=G)continue;su+=grid[nx+ny*G];c++;} o[x+y*G]=su>c/2?1:0;} grid=o;}
  let d=new Float32Array(G*G); for(let i=0;i<d.length;i++)d[i]=grid[i]?9999:0;
  for(let p=0;p<60;p++){let ch=false; for(let y=1;y<G-1;y++)for(let x=1;x<G-1;x++){const i=x+y*G;if(!grid[i])continue;const m=Math.min(d[i-1],d[i+1],d[i-G],d[i+G])+1;if(m<d[i]){d[i]=m;ch=true;}} if(!ch)break;}
  let mx=1; for(const v of d)mx=Math.max(mx,v); CEGR=grid; CED=d; CE_MX=mx; }
function render(g,pal){ const G=CEG;
  const cells=floor(map(P.pix,0,1,260,6));
  const img=makeField(G,(x,y)=>{
    const qx=Math.min(G-1,floor(floor(x/G*cells)/cells*G));
    const qy=Math.min(G-1,floor(floor(y/G*cells)/cells*G));
    const i=qx+qy*G; if(!CEGR[i]) return [0,0,0,0]; const t=CED[i]/CE_MX;
    return [lerp(pal[1][0],pal[2][0],t),lerp(pal[1][1],pal[2][1],t),lerp(pal[1][2],pal[2][2],t)]; });
  const dep=P.zdepth||0;
  if(Math.abs(dep)>0.01){
    const cx=g.width/2, cy=g.height/2;
    for(let l=0;l<7;l++){
      const tf=l/6, z=tf*2-1;
      const scl=1-z*0.38*dep, yOff=z*cy*0.34*dep;
      g.push(); g.tint(255,Math.floor(lerp(42,185,tf)));
      g.translate(cx,cy+yOff); g.scale(scl); g.image(img,-g.width/2,-g.height/2,g.width,g.height);
      g.pop();
    }
    g.noTint();
  } else g.image(img,0,0,g.width,g.height); }
function heightField(G){ const G0=CEG, out=new Float32Array(G*G);
  for(let j=0;j<G;j++) for(let i=0;i<G;i++){
    const si=Math.floor(i*G0/G), sj=Math.floor(j*G0/G), idx=si+sj*G0;
    if(!CEGR[idx]){ out[i+j*G]=0; continue; }
    out[i+j*G]=Math.sqrt(CED[idx]/CE_MX); }
  _edgeMask(out,G); _pxQ(out,G); return out; }` },

{ id:"recursive_grid", title:"recursive grid",
  system:[{k:"depth",label:"depth",min:0,max:1,step:.01,v:.6},{k:"threshold",label:"threshold",min:0,max:1,step:.01,v:.5},{k:"jitter",label:"jitter",min:0,max:1,step:.01,v:0},{k:"zdepth",label:"z depth",min:-1.5,max:1.5,step:.01,v:0},{k:"pal",label:"palette",min:0,max:9,step:1,v:4}],
  code:`
let RGL;
function build(){ RGL=[]; const maxD=floor(map(P.depth,0,1,3,8)); rgsub(0,0,1,1,0,maxD); }
function rgsub(x,y,w,h,d,maxD){ const s=map(P.threshold,0,1,0.85,0.18), n=noise(x*4,y*4,d*0.5);
  if(d<maxD&&(d<1||n>s)&&w>0.02&&h>0.02){ const jt=map(P.jitter,0,1,0.5,0.2), fx=random(jt,1-jt),fy=random(jt,1-jt),mx=w*fx,my=h*fy;
    rgsub(x,y,mx,my,d+1,maxD); rgsub(x+mx,y,w-mx,my,d+1,maxD); rgsub(x,y+my,mx,h-my,d+1,maxD); rgsub(x+mx,y+my,w-mx,h-my,d+1,maxD); }
  else RGL.push({x,y,w,h,d,maxD,r:random()}); }
function render(g,pal){ const dep=P.zdepth||0,cx=g.width/2,cy=g.height/2;
  const cells=Math.abs(dep)>0.01?[...RGL].sort((a,b)=>a.d-b.d):RGL;
  for(const c of cells){ const tf=c.maxD?c.d/c.maxD:0, z=tf*2-1;
  // contour_field-style z staging
  const scl=Math.abs(dep)>0.01?1-z*0.36*dep:1, yOff=Math.abs(dep)>0.01?z*cy*0.34*dep:0;
  const x=cx+(c.x*g.width-cx)*scl,y=cy+(c.y*g.height-cy)*scl+yOff,w=c.w*g.width*scl,h=c.h*g.height*scl,r=c.r;
  const a=Math.abs(dep)>0.01?Math.floor(95+150*(1-tf)):255;
  if(r<0.18)g.fill(pal[1][0],pal[1][1],pal[1][2],a);
  else if(r<0.34)g.fill(lerp(pal[0][0],pal[2][0],.55),lerp(pal[0][1],pal[2][1],.55),lerp(pal[0][2],pal[2][2],.55),a);
  else g.noFill();
  g.stroke(lerp(pal[2][0],pal[0][0],.4),lerp(pal[2][1],pal[0][1],.4),lerp(pal[2][2],pal[0][2],.4),a); g.strokeWeight(map(c.d,0,c.maxD,2,0.6)*(1+0.4*(1-tf)*dep));
  g.rect(x+1.5,y+1.5,w-3,h-3); } }` },

{ id:"sdf", title:"sdf field",
  system:[{k:"count",label:"count",min:0,max:1,step:.01,v:.5},{k:"blend",label:"blend",min:0,max:1,step:.01,v:.5},{k:"warp",label:"warp",min:0,max:1,step:.01,v:.35},{k:"pix",label:"pixel size",min:0,max:1,step:.01,v:.5},{k:"pal",label:"palette",min:0,max:9,step:1,v:4},{k:"extrude",label:"extrude",min:-1,max:1,step:.01,v:0,rr:true}],
  code:`
let SDFB;
// ensure minimal motion on load for this 2D SDF piece
try{ if(typeof P!=="undefined"){ if((P.speed===0||P.speed===undefined) && (P.drift===0||P.drift===undefined)){ P.speed=0.18; P.drift=0.12; }
    // sync UI sliders shortly after buildUI runs so controls reflect these defaults
    setTimeout(()=>{ try{ const s=document.getElementById('p_speed'); if(s) s.value = P.speed; const vs=document.getElementById('v_speed'); if(vs) vs.textContent = (P.speed).toFixed(2); const d=document.getElementById('p_drift'); if(d) d.value = P.drift; const vd=document.getElementById('v_drift'); if(vd) vd.textContent = (P.drift).toFixed(2); }catch(e){} },80);
  } } }catch(e){}
function build(){ const n=floor(map(P.count,0,1,3,12)); SDFB=[]; for(let i=0;i<n;i++)SDFB.push([random(.18,.82),random(.18,.82),random(.06,.15)]); }
function render(g,pal){ const N=300, blobs=SDFB, baseK=map(P.blend,0,1,0.03,0.28), warp=P.warp, light=[-0.6,-0.9];
  // compute animated positions (smooth orbital motion) per frame
  const t = animT * P.speed * 5.5;
  const motionStrength = 0.5 * (0.4 + warp*1.6); // warp biases motion
  const positions = [];
  for(let i=0;i<blobs.length;i++){
    const b = blobs[i]; const phase = i*1.73 + b[0]*7.3 + b[1]*3.1;
    const orbitR = b[2] * 0.45 * (0.8 + 0.6*map(P.count,0,1,0.6,1.2));
    const ox = orbitR * Math.cos(t* (0.4 + 0.25*(i%3)) + phase*0.27) * motionStrength;
    const oy = orbitR * Math.sin(t* (0.42 + 0.21*(i%2)) + phase*0.21) * motionStrength;
    positions.push([b[0]+ox, b[1]+oy, b[2]]);
  }
  // slightly larger smooth-min k, scaled by local size for softer blending
  const field=(px,py)=>{ let d = Math.hypot(px-positions[0][0], py-positions[0][1]) - positions[0][2];
    for(let i=1;i<positions.length;i++){
      const sd = Math.hypot(px-positions[i][0], py-positions[i][1]) - positions[i][2];
      const k = baseK * (0.9 + 0.6*(positions[i][2]+positions[0][2]));
      const h = Math.max(0, Math.min(1, 0.5 + 0.5*(sd - d)/k));
      d = sd*(1-h) + d*h - k*h*(1-h);
    }
    return d;
  };

  const baseDark=[lerp(pal[0][0],pal[1][0],.32),lerp(pal[0][1],pal[1][1],.32),lerp(pal[0][2],pal[1][2],.32)];

  const cells=floor(map(P.pix,0,1,560,6));
  const img=makeField(560,(X,Y)=>{ let px=floor(X/560*cells)/cells, py=floor(Y/560*cells)/cells;
    // time-varying warp for organic flow (no chaotic jitter)
    if(warp>0){ const w = warp*0.08; px += w*(noise(px*5 + t*0.13, py*5) - 0.5); py += w*(noise(px*5 + 9.1, py*5 + t*0.11) - 0.5); }
    const f = field(px,py);
    if(f>=0) return [0,0,0,0];

    // compute approximate 2D normal using smooth sampling
    const e = 1/N;
    const fx = field(px+e,py) - field(px-e,py);
    const fy = field(px,py+e) - field(px,py-e);
    const gl = Math.hypot(fx,fy) || 1;
    const nx = fx/gl, ny = fy/gl;

    // lighting (stronger directional feel like raymarch)
    const dif = Math.max(0, nx*light[0] + ny*light[1]) * 1.05 + 0.06;
    // rim influenced by view-normal (approx) and depth
    const rim = Math.pow(1 - Math.min(1, -f/0.14), 3);

    // soft AO: sample along normal away from surface to see occlusion
    const s1 = field(px + nx*0.018, py + ny*0.018);
    const s2 = field(px + nx*0.048, py + ny*0.048);
    const occ = (Math.max(0,s1) + Math.max(0,s2)) / 2.0;
    const ao = 1 - Math.max(0, Math.min(1, occ / 0.12));

    // color ramp and warm highlight mix
    const ramp = Math.max(0, Math.min(1, dif*0.9 + 0.08));
    let r = lerp(baseDark[0], pal[1][0], dif), gg = lerp(baseDark[1], pal[1][1], dif), bb = lerp(baseDark[2], pal[1][2], dif);
    const hiAmt = Math.max(0, Math.min(1, (ramp - 0.18)/(1-0.18))) * 0.62;
    r = lerp(r, pal[2][0], hiAmt); gg = lerp(gg, pal[2][1], hiAmt); bb = lerp(bb, pal[2][2], hiAmt);

    // rim contribution (soft)
    r += rim * pal[2][0] * 0.42; gg += rim * pal[2][1] * 0.42; bb += rim * pal[2][2] * 0.42;

    // apply AO and subtle depth falloff (material-local)
    r *= ao; gg *= ao; bb *= ao;
    const depthFall = Math.max(0, Math.min(1, (-f - 0.12) / 0.45));
    const depthMix = lerp(1.0, 0.72, Math.min(0.65, depthFall));
    r *= depthMix; gg *= depthMix; bb *= depthMix;

    // gentle vignette and filmic curve
    const dx = px - 0.5, dy = py - 0.5, dist = Math.hypot(dx, dy);
    const vig = Math.max(0, Math.min(1, (1.4 - dist*1.6) / 1.2));
    const vigMix = lerp(0.8, 1.0, vig);
    r *= vigMix; gg *= vigMix; bb *= vigMix;
    r = Math.pow(Math.max(0, r), 0.86); gg = Math.pow(Math.max(0, gg), 0.86); bb = Math.pow(Math.max(0, bb), 0.86);

    return [r, gg, bb]; });
  g.image(img,0,0,g.width,g.height); }
function heightField(G){ const blobs=SDFB, baseK=map(P.blend,0,1,0.03,0.28), warp=P.warp;
  // reuse animated positions for heightfield sampling
  const t = millis()*0.001; const motionStrength = 0.5 * (0.4 + warp*1.6); const positions = [];
  const tHF = animT * P.speed * 5.5;
  for(let i=0;i<blobs.length;i++){ const b=blobs[i]; const phase=i*1.73 + b[0]*7.3 + b[1]*3.1; const orbitR=b[2]*0.45*(0.8+0.6*map(P.count,0,1,0.6,1.2)); const ox=orbitR*Math.cos(tHF*(0.4+0.25*(i%3))+phase*0.27)*motionStrength; const oy=orbitR*Math.sin(tHF*(0.42+0.21*(i%2))+phase*0.21)*motionStrength; positions.push([b[0]+ox,b[1]+oy,b[2]]); }
  const field=(px,py)=>{ let d=Math.hypot(px-positions[0][0],py-positions[0][1])-positions[0][2];
    for(let i=1;i<positions.length;i++){const sd=Math.hypot(px-positions[i][0],py-positions[i][1])-positions[i][2]; const k = baseK * (0.9 + 0.6*(positions[i][2]+positions[0][2])); const hh=Math.max(0,Math.min(1,0.5+0.5*(sd-d)/k)); d=sd*(1-hh)+d*hh-k*hh*(1-hh);} return d; };
  const out=new Float32Array(G*G);
  for(let j=0;j<G;j++) for(let i=0;i<G;i++){
    let px=i/G, py=j/G;
    if(warp>0){px+=warp*0.06*(noise(px*6,py*6)-0.5);py+=warp*0.06*(noise(px*6+9,py*6+9)-0.5);}
    out[i+j*G]=Math.min(1,Math.max(0,-field(px,py)/0.15)); }
  _edgeMask(out,G); _pxQ(out,G); return out; }` },

{ id:"wave_interference", title:"wave interference",
  system:[
    {k:"sources",  label:"sources",   min:0,max:1,step:.01,v:.25,sys:true},
    {k:"freq",     label:"frequency", min:0,max:1,step:.01,v:.35},
    {k:"contrast", label:"contrast",  min:0,max:1,step:.01,v:.4},
    {k:"pix",      label:"pixel size",min:0,max:1,step:.01,v:.25},
    {k:"zdepth",   label:"z depth",   min:-1.5,max:1.5,step:.01,v:0},
    {k:"pal",      label:"palette",   min:0,max:9,step:1,  v:4},
    {k:"height",g:"extrude",label:"height",   min:0,max:1,step:.01,v:0,  rr:true},
    {k:"hvar",  g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5, rr:true},
    {k:"light", g:"extrude",label:"light",    min:0,max:1,step:.01,v:.5, rr:true},
  ],
  code:`
let WI_SRCS;
function build(){
  const n=floor(map(P.sources,0,1,2,6));
  WI_SRCS=[];
  for(let i=0;i<n;i++){
    const a=TWO_PI*i/n+random(-0.38,0.38);
    const r=0.22+random()*0.18;
    WI_SRCS.push([0.5+cos(a)*r, 0.5+sin(a)*r]);
  }
}
function render(g,pal){
  const freq=map(P.freq,0,1,4,30), sharp=map(P.contrast,0,1,0.8,5), dep=P.zdepth||0;
  const t=animT*P.speed*0.5;
  const cells=floor(map(P.pix,0,1,600,6));
  const img=makeField(600,(xi,yi)=>{
    const x=floor(xi/600*cells)/cells, y=floor(yi/600*cells)/cells;
    let sum=0;
    for(const [sx,sy] of WI_SRCS){
      const d=Math.sqrt((x-sx)*(x-sx)+(y-sy)*(y-sy));
      sum+=Math.sin(d*freq*Math.PI*2-t);
    }
    sum/=WI_SRCS.length;
    const v=0.5+0.5*Math.tanh(sum*sharp);
    const c0=pal[0],c1=pal[1],c2=pal[2];
    const z=(v*2-1), sh=Math.abs(dep)>0.01?1+z*0.36*dep:1;
    if(v<0.5){const f=v*2; return [Math.min(255,lerp(c0[0],c1[0],f)*sh),Math.min(255,lerp(c0[1],c1[1],f)*sh),Math.min(255,lerp(c0[2],c1[2],f)*sh)];}
    const f=(v-0.5)*2; return [Math.min(255,lerp(c1[0],c2[0],f)*sh),Math.min(255,lerp(c1[1],c2[1],f)*sh),Math.min(255,lerp(c1[2],c2[2],f)*sh)];
  });
  if(Math.abs(dep)>0.01){
    const cx=g.width/2, cy=g.height/2;
    for(let l=0;l<7;l++){
      const tf=l/6, z=tf*2-1;
      const scl=1-z*0.38*dep, yOff=z*cy*0.34*dep;
      g.push(); g.tint(255,Math.floor(lerp(42,185,tf)));
      g.translate(cx,cy+yOff); g.scale(scl); g.image(img,-g.width/2,-g.height/2,g.width,g.height);
      g.pop();
    }
    g.noTint();
  } else g.image(img,0,0,g.width,g.height);
}
function heightField(G){
  const freq=map(P.freq,0,1,4,30), sharp=map(P.contrast,0,1,0.8,5);
  const out=new Float32Array(G*G);
  for(let j=0;j<G;j++) for(let i=0;i<G;i++){
    const x=i/(G-1), y=j/(G-1);
    let sum=0;
    for(const [sx,sy] of WI_SRCS){
      const d=Math.sqrt((x-sx)*(x-sx)+(y-sy)*(y-sy));
      sum+=Math.sin(d*freq*Math.PI*2);
    }
    sum/=WI_SRCS.length;
    out[i+j*G]=0.5+0.5*Math.tanh(sum*sharp);
  }
  _edgeMask(out,G); _pxQ(out,G); return out;
}` },

{ id:"stipple", title:"stipple",
  system:[
    {k:"density",  label:"density",   min:0,max:1,step:.01,v:.5,  sys:true},
    {k:"dotsize",  label:"dot size",  min:0,max:1,step:.01,v:.45,rr:true},
    {k:"softness", label:"softness",  min:0,max:1,step:.01,v:.4, rr:true},
    {k:"pal",      label:"palette",   min:0,max:9,step:1,  v:4},
    {k:"height",   g:"extrude",label:"height",   min:0,max:1,step:.01,v:0,   rr:true},
    {k:"colsize",  g:"extrude",label:"dot size", min:0,max:1,step:.01,v:.5,  rr:true},
    {k:"caps",     g:"extrude",label:"round cap",min:0,max:2,step:1,  v:1,  rr:true},
    {k:"hvar",     g:"extrude",label:"variation",min:0,max:1,step:.01,v:.5,  rr:true},
    {k:"light",    g:"extrude",label:"light",    min:0,max:1,step:.01,v:.5,  rr:true},
  ],
  code:`
let ST_DOTS;
function build(){
  const n=floor(map(P.density,0,1,80,2200));
  ST_DOTS=[];
  // Poisson-ish: rejection sample — keep dot if field value justifies it
  let tries=0;
  while(ST_DOTS.length<n && tries<n*18){
    tries++;
    const x=random(), y=random();
    const lum=_stLum(x,y);
    if(random()<lum) ST_DOTS.push([x,y,lum]);
  }
}
function _stLum(x,y){
  // multi-octave noise field — bright = dense dot region
  let v=0,amp=1,fr=1;
  for(let o=0;o<4;o++){
    v+=noise(x*3*fr+41.3,y*3*fr+17.9)*amp;
    amp*=0.5; fr*=2.1;
  }
  return Math.min(1,Math.max(0,(v-0.18)*1.4));
}
function render(g,pal){
  const maxR=map(P.dotsize,0,1,1.5,12);
  const soft=map(P.softness,0,1,0.05,0.85);
  const t=animT*P.speed*2.6;
  g.noStroke();
  g.background(pal[0][0],pal[0][1],pal[0][2]);
  for(const [nx,ny,lum] of ST_DOTS){
    const px=nx*g.width, py=ny*g.height;
    const wave=Math.sin(t+nx*9.1+ny*6.7);
    const pulse=Math.sin(t*0.4+(nx+ny)*3.2);
    const breathe=Math.max(0.05,0.45+0.38*wave+0.17*pulse);
    const r=maxR*lum*breathe;
    const ci=Math.floor(lum*2);
    const cf=lum*2-ci;
    const ca=pal[Math.min(ci,2)], cb=pal[Math.min(ci+1,2)];
    const cr=lerp(ca[0],cb[0],cf), cg2=lerp(ca[1],cb[1],cf), cb2=lerp(ca[2],cb[2],cf);
    if(soft>0.1){
      const steps=4;
      for(let s=steps;s>=1;s--){
        const frac=s/steps;
        const alpha=255*(1-soft)*frac*frac;
        g.fill(cr,cg2,cb2,alpha);
        g.circle(px,py,r*2*frac);
      }
    } else {
      g.fill(cr,cg2,cb2,255);
      g.circle(px,py,r*2);
    }
  }
}
function heightField(G){
  const out=new Float32Array(G*G);
  // base radius matches render() pixel radius, normalized to 0-1 space (canvas ~820px)
  const baseR=map(P.dotsize,0,1,1.5,12)/820;
  const soft=map(P.softness,0,1,0.05,0.85);
  const t=animT*P.speed*2.6;
  for(const [nx,ny,lum] of ST_DOTS){
    const wave=Math.sin(t+nx*9.1+ny*6.7);
    const pulse=Math.sin(t*0.4+(nx+ny)*3.2);
    const breathe=Math.max(0.05,0.45+0.38*wave+0.17*pulse);
    const r=baseR*lum*breathe;
    if(r<=0) continue;
    const i0=Math.max(0,Math.floor((nx-r)*(G-1)));
    const i1=Math.min(G-1,Math.ceil((nx+r)*(G-1)));
    const j0=Math.max(0,Math.floor((ny-r)*(G-1)));
    const j1=Math.min(G-1,Math.ceil((ny+r)*(G-1)));
    for(let j=j0;j<=j1;j++) for(let i=i0;i<=i1;i++){
      const dx=i/(G-1)-nx, dy=j/(G-1)-ny;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<r){
        const frac=1-d/r;
        const contrib=soft>0.1?frac*frac:frac;
        out[i+j*G]=Math.min(1,out[i+j*G]+contrib*lum);
      }
    }
  }
  // colsize drives block quantisation — same feel as flat dotsize
  const cs=P.colsize===undefined?0.5:P.colsize;
  const c=Math.max(4,Math.floor(map(cs,0,1,G,4)));
  if(c<G-1){
    const tmp=new Float32Array(c*c);
    for(let j=0;j<c;j++)for(let i=0;i<c;i++){
      const si=Math.min(G-1,Math.floor((i+.5)/c*G)),sj=Math.min(G-1,Math.floor((j+.5)/c*G));
      tmp[i+j*c]=out[si+sj*G];
    }
    for(let j=0;j<G;j++)for(let i=0;i<G;i++){
      const ci=Math.min(c-1,Math.floor(i/G*c)),cj=Math.min(c-1,Math.floor(j/G*c));
      out[i+j*G]=tmp[ci+cj*c];
    }
  }
  _edgeMask(out,G); return out;
}` },
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
