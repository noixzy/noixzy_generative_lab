// noixzy // generative lab contact sheet — renders every piece headlessly to one PNG
// pure node (no browser, no deps). reproduces each algorithm's *look*, seeded.
const zlib = require("zlib"), fs = require("fs"), path = require("path");

const S = 320, GAP = 14, COLS = 3, ROWS = 3;
const SHEET_W = COLS*S + (COLS+1)*GAP;
const SHEET_H = ROWS*S + (ROWS+1)*GAP;

// noixzy palette
const BG=[14,14,16], EMBER=[237,87,0], INK=[232,232,234], TEAL=[29,114,94], DIM=[70,70,78];

// ---------- seeded rng + value noise ----------
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function makeNoise(seed){
  function h2(ix,iy){let h=ix*374761393+iy*668265263+seed*2246822519;
    h=(h^(h>>>13))*1274126177;h^=h>>>16;return((h>>>0)/4294967296);}
  const sm=t=>t*t*(3-2*t);
  return (x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
    const a=h2(ix,iy),b=h2(ix+1,iy),c=h2(ix,iy+1),d=h2(ix+1,iy+1);
    const u=sm(fx),v=sm(fy);return(a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v;};
}

// ---------- tile canvas ----------
function Tile(){ const buf=new Uint8Array(S*S*3); return buf; }
function px(buf,x,y,c,a=1){
  x|=0;y|=0; if(x<0||y<0||x>=S||y>=S)return;
  const i=(y*S+x)*3;
  buf[i]  =buf[i]  *(1-a)+c[0]*a;
  buf[i+1]=buf[i+1]*(1-a)+c[1]*a;
  buf[i+2]=buf[i+2]*(1-a)+c[2]*a;
}
function fill(buf,c){for(let i=0;i<S*S;i++){buf[i*3]=c[0];buf[i*3+1]=c[1];buf[i*3+2]=c[2];}}
function disk(buf,x,y,r,c,a=1){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)
  if(dx*dx+dy*dy<=r*r)px(buf,x+dx,y+dy,c,a);}
function lineTo(buf,x0,y0,x1,y1,c,a=1,w=1){
  x0|=0;y0|=0;x1|=0;y1|=0;let dx=Math.abs(x1-x0),dy=Math.abs(y1-y0);
  let sx=x0<x1?1:-1,sy=y0<y1?1:-1,err=dx-dy;
  for(;;){ if(w<=1)px(buf,x0,y0,c,a); else disk(buf,x0,y0,w,c,a);
    if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>-dy){err-=dy;x0+=sx;}if(e2<dx){err+=dx;y0+=sy;}}
}
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];

