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
