# Unified Shell Functionality Restoration — 2026-06-27

## Baseline Summary

- Branch: `feature-hand-authored-preview-undo-redo`
- Shell entry: `unified_shell.html` (756 lines before this pass → 1013 lines after)
- Enabled module count: 58 in manifest, 57 enabled in shell (fold stale ref pre-existing)
- `node build_lab.js`: `done: 46 pieces` — clean before and after this pass
- Pre-pass state: shell had only thumbnail rail, logo, settings menu (grid/logo badge toggles). No controls, no search, no keyboard nav, no bridge.

## Files Inspected

- `unified_shell.html` — full read; identified CSS vars, existing script IIFE structure
- `modules.manifest.json` — confirmed 58 modules, 57 enabled, stale `fold` ref unchanged
- `workspace/agent_ops_20260627/unified_shell_module_builder_handoff_20260627.md` — Codex handoff read before any edits
- `build_lab.js` — confirmed source-of-truth for generated modules; not modified in this pass
- `gallery/index.html` — not modified
- All module HTML files — surveyed control IDs via grep to determine template generations

## Module Template Audit

Three distinct template generations found:

### Template A — New (47 modules, including all 10 Codex modules)
IDs present: `save`, `save2x`, `thumb`, `rec`, `pause`, `reset`, `newSeed`, `randomAll`, `randomForm`, `randomColor`, `btnTransparentBg`, `btnUndo`, `btnRedo`, `copyP`, `pasteP`, `seedField`, `vSeed`

Modules: flow_field, truchet, truchet_b, reaction_diffusion, voronoi, contour_field, cellular_bloom, cellular_erosion, crystal_growth, echo_contours, fractal_tiles, glyph_field, hex_grid (partial), interference_grid, kaleidoscope_field, l_system, magnetic_dust, moire_field, neural_lattice, particle_orbitals, plasma_membrane, prism_moire, radial_noise, recursive_grid, ribbon_flow, rose_curve (partial), signal_rain, signal_weave, spiral_lattice, stipple, terrain_slice, topographic_rings, torus_knot (partial), vector_scope, vortex_sheet, wave_interference, wave_lattice, + all 10 Codex modules (hyperbolic_tiling, voronoi_tower_field, catenary_web, reaction_terraces, quasicrystal_relief, agent_swarm_relief, tensegrity_nodes, phyllotaxis_stack, origami_fold_field, woven_lattice_relief)

### Template B — Medium (1 module: grid_extrude)
IDs present: `btnSave2`, `btnSave2x2`, `btnThumb2`, `btnRec2`, `btnNewSeed`, `btnUndo`, `btnRedo`

### Template C — Old (8–9 modules)
IDs present: `btnSave`, `btnSave2x`, `btnThumb`, `btnRec`, `btnCopy`, `btnPaste`
Modules: displacement, displacement_primitives, gyroid, hex_grid, lissajous_mesh, mandelbulb, metafluid, sdf_raymarch, torus_knot

## Controls Found

In hand-authored / new-template modules, all target IDs from the spec are present:
`save`, `save2x`, `rec`, `thumb`, `pause`, `reset`, `copy`/`copyP`, `paste`/`pasteP`,
`newSeed`, `randomAll`, `randomForm`, `randomColor`, `transparentBg`/`btnTransparentBg`,
`undo`/`btnUndo`, `redo`/`btnRedo`

## Controls Restored / Bridged

All controls below implemented via safe iframe DOM access (`frame.contentDocument`).
Same-origin `file://` access permits this for all modules.

| Control            | Shell Action          | Bridge Priority (tries in order)                   | Status        |
|--------------------|-----------------------|----------------------------------------------------|---------------|
| Save               | cssSave button / S key | `save` → `btnSave2` → `btnSave`                   | ✅ Bridged    |
| Save 2×            | cssSave2x button       | `save2x` → `btnSave2x2` → `btnSave2x`             | ✅ Bridged    |
| Thumbnail          | cssThumb button / T key| `thumb` → `btnThumb2` → `btnThumb`                | ✅ Bridged    |
| Record             | cssRec button          | `rec` → `btnRec2` → `btnRec`                      | ✅ Bridged    |
| Pause              | cssPause button / Space| `pause`                                            | ✅ Bridged    |
| Reset              | cssReset button / R key| `reset`                                            | ✅ Bridged    |
| New Seed           | cssSeed button / N key | `newSeed` → `btnNewSeed`                           | ✅ Bridged    |
| Random Form        | cssRndForm button / F  | `randomForm`                                       | ✅ Bridged    |
| Random Color       | cssRndColor button     | `randomColor`                                      | ✅ Bridged    |
| Random All         | cssRndAll button / A   | `randomAll`                                        | ✅ Bridged    |
| Transparent BG     | cssBg button / B key   | `btnTransparentBg`                                 | ✅ Bridged    |
| Undo               | cssUndo button / ⌘Z    | `btnUndo`                                          | ✅ Bridged    |
| Redo               | cssRedo button / ⌘⇧Z   | `btnRedo`                                          | ✅ Bridged    |
| Copy               | cssCopy button         | `copyP` → `btnCopy`                                | ✅ Bridged    |
| Paste              | cssPaste button        | `pasteP` → `btnPaste`                              | ✅ Bridged    |
| Module Switching   | Thumb click / ← →      | selectModule() → frame.src                         | ✅ Restored   |
| Search / Filter    | / key or typing         | filterModules() hides non-matching .moduleButton   | ✅ Restored   |
| Keyboard Nav       | ← → arrow keys          | navRail(±1) through visible buttons                | ✅ Restored   |
| Escape             | Esc key                 | clears search if active, else closes settings      | ✅ Restored   |
| Module URL state   | URL ?module= param      | pre-existing, unchanged                            | ✅ Intact     |
| History / popstate | back/forward nav        | pre-existing, unchanged                            | ✅ Intact     |
| Grid toggle        | Settings menu           | pre-existing, unchanged                            | ✅ Intact     |
| Logo badge toggle  | Settings menu           | pre-existing, unchanged                            | ✅ Intact     |

