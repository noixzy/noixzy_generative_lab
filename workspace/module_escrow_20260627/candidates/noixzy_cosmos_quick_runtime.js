(function () {
  "use strict";

  const MODULES = {
    offset_plinth_threshold: ["offset plinth threshold", "#d7c091", "dusty concrete, dark recessed void, warm worn bevels", "offset"],
    indexed_hinge_array: ["indexed hinge array", "#b9c7d9", "blackened steel hinges, rubbed aluminum pins, graphite shadow gaps", "hinge"],
    structural_spine_signal: ["structural spine signal", "#53d6d4", "matte black chassis, cyan emissive core, smoked acrylic ribs", "spine"],
    visible_standoff_cage: ["visible standoff cage", "#b7d0bf", "frosted panel, black ceramic cage, brass micro standoffs", "cage"],
    half_hidden_chamber: ["half hidden chamber", "#d4c7b4", "dusty plaster, sealed interior dark, soft occlusion veil", "chamber"],
    frosted_baffle_field: ["frosted baffle field", "#c9d8e6", "frosted translucent baffles, cold gray frame, edge-lit slots", "baffle"],
    calibrated_gate_relic: ["calibrated gate relic", "#d3b67c", "weathered bronze gate, black base, tiny engraved ticks", "gate"],
    tilted_glyph_system: ["tilted glyph system", "#c7b2e4", "charcoal glyph plates, chalky etched marks, muted violet glints", "glyph"],
    misaligned_float_scaffold: ["misaligned float scaffold", "#acc8d6", "pale concrete floats, thin black scaffold, blue-gray ambient light", "float"],
    recursive_keystone_frame: ["recursive keystone frame", "#dfc9a0", "warm stone keystones, nested soot frames, worn highlighted edges", "recursive"]
  };

  function hash(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    let t = hash(seed) || 1;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function install(accent) {
    const style = document.createElement("style");
    style.textContent = `
      :root{color-scheme:dark;--accent:${accent};--text:#e8e1d4;--muted:#8b867d}
      *{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#050505;color:var(--text);font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
      body{display:grid;grid-template-columns:minmax(0,1fr) 292px}
      main{min-width:0;min-height:0;background:radial-gradient(circle at 48% 30%,rgba(255,255,255,.07),transparent 35%),linear-gradient(#101010,#020202)}
      canvas{display:block;width:100%;height:100%}
      aside{border-left:1px solid #2b2b2b;background:#101010;padding:14px;overflow:auto}
      h1{margin:0 0 5px;font-size:15px;text-transform:lowercase}.sub,.mat{color:var(--muted);font-size:11px;line-height:1.45}.mat{border-top:1px solid #242424;margin-top:12px;padding-top:12px}
      .buttons{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0}button{height:34px;border:1px solid #373737;background:#171717;color:var(--text);font:inherit;font-size:11px;cursor:pointer}
      .row{display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center;margin-bottom:12px}.row span{font-size:11px;color:var(--muted)}input[type=text]{background:#080808;border:1px solid #343434;color:var(--text);padding:8px;font:inherit;font-size:11px;width:100%}
      .control{border-top:1px solid #222;padding:10px 0}.head{display:flex;justify-content:space-between;font-size:11px;margin-bottom:7px;color:var(--muted)}.head b{color:var(--accent);font-weight:400}input[type=range]{width:100%;accent-color:var(--accent)}.physics-toggle{display:flex;align-items:center;gap:8px;margin:10px 0 12px;padding:9px 0;border-top:1px solid #222;border-bottom:1px solid #222;color:var(--muted);font-size:11px;text-transform:lowercase}.physics-toggle input{accent-color:var(--accent)}
      @media(max-width:760px){body{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) 315px}aside{border-left:0;border-top:1px solid #2b2b2b}}
    `;
    document.head.appendChild(style);
  }

  window.initNoixzyCosmosQuick = function initNoixzyCosmosQuick(id) {
    const mod = MODULES[id];
    if (!mod) throw new Error("unknown cosmos quick module: " + id);
    const [title, accent, material, mode] = mod;
    document.title = "noixzy " + title;
    install(accent);
    document.body.innerHTML = `
      <main><canvas id="view"></canvas></main><aside>
      <h1>noixzy ${title}</h1><p class="sub">cosmos quick sketch: light geometry, strong material note, ready for escrow triage</p>
      <div class="buttons"><button id="play">pause</button><button id="randomize">randomize</button><button id="reset">reset</button><button id="export">export png</button></div>
      <div class="row"><span>seed</span><input id="seed" type="text" value="${id}-001" spellcheck="false"></div><div id="controls"></div>
      <label class="physics-toggle"><input id="experimental-physics" type="checkbox"> experimental physics</label>
      <p class="mat">material recommendation: ${material}</p></aside>`;
    const defs = [["density", 3, 18, 1, 9], ["offset", -80, 80, 1, 24], ["void", 0, 100, 1, 38], ["line", 1, 8, 1, 2], ["depth", 0, 100, 1, 52], ["tilt", -45, 45, 1, 12]];
    const controlMeta = Object.fromEntries(defs.map(([key, min, max]) => [key, { min, max }]));
    const state = Object.fromEntries(defs.map(d => [d[0], d[4]]));
    let stageBaseState = { ...state };
    const canvas = document.getElementById("view"), ctx = canvas.getContext("2d"), controls = document.getElementById("controls"), seed = document.getElementById("seed");
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

    defs.forEach(([key, min, max, step]) => {
      const wrap = document.createElement("div");
      wrap.className = "control";
      wrap.innerHTML = `<div class="head"><span>${key}</span><b id="${key}v">${state[key]}</b></div><input id="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}">`;
      controls.appendChild(wrap);
      wrap.querySelector("input").oninput = e => {
        state[key] = Number(e.target.value);
        stageBaseState[key] = state[key];
        wrap.querySelector("b").textContent = state[key];
        draw();
      };
    });

    const physicsToggle = document.getElementById("experimental-physics");
    if (physicsToggle) physicsToggle.onchange = () => { experimentalPhysics = physicsToggle.checked; applyExperimentalPhysics(); draw(true); };

    function clampVal(value, min, max) { return Math.max(min, Math.min(max, value)); }
    function applyStateToUi() {
      controls.querySelectorAll(".control").forEach(wrap => {
        const key = wrap.querySelector(".head span").textContent;
        const input = wrap.querySelector("input");
        const valueNode = wrap.querySelector(".head b");
        input.value = state[key];
        valueNode.textContent = state[key];
      });
    }
    function drive(key, blend) {
      const meta = controlMeta[key];
      if (!meta) return;
      const span = meta.max - meta.min;
      state[key] = clampVal(stageBaseState[key] + span * blend, meta.min, meta.max);
    }
    function applyStageParams(stage) {
      if (!stage || typeof stage !== "object") return;
      const geom = clampVal((Math.abs(stage.depth) / 260 + Math.abs(stage.rotateX) / 55 + Math.abs(stage.rotateY) / 55) / 3, 0, 1);
      const arrayEnergy = clampVal(((stage.arrayCount - 1) / 8) * 0.7 + (stage.arraySpread / 180) * 0.3, 0, 1);
      const kitbashEnergy = stage.kitbash === "none" ? 0 : clampVal((stage.kitbashDensity / 14) * 0.55 + (stage.kitbashScale / 140) * 0.45, 0, 1);
      const materialEnergy = clampVal((stage.material + 80) / 160, 0, 1);

      Object.assign(state, stageBaseState);
      drive("density", (arrayEnergy + kitbashEnergy) * 0.35);
      drive("offset", ((stage.rotateY || 0) / 55) * 0.35 + arrayEnergy * 0.22);
      drive("void", geom * 0.35 + materialEnergy * 0.2 - 0.1);
      drive("line", (kitbashEnergy + materialEnergy) * 0.25 - 0.08);
      drive("depth", geom * 0.4 + arrayEnergy * 0.18);
      drive("tilt", ((stage.rotateX || 0) / 55) * 0.45 + (stage.rotateY || 0) / 55 * 0.15);

      applyStateToUi();
      draw();
    }
    function rect3(x, y, ww, hh, dep, fill) {
      ctx.fillStyle = fill; ctx.fillRect(x, y, ww, hh);
      ctx.fillStyle = "rgba(255,255,255,.11)"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dep, y - dep * .45); ctx.lineTo(x + ww + dep, y - dep * .45); ctx.lineTo(x + ww, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.34)"; ctx.beginPath(); ctx.moveTo(x + ww, y); ctx.lineTo(x + ww + dep, y - dep * .45); ctx.lineTo(x + ww + dep, y + hh - dep * .45); ctx.lineTo(x + ww, y + hh); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(235,226,208,.38)"; ctx.lineWidth = state.line; ctx.strokeRect(x, y, ww, hh);
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#070707"; ctx.fillRect(0, 0, w, h);
      const r = rng(seed.value + id), cx = w / 2, cy = h / 2, count = state.density, dep = 12 + state.depth * .55;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate((state.tilt + (running ? Math.sin(frame * .01) * 2 : 0)) * Math.PI / 180); ctx.translate(-cx, -cy);
      if (mode === "spine") {
        rect3(cx - 22, cy - 180, 44, 360, dep, "#121514"); ctx.shadowColor = accent; ctx.shadowBlur = 18; ctx.fillStyle = accent; ctx.fillRect(cx - 4, cy - 154, 8, 308); ctx.shadowBlur = 0;
      } else if (mode === "recursive") {
        for (let i = 0; i < count; i++) { const s = 340 - i * 25; rect3(cx - s/2 + i*state.offset*.04, cy - s*.32 + i*10, s, s*.55, dep*.35, i%2 ? "#171513" : "#242019"); }
      } else {
        for (let i = 0; i < count; i++) {
          const x = cx - 210 + i * (420 / Math.max(1, count - 1)) + (r() - .5) * state.offset;
          const y = cy - 70 + Math.sin(i * .8 + frame * .015) * (mode === "float" ? 18 : 6);
          const ww = 46 + r() * 82, hh = 58 + r() * 118;
          if (mode === "baffle") rect3(x, cy - 180, 14 + state.line * 4, 330, dep * .22, "rgba(180,205,215,.24)");
          else if (mode === "hinge") { rect3(x, y, ww, 18, dep*.22, "#202020"); ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(x+ww/2,y+9,5+state.line,0,Math.PI*2); ctx.fill(); }
          else if (mode === "cage") { rect3(x, y, ww, hh, dep*.25, "rgba(190,205,195,.16)"); ctx.strokeStyle=accent; ctx.strokeRect(x-8,y-8,ww+16,hh+16); }
          else if (mode === "chamber") { rect3(x, y, ww, hh, dep*.32, "#25221d"); ctx.fillStyle=`rgba(0,0,0,${.25+state.void*.006})`; ctx.fillRect(x+10,y+10,ww-20,hh-20); }
          else if (mode === "gate") { rect3(x, y, 22, hh, dep*.24, "#2a2118"); rect3(x+ww, y, 22, hh, dep*.24, "#2a2118"); ctx.strokeStyle=accent; ctx.beginPath(); ctx.moveTo(x,y+hh*.45); ctx.lineTo(x+ww+22,y+hh*.45); ctx.stroke(); }
          else if (mode === "glyph") { rect3(x, y, ww, hh, dep*.18, "#1b1820"); ctx.strokeStyle=accent; for(let g=0;g<5;g++){ctx.beginPath();ctx.moveTo(x+12+r()*ww*.7,y+14+r()*hh*.7);ctx.lineTo(x+12+r()*ww*.7,y+14+r()*hh*.7);ctx.stroke();} }
          else rect3(x, y + i * state.offset * .05, ww, hh, dep*.38, i%2 ? "#2b2821" : "#171717");
        }
      }
      ctx.restore();
      ctx.fillStyle = "rgba(232,225,212,.68)"; ctx.font = "11px ui-monospace,monospace"; ctx.fillText(seed.value, 16, h - 18);
    }
    function resize(){dpr=Math.max(1,Math.min(2,devicePixelRatio||1)); const b=canvas.getBoundingClientRect(); w=Math.max(320,b.width); h=Math.max(260,b.height); canvas.width=w*dpr; canvas.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); draw();}
    function tick(){if(running){frame++;applyExperimentalPhysics();draw();} requestAnimationFrame(tick);}
    document.getElementById("play").onclick=()=>{running=!running;document.getElementById("play").textContent=running?"pause":"play";draw();};
    document.getElementById("randomize").onclick=()=>{seed.value=id+"-"+Math.floor(Math.random()*99999).toString(36);randomizeModuleControls();stageBaseState={...state};draw();};
    document.getElementById("reset").onclick=()=>location.reload();
    document.getElementById("export").onclick=()=>{draw(); const a=document.createElement("a"); a.download=id+".png"; a.href=canvas.toDataURL("image/png"); a.click();};
    seed.oninput=draw;
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
