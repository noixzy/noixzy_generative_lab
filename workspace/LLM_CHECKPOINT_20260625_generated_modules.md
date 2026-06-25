# NOIXZY_GENERATIVE_LAB — LLM CHECKPOINT
Date: 2026-06-25
Project root: /Users/noixzy.macbookpro/Downloads/noixzy_generative_lab
Repo: noixzy/noixzy_generative_lab

## Current High-Level State

The hand-authored module UI pass is locked.

The generated-module expansion pass is also locked through 12 new generated modules.

Current active branch at time of checkpoint:
repair-generated-modules-radial-kaleido

Current clean commit on this branch:
47070b7 repair kaleidoscope field generated module

Recent relevant commits:
- 47070b7 repair kaleidoscope field generated module
- 04744d2 repair radial noise generated module
- da229d1 add batch04 generated modules
- 828ce5f add batch03 generated modules
- 789659c add batch02 generated modules
- 406bff9 add partial batch01 generated modules
- 3697f4e show sdf raymarch theme label
- 6623f5e standardize sdf raymarch ui typography
- c39f8db add ui handoff notes
- df730de remove obsolete module backup files
- 1241a4e standardize hand-authored module controls

Repo status was clean after the latest lock confirm.

## Critical Behavior Rules For Future LLMs

Do not restart from scratch.

Do not overwrite or redesign the locked hand-authored modules unless the user explicitly asks.

For terminal/status/check commands, prefer wrapping output like:

{ ... } | tee /dev/tty | pbcopy

Do not wrap destructive commands like rm/mv or long-running file operations unless only wrapping final verification output.

Use one focused operation at a time.

Label actions by environment: Terminal, Browser, VS Code, etc.

Do not auto-open Finder, Preview, or VS Code unless explicitly asked.

Do not commit backup files. Clean or avoid `.bak_*` files before lock, unless they are already tracked legacy repo content and the user explicitly wants to handle them later.

Preserve lowercase `noixzy`.

For UI fixes, modify actual container layout/CSS/DOM behavior. Do not make vague visual-only guesses.

Audio controls/features exist across modules but are unverified backlog. Do not get hung up on audio unless the user explicitly chooses audio work.

## Locked Hand-Authored UI Reference

The locked hand-authored modules define the visual UI language.

Do not wholesale copy `grid_extrude`; use it only as a visual/behavior reference.

Locked hand-authored-style modules to avoid touching during generated-module work:
- grid_extrude
- sdf_raymarch
- gyroid
- displacement
- displacement_primitives
- mandelbulb
- fold
- metafluid
- hex_grid
- rose_curve
- lissajous_mesh
- torus_knot

The standard UI language includes:
- top-right parameter/control panel
- title/theme label/theme controls
- randomize buttons/new seed/reset/pause/presets/groups
- bottom toolbar with pin/export/copy/paste/audio/clear/thumb/video/duration/save png/save 2x
- favorites chips above toolbar
- button label should say `video`, not `rec`

## Generated Module Pattern

Generated modules are controlled by `build_lab.js`.

Running:

node build_lab.js

regenerates all generated module HTML files. This is expected.

It rewrites generated files such as:
- cellular_erosion
- contour_field
- flow_field
- l_system
- reaction_diffusion
- recursive_grid
- sdf
- stipple
- truchet
- truchet_b
- voronoi
- wave_interference
- all newly added generated modules

This is acceptable as long as hand-authored module status stays empty.

Stable generated UI group list should remain:

const GROUPS=["system","extrude","material","frame","look","motion"];

Avoid adding a `form` group unless there is a very deliberate reason. The earlier `form` group attempts caused UI vanishing problems.

## New Generated Modules Locked

The project now has 12 new generated modules:

1. moire_field
2. particle_orbitals
3. radial_noise
4. kaleidoscope_field
5. topographic_rings
6. ribbon_flow
7. glyph_field
8. crystal_growth
9. vector_scope
10. wave_lattice
11. fractal_tiles
12. plasma_membrane

