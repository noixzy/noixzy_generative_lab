# noixzy randomization + geometry audit - 2026-06-27

Scope: `workspace/module_escrow_20260627/candidates` and `workspace/module_escrow_20260627/escrow_shell.html`.

## Summary

- Candidate modules audited: 100 HTML modules.
- Main ineffective behavior found: randomize handlers mostly changed only seed strings, leaving density, extrusion, stack depth, palette, line weight, displacement, recursion, material, and field controls unchanged.
- Fix made: shared runtime and legacy standalone randomize handlers now push actual module sliders using control-name-aware ranges, so geometry and material states visibly change on each randomize.
- Module-level physics added: a lightweight `Experimental Physics` checkbox was added inside each module surface, applying subtle force-field drift, breathing scale, contrast, and saturation without adding global stage controls.
- Shell integration: existing global previous/next buttons remain in `escrow_shell.html`; candidate paths were not removed or renamed.

## Ineffective Parameters Found

- Seed-only randomization in shared runtimes: Batch 11, Batch 12 architecture, Batch 12 math, Batch 13 architecture, Batch 14 unexplored, Cosmos quick, and the older candidate runtime.
- Seed-only randomization in legacy standalone massing/facade/relief/shell/grid modules.
- Some older modules had useful geometry controls, but randomization was disconnected from them, making the exported candidate set feel too similar unless sliders were manually adjusted.
- A few older runtime files still include previous stage-message compatibility code; it is inert now that the shell no longer sends stage parameters, but it should be removed in a cleanup pass.

## Randomization Fixes Made

- Randomize now changes production traits by inspecting module control labels and weighting the output:
  - Density/count/grid/points/modules/rings/cells are biased into visibly fuller ranges.
  - Extrude/depth/height/stack/layer/relief/bump/displace/amplitude/subdivision/recursion are biased into geometry-forward ranges.
  - Offset/jitter/noise/field/twist/warp/phase/entropy/diffusion/morph/void/mortar are randomized across a wide midrange.
  - Line/stroke/shadow controls change enough to alter silhouette and readability without blowing out the drawing.
  - Palette/material controls are randomized across their full range.

## Geometry Improvements Made

- The existing module geometry engines now receive stronger randomized values for stack height, density, extrusion depth, displacement, bump strength, recursion depth, architectural bias, line weight, field noise, and palette.
- Experimental physics adds subtle module-local drift/breathing and contrast/saturation modulation. This is intentionally light so dense particle, cellular, and field modules do not tank performance.
- Standalone massing, facade, concrete relief, entropy, parametric shell, and structural grid modules now randomize their 3D/perspective and geometric controls rather than only reseeding.

## Module-by-Module Audit

### noixzy_batch_12_runtime.js
- `noixzy_aperture_field.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_brise_soleil.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_load_path.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_minimal_parti.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_modulor_field.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_quiet_grid.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_section_cut.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_service_core.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_shadow_louver.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.
- `noixzy_white_space_field.html`: architectural batch; randomize now drives bays, grids, depth, louvers, cores, aperture logic, facade rhythm, and shadows.

### noixzy_candidate_runtime.js
- `noixzy_apollonian_packing.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_brick_bond_field.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_catenary_arches.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_chladni_plate.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_differential_growth.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_diffusion_aggregate.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_floorplan_splitter.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_girih_star_field.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_hilbert_plan.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_labyrinth_field.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_lsystem_canopy.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_moire_facade.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_penrose_deflation.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_phyllotaxis_dome.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_physarum_network.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_rib_vault_generator.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_section_stack.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_substrate_cracks.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_tensegrity_web.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_urban_voronoi.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_weave_matrix.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.
- `noixzy_wfc_tiles.html`: algorithmic candidate runtime; control-aware randomize now affects density, cells, rings, cracks, depth, linework, recursion, and flow traits.

### noixzy_batch_11_runtime.js
- `noixzy_boids_ink_current.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_bonsai_circuit_growth.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_cellular_rake_tiles.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_particle_moss_orbits.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_pressure_thread_physics.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_recursive_kintsugi_array.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_shodo_vector_field.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_torii_depth_lattice.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_wave_sand_interference.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.
- `noixzy_zen_caustic_relief.html`: nano zen batch; randomize now drives particles, recursion, bump, displacement, extrusion, line density, and motion controls.

### standalone
- `noixzy_brutalist_massing.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_asymmetric.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_cantilever.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_chambers.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_cluster.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_folded.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_linear.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_mat.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_megaform.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_modular.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_slabs.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_split.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_brutalist_massing_towers.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_concrete_relief.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_entropy_mask_field.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_modernist_facade.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_parametric_shell.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.
- `noixzy_structural_grid.html`: legacy standalone; now randomizes local sliders and gets Experimental Physics. Still worth deeper module-specific geometry expansion in a later pass.

