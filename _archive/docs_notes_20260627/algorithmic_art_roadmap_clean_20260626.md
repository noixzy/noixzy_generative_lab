

---

# Integration checkpoint — hand-authored bridge

## Objective

Unify hand-authored and generated module UI wiring so both run cleanly in the same shell.

## Root issue found

Hand-authored modules used mixed control IDs. New shell buttons forwarded to legacy IDs, and several forwarded targets were missing. This caused silent no-op actions.

## Implemented Phase 1 fix

A shared runtime bridge, `initNoixzyLegacyControlBridge()`, was added to hand-authored modules.

It creates hidden fallback controls / IDs when missing:

- `save`
- `save2x`
- `rec`
- `thumb`
- `pause`
- `reset`
- `copy`
- `paste`
- `newSeed`
- `randomUnlocked`
- `randomForm`
- `randomColor`
- `recDur`

This ensures existing handlers resolve reliably.

## Modules integrated

- displacement
- displacement_primitives
- fold
- grid_extrude
- gyroid
- hex_grid
- lissajous_mesh
- mandelbulb
- metafluid
- rose_curve
- sdf_raymarch
- torus_knot

## Result

Hand-authored and generated modules now operate under a unified shell behavior model with consistent button / utility wiring compatibility.

## Phase 2 recommendation

Later, migrate hand-authored modules to canonical generated IDs directly and remove the bridge dependency only after parity is fully normalized.

Do not begin Phase 2 during the current planning pass.
