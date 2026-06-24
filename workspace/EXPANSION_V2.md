# noixzy generative lab — expansion v2
# New modules + features not yet in any doc

> 2026-06-24 — builds on NEXT_MODULES.md and IDEAS_module_expansion.md
> Everything here is net-new ground. Full implementation instructions included.

---

## NEW GENERATED MODULES (via build_lab.js)

---

### 1. Strange Attractor

**What it is.** Iterate a 2D map millions of times and histogram-accumulate the visited points. The density of visits drives brightness. Clifford and de Jong attractors look like exploded calligraphy.

**Clifford map:**
```
x' = sin(a·y) + c·cos(a·x)
y' = sin(b·x) + d·cos(b·y)
```
**de Jong map:**
```
x' = sin(a·y) - cos(b·x)
y' = sin(c·x) - cos(d·y)
```

**System params:**
```js
{k:"a", label:"a", min:-3, max:3, step:.01, v:1.7},
{k:"b", label:"b", min:-3, max:3, step:.01, v:1.8},
{k:"mode", label:"mode", min:0, max:1, step:1, v:0},       // 0=clifford 1=dejong
{k:"pal", label:"palette", min:0, max:9, step:1, v:4},
```

**Implementation (build_lab.js code block):**

```js
let ATT;
function build() {
  const N = 2200000;
  const a = map(P.a,-3,3,-3,3), b = map(P.b,-3,3,-3,3);
  const c = -1.9 + random()*3.8, d = -1.9 + random()*3.8;
  const pts = new Float32Array(N*2);
  let x=0.1, y=0.1;
  for(let i=0;i<N;i++){
    let nx, ny;
    if(P.mode < 0.5) {   // Clifford
      nx = sin(a*y) + c*cos(a*x);
      ny = sin(b*x) + d*cos(b*y);
    } else {              // de Jong
      nx = sin(a*y) - cos(b*x);
      ny = sin(c*x) - cos(d*y);
    }
    x=nx; y=ny; pts[i*2]=x; pts[i*2+1]=y;
  }
  ATT={pts,N};
}
function render(g, pal) {
  const {pts,N} = ATT;
  // find bounds
  let mn0=1e9,mx0=-1e9,mn1=1e9,mx1=-1e9;
  for(let i=0;i<N;i++){mn0=min(mn0,pts[i*2]);mx0=max(mx0,pts[i*2]);mn1=min(mn1,pts[i*2+1]);mx1=max(mx1,pts[i*2+1]);}
  // histogram accumulate into a W×H grid
  const W=g.width, H=g.height;
  const hist = new Uint32Array(W*H);
  for(let i=0;i<N;i++){
    const px = floor(map(pts[i*2],mn0,mx0,0,W-1));
    const py = floor(map(pts[i*2+1],mn1,mx1,0,H-1));
    if(px>=0&&px<W&&py>=0&&py<H) hist[px+py*W]++;
  }
  let mxH=1; for(const v of hist) mxH=max(mxH,v);
  // tone-map with log and draw
  g.loadPixels();
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){
    const t = hist[x+y*W] ? log(1+hist[x+y*W])/log(1+mxH) : 0;
    const c0 = pal[0], c1 = pal[2];
    const i=(x+y*W)*4;
    g.pixels[i]  =lerp(c0[0],c1[0],t); g.pixels[i+1]=lerp(c0[1],c1[1],t);
    g.pixels[i+2]=lerp(c0[2],c1[2],t); g.pixels[i+3]=255;
  }
  g.updatePixels();
}
```

**Why it's noixzy.** Resembles hand-drawn ink — fractal calligraphy, brushwork, spray. Long-exposure glow aesthetic. Every seed is different.

---

### 2. Physarum / Slime Mold

**What it is.** Agents move, deposit trail, sense ahead and steer toward trail. The emergent network forms organic vascular, highway, and web structures.

