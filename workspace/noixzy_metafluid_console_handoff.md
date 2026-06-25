# ChatGPT Self-Handoff — noixzy_generative_lab / Metafluid Console Prototype

## Current repo checkpoint

Repository: `noixzy/noixzy_generative_lab`

Current committed and pushed checkpoint:

```text
a51444e prototype unified console layout in metafluid
```

The final check showed no local commits waiting to push.

Local working path used in the previous chat:

```bash
/Users/noixzy.macbookpro/Downloads/noixzy_generative_lab
```

Live/local test paths used:

```text
https://noixzy.github.io/noixzy_generative_lab/gallery/
http://192.168.1.156:8010/gallery/
http://192.168.1.156:8010/metafluid/noixzy_metafluid.html
```

Server command from repo root:

```bash
cd /Users/noixzy.macbookpro/Downloads/noixzy_generative_lab
python3 -m http.server 8010
```

## What was completed

`metafluid/noixzy_metafluid.html` is now the reference/prototype for the unified lab module console and preview layout.

The module was committed and pushed after cleanup.

## Metafluid is the UI prototype

Treat `metafluid/noixzy_metafluid.html` as the reference implementation for the next phase. Do not assume this is the final reusable architecture yet. Preserve working behavior first, then translate carefully.

## Final Metafluid behavior

### Panel / console layout

The right-side panel is settings-focused. It should contain:

- Theme selector with left/right arrows.
- Starter selector with left/right arrows.
- Randomize controls.
- New seed control.
- Reset and pause.
- Local preset save/load/delete.
- Sliders, color controls, audio mapping/status.

Do not put utility/export/playback buttons back at the bottom of the parameter panel.

### Preview-owned utility bar

The preview window owns the output/utility controls in the bottom overlay.

Current intended utility row:

```text
★ pin | copy | paste | audio | export ★ | clear ★ | → thumb | video | duration | save png | save 2x
```

The video button was renamed from `rec` to `video`.

### Thumbnail rail

The left-side vertical module rail lives inside the preview area.

Final behavior:

- Current module thumbnail outline is white.
- Arrow-selected thumbnail uses the accent/cyan styling.
- `▲` / `▼` arrows only move/select/scroll through thumbnails.
- Arrows do not open links.
- Clicking a thumbnail opens that module.
- Rail click behavior was fixed so stage orbit/pointer capture does not block the rail.

Do not revert to arrows directly opening previous/next modules.

### Theme / starter separation

Theme and starter were rebuilt conceptually.

Final principle:

```text
theme = visual palette/color only
starter = form/motion only
```

Important:

- Theme changes should not black out the preview.
- Theme changes should not reset form/motion.
- Starter changes should not destroy the active theme.
- Do not reference undefined `THEMES`; the module uses `PALETTES`.
- `PALETTES` is the source for named theme colors.

### New seed

Metafluid now has a `new seed` control.

Final behavior:

- Seed number displays under the `new seed` button.
- Display should be just the number, not `seed 12345`.
- Seed is stored in `mfSeed`.
- Seed is sent to shader as `u_seed`.
- Shader uses seed to change blob phase/structure.
- Seed is included in `_mfState()`.
- Paste/apply state restores seed when present.
- `new seed` should change blob structure without touching theme or starter.

### Blob density

Metafluid blob density was doubled.

Final behavior:

- Blob slider max is `32`.
- Default count is `14`.
- Shader supports `p0` through `p31`.
- `u_count >= 32.0` activates the final blob.
- Starter counts were adjusted for denser defaults.

Expected starter counts after final patch:

```text
mercury: 16
lava lamp: 6
plasma: 12
bubble: 10
toxic: 16
```

## Important final browser checklist

Before using Metafluid as a source for the wider rollout, verify:

```text
new seed changes blob structure
blob slider reaches 32 and visibly adds density
theme changes do not black out
starter changes form/motion
rail arrows only move/select thumbs
thumbnail click opens module
save png works
save 2x works
video works
copy/paste state works
local preset save/load/delete works
```

## Git / terminal workflow preferences

For status/check commands, use this wrapper when practical:

```bash
{
  echo "=== CHECK ==="
  git status --short
} | tee /dev/tty | pbcopy
```

This prints the output and copies it to clipboard.

Do not wrap destructive commands like `rm`, `mv`, `git commit`, or `git push` inside the clipboard wrapper.

Avoid adding `open` or `code` commands by default.

## Generated vs hand-authored modules

Generated from `build_lab.js`:

```text
flow_field
reaction_diffusion
voronoi
contour_field
truchet
truchet_b
l_system
cellular_erosion
recursive_grid
sdf
wave_interference
stipple
```

Hand-authored/direct modules:

```text
grid_extrude
sdf_raymarch
gyroid
displacement
displacement_primitives
mandelbulb
fold
hex_grid
rose_curve
lissajous_mesh
torus_knot
metafluid
noixzy_lab_shell_v1.html
```

## Next phase

Translate the stabilized Metafluid console/rail system into the wider lab.

Suggested order:

1. Inspect `metafluid/noixzy_metafluid.html` as the working reference.
2. Audit `build_lab.js` and identify generated-module template sections that correspond to:
   - panel layout
   - preview utility overlay
   - thumbnail rail
   - save/copy/paste/video controls
   - reset/pause placement
   - theme/starter/randomize/new seed equivalents where applicable
3. Patch generated modules through `build_lab.js`, then run:

```bash
node build_lab.js
```

4. Verify generated modules in browser.
5. Commit generated-module rollout.
6. Patch hand-authored modules separately, one module family at a time.

## Do not do

Do not reintroduce:

- Utility/export buttons at the bottom of the parameter panel.
- Rail arrows that open links.
- Undefined `THEMES` references.
- Theme changes that reset form/motion.
- Starter changes that forcibly overwrite the selected theme.
- Big unverified batch rewrites across generated and hand-authored modules at the same time.
- Mythic/project-ideology naming or unnecessary branding language.

## Stable checkpoint to preserve

If anything breaks in the next chat, return to:

```text
a51444e prototype unified console layout in metafluid
```

That commit is the stable Metafluid prototype checkpoint.
