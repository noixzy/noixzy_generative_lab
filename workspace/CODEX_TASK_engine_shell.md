# Codex task — unified engine shell (host the real modules)

Paste this whole file to Codex as the task. It is self-contained; Codex has no access to prior
chat. Read `~/noixzy_generative_lab/workspace/HANDOFF.md` first. **Design reference:** the file
`noixzy_lab_shell_v1.html` (provided alongside) — match its layout, tokens, type, and behavior.
It is a static prototype; this task makes it drive the *real* modules.

---

## Goal

Build a **unified engine shell** at `~/noixzy_generative_lab/shell/index.html` that hosts all 11
modules in one app: a left-rail module switcher, a full-bleed stage, the shared control panel,
the theme picker, format presets, and the action row — exactly as in `noixzy_lab_shell_v1.html`.

**Hard architecture rule:** every module must **stay self-contained and independently
double-clickable** as it is today. The shell hosts the active module in an **iframe** and drives
it over `postMessage`. Do NOT merge modules into one page or break their standalone behavior.

## Repo facts (do not break these)

- The 9 engine modules are **GENERATED** by `~/noixzy_generative_lab/build_lab.js`. **Edit the
  generator, then run `node build_lab.js`.** Do NOT hand-edit generated HTML.
- `grid_extrude` and `sdf_raymarch` are hand-authored — edit their HTML directly. Add the bridge
  to the engine first (all 9 inherit), then replicate into both flagships.
- Self-contained (CDN only, double-click open). No npm/bundler. p5 GLOBAL mode. UI binds in
  `setup()`, never `DOMContentLoaded`. `P` = live params; `pal` = `[[bg],[accent],[ink]]`.
- Mirror changed files to `~/Downloads/noixzy_generative_lab/`. Author credit in new headers:
  **Chris Tucker** only. Additive — no regressions to existing params/pins/reset/palettes/save png.

## Required approach

1. **Message bridge inside every module** (engine + both flagships). Add a small listener so a
   parent shell can drive it:
   - `IN`  `{type:"setParam", key, value}` → write to `P[key]`, mark `dirty`, re-render.
   - `IN`  `{type:"setSeed", seed}` → reseed + rebuild.
   - `IN`  `{type:"setTheme", name}` → apply theme bundle (reuse the theme system if present).
   - `IN`  `{type:"action", name}` → `newSeed | reset | pause | savePng | pin | copy | paste | maps | rec`.
   - `OUT` on change/loop: `{type:"state", seed, fps, dims}` so the shell readout stays live.
   Detect host mode with `window.parent !== window`; standalone behavior is unchanged when opened
   directly.

2. **Shell page** `shell/index.html` from the prototype. Keep the prototype's tokens/type/grain/
   layout. Wire it to real behavior:
   - **Rail** lists the 11 modules; clicking one points the **stage iframe** `src` at that module
     (`../<id>/noixzy_<id>.html`) and updates breadcrumb/overlay.
   - **Panel sliders/segments/swatches** send `setParam` to the active iframe (debounced on
     `input`). The control set can stay generic (the prototype's groups) — out-of-range keys a
     module ignores are harmless.
   - **Theme picker** (`◂ ▸`, `[`/`]`) sends `setTheme` to the iframe AND persists to
     `localStorage['noixzy_lab_theme']` so standalone opens match.
   - **Action row** buttons send `action` messages; show the prototype's toast feedback.
   - **Format presets** letterbox the stage (as in the prototype) and update the dim readout.
   - **Readout** (seed/fps/dims) updates from the module's `OUT state` messages.
   - Keep keys: `h` clean view, `[`/`]` theme, space pause, `?` help, `1–9` module, `n` seed, `s` png.

3. **Don't regress standalone.** Opening `<id>/noixzy_<id>.html` directly must still work fully on
   its own (panel, pins, save png, everything) — the bridge is additive and only activates when
   framed.

## Performance

- Debounce `setParam` (~30–60ms) so dragging a slider doesn't flood the iframe.
- The shell's own ambient field from the prototype is **decorative only** — replace it with the
  live module iframe; don't run both. (Keep the prototype's field as an optional idle/splash if
  no module is loaded.)

## Acceptance criteria

- `shell/index.html` opens, lists 11 modules, and loading one shows the **real module** rendering
  in the stage (not the placeholder).
- Panel controls visibly drive the framed module; theme picker re-skins it live and persists;
  action buttons work (new seed changes the on-canvas seed; save png downloads).
- Readout (seed/fps/dims) reflects the live module.
- Every module still opens standalone by double-click with no regressions and a clean console.
- `node build_lab.js` regenerates cleanly; both flagships bridged; files mirrored to
  `~/Downloads/noixzy_generative_lab/`. No console errors in shell or modules.

## How to verify

`python3 -m http.server` from the lab root. Open `shell/index.html`: switch modules (real renders
appear), drag sliders (framed module responds), cycle themes (`[`/`]`, re-skins live), hit new
seed / save png (work). Then open a module directly (`<id>/noixzy_<id>.html`) and confirm it still
works fully on its own. Console clean in both.

## Out of scope

Don't touch the Blender projects. Don't rewrite module internals beyond adding the message bridge.
Keep everything self-contained (CDN only, no build step beyond `node build_lab.js`, no new deps).