**Algorithm (Jones 2010):**
1. Each agent has position + heading.
2. Sense at angle ±sensorAngle, distance sensorDist.
3. Rotate toward the stronger trail value.
4. Move forward, deposit trail.
5. Diffuse + decay the trail map each step.

**System params:**
```js
{k:"agents",    label:"agents",       min:0, max:1, step:.01, v:.5},
{k:"sensor",    label:"sensor angle", min:0, max:1, step:.01, v:.4},
{k:"decay",     label:"decay",        min:0, max:1, step:.01, v:.5},
{k:"pal",       label:"palette",      min:0, max:9, step:1,   v:4},
```

**Implementation:**

```js
let PHY_AGT, PHY_TRAIL, PHY_W, PHY_H;
function build(){
  PHY_W=240; PHY_H=240;
  const n=floor(map(P.agents,0,1,2000,20000));
  PHY_AGT=new Float32Array(n*3); // x,y,heading
  for(let i=0;i<n;i++){
    const r=random()*PHY_W*0.22, a=random()*TWO_PI;
    PHY_AGT[i*3]=PHY_W/2+cos(a)*r; PHY_AGT[i*3+1]=PHY_H/2+sin(a)*r;
    PHY_AGT[i*3+2]=a+PI; // face outward from center
  }
  PHY_TRAIL=new Float32Array(PHY_W*PHY_H);
}
function render(g,pal){
  const G=PHY_W, trail=PHY_TRAIL, n=PHY_AGT.length/3;
  const SA=map(P.sensor,0,1,0.1,1.2);   // sensor angle
  const SD=9, step=1.2;
  const decay=map(P.decay,0,1,0.02,0.12);
  const diffuseK=0.22;
  // run several sim steps per render frame
  const steps=floor(map(P.speed,0,1,1,8));
  for(let s=0;s<steps;s++){
    // move agents
    for(let i=0;i<n;i++){
      const bx=PHY_AGT[i*3], by=PHY_AGT[i*3+1], bh=PHY_AGT[i*3+2];
      const sF=trail[floor(clamp(bx+cos(bh)*SD,0,G-1))+floor(clamp(by+sin(bh)*SD,0,G-1))*G]||0;
      const sL=trail[floor(clamp(bx+cos(bh+SA)*SD,0,G-1))+floor(clamp(by+sin(bh+SA)*SD,0,G-1))*G]||0;
      const sR=trail[floor(clamp(bx+cos(bh-SA)*SD,0,G-1))+floor(clamp(by+sin(bh-SA)*SD,0,G-1))*G]||0;
      let nh=bh;
      if(sF>=sL&&sF>=sR){/* keep */}
      else if(sL>sR) nh+=0.26;
      else if(sR>sL) nh-=0.26;
      else nh+=random()<.5?.26:-.26;
      const nx=bx+cos(nh)*step, ny=by+sin(nh)*step;
      if(nx<0||nx>=G||ny<0||ny>=G){ PHY_AGT[i*3+2]=random()*TWO_PI; }
      else { PHY_AGT[i*3]=nx; PHY_AGT[i*3+1]=ny; PHY_AGT[i*3+2]=nh;
             trail[floor(nx)+floor(ny)*G]=min(1,trail[floor(nx)+floor(ny)*G]+0.8); }
    }
    // diffuse + decay
    const tmp=new Float32Array(G*G);
    for(let y=1;y<G-1;y++)for(let x=1;x<G-1;x++){
      const sum=trail[x+y*G]*diffuseK+(trail[(x-1)+y*G]+trail[(x+1)+y*G]+trail[x+(y-1)*G]+trail[x+(y+1)*G])*(1-diffuseK)/4;
      tmp[x+y*G]=max(0,sum-decay);
    }
    PHY_TRAIL.set(tmp);
  }
  // draw trail
  const img=makeField(G,(x,y)=>{
    const t=min(1,trail[x+y*G]*2.2);
    return [lerp(pal[0][0],pal[2][0],t),lerp(pal[0][1],pal[2][1],t),lerp(pal[0][2],pal[2][2],t)];
  });
  g.image(img,0,0,g.width,g.height);
}
```