Each has:
- module HTML file
- gallery card entry
- thumbnail PNG
- generated UI groups only
- z depth control
- extrude controls
- `heightField(G)` support

## Batch History

### Batch 01 Partial
Branch:
batch01-new-modules-moire-radial-orbitals

Commit:
406bff9 add partial batch01 generated modules

Locked modules:
- moire_field
- particle_orbitals

Notes:
- radial_noise initially failed/vanished and was removed.
- kaleidoscope_field was tried as a replacement and also failed/vanished.
- Both were later repaired successfully on a separate repair branch.

### Batch 02
Branch:
batch02-generated-modules-topo-ribbon-glyph

Commit:
789659c add batch02 generated modules

Locked modules:
- topographic_rings
- ribbon_flow
- glyph_field

### Batch 03
Branch:
batch03-generated-modules-crystal-vector-wave

Commit:
828ce5f add batch03 generated modules

Locked modules:
- crystal_growth
- vector_scope
- wave_lattice

Notes:
- wave_lattice default brightness was patched brighter before lock.

### Batch 04
Branch:
batch04-generated-modules-fractal-plasma

Commit:
da229d1 add batch04 generated modules

Locked modules:
- fractal_tiles
- plasma_membrane

This locked the 10-module milestone.

### Repair Branch
Branch:
repair-generated-modules-radial-kaleido

Commits:
- 04744d2 repair radial noise generated module
- 47070b7 repair kaleidoscope field generated module

Locked repaired modules:
- radial_noise
- kaleidoscope_field

Repair strategy that worked:
- one module at a time
- no form group
- no pinned/manual control hacks
- stable generated UI group list only
- test before commit
- save thumbnail before commit

## Current Module Files Added

Expected live module files:

moire_field/noixzy_moire_field.html
particle_orbitals/noixzy_particle_orbitals.html
radial_noise/noixzy_radial_noise.html
kaleidoscope_field/noixzy_kaleidoscope_field.html
topographic_rings/noixzy_topographic_rings.html
ribbon_flow/noixzy_ribbon_flow.html
glyph_field/noixzy_glyph_field.html
crystal_growth/noixzy_crystal_growth.html
vector_scope/noixzy_vector_scope.html
wave_lattice/noixzy_wave_lattice.html
fractal_tiles/noixzy_fractal_tiles.html
plasma_membrane/noixzy_plasma_membrane.html

Expected live thumbnails:

gallery/thumbs/moire_field.png
gallery/thumbs/particle_orbitals.png
gallery/thumbs/radial_noise.png
gallery/thumbs/kaleidoscope_field.png
gallery/thumbs/topographic_rings.png
gallery/thumbs/ribbon_flow.png
gallery/thumbs/glyph_field.png
gallery/thumbs/crystal_growth.png
gallery/thumbs/vector_scope.png
gallery/thumbs/wave_lattice.png
gallery/thumbs/fractal_tiles.png
gallery/thumbs/plasma_membrane.png

Expected gallery/build refs:
- `build_lab.js` includes all 12 modules in ALL_MODULES/nav and PIECES.
- `gallery/index.html` includes all 12 gallery cards.

## Verification Commands

Use this after branch changes or merges:

cd /Users/noixzy.macbookpro/Downloads/noixzy_generative_lab

