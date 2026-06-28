(function () {
  "use strict";

  const MODULES = {
    boids_ink_current: { title: "noixzy boids ink current", concept: "Boids moving like ink currents through a nano garden field.", palette: "#9fb8c8", mode: "boids", seed: "boids-ink-001", controls: [["density", 24, 120, 1, 68], ["alignment", 0, 100, 1, 55], ["cohesion", 0, 100, 1, 48], ["separation", 0, 100, 1, 64], ["trail fade", 2, 40, 1, 16], ["bump", 0, 100, 1, 38], ["displace", 0, 100, 1, 44], ["speed", 0, 100, 1, 46]] },
    cellular_rake_tiles: { title: "noixzy cellular rake tiles", concept: "Game-of-life cells rendered as raked tiles and nano sand glyphs.", palette: "#d2c39c", mode: "cells", seed: "cell-rake-001", controls: [["cell size", 8, 34, 1, 18], ["mutation", 0, 100, 1, 18], ["tick rate", 1, 40, 1, 12], ["extrude illusion", 0, 100, 1, 46], ["bump", 0, 100, 1, 36], ["subdivision", 1, 6, 1, 3], ["palette", 0, 5, 1, 2], ["speed", 0, 100, 1, 32]] },
    recursive_kintsugi_array: { title: "noixzy recursive kintsugi array", concept: "Recursive arrays with broken-gold kintsugi line structure.", palette: "#d7b75f", mode: "kintsugi", seed: "kintsugi-001", controls: [["recursion depth", 1, 7, 1, 5], ["fracture", 0, 100, 1, 58], ["spacing", 0, 100, 1, 42], ["rotation", -45, 45, 1, 9], ["bump", 0, 100, 1, 34], ["displace", 0, 100, 1, 35], ["line weight", 1, 8, 1, 2], ["seed drift", 0, 100, 1, 22]] },
    shodo_vector_field: { title: "noixzy shodo vector field", concept: "Japanese calligraphy strokes following a semi-random vector field.", palette: "#e5e0d2", mode: "shodo", seed: "shodo-001", controls: [["field scale", 4, 80, 1, 34], ["curl", 0, 100, 1, 66], ["stroke length", 8, 90, 1, 44], ["ink bleed", 0, 100, 1, 54], ["bump", 0, 100, 1, 32], ["displace", 0, 100, 1, 50], ["speed", 0, 100, 1, 38], ["seed drift", 0, 100, 1, 18]] },
    particle_moss_orbits: { title: "noixzy particle moss orbits", concept: "Slow nano-particles orbiting like moss, dust, and temple air.", palette: "#a8c492", mode: "orbits", seed: "moss-orbit-001", controls: [["particle count", 40, 300, 1, 160], ["orbit radius", 10, 100, 1, 58], ["attraction", 0, 100, 1, 56], ["damping", 0, 100, 1, 48], ["trail opacity", 2, 90, 1, 38], ["bump", 0, 100, 1, 24], ["displace", 0, 100, 1, 30], ["speed", 0, 100, 1, 28]] },
    wave_sand_interference: { title: "noixzy wave sand interference", concept: "Wave interference creating sand, water, and signal-rake patterns.", palette: "#cdbf9c", mode: "waves", seed: "wave-sand-001", controls: [["wave count", 2, 10, 1, 5], ["frequency", 1, 30, 1, 13], ["amplitude", 0, 100, 1, 48], ["bump", 0, 100, 1, 48], ["displacement", 0, 100, 1, 44], ["line density", 8, 80, 1, 42], ["speed", 0, 100, 1, 36], ["palette", 0, 5, 1, 1]] },
    torii_depth_lattice: { title: "noixzy torii depth lattice", concept: "Torii-inspired recursive portal grid with false depth.", palette: "#c86f5f", mode: "torii", seed: "torii-depth-001", controls: [["grid depth", 1, 12, 1, 7], ["portal count", 2, 18, 1, 9], ["perspective", 0, 100, 1, 58], ["extrude", 0, 100, 1, 52], ["bump", 0, 100, 1, 28], ["displace", 0, 100, 1, 24], ["palette", 0, 5, 1, 3], ["speed", 0, 100, 1, 24]] },
    bonsai_circuit_growth: { title: "noixzy bonsai circuit growth", concept: "Procedural growth mixing bonsai branching and circuit nano lattice.", palette: "#a6c98a", mode: "bonsai", seed: "bonsai-circuit-001", controls: [["branch depth", 2, 10, 1, 7], ["split angle", 8, 54, 1, 28], ["growth speed", 0, 100, 1, 42], ["subdivision", 1, 8, 1, 4], ["bump", 0, 100, 1, 34], ["displace", 0, 100, 1, 26], ["line weight", 1, 8, 1, 3], ["seed drift", 0, 100, 1, 18]] },
    pressure_thread_physics: { title: "noixzy pressure thread physics", concept: "Lightweight spring thread field reacting like pressure lines.", palette: "#b8cde2", mode: "threads", seed: "pressure-thread-001", controls: [["node count", 8, 80, 1, 34], ["stiffness", 0, 100, 1, 62], ["damping", 0, 100, 1, 50], ["tension", 0, 100, 1, 68], ["bump", 0, 100, 1, 22], ["displace", 0, 100, 1, 48], ["drift", 0, 100, 1, 38], ["line weight", 1, 7, 1, 2]] },
    zen_caustic_relief: { title: "noixzy zen caustic relief", concept: "Lightweight caustic bump relief field like light on raked sand.", palette: "#ded0ad", mode: "caustic", seed: "caustic-relief-001", controls: [["caustic scale", 4, 80, 1, 28], ["light angle", -90, 90, 1, 24], ["relief depth", 0, 100, 1, 58], ["bump", 0, 100, 1, 62], ["displace", 0, 100, 1, 40], ["subdivision", 1, 8, 1, 5], ["speed", 0, 100, 1, 28], ["line density", 8, 80, 1, 44]] }
  };

  function hash(text) { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function random(seed) { let t = hash(seed) || 1; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  function hsl(h, s, l, a) { return `hsla(${h}, ${s}%, ${l}%, ${a})`; }

  window.initNoixzyBatch11 = function initNoixzyBatch11(id) {
    const mod = MODULES[id];
    if (!mod) throw new Error("unknown batch 11 module: " + id);
    document.title = mod.title;
    const style = document.createElement("style");
    style.textContent = `:root{color-scheme:dark;--a:${mod.palette};--t:#e8e1d4;--m:#8c877d}*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#050505;color:var(--t);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}body{display:grid;grid-template-columns:minmax(0,1fr) 292px}main{min-width:0;min-height:0;background:radial-gradient(circle at 50% 25%,rgba(255,255,255,.07),transparent 36%),linear-gradient(#101010,#020202)}canvas{display:block;width:100%;height:100%}aside{border-left:1px solid #2b2b2b;background:#101010;padding:14px;overflow:auto}h1{margin:0 0 5px;font-size:15px;text-transform:lowercase}.sub,.note{color:var(--m);font-size:11px;line-height:1.45}.buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0}button{height:34px;border:1px solid #373737;background:#171717;color:var(--t);font:inherit;font-size:11px;cursor:pointer}.row{display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center;margin-bottom:12px}.row span{font-size:11px;color:var(--m)}input[type=text]{width:100%;background:#080808;border:1px solid #343434;color:var(--t);padding:8px;font:inherit;font-size:11px}.control{border-top:1px solid #222;padding:9px 0}.head{display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;color:var(--m)}.head b{font-weight:400;color:var(--a)}input[type=range]{width:100%;accent-color:var(--a)}.physics-toggle{display:flex;align-items:center;gap:8px;margin:10px 0 12px;padding:9px 0;border-top:1px solid #222;border-bottom:1px solid #222;color:var(--m);font-size:11px;text-transform:lowercase}.physics-toggle input{accent-color:var(--a)}@media(max-width:760px){body{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) 315px}aside{border-left:0;border-top:1px solid #2b2b2b}}`;
    document.head.appendChild(style);
    document.body.innerHTML = `<main><canvas id="view"></canvas></main><aside><h1>${mod.title}</h1><p class="sub">${mod.concept}</p><div class="buttons"><button id="play">pause</button><button id="randomize">randomize</button><button id="reset">reset</button><button id="export">export png</button></div><div class="row"><span>seed</span><input id="seed" value="${mod.seed}" spellcheck="false"></div><div id="controls"></div><label class="physics-toggle"><input id="experimental-physics" type="checkbox"> experimental physics</label><p class="note">batch 11 cosmos nano zen; light geometry with bump/displace/extrude/subdivision controls where practical.</p></aside>`;
    const canvas = document.getElementById("view"), ctx = canvas.getContext("2d"), seedEl = document.getElementById("seed"), controls = document.getElementById("controls");
    const controlMeta = Object.fromEntries(mod.controls.map(([key, min, max]) => [key, { min, max }]));
    const state = Object.fromEntries(mod.controls.map(c => [c[0], c[4]]));
    let stageBaseState = { ...state };
    let w = 1, h = 1, dpr = 1, frame = 0, running = true, trail = null;
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
      const div = document.createElement("div");
      div.className = "control";
      div.innerHTML = `<div class="head"><span>${key}</span><b>${state[key]}</b></div><input type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}">`;
      controls.appendChild(div);
      div.querySelector("input").oninput = e => {
        state[key] = Number(e.target.value);
        stageBaseState[key] = state[key];
        div.querySelector("b").textContent = state[key];
        draw(false);
      };
    });

    const physicsToggle = document.getElementById("experimental-physics");
    if (physicsToggle) physicsToggle.onchange = () => { experimentalPhysics = physicsToggle.checked; applyExperimentalPhysics(); draw(true); };

    function clampVal(value, min, max) { return Math.max(min, Math.min(max, value)); }
    function applyStateToUi() {
      controls.querySelectorAll(".control").forEach(div => {
        const label = div.querySelector(".head span").textContent;
        const valNode = div.querySelector(".head b");
        const input = div.querySelector("input");
        if (Object.prototype.hasOwnProperty.call(state, label)) {
          input.value = state[label];
          valNode.textContent = state[label];
        }
      });
    }
    function profileFromStage(stage) {
      const geom = clampVal((Math.abs(stage.depth) / 260 + Math.abs(stage.rotateX) / 55 + Math.abs(stage.rotateY) / 55) / 3, 0, 1);
      const arrayEnergy = clampVal(((stage.arrayCount - 1) / 8) * 0.7 + (stage.arraySpread / 180) * 0.3, 0, 1);
      const kitbashEnergy = stage.kitbash === "none" ? 0 : clampVal((stage.kitbashDensity / 14) * 0.55 + (stage.kitbashScale / 140) * 0.45, 0, 1);
      const materialEnergy = clampVal((stage.material + 80) / 160, 0, 1);
      const tempo = clampVal((stage.zoom - 55) / 90, 0, 1);
      return { geom, arrayEnergy, kitbashEnergy, materialEnergy, tempo };
    }
    function drive(keys, blend) {
      keys.forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(state, key)) return;
        const meta = controlMeta[key];
        if (!meta) return;
        const span = meta.max - meta.min;
        state[key] = clampVal(stageBaseState[key] + span * blend, meta.min, meta.max);
      });
    }
    function applyStageParams(stage) {
      if (!stage || typeof stage !== "object") return;
      const p = profileFromStage(stage);
      Object.assign(state, stageBaseState);

      drive(["density", "particle count", "node count", "portal count", "wave count"], (p.arrayEnergy + p.kitbashEnergy) * 0.26);
      drive(["recursion depth", "grid depth", "branch depth", "subdivision"], (p.geom + p.kitbashEnergy) * 0.18);
      drive(["bump"], (p.materialEnergy + p.kitbashEnergy) * 0.36 - 0.18);
      drive(["displace", "displacement", "relief depth", "amplitude"], (p.geom + p.arrayEnergy) * 0.34 - 0.12);
      drive(["extrude", "extrude illusion"], (p.geom + p.kitbashEnergy) * 0.32);
      drive(["line weight", "line density", "stroke length"], (p.kitbashEnergy + p.materialEnergy) * 0.25 - 0.08);
      drive(["speed", "growth speed", "tick rate"], p.tempo * 0.22 + p.arrayEnergy * 0.08);
      drive(["perspective", "field scale", "curl", "rotation"], (p.geom * 0.22) + ((stage.rotateY || 0) / 55) * 0.12);
      drive(["spacing", "orbit radius"], (p.arrayEnergy + p.geom) * 0.18);
      drive(["fracture", "mutation", "tension", "stiffness", "separation"], (p.kitbashEnergy + p.materialEnergy) * 0.24 - 0.1);
      drive(["palette"], (p.materialEnergy - 0.5) * 0.9);

      applyStateToUi();
      draw(true);
    }

    function resize() { dpr = Math.max(1, Math.min(2, devicePixelRatio || 1)); const r = canvas.getBoundingClientRect(); w = Math.max(320, r.width); h = Math.max(260, r.height); canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); trail = null; draw(true); }
    function rect3(x, y, ww, hh, dep, fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, ww, hh); ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dep, y - dep * .45); ctx.lineTo(x + ww + dep, y - dep * .45); ctx.lineTo(x + ww, y); ctx.closePath(); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,.32)"; ctx.beginPath(); ctx.moveTo(x + ww, y); ctx.lineTo(x + ww + dep, y - dep * .45); ctx.lineTo(x + ww + dep, y + hh - dep * .45); ctx.lineTo(x + ww, y + hh); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(238,228,210,.34)"; ctx.lineWidth = Math.max(1, state["line weight"] || 1); ctx.strokeRect(x, y, ww, hh); }
    function clear(full) { if (full || !/boids|orbits|shodo/.test(mod.mode)) { ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#070707"; ctx.fillRect(0, 0, w, h); } else { ctx.fillStyle = `rgba(7,7,7,${(state["trail fade"] || (100 - (state["trail opacity"] || 50))) / 100})`; ctx.fillRect(0, 0, w, h); } }
    function draw(full) {
      clear(full); const R = random(seedEl.value + mod.mode); const cx = w / 2, cy = h / 2, t = frame * .01 * ((state.speed || state["growth speed"] || state["tick rate"] || 20) / 35);
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = mod.palette; ctx.fillStyle = mod.palette;
      if (mod.mode === "boids" || mod.mode === "orbits") { const n = state.density || state["particle count"]; for (let i = 0; i < n; i++) { const a = i * 2.399 + t + R() * .4; const rr = (state["orbit radius"] || 50) * 2 + Math.sqrt(i) * (1 + (state.displace || 0) * .025); const x = cx + Math.cos(a + Math.sin(t+i)*.2) * rr + Math.sin(i) * (state.separation || 0) * .22; const y = cy + Math.sin(a * 1.17) * rr * .58; ctx.globalAlpha = .18 + (state.bump || 0) * .006; ctx.beginPath(); ctx.arc(x, y, mod.mode === "orbits" ? 1.2 + (state.bump || 0) * .025 : 2.2, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
      else if (mod.mode === "cells") { const cs = state["cell size"], cols = Math.ceil(w / cs), rows = Math.ceil(h / cs); for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if ((hash(seedEl.value + x + "," + y + Math.floor(frame / Math.max(1, state["tick rate"]))) + x * y) % 100 < 36 + state.mutation * .2) rect3(x * cs, y * cs, cs * .78, cs * .78, state["extrude illusion"] * .12, hsl(42 + state.palette * 18, 23, 20 + ((x + y) % 5) * 4, .86)); }
      else if (mod.mode === "kintsugi") { for (let d = 0; d < state["recursion depth"]; d++) { const s = Math.min(w, h) * (.72 - d * .08), x = cx - s / 2 + Math.sin(d) * state.spacing, y = cy - s / 2 + Math.cos(d) * state.spacing * .5; rect3(x, y, s, s * .62, state.displace * .18, "#171513"); ctx.strokeStyle = "#d7b75f"; ctx.lineWidth = state["line weight"]; for (let i = 0; i < state.fracture / 8; i++) { ctx.beginPath(); ctx.moveTo(x + R() * s, y + R() * s * .62); ctx.lineTo(x + R() * s, y + R() * s * .62); ctx.stroke(); } } }
      else if (mod.mode === "shodo") { ctx.strokeStyle = `rgba(230,224,210,${.18 + state["ink bleed"] * .006})`; ctx.lineWidth = 1 + state.bump * .05; for (let i = 0; i < 70; i++) { let x = R() * w, y = R() * h; ctx.beginPath(); ctx.moveTo(x, y); for (let j = 0; j < state["stroke length"] / 4; j++) { const a = Math.sin(x * .01 * state["field scale"] + y * .006 + t) * state.curl * .03; x += Math.cos(a) * 6; y += Math.sin(a) * 6 + state.displace * .01; ctx.lineTo(x, y); } ctx.stroke(); } }
      else if (mod.mode === "waves" || mod.mode === "caustic") { const lines = state["line density"]; ctx.strokeStyle = hsl(43, 30, 65, .45 + (state.bump || 0) * .004); ctx.lineWidth = 1; for (let y = 0; y < lines; y++) { const yy = h * (y + 1) / (lines + 1); ctx.beginPath(); for (let x = 0; x <= w; x += 8) { let v = 0; const wc = state["wave count"] || 4; for (let k = 0; k < wc; k++) v += Math.sin(x * .01 * (state.frequency || state["caustic scale"]) + k * 1.7 + t + yy * .006); const py = yy + v * ((state.amplitude || state["relief depth"]) * .08) + Math.sin((x + yy) * .02) * (state.displace || 0) * .03; x ? ctx.lineTo(x, py) : ctx.moveTo(x, py); } ctx.stroke(); } }
      else if (mod.mode === "torii") { for (let i = 0; i < state["portal count"]; i++) { const z = i / state["portal count"], ww = w * (.12 + z * .58), hh = h * (.12 + z * .54), x = cx - ww / 2 + Math.sin(t + i) * state.displace * .15, y = cy - hh / 2 + i * state.perspective * .18; rect3(x, y, ww, 16, state.extrude * .2, "#36201d"); rect3(x + ww * .12, y, 16, hh, state.extrude * .15, "#271817"); rect3(x + ww * .88, y, 16, hh, state.extrude * .15, "#271817"); } }
      else if (mod.mode === "bonsai") { function br(x,y,l,a,d){ if(!d)return; const nx=x+Math.cos(a)*l, ny=y+Math.sin(a)*l; ctx.strokeStyle=d%2?mod.palette:"#88a072"; ctx.lineWidth=Math.max(1,state["line weight"]*d/state["branch depth"]); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(nx,ny); ctx.stroke(); for(let k=-1;k<=1;k+=2) br(nx,ny,l*.72,a+k*state["split angle"]*Math.PI/180 + (R()-.5)*.2,d-1); } br(cx,h*.86,Math.min(w,h)*.16,-Math.PI/2,state["branch depth"]); }
      else if (mod.mode === "threads") { const n = state["node count"]; const pts=[]; for(let i=0;i<n;i++){const a=i*2.399+t; pts.push([cx+Math.cos(a)*Math.min(w,h)*.34,cy+Math.sin(a*1.3)*Math.min(w,h)*.25+Math.sin(t+i)*state.drift]);} ctx.strokeStyle=hsl(205,32,70,.55); ctx.lineWidth=state["line weight"]; for(let i=0;i<n;i++){const p=pts[i], q=pts[(i+Math.max(2,Math.floor(state.stiffness/20)))%n]; ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.quadraticCurveTo(cx,cy+(state.tension-50)*.9,q[0],q[1]); ctx.stroke();} }
      ctx.globalAlpha = 1; ctx.fillStyle = "rgba(232,225,212,.68)"; ctx.font = "11px ui-monospace,monospace"; ctx.fillText(seedEl.value, 16, h - 18);
    }
    function tick() { if (running) { frame++; applyExperimentalPhysics(); draw(false); } requestAnimationFrame(tick); }
    document.getElementById("play").onclick = () => { running = !running; document.getElementById("play").textContent = running ? "pause" : "play"; draw(true); };
    document.getElementById("randomize").onclick = () => { seedEl.value = mod.mode + "-" + Math.floor(Math.random() * 999999).toString(36); randomizeModuleControls(); stageBaseState = { ...state }; draw(true); };
    document.getElementById("reset").onclick = () => location.reload();
    document.getElementById("export").onclick = () => { draw(true); const a = document.createElement("a"); a.download = id + ".png"; a.href = canvas.toDataURL("image/png"); a.click(); };
    seedEl.oninput = () => draw(true);
    window.addEventListener("message", event => {
      if (!event.data || event.data.type !== "noixzy:stage-params") return;
      applyStageParams(event.data.stage);
    });
    addEventListener("resize", resize);
    resize();
    applyExperimentalPhysics();
    tick();
  };
})();
