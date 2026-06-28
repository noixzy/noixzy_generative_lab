

---

# Source file extraction

## workspace/IDEAS_module_expansion.md

# noixzy generative lab — module expansion + enhancement ideas

_A long menu. Skim, annotate, mark keepers. Nothing here is committed._
_Built on top of OVERVIEW / HANDOFF / FUTURE_INSTALLMENTS — this goes broader and deeper, and tries not to repeat what you already have queued._

---

## How to read this

- **PART 1** — new module systems (30+, grouped by family). Each has: what it is · the 4 system sliders it'd expose · why it's noixzy · the pipeline hook.
- **PART 2** — make the existing 11 hit harder (per-module default + enhancement notes).
- **PART 3** — the noixzy house look (one shared finishing recipe so the whole set reads as authored).
- **PART 4** — cross-cutting capability upgrades (presets, format, export, audio, bridge).
- **PART 5** — composition + color craft to bake into every default.
- **PART 6** — if you only do five things.

Already on your menu (so I'm not re-pitching them): differential growth, physarum/slime, strange attractors, WFC, delaunay, marble/fluid, streamline ribbons, voronoi shatter. All strong — keep them.

---

# PART 1 — New module systems

Each fits the existing engine pattern: `build()` computes state from seed, `render(g,pal)` draws it, the shared engine handles material/depth/frame/look/motion. The "4 sliders" are the module's unique `system` controls.

## A. Organic growth & accretion

**1. Diffusion-Limited Aggregation (DLA)**
Random walkers stick on contact → dendritic frost / coral / lightning / neural webs.
Sliders: stickiness · walker count · seed shape (point/line/ring) · branch thickness.
noixzy: frost-on-black-glass, brain coral, root systems. Reads as decay or growth depending on palette.
Pipeline: skeleton → Blender curve/wire; or rasterize → height/displacement.

**2. Phyllotaxis / golden-angle packing**
Seed-head spirals, scales, dotted sunflower fields.
Sliders: divergence angle (≈137.5° ± drift) · dot scale falloff · count · ring warp.
noixzy: hypnotic, mandala-adjacent, loops cleanly with a slow angle drift.
Pipeline: point set → scatter / instance-on-points.

**3. Superformula supershapes**
One parametric equation makes petals, shells, stars, sea creatures. The 4 supershape params (m, n1, n2, n3) map *perfectly* onto 4 sliders.
Sliders: m (symmetry) · n1 · n2 · n3 · (+ stack count for nested forms).
noixzy: alien botany, sigils, emblem shapes for release art.
Pipeline: clean SVG/curve → Blender solidify.

**4. Eden / percolation growth**
A colony spreads cell-by-cell → lichen, mold, spreading stain.
Sliders: spread probability · anisotropy (directional bias) · seed count · edge roughness.
noixzy: contamination, slow-creep textures, "the hollow core" spreading.

**5. Lenia (continuous cellular life)**
Smooth, continuous-domain CA that produces drifting *organisms* (gliders, rotators).
Sliders: kernel radius · growth center · growth width · timestep.
noixzy: living, otherworldly, motion-native. This is a showpiece module.
Pipeline: record the motion → music-visual loop.

**6. Crystalline / Penrose / quasicrystal tiling**
Aperiodic structure with 5/7/9-fold symmetry.
Sliders: symmetry order · wave/tile count · phase · contrast.
noixzy: structured shimmer, ritual geometry. SVG-friendly.

## B. Simulation & agents

**7. Boids / murmuration**
Flocking clouds — cohesion/separation/alignment emergent motion.
Sliders: cohesion · separation · alignment · agent count.
noixzy: starling murmurations = pure atmosphere. Motion-native, audio-reactive-friendly.
Pipeline: per-frame point cloud → Blender (Alembic) if you want it in 3D.

**8. Falling sand / cellular physics**
Sand, water, fire, smoke as interacting cells.
Sliders: material mix · gravity · viscosity/flow · emit rate.
noixzy: tactile, playful, satisfying loops.

**9. Chladni / cymatics plates** ⭐ audio-native
Particles settle on the nodal lines of a vibrating plate — *a real frequency literally shapes the pattern.*
Sliders: mode m · mode n · damping · particle count.
noixzy: the cleanest music-visual concept in the whole lab — feed it the track's pitch and the geometry *is* the sound.
Pipeline: settled points → scatter; the curves → displacement.

**10. Ripple tank / wave interference** ⭐ audio-native
Multiple wave sources interfere into shifting moiré.
Sliders: source count · wavelength · damping · drive frequency.
noixzy: water-surface caustics, sonar, signal. Drive freq from audio.

**11. Cyclic CA / rock-paper-scissors**
Self-organizing spiral waves emerge from noise — no design needed.
Sliders: state count · win threshold · neighborhood radius · init noise.
noixzy: BZ-reaction spirals, hypnotic, perfect seamless loops.

**12. Gray-Scott preset bank** (extends your reaction_diffusion)
Not a new system — a *curated feed/kill preset switch*: mitosis, coral, fingerprint, worms, holes, solitons, U-skate. One dropdown unlocks 8 distinct looks from the module you already have.

## C. Mathematical / structured

**13. Strange attractors (proper module)**
Clifford / De Jong / Thomas / Aizawa — millions of points, long-exposure glow.
Sliders: attractor type (preset switch) · a · b · (+ exposure/glow).
noixzy: vast glowing dust, cosmic. Stills + slow loops.
Pipeline: point cloud → Blender.

**14. Apollonian / circle packing**
Nested tangent circles filling a boundary.
Sliders: recursion depth · min radius · jitter · fill mode (outline/solid/ring).
noixzy: clean, architectural, bubble fields. SVG gold.

**15. Fourier epicycles**
Chains of rotating circles trace any path/glyph.
Sliders: harmonic count · speed · path source · trail decay.
noixzy: mesmerizing motion, can draw the noixzy mark or any sigil. Great loop.

**16. Space-filling curves (Hilbert / Peano / Gosper)**
A single continuous line that fills the plane.
Sliders: order · line weight · warp · color-along-length.
noixzy: minimal, obsessive, plotter/SVG-native.

**17. Hitomezashi / sashiko stitch**
Japanese stitching grids generated from two binary seeds.
Sliders: density · stitch length · offset · palette.
noixzy: textile, restrained, hand-made feel. SVG export.

**18. Moiré / interference grids**
Overlaid rotated line grids → emergent interference.
Sliders: line pitch · rotation delta · layer count · warp.
noixzy: op-art, vibration, tension. Audio can drive the rotation delta.

**19. Truchet 3D / Wang tiles** (extends your truchet)
3D tube/arc-extruded Truchet, plus multi-tile Wang sets for richer non-repeating texture.
Sliders: tile set · arc radius · tube thickness · scale variation.

## D. Image-driven (drop an image in)

**20. Stipple / Voronoi portrait**
Relax points toward an image's tones → dotted portrait.
Sliders: dot count · size range · relax iterations · invert.
noixzy: run your own stills / the anchor through it. Restrained, gallery-feel.

**21. Flow field on image gradient**
Particles follow the *edges* of a dropped image → painterly rendering of your own frames.
Sliders: particle count · step length · follow strength · fade.
noixzy: turn a Higgsfield still into a flowing ink study.

**22. Pixel sort / databend** ⭐ very noixzy
Sort pixels by luminance in bands → the classic glitch smear.
Sliders: low threshold · high threshold · direction · band length.
noixzy: this is core noixzy visual language. Apply to renders or other modules' output.

**23. ASCII / glyph mosaic**
Rebuild an image from characters or a custom glyph set.
Sliders: glyph set · cell size · contrast · color mode (mono/source).

**24. Halftone / dither engine** ⭐ ties to theSauceCode
CMYK dots, ordered (Bayer) dither, error diffusion (Floyd–Steinberg), blue-noise.
Sliders: dot pitch · screen angle · pattern type · level count.
noixzy: print texture, risograph, the theSauceCode dither lineage in the browser.

## E. Signal / glitch / degradation (apply as a layer over anything)

**25. CRT / VHS degrade**
Scanlines, chroma bleed, tracking error, bloom, roll.
Sliders: scanline density · chroma shift · noise · tracking/roll.
noixzy: instant period texture. Make it a *post layer* usable over every module, not just standalone.

**26. Video-feedback simulation**
Zoom + rotate + hue-shift recursion → infinite tunnels.
Sliders: zoom · rotate · hue cycle · decay.
noixzy: trippy, endless loops, no input needed.

**27. Datamosh / displacement smear**
Directional pixel smear driven by an underlying field.
Sliders: smear length · angle field · threshold · decay.

**28. Glitch block / slice**
RGB channel split, block displacement, fake-JPEG artifacting.
Sliders: block size · displace amount · channel split · event frequency.

## F. Spectral / audio sculpture

**29. Spectrogram terrain** ⭐
Render a track's spectrogram as a 3D ridge/terrain.
Sliders: time window · frequency scale (lin/log) · height · smoothing.
noixzy: literally turns a song into landscape → straight into Blender as a heightfield. The most direct "song becomes object" tool you could build.

**30. Waveform ribbon**
The track's waveform as a flowing, twisting 3D ribbon.
Sliders: amplitude · twist · thickness · segment count.

**31. Magnetic / dipole field lines**
Field lines flowing between charges.
Sliders: charge count · field strength · line density · curl.
noixzy: invisible-force visualization, elegant, plotter-friendly.

**32. Chromatic interference / thin-film**
Oil-slick / soap-bubble iridescence from thin-film math.
Sliders: film thickness · angle spread · noise warp · saturation.
noixzy: luxe iridescent gradients for release-art backdrops.

---

# PART 2 — Make the existing 11 hit harder

Most of these are *default-value* and small-feature changes, not rewrites. Goal: each module opens on something gallery-worthy.

**grid_extrude** — drive per-cell height from a coherent noise field (not pure random) so you get readable ridges/canyons/dunes instead of static. Add emissive top edges, AO in the valleys, and a 3-preset triad (city / canyon / dune).

**sdf_raymarch** — add a soft core glow inside blobs, soft shadows, a faint floor reflection, and a chromatic edge fringe. Tie a slow "breathing" scale to the loop period so the still feels alive.

**flow_field** — variable line weight by particle speed, additive blending for glow, longer trails with fade-to-black, an optional curl-noise field, and spawn from frame edges (not uniform) so the center stays open.

**reaction_diffusion** — ship the Gray-Scott preset bank (#12), color by B-concentration through a duotone ramp, add subtle bloom on high-B, and let it iterate longer before freezing so the structure gets finer.

**voronoi** — Lloyd-relax the cells for organic evenness, add a grout/gap width slider, bevel/inset per cell, height-by-area for the volumetric pass, and sample palette per cell instead of one flat fill.

**contour_field** — quantize into terraces, draw thick *index* lines every Nth, hill-shade the fill between lines, and tint by elevation (cool low → warm high). This is the one that most wants the volumetric pass.

**truchet** — arc weight variation, multi-scale tiles (big tiles with nested small ones), a curved-vs-diagonal tile-set switch, gradient-along-path, and SVG export.

**l_system** — leaf/flower terminals, trunk→tip thickness taper, depth-fade on background branches, gentle wind sway in motion, and a few named "species" presets.

**cellular_erosion** — push edge-distance contrast harder, add a rim light on edges and a pitting-noise overlay so it reads as corroded rock/metal when material is tuned metallic+rough.

**recursive_grid** — bias splits toward golden ratio, give occasional "feature cells" a pattern fill, weight line thickness by depth, and add three presets: Mondrian / blueprint / circuit.

**sdf (flat)** — contour-band the interior, duotone it, add a soft inner glow, and merge it into the same volumetric dome pass as the raymarch where it makes sense.

---

# PART 3 — The noixzy house look (shared finishing recipe)

The fastest way to make all 11 (and every new module) feel like one authored set: a single, opinionated default-finishing pass. Right now defaults read "flat." Give the engine these *default* look values and the whole gallery levels up at once.

**Value structure (the big one):** every default should land on three values — a dark ground (~10–15% luminance), a mid field, and a small bright focal (~85–95%). Most flat-looking generative art is mid-grey soup; enforcing this one rule fixes 80% of it.

**Suggested default finishing values** (tune to taste, echoing your theSauceCode baseline):
- contrast: high-ish (your sauce sits ~2.87–3.0 conceptually — start punchy, not neutral)
- vignette: subtle, ~0.2–0.3, to seat the focal
- grain: light, ~0.04–0.08 (never 0 for the "shot on something" feel; your sauce noise was 0, but for the lab a whisper of grain reads as authored)
- glow: gentle bloom on the brightest 10% only

**Palette discipline:** restrict each of the 10 palettes to a 3-value structure (bg / accent / ink) and resist a 4th hue. Two hues + one neutral beats five hues, every time. Add a "duotone" toggle that collapses any palette to two values for the most cohesive looks.

**Negative space by default:** field modules should *not* fill the frame at default. Bias the default density/threshold so ~30–50% of the canvas is open ground. Depth only reads against emptiness.

---

# PART 4 — Cross-cutting capability upgrades

Ranked roughly by payoff for *your* pipeline.

1. **Format / aspect presets** 🔴 — square, 16:9, 9:16, 4:5, with on-canvas safe-area guides. You're making music-visual verticals; building 9:16 in from the start saves re-cropping every still. Low effort, daily value.

2. **High-res / 4K still export** — render the scene buffer at 2×/4× on demand for print and hero stills, independent of window size.

3. **PNG metadata embed + "load from PNG"** — write seed+params into the PNG, and a button to recover the exact look from a dropped PNG. Never lose a good seed again.

4. **Variant grid (3×3 seeds)** — show 9 seeds of the current module at once; click one to keep and continue. This turns blind re-rolling into actual art direction.

5. **Param lock** — lock palette/material/frame while you re-roll *only* the system params (or vice versa). Essential for dialing a look without losing the parts you liked.

6. **Curated randomize** — "new seed" rolls *within tasteful ranges*, not the full slider span. Pure random gives mostly duds; constrained random gives mostly keepers.



---

## workspace/FUTURE_INSTALLMENTS.md

# noixzy generative lab — future installments

Ideas for where the lab can go next. Grouped by effort/type. Nothing here is committed —
it's a menu.

## A. Capabilities (cut across all modules)
1. **Audio-reactive mode** — Web Audio FFT from mic or a dropped track drives any params
   (density, height, glow, speed). The long-promised "music visuals" hook. One shared module,
   a few mappings per piece.
2. **Loop / MP4 export** — record one full motion (or orbit) cycle to a seamless video via
   `CCapture`/`MediaRecorder`. Turns every module into a deliverable visual clip.
3. **PBR export pack** — one click exports a tile set from the field pieces: height map +
   normal map (derived from height) + roughness/AO + alpha. Drops straight into Blender/
   Substance. Builds on the existing `make_displacement_map.js`.
4. **Batch / series render** — render N seeds (or a param sweep) to a folder for a look
   library; contact-sheet the results. Good for curating "keepers."
5. **Shared preset library** — promote the per-piece pin/favorites into a global library
   with named looks, importable across modules.
6. **Palette from image** — drop an image, extract a restrained palette, add it to the 10.

## B. New systems (new modules)
7. **Differential growth** — lines/loops that grow and avoid themselves → organic coral/brain
   networks. Very noixzy.
8. **Physarum / slime mold** — agent simulation that forms transport networks. Gorgeous,
   animated, audio-reactive-friendly.
9. **Strange attractors** — Clifford / De Jong / Lorenz point clouds; millions of points,
   long-exposure glow. Great stills + slow loops.
10. **Wave Function Collapse** — tile-based pattern synthesis; structured, architectural.
11. **Delaunay / triangulation** — point sets → triangulated mesh art; pairs with voronoi.
12. **Domain-warped marble / fluid** — layered curl-noise marbling; liquid metal / ink looks
    (ties to the Blender MarbledFlux/Pyroclast work).
13. **Streamline ribbons** — flow-field streamlines extruded into 3D ribbons (WebGL).
14. **Voronoi shatter / fracture** — crack and explode a plane; feeds Blender cell-fracture.

## C. Production glue (toward the bigger noixzy engine)
15. **Blender bridge** — module writes a small JSON (seed + params + sampled field/points);
    a Blender Python/Geo-Nodes script rebuilds the system natively in 3D. Closes the
    lab→Blender loop without manual PNG export.
16. **SVG export** for the vector pieces (truchet, contour, l_system) → plotter / laser /
    large-format print, and clean re-import into After Effects / Illustrator.
17. **Timeline / keyframe** — keyframe params over time for authored (non-random) motion;
    export the curve with the loop.
18. **Unified "engine" shell** — a single app that hosts all modules with a left rail
    switcher (the visual-engine direction), sharing the param framework.

## Strongest 3 to do first (recommendation)
- **Audio-reactive mode** (#1) — biggest creative payoff, directly serves music visuals.
- **PBR export pack** (#3) — turns the lab into a texture factory for Blender today.
- **Differential growth** (#7) — a genuinely new, high-impact visual system.
