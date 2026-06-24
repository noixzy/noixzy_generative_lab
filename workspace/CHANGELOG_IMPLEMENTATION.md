
---

## 2026-06-24 — Reaction diffusion checkpoint

Status: approved for now.

Final notes:
- Reaction diffusion flat defaults are now preferred for current use.
- Reaction diffusion now animates the form itself instead of relying on 2D frame drift/rotation.
- Extrusion remains animated when height mode is active.
- Extrusion now samples an inset version of the reaction field so the outer border is less dominant as geometry.
- Added `extrude → size` control for reaction diffusion.
- `size` range was expanded to make the effect noticeable.
- Current extrusion look is accepted for now, but may need a future design pass once the desired behavior is easier to articulate.

Current preferred reaction diffusion defaults:
- feed: `0.03`
- kill: `0.51`
- seed spots: `0.30`
- palette: graphite / `4`

Do not keep tweaking this module casually. Move on unless a specific problem appears.

---

## 2026-06-24 — Grid extrude checkpoint

Status: approved.

Changed:
- `grid_extrude/noixzy_grid_extrude.html`
- `gallery/thumbs/grid_extrude.png`

Approved default values:
- depth: `0.88`
- threshold: `0.63`
- jitter: `0.15`
- density: `0.60`
- palette: `4`
- height: `0.45`
- variation: `0.60`
- light: `0.50`
- displace: `0.00`

Thumbnail workflow:
- Browser saves/downloads stay in Downloads.
- Terminal copies the approved image into `gallery/thumbs/grid_extrude.png`.
- No browser download-setting changes.

---

## 2026-06-24 — Gyroid Phase 2 camera controls

Status: camera controls added and verified.

Changed:
- `gyroid/noixzy_gyroid.html`

Added:
- `distance` camera control
- `elevation` camera control

Notes:
- `gyroid` uses a custom UI, not the shared generated parameter registry.
- Shader uniforms added: `u_dist`, `u_elev`
- UI sliders added between `spin` and `ao`
- Sync arrays updated so `dist`, `elev`, and `ao` map to the correct controls.
- Refresh/reload acts as reset for this module because it has no reset button.

Default target:
- distance: `4.80`
- elevation: `0.90`
- ao: `0.60`

## 2026-06-24 — displacement_primitives branch stable

- Created `displacement_primitives` as a safe branch from the working displacement module.
- Left original `displacement/noixzy_displacement.html` untouched.
- Added primitive type dropdown UI.
- Primitive options now include:
  - sphere
  - box
  - rounded box
  - torus
  - capsule
  - cylinder
  - pyramid
  - flat plane
- Confirmed branch loads from gallery.
- Confirmed primitive selector is a dropdown, not a slider.
- Confirmed pyramid and flat plane are working.
- Current thumbnail exists at `gallery/thumbs/displacement_primitives.png`.
- Status: approved / stable enough to continue Phase 2 order.

Next: resume Claude Phase 2 order with `mandelbulb`.

## 2026-06-24 — mandelbulb Phase 2 camera controls stable

- Added Phase 2 camera controls to `mandelbulb/noixzy_mandelbulb.html`.
- Added UI sliders:
  - distance
  - elevation
- Added shader uniforms:
  - `u_dist`
  - `u_elev`
- Replaced fixed camera distance/elevation with uniform-driven camera controls.
- Fixed UI sync arrays so distance/elevation labels update correctly.
- Fixed `P` object defaults:
  - `dist: 0.52`
  - `elev: 0.50`
- Confirmed Mandelbulb renders again.
- Confirmed controls work from localhost.
- Status: approved / stable.

Next: Phase 2 camera controls for `fold`.

## 2026-06-24 — fold Phase 2 camera + internal morph stable

- Added Phase 2 camera controls to `fold/noixzy_fold.html`.
- Added distance and elevation controls with uniforms:
  - `u_dist`
  - `u_elev`
- Fixed Fold camera behavior:
  - camera now stays locked toward origin
  - object spins in object space instead of orbiting the camera
- Re-centered Fold target at origin.
- Split motion roles:
  - `twist` controls whole-form orientation
  - `morph amount` controls internal morph intensity
  - `inner rotate` controls signed recursive/internal rotation
  - `inner shift` controls signed internal location offset
- Repurposed `zoom` UI label to `lens`.
- Corrected camera/lens behavior:
  - `distance` controls camera distance
  - `lens` controls projection/framing only
- Added intentional Phase 2 values to Fold starter presets.
- Status: approved / stable.

Next: Phase 2 camera controls for `sdf_raymarch`.

## 2026-06-24 — sdf_raymarch Phase 2 camera controls stable

- Added Phase 2 camera controls to `sdf_raymarch/noixzy_sdf_raymarch.html`.
- Added UI sliders:
  - distance
  - elevation
- Added shader uniforms:
  - `u_dist`
  - `u_elev`
- Preserved existing indexed `P[]` architecture.
- Extended `P` defaults with:
  - `P[10]` distance = `0.55`
  - `P[11]` elevation = `0.44`
- Added camera controls to `P_CONTROLS`.
- Added distance/elevation to lockable controls.
- Updated raymarch camera:
  - camera still orbits around blob centroid
  - distance and elevation are user-controlled
  - target remains centered on `u_target`
- Confirmed distance/elevation work.
- Confirmed spin still orbits smoothly.
- Confirmed randomize unlocked does not blank.
- Status: approved / stable.

Phase 2 camera-control order complete:
- gyroid
- displacement
- mandelbulb
- fold
- sdf_raymarch


## 2026-06-24 — truchet_b duplicate speed key fixed

- Fixed duplicate `speed` key in `build_lab.js` for `truchet_b`.
- Removed module-local `speed` from `truchet_b.system`.
- Preserved shared `speed` from SHARED controls.
- Rebuilt generated modules with `node build_lab.js`.
- Confirmed `truchet_b` now has one speed slider in the motion panel.
- Status: approved / stable.
