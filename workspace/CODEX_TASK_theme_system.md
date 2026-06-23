# Codex task — on-the-fly theme system for the noixzy generative lab

Paste this whole file to Codex as the task. It is self-contained; Codex has no access to
prior chat. Read `~/noixzy_generative_lab/workspace/HANDOFF.md` first for context.

---

## Goal

Add a **global, live "theme" system** to the lab. A theme is a full **vibe bundle** — not just
colors — that re-skins a module instantly and **persists across all modules**, so switching the
theme in one piece carries to the whole lab.

A theme bundles:
- **palette** — `[[r,g,b] bg, [r,g,b] accent, [r,g,b] ink]` (the existing `pal` shape)
- **finish** — `{ contrast, vignette, grain, glow }` (the existing `look` params)
- **material** — `{ metallic, rough, sheen, opacity }`
- **bias** — `{ density }` optional default-density nudge

Applying a theme writes these into the live params `P`, marks the scene `dirty`, and re-renders.
Switching themes must work **on the fly** (no reload) and **persist** so every other module opens
on the same theme.

## Repo facts (do not break these)

- The 9 "engine" modules are **GENERATED** by `~/noixzy_generative_lab/build_lab.js`. **Edit the
  generator, then run `node build_lab.js`.** Do NOT hand-edit generated HTML — it gets overwritten.
- `grid_extrude` and `sdf_raymarch` are **hand-authored** — edit their HTML directly. Add the
  theme system to the **engine** first (so all 9 inherit), then replicate into these two.
- Modules are **self-contained** — CDN `<script>` only, open by double-click. No npm, no bundler,
  no build step beyond `node build_lab.js`. Keep it that way.
- p5 GLOBAL mode. **UI binds in `setup()`, never `DOMContentLoaded`** (that silently kills controls).
- Engine owns material/depth/frame/look/motion, the full-bleed canvas, the translucent panel,
  pins/reset, the 10-palette selector, and localStorage. `P` is the live params object.
- After building, **mirror changed files** to `~/Downloads/noixzy_generative_lab/` (same relative
  paths).

## Required approach

1. **Theme bank.** In the engine, define a `THEMES` array. **Seed it from the existing 10
   palettes** — wrap each palette with sensible default `finish` / `material` / `bias` values so
   themes ship immediately. Shape:
   ```
   { name, palette:[[bg],[accent],[ink]], finish:{contrast,vignette,grain,glow},
     material:{metallic,rough,sheen,opacity}, bias:{density} }
   ```
   Hand-tune the hero few (ember, teal, violet, steel, synth) toward a 3-value structure
   (dark ground / mid field / bright focal) so they open striking, not flat.

2. **Apply function.** Add `applyTheme(name)` in the engine that writes the theme's palette,
   finish, material, and bias into `P`, sets `dirty = true`, and re-renders. The existing
   per-module palette/material/look sliders must **stay live** afterward — a theme sets defaults;
   the user can still deviate without "leaving" the theme. Re-picking a theme re-applies the bundle.

3. **Global picker + persistence.** Add to the panel (in `setup()`):
   - a **theme dropdown** (lists `THEMES` by name), and
   - **keyboard cycle**: `[` previous theme, `]` next theme.
   On any change, store the active theme name in `localStorage` under **one shared key**
   `noixzy_lab_theme`. On module load, read that key and `applyTheme(...)` it (fallback to the
   first theme if unset). This is what makes the theme **global** — every module reads the same key.

4. **Optional crossfade (nice-to-have).** On theme change, lerp the old scene buffer → new buffer
   opacity over ~250–300ms for a smooth on-the-fly swap. Skip if it risks the frame budget.

5. **Replicate into the flagships.** Wire the same `THEMES` / `applyTheme` / dropdown / `[`,`]` /
   shared-localStorage behavior into `grid_extrude` and `sdf_raymarch`, mapping the bundle onto
   their own param names where they differ.

## Performance

- Applying a theme is a one-shot `dirty` re-render — not a per-frame cost. Don't add per-frame work.
- The crossfade (if used) is the only animated part; cap it at the fixed duration and stop.

## Acceptance criteria

- A theme **dropdown** and **`[` / `]`** cycle switch the whole look **live, no reload** —
  palette, finish, and material all update together.
- The active theme **persists across modules** via `localStorage['noixzy_lab_theme']`: switch it in
  one module, open another, it's already themed.
- After applying a theme, the existing per-module **palette / material / look / depth** sliders,
  **pins, reset, save png, symmetry, motion** all still work and don't regress.
- `node build_lab.js` regenerates cleanly; both flagships behave the same.
- No console errors. Controls bound (test: "new seed" still changes the on-canvas seed).
- Changed files mirrored to `~/Downloads/noixzy_generative_lab/`.

## How to verify

Start a static server (`python3 -m http.server`), open a module from
`~/Downloads/noixzy_generative_lab/<id>/noixzy_<id>.html`, cycle themes with `[` / `]` and the
dropdown, confirm the whole look changes live. Open a **second, different** module — confirm it
loads on the same theme. Tweak a palette/material slider afterward and confirm it still responds.
Check the console is clean.

## Out of scope

Don't touch the volumetric-extrude work, the Blender projects, or the gallery layout. Don't add
new modules or new dependencies. Keep everything self-contained (no build step beyond
`node build_lab.js`). Author credit in any new file headers: **Chris Tucker** only.
