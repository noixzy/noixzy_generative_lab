(function () {
  "use strict";

  const MODULES = {
    gosper_curve_city: { title: "noixzy gosper curve city", concept: "Gosper/flowsnake space-filling city plans with nested block stacks.", mode: "gosper", accent: "#b8d5c7", seed: "gosper-city-001", controls: [["order", 1, 5, 1, 4], ["segment", 4, 28, 1, 11], ["turn bias", -60, 60, 1, 0], ["block height", 0, 100, 1, 44], ["street width", 1, 8, 1, 2], ["array copies", 1, 7, 1, 3], ["nano lots", 0, 100, 1, 40], ["palette", 0, 5, 1, 1]] },
    turmite_masonry: { title: "noixzy turmite masonry", concept: "Turmite rule paths carving brick, ash, and nano-stone courses.", mode: "turmite", accent: "#d2a487", seed: "turmite-masonry-001", controls: [["steps", 200, 3600, 1, 1500], ["cell size", 4, 18, 1, 8], ["turn rule", 0, 100, 1, 54], ["state count", 2, 8, 1, 4], ["mortar", 0, 100, 1, 42], ["extrude", 0, 100, 1, 36], ["bump", 0, 100, 1, 44], ["palette", 0, 5, 1, 4]] },
    quasicrystal_diffraction_garden: { title: "noixzy quasicrystal diffraction garden", concept: "Aperiodic diffraction blooms with nano garden pins and radial symmetry.", mode: "quasi", accent: "#d6c78f", seed: "quasi-garden-001", controls: [["symmetry", 5, 14, 1, 9], ["wave count", 2, 12, 1, 6], ["phase", 0, 100, 1, 25], ["threshold", 0, 100, 1, 56], ["pin density", 8, 90, 1, 44], ["bump", 0, 100, 1, 38], ["displace", 0, 100, 1, 26], ["palette", 0, 5, 1, 2]] },
    ifs_fern_scaffold: { title: "noixzy ifs fern scaffold", concept: "Barnsley/IFS fern growth as architectural scaffold foliage.", mode: "fern", accent: "#9fc486", seed: "ifs-fern-001", controls: [["point count", 500, 5200, 1, 2600], ["stem bias", 0, 100, 1, 44], ["leaf spread", 0, 100, 1, 62], ["scaffold", 0, 100, 1, 40], ["stack layers", 1, 9, 1, 4], ["node size", 1, 6, 1, 2], ["bump", 0, 100, 1, 30], ["palette", 0, 5, 1, 1]] },
    wang_tile_machine: { title: "noixzy wang tile machine", concept: "Rule-table Wang tiles with coded edge colors and kit-part cells.", mode: "wang", accent: "#9cc7d7", seed: "wang-machine-001", controls: [["grid", 8, 42, 1, 23], ["tile set", 2, 9, 1, 5], ["rule strictness", 0, 100, 1, 72], ["arc thickness", 1, 9, 1, 3], ["kitbash cells", 0, 100, 1, 38], ["extrude", 0, 100, 1, 30], ["bump", 0, 100, 1, 28], ["palette", 0, 5, 1, 0]] },
    bz_reaction_rings: { title: "noixzy bz reaction rings", concept: "Belousov-Zhabotinsky inspired chemical rings and oscillating fronts.", mode: "bz", accent: "#d99aa6", seed: "bz-rings-001", controls: [["ring count", 2, 18, 1, 9], ["oscillation", 0, 100, 1, 48], ["front width", 1, 40, 1, 14], ["diffusion", 0, 100, 1, 54], ["spiral bias", -80, 80, 1, 26], ["bump", 0, 100, 1, 46], ["speed", 0, 100, 1, 34], ["palette", 0, 5, 1, 3]] },
    spectral_ribbon_bridge: { title: "noixzy spectral ribbon bridge", concept: "Signal ribbons braided into bridge spans, ribs, and suspended traces.", mode: "ribbon", accent: "#a8c7e8", seed: "spectral-ribbon-001", controls: [["ribbons", 1, 12, 1, 5], ["amplitude", 0, 100, 1, 54], ["twist", -100, 100, 1, 35], ["thickness", 1, 12, 1, 3], ["span ribs", 0, 100, 1, 44], ["stack depth", 1, 9, 1, 4], ["speed", 0, 100, 1, 30], ["palette", 0, 5, 1, 2]] },
    nano_kitbash_lattice: { title: "noixzy nano kitbash lattice", concept: "Tiny modular bars, sockets, slabs, pins, and recursive lattice stacks.", mode: "kitbash", accent: "#c8c0ad", seed: "nano-kitbash-001", controls: [["modules", 6, 80, 1, 36], ["socket count", 0, 100, 1, 52], ["bar length", 8, 90, 1, 38], ["slab scale", 5, 80, 1, 32], ["stack depth", 1, 9, 1, 5], ["jitter", 0, 100, 1, 26], ["material", 0, 100, 1, 48], ["palette", 0, 5, 1, 0]] },
    escher_tessellation_morph: { title: "noixzy escher tessellation morph", concept: "Symmetry-group tile morphs between creature-like cells and hard geometry.", mode: "escher", accent: "#c7b2df", seed: "escher-morph-001", controls: [["grid", 5, 32, 1, 15], ["morph", 0, 100, 1, 45], ["symmetry", 2, 8, 1, 4], ["edge warp", 0, 100, 1, 36], ["line weight", 1, 8, 1, 2], ["subdivision", 1, 6, 1, 3], ["bump", 0, 100, 1, 24], ["palette", 0, 5, 1, 5]] },
    modulor_grid_system: { title: "noixzy modulor grid system", concept: "Golden-ratio modular grids with proportional stacks and nano markers.", mode: "modulor", accent: "#dec98e", seed: "modulor-grid-001", controls: [["divisions", 3, 18, 1, 9], ["golden bias", 0, 100, 1, 72], ["stack count", 1, 12, 1, 5], ["marker density", 0, 100, 1, 40], ["line weight", 1, 8, 1, 2], ["extrude", 0, 100, 1, 35], ["bump", 0, 100, 1, 28], ["palette", 0, 5, 1, 4]] }
  };

  const palettes = [
    ["#070707", "#d8c9aa", "#8fc8c2"], ["#050706", "#a8d0ad", "#e4d8b6"], ["#05080b", "#9dc7ff", "#e8c779"],
    ["#090805", "#d4bd84", "#9bb7d2"], ["#090606", "#d2a487", "#d8c9aa"], ["#08070a", "#c7b2df", "#80d6d0"]
  ];
  const TAU = Math.PI * 2;
  function hash(text) { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let t = hash(seed) || 1; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  function hsl(h, s, l, a) { return `hsla(${h}, ${s}%, ${l}%, ${a})`; }

  window.initNoixzyBatch14 = function initNoixzyBatch14(id) {
    const mod = MODULES[id];
    if (!mod) throw new Error("unknown batch 14 module: " + id);
    document.title = mod.title;
    const style = document.createElement("style");
    style.textContent = `:root{color-scheme:dark;--a:${mod.accent};--t:#e8e1d4;--m:#8c877d}*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#050505;color:var(--t);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}body{display:grid;grid-template-columns:minmax(0,1fr) 292px}main{min-width:0;min-height:0;background:radial-gradient(circle at 50% 24%,rgba(255,255,255,.07),transparent 36%),linear-gradient(#101010,#020202)}canvas{display:block;width:100%;height:100%}aside{border-left:1px solid #2b2b2b;background:#101010;padding:14px;overflow:auto}h1{margin:0 0 5px;font-size:15px;text-transform:lowercase}.sub,.note{color:var(--m);font-size:11px;line-height:1.45}.buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0}button{height:34px;border:1px solid #373737;background:#171717;color:var(--t);font:inherit;font-size:11px;cursor:pointer}.row{display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center;margin-bottom:12px}.row span{font-size:11px;color:var(--m)}input[type=text]{width:100%;background:#080808;border:1px solid #343434;color:var(--t);padding:8px;font:inherit;font-size:11px}.control{border-top:1px solid #222;padding:9px 0}.head{display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;color:var(--m)}.head b{font-weight:400;color:var(--a)}input[type=range]{width:100%;accent-color:var(--a)}.physics-toggle{display:flex;align-items:center;gap:8px;margin:10px 0 12px;padding:9px 0;border-top:1px solid #222;border-bottom:1px solid #222;color:var(--m);font-size:11px;text-transform:lowercase}.physics-toggle input{accent-color:var(--a)}@media(max-width:760px){body{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) 315px}aside{border-left:0;border-top:1px solid #2b2b2b}}`;
    document.head.appendChild(style);
    document.body.innerHTML = `<main><canvas id="view"></canvas></main><aside><h1>${mod.title}</h1><p class="sub">${mod.concept}</p><div class="buttons"><button id="play">pause</button><button id="randomize">randomize</button><button id="reset">reset</button><button id="export">export png</button></div><div class="row"><span>seed</span><input id="seed" value="${mod.seed}" spellcheck="false"></div><div id="controls"></div><label class="physics-toggle"><input id="experimental-physics" type="checkbox"> experimental physics</label><p class="note">batch 14: unexplored math/algorithmic systems with module-level stack, array, recursion, and nano controls.</p></aside>`;
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
    function clear() { ctx.fillStyle = pal()[0]; ctx.fillRect(0, 0, w, h); }

    function resize() { dpr = Math.max(1, Math.min(2, devicePixelRatio || 1)); const r = canvas.getBoundingClientRect(); w = Math.max(320, r.width); h = Math.max(260, r.height); canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(true); }
    function rect3(x, y, ww, hh, dep, fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, ww, hh); ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dep, y - dep * .45); ctx.lineTo(x + ww + dep, y - dep * .45); ctx.lineTo(x + ww, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,.32)"; ctx.beginPath(); ctx.moveTo(x + ww, y); ctx.lineTo(x + ww + dep, y - dep * .45); ctx.lineTo(x + ww + dep, y + hh - dep * .45); ctx.lineTo(x + ww, y + hh); ctx.closePath(); ctx.fill(); }
    function draw() {
      clear(); const p = pal(), R = rng(seedEl.value + mod.mode), cx = w / 2, cy = h / 2, t = frame * .012; ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (mod.mode === "gosper") { let x = cx, y = cy, a = -Math.PI/2, step = state.segment; const turns = [1,-1,-1,1,1,1,-1]; ctx.strokeStyle = p[1]; ctx.lineWidth = state["street width"]; ctx.beginPath(); ctx.moveTo(x,y); for(let copy=0;copy<state["array copies"];copy++){ x=cx+(copy-(state["array copies"]-1)/2)*state.segment*8; y=cy; ctx.moveTo(x,y); for(let i=0;i<Math.pow(7,state.order);i++){ const turn=turns[i%7]; a += turn * Math.PI/3 + state["turn bias"]*.001; x += Math.cos(a)*step; y += Math.sin(a)*step; ctx.lineTo(x,y); if(R()*100<state["nano lots"]*.03) rect3(x,y,step*.8,step*.8,state["block height"]*.08,p[2]); }} ctx.stroke(); }
      else if (mod.mode === "turmite") { const cs=state["cell size"], cols=Math.floor(w/cs), rows=Math.floor(h/cs); let x=Math.floor(cols/2), y=Math.floor(rows/2), dir=0; const grid=new Map(); for(let i=0;i<state.steps;i++){ const k=x+','+y, v=(grid.get(k)||0); grid.set(k,(v+1)%state["state count"]); dir=(dir+((v*31+state["turn rule"])%100<50?-1:1)+4)%4; x=(x+[1,0,-1,0][dir]+cols)%cols; y=(y+[0,1,0,-1][dir]+rows)%rows; } grid.forEach((v,k)=>{const [gx,gy]=k.split(',').map(Number); rect3(gx*cs,gy*cs,cs-state.mortar*.03,cs-state.mortar*.03,state.extrude*.05,hsl(20+v*30,32,18+v*7+state.bump*.08,.9));}); }
      else if (mod.mode === "quasi") { const step=Math.max(5,Math.min(w,h)/state["pin density"]); for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){ let v=0; for(let k=0;k<state["wave count"];k++){ const a=k*TAU/state.symmetry+state.phase*.02+t*.2; v+=Math.cos((x*Math.cos(a)+y*Math.sin(a))*.018); } if(v>state.threshold*.05-2){ ctx.fillStyle=hsl(42+v*28+state.palette*18,45,45+state.bump*.12,.75); ctx.beginPath(); ctx.arc(x+Math.sin(v)*state.displace*.12,y,2+Math.abs(v),0,TAU); ctx.fill(); }}}
      else if (mod.mode === "fern") { let x=0,y=0; ctx.fillStyle=p[1]; for(let l=0;l<state["stack layers"];l++) for(let i=0;i<state["point count"];i++){ const r=R()*100; let nx,ny; if(r<2+state["stem bias"]*.05){nx=0;ny=.16*y;} else if(r<84){nx=.85*x+.04*y;ny=-.04*x+.85*y+1.6;} else if(r<92+state["leaf spread"]*.04){nx=.2*x-.26*y;ny=.23*x+.22*y+1.6;} else {nx=-.15*x+.28*y;ny=.26*x+.24*y+.44;} x=nx;y=ny; const px=cx+x*45+l*state.scaffold*.08, py=h*.9-y*45; ctx.globalAlpha=.32+l*.05; ctx.fillRect(px,py,state["node size"],state["node size"]); } ctx.globalAlpha=1; }
      else if (mod.mode === "wang") { const n=state.grid, s=Math.min(w,h)*.84/n, ox=(w-s*n)/2, oy=(h-s*n)/2; for(let y=0;y<n;y++)for(let x=0;x<n;x++){ const v=(hash(seedEl.value+x+','+y)+x*7+y*13)%state["tile set"]; const px=ox+x*s, py=oy+y*s; rect3(px,py,s*.92,s*.92,state.extrude*.06,hsl(190+v*18+state.palette*12,26,16+v*3,.8)); ctx.strokeStyle=p[2]; ctx.lineWidth=state["arc thickness"]; ctx.beginPath(); if((v+x+y)%2){ctx.arc(px,py,s*.72,0,Math.PI/2);ctx.arc(px+s,py+s,s*.72,Math.PI,Math.PI*1.5);} else {ctx.arc(px+s,py,s*.72,Math.PI/2,Math.PI);ctx.arc(px,py+s,s*.72,Math.PI*1.5,TAU);} ctx.stroke(); if(R()*100<state["kitbash cells"]*.06){ctx.fillStyle=p[1];ctx.fillRect(px+s*.38,py+s*.38,s*.24,s*.24);}}}
      else if (mod.mode === "bz") { for(let i=0;i<state["ring count"];i++){ const rr=Math.min(w,h)*(.04+i*.025)+Math.sin(t*state.speed*.04+i)*state.oscillation*.25; ctx.strokeStyle=hsl(330+i*18+state.palette*22,38,52,.55); ctx.lineWidth=1+state["front width"]*.08+state.bump*.025; ctx.beginPath(); for(let a=0;a<=TAU+.04;a+=.04){ const warp=Math.sin(a*3+i+t)*state.diffusion*.18+state["spiral bias"]*.08*a; const x=cx+Math.cos(a)* (rr+warp), y=cy+Math.sin(a)*(rr+warp)*.75; a?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.stroke(); }}
      else if (mod.mode === "ribbon") { for(let r=0;r<state.ribbons;r++){ ctx.strokeStyle=r%2?p[1]:p[2]; ctx.lineWidth=state.thickness; ctx.beginPath(); for(let i=0;i<=120;i++){ const u=i/120, x=w*.08+u*w*.84, y=cy+Math.sin(u*TAU*(1+r*.12)+t*state.speed*.03+r)*state.amplitude*.55+Math.sin(u*TAU*2+r)*state.twist*.18; i?ctx.lineTo(x,y+r*state["stack depth"]):ctx.moveTo(x,y); if(i%12===0&&state["span ribs"]>20){ctx.moveTo(x,y);ctx.lineTo(x,y+state["span ribs"]*.28);ctx.moveTo(x,y);} } ctx.stroke(); }}
      else if (mod.mode === "kitbash") { for(let i=0;i<state.modules;i++){ const x=w*(.12+R()*.76), y=h*(.14+R()*.72), ww=state["bar length"]*(.4+R()), hh=state["slab scale"]*(.2+R()*.6); rect3(x,y,ww,hh,state["stack depth"]*8,p[i%2?1:2]); if(R()*100<state["socket count"]){ctx.fillStyle=hsl(42,20,55+state.material*.18,.8);ctx.beginPath();ctx.arc(x+ww*.5,y+hh*.5,2+state.material*.03,0,TAU);ctx.fill();}}}
      else if (mod.mode === "escher") { const n=state.grid, s=Math.min(w,h)*.82/n, ox=(w-s*n)/2, oy=(h-s*n)/2; ctx.lineWidth=state["line weight"]; for(let y=0;y<n;y++)for(let x=0;x<n;x++){ const px=ox+x*s, py=oy+y*s, m=state.morph*.01; ctx.beginPath(); for(let k=0;k<state.symmetry;k++){ const a=k*TAU/state.symmetry; const rad=s*.42*(1+Math.sin(a*3+x+y)*state["edge warp"]*.005*m); const qx=px+s/2+Math.cos(a)*rad, qy=py+s/2+Math.sin(a)*rad; k?ctx.lineTo(qx,qy):ctx.moveTo(qx,qy);} ctx.closePath(); ctx.fillStyle=hsl(260+(x+y)*4+state.palette*20,22,18+(x+y)%5*4,.62);ctx.fill();ctx.strokeStyle=p[2];ctx.stroke(); }}
      else if (mod.mode === "modulor") { let x=w*.08,y=h*.1, ww=w*.84, hh=h*.78; ctx.strokeStyle=p[1]; ctx.lineWidth=state["line weight"]; for(let i=0;i<state.divisions;i++){ rect3(x,y,ww,hh,state.extrude*.08,p[0]); const phi=state["golden bias"]/100*.618+(1-state["golden bias"]/100)*.5; if(ww>hh){const cut=ww*phi; x+=cut; ww-=cut;} else {const cut=hh*phi; y+=cut; hh-=cut;} if(i<state["stack count"]){ctx.fillStyle=p[2];ctx.fillRect(x,y,4+state.bump*.04,4+state.bump*.04);} } for(let i=0;i<state["marker density"];i+=5){ctx.fillStyle=p[2];ctx.fillRect(w*.08+R()*w*.84,h*.1+R()*h*.78,2,2);} }
      ctx.globalAlpha=1; ctx.fillStyle="rgba(232,225,212,.68)"; ctx.font="11px ui-monospace,monospace"; ctx.fillText(seedEl.value,16,h-18);
    }
    function tick(){ if(running){frame++; applyExperimentalPhysics(); draw(false);} requestAnimationFrame(tick); }
    document.getElementById("play").onclick=()=>{running=!running;document.getElementById("play").textContent=running?"pause":"play";draw(true);};
    document.getElementById("randomize").onclick=()=>{seedEl.value=mod.mode+"-"+Math.floor(Math.random()*999999).toString(36);randomizeModuleControls();draw(true);};
    document.getElementById("reset").onclick=()=>location.reload();
    document.getElementById("export").onclick=()=>{draw(true); const a=document.createElement("a"); a.download=id+".png"; a.href=canvas.toDataURL("image/png"); a.click();};
    seedEl.oninput=()=>draw(true); addEventListener("resize", resize); resize(); applyExperimentalPhysics(); tick();
  };
})();