**Why it's noixzy.** Living, animated, builds over time. Looks like mycelium, star maps, neural networks, mycology. Audio-reactive-ready (route beat to `agents` or `decay`).

---

### 3. Differential Growth

**What it is.** A curve of nodes grows by inserting new nodes. Nodes repel each other but stay connected to their neighbors. The curve writhes, folds, and packs into brain-coral / intestine / crumpled-silk forms.

**Algorithm:**
1. Start with N nodes in a circle.
2. Each frame: grow (insert midpoints where edge > max_len), repel (push nodes away from nearby nodes), constrain (pull back toward neighbors if edge < min_len).
3. Draw the curve.

**System params:**
```js
{k:"growth",    label:"growth",    min:0, max:1, step:.01, v:.5},
{k:"repulsion", label:"repulsion", min:0, max:1, step:.01, v:.5},
{k:"thickness", label:"thickness", min:0, max:1, step:.01, v:.3},
{k:"pal",       label:"palette",   min:0, max:9, step:1,   v:4},
```

**Implementation:**

```js
let DGN;
function build(){
  const n=80; DGN=[];
  for(let i=0;i<n;i++){
    const a=TWO_PI*i/n, r=min(width,height)*0.18;
    DGN.push([width/2+cos(a)*r, height/2+sin(a)*r]);
  }
}
function render(g,pal){
  const maxL=6, minL=2.5;
  const rep=map(P.repulsion,0,1,15,60), repR=rep*2.2;
  const growR=map(P.growth,0,1,0.002,0.018);

  // grow: insert midpoints on long edges
  if(random()<growR*DGN.length){
    let bi=0, bd=0;
    for(let i=0;i<DGN.length;i++){
      const j=(i+1)%DGN.length;
      const d=dist(DGN[i][0],DGN[i][1],DGN[j][0],DGN[j][1]);
      if(d>bd){bd=d;bi=i;}
    }
    if(bd>maxL){
      const j=(bi+1)%DGN.length;
      DGN.splice(bi+1,0,[(DGN[bi][0]+DGN[j][0])/2,(DGN[bi][1]+DGN[j][1])/2]);
    }
  }

  // repulsion
  const nx=DGN.map(()=>[0,0]);
  for(let i=0;i<DGN.length;i++){
    for(let j=0;j<DGN.length;j++){
      if(abs(i-j)<3) continue;
      const dx=DGN[i][0]-DGN[j][0], dy=DGN[i][1]-DGN[j][1];
      const d=sqrt(dx*dx+dy*dy);
      if(d<repR&&d>0.01){const f=rep*(1-d/repR)/d; nx[i][0]+=dx*f; nx[i][1]+=dy*f;}
    }
    // attraction to neighbors
    const p=(i-1+DGN.length)%DGN.length, n=(i+1)%DGN.length;
    for(const nb of[p,n]){
      const dx=DGN[nb][0]-DGN[i][0], dy=DGN[nb][1]-DGN[i][1];
      const d=sqrt(dx*dx+dy*dy);
      if(d>minL){nx[i][0]+=dx*0.45; nx[i][1]+=dy*0.45;}
    }
  }
  for(let i=0;i<DGN.length;i++){DGN[i][0]+=nx[i][0]*0.05; DGN[i][1]+=nx[i][1]*0.05;}

  // draw
  g.noFill();
  const lw=map(P.thickness,0,1,0.8,4);
  g.stroke(pal[2][0],pal[2][1],pal[2][2]); g.strokeWeight(lw);
  g.beginShape();
  for(const [x,y] of DGN) g.curveVertex(x,y);
  g.curveVertex(DGN[0][0],DGN[0][1]); g.curveVertex(DGN[1][0],DGN[1][1]);
  g.endShape();
}
```

