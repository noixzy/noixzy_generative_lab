# 03 — Engineering Standards
# noixzy Generative Lab — Technical Standards for All AI Agents

> These are the permanent technical rules distilled from all project documents.
> They apply to every agent (Claude, Codex, ChatGPT, Copilot) on every task.
> Where a rule has a clear origin, the source is cited.

---

## 1. HTML — Module Files

**S-H-01** Each module is a **single self-contained HTML file** in its own directory:
`<module_id>/noixzy_<module_id>.html`. It must open by double-click with no server,
no build step, no npm install. (*`READ_FIRST.md`, `HANDOFF.md`*)

**S-H-02** External dependencies are **CDN `<script>` tags only**. No npm, no bundler,
no local imports, no new dependencies beyond p5.js 1.9.0 and WebGL / GLSL inline.
(*`READ_FIRST.md`, `HANDOFF.md`, `CODEX_QUEUE.md`*)

**S-H-03** Thumbnails must **NOT use `loading="lazy"`** — it breaks in backgrounded tabs.
(*`HANDOFF.md`*)

**S-H-04** Generated module HTML files must **never be hand-edited**. They are artifacts
produced by `build_lab.js`. Any change goes into the generator; run `node build_lab.js`.
(*`READ_FIRST.md`, `HANDOFF.md`, `CODEX_QUEUE.md`*)

**S-H-05** Hand-authored flagship HTML files are edited directly. They are:
`grid_extrude`, `sdf_raymarch`, `gyroid`, `displacement`, `displacement_primitives`,
`mandelbulb`, `fold`, `metafluid`, `hex_grid`, `rose_curve`, `lissajous_mesh`, `torus_knot`.
(*`HANDOFF.md`, `GPT_HANDOFF_2026_06_25.md`*)

---

## 2. JavaScript — Core Rules

**S-J-01** Use **p5.js 1.9.0 global mode** in all p5-based modules. `setup()`, `draw()`,
`noise()`, `lerp()`, `map()`, `random()`, `dist()`, etc. are globals. Never use
`new p5(instance => …)`. (*`CHATGPT_BRIEF.md`, `SESSION_BRIDGE.md`*)

**S-J-02** `mix()` is **GLSL-only**. In all p5.js / 2D JS code, define:
`const mix = (a, b, t) => a + (b - a) * t;` at the top of the file.
(*`SESSION_BRIDGE.md`, `GPT_HANDOFF_2026_06_25.md`*)

**S-J-03** **UI binds in `setup()`, never in `DOMContentLoaded`**. `DOMContentLoaded`
silently kills controls. This rule has broken the lab before and must not be violated.
(*`READ_FIRST.md`, `HANDOFF.md`, `CODEX_QUEUE.md`, `CHATGPT_BRIEF.md`*)

**S-J-04** The **`dirty` flag** drives re-renders. Set `dirty = true` on any param or
seed change. The render loop checks `dirty` and only redraws when needed, enabling
pause mode and performance efficiency. (*`CHATGPT_BRIEF.md`*)

**S-J-05** **`animT`** is seconds elapsed, updated in `draw()`. Use it for time-based
animation. Do not use `millis()` directly in module render paths. (*`CHATGPT_BRIEF.md`*)

**S-J-06** `saveThumb()` must always wrap its canvas capture in a `requestAnimationFrame()`
callback — required for WebGL buffer timing. This pattern is required for both WEBGL
and 2D modules. (*`SESSION_BRIDGE.md`*)

**S-J-07** Never place any code **after the closing `}` of `saveThumb()`** — this prior
bug broke the entire module script. (*`SESSION_BRIDGE.md`*)

**S-J-08** Never add `}catch(e){ _captureThumb() … }` — this stray pattern previously
broke gyroid, sdf_raymarch, displacement, displacement_primitives, and mandelbulb (blank
canvas, no render). (*`SESSION_BRIDGE.md`*)

**S-J-09** Heavy simulation buffers must use **pre-allocated typed arrays** (`Float32Array`,
`Uint32Array`). Never create new arrays per frame in hot simulation paths.
(*`NGL_TOTAL_AUDIT_20260627.md`*)