// ============================================================ PIECES
function flow_field(buf,seed){
  fill(buf,BG); const N=makeNoise(seed),rng=mulberry32(seed);
  const s=0.012, turb=4;
  for(let p=0;p<1400;p++){let x=rng()*S,y=rng()*S; const c=rng()<0.5?EMBER:INK;
    for(let j=0;j<70;j++){const a=N(x*s,y*s)*Math.PI*2*turb;x+=Math.cos(a)*1.4;y+=Math.sin(a)*1.4;
      px(buf,x,y,c,0.10); if(x<0||y<0||x>=S||y>=S)break;}}
}
function reaction_diffusion(buf,seed){
  const G=110; let a=new Float32Array(G*G).fill(1),b=new Float32Array(G*G),
    a2=new Float32Array(G*G),b2=new Float32Array(G*G); const rng=mulberry32(seed);
  for(let s=0;s<14;s++){const cx=(rng()*G)|0,cy=(rng()*G)|0,r=3+(rng()*4|0);
    for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r){
      const px2=(cx+x+G)%G,py=(cy+y+G)%G;b[px2+py*G]=1;}}
  const f=0.037,k=0.06,dA=1,dB=0.5;
  for(let it=0;it<2200;it++){
    for(let y=1;y<G-1;y++)for(let x=1;x<G-1;x++){const i=x+y*G;
      let la=-a[i],lb=-b[i];
      const w=[[-1,0,.2],[1,0,.2],[0,-1,.2],[0,1,.2],[-1,-1,.05],[1,-1,.05],[-1,1,.05],[1,1,.05]];
      for(const[dx,dy,wt]of w){const j=i+dx+dy*G;la+=a[j]*wt;lb+=b[j]*wt;}
      const ab=a[i]*b[i]*b[i];
      a2[i]=Math.min(1,Math.max(0,a[i]+dA*la-ab+f*(1-a[i])));
      b2[i]=Math.min(1,Math.max(0,b[i]+dB*lb+ab-(k+f)*b[i]));}
    [a,a2]=[a2,a];[b,b2]=[b2,b];}
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const gx=(x/S*G)|0,gy=(y/S*G)|0;
    const v=Math.min(1,Math.max(0,a[gx+gy*G]-b[gx+gy*G]));
    px(buf,x,y,mix(INK,BG,v),1);}
}
function voronoi(buf,seed){
  fill(buf,BG); const rng=mulberry32(seed),n=46,pts=[],cc=[];
  for(let i=0;i<n;i++){pts.push([rng()*S,rng()*S]);cc.push(mix(EMBER,INK,rng()));}
  for(let y=0;y<S;y+=2)for(let x=0;x<S;x+=2){let b0=1e9,b1=1e9,bi=0;
    for(let i=0;i<n;i++){const d=(x-pts[i][0])**2+(y-pts[i][1])**2;
      if(d<b0){b1=b0;b0=d;bi=i;}else if(d<b1)b1=d;}
    const edge=Math.sqrt(b1)-Math.sqrt(b0);
    const c=edge<2.0?EMBER:mix(BG,cc[bi],0.6);
    px(buf,x,y,c);px(buf,x+1,y,c);px(buf,x,y+1,c);px(buf,x+1,y+1,c);}
}
function contour_field(buf,seed){
  fill(buf,BG); const N=makeNoise(seed),R=7,C=Math.floor(S/R);
  const fld=[]; const fv=(x,y)=>{let v=0,amp=1,fr=1;for(let o=0;o<4;o++){v+=N(x*0.012*fr,y*0.012*fr)*amp;amp*=.5;fr*=2;}return v;};
  for(let j=0;j<=C;j++){const row=[];for(let i=0;i<=C;i++)row.push(fv(i*R,j*R));fld.push(row);}
  let mn=1e9,mx=-1e9;for(const r of fld)for(const v of r){mn=Math.min(mn,v);mx=Math.max(mx,v);}
  const L=18;
  for(let l=1;l<L;l++){const thr=mn+(mx-mn)*l/L,col=mix(EMBER,INK,l/L);
    for(let j=0;j<C;j++)for(let i=0;i<C;i++){
      const a=fld[j][i],b=fld[j][i+1],c=fld[j+1][i+1],d=fld[j+1][i],x=i*R,y=j*R;
      const ix=(p,q,va,vb)=>{const t=(thr-va)/((vb-va)||1e-6);return[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];};
      const TL=[x,y],TR=[x+R,y],BR=[x+R,y+R],BL=[x,y+R];
      let st=(a>thr?8:0)|(b>thr?4:0)|(c>thr?2:0)|(d>thr?1:0);
      const e={top:ix(TL,TR,a,b),right:ix(TR,BR,b,c),bottom:ix(BL,BR,d,c),left:ix(TL,BL,a,d)};
      const sg=(p,q)=>lineTo(buf,p[0],p[1],q[0],q[1],col,0.9);
      if(st===1||st===14)sg(e.left,e.bottom);else if(st===2||st===13)sg(e.bottom,e.right);
      else if(st===3||st===12)sg(e.left,e.right);else if(st===4||st===11)sg(e.top,e.right);
      else if(st===5){sg(e.left,e.top);sg(e.bottom,e.right);}else if(st===6||st===9)sg(e.top,e.bottom);
      else if(st===7||st===8)sg(e.left,e.top);else if(st===10){sg(e.left,e.bottom);sg(e.top,e.right);}}}
}
function truchet(buf,seed){
  fill(buf,BG); const rng=mulberry32(seed),n=9,cs=S/n,r=cs/2;
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const x=i*cs,y=j*cs,flip=rng()<0.5;
    const col=(i+j)%2?EMBER:INK;
    const arc=(cx,cy,a0,a1)=>{for(let t=0;t<=1;t+=0.02){const a=a0+(a1-a0)*t;
      disk(buf,cx+Math.cos(a)*r,cy+Math.sin(a)*r,1.4,col,0.95);}};
    if(flip){arc(x,y,0,Math.PI/2);arc(x+cs,y+cs,Math.PI,Math.PI*1.5);}
    else{arc(x+cs,y,Math.PI/2,Math.PI);arc(x,y+cs,-Math.PI/2,0);}}
}
function l_system(buf,seed){
  fill(buf,BG); const rng=mulberry32(seed);
  const rules=["FF+[+F-F-F]-[-F+F+F]","F[+F]F[-F]F","FF-[-F+F+F]+[+F-F-F]"];
  const rule=rules[(rng()*rules.length)|0]; let s="F";
  for(let d=0;d<5;d++){let ns="";for(const ch of s)ns+=ch==="F"?rule:ch;s=ns;}
  const ang=0.42; let len=14;
  let st=[],x=S/2,y=S*0.96,a=-Math.PI/2,lw=2;
  for(const ch of s){
    if(ch==="F"){const nx=x+Math.cos(a)*len,ny=y+Math.sin(a)*len;
      lineTo(buf,x,y,nx,ny,mix(EMBER,INK,1-Math.min(1,lw/2)),0.9,lw>1?1:0);x=nx;y=ny;}
    else if(ch==="+")a+=ang;else if(ch==="-")a-=ang;
    else if(ch==="["){st.push([x,y,a,len,lw]);len*=0.72;lw*=0.8;}
    else if(ch==="]"){[x,y,a,len,lw]=st.pop();}}
}
function cellular_erosion(buf,seed){
  const G=160; const N=makeNoise(seed),rng=mulberry32(seed);let g=new Uint8Array(G*G);
  for(let y=0;y<G;y++)for(let x=0;x<G;x++){const v=N(x*0.05,y*0.05)*0.8+rng()*0.2;g[x+y*G]=v<0.49?1:0;}
  for(let k=0;k<4;k++){const o=new Uint8Array(G*G);
    for(let y=0;y<G;y++)for(let x=0;x<G;x++){let s=0,c=0;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;
        if(nx<0||ny<0||nx>=G||ny>=G)continue;s+=g[nx+ny*G];c++;}o[x+y*G]=s>c/2?1:0;}g=o;}
  let d=new Float32Array(G*G);for(let i=0;i<d.length;i++)d[i]=g[i]?9999:0;
  for(let p=0;p<50;p++){let ch=false;for(let y=1;y<G-1;y++)for(let x=1;x<G-1;x++){
    const i=x+y*G;if(!g[i])continue;const m=Math.min(d[i-1],d[i+1],d[i-G],d[i+G])+1;
    if(m<d[i]){d[i]=m;ch=true;}}if(!ch)break;}
  let mx=1;for(const v of d)mx=Math.max(mx,v);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const gx=(x/S*G)|0,gy=(y/S*G)|0,i=gx+gy*G;
    const t=g[i]?(d[i]/mx):0;px(buf,x,y,g[i]?mix([90,90,96],INK,t):BG,1);}
}
function recursive_grid(buf,seed){
  fill(buf,BG); const N=makeNoise(seed),rng=mulberry32(seed);
  function sub(x,y,w,h,dep){
    const split=dep<6&&(dep<1||N(x*0.01,y*0.01)>0.42)&&w>16&&h>16;
    if(split){const fx=0.3+rng()*0.4,fy=0.3+rng()*0.4,mx=w*fx,my=h*fy;
      sub(x,y,mx,my,dep+1);sub(x+mx,y,w-mx,my,dep+1);
      sub(x,y+my,mx,h-my,dep+1);sub(x+mx,y+my,w-mx,h-my,dep+1);}
    else{const r=rng();
      if(r<0.18)for(let yy=y+2;yy<y+h-2;yy++)for(let xx=x+2;xx<x+w-2;xx++)px(buf,xx,yy,EMBER,1);
      else if(r<0.32)for(let yy=y+2;yy<y+h-2;yy++)for(let xx=x+2;xx<x+w-2;xx++)px(buf,xx,yy,mix(BG,INK,0.5),1);
      // stroke
      for(let xx=x+2;xx<x+w-2;xx++){px(buf,xx,y+2,DIM);px(buf,xx,y+h-2,DIM);}
      for(let yy=y+2;yy<y+h-2;yy++){px(buf,x+2,yy,DIM);px(buf,x+w-2,yy,DIM);}}
  }
  sub(0,0,S,S,0);
}
function sdf(buf,seed){
  fill(buf,BG); const rng=mulberry32(seed),n=7,blobs=[];
  for(let i=0;i<n;i++)blobs.push([rng()*S*0.7+S*0.15,rng()*S*0.7+S*0.15,30+rng()*46]);
  const k=42;
  const field=(x,y)=>{
    let d=Math.hypot(x-blobs[0][0],y-blobs[0][1])-blobs[0][2];   // seed with 1st blob, not 1e9
    for(let i=1;i<blobs.length;i++){const[bx,by,br]=blobs[i];
      const sd=Math.hypot(x-bx,y-by)-br;
      const h=Math.max(0,Math.min(1,0.5+0.5*(sd-d)/k));
      d=sd*(1-h)+d*h-k*h*(1-h);}                                 // polynomial smin
    return d;};
  const light=[-0.5,-0.72];
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const f=field(x,y);
    if(f<0){const gx=field(x+1,y)-field(x-1,y),gy=field(x,y+1)-field(x,y-1);
      const gl=Math.hypot(gx,gy)||1;const nx=gx/gl,ny=gy/gl;
      let dif=Math.max(0,nx*light[0]+ny*light[1])*0.9+0.12;
      const rim=Math.pow(1-Math.min(1,-f/40),3);
      let c=mix(mix([60,28,6],EMBER,dif),TEAL,rim*0.5);
      px(buf,x,y,c,1);} }
}

