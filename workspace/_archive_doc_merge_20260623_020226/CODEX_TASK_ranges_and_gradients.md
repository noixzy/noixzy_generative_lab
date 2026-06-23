# Codex task (add-on) — wider parameter ranges + color gradients

Paste this whole file to Codex as the task. It is self-contained; Codex has no access to prior
chat. Read `~/noixzy_generative_lab/workspace/HANDOFF.md` first for context.

---

## Goal

Two additive changes across the lab:

1. **Widen the range of every parameter** so each control can be pushed further than today —
   without changing current defaults or breaking existing looks.
2. **Add color gradients** — palette slots can be smooth ramps, not just flat fills.

## Repo facts (do not break these)

- The 9 "engine" modules are **GENERATED** by `~/noixzy_generative_lab/build_lab.js`. **Edit the
  generator, then run `node build_lab.js`.** Do NOT hand-edit generated HTML.
- `grid_extrude` and `sdf_raymarch` are hand-authored — edit their HTML directly. Do engine first,
  then replicate into these two.
- Self-contained (CDN only, double-click open). No npm/bundler. p5 GLOBAL mode. UI binds in
  `setup()`, never `DOMContentLoaded`.
- `P` = live params. `pal` = `[[r,g,b] bg, [r,g,b] accent, [r,g,b] ink]`.
- Mirror changed files to `~/Downloads/noixzy_generative_lab/`. Author credit in new headers:
  **Chris Tucker** only.

## Required approach

### Part 1 — wider ranges
- In the engine slider definitions (system / material / depth / frame / look / motion) and in both
  flagships, **expand `min`/`max`** so every control reaches further extremes. Suggested: roughly
  **double the usable span** (e.g. extrude, displace, glow, contrast, speed, drift, zoom, density,
  scale, count) — push min lower and max higher where it makes physical sense.
- **Keep all current defaults exactly where they are** — only the bounds move, so the lab opens
  identical and every existing pinned look still reproduces.
- Respect hard limits where a value is physically bounded (opacity `0..1`, rgb `0..255`); for those,
  widen the *step/precision* or leave as-is rather than exceeding the real range.
- For count/density params, raise the ceiling but **guard performance** — if a param can tank the
  frame rate at the new max, clamp the heavy render path or keep the heightfield/grid resolution
  sane so the UI stays responsive at extremes.

### Part 2 — color gradients
- Extend the palette structure so each slot can be **either a flat `[r,g,b]` (as today) or a
  gradient = an ordered list of color stops** `[[r,g,b], [r,g,b], ...]`. Flat stays the default;
  gradients are opt-in (back-compatible — existing flat palettes keep working untouched).
- Add a shared engine helper `rampColor(slot, t)` that returns the interpolated color at `t` in
  `0..1` (flat slot → constant; gradient slot → lerp between stops). Modules that color-by-value
  (height, density, distance, depth) call `rampColor` instead of the flat color so gradients read.
- Add a **"gradient" control group** (small, in the panel): a toggle to enable gradient mode for the
  active palette, an **angle/direction** for background ramps, and the ability to set 2–3 stops
  (reuse existing palettes as the stop source so it stays restrained — e.g. ramp `bg → accent`,
  `accent → ink`). At minimum: a background ramp + a value-ramp used by `rampColor`.
- **Theme-compatible:** store gradient stops inside the palette/theme bundle so the theme system
  (`noixzy_lab_theme`) can carry gradients too. If the theme system isn't present yet, just keep the
  structure forward-compatible.

## Performance

- `rampColor` must be cheap (precompute stop deltas; no per-pixel allocations). Background ramps
  should render once into the cached buffer on `dirty`, not per frame.

## Acceptance criteria

- Every control reaches noticeably further than before; **defaults unchanged**; existing pins/looks
  reproduce identically.
- Gradient mode produces visibly smooth color ramps on the modules that color-by-value (e.g.
  voronoi by area, reaction_diffusion by concentration, contour by elevation, sdf by depth); flat
  palettes still work with gradients off.
- All existing params, pins, reset, save png, symmetry, motion, the 10 palettes, and (if present)
  the theme system still work — no regressions.
- `node build_lab.js` regenerates cleanly; both flagships updated; UI responsive at new extremes.
- No console errors. "new seed" still changes the on-canvas seed.
- Changed files mirrored to `~/Downloads/noixzy_generative_lab/`.

## How to verify

`python3 -m http.server`, open a few modules from `~/Downloads/noixzy_generative_lab/<id>/...`,
push sliders to the new maxima (confirm no crash / no console errors / frame rate holds), toggle
gradient mode and change the angle/stops (confirm smooth ramps), then reload and confirm defaults
and pinned looks are unchanged.

## Out of scope

Don't touch the Blender projects or gallery layout, don't add modules or new dependencies, keep it
self-contained (no build step beyond `node build_lab.js`).
