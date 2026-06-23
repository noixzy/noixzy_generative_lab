# noixzy generative lab — session bridge (cross-LLM continuity)

_Read this to pick up the build mid-stream. Tool-agnostic: written so ChatGPT, Codex, a fresh
Claude session, or any LLM can resume without prior chat context._
_Last updated: 2026-06-23._

---

## What this file is

A **rolling continuity log + current focus**, separate from the static project docs:

| File | Role |
|---|---|
| `HANDOFF.md` | project truth — architecture, modules, how to run. **Read first.** |
| `CODEX_QUEUE.md` | ordered task queue (volumetric extrude → PBR → loop → batch → SVG → defaults → audio). |
| `CODEX_TASK_volumetric_extrude.md` | full spec for Task 1. |
| `OVERVIEW.md` / `FUTURE_INSTALLMENTS.md` | plain-English tour + idea menu. |
| `IDEAS_module_expansion.md` | **new** — 32 new-module ideas, per-module tuning, house-look recipe, capability upgrades. |
| **this file** | rolling state: what changed, what's next, how to resume, decisions log. |

**Resume order for any LLM:** `HANDOFF.md` → this file → `CODEX_QUEUE.md` → the relevant `CODEX_TASK_*.md`.

---

## Hard architecture facts (do not break)

- 9 "engine" modules are **GENERATED** by `build_lab.js`. **Edit the generator, then run `node build_lab.js`.** Never hand-edit generated HTML — it gets overwritten.
- `grid_extrude` and `sdf_raymarch` are **hand-authored** — edit their HTML directly. Shared features go in the engine first, then replicate into these two.
- Modules are **self-contained** — CDN `<script>` only, open by double-click. No npm, no bundler, no build step beyond `node build_lab.js`.
- p5 GLOBAL mode. **UI binds in `setup()`, never `DOMContentLoaded`** (that silently kills controls).
- Each module supplies `build()` (state from seed) + `render(g,pal)` (draw into a p5.Graphics buffer). Engine owns material/depth/frame/look/motion, full-bleed canvas, translucent panel, pins/reset/palettes, localStorage.
- `pal` = `[[r,g,b] bg, [r,g,b] accent, [r,g,b] ink]`. `P` = live params object.
- **Verify in a real browser** before declaring done: `python3 -m http.server`, load, reload, confirm renders + controls respond + clean console. A clean parse is not proof.
- After any change, **mirror touched files** into `~/Downloads/noixzy_generative_lab/` (same relative paths). Refresh thumbnails with `node contact_sheet.js`.
- Work **additively** — don't regress existing params, pins, reset, palettes, save png, full-bleed translucent UI.

## Where things live

- Source of truth: `~/noixzy_generative_lab/`
- Use copy (mirror): `~/Downloads/noixzy_generative_lab/`
- Gallery: `<lab>/gallery/index.html` · thumbs: `<lab>/gallery/thumbs/*.png`
- Generator: `<lab>/build_lab.js` · thumbnails: `<lab>/contact_sheet.js`
- Blender finals → SSD: `/Volumes/noixzy T5 EVO SSD/ASSET LIBRARY/______newDemo Renders`

---

## Current state (2026-06-23)

- ✅ 11 modules, full-bleed, full control set, 10 palettes, pins/reset/PNG export.
- ✅ Lab→Blender pipeline proven (displacement, scatter, metaballs).
- ✅ Ideas expansion authored (`IDEAS_module_expansion.md`).
- ⏳ Codex Task 1 (true volumetric extrude) specced, not yet built — **next in queue.**
- 🆕 **On-the-fly theme system** requested this session — spec below, not yet built.

### Decisions / conventions in force
- Script/add-on author credit: **"Chris Tucker" only.**
- noixzy is **always lowercase**; art-first production language, not "tech-in-a-cinematic-room."
- House-look direction (from `IDEAS_module_expansion.md`): enforce a 3-value structure (dark ground / mid field / bright focal), bias defaults toward open negative space, restrained 2-hue-plus-neutral palettes, light grain by default.

---

## 🆕 Feature spec — on-the-fly theme system