// ============================================================ render all
const pieces=[
  ["sdf",sdf],["flow_field",flow_field],["reaction_diffusion",reaction_diffusion],
  ["voronoi",voronoi],["contour_field",contour_field],["truchet",truchet],
  ["l_system",l_system],["cellular_erosion",cellular_erosion],["recursive_grid",recursive_grid],
];

const sheet=new Uint8Array(SHEET_W*SHEET_H*3);
for(let i=0;i<SHEET_W*SHEET_H;i++){sheet[i*3]=8;sheet[i*3+1]=8;sheet[i*3+2]=10;}
pieces.forEach(([name,fn],idx)=>{
  const col=idx%COLS, row=(idx/COLS)|0;
  const ox=GAP+col*(S+GAP), oy=GAP+row*(S+GAP);
  const t=Tile(); fn(t, 7+idx);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const si=((oy+y)*SHEET_W+(ox+x))*3, ti=(y*S+x)*3;
    sheet[si]=t[ti];sheet[si+1]=t[ti+1];sheet[si+2]=t[ti+2];}
  process.stdout.write(`rendered ${name}\n`);
});

// ---------- RGB PNG encoder ----------
function crc32(b){let c=~0;for(let i=0;i<b.length;i++){c^=b[i];for(let k=0;k<8;k++)c=(c>>>1)^(0xEDB88320&-(c&1));}return ~c>>>0;}
function chunk(t,d){const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const ty=Buffer.from(t,"ascii");
  const cr=Buffer.alloc(4);cr.writeUInt32BE(crc32(Buffer.concat([ty,d])));return Buffer.concat([l,ty,d,cr]);}
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(SHEET_W,0);ihdr.writeUInt32BE(SHEET_H,4);
ihdr[8]=8;ihdr[9]=2;
const raw=Buffer.alloc((SHEET_W*3+1)*SHEET_H);
for(let y=0;y<SHEET_H;y++){raw[y*(SHEET_W*3+1)]=0;
  for(let x=0;x<SHEET_W*3;x++)raw[y*(SHEET_W*3+1)+1+x]=sheet[y*SHEET_W*3+x];}
const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),
  chunk("IHDR",ihdr),chunk("IDAT",zlib.deflateSync(raw,{level:9})),chunk("IEND",Buffer.alloc(0))]);
const out=path.join(__dirname,"contact_sheet.png");
fs.writeFileSync(out,png);
console.log("wrote",out,`${SHEET_W}x${SHEET_H}`);
