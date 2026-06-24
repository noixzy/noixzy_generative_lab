# noixzy generative lab — next modules & handoff guide

> Updated: 2026-06-24

---

## New modules to build

### Generated modules (via build_lab.js)

| Module | Description | Complexity |
|---|---|---|
| stipple | Pointillist density field — noise-driven dot sizes, pack circles by luminance | medium |
| wave interference | Two or more wave sources, additive interference patterns, moiré zones | easy |
| hex grid | Hexagonal tile field with noise-driven fill and extrude support | medium |
| rose curve | Parametric rhodonea curves, r = cos(k·θ), animated k morph | easy |
| reaction diffusion B | Gray-Scott with coral/spot feed-kill defaults, different init pattern | medium |
| lissajous mesh | A:B frequency ratio grid, parametric connections, pure math, no sim | easy |

### Hand-authored SDF flagships

| Module | Description | Complexity |
|---|---|---|
| torus knot | p,q torus knot SDF, animatable p/q morph between knot types | medium |
| menger sponge | Box-fold IFS (simpler and more reliable than Sierpinski), iconic form | medium |
| metafluid | Multiple smooth-min blended spheres, viscous animated merging | easy |
| klein bottle / genus-2 | Implicit surface, non-orientable, purely mathematical | hard |

---

## ChatGPT handoff guide

Paste this at the top of a new ChatGPT session after pasting `build_lab.js`:

```
Project: noixzy generative lab
Working dir: ~/Downloads/noixzy_generative_lab/
Canonical mirror: ~/noixzy_generative_lab/
Brief: workspace/CHATGPT_BRIEF.md
Prompt template: workspace/CHATGPT_PROMPT.md
Camera controls plan: workspace/CAMERA_CONTROLS_PLAN.md
Next modules: workspace/NEXT_MODULES.md

Current state (2026-06-24):
- 15 gallery modules total
- 9 generated via build_lab.js (NEVER hand-edit the HTML outputs)
- 6 hand-authored flagships: grid_extrude, sdf_raymarch, gyroid, displacement, mandelbulb, fold
- fold just received: zoom + feature size controls, stable camera target, improved raymarcher

Immediate next tasks (in priority order):
1. Phase 1 camera controls — add cx/cy pan to build_lab.js SHARED params (see CAMERA_CONTROLS_PLAN.md Phase 1)
2. Phase 2 camera controls — add u_dist + u_elev to each SDF flagship, starting with gyroid
3. Fix truchet_b duplicate speed key in build_lab.js (k:"speed" exists in both system array and SHARED)
4. Retake gallery thumbnails after fold fix (use workspace/thumbs.js or thumbs_retry.js)
5. New module: stipple (generated, build_lab.js only)
6. New module: torus knot (hand-authored SDF)

Rules that must never be broken:
- Never hand-edit generated HTML files — only build_lab.js, then node build_lab.js
- p5.js global mode — no new p5(...) instances
- UI binds in setup() only
- After every change, produce the complete updated file (not a diff)
- Mirror changes: cp <file> ~/noixzy_generative_lab/<file>
```