**Why it's noixzy.** Organic, textural, evolves over time into complex packed forms. Outputs resemble brain cross-sections, kelp, alien anatomy. Motion-native.

---

### 4. Chladni Figures

**What it is.** Particles settle on the nodal lines of a vibrating plate (where sin(m·x)·sin(n·y) ≈ 0). The result is sand-pattern geometry that changes dramatically between integer mode pairs. Each pair (m,n) is a different "frequency signature".

**System params:**
```js
{k:"m",      label:"mode m",  min:1, max:10, step:1,   v:3},
{k:"n",      label:"mode n",  min:1, max:10, step:1,   v:4},
{k:"noise",  label:"noise",   min:0, max:1,  step:.01,  v:.1},
{k:"pal",    label:"palette", min:0, max:9,  step:1,    v:4},
```

**Implementation:**

```js
let CHLD;
function build(){
  const N=6000, pts=[], m=floor(map(P.m,1,10,1,10)), n=floor(map(P.n,1,10,1,10));
  const noise=map(P.noise,0,1,0,0.4);
  // rejection sample: keep points near nodal lines
  for(let attempt=0;pts.length<N&&attempt<N*40;attempt++){
    let x=random(), y=random();
    const v=abs(sin(m*PI*x)*sin(n*PI*y));
    if(random()<0.04/(v+0.04+random()*noise)){
      pts.push([x*0.88+0.06, y*0.88+0.06]); // normalized 0-1
    }
  }
  CHLD=pts;
}
function render(g,pal){
  g.noStroke();
  const r=map(P.density,0,1,1.2,3.5);
  for(const [x,y] of CHLD){
    const c=pal[2];
    g.fill(c[0],c[1],c[2],210);
    g.circle(x*g.width, y*g.height, r);
  }
}
```

**Note:** Also works beautifully as a heightField — sample `1 - |sin(m·π·x)·sin(n·π·y)|` normalized into a G×G grid. The extrude view shows the ridges as raised terrain.

**Why it's noixzy.** Mathematical beauty, music connection (cymatic resonance), extremely clean. Each (m,n) pair is an instant "track signature". Loop-ready if you morph m/n slowly.

---

### 5. Domain-Warped Marble

**What it is.** Inigo Quilez domain warping: `f(p + f(p + f(p)))`. Layered, iterated noise displacement creates marble veining, fluid streaks, and ink-in-water patterns that no single noise layer can produce.

**System params:**
```js
{k:"warp",    label:"warp",    min:0, max:1, step:.01, v:.5},
{k:"scale",   label:"scale",   min:0, max:1, step:.01, v:.4},
{k:"layers",  label:"layers",  min:0, max:1, step:.01, v:.5},
{k:"pal",     label:"palette", min:0, max:9, step:1,   v:4},
```

**Implementation:**

