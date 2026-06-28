(function () {
  "use strict";

  const MODULES = {
    lenia_kernel_garden: { title: "noixzy lenia kernel garden", concept: "Continuous cellular-life field as soft nano organisms and garden pools.", mode: "lenia", accent: "#a8d0ad", seed: "lenia-kernel-001", controls: [["kernel radius", 8, 80, 1, 32], ["growth center", 0, 100, 1, 48], ["growth width", 1, 80, 1, 24], ["timestep", 1, 80, 1, 26], ["stack layers", 1, 9, 1, 4], ["nano cells", 8, 80, 1, 32], ["bump", 0, 100, 1, 46], ["palette", 0, 5, 1, 2]] },
    superformula_shell_stack: { title: "noixzy superformula shell stack", concept: "Nested supershape shells with recursive symmetry and petal extrusion.", mode: "super", accent: "#d6b6dc", seed: "superformula-001", controls: [["symmetry m", 2, 18, 1, 7], ["n1", 10, 160, 1, 42], ["n2", 10, 160, 1, 85], ["n3", 10, 160, 1, 68], ["stack count", 1, 14, 1, 7], ["array phase", 0, 100, 1, 34], ["extrude", 0, 100, 1, 44], ["line weight", 1, 8, 1, 2]] },
    falling_sand_microphysics: { title: "noixzy falling sand microphysics", concept: "Cellular sand, water, and ember grains as lightweight material physics.", mode: "sand", accent: "#d4bd84", seed: "sand-micro-001", controls: [["emit rate", 2, 80, 1, 34], ["gravity", 0, 100, 1, 64], ["viscosity", 0, 100, 1, 42], ["material mix", 0, 100, 1, 54], ["cell size", 3, 18, 1, 8], ["pile height", 0, 100, 1, 38], ["bump", 0, 100, 1, 44], ["displace", 0, 100, 1, 24]] },
    cyclic_ca_spiral_reactor: { title: "noixzy cyclic ca spiral reactor", concept: "Rock-paper-scissors cellular automata forming chemical spiral waves.", mode: "cyclic", accent: "#b8d8e6", seed: "cyclic-ca-001", controls: [["state count", 3, 12, 1, 6], ["win threshold", 1, 8, 1, 3], ["neighborhood", 1, 5, 1, 2], ["init noise", 0, 100, 1, 48], ["cell size", 4, 24, 1, 10], ["tick rate", 1, 60, 1, 24], ["bump", 0, 100, 1, 32], ["palette", 0, 5, 1, 1]] },
    strange_attractor_dust: { title: "noixzy strange attractor dust", concept: "Chaotic Clifford/de Jong dust field with long-exposure glow.", mode: "attractor", accent: "#9dc7ff", seed: "attractor-dust-001", controls: [["point count", 200, 2400, 1, 1200], ["a", -300, 300, 1, 170], ["b", -300, 300, 1, -220], ["c", -300, 300, 1, 190], ["d", -300, 300, 1, -240], ["exposure", 0, 100, 1, 52], ["orbit stack", 1, 8, 1, 3], ["glow", 0, 100, 1, 56]] },
    fourier_epicycle_array: { title: "noixzy fourier epicycle array", concept: "Clockwork epicycles drawing recursive sigil traces.", mode: "fourier", accent: "#d8c68b", seed: "fourier-array-001", controls: [["harmonics", 2, 48, 1, 18], ["speed", 0, 100, 1, 36], ["trail decay", 0, 100, 1, 44], ["scale", 20, 120, 1, 72], ["wobble", 0, 100, 1, 28], ["array copies", 1, 9, 1, 4], ["ring offset", 0, 100, 1, 46], ["line weight", 1, 8, 1, 2]] },
    hitomezashi_stitch_matrix: { title: "noixzy hitomezashi stitch matrix", concept: "Binary sashiko stitch grids with nano textile modularity.", mode: "stitch", accent: "#cdd6b4", seed: "stitch-matrix-001", controls: [["density", 8, 56, 1, 28], ["stitch length", 2, 28, 1, 12], ["row seed", 0, 100, 1, 42], ["column seed", 0, 100, 1, 58], ["offset", 0, 100, 1, 38], ["subdivision", 1, 6, 1, 2], ["thread bump", 0, 100, 1, 34], ["palette", 0, 5, 1, 0]] },
    thin_film_interference: { title: "noixzy thin film interference", concept: "Oil-slick chromatic interference as layered nano-film contour bands.", mode: "film", accent: "#98d6d2", seed: "thin-film-001", controls: [["film thickness", 1, 100, 1, 48], ["angle spread", 0, 100, 1, 58], ["noise warp", 0, 100, 1, 34], ["saturation", 0, 100, 1, 72], ["band count", 4, 64, 1, 28], ["layer stack", 1, 10, 1, 4], ["bump", 0, 100, 1, 44], ["speed", 0, 100, 1, 24]] },
    spectrogram_ridge_terrain: { title: "noixzy spectrogram ridge terrain", concept: "Audio-like frequency terrain built from synthetic spectral ridges.", mode: "spectrogram", accent: "#b7c9e8", seed: "spectrogram-ridge-001", controls: [["time window", 8, 80, 1, 42], ["frequency scale", 1, 80, 1, 36], ["height", 0, 100, 1, 58], ["smoothing", 0, 100, 1, 48], ["ridge count", 6, 64, 1, 28], ["extrude", 0, 100, 1, 54], ["nano ticks", 0, 100, 1, 36], ["palette", 0, 5, 1, 3]] },
    magnetic_dipole_linework: { title: "noixzy magnetic dipole linework", concept: "Invisible-force field lines flowing between charges and nano pins.", mode: "magnetic", accent: "#b2d8ca", seed: "dipole-lines-001", controls: [["charge count", 2, 10, 1, 4], ["field strength", 0, 100, 1, 62], ["line density", 8, 100, 1, 48], ["curl", 0, 100, 1, 24], ["step length", 1, 16, 1, 6], ["nano pins", 0, 100, 1, 48], ["bump", 0, 100, 1, 26], ["speed", 0, 100, 1, 28]] }
  };

  const palettes = [
    ["#070707", "#d7c8a4", "#86c8c0"], ["#050706", "#a8d0ad", "#e4d8b6"], ["#08070a", "#d6b6dc", "#78d5d0"],
    ["#05080b", "#9dc7ff", "#e8c779"], ["#090805", "#d4bd84", "#9bb7d2"], ["#060606", "#cdd6b4", "#d78f71"]
  ];

  function hash(text) { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let t = hash(seed) || 1; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  function hsl(h, s, l, a) { return `hsla(${h}, ${s}%, ${l}%, ${a})`; }

  window.initNoixzyBatch12Math = function initNoixzyBatch12Math(id) {
    const mod = MODULES[id];
    if (!mod) throw new Error("unknown batch 12 module: " + id);
    document.title = mod.title;
    const style = document.createElement("style");
    style.textContent = `:root{color-scheme:dark;--a:${mod.accent};--t:#e8e1d4;--m:#8c877d}*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#050505;color:var(--t);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}body{display:grid;grid-template-columns:minmax(0,1fr) 292px}main{min-width:0;min-height:0;background:radial-gradient(circle at 50% 24%,rgba(255,255,255,.07),transparent 36%),linear-gradient(#101010,#020202)}canvas{display:block;width:100%;height:100%}aside{border-left:1px solid #2b2b2b;background:#101010;padding:14px;overflow:auto}h1{margin:0 0 5px;font-size:15px;text-transform:lowercase}.sub,.note{color:var(--m);font-size:11px;line-height:1.45}.buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0}button{height:34px;border:1px solid #373737;background:#171717;color:var(--t);font:inherit;font-size:11px;cursor:pointer}.row{display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center;margin-bottom:12px}.row span{font-size:11px;color:var(--m)}input[type=text]{width:100%;background:#080808;border:1px solid #343434;color:var(--t);padding:8px;font:inherit;font-size:11px}.control{border-top:1px solid #222;padding:9px 0}.head{display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;color:var(--m)}.head b{font-weight:400;color:var(--a)}input[type=range]{width:100%;accent-color:var(--a)}.physics-toggle{display:flex;align-items:center;gap:8px;margin:10px 0 12px;padding:9px 0;border-top:1px solid #222;border-bottom:1px solid #222;color:var(--m);font-size:11px;text-transform:lowercase}.physics-toggle input{accent-color:var(--a)}@media(max-width:760px){body{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) 315px}aside{border-left:0;border-top:1px solid #2b2b2b}}`;
    document.head.appendChild(style);
    document.body.innerHTML = `<main><canvas id="view"></canvas></main><aside><h1>${mod.title}</h1><p class="sub">${mod.concept}</p><div class="buttons"><button id="play">pause</button><button id="randomize">randomize</button><button id="reset">reset</button><button id="export">export png</button></div><div class="row"><span>seed</span><input id="seed" value="${mod.seed}" spellcheck="false"></div><div id="controls"></div><label class="physics-toggle"><input id="experimental-physics" type="checkbox"> experimental physics</label><p class="note">module-level parameters include stack/array/recursive/nano controls where useful; no global stage layer required.</p></aside>`;
    const canvas = document.getElementById("view"), ctx = canvas.getContext("2d"), controls = document.getElementById("controls"), seedEl = document.getElementById("seed");
    const state = Object.fromEntries(mod.controls.map(c => [c[0], c[4]]));
    let w = 1, h = 1, dpr = 1, frame = 0, running = true;
    let experimentalPhysics = false;
    function snapToStep(value, min, max, step) {
      const safeStep = Number(step) || 1;
      const snapped = Math.round(value / safeStep) * safeStep;
      const clamped = Math.max(Number(min), Math.min(Number(max), snapped));
      return Number.isInteger(safeStep) ? Math.round(clamped) : Number(clamped.toFixed(3));
    }
    function randomBiasFor(key) {
      const k = String(key).toLowerCase();
      if (/palette|material|color|hue/.test(k)) return Math.random();
      if (/density|count|steps|grid|cells|points|nodes|modules|copies|ribbons|rings|lots|pins|markers|bays|divisions|segments|particles|agents|threads|strands|colonies|cracks|repeats/.test(k)) return 0.38 + Math.random() * 0.62;
      if (/extrude|depth|height|stack|layer|relief|bump|displace|amplitude|thickness|width|size|scale|span|vault|socket|scaffold|subdivision|recursion|order|branch|iteration|deflation/.test(k)) return 0.28 + Math.random() * 0.72;
      if (/offset|jitter|noise|field|force|curl|twist|warp|phase|bias|tilt|rotation|entropy|diffusion|oscillation|turbulence|morph|strictness|void|mortar/.test(k)) return 0.12 + Math.random() * 0.76;
      if (/line|stroke|trace|arc/.test(k)) return 0.18 + Math.random() * 0.62;
      return 0.15 + Math.random() * 0.7;
    }
    function randomizeModuleControls() {
      controls.querySelectorAll(".control").forEach(wrap => {
        const input = wrap.querySelector('input[type="range"]');
        if (!input) return;
        const labelNode = wrap.querySelector(".head span, .control-head label");
        const valueNode = wrap.querySelector(".head b, .value");
        const key = labelNode ? labelNode.textContent.trim() : input.id;
        const min = Number(input.min), max = Number(input.max), step = Number(input.step) || 1;
        const value = snapToStep(min + (max - min) * randomBiasFor(key), min, max, step);
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        if (valueNode) valueNode.textContent = value;
      });
      experimentalPhysics = Math.random() > 0.55;
      const physics = document.getElementById("experimental-physics");
      if (physics) physics.checked = experimentalPhysics;
      applyExperimentalPhysics();
    }
    function applyExperimentalPhysics() {
      const dx = experimentalPhysics ? Math.sin(frame * 0.017) * 4.5 : 0;
      const dy = experimentalPhysics ? Math.cos(frame * 0.013) * 3.5 : 0;
      const breathe = experimentalPhysics ? 1 + Math.sin(frame * 0.011) * 0.004 : 1;
      canvas.style.transformOrigin = "50% 50%";
      canvas.style.transform = experimentalPhysics ? `translate3d(${dx}px, ${dy}px, 0) scale(${breathe})` : "";
      canvas.style.filter = experimentalPhysics ? "contrast(1.06) saturate(1.08)" : "";
    }

    mod.controls.forEach(([key, min, max, step]) => {
      const div = document.createElement("div"); div.className = "control";
      div.innerHTML = `<div class="head"><span>${key}</span><b>${state[key]}</b></div><input type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}">`;
      controls.appendChild(div);
      div.querySelector("input").oninput = e => { state[key] = Number(e.target.value); div.querySelector("b").textContent = state[key]; draw(true); };
    });

    const physicsToggle = document.getElementById("experimental-physics");
    if (physicsToggle) physicsToggle.onchange = () => { experimentalPhysics = physicsToggle.checked; applyExperimentalPhysics(); draw(true); };

    function pal() { return palettes[Math.abs(Math.floor(state.palette || 0)) % palettes.length]; }
    function clear(alpha = 1) { const p = pal(); ctx.fillStyle = alpha >= 1 ? p[0] : `rgba(5,5,5,${alpha})`; ctx.fillRect(0, 0, w, h); }

    function resize() { dpr = Math.max(1, Math.min(2, devicePixelRatio || 1)); const r = canvas.getBoundingClientRect(); w = Math.max(320, r.width); h = Math.max(260, r.height); canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(true); }
    function rect3(x, y, ww, hh, dep, fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, ww, hh); ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dep, y - dep * .45); ctx.lineTo(x + ww + dep, y - dep * .45); ctx.lineTo(x + ww, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,.30)"; ctx.beginPath(); ctx.moveTo(x + ww, y); ctx.lineTo(x + ww + dep, y - dep * .45); ctx.lineTo(x + ww + dep, y + hh - dep * .45); ctx.lineTo(x + ww, y + hh); ctx.closePath(); ctx.fill(); }
    function draw(full) {
      const p = pal(); clear(/attractor|fourier/.test(mod.mode) && !full ? .08 : 1);
      const R = rng(seedEl.value + mod.mode), cx = w / 2, cy = h / 2, t = frame * .012;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (mod.mode === "lenia") {
        const n = state["nano cells"], layers = state["stack layers"]; for (let l = 0; l < layers; l++) for (let i = 0; i < n; i++) { const a = R() * 6.283 + t * state.timestep * .04 + l; const rr = Math.min(w,h) * (.06 + R() * .36) + Math.sin(i + t) * state["growth width"]; const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a * 1.2) * rr * .65; ctx.fillStyle = hsl(95 + l * 18, 26 + state.bump * .18, 28 + R() * 32, .18 + state["growth center"] * .005); ctx.beginPath(); ctx.arc(x, y, state["kernel radius"] * (.12 + R() * .12), 0, 6.283); ctx.fill(); }
      } else if (mod.mode === "super") {
        for (let s = state["stack count"]; s >= 1; s--) { ctx.beginPath(); const scale = Math.min(w,h) * (.055 + s * .025 + state.extrude * .0007); for (let i = 0; i <= 360; i++) { const th = i * Math.PI / 180; const m = state["symmetry m"], n1 = state.n1 / 50, n2 = state.n2 / 50, n3 = state.n3 / 50; const r = Math.pow(Math.pow(Math.abs(Math.cos(m * th / 4)), n2) + Math.pow(Math.abs(Math.sin(m * th / 4)), n3), -1 / Math.max(.1, n1)); const x = cx + Math.cos(th + s * state["array phase"] * .002) * r * scale; const y = cy + Math.sin(th) * r * scale; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = s % 2 ? p[1] : p[2]; ctx.lineWidth = state["line weight"]; ctx.stroke(); }
      } else if (mod.mode === "sand") {
        const cs = state["cell size"], cols = Math.ceil(w / cs), rows = Math.ceil(h / cs); for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const fall = (y / rows) * 100 + Math.sin(x * .2 + t * state.gravity) * state.viscosity * .08; if (fall > 100 - state["pile height"] || R() * 100 < state["emit rate"] * .08) { ctx.fillStyle = R() * 100 < state["material mix"] ? p[1] : p[2]; rect3(x * cs, y * cs, cs * .82, cs * .82, state.displace * .05 + state.bump * .03, ctx.fillStyle); } }
      } else if (mod.mode === "cyclic") {
        const cs = state["cell size"], cols = Math.ceil(w / cs), rows = Math.ceil(h / cs); for (let y=0;y<rows;y++) for(let x=0;x<cols;x++){ const v=(hash(seedEl.value+x+","+y+Math.floor(frame/Math.max(1,state["tick rate"])))+x*y+state["init noise"])%state["state count"]; ctx.fillStyle=hsl(190+v*36+state.palette*12,35,18+v*5+state.bump*.08,.86); ctx.fillRect(x*cs,y*cs,cs-1,cs-1); }
      } else if (mod.mode === "attractor") {
        let x=.1,y=.1; const a=state.a/100,b=state.b/100,c=state.c/100,d=state.d/100; ctx.globalAlpha=.08+state.exposure*.006; ctx.fillStyle=p[2]; for(let stack=0;stack<state["orbit stack"];stack++) for(let i=0;i<state["point count"];i++){ const nx=Math.sin(a*y)-Math.cos(b*x), ny=Math.sin(c*x)-Math.cos(d*y); x=nx;y=ny; ctx.fillRect(cx+x*w*.16+stack*state.glow*.08,cy+y*h*.16,1.1,1.1); } ctx.globalAlpha=1;
      } else if (mod.mode === "fourier") {
        for (let copy=0;copy<state["array copies"];copy++){ let x=cx+Math.cos(copy)*state["ring offset"], y=cy+Math.sin(copy)*state["ring offset"]; ctx.beginPath(); ctx.moveTo(x,y); for(let hrm=1;hrm<=state.harmonics;hrm++){ const r=state.scale*1.5/hrm; x+=Math.cos(t*state.speed*.04*hrm+copy+Math.sin(hrm)*state.wobble*.01)*r; y+=Math.sin(t*state.speed*.04*hrm+copy)*r; ctx.lineTo(x,y); } ctx.strokeStyle=copy%2?p[1]:p[2]; ctx.lineWidth=state["line weight"]; ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,3,0,6.283); ctx.fillStyle=p[2]; ctx.fill(); }
      } else if (mod.mode === "stitch") {
        const n=state.density, gap=Math.min(w,h)*.82/n, ox=(w-gap*n)/2, oy=(h-gap*n)/2; ctx.strokeStyle=p[1]; ctx.lineWidth=Math.max(1,state["thread bump"]*.04); for(let y=0;y<n;y++) for(let x=0;x<n;x++){ const on=((hash(seedEl.value+(x+state["column seed"])+","+(y+state["row seed"]))>>1)&1); if(!on) continue; const px=ox+x*gap, py=oy+y*gap, len=gap*state["stitch length"]*.07; ctx.beginPath(); if((x+y+state.offset)%2){ctx.moveTo(px,py);ctx.lineTo(px+len,py);} else {ctx.moveTo(px,py);ctx.lineTo(px,py+len);} ctx.stroke(); }
      } else if (mod.mode === "film") {
        for(let l=0;l<state["layer stack"];l++) for(let i=0;i<state["band count"];i++){ const y=h*(i+.5)/state["band count"]; ctx.strokeStyle=hsl((i*18+l*28+state["film thickness"]*3+frame*state.speed*.01)%360,state.saturation,45+Math.sin(i+l)*18,.34); ctx.lineWidth=2+state.bump*.03; ctx.beginPath(); for(let x=0;x<=w;x+=8){const yy=y+Math.sin(x*.012*state["angle spread"]+i+l+t)*state["noise warp"]*.25+l*state.bump*.18; x?ctx.lineTo(x,yy):ctx.moveTo(x,yy);} ctx.stroke(); }
      } else if (mod.mode === "spectrogram") {
        const rows=state["ridge count"], cols=state["time window"]; for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ const amp=(Math.sin(x*.45+y*.9+t)+Math.sin(x*.13*state["frequency scale"]+y))*0.5+1; const ww=w*.82/cols, hh=(amp*state.height*.35)+2; rect3(w*.09+x*ww, h*.78-y*h*.62/rows-hh, ww*.78, hh, state.extrude*.12, hsl(210+y*5+state.palette*18,28,28+amp*16,.82)); if(R()*100<state["nano ticks"]*.08){ctx.fillStyle=p[2];ctx.fillRect(w*.09+x*ww,h*.78-y*h*.62/rows-hh-4,2,2);} }
      } else if (mod.mode === "magnetic") {
        const charges=[]; for(let i=0;i<state["charge count"];i++){const a=i*6.283/state["charge count"]+t;charges.push([cx+Math.cos(a)*w*.24,cy+Math.sin(a*1.3)*h*.22,i%2?1:-1]);}
        for(let l=0;l<state["line density"];l++){let x=R()*w,y=R()*h;ctx.beginPath();ctx.moveTo(x,y);for(let s=0;s<70;s++){let vx=0,vy=0;charges.forEach(c=>{const dx=x-c[0],dy=y-c[1],rr=dx*dx+dy*dy+80;vx+=c[2]*dx/rr*state["field strength"];vy+=c[2]*dy/rr*state["field strength"];});const a=Math.atan2(vy,vx)+state.curl*.01;x+=Math.cos(a)*state["step length"];y+=Math.sin(a)*state["step length"];ctx.lineTo(x,y);}ctx.strokeStyle=hsl(160+l*.7,30,62,.22);ctx.lineWidth=1+state.bump*.015;ctx.stroke();} charges.forEach(c=>{ctx.fillStyle=p[2];ctx.beginPath();ctx.arc(c[0],c[1],3+state["nano pins"]*.035,0,6.283);ctx.fill();});
      }
      ctx.fillStyle = "rgba(232,225,212,.68)"; ctx.font = "11px ui-monospace,monospace"; ctx.fillText(seedEl.value, 16, h - 18);
    }
    function tick(){ if(running){frame++; applyExperimentalPhysics(); draw(false);} requestAnimationFrame(tick); }
    document.getElementById("play").onclick=()=>{running=!running;document.getElementById("play").textContent=running?"pause":"play";draw(true);};
    document.getElementById("randomize").onclick=()=>{seedEl.value=mod.mode+"-"+Math.floor(Math.random()*999999).toString(36);randomizeModuleControls();draw(true);};
    document.getElementById("reset").onclick=()=>location.reload();
    document.getElementById("export").onclick=()=>{draw(true); const a=document.createElement("a"); a.download=id+".png"; a.href=canvas.toDataURL("image/png"); a.click();};
    seedEl.oninput=()=>draw(true); addEventListener("resize", resize); resize(); applyExperimentalPhysics(); tick();
  };
})();
