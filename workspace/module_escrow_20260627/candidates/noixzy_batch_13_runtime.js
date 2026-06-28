(function () {
  "use strict";

  const MODULES = {
    courtyard_plan: {
      title: "noixzy courtyard plan",
      concept: "Courtyard-building generator with rings, bars, courts, and threshold voids.",
      palette: "#d8c8ae",
      mode: "courtyard_plan",
      seed: "courtyard-plan-001",
      controls: [["court count", 1, 12, 1, 4], ["ring thickness", 0, 100, 1, 46], ["entry bias", 0, 100, 1, 52], ["garden ratio", 0, 100, 1, 44], ["line weight", 1, 8, 1, 2], ["extrude", 0, 100, 1, 28], ["bump", 0, 100, 1, 18], ["speed", 0, 100, 1, 22]]
    },
    light_well: {
      title: "noixzy light well",
      concept: "Top-lit shafts and wells projected through sectional depth gradients.",
      palette: "#cad7df",
      mode: "light_well",
      seed: "light-well-001",
      controls: [["shaft count", 1, 20, 1, 6], ["well depth", 0, 100, 1, 58], ["light angle", -90, 90, 1, 18], ["haze", 0, 100, 1, 36], ["line density", 8, 140, 1, 42], ["subdivision", 1, 8, 1, 3], ["bump", 0, 100, 1, 16], ["speed", 0, 100, 1, 18]]
    },
    mashrabiya_modern: {
      title: "noixzy mashrabiya modern",
      concept: "Modern geometric lattice screen with controlled aperture and depth.",
      palette: "#c0d7cc",
      mode: "mashrabiya_modern",
      seed: "mashrabiya-001",
      controls: [["pattern order", 2, 20, 1, 8], ["aperture", 0, 100, 1, 48], ["screen depth", 0, 100, 1, 34], ["symmetry", 0, 100, 1, 68], ["line weight", 1, 8, 1, 2], ["bump", 0, 100, 1, 20], ["displace", 0, 100, 1, 18], ["palette", 0, 6, 1, 2]]
    },
    poche_generator: {
      title: "noixzy poche generator",
      concept: "Thick wall/void architectural poche maps in monochrome sectional language.",
      palette: "#d2cbc0",
      mode: "poche_generator",
      seed: "poche-001",
      controls: [["wall thickness", 0, 100, 1, 56], ["room carve", 0, 100, 1, 42], ["hatch density", 0, 100, 1, 38], ["hierarchy", 0, 100, 1, 62], ["line weight", 1, 8, 1, 3], ["subdivision", 1, 8, 1, 3], ["bump", 0, 100, 1, 14], ["seed drift", 0, 100, 1, 16]]
    },
    threshold_map: {
      title: "noixzy threshold map",
      concept: "Nested thresholds, gates, and transitions composing ritual path diagrams.",
      palette: "#d6bca4",
      mode: "threshold_map",
      seed: "threshold-map-001",
      controls: [["threshold count", 2, 40, 1, 12], ["privacy gradient", 0, 100, 1, 54], ["axis lock", 0, 100, 1, 48], ["portal width", 0, 100, 1, 44], ["line weight", 1, 8, 1, 2], ["extrude", 0, 100, 1, 24], ["bump", 0, 100, 1, 16], ["speed", 0, 100, 1, 24]]
    },
    screen_block: {
      title: "noixzy screen block",
      concept: "Breeze-block/perforated masonry field with modular apertures and depth.",
      palette: "#c9d0be",
      mode: "screen_block",
      seed: "screen-block-001",
      controls: [["block count", 4, 80, 1, 28], ["aperture", 0, 100, 1, 46], ["bevel", 0, 100, 1, 38], ["light angle", -90, 90, 1, 20], ["line density", 8, 140, 1, 40], ["bump", 0, 100, 1, 22], ["displace", 0, 100, 1, 16], ["palette", 0, 6, 1, 1]]
    },
    diagrid_tower: {
      title: "noixzy diagrid tower",
      concept: "Tapered diagrid tower envelope with structural rhythm and vertical drift.",
      palette: "#bfcde0",
      mode: "diagrid_tower",
      seed: "diagrid-001",
      controls: [["height bands", 4, 80, 1, 26], ["taper", 0, 100, 1, 42], ["diagonal pitch", 1, 20, 1, 7], ["openness", 0, 100, 1, 44], ["line weight", 1, 8, 1, 2], ["extrude", 0, 100, 1, 32], ["bump", 0, 100, 1, 14], ["speed", 0, 100, 1, 22]]
    },
    parametric_pavilion: {
      title: "noixzy parametric pavilion",
      concept: "Lightweight pavilion field from columns, roof arcs, and screen ribs.",
      palette: "#c7d7c8",
      mode: "parametric_pavilion",
      seed: "pavilion-001",
      controls: [["column count", 2, 64, 1, 18], ["roof curvature", 0, 100, 1, 58], ["rib density", 1, 36, 1, 12], ["openness", 0, 100, 1, 56], ["line weight", 1, 8, 1, 2], ["subdivision", 1, 10, 1, 4], ["bump", 0, 100, 1, 18], ["speed", 0, 100, 1, 26]]
    },
    street_canyon: {
      title: "noixzy street canyon",
      concept: "Perspective street-section canyon with facade walls and moving light slices.",
      palette: "#c8c4bb",
      mode: "street_canyon",
      seed: "street-canyon-001",
      controls: [["street width", 0, 100, 1, 42], ["building height", 0, 100, 1, 62], ["sun angle", -90, 90, 1, 24], ["atmosphere", 0, 100, 1, 36], ["line density", 8, 180, 1, 66], ["bump", 0, 100, 1, 14], ["displace", 0, 100, 1, 14], ["speed", 0, 100, 1, 20]]
    },
    panelization_solver: {
      title: "noixzy panelization solver",
      concept: "Fabrication-style panel seam solver with tolerance jitter and build labels.",
      palette: "#d0d5df",
      mode: "panelization_solver",
      seed: "panelization-001",
      controls: [["panel size", 6, 80, 1, 26], ["seam width", 0, 100, 1, 38], ["irregularity", 0, 100, 1, 24], ["tolerance", 0, 100, 1, 32], ["line weight", 1, 8, 1, 2], ["subdivision", 1, 8, 1, 3], ["bump", 0, 100, 1, 12], ["seed drift", 0, 100, 1, 18]]
    }
  };

  function hash(text) { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function random(seed) { let t = hash(seed) || 1; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  function hsl(h, s, l, a) { return `hsla(${h}, ${s}%, ${l}%, ${a})`; }
  function clampVal(v, min, max) { return Math.max(min, Math.min(max, v)); }

  window.initNoixzyBatch13 = function initNoixzyBatch13(id) {
    const mod = MODULES[id];
    if (!mod) throw new Error("unknown batch 13 module: " + id);
    document.title = mod.title;
    const style = document.createElement("style");
    style.textContent = `:root{color-scheme:dark;--a:${mod.palette};--t:#e8e1d4;--m:#8c877d}*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#050505;color:var(--t);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}body{display:grid;grid-template-columns:minmax(0,1fr) 292px}main{min-width:0;min-height:0;background:radial-gradient(circle at 50% 25%,rgba(255,255,255,.07),transparent 36%),linear-gradient(#101010,#020202)}canvas{display:block;width:100%;height:100%}aside{border-left:1px solid #2b2b2b;background:#101010;padding:14px;overflow:auto}h1{margin:0 0 5px;font-size:15px;text-transform:lowercase}.sub,.note{color:var(--m);font-size:11px;line-height:1.45}.buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0}button{height:34px;border:1px solid #373737;background:#171717;color:var(--t);font:inherit;font-size:11px;cursor:pointer}.row{display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center;margin-bottom:12px}.row span{font-size:11px;color:var(--m)}input[type=text]{width:100%;background:#080808;border:1px solid #343434;color:var(--t);padding:8px;font:inherit;font-size:11px}.control{border-top:1px solid #222;padding:9px 0}.head{display:flex;justify-content:space-between;font-size:11px;margin-bottom:6px;color:var(--m)}.head b{font-weight:400;color:var(--a)}input[type=range]{width:100%;accent-color:var(--a)}.physics-toggle{display:flex;align-items:center;gap:8px;margin:10px 0 12px;padding:9px 0;border-top:1px solid #222;border-bottom:1px solid #222;color:var(--m);font-size:11px;text-transform:lowercase}.physics-toggle input{accent-color:var(--a)}@media(max-width:760px){body{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) 315px}aside{border-left:0;border-top:1px solid #2b2b2b}}`;
    document.head.appendChild(style);
    document.body.innerHTML = `<main><canvas id="view"></canvas></main><aside><h1>${mod.title}</h1><p class="sub">${mod.concept}</p><div class="buttons"><button id="play">pause</button><button id="randomize">randomize</button><button id="reset">reset</button><button id="export">export png</button></div><div class="row"><span>seed</span><input id="seed" value="${mod.seed}" spellcheck="false"></div><div id="controls"></div><label class="physics-toggle"><input id="experimental-physics" type="checkbox"> experimental physics</label><p class="note">batch 13: unexplored architectural systems from workspace docs.</p></aside>`;

    const canvas = document.getElementById("view");
    const ctx = canvas.getContext("2d");
    const seedEl = document.getElementById("seed");
    const controls = document.getElementById("controls");
    const controlMeta = Object.fromEntries(mod.controls.map(([key, min, max]) => [key, { min, max }]));
    const state = Object.fromEntries(mod.controls.map(c => [c[0], c[4]]));
    let stageBaseState = { ...state };
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
      const div = document.createElement("div");
      div.className = "control";
      div.innerHTML = `<div class="head"><span>${key}</span><b>${state[key]}</b></div><input type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}">`;
      controls.appendChild(div);
      div.querySelector("input").oninput = e => {
        state[key] = Number(e.target.value);
        stageBaseState[key] = state[key];
        div.querySelector("b").textContent = state[key];
        draw(true);
      };
    });

    function applyStateToUi() {
      controls.querySelectorAll(".control").forEach(div => {
        const key = div.querySelector(".head span").textContent;
        const input = div.querySelector("input");
        const value = div.querySelector(".head b");
        if (Object.prototype.hasOwnProperty.call(state, key)) {
          input.value = state[key];
          value.textContent = state[key];
        }
      });
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
      const geom = clampVal((Math.abs(stage.depth) / 260 + Math.abs(stage.rotateX) / 55 + Math.abs(stage.rotateY) / 55) / 3, 0, 1);
      const arrayEnergy = clampVal(((stage.arrayCount - 1) / 8) * 0.7 + (stage.arraySpread / 180) * 0.3, 0, 1);
      const kitbashEnergy = stage.kitbash === "none" ? 0 : clampVal((stage.kitbashDensity / 14) * 0.55 + (stage.kitbashScale / 140) * 0.45, 0, 1);
      const materialEnergy = clampVal((stage.material + 80) / 160, 0, 1);
      const tempo = clampVal((stage.zoom - 55) / 90, 0, 1);
      Object.assign(state, stageBaseState);
      drive(["court count", "shaft count", "threshold count", "block count", "height bands", "column count"], (arrayEnergy + kitbashEnergy) * 0.22);
      drive(["speed", "seed drift"], tempo * 0.22 + arrayEnergy * 0.05);
      drive(["line weight", "line density", "rib density", "diagonal pitch"], (kitbashEnergy + materialEnergy) * 0.2 - 0.08);
      drive(["extrude", "well depth", "screen depth", "wall thickness", "portal width", "seam width"], (geom + arrayEnergy) * 0.28 - 0.1);
      drive(["bump"], (materialEnergy + kitbashEnergy) * 0.32 - 0.1);
      drive(["displace", "light angle", "sun angle", "roof curvature", "taper", "plate offset"], (geom + arrayEnergy) * 0.2 + ((stage.rotateY || 0) / 55) * 0.1);
      drive(["subdivision"], (geom + kitbashEnergy) * 0.15);
      drive(["palette"], (materialEnergy - 0.5) * 0.9);
      applyStateToUi();
      draw(true);
    }


    const physicsToggle = document.getElementById("experimental-physics");
    if (physicsToggle) physicsToggle.onchange = () => { experimentalPhysics = physicsToggle.checked; applyExperimentalPhysics(); draw(true); };

    function resize() {
      dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
      const r = canvas.getBoundingClientRect();
      w = Math.max(320, r.width);
      h = Math.max(260, r.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(true);
    }

    function rect3(x, y, ww, hh, dep, fill) {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, ww, hh);
      ctx.fillStyle = "rgba(255,255,255,.1)";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dep, y - dep * 0.45); ctx.lineTo(x + ww + dep, y - dep * 0.45); ctx.lineTo(x + ww, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.beginPath(); ctx.moveTo(x + ww, y); ctx.lineTo(x + ww + dep, y - dep * 0.45); ctx.lineTo(x + ww + dep, y + hh - dep * 0.45); ctx.lineTo(x + ww, y + hh); ctx.closePath(); ctx.fill();
    }

    function draw(full) {
      const R = random(seedEl.value + mod.mode);
      const t = frame * 0.01 * ((state.speed || 22) / 28);
      const cx = w * 0.5;
      const cy = h * 0.5;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = full ? "#070707" : "rgba(7,7,7,.93)";
      ctx.fillRect(0, 0, w, h);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      if (mod.mode === "courtyard_plan" || mod.mode === "threshold_map") {
        const n = state["court count"] || state["threshold count"];
        const base = Math.min(w, h) * 0.78;
        for (let i = 0; i < n; i++) {
          const s = base * (1 - i / (n + 1));
          const x = cx - s / 2 + Math.sin(t + i) * (state["entry bias"] || state["axis lock"] || 50) * 0.03;
          const y = cy - s / 2;
          rect3(x, y, s, s * 0.62, (state.extrude || 0) * 0.2, hsl(34 + i * 3, 16, 12 + (i % 5) * 4, 0.86));
          ctx.fillStyle = "rgba(0,0,0,.66)";
          ctx.fillRect(x + s * 0.16, y + s * 0.12, s * (0.24 + (state["garden ratio"] || state["privacy gradient"] || 40) * 0.003), s * 0.24);
          ctx.strokeStyle = hsl(40, 28, 68, 0.2 + (state["line weight"] || 2) * 0.06);
          ctx.lineWidth = Math.max(1, state["line weight"] || 2);
          ctx.strokeRect(x, y, s, s * 0.62);
        }
      } else if (mod.mode === "light_well") {
        const shafts = state["shaft count"];
        for (let i = 0; i < shafts; i++) {
          const x = 40 + i * ((w - 80) / Math.max(1, shafts));
          const depth = (state["well depth"] || 50) * 0.5;
          const hh = h * (0.35 + (state.haze || 20) * 0.003);
          rect3(x - 14, h * 0.18, 28, hh, depth, "#12171a");
          const glow = Math.max(0.08, 0.34 + Math.sin(t + i) * 0.14 + (state["light angle"] || 0) * 0.002);
          ctx.fillStyle = `rgba(190,220,240,${glow})`;
          ctx.fillRect(x - 4, h * 0.2, 8, hh * 0.9);
          ctx.fillStyle = `rgba(210,220,230,${0.06 + (state.haze || 20) * 0.004})`;
          ctx.fillRect(x - 30, h * 0.16, 60, hh * 1.05);
        }
      } else if (mod.mode === "mashrabiya_modern" || mod.mode === "screen_block") {
        const order = state["pattern order"] || state["block count"];
        const step = Math.min(w, h) * 0.76 / order;
        const ox = cx - step * order / 2;
        const oy = cy - step * order / 2;
        for (let y = 0; y < order; y++) for (let x = 0; x < order; x++) {
          const px = ox + x * step;
          const py = oy + y * step;
          const cut = (state.aperture || 40) * 0.005;
          rect3(px, py, step * 0.9, step * 0.9, (state["screen depth"] || state.bevel || 30) * 0.18, hsl(130 + (x + y) * 2 + (state.palette || 0) * 14, 14, 15 + ((x + y) % 4) * 5, 0.88));
          ctx.fillStyle = "rgba(0,0,0,.76)";
          const hole = step * (0.2 + cut);
          ctx.fillRect(px + (step * 0.9 - hole) * 0.5, py + (step * 0.9 - hole) * 0.5, hole, hole);
        }
      } else if (mod.mode === "poche_generator") {
        const cols = 5 + Math.floor((state.hierarchy || 50) * 0.08);
        const rows = 4 + Math.floor((state["room carve"] || 50) * 0.05);
        const cw = (w - 80) / cols;
        const ch = (h - 90) / rows;
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const px = 40 + x * cw;
          const py = 36 + y * ch;
          const wall = (state["wall thickness"] || 50) * 0.06;
          ctx.fillStyle = "rgba(0,0,0,.78)";
          ctx.fillRect(px, py, cw * 0.92, ch * 0.9);
          ctx.clearRect(px + wall, py + wall, cw * 0.92 - wall * 2, ch * 0.9 - wall * 2);
          ctx.fillStyle = "rgba(7,7,7,1)";
          const hd = state["hatch density"] || 30;
          for (let i = 0; i < hd / 12; i++) {
            ctx.fillRect(px + wall + i * 5, py + wall, 1, ch * 0.9 - wall * 2);
          }
        }
      } else if (mod.mode === "diagrid_tower") {
        const bands = state["height bands"];
        const towerW = w * (0.36 - (state.taper || 0) * 0.0015);
        const towerX = cx - towerW / 2;
        const topY = h * 0.1;
        const bandH = (h * 0.78) / bands;
        for (let i = 0; i < bands; i++) {
          const ratio = 1 - i / bands;
          const bw = towerW * (0.55 + ratio * 0.45);
          const bx = cx - bw / 2;
          const by = topY + i * bandH;
          rect3(bx, by, bw, bandH * 0.92, (state.extrude || 0) * 0.22, hsl(208 + i, 18, 13 + (i % 5) * 4, 0.86));
          ctx.strokeStyle = hsl(205, 28, 70, 0.35);
          ctx.lineWidth = Math.max(1, state["line weight"] || 2);
          const pitch = Math.max(2, state["diagonal pitch"] || 6);
          for (let d = 0; d < pitch; d++) {
            const x0 = bx + (d / pitch) * bw;
            ctx.beginPath();
            ctx.moveTo(x0, by);
            ctx.lineTo(x0 + bw / pitch, by + bandH * 0.92);
            ctx.stroke();
          }
        }
      } else if (mod.mode === "parametric_pavilion") {
        const cols = state["column count"];
        const span = w * 0.72;
        const ox = cx - span / 2;
        const baseY = h * 0.72;
        for (let i = 0; i < cols; i++) {
          const x = ox + i * (span / Math.max(1, cols - 1));
          const cH = h * (0.24 + Math.sin(i * 0.22 + t) * 0.04 + (state.openness || 50) * 0.0012);
          rect3(x - 4, baseY - cH, 8, cH, (state.bump || 0) * 0.08, "#1a221d");
        }
        ctx.strokeStyle = hsl(128, 24, 70, 0.45);
        ctx.lineWidth = Math.max(1, state["line weight"] || 2);
        for (let i = 0; i < cols - 1; i++) {
          const x0 = ox + i * (span / Math.max(1, cols - 1));
          const x1 = ox + (i + 1) * (span / Math.max(1, cols - 1));
          const y0 = baseY - h * 0.24 - Math.sin(i * 0.22 + t) * (state["roof curvature"] || 40) * 0.06;
          const y1 = baseY - h * 0.24 - Math.sin((i + 1) * 0.22 + t) * (state["roof curvature"] || 40) * 0.06;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) * 0.5, Math.min(y0, y1) - (state["roof curvature"] || 40) * 0.2, x1, y1); ctx.stroke();
        }
      } else if (mod.mode === "street_canyon") {
        const street = state["street width"];
        const bw = (w - 120) * (0.2 + (100 - street) * 0.0035);
        const hScale = 0.3 + (state["building height"] || 50) * 0.006;
        for (let side = -1; side <= 1; side += 2) {
          const x = side < 0 ? 40 : w - 40 - bw;
          rect3(x, h * (0.18 - hScale * 0.08), bw, h * hScale, (state.displace || 0) * 0.16, side < 0 ? "#1b1b1c" : "#191a1b");
        }
        ctx.fillStyle = "rgba(0,0,0,.62)";
        ctx.beginPath();
        ctx.moveTo(w * 0.5 - (state["street width"] || 40) * 1.6, h);
        ctx.lineTo(w * 0.5 + (state["street width"] || 40) * 1.6, h);
        ctx.lineTo(w * 0.5 + 14, h * 0.2);
        ctx.lineTo(w * 0.5 - 14, h * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = hsl(44, 18, 70, 0.18 + (state["line density"] || 40) * 0.002);
        for (let i = 0; i < state["line density"] / 6; i++) {
          const y = h * (0.22 + i * 0.03 + Math.sin(t + i) * 0.004);
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
      } else if (mod.mode === "panelization_solver") {
        const size = Math.max(8, state["panel size"]);
        const cols = Math.max(3, Math.floor((w - 60) / size));
        const rows = Math.max(3, Math.floor((h - 60) / size));
        const seam = (state["seam width"] || 20) * 0.02;
        const irr = (state.irregularity || 20) * 0.04;
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const px = 30 + x * size + Math.sin((x + y) * 0.2 + t) * irr;
          const py = 30 + y * size + Math.cos((x - y) * 0.2 + t) * irr;
          const pw = size - seam;
          const ph = size - seam;
          ctx.fillStyle = hsl(214 + ((x + y) % 6), 16, 14 + ((x * y) % 5) * 3, 0.84);
          ctx.fillRect(px, py, pw, ph);
          ctx.strokeStyle = hsl(210, 24, 72, 0.32);
          ctx.lineWidth = Math.max(1, state["line weight"] || 2);
          ctx.strokeRect(px, py, pw, ph);
          if ((x + y) % Math.max(2, Math.floor((state.tolerance || 20) * 0.08)) === 0) {
            ctx.fillStyle = "rgba(230,230,230,.42)";
            ctx.fillRect(px + 3, py + 3, 6, 1);
          }
        }
      }

      ctx.fillStyle = "rgba(232,225,212,.68)";
      ctx.font = "11px ui-monospace,monospace";
      ctx.fillText(seedEl.value, 16, h - 18);
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
    window.addEventListener("resize", resize);
    resize();
    applyExperimentalPhysics();
    tick();
  };
})();
