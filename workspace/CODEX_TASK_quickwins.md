# Codex task (quick wins) — copy/paste params, seed in filename, shortcut overlay

Paste this whole file to Codex as the task. It is self-contained; Codex has no access to prior
chat. Read `~/noixzy_generative_lab/workspace/HANDOFF.md` first for context. Three small,
independent UX wins — each can ship on its own; do as many as fit.

---

## Repo facts (do not break these)

- The 9 "engine" modules are **GENERATED** by `~/noixzy_generative_lab/build_lab.js`. **Edit the
  generator, then run `node build_lab.js`.** Do NOT hand-edit generated HTML.
- `grid_extrude` and `sdf_raymarch` are hand-authored — edit their HTML directly. Engine first,
  then replicate into both flagships.
- Self-contained (CDN only, double-click open). No npm/bundler. p5 GLOBAL mode. UI binds in
  `setup()`, never `DOMContentLoaded`. `P` = live params.
- Mirror changed files to `~/Downloads/noixzy_generative_lab/`. Author credit in new headers:
  **Chris Tucker** only. Work additively — no regressions to existing params/pins/reset/palettes/
  save png/UI.

---

## WIN 1 — copy / paste params
- Add a **"copy"** button (near `save png` / `export ★`) that writes the current state — `seed` +
  all `P` params (+ active theme name if present) — to the clipboard as JSON via
  `navigator.clipboard.writeText(JSON.stringify(state))`.
- Add a **"paste"** button that reads clipboard JSON, validates it, applies it to `P` (and seed),
  marks `dirty`, re-renders. Ignore/skip unknown keys so it's forward-compatible.
- **Acceptance:** copy in one module, paste into another → the look transfers. Bad/empty clipboard
  is handled silently (no crash, no console error).

## WIN 2 — seed in the PNG filename
- On `save png`, name the file `noixzy_<piece>_<seed>.png` (piece id + current seed). If a theme is
  active, optional `noixzy_<piece>_<theme>_<seed>.png`.
- **Acceptance:** every exported PNG is traceable to its piece + seed from the filename alone.

## WIN 3 — `?` shortcut overlay
- Press **`?`** to toggle a translucent cheat-sheet overlay listing the keyboard shortcuts:
  `h` hide panel · `?` this help · space pause · `[` / `]` cycle themes (if present) · plus any
  others already wired. Dismiss on `?` again or `Esc`.
- Keep it consistent with the existing translucent-panel styling. Bind the key handler in `setup()`.
- **Acceptance:** `?` toggles the overlay in every module; it lists the real, working shortcuts;
  no console errors.

---

## Verify

`python3 -m http.server`, open a couple modules from `~/Downloads/noixzy_generative_lab/<id>/...`:
copy params → paste into a different module (look transfers), save a PNG (filename has the seed),
press `?` (overlay toggles). Reload, confirm clean console and no regressions.

## Out of scope

Don't touch the Blender projects, gallery layout, or add modules/dependencies. Keep it
self-contained (no build step beyond `node build_lab.js`); regenerate and mirror to Downloads.
