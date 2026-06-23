# noixzy generative lab — what we've built (plain English)

_A readable tour of the project so far, plus where it could go. No code, no jargon._
_Last updated: 2026-06-23._

---

## The short version

You wanted a small, practical lab for making algorithmic art — things that can later
become Blender scenes, music visuals, stills, textures, or references. Not a big app, not a
new brand. Just a set of strong little visual machines you can play with and pull from.

That's what this is now: **a collection of self-contained art "modules."** Each one is a
single file you open by double-clicking. It draws a generative pattern, and a panel of
sliders lets you reshape it live. You can save a still, pin looks you like, and feed the
output into your 3D and video work.

Everything lives in two places:
- **The working copy:** `~/noixzy_generative_lab/`
- **Your copy to actually use:** `~/Downloads/noixzy_generative_lab/`

Open **`gallery/index.html`** to see them all as thumbnails and click into any one.

---

## What's in the lab

There are **11 modules**. Think of each as a different "engine" for a kind of pattern:

- **grid extrude** — 3D-looking blocks stacked in space. The most fully-featured one; it's
  the template the others are built from.
- **sdf raymarch** — smooth blobby metaballs that merge and orbit (the one you liked early on).
- **flow field** — thousands of particles drifting along invisible currents, leaving trails.
- **reaction diffusion** — organic spots and tendrils, like coral or animal markings.
- **voronoi** — a field of cells, like cracked earth or stained glass.
- **contour field** — topographic map lines rippling over noise.
- **truchet** — flowing curves made from flipped tiles; great as a repeating texture.
- **l-system** — branching, plant-like growth.
- **cellular erosion** — worn, eroded blobs; reads like rock or corrosion.
- **recursive grid** — a canvas split into nested rectangles; clean and architectural.
- **sdf field** — a flat, shaded version of the metaballs.

They all share one restrained look (a small set of moody palettes) so the whole set feels
like one family.

---

## What you can do with each one

Every module has the same set of controls, grouped so they're easy to scan:

- **system** — the controls unique to that pattern (density, scale, depth, etc.) plus a
  **palette** picker with 10 color schemes (ember, teal, violet, steel, acid green, rust,
  gold, synth, and more).
- **material** — how the surface reads: metallic, roughness, sheen, and opacity.
- **depth** — **extrude** (give the flat pattern 3D depth) and **displace** (warp it with a
  wave/noise ripple).
- **frame** — zoom, rotate, and symmetry (mirror into 2- or 4-fold kaleidoscopes).
- **look** — the finishing pass: contrast, vignette, film grain, and glow.
- **motion** — speed and drift, for turning a still into a gentle loop.

And the practical buttons: **new seed** (roll a fresh random version), **★ pin** (save a look
you like — they're remembered even after you close the file), **export ★** (copy your saved
looks to share or hand back to me), **reset**, **pause**, and **save png**. Press **`h`** to
hide the panel for a clean, full-screen view.

The preview fills the whole window now, with the panel floating semi-transparent on top.

---

## How it connects to your real work

This isn't art for its own sake — it's a feeder for production:

- **Textures & displacement:** the field patterns (reaction diffusion, erosion) export as
  grayscale maps that push real geometry around in Blender. We proved this end-to-end — a
  pattern made in the browser became actual 3D relief on a surface.
- **Scatter:** the voronoi cells can decide where thousands of objects land in a 3D scene.
- **3D forms:** the metaball blobs rebuild natively in Blender as real geometry.
- **Stills & loops:** save a frame, or (soon) record a motion loop for music visuals.

There are two Blender projects already set up from this:
`PROJ_LabToBlend_v01` (displacement + scatter demo) and `PROJ_SDFForm_v01` (the blob form).

---

## How it's built (just enough to understand it)

The 9 "field/pattern" modules are all **stamped out from one shared engine** — a single
recipe. That means when we add a feature (like the depth controls), every module gets it at
once, and there's only one place to fix things. The two flagships (grid extrude, sdf raymarch)
are hand-built because they're special. This is why the lab grew so fast without becoming a
mess.

A separate little script renders the **thumbnails** you see in the gallery.

---

## Where we are right now

- ✅ 11 working modules, all full-screen, all with the full control set.
- ✅ 10 color palettes, pin/save/reset, PNG export.
- ✅ extrude + displace on every module.
- ✅ A visual gallery with real preview thumbnails.
- ✅ Proven pipeline into Blender (displacement, scatter, metaballs).
- ✅ Handoff + task docs so another tool (or a fresh session) can keep building.

One honest limitation: on the modules that fill the whole frame, the current "extrude" is a
faked depth and reads as subtle. **True 3D depth on those is the next build** (it's written up
as a task for Codex to tackle while your credits reset).

---

## What's next / what's possible

A menu of directions — read over it and let ideas brew. Nothing here is decided.

### Make the existing modules deeper
- **True volumetric depth** on the field modules — real 3D terrain/columns instead of faked
  depth. (Already specced for Codex.)
- **Strong default looks** — tune each module so it opens on something gorgeous, not flat.
- **Per-module presets** — a few named looks baked into each (e.g. "ember storm," "ghost").

### Turn it into a production tool
- **Audio-reactive mode** — let a track or your mic drive the visuals. This is the big one
  for music visuals: bass pushes the depth, highs flare the glow, etc.
- **Loop / video export** — record one clean motion cycle to a video file you can drop into
  edits.
- **Texture/PBR export pack** — one click gives you height + normal + color maps for Blender,
  not just a flat image.
- **Batch render** — spit out 50 seeds of a module into a folder to build a look library.
- **SVG export** — get clean vector files from the line-based modules for print, plotter, or
  After Effects.
- **Blender bridge** — send a module's settings straight into Blender to rebuild it in 3D
  automatically, skipping the manual export.

### New pattern systems (new modules)
- **Differential growth** — organic, brain-coral-like networks that grow and avoid themselves.
- **Slime mold (physarum)** — agents that form living transport networks; beautiful in motion.
- **Strange attractors** — vast glowing point clouds from simple math.
- **Marbling / fluid** — liquid-metal and ink swirls.
- **Voronoi fracture** — shatter a surface; feeds Blender cell-fracture.
- **Triangulation / mesh art** — point sets woven into faceted meshes.

### The bigger picture
- A single **engine shell** that holds all modules with a switcher on the side — the start of
  a proper noixzy visual app, sharing the same controls everywhere.

---

## If you only do three things next
1. **Audio-reactive mode** — unlocks the music-visual use case you've been pointing at.
2. **Texture/PBR export** — turns the lab into a texture factory for Blender today.
3. **Differential growth** — adds a genuinely new, head-turning visual system.

Jot notes in the margins of this file (or just tell me) and we'll shape the next installment
around what excites you.
