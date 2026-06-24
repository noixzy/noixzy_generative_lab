# Codex task — session 2 upgrades

Paste this whole file to Codex as the task. It is self-contained; Codex has no access to prior
chat. Read `~/noixzy_generative_lab/workspace/HANDOFF.md` first for full architecture context.

Work through tasks in order. Each is independent — if you run out of time, stop after the last
fully finished and verified task. Do not start a task you cannot finish.

---

## Repo facts (never break these)

- 9 "engine" modules are **GENERATED** by `~/noixzy_generative_lab/build_lab.js`. Edit the
  generator, then run `node build_lab.js`. Never hand-edit generated HTML.
- `grid_extrude` and `sdf_raymarch` are hand-authored — edit their HTML files directly.
- Shared features: add to engine first (so all 9 inherit), then replicate into both flagships.
- Self-contained (CDN only, double-click open). No npm/bundler. p5 GLOBAL mode. UI binds in
  `setup()`, never `DOMContentLoaded`. `P` = live params array.
- Mirror every changed file to `~/Downloads/noixzy_generative_lab/` (same relative path).
- Work additively — do not regress existing params, pins, reset, palettes, save png, pbr pack,
  rec button, or theme system.
- Verify in a real browser: `python3 -m http.server` from the project root, load the module,
  confirm renders and controls respond and console is clean.

---

## TASK A — Copy / paste params

Add **"copy"** and **"paste"** buttons to the panel in all 11 modules.

### Engine (build_lab.js)
- Add `<button id="copyP">copy</button><button id="pasteP">paste</button>` next to the existing
  buttons row.
- `copyP`: writes `JSON.stringify({seed, P, theme: activeTheme})` to clipboard via
  `navigator.clipboard.writeText(...)`. Flash button "copied ✓" for 1.1s.
- `pasteP`: reads clipboard, `JSON.parse`, validates it has a `P` array and/or `seed`, applies
  them. Call `applyConfig({seed, P})` if the function exists, otherwise set `seed` and `P`
  directly and set `dirty=true`. If theme key present, call `applyTheme(data.theme)`. Flash
  "pasted ✓". If parse fails or clipboard empty, flash "✗ invalid" — no crash, no console error.
- Wire both in `buildUI()`.

### Flagships (grid_extrude, sdf_raymarch)
Replicate the same two buttons and handlers. In sdf_raymarch, `applyConfig` doesn't exist —
instead set `P` values via the `setPControl` mechanism or directly into the `P` array, then call
`buildPrims()` if seed changed. Apply theme if present.

**Acceptance:** copy params in flow_field, paste into voronoi → look transfers (same seed +
params). Bad/empty clipboard: silent fail, no uncaught error.

---

## TASK B — Seed in PNG filename

Currently `saveCanvas("noixzy_<piece>","png")`. Change to `saveCanvas("noixzy_<piece>_<seed>","png")`.

- Engine (`build_lab.js`): update the `save` button listener — `saveCanvas(\`noixzy_\${PIECE}_\${seed}\`, "png")`.
- `grid_extrude`: same update.
- `sdf_raymarch`: same — already uses `noixzy_${PIECE}_${seed}` pattern, verify it's correct.
- The `rec` button WebM download already uses seed in the filename — leave it unchanged.

**Acceptance:** exported PNG is named `noixzy_flow_field_42.png` (piece + seed). Filename
changes when you change the seed.

---

## TASK C — `?` shortcut overlay

Press **`?`** to toggle a translucent cheat-sheet overlay listing all keyboard shortcuts.
Dismiss on `?` again or `Esc`.

### Content of the overlay
```
keyboard shortcuts

h         hide / show panel
?         this help
space     pause / play
[ / ]     cycle theme
s         save png
```
(Show only shortcuts that are actually wired in that module.)

### Implementation
- Add a `<div id="kbHelp">` overlay to the HTML (engine + both flagships). Style it:
  `position:fixed; inset:0; background:rgba(0,0,0,0.72); display:flex; align-items:center;
  justify-content:center; z-index:998; display:none;` with a centered card using existing
  `--panel`/`--ink`/`--accent` CSS variables, monospace font, matching the existing translucent
  panel aesthetic.
- In `keyPressed()` (which binds in `setup()`):
  - `?` → toggle `#kbHelp` display between `none` and `flex`.
  - `Escape` → always hide it.
  - Guard: if an `<input>` or `<select>` is focused, do nothing.
- Wire `Escape` via a `keydown` listener added in `setup()`.

**Acceptance:** `?` toggles overlay in all 11 modules. Overlay lists the real shortcuts. `Esc`
always closes it. No console errors. No regression to existing `h` / `[ ]` shortcuts.

---

## TASK D — SVG export for vector pieces