**Intent (tuck):** switch the *whole lab's* look live, not just per-module palette. A "theme" is a full vibe bundle, applied globally, swappable on the fly.

**Theme = more than a palette.** Each theme bundles:
```
{
  name:    "ember storm",
  palette: [[bg],[accent],[ink]],          // the existing pal shape
  finish:  { contrast, vignette, grain, glow },
  material:{ metallic, rough, sheen, opacity },
  bias:    { density }                      // optional default density nudge
}
```

**Behavior:**
- A `THEMES` array lives in the **engine** (so all 9 generated modules inherit) + replicated into `grid_extrude` and `sdf_raymarch`.
- Global picker: a dropdown in the panel **plus** keyboard cycle (`[` / `]`). Applying a theme writes its values into `P` (palette + finish + material + bias), marks `dirty`, re-renders.
- **Cross-module persistence:** store the active theme name in `localStorage` under one shared key (e.g. `noixzy_lab_theme`). Every module reads it on load, so switching the theme in one module re-skins the whole lab next time each opens. (This is the "global on the fly" part.)
- **Override still allowed:** the existing per-module palette/material/look sliders remain live; a theme sets defaults, the user can still deviate without leaving the theme. Picking a new theme re-applies the bundle.
- **Optional crossfade:** on theme change, lerp the old scene buffer → new buffer opacity over ~250–300ms for a smooth on-the-fly swap (nice-to-have, not required).

**Seed the theme bank from the 10 existing palettes** — wrap each palette with sensible finish/material defaults so themes ship day one, then hand-tune the hero few (ember, teal, violet, steel, synth) toward the house-look 3-value rule.

**Acceptance:**
- Dropdown + `[`/`]` switch the whole look live, no reload; change persists across modules via localStorage.
- Palette, finish, material all update together; per-module sliders still work afterward.
- `node build_lab.js` regenerates cleanly; files mirrored to `~/Downloads/...`; no console errors.

**Where it sits in priority:** complements the **house-look pass** (PART 3 of the ideas doc) — build the theme bundle structure and the house-look defaults together; they're the same surface. Sequence-wise, fine to do alongside or right after Codex Task 6 (strong default looks), since both touch engine defaults.

---

## How to pick the next task (for the resuming LLM)

1. If `CODEX_QUEUE.md` has an unfinished top task → do that (currently Task 1, volumetric extrude). Tasks are ordered; Task 1 leaves `sampleField`/`renderHeightfield` that Tasks 2 & 5 reuse — **do it first.**
2. Otherwise pull from `IDEAS_module_expansion.md` PART 6 ("if you only do five things") or whatever tuck has starred.
3. Theme system + house-look pass can be picked up independently anytime — full spec above.
4. New modules: follow the existing engine pattern (`build()` + `render(g,pal)`), add to `build_lab.js`, regenerate. Each new module's 4 unique controls go in the `system` group.

## Rules of engagement (every task)
- Don't start a task you can't finish; stop after whatever is fully built **and browser-verified**.
- Shared features → engine first, then replicate into the two flagships.
- Keep it self-contained; mirror to `~/Downloads/...`; refresh thumbnails if visuals changed.
- Don't regress existing params/pins/reset/palettes/UI.

---

## Session log (append newest at top)

- **2026-06-23** — Merged `CODEX_TASK_widen_param_ranges.md` into `CODEX_TASK_ranges_and_gradients.md`; archived the original in `_archive_doc_merge_20260623_020226/`. Codex/Claude should treat `CODEX_TASK_ranges_and_gradients.md` as the single live task spec for ranges, gradients, and parameter span tuning.
- **2026-06-23** — Authored `IDEAS_module_expansion.md` (32 new modules, per-module tuning, house-look recipe, capability upgrades, top-5). Captured on-the-fly **theme system** request + spec (above). No code shipped yet; Codex Task 1 still next in queue.
- _(earlier sessions: see `HANDOFF.md` for the built-out state of the 11 modules + Blender pipeline.)_

> 🔴 Next session: append a dated entry here with what you built + verified, so the chain stays unbroken.
