// noixzy // cellular-erosion -> grayscale displacement map (headless, pure node)
// Mirrors the HTML piece's algorithm: seeded noise -> threshold -> CA smoothing
// -> distance-to-edge depth ramp. Outputs an 8-bit grayscale PNG.
const zlib = require("zlib");
const fs = require("fs");

const SEED = parseInt(process.argv[2] || "7", 10);
const N = parseInt(process.argv[3] || "512", 10);     // resolution (square)
const OUT = process.argv[4] || `noixzy_cellular_erosion_map_${SEED}.png`;

// --- seeded RNG (mulberry32) ---
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0;
  let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t;
  return ((t^t>>>14)>>>0)/4294967296; }; }
let rng = mulberry32(SEED);

// --- value noise (deterministic from seed) ---
function hash2(ix,iy){ let h=ix*374761393+iy*668265263+SEED*2246822519;
  h=(h^(h>>>13))*1274126177; h^=h>>>16; return ((h>>>0)/4294967296); }
const smooth=t=>t*t*(3-2*t);
function vnoise(x,y){
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
  const a=hash2(ix,iy),b=hash2(ix+1,iy),c=hash2(ix,iy+1),d=hash2(ix+1,iy+1);
  const u=smooth(fx),v=smooth(fy);
  return (a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v;
}

// --- params (match lab defaults: fill .48, iters .5, grain .4) ---
const fillP = 0.35 + 0.48*(0.62-0.35);   // ~0.486
const grain = 0.4*0.5;                    // 0.2
const iters = 4;

let g = new Uint8Array(N*N);
for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  const n = vnoise(x*0.05, y*0.05)*(1-grain) + rng()*grain;
  g[x+y*N] = n < fillP ? 1 : 0;
}
// CA smoothing
function smoothPass(src){
  const o=new Uint8Array(N*N);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    let s=0,c=0;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      const nx=x+dx,ny=y+dy; if(nx<0||ny<0||nx>=N||ny>=N)continue;
      s+=src[nx+ny*N]; c++;
    }
    o[x+y*N]= s> c/2 ?1:0;
  }
  return o;
}
for(let k=0;k<iters;k++) g=smoothPass(g);

// distance-to-edge depth ramp (BFS-ish relaxation)
let d=new Float32Array(N*N);
for(let i=0;i<d.length;i++) d[i]=g[i]?9999:0;
for(let pass=0;pass<80;pass++){
  let changed=false;
  for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++){
    const i=x+y*N; if(!g[i])continue;
    const m=Math.min(d[i-1],d[i+1],d[i-N],d[i+N])+1;
    if(m<d[i]){d[i]=m;changed=true;}
  }
  if(!changed)break;
}
let mx=1; for(const v of d) mx=Math.max(mx,v);

// to grayscale bytes: bg=0, eroded cells ramp 90->255
const px = new Uint8Array(N*N);
for(let i=0;i<N*N;i++){
  px[i] = g[i] ? Math.round(90 + (d[i]/mx)*165) : 0;
}

// --- minimal grayscale PNG encoder ---
function crc32(buf){
  let c=~0;
  for(let i=0;i<buf.length;i++){ c^=buf[i];
    for(let k=0;k<8;k++) c = (c>>>1) ^ (0xEDB88320 & -(c&1)); }
  return ~c >>> 0;
}
function chunk(type,data){
  const len=Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t=Buffer.from(type,"ascii");
  const crc=Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t,data])));
  return Buffer.concat([len,t,data,crc]);
}
const sig=Buffer.from([137,80,78,71,13,10,26,10]);
const ihdr=Buffer.alloc(13);
ihdr.writeUInt32BE(N,0); ihdr.writeUInt32BE(N,4);
ihdr[8]=8; ihdr[9]=0; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0;  // 8-bit grayscale
// scanlines with filter byte 0
const raw=Buffer.alloc((N+1)*N);
for(let y=0;y<N;y++){ raw[y*(N+1)]=0;
  for(let x=0;x<N;x++) raw[y*(N+1)+1+x]=px[y*N+x]; }
const idat=zlib.deflateSync(raw,{level:9});
const png=Buffer.concat([sig,chunk("IHDR",ihdr),chunk("IDAT",idat),chunk("IEND",Buffer.alloc(0))]);

const path=require("path");
const outPath=path.join(__dirname,OUT);
fs.writeFileSync(outPath,png);
console.log("wrote",outPath,`${N}x${N}`,"seed",SEED);