{
  echo "=== GENERATED MODULE CHECKPOINT VERIFY ==="
  date
  echo
  echo "=== BRANCH ==="
  git branch --show-current
  echo
  echo "=== STATUS ==="
  git status --short
  echo
  echo "=== RECENT COMMITS ==="
  git log --oneline -12
  echo
  echo "=== NEW MODULE FILES ==="
  ls -la \
    moire_field/noixzy_moire_field.html \
    particle_orbitals/noixzy_particle_orbitals.html \
    radial_noise/noixzy_radial_noise.html \
    kaleidoscope_field/noixzy_kaleidoscope_field.html \
    topographic_rings/noixzy_topographic_rings.html \
    ribbon_flow/noixzy_ribbon_flow.html \
    glyph_field/noixzy_glyph_field.html \
    crystal_growth/noixzy_crystal_growth.html \
    vector_scope/noixzy_vector_scope.html \
    wave_lattice/noixzy_wave_lattice.html \
    fractal_tiles/noixzy_fractal_tiles.html \
    plasma_membrane/noixzy_plasma_membrane.html
  echo
  echo "=== NEW THUMBS ==="
  ls -la \
    gallery/thumbs/moire_field.png \
    gallery/thumbs/particle_orbitals.png \
    gallery/thumbs/radial_noise.png \
    gallery/thumbs/kaleidoscope_field.png \
    gallery/thumbs/topographic_rings.png \
    gallery/thumbs/ribbon_flow.png \
    gallery/thumbs/glyph_field.png \
    gallery/thumbs/crystal_growth.png \
    gallery/thumbs/vector_scope.png \
    gallery/thumbs/wave_lattice.png \
    gallery/thumbs/fractal_tiles.png \
    gallery/thumbs/plasma_membrane.png
  echo
  echo "=== GROUP CHECK ==="
  grep -n 'const GROUPS=' \
    moire_field/noixzy_moire_field.html \
    particle_orbitals/noixzy_particle_orbitals.html \
    radial_noise/noixzy_radial_noise.html \
    kaleidoscope_field/noixzy_kaleidoscope_field.html \
    topographic_rings/noixzy_topographic_rings.html \
    ribbon_flow/noixzy_ribbon_flow.html \
    glyph_field/noixzy_glyph_field.html \
    crystal_growth/noixzy_crystal_growth.html \
    vector_scope/noixzy_vector_scope.html \
    wave_lattice/noixzy_wave_lattice.html \
    fractal_tiles/noixzy_fractal_tiles.html \
    plasma_membrane/noixzy_plasma_membrane.html
  echo
  echo "=== HAND-AUTHORED SHOULD BE EMPTY ==="
  git status --short \
    grid_extrude sdf_raymarch gyroid displacement displacement_primitives mandelbulb fold metafluid hex_grid rose_curve lissajous_mesh torus_knot
} | tee /dev/tty | pbcopy

## Next Recommended Move

Merge completed branches back to main carefully.

Suggested order from current branch state:

1. Ensure current branch is clean.
2. Switch to main.
3. Merge the repair branch, which already contains Batch 04 and prior generated-module commits through its history:
   git switch main
   git merge --no-ff repair-generated-modules-radial-kaleido -m "merge generated module expansion and repairs"

4. Verify clean status and run the checkpoint verification command.
5. Push when satisfied:
   git push origin main

Important:
If main does not already contain the batch branches, merging `repair-generated-modules-radial-kaleido` should bring in the full chain because it starts from Batch 04, which starts from Batch 03, Batch 02, and Batch 01 commits.

Do not separately merge old batch branches unless Git history requires it.

## Known Remaining Work / Backlog

- Decide whether all 12 modules should remain in final gallery or if only the original 10 target should be emphasized.
- Consider later visual polish passes module-by-module.
- Consider later audio verification as its own branch.
- Consider later cleanup of tracked legacy backup files, but do not mix that with generated-module feature work.
- Consider branch naming cleanup after merge if desired.

## Summary For Any LLM

This project is not at the beginning.

The user successfully locked:
- hand-authored module UI pass
- 12 generated modules
- thumbnails for all 12
- repaired radial/kaleido modules
- clean branch status after each lock

Do not suggest rebuilding from scratch.
Do not reopen the old UI issue unless a current module actually fails.
Do not use `form` group for generated modules unless explicitly requested.
Continue with small branches, visual tests, thumbnails, lock commits, then merge.