Add an **"svg"** download button to three modules: `truchet`, `contour_field`, `l_system`.
These are engine-generated — edit `build_lab.js` and regenerate.

### How it works
- Engine template gets an optional `renderSVG()` function hook. If a piece defines
  `renderSVG()`, the engine wires a `<button id="svg">svg</button>` next to the other export
  buttons and calls it on click.
- Each piece's `renderSVG()` re-walks the same geometry (same `seed` + `P` params, same
  deterministic random sequence) but emits SVG string `<path>` / `<line>` / `<polyline>`
  elements with `stroke` colors from `getPal()` instead of drawing to canvas.
- Build the SVG string: `<svg xmlns="..." width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bgHex}"/>...paths...</svg>`. Trigger download as
  `noixzy_<piece>_<seed>.svg`.

### Per-piece geometry to emit

**truchet** — each cell draws one of two arcs (quarter-circles). Emit `<path>` arcs using SVG
arc commands. Stroke color = `getPal()[1]` (accent). Background fill = `getPal()[0]`.

**contour_field** — marching-squares isolines are already computed as line segments. Collect
them into `<polyline>` or `<path>` elements. Use `getPal()` colors mapped to contour level
(same color logic the canvas render uses).

**l_system** — the turtle draws line segments. Collect each `forward(len)` as a `<line>` or
accumulate into a `<path>`. Stroke = `getPal()[1]`, background = `getPal()[0]`.

### Engine wiring
In `buildUI()`:
```javascript
if(typeof renderSVG === 'function'){
  const svgBtn = document.createElement('button');
  svgBtn.id = 'svg'; svgBtn.textContent = 'svg';
  document.querySelector('.btns').appendChild(svgBtn);
  svgBtn.addEventListener('click', renderSVG);
}
```

**Acceptance:** clicking "svg" in truchet, contour_field, or l_system downloads a valid SVG
that opens in a browser and visually matches the canvas (same paths, correct colors). The
button does not appear in the other 6 engine modules.

---

## TASK E — HD/2x export

Add a **"save 2x"** button to all 11 modules that renders and downloads a PNG at 2× the current
canvas resolution (for print / Blender texture use).

### Implementation
- Engine + flagships: add `<button id="save2x">save 2x</button>` to the buttons row.
- On click: create a `createGraphics(W*2, H*2)` buffer, call `render(g2, getPal())` (seeded
  with current `seed`), save it as `noixzy_<piece>_<seed>_2x.png` via `saveCanvas` or
  `g2.save(...)`, then `g2.remove()`.
- For `sdf_raymarch` (WebGL shader-based): instead of `createGraphics`, temporarily resize the
  canvas to `W*2, H*2`, call `draw()` once, save via `saveCanvas`, then resize back. OR simply
  note in a comment that 2x isn't available for the shader-based module and skip the button
  there.
- Flash the button "rendering…" while generating, restore label when done.

**Acceptance:** button appears in all engine modules + grid_extrude. In sdf_raymarch it can be
omitted with a comment. Clicking it downloads a 2× PNG (e.g. if screen is 1920×1080, output is
3840×2160). No hang or blank download.

---

## TASK F — Rec duration control

The `rec` button currently hardcodes 4 seconds. Add a small dropdown next to the button to
choose duration: **2s / 4s / 8s / 16s**.

### Implementation
- Engine + flagships: after the `<button id="rec">rec</button>`, add:
  `<select id="recDur"><option value="2">2s</option><option value="4" selected>4s</option>
  <option value="8">8s</option><option value="16">16s</option></select>`.
- Change the rec listener to read `parseInt(document.getElementById('recDur').value)` as the
  duration passed to `recordClip(dur)`.
- Add minimal CSS for the select: same styling as the existing theme select.

**Acceptance:** choosing 8s and clicking rec produces an ~8 second WebM. Default is still 4s.
No regression to existing rec behavior.

---

## Verify all tasks

```bash
cd ~/Downloads/noixzy_generative_lab
python3 -m http.server
```
Open in browser:
1. Any engine module — copy params, reload, paste → look transfers. Save PNG → filename has
   seed. Press `?` → overlay shows. Press `Esc` → closes.
2. `truchet`, `contour_field`, `l_system` → "svg" button appears, clicking it downloads a
   matching SVG.
3. Any engine module → "save 2x" produces an oversized PNG.
4. Rec duration dropdown → set to 8s, click rec → ~8s WebM downloads.
5. Console is clean (no uncaught errors) across all tested modules.

## Out of scope

Do not touch the Blender projects, add new modules, add npm dependencies, change gallery layout,
or alter existing params/pins/reset/palette behavior. Keep everything self-contained (no build
step beyond `node build_lab.js`).
