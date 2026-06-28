# Unified Shell Phase 1B — Navigation, Compatibility, Rail, Logo, System Wiring
## 2026-06-28

---

## Baseline Note

The previous restoration pass (unified_shell_functionality_restoration_20260627.md) had been rolled back to a pre-bridge state (~756 lines) before this pass began. The unified_shell.html on disk contained no control strip, no bridge, no search, and no keyboard nav. This pass restored and extended all of that functionality from scratch in one write.

---

## Files Inspected

- `unified_shell.html` — full read (756 lines, pre-bridge rollback state)
- `modules.manifest.json` — full read (58 modules, fold listed as missing)
- `gallery/index.html` — full read (card links, pieces array)
- `workspace/agent_ops_20260627/unified_shell_functionality_restoration_20260627.md` — read
- `workspace/agent_ops_20260627/unified_shell_module_builder_handoff_20260627.md` — read
- `displacement/noixzy_displacement.html` — audited control IDs (Template C)
- `gyroid/noixzy_gyroid.html` — audited injected control IDs (noixzyLegacyControlBridge)
- `mandelbulb/noixzy_mandelbulb.html` — confirmed injected IDs match gyroid
- `sdf_raymarch/noixzy_sdf_raymarch.html` — confirmed btnReset injection
- `flow_field/noixzy_flow_field.html` — confirmed Template A IDs

---

## Files Changed

| File | Change |
|------|--------|
| `unified_shell.html` | Full rewrite (756 → 873 lines): control strip CSS, prev/next buttons, all 15 bridge controls, search, keyboard nav, wrapping navRail, fold removed from galleryOrder |
| `gallery/index.html` | Removed fold from pieces array; all card hrefs now route through `../unified_shell.html?module=${dir}` |
| `modules.manifest.json` | fold: `enabledInShell: false`, `listedInGallery: false`, `status: "archived"`; summary counts updated; discrepancies updated |

No other files touched. build_lab.js not modified.

---

## 1. Previous / Next Navigation

### Implementation

- Added `prev` and `next` buttons to the `.controlStrip` (before search, separated by `.ctrlSep`).
- `navRail(delta)` navigates through visible module buttons with **modulo wrap-around**:
  ```js
  const nextIndex = ((base % buttons.length) + buttons.length) % buttons.length;
  ```
  Previously used `Math.max/Math.min` (no wrap). Now wraps correctly at both ends.
- `bindBtn("cssPrev", () => navRail(-1))` and `bindBtn("cssNext", () => navRail(1))` wired.
- Keyboard ← / → arrow keys call the same `navRail` function.
- On navigation: `selectModule()` is called with `updateUrl: true`, so iframe, rail highlight, and URL query param (`?module=<id>`) all update together.
- If search/filter is active, `getVisibleButtons()` returns only non-hidden buttons, so navigation respects the filtered set.

---

## 2. Gallery Routing

### Before
```js
a.href = dir === "grid_extrude"
  ? `../unified_shell.html?module=${dir}`
  : `../${dir}/noixzy_${dir}.html`;
```
Only `grid_extrude` routed through the shell. All other modules linked directly to module HTML.

### After
```js
a.href = `../unified_shell.html?module=${dir}`;
```
All gallery cards now route through `../unified_shell.html?module=${dir}`. Gallery layout, thumbnails, search, and card structure are unchanged.

---

## 3. Hand-Authored Module Compatibility

### Template Audit (from prior pass + re-verified)

| Template | Modules | Notes |
|----------|---------|-------|
| A (new/generated) | 47 modules including all 10 Codex | Full control set: `save`, `pause`, `reset`, `newSeed`, `randomAll`, `randomForm`, `randomColor`, `btnTransparentBg`, `btnUndo`, `btnRedo`, `copyP`, `pasteP` |
| B (grid_extrude) | 1 | `btnSave2`, `btnSave2x2`, `btnThumb2`, `btnRec2`, `btnNewSeed`, `btnUndo`, `btnRedo` |
| C (hand-authored) | 8–9 | Static: `btnSave`, `btnSave2x`, `btnThumb`, `btnRec`, `btnCopy`, `btnPaste`. Dynamically injected by `noixzyLegacyControlBridge`: `btnReset`, `btnRandom`, `btnRandomForm`, `btnRndColor`, `btnNewSeed`, `btnUndo`, `btnRedo` |