```js
function build(){}
function render(g,pal){
  const sc=map(P.scale,0,1,1.5,8), w=map(P.warp,0,1,0,1.8);
  const L=floor(map(P.layers,0,1,3,7));
  const t=animT*P.speed*0.12;
  const img=makeField(280,(x,y)=>{
    let px=x/280, py=y/280;
    // 3-pass domain warp (Quilez)
    for(let i=0;i<3;i++){
      const nx=noise(px*sc+i*4.1+t, py*sc+i*2.7)-0.5;
      const ny=noise(px*sc+i*3.3+t+9, py*sc+i*5.1)-0.5;
      px+=nx*w; py+=ny*w;
    }
    // FBM of the warped coords
    let v=0, amp=1, fr=1;
    for(let i=0;i<L;i++){v+=noise(px*fr,py*fr,t*0.3+i)*amp; amp*=.5; fr*=1.9;}
    v=v/1.9; // normalize
    const c0=pal[0],c1=pal[1],c2=pal[2];
    // two-band color ramp
    if(v<0.42) return [lerp(c0[0],c1[0],v/0.42),lerp(c0[1],c1[1],v/0.42),lerp(c0[2],c1[2],v/0.42)];
    return [lerp(c1[0],c2[0],(v-0.42)/0.58),lerp(c1[1],c2[1],(v-0.42)/0.58),lerp(c1[2],c2[2],(v-0.42)/0.58)];
  });
  g.image(img,0,0,g.width,g.height);
}
function heightField(G){
  const sc=map(P.scale,0,1,1.5,8), w=map(P.warp,0,1,0,1.8);
  const L=floor(map(P.layers,0,1,3,7)), t=animT*P.speed*0.12;
  const out=new Float32Array(G*G);
  for(let j=0;j<G;j++)for(let i=0;i<G;i++){
    let px=i/G, py=j/G;
    for(let k=0;k<3;k++){const nx=noise(px*sc+k*4.1,py*sc+k*2.7)-0.5,ny=noise(px*sc+k*3.3+9,py*sc+k*5.1)-0.5;px+=nx*w;py+=ny*w;}
    let v=0,amp=1,fr=1; for(let k=0;k<L;k++){v+=noise(px*fr,py*fr,t+k)*amp;amp*=.5;fr*=1.9;} out[i+j*G]=v/1.9;
  } return out;
}
```

**Why it's noixzy.** The most versatile texture in the lab — marble, agate, rust, skin, lava skin. The heightfield extrude makes instant 3D rock/stone surfaces. Slow drift animation feels liquid.

---

### 6. Curl Noise

**What it is.** The *curl* of a noise field (perpendicular to the gradient) produces divergence-free flow — particles move in closed loops, swirls, and vortices. Unlike flow_field (which uses gradient direction and creates open trails), curl produces rotating structures.

**curl F = (∂Fz/∂y − ∂Fy/∂z, ∂Fx/∂z − ∂Fz/∂x, ∂Fy/∂x − ∂Fx/∂y)**

For 2D: curl_z = ∂n2/∂x − ∂n1/∂y (finite difference of two noise fields).

**System params:**
```js
{k:"scale",  label:"scale",   min:0, max:1, step:.01, v:.4},
{k:"warp",   label:"warp",    min:0, max:1, step:.01, v:.3},
{k:"length", label:"length",  min:0, max:1, step:.01, v:.5},
{k:"pal",    label:"palette", min:0, max:9, step:1,   v:4},
```

**Implementation:**

```js
function build(){}
function render(g,pal){
  const s=map(P.scale,0,1,0.001,0.005);
  const warp=map(P.warp,0,1,0,0.8);
  const steps=floor(map(P.length,0,1,40,140));
  const n=floor(map(P.density,0,1,600,3500));
  const e=0.8; // finite difference step (pixels)
  g.noStroke();
  for(let i=0;i<n;i++){
    let x=random(g.width), y=random(g.height);
    const c=random()<0.4?pal[1]:pal[2];
    g.fill(c[0],c[1],c[2],20);
    for(let j=0;j<steps;j++){
      // curl = ∂n(x,y+e)/∂x - ∂n(x+e,y)/∂y (approximated)
      const n1=(noise((x+e)*s,y*s,animT*P.speed*0.3)-noise((x-e)*s,y*s,animT*P.speed*0.3))/(2*e);
      const n2=(noise(x*s,(y+e)*s,animT*P.speed*0.3+99)-noise(x*s,(y-e)*s,animT*P.speed*0.3+99))/(2*e);
      const cx=n1-n2, cy=n2+n1; // curl direction
      g.circle(x,y,1.2);
      x+=cx*2800*(1+warp); y+=cy*2800*(1+warp);
      if(x<0||x>g.width||y<0||y>g.height) break;
    }
  }
}
```