## Controls Deferred

- **Seed field input from shell**: `seedField` is a text input inside modules. Shell does not write to it directly; `newSeed` button inside the module handles new seed generation. Deferred to avoid fragile value injection.
- **Clipboard copy/paste (system)**: The module's `copyP`/`pasteP` buttons handle internal parameter preset clipboard logic. No additional system clipboard bridge added — this would require reading/writing JSON across iframe boundary and is deferred.
- **Preview undo/redo history**: The `btnUndo`/`btnRedo` bridge clicks the module's internal history buttons, which is correct. A shell-level history system was not invented — deferred per spec.

## Target IDs Supported

Shell bridge attempts these IDs in order per action:

```
save       → save, btnSave2, btnSave
save2x     → save2x, btnSave2x2, btnSave2x
thumb      → thumb, btnThumb2, btnThumb
rec        → rec, btnRec2, btnRec
pause      → pause
reset      → reset
newSeed    → newSeed, btnNewSeed
randomForm → randomForm
randomColor→ randomColor
randomAll  → randomAll
bg         → btnTransparentBg
undo       → btnUndo
redo       → btnRedo
copy       → copyP, btnCopy
paste      → pasteP, btnPaste
```

If no ID is found, a visible status message is shown (not just a console log).

## Files Changed

- `unified_shell.html` — only file changed in this pass

Changes within `unified_shell.html`:
1. `:root` — added `--ctrl-h: 28px` and `--stage-top: calc(var(--rail-h) + var(--ctrl-h))`
2. `.stage` — updated `inset` from `var(--rail-h)` to `var(--stage-top)`
3. `#moduleFrame` — updated `height` from `calc(100vh - var(--rail-h))` to `calc(100vh - var(--stage-top))`
4. `.status` — updated `top` from `calc(var(--rail-h) + 16px)` to `calc(var(--stage-top) + 8px)`
5. Mobile `@media (max-width: 760px)` — added `--stage-top` override
6. Added `.controlStrip`, `.searchBox`, `.ctrlBtn`, `.ctrlSep` CSS (~70 lines)
7. Added `<div class="controlStrip">` HTML with search input + 15 action buttons + separators
8. Extended IIFE with `initBridge()` function (~120 lines) covering:
   - `tryIframeClick()` — safe iframe DOM access with try/catch
   - `bridgeAction()` — tries IDs in order, shows visible status on miss
   - `bridge` object with 15 named actions
   - `bindBtn()` wires all 15 control strip buttons
   - `filterModules()` — real-time search filter on module rail
   - `navRail(delta)` — arrow key rail navigation through visible buttons
   - `keydown` handler with full shortcut map

No `.bak` files, no deleted files, no unrelated changes staged.

## Verification Steps Run

```
node --check build_lab.js   → passed (no output)
node build_lab.js           → done: 46 pieces (same as before)
node -e "..."               → JS: OK, all identifiers present
```

## Manual Smoke Test Required

Open in browser:
```
file:///Users/noixzy.macbookpro/Downloads/noixzy_generative_lab/unified_shell.html
```

Test checklist:
- [ ] Control strip visible below thumbnail rail, above stage
- [ ] Search input filters rail thumbnails in real-time
- [ ] / key focuses search
- [ ] Escape clears search
- [ ] ← → arrows navigate between modules
- [ ] Load 5 older modules (flow_field, truchet, reaction_diffusion, voronoi, contour_field) — bridge buttons work
- [ ] Load all 10 Codex modules — bridge buttons work
- [ ] pause button pauses animation
- [ ] reset button resets module
- [ ] seed button triggers new seed
- [ ] form / color / rnd buttons randomize
- [ ] save button triggers module save
- [ ] thumb button triggers thumbnail
- [ ] bg button toggles transparent background
- [ ] undo / redo bridge through module history
- [ ] Old template modules (displacement, gyroid) — save bridges to btnSave; unsupported actions show status message
- [ ] Status message appears for unsupported controls and auto-hides

## Known Remaining Issues

1. **`fold` manifest entry** — stale reference to `fold/noixzy_fold.html` (pre-existing, not changed)
2. **Template C modules (old)** — pause, reset, newSeed, randomForm, randomColor, randomAll, btnTransparentBg, btnUndo, btnRedo not available. Bridge will show visible status "not supported in this module".
3. **grid_extrude (Template B)** — pause, reset, randomForm, randomColor, randomAll, btnTransparentBg not available. save, seed, undo, redo bridge correctly.
4. **iframe cross-origin fallback** — if a module ever loads from a different origin, `tryIframeClick` will silently fail (try/catch). Status will say "not supported".
5. **bgAlpha control** — spec lists `bgAlpha` as a target ID; not found in any module. Deferred.
6. **randomUnlocked / randomForm** — `randomUnlocked` and `randomForm` (from spec's "random" variants) — `randomForm` is bridged; `randomUnlocked` not found in current modules.

## Recommended Next Pass

1. Smoke test all bridge controls in browser; verify status messages appear correctly for Template C modules
2. Fix or retire the stale `fold` manifest entry
3. Consider upgrading old-template modules (gyroid, mandelbulb, displacement, etc.) to the new template to gain pause/reset/seed/undo support
4. Consider adding a keyboard shortcut legend tooltip (? key) to the control strip
5. Consider thumbnail auto-capture workflow triggered from the shell `thumb` button