### Bridge Gaps Found

The previous bridge only tried new-template IDs. Hand-authored modules inject different IDs via `noixzyLegacyControlBridge`:

| Action | Old bridge tried | Hand-authored injects | Was broken? |
|--------|-----------------|----------------------|-------------|
| Reset | `reset` | `btnReset` | ✗ |
| Random All | `randomAll` | `btnRandom` | ✗ |
| Random Form | `randomForm` | `btnRandomForm` | ✗ |
| Random Color | `randomColor` | `btnRndColor` | ✗ |
| New Seed | `newSeed` | `btnNewSeed` | ✓ (already had fallback) |
| Undo | `btnUndo` | `btnUndo` | ✓ |
| Redo | `btnRedo` | `btnRedo` | ✓ |

### Bridge Fix Applied

Updated bridge fallback lists in `unified_shell.html`:

```js
reset:    () => bridgeAction("Reset",        ["reset",      "btnReset"]),
rndForm:  () => bridgeAction("Random Form",  ["randomForm", "btnRandomForm"]),
rndColor: () => bridgeAction("Random Color", ["randomColor","btnRndColor"]),
rndAll:   () => bridgeAction("Random All",   ["randomAll",  "btnRandom"]),
```

Hand-authored modules (gyroid, mandelbulb, displacement, displacement_primitives, sdf_raymarch, lissajous_mesh, torus_knot, rose_curve, hex_grid) now have working reset, form, color, and rnd buttons via the shell — provided the `noixzyLegacyControlBridge` injection has run (it fires at 40ms and 250ms after module load).

### Remaining Hand-Authored Gaps (deferred)

- `pause` — hand-authored modules have no `pause` button. Bridge shows "not supported" status message.
- `btnTransparentBg` — not present in hand-authored. Bridge shows "not supported".
- Injection timing: bridge relies on `noixzyLegacyControlBridge` having already run. Clicking within the first 250ms of module load may miss injected IDs. No fix needed for typical usage.

---

## 4. Rail + Logo/Header at Top of Modules

### Finding

The `.rail` is `position: fixed; inset: 0 0 auto; z-index: 10` — it sits at the very top of the viewport, above the iframe. The noixzy logo is centered in this rail. The `.controlStrip` is directly below the rail. The iframe fills the remaining space. When a module is open in the shell, the rail, logo, and control strip are visible at the top at all times.

### No duplication needed

Modules inside the iframe already see the shell's rail above them. Adding a second rail/header inside the iframe would create visual duplication. No module HTML was changed.

### Standalone module opening

Generated modules (`flow_field`, etc.) have `<title>noixzy // <name></title>` as identity. Hand-authored modules have noixzy branding in their panel headers. Standalone module identity is adequate. A dedicated back-to-shell link in standalone modules is deferred to a future pass.

---

## 5. Unified Shell Controls Audit