### noixzy_batch_14_unexplored_runtime.js
- `noixzy_bz_reaction_rings.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_escher_tessellation_morph.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_gosper_curve_city.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_ifs_fern_scaffold.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_modulor_grid_system.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_nano_kitbash_lattice.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_quasicrystal_diffraction_garden.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_spectral_ribbon_bridge.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_turmite_masonry.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.
- `noixzy_wang_tile_machine.html`: Batch 14 unexplored set; randomize now pushes order, arrays, stacks, extrusion, bump, pins, tiles, morphing, and kitbash density.

### noixzy_cosmos_quick_runtime.js
- `noixzy_calibrated_gate_relic.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_frosted_baffle_field.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_half_hidden_chamber.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_indexed_hinge_array.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_misaligned_float_scaffold.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_offset_plinth_threshold.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_recursive_keystone_frame.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_structural_spine_signal.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_tilted_glyph_system.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.
- `noixzy_visible_standoff_cage.html`: Cosmos quick card; density/offset/void/line/depth/tilt now randomize, with light drift physics.

### noixzy_batch_13_runtime.js
- `noixzy_courtyard_plan.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_diagrid_tower.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_light_well.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_mashrabiya_modern.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_panelization_solver.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_parametric_pavilion.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_poche_generator.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_screen_block.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_street_canyon.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.
- `noixzy_threshold_map.html`: architectural systems batch; randomize now drives courtyards, wells, screens, poche, diagrids, pavilions, canyons, and panels.

### noixzy_batch_12_math_runtime.js
- `noixzy_cyclic_ca_spiral_reactor.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_falling_sand_microphysics.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_fourier_epicycle_array.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_hitomezashi_stitch_matrix.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_lenia_kernel_garden.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_magnetic_dipole_linework.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_spectrogram_ridge_terrain.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_strange_attractor_dust.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_superformula_shell_stack.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.
- `noixzy_thin_film_interference.html`: math/nano batch; randomize now drives kernel/detail/count/field/material/palette controls.

## Remaining Weak Spots

- Legacy standalone brutalist variants share a broad 2.5D massing language; they now randomize better, but the next pass should add per-variant unique controls like `recursive terraces`, `bridge count`, `service cores`, `negative-space slicers`, and `module kit density`.
- Experimental Physics is intentionally light and canvas-level. A deeper pass could wire per-module force fields directly into particle positions and cell solvers.
- Old stage-message compatibility code remains in some runtimes and can be removed once no external shell depends on it.
- Export hooks were preserved but not expanded; batch export/contact-sheet hooks are still future work.

## Concise Change Log

- Patched shared runtime randomization across all runtime-backed candidates.
- Patched legacy standalone randomization across 18 older candidates.
- Added module-level `Experimental Physics` toggle to runtime-backed and standalone candidates.
- Kept shell navigation and candidate paths unchanged.

## Files Changed By This Pass

- `workspace/module_escrow_20260627/candidates/noixzy_candidate_runtime.js`
- `workspace/module_escrow_20260627/candidates/noixzy_cosmos_quick_runtime.js`
- `workspace/module_escrow_20260627/candidates/noixzy_batch_11_runtime.js`
- `workspace/module_escrow_20260627/candidates/noixzy_batch_12_runtime.js`
- `workspace/module_escrow_20260627/candidates/noixzy_batch_12_math_runtime.js`
- `workspace/module_escrow_20260627/candidates/noixzy_batch_13_runtime.js`
- `workspace/module_escrow_20260627/candidates/noixzy_batch_14_unexplored_runtime.js`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_asymmetric.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_cantilever.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_chambers.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_cluster.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_folded.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_linear.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_mat.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_megaform.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_modular.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_slabs.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_split.html`
- `workspace/module_escrow_20260627/candidates/noixzy_brutalist_massing_towers.html`
- `workspace/module_escrow_20260627/candidates/noixzy_concrete_relief.html`
- `workspace/module_escrow_20260627/candidates/noixzy_entropy_mask_field.html`
- `workspace/module_escrow_20260627/candidates/noixzy_modernist_facade.html`
- `workspace/module_escrow_20260627/candidates/noixzy_parametric_shell.html`
- `workspace/module_escrow_20260627/candidates/noixzy_structural_grid.html`
- `workspace/module_escrow_20260627/noixzy_randomization_geometry_audit_20260627.md`