**S-J-10** No comments explaining what code does. Only comments for non-obvious WHY
(hidden constraint, invariant, workaround). No multi-line comment blocks.
(*`CHATGPT_BRIEF.md`*)

---

## 3. Unified Shell (`unified_shell.html`)

**S-US-01** The shell file is `unified_shell.html` at the project root. It is the
**production shell** — treat as committed, stable, and protected unless a change is
explicitly scoped to it. (*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

**S-US-02** The shell hosts modules in an **iframe** (`#moduleFrame`). It does not merge
module render engines. It communicates with modules via iframe DOM access (same-origin
`file://`) with `tryIframeClick()` as the bridge mechanism.
(*`unified_shell_functionality_restoration_20260627.md`, `NGL_PLAN_06062026.md`*)

**S-US-03** The control strip bridge tries **multiple fallback IDs** per action (Template A
→ B → C compatibility). The lookup order for each action is fixed:
- save: `save` → `btnSave2` → `btnSave`
- save2x: `save2x` → `btnSave2x2` → `btnSave2x`
- thumb: `thumb` → `btnThumb2` → `btnThumb`
- rec: `rec` → `btnRec2` → `btnRec`
- newSeed: `newSeed` → `btnNewSeed`
- copy: `copyP` → `btnCopy`
- paste: `pasteP` → `btnPaste`
(*`unified_shell_functionality_restoration_20260627.md`*)

**S-US-04** The shell's visual system uses these CSS variables and selectors. Do not
rename or restructure them without an explicit scope change:
- `--rail-h: 78px` (or 92px if module labels are added)
- `--ctrl-h: 28px` — control strip height
- `--stage-top: calc(var(--rail-h) + var(--ctrl-h))` — stage inset
- `.rail`, `.rail::before`, `.rail::after` — CRT noise
- `@keyframes noixzyRailCrtNoise` — CRT animation
- `.thumbRail`, `.moduleButton`, `.moduleButton img` — module thumbnails
- `.logoOverlay`, `.logoOverlay img`, `.logoOverlay::before`, `.logoOverlay::after` — badge
(*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

**S-US-05** The following are **never to be reintroduced** in the shell:
`shellRailGlint`, `shellRailHolo`, `repeating-linear-gradient(to right, …)`, any colored
(teal, blue, neon) wash or accent. (*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

**S-US-06** Badge selector distinction: `.logoOverlay` = the badge box; `.logoOverlay img`
= the logo artwork inside it. When instructed to "scale the logo," edit only `.logoOverlay img`.
Never casually change `.logoOverlay` dimensions unless explicitly requested.
(*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

---

## 4. Hand-Authored Module Standards

**S-HA-01** Hand-authored modules must expose the same user-facing features as the engine
family: theme / palette cycle, material controls, depth (extrude + displace), frame
controls, look controls, motion controls, seed + new seed, pin / favorites, reset, pause,
save PNG, export. (*`HANDOFF.md`, `CHATGPT_BRIEF.md`*)

**S-HA-02** Hand-authored SDF / raymarch modules share the orbit camera pattern:
```glsl
vec3 ro = vec3(sin(a) * R, el, cos(a) * R);
```
`spin` drives `a`; `u_dist` (orbit radius) and `u_elev` (elevation) are the planned
Phase 2 camera controls. (*`CHATGPT_BRIEF.md`, `CAMERA_CONTROLS_PLAN.md`*)

**S-HA-03** The legacy control bridge (`initNoixzyLegacyControlBridge()`) was added to
hand-authored modules to normalize control IDs for shell compatibility. It creates hidden
fallback elements for: `save`, `save2x`, `rec`, `thumb`, `pause`, `reset`, `copy`, `paste`,
`newSeed`, `randomUnlocked`, `randomForm`, `randomColor`, `recDur`.
(*`_archive/docs_notes_20260627/algorithmic_art_roadmap_clean_20260626.md`*)

**S-HA-04** `grid_extrude` is Template B — it uses `btnSave2`, `btnSave2x2`, `btnThumb2`,
`btnRec2`, `btnNewSeed`, `btnUndo`, `btnRedo`. Do not change its control IDs.
(*`unified_shell_functionality_restoration_20260627.md`*)

---

## 5. Generated Module Standards

**S-GM-01** The module anatomy contract: every generated piece defines
`build()` (compute state from seed + params), `render(g, pal)` (draw into p5.Graphics
buffer), and optionally `heightField(G)` (returns `Float32Array(G*G)` of normalized
heights 0–1). (*`CHATGPT_BRIEF.md`, `CODEX_TASK_volumetric_extrude.md`*)

**S-GM-02** `pal` is always `[[r,g,b], [r,g,b], [r,g,b]]` — index 0 = background,
1 = accent, 2 = ink. Never deviate from this shape. (*`CHATGPT_BRIEF.md`, `HANDOFF.md`*)

**S-GM-03** `P` is the live params object. Access all controls via `P.key`. Never
shadow or redeclare SHARED params in a piece's system array. (*`CHATGPT_BRIEF.md`*)

**S-GM-04** SHARED params injected into every piece (do not redeclare):
`zoom`, `rot`, `mirror`, `cx`, `cy`, `metallic`, `rough`, `sheen`, `alpha`, `contrast`,
`vig`, `grain`, `glow`, `speed`, `drift`. (*`CHATGPT_BRIEF.md`, `CAMERA_CONTROLS_PLAN.md`*)

**S-GM-05** Each piece's `system[]` array must have **exactly 3–4 sliders** unique to that
piece, plus a palette selector (`k:"pal"`). The engine provides the rest.
(*`CHATGPT_BRIEF.md`*)

**S-GM-06** `_edgeMask(out, G)` must be called **before every `heightField()` return**
in generated modules. Heights fade to 0 within 15% of each edge (smoothstep 0.15→0.30),
inner ~70% extrudes at full strength. Borders stay flat. (*`SESSION_BRIDGE.md`*)

**S-GM-07** `makeField(N, (x,y) => [r,g,b])` is the shared pixel-grid helper for field
renders. Use it for any module that renders a full-canvas pixel map. (*`EXPANSION_V2.md`*)

**S-GM-08** `renderHeightfield(g, heights, G, pal)` is the shared isometric extrude
renderer. It takes a `Float32Array` of G×G heights (0–1), renders back-to-front columns
with a lit top and shaded sides. Call it when `P.height > 0.01` and the piece has
`volumetric: true`. (*`CHATGPT_BRIEF.md`, `CODEX_TASK_volumetric_extrude.md`*)

**S-GM-09** The `heightField` performance budget: downsampled grid G ≈ 120–150 cells.
Render only on `dirty`, into the cached scene buffer — not every frame. Target ≥ 50fps
on a 1280×800 window. Use `g.quad()` fills, `g.noStroke()`. Never `loadPixels` per
column. (*`CODEX_TASK_volumetric_extrude.md`*)

**S-GM-10** `truchet_b` has a duplicate `speed` key — one in its system array and one in
SHARED. This produces two speed sliders. Fix in `build_lab.js` before adding other speed
changes. (*`CHATGPT_BRIEF.md`*)

---

## 6. Gallery

**S-G-01** The gallery lives at `gallery/index.html`. It reads from the pieces array
hardcoded in that file and from `gallery/thumbs/*.png`. (*`HANDOFF.md`*)

**S-G-02** Adding a new module requires:
1. Create `<module_id>/noixzy_<module_id>.html`
2. Add entry to `gallery/index.html` pieces array: `["module_id","title","description","tags","h|e"]`
   — `"h"` = hand-authored (✦ badge), `"e"` = generated (◎ badge)
3. Add `{id:"module_id", title:"display title"}` to `ALL_MODULES` in **every existing module**
4. Add thumbnail to `gallery/thumbs/<module_id>.png`
5. Run `node contact_sheet.js` to refresh the contact sheet
(*`GPT_HANDOFF_2026_06_25.md`, `HANDOFF.md`*)

**S-G-03** Gallery metadata and `build_lab.js` PIECES array must stay in sync. The `sdf`
module is a known drift risk — it exists as a generated module but has historically been
absent from the gallery. Resolve before adding new modules. (*`NGL_PLAN_06062026.md`*)

---

## 7. Manifest

**S-M-01** `modules.manifest.json` is the canonical module registry for the unified shell.
As of the 2026-06-27 audit, it contains 58 entries (57 enabled). The `fold` entry has a
stale reference — pre-existing, not yet resolved. (*`unified_shell_functionality_restoration_20260627.md`*)

**S-M-02** The manifest must include capability flags per module: supported actions,
export types, audio-reactive status, transparent background, schema availability.
(*`NGL_PLAN_06062026.md`*)

**S-M-03** Gallery metadata, build_lab.js PIECES, and the manifest are three separate
sources of truth that must stay synchronized. Future work should consolidate to one
canonical manifest consumed by all three. (*`NGL_PLAN_06062026.md`*)

---

## 8. UI Standards

**S-UI-01** The param schema shape is:
`{k:"key", g:"group", label:"Label", min:0, max:1, step:0.01, v:0.5}`
Optional flags: `rr:true` (re-render on change), `sys:true` (rebuild simulation).
(*`CHATGPT_BRIEF.md`*)

**S-UI-02** Control groups in canonical order: `system`, `extrude`, `material`, `frame`,
`look`, `motion`. The first two groups open by default. (*`CHATGPT_BRIEF.md`, `HANDOFF.md`*)

**S-UI-03** Keyboard shortcuts (engine standard):
- `h` — hide panel
- `?` — help overlay
- `space` — pause/play
- `[ ]` — cycle theme
- `s` — save PNG
- `n` — new seed (in shell: via bridge)
(*`CHATGPT_BRIEF.md`, `CODEX_TASK_engine_shell.md`*)

**S-UI-04** `ALL_MODULES` array must be kept in sync across every module file. When a
new module is added, its entry must be appended to `ALL_MODULES` in **all** existing modules
(or via a find-replace across the codebase). (*`GPT_HANDOFF_2026_06_25.md`, `SESSION_BRIDGE.md`*)

**S-UI-05** The scrollIntoView fix: the generated module nav strip uses horizontal
`strip.scrollLeft` offset, not `el.scrollIntoView({block:"nearest"})` (vertical scroll).
The latter caused modules to open from the page bottom. (*`SESSION_BRIDGE.md`*)

---

## 9. QA Standards

**S-QA-01** **Browser verify is required before declaring any task done.**
Start `python3 -m http.server` from the lab root. Open the changed module. Reload.
Confirm: renders, controls respond, console is clean. A clean parse is not proof.
(*`READ_FIRST.md`, `CODEX_QUEUE.md`*)

**S-QA-02** **Additive only.** Never remove or regress existing params, pins, reset,
palettes, save PNG, the full-bleed translucent UI, or the gallery. (*`READ_FIRST.md`*)

**S-QA-03** After any engine change run `node build_lab.js` and confirm it exits cleanly
with `done: N pieces` before opening a browser. (*`CHATGPT_BRIEF.md`*)

**S-QA-04** For SDF modules, verify one module completely in browser before touching the
next. Never edit two SDF modules in the same session without a browser check between them.
(*`CAMERA_CONTROLS_PLAN.md`*)

**S-QA-05** Test the full regression matrix for any shell change:
- One generated heightfield module
- One generated non-heightfield module
- `grid_extrude`
- `sdf_raymarch`
- One shader/SDF hand-authored module
- One curve hand-authored module
(*`NGL_PLAN_06062026.md`*)

---

## 10. Git Standards

**S-GIT-01** **Never use `git add .` or `git add -A`** — always use explicit file names.
(*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

**S-GIT-02** For unified shell changes only: `git add unified_shell.html`.
For engine changes: `git add build_lab.js` + all regenerated module HTML.
(*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

**S-GIT-03** No `.bak` files committed. No temporary rollback snapshots in the working
tree. (*`unified_shell_functionality_restoration_20260627.md`*)

**S-GIT-04** Protected files — never modify without explicit scope change:
`build_lab.js`, `gallery/index.html`, `gallery/thumbs/`, `modules.manifest.json`,
all generated module HTML, `noixzy_lab_shell_v1.html`, parked Blender/workspace files.
(*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`, `NGL_TOTAL_AUDIT_20260627.md`*)

**S-GIT-05** Two files are parked in `.git/info/exclude` (not committed, but present on disk):
- `blender_builds/unified_shell_pilot_scene.blend`
- `workspace/ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md`
Do not delete or commit them unless explicitly asked. (*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

---

## 11. Reporting Standards

**S-R-01** Author credit in all new file headers: **"Chris Tucker" only**. Never use
"noixzy" or any other name. (*`READ_FIRST.md`, `SESSION_BRIDGE.md`, `CHATGPT_BRIEF.md`*)

**S-R-02** `noixzy` is always **lowercase** — in filenames, prose, IDs, comments.
(*`READ_FIRST.md`*)

**S-R-03** Deliver scripts as downloadable `.zip` with an explicit download step and one
chained Terminal command that unzips from `~/Downloads` and runs. Do not expect pasted-in
script text. (*`READ_FIRST.md`*)

**S-R-04** Before any command, label the **exact app/location**: Terminal, VS Code, Blender,
Finder, Browser. (*`READ_FIRST.md`*)

**S-R-05** One Terminal command at a time for file operations; exact filenames; verify with
a follow-up; never substitute `cp` for `mv`. (*`READ_FIRST.md`*)

**S-R-06** Append a dated entry to the **session log at the top of `SESSION_BRIDGE.md`**
when finishing any session: what was built, what was verified, what is next.
(*`READ_FIRST.md`*)

---

## 12. Naming Standards

**S-N-01** Module directory: `<module_id>/`
Module HTML: `noixzy_<module_id>.html`
Module ID format: lowercase snake_case (*`HANDOFF.md`*)

**S-N-02** Escrow candidate files: `noixzy_<module_id>.html` inside
`workspace/module_escrow_20260627/candidates/`

**S-N-03** Prototype files: `noixzy_proto_<concept_name>.html`

**S-N-04** Save filename convention: `noixzy_<module_id>_s<seed>_<millis>.png`
(seed embedded for traceability). (*`EXPANSION_V2.md`*)

**S-N-05** CSS keyframe names use the prefix `noixzy` — e.g., `@keyframes noixzyRailCrtNoise`.
(*`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

---

## 13. Performance Standards

**S-P-01** CPU/GPU risk tiers:
- **HIGH:** falling sand (per-pixel CA, no typed arrays), cyclic CA (full-grid CA per frame)
- **MEDIUM-HIGH:** Lenia at large radius (O(n·R²) convolution per frame)
- **MEDIUM:** physarum (agent + diffusion pass), mandelbulb (6+ raymarch iterations/fragment)
- **LOW-MEDIUM:** particle orbitals, boids, flow_field, SDF modules (well-optimized)
- **LOW:** canvas 2D path modules, brutalist massing (pure rect ops)
(*`NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`*)

**S-P-02** Lighter alternatives for heavy modules:
- Falling sand → subsample 1/4 canvas, scale up with CSS
- Cyclic CA → run at half canvas resolution, upscale with `imageSmoothingEnabled`
- Lenia → cap default radius to 9–12, max at 24; "lite mode" halves grid resolution
- Physarum → cap default at 800 agents; "performance mode" disables trail diffusion
- Strange attractor → OffscreenCanvas, accumulate over multiple frames
(*`NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`*)

**S-P-03** Idle module throttling: add `document.visibilitychange` + `requestAnimationFrame`
cancellation when the page is hidden (if/when shell hosts multiple modules simultaneously).
(*`NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`*)