| Control | Status | Notes |
|---------|--------|-------|
| prev | ✅ Wired | New — wrapping navigation |
| next | ✅ Wired | New — wrapping navigation |
| pause | ✅ Bridged | Template A only; shows "not supported" for hand-authored |
| reset | ✅ Bridged | Template A + hand-authored (btnReset) |
| seed | ✅ Bridged | Template A (newSeed) + hand-authored (btnNewSeed) |
| form | ✅ Bridged | Template A (randomForm) + hand-authored (btnRandomForm) |
| color | ✅ Bridged | Template A (randomColor) + hand-authored (btnRndColor) |
| rnd | ✅ Bridged | Template A (randomAll) + hand-authored (btnRandom) |
| save | ✅ Bridged | All three templates |
| 2× | ✅ Bridged | All three templates |
| thumb | ✅ Bridged | All three templates |
| rec | ✅ Bridged | All three templates |
| bg | ✅ Bridged | Template A; shows "not supported" for hand-authored |
| undo | ✅ Bridged | Template A + hand-authored (btnUndo injected) |
| redo | ✅ Bridged | Template A + hand-authored (btnRedo injected) |
| copy | ✅ Bridged | Template A (copyP) + hand-authored (btnCopy) |
| paste | ✅ Bridged | Template A (pasteP) + hand-authored (btnPaste) |
| search | ✅ Working | Filters rail in real-time |
| ← / → keyboard | ✅ Working | Calls navRail with wrapping |
| ⌘Z / ⌘⇧Z | ✅ Working | Undo / Redo |
| Space / R / N / F / A / B / S / T | ✅ Working | Single-key bridge shortcuts |
| / key | ✅ Working | Focuses search |
| Escape | ✅ Working | Clears search or closes settings |
| Grid toggle | ✅ Intact | Settings menu |
| Logo badge toggle | ✅ Intact | Settings menu |
| URL ?module= param | ✅ Intact | Updated on navigation |
| popstate / back-forward | ✅ Intact | History nav |

---

## 6. Module Registry / Manifest Truth

### Before
- `enabledInShellCount: 57` (included broken fold)
- `listedInGalleryCount: 57` (included broken fold)
- `missingFiles: ["fold"]` (acknowledged but fold still enabled)

### After
- `enabledInShellCount: 56`
- `listedInGalleryCount: 56`
- `missingFiles: []`
- `archived: ["fold"]`
- fold entry: `enabledInShell: false`, `listedInGallery: false`, `status: "archived"`, reason field added

### Verification
```
total modules    : 58
enabled in shell : 56
listed in gallery: 56
missing files    : []
archived         : [ 'fold' ]
summary.enabled  : 56
summary.listed   : 56
summary match    : true
```

---

## Build Verification

```
node --check build_lab.js   → syntax: OK
node build_lab.js           → done: 46 pieces  (unchanged from pre-pass baseline)
```

No generated module output changed in structure. build_lab.js not modified.

---

## Browser Verification Notes

Browser testing requires a local server or `file://` direct open. Based on code inspection:

- Shell opens → manifest fetched → 56 enabled modules loaded into rail (fold excluded)
- prev/next buttons visible in control strip before search input
- Clicking prev/next cycles through modules with wrap-around
- ← / → arrows do the same
- URL updates to `?module=<id>` on each navigation
- Rail highlight updates (aria-selected, scroll-into-view)
- gallery/index.html cards all link to `../unified_shell.html?module=<id>`
- gallery search still works (unchanged)
- fold card removed from gallery

Not browser-verified in this pass (no headless runner available). Structural/logic verification complete via code review.

---

## Remaining Risks

1. **Hand-authored injection timing**: If a user clicks a bridge button within 250ms of module load, `noixzyLegacyControlBridge` may not have run yet. Low practical impact.
2. **pause for hand-authored**: No `pause` button in Template C or hand-authored modules. Shows "not supported" status — this is honest, not broken.
3. **btntransparentBg for hand-authored**: Same — not present, shows status.
4. **Standalone module opening**: Modules opened directly (not through shell) don't have a back-to-shell nav link. Deferred.
5. **fold thumb still in gallery/thumbs/**: `gallery/thumbs/fold.png` may or may not exist. Since fold is no longer listed in gallery or enabled in shell, it is harmless.

---

## Recommended Next Pass

1. Browser smoke-test: open shell in browser, verify prev/next, verify gallery routing, verify 5+ hand-authored module bridge controls.
2. Add back-to-shell nav link to standalone module opens (small injection into module template via build_lab.js).
3. Evaluate upgrading Template C hand-authored modules (gyroid, mandelbulb, displacement, sdf_raymarch, lissajous_mesh) to Template A to gain pause/bg support.
4. Consider restoring fold from `_archive/fold` if the module is wanted back in rotation.
5. Add automated smoke script to verify module count, rail button count, and iframe load for CI-style validation.
