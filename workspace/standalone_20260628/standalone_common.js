(() => {
  const MODULES = [
    { id: "edge_extrude", title: "edge extrude", file: "../edge_extrude/noixzy_edge_extrude.html" },
    { id: "sdf_raymarch", title: "sdf raymarch", file: "../sdf_raymarch/noixzy_sdf_raymarch.html" },
    { id: "noixzy_brutalist_massing", title: "noixzy brutalist massing", file: "../noixzy_brutalist_massing/noixzy_brutalist_massing.html" },
    { id: "noixzy_triangulated_signal_mesh", title: "noixzy triangulated signal mesh", file: "../noixzy_triangulated_signal_mesh/noixzy_triangulated_signal_mesh.html" }
  ];

  const moduleIndex = new Map(MODULES.map((module, index) => [module.id, index]));

  const ensureStyle = () => {
    if (document.getElementById("noixzyStandaloneChromeStyle")) return;
    const style = document.createElement("style");
    style.id = "noixzyStandaloneChromeStyle";
    style.textContent = `
      .standaloneShellProxy {
        display: none !important;
      }
      :root {
        --bg: #050505 !important;
        --panel: #101010 !important;
        --ink: #f2f2f2 !important;
        --text: #f2f2f2 !important;
        --dim: #8a8a8a !important;
        --muted: #8a8a8a !important;
        --accent: #c8c8c8 !important;
        --lime: #d8d8d8 !important;
        --a: #c8c8c8 !important;
        --t: #f2f2f2 !important;
        --m: #8a8a8a !important;
      }
      input[type="color"],
      img {
        filter: grayscale(1) !important;
      }
    `;
    document.head.appendChild(style);
  };

  const byId = (id) => document.getElementById(id);

  const firstExisting = (ids = []) => ids.map((id) => byId(id)).find(Boolean) || null;
  const unique = (items = []) => [...new Set(items.filter(Boolean))];

  const ACTION_TARGETS = {
    pause: "pause",
    reset: "reset",
    seed: "newSeed",
    form: "randomForm",
    color: "randomColor",
    rnd: "randomAll",
    save: "save",
    save2x: "save2x",
    thumb: "thumb",
    rec: "rec",
    bg: "btnTransparentBg",
    undo: "btnUndo",
    redo: "btnRedo",
    copy: "copyP",
    paste: "pasteP"
  };

  const moduleState = {
    id: "",
    aliases: {},
    handlers: {}
  };

  const downloadCanvas = (canvas, scale, filename) => {
    if (!canvas) return false;
    const sourceWidth = canvas.width || canvas.clientWidth;
    const sourceHeight = canvas.height || canvas.clientHeight;
    if (!sourceWidth || !sourceHeight) return false;
    const out = document.createElement("canvas");
    out.width = Math.max(1, Math.round(sourceWidth * scale));
    out.height = Math.max(1, Math.round(sourceHeight * scale));
    const ctx = out.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, out.width, out.height);
    const link = document.createElement("a");
    link.href = out.toDataURL("image/png");
    link.download = filename;
    link.click();
    return true;
  };

  const ensureProxy = (id, onClick) => {
    let button = byId(id);
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.id = id;
      button.className = "standaloneShellProxy";
      button.setAttribute("aria-hidden", "true");
      document.body.appendChild(button);
    }
    if (!button.dataset.standaloneBound) {
      button.dataset.standaloneBound = "1";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        onClick();
      });
    }
    return button;
  };

  const aliasToExisting = (targetId, sourceIds) => {
    const source = firstExisting(sourceIds);
    if (!source || source.id === targetId) return false;
    ensureProxy(targetId, () => source.click());
    return true;
  };

  const dispatchShellAction = ({ action, targetId, ids = [] } = {}) => {
    const resolvedTarget = targetId || ACTION_TARGETS[action] || action;
    const candidates = unique([
      resolvedTarget,
      ...(moduleState.aliases[resolvedTarget] || []),
      ...ids
    ]);
    const element = firstExisting(candidates);
    if (element) {
      element.click();
      return { ok: true, hitId: element.id || resolvedTarget };
    }
    const handler = moduleState.handlers[resolvedTarget] || moduleState.handlers[action];
    if (typeof handler === "function") {
      handler();
      return { ok: true, hitId: resolvedTarget };
    }
    return { ok: false, reason: "unsupported" };
  };

  window.addEventListener("message", (event) => {
    const data = event.data || {};
    if (data.type !== "noixzy:standalone-action") return;
    let result;
    try {
      result = dispatchShellAction(data);
    } catch (error) {
      result = { ok: false, reason: error?.message || "action failed" };
    }
    event.source?.postMessage({
      type: "noixzy:standalone-action-result",
      requestId: data.requestId || "",
      action: data.action || "",
      moduleId: moduleState.id,
      ...result
    }, "*");
  });

  const install = ({
    id,
    title,
    canvasSelector = "canvas",
    aliases = {},
    handlers = {}
  }) => {
    if (title) document.title = title;
    ensureStyle();

    const canvas = () => document.querySelector(canvasSelector);
    const seedInput = () => byId("seed") || byId("seedField");

    const aliasMap = {
      pause: aliases.pause || [],
      reset: aliases.reset || [],
      newSeed: aliases.newSeed || [],
      randomAll: aliases.randomAll || [],
      randomForm: aliases.randomForm || [],
      randomColor: aliases.randomColor || [],
      save: aliases.save || [],
      save2x: aliases.save2x || [],
      thumb: aliases.thumb || [],
      rec: aliases.rec || [],
      btnTransparentBg: aliases.btnTransparentBg || [],
      btnUndo: aliases.btnUndo || [],
      btnRedo: aliases.btnRedo || [],
      copyP: aliases.copyP || [],
      pasteP: aliases.pasteP || []
    };
    moduleState.id = id;
    moduleState.aliases = aliasMap;
    moduleState.handlers = handlers;

    Object.entries(aliasMap).forEach(([targetId, sourceIds]) => {
      aliasToExisting(targetId, sourceIds);
    });

    if (!byId("save2x")) {
      ensureProxy("save2x", () => {
        const activeCanvas = canvas();
        if (!activeCanvas) return;
        const seed = seedInput()?.value || "seed";
        downloadCanvas(activeCanvas, 2, `noixzy_${id}_${seed}_2x.png`);
      });
    }

    if (!byId("thumb")) {
      ensureProxy("thumb", () => {
        const activeCanvas = canvas();
        if (!activeCanvas) return;
        const seed = seedInput()?.value || "seed";
        downloadCanvas(activeCanvas, 1, `noixzy_${id}_${seed}_thumb.png`);
      });
    }

    if (!byId("save")) {
      ensureProxy("save", () => {
        const activeCanvas = canvas();
        if (!activeCanvas) return;
        const seed = seedInput()?.value || "seed";
        downloadCanvas(activeCanvas, 1, `noixzy_${id}_${seed}.png`);
      });
    }

    if (!byId("newSeed") && typeof handlers.newSeed === "function") {
      ensureProxy("newSeed", handlers.newSeed);
    }
    if (!byId("randomAll") && typeof handlers.randomAll === "function") {
      ensureProxy("randomAll", handlers.randomAll);
    }
    if (!byId("pause") && typeof handlers.pause === "function") {
      ensureProxy("pause", handlers.pause);
    }
    if (!byId("reset") && typeof handlers.reset === "function") {
      ensureProxy("reset", handlers.reset);
    }
  };

  window.noixzyStandaloneModule = {
    install,
    modules: MODULES
  };
})();