**Why it's noixzy.** Flow field produces open trajectories — curl produces enclosed vortices, smoke rings, galaxy arms. Visually distinct. Minimal code change from flow_field to add to the lab.

---

## NEW HAND-AUTHORED SDF MODULES

---

### 7. Torus Knot

**What it is.** A (p,q) torus knot is a tube swept along a closed space curve that winds p times around the torus axis and q times through the hole. As p/q morph, the knot changes genus — a single geometry that contains every knot from unknot through trefoil through cinquefoil.

**Shader approach: tube-around-parametric-curve SDF**

```glsl
// Point on the (p,q) torus knot curve at parameter t
vec3 knotPoint(float t, float p, float q) {
  float r1 = 0.8, r2 = 0.28;
  float x = (r1 + r2*cos(q*t)) * cos(p*t);
  float y = (r1 + r2*cos(q*t)) * sin(p*t);
  float z = r2 * sin(q*t);
  return vec3(x,y,z);
}

// SDF: distance from point pos to the tube around the knot
float map(vec3 pos) {
  float tubeR = mix(0.06, 0.14, u_thick);
  float best = 1e9;
  // sample N points along the curve, find closest
  const int STEPS = 96;
  for(int i=0;i<STEPS;i++){
    float t = float(i)/float(STEPS) * 6.2832;
    vec3 cp = knotPoint(t, u_p, u_q);
    best = min(best, length(pos - cp));
  }
  return best - tubeR;
}
```

**Uniforms needed:** `u_p` (float, morph 2→5), `u_q` (float, morph 3→7), `u_thick`, `u_twist` (texture twist along tube)

**Panel params:** `p` (1→1 slider maps to 2.0→5.0), `q`, `thick`, `twist`, `spin`, `ao`

**Key insight:** Morphing p/q continuously produces a shape that *appears to untangle itself* — cinquefoil (2,5) → trefoil (2,3) → unknot (1,0) → Hopf link. This is the single most mathematically interesting animation the lab can produce.

**Coloring:** Use the parametric t value at the closest curve point to drive an HSL color cycle along the tube length — creates a spectrum helix.

---

### 8. Menger Sponge (Box-fold IFS)

**What it is.** Box-fold IFS with absolute-value fold, scale, and offset. More reliable than Sierpinski (the DE is tighter). Different combinations of scale/offset produce Menger sponge, octahedron fractal, and various box-lattice structures.

**map() function:**
```glsl
float map(vec3 p) {
  float sc   = mix(2.6, 3.2, u_scale);
  float off  = mix(0.8, 1.2, u_offset);
  float accS = 1.0;

  for(int i=0;i<8;i++){
    p = abs(p) - vec3(off);           // absolute-value fold
    // sort components so largest is in x
    if(p.x < p.y) p.xy = p.yx;
    if(p.x < p.z) p.xz = p.zx;
    if(p.y < p.z) p.yz = p.zy;
    p.x = p.x * sc - off*(sc-1.0);
    p.yz = p.yz * sc;
    accS *= sc;
  }
  return length(max(abs(p)-vec3(off*0.5),0.0)) / accS;
}
```

**Why use 8 iterations (vs fold's 6):** Box IFS doesn't suffer from self-shadowing as severely as Sierpinski IFS — the geometry is more open. 8 iterations gives crisper lattice edges.

**Camera:** Fixed target `vec3(0)`. Distance `3.8`. Elevation `0.8 + 0.3*sin(t*0.07)`.

**Panel params:** scale, offset, spin, ao, zoom (same u_zoom/u_feat pattern as fold)

**Presets to include:**
- `menger cube` (sc=2.82, off=1.0) — classic Menger sponge
- `octahedral` (sc=3.0, off=0.85) — octahedron fractal
- `lattice wire` (sc=2.65, off=1.15) — open space lattice

---

## ENGINE / FEATURE ADDITIONS

---

### 9. Audio-Reactive Mode

**What it is.** Web Audio API FFT analysis from mic or dropped audio file drives up to 4 module params in real time. Click "audio" → browser asks for mic permission → bass/mid/high/presence values map onto sliders.

**Implementation plan (add to build_lab.js ENGINE):**

**Step 1 — Add audio state:**
```js
let audioCtx, analyser, audioData, audioActive=false;
const ABANDS = {bass:0, mid:0, high:0, presence:0};
```

**Step 2 — Add "audio" button to panel HTML template:**
```html
<button id="btnAudio">audio</button>
```

**Step 3 — Wire up in setup():**
```js
document.getElementById("btnAudio").addEventListener("click", async ()=>{
  if(!audioActive){
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser(); analyser.fftSize=256;
    audioCtx.createMediaStreamSource(stream).connect(analyser);
    audioData = new Uint8Array(analyser.frequencyBinCount);
    audioActive=true; document.getElementById("btnAudio").textContent="audio ●";
  } else { audioActive=false; document.getElementById("btnAudio").textContent="audio"; }
});
```

**Step 4 — Update ABANDS in draw() before render:**
```js
if(audioActive && analyser){
  analyser.getByteFrequencyData(audioData);
  const N=audioData.length;
  const avg=(s,e)=>{let v=0;for(let i=s;i<e;i++)v+=audioData[i];return v/((e-s)*255);};
  ABANDS.bass=avg(0,4); ABANDS.mid=avg(4,20); ABANDS.high=avg(20,60); ABANDS.presence=avg(0,N);
}
```

**Step 5 — Per-piece audio mapping (optional, in render):**
```js
// In flow_field render(), replace:
const n=floor(map(P.density,...));
// with:
const n=floor(map(P.density+ABANDS.bass*0.3,...));
```

**Full feature:** Add a small "audio map" section to the panel — 4 dropdowns (bass/mid/high/presence → any param). This is the right way, but start with hardcoded per-piece mappings first.

---

### 10. 2×2 Tiling Preview

**What it is.** A button that renders the module at half scale four times in a 2×2 grid. Instant seamless-texture check. Essential for the 2D generated modules whose outputs are used as Blender textures.

**Implementation (engine-level, one new mode):**

```js
let tilingMode = false;
// In panel HTML:
// <button id="btnTile">tile 2×2</button>

// In setup():
document.getElementById("btnTile").addEventListener("click",()=>{
  tilingMode=!tilingMode;
  document.getElementById("btnTile").textContent=tilingMode?"tile 1×1":"tile 2×2";
  dirty=true;
});

// In draw(), after rendering buf to the main canvas:
if(tilingMode){
  // Draw the offscreen buf into 4 quadrants
  const hw=width/2, hh=height/2;
  image(buf,0,0,hw,hh); image(buf,hw,0,hw,hh);
  image(buf,0,hh,hw,hh); image(buf,hw,hh,hw,hh);
}
```

**Note:** This only looks good if the render is actually seamless. Most noise-based modules are seamless. Flow field and l_system are not — that becomes immediately visible, which is useful information.

---

### 11. Palette from Image Drop

**What it is.** Drop a PNG/JPG onto any module panel. Extract the 3 most perceptually distinct colors. Apply them as bg/accent/ink. Immediately rethemes the module to match any reference image.

**Implementation:**

```js
// In setup() — add drop zone to the panel div:
const panel = document.getElementById("panel");
panel.addEventListener("dragover", e=>e.preventDefault());
panel.addEventListener("drop", e=>{
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if(!file||!file.type.startsWith("image/")) return;
  const url=URL.createObjectURL(file);
  const img=new Image(); img.src=url;
  img.onload=()=>{
    // downsample to 16×16 canvas for fast extraction
    const c=document.createElement("canvas"); c.width=c.height=16;
    const ctx=c.getContext("2d"); ctx.drawImage(img,0,0,16,16);
    const px=ctx.getImageData(0,0,16,16).data;
    // collect all 256 colors, find 3 by k-means or simple extremes
    let colors=[];
    for(let i=0;i<px.length;i+=4) colors.push([px[i],px[i+1],px[i+2]]);
    // simple: darkest, most saturated, brightest
    const dark=colors.reduce((a,b)=>(a[0]+a[1]+a[2])<(b[0]+b[1]+b[2])?a:b);
    const bright=colors.reduce((a,b)=>(a[0]+a[1]+a[2])>(b[0]+b[1]+b[2])?a:b);
    const sat=colors.reduce((a,b)=>{ const sa=Math.max(...a)-Math.min(...a), sb=Math.max(...b)-Math.min(...b); return sa>sb?a:b; });
    const toHex=([r,g,b])=>'#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
    cs.bg=toHex(dark); cs.form=toHex(sat); cs.hi=toHex(bright);
    syncColorUI(); dirty=true;
  };
});
```

**Why it's useful.** The most requested creative workflow: "make the module match this album cover / moodboard / still." Zero new UI needed, just a drop handler.

---

### 12. Seed in PNG Filename

**What it is.** Tiny one-line fix already noted but never done. Change save filename from `noixzy_truchet_1234567.png` to `noixzy_truchet_s42_1234567.png` so the artist can trace stills back to seeds from their file library.

**Implementation (build_lab.js, one line in the save handler):**

Find the existing save line in the engine:
```js
saveCanvas(`noixzy_${cfg.id}_${Math.floor(millis())}`, "png");
```
Change to:
```js
saveCanvas(`noixzy_${cfg.id}_s${seed}_${Math.floor(millis())}`, "png");
```

Same change needed in each hand-authored flagship's `btnSave` listener.

---

## IMPLEMENTATION ORDER (recommended)

| Priority | Task | Files | Effort |
|---|---|---|---|
| 1 | Seed in PNG filename | build_lab.js + 6 flagships | 30 min |
| 2 | Domain-warped marble | build_lab.js | 1 hr |
| 3 | Curl noise | build_lab.js | 1 hr |
| 4 | Tiling preview button | build_lab.js ENGINE | 45 min |
| 5 | Strange attractor | build_lab.js | 1.5 hr |
| 6 | Chladni figures | build_lab.js | 1 hr |
| 7 | Torus knot | new flagship HTML | 2 hr |
| 8 | Menger sponge | new flagship HTML | 1.5 hr |
| 9 | Physarum / slime mold | build_lab.js | 2 hr |
| 10 | Differential growth | build_lab.js | 2 hr |
| 11 | Audio-reactive mode | build_lab.js ENGINE | 2 hr |
| 12 | Palette from image drop | build_lab.js ENGINE | 1 hr |

---

## ChatGPT handoff block (paste before any of these tasks)

```
Project: noixzy generative lab
Working dir: ~/Downloads/noixzy_generative_lab/
Canonical mirror: ~/noixzy_generative_lab/
Brief: workspace/CHATGPT_BRIEF.md
Full module + feature roadmap: workspace/EXPANSION_V2.md

Rules:
- NEVER hand-edit generated HTML files — edit build_lab.js, then node build_lab.js
- p5.js global mode: setup(), draw(), noise(), random(), map(), lerp() are globals
- UI binds in setup() only
- After any change: produce the complete updated file, not a diff
- Mirror: cp <file> ~/noixzy_generative_lab/<file>
- Generated modules use makeField(N, (x,y)=>[r,g,b]) for pixel-grid renders
- SHARED params are auto-injected — do not redeclare zoom, rot, mirror, speed, drift, etc.

When implementing a new generated module:
1. Add a new entry to the PIECES array at the bottom of build_lab.js
2. Add system[] with 3-4 unique sliders (SHARED provides the rest)
3. Write build(), render(g,pal), and optionally heightField(G)
4. Run: node build_lab.js
5. Test in browser before reporting done
```
