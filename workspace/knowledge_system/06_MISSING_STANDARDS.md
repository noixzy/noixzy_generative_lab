# 06 — Missing Standards
# noixzy Generative Lab — Concepts Referenced But Never Formally Defined

> This file identifies areas where the project repeatedly references a concept,
> relies on it, or defers decisions about it — but has never written down the
> permanent standard. These are gaps in the constitution, not gaps in the code.

---

## How to read this file

Each entry names the missing standard, explains what is currently known (scattered
across documents), and identifies what needs to be formally decided and written.
Priority ratings:
- **🔴 High** — actively needed; agents will make inconsistent decisions without this
- **🟡 Medium** — needed before the area is built; deferral creates technical debt
- **⚪ Low** — can defer until the area is actively developed

---

## MS-01 — Formal font stack standard for all shells 🔴

**What is referenced but not defined:**
Every shell UI (unified shell, escrow shell, any future shell) should share a consistent
typographic baseline. The unified shell uses `ui-monospace, SFMono-Regular, Menlo, Monaco,
Consolas, monospace`. The escrow shell was explicitly upgraded to match in 2026-06-27.
However, no document formally establishes this as a project-wide rule.

**What needs to be defined:**
- The canonical font stack for all NGL shells, headers, panels, and labels
- The canonical base type sizes for panel labels (9px metadata, 10px labels, 11px headers)
- Whether variable fonts, web fonts, or system fonts are acceptable

**Where it is partially addressed:**
`NGL_TOTAL_AUDIT_20260627.md` §9, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` §typography alignment

---

## MS-02 — Module promotion criteria (escrow → unified shell) 🔴

**What is referenced but not defined:**
The three-tier escrow system (Tier 1 = ready, Tier 2 = needs defaults, Tier 3 = needs polish)
is described. Tier 1 candidates are named. But the formal criteria for promotion — what a
module must demonstrate to be added to `unified_shell.html`, `modules.manifest.json`, and
`gallery/index.html` — has never been written as a standard.

**What needs to be defined:**
- Visual quality bar (defaults must be gallery-worthy)
- Technical requirements (browser verify, console clean, controls respond, thumbnails exist)
- Feature parity checklist (does it need pause, reset, pin, theme, etc.?)
- Whether the module must pass through `build_lab.js` or can be added as a hand-authored
  standalone with a manifest entry
- Who decides: noixzy art direction vs technical pass

**Where it is partially addressed:**
`NGL_TOTAL_AUDIT_20260627.md` §14, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` §tier system,
`CODEX_QUEUE.md` (acceptance criteria per task, but not a general standard)

---

## MS-03 — The module manifest schema 🔴

**What is referenced but not defined:**
`modules.manifest.json` is the module registry. `NGL_PLAN_06062026.md` recommends it include
capability flags (supported actions, exports, audio, transparent background, schema availability,
kind: hand-authored vs generated). But the formal schema for a manifest entry has never been
written.

**What needs to be defined:**
```json
{
  "id": "module_id",
  "title": "Display Title",
  "kind": "hand-authored | generated",
  "path": "module_id/noixzy_module_id.html",
  "thumbnail": "gallery/thumbs/module_id.png",
  "description": "...",
  "tags": ["field", "simulation"],
  "enabled": true,
  "capabilities": {
    "pause": true,
    "reset": true,
    "newSeed": true,
    "randomForm": true,
    "randomColor": true,
    "randomAll": true,
    "save": true,
    "save2x": true,
    "rec": true,
    "thumb": true,
    "pbrMaps": true,
    "svg": false,
    "transparentBg": true,
    "audio": false,
    "undo": true,
    "redo": true,
    "heightField": true
  },
  "templateGeneration": "A | B | C"
}
```

**Where it is partially addressed:**
`NGL_PLAN_06062026.md` §Canonical Inventory and Manifest

---

## MS-04 — The postMessage / iframe bridge protocol 🟡

**What is referenced but not defined:**
`CODEX_TASK_engine_shell.md` specifies a postMessage protocol:
- `IN {type:"setParam", key, value}`
- `IN {type:"setSeed", seed}`
- `IN {type:"setTheme", name}`
- `IN {type:"action", name}`
- `OUT {type:"state", seed, fps, dims}`

The current `unified_shell.html` uses iframe DOM access (`tryIframeClick`) instead of
postMessage — a pragmatic same-origin shortcut. The formal postMessage contract from
the Codex task spec was never implemented. No document has resolved this discrepancy.

**What needs to be defined:**
- Which bridge mechanism is canonical: iframe DOM access or postMessage?
- If postMessage: the full event schema for IN and OUT messages
- If iframe DOM access: the formal ID lookup table (currently in the shell JS, not documented)
- What happens when a module is cross-origin (iframe DOM access fails silently)

**Where it is partially addressed:**
`CODEX_TASK_engine_shell.md`, `NGL_PLAN_06062026.md` §Module Bridge Contract,
`unified_shell_functionality_restoration_20260627.md`

---

## MS-05 — Audio-reactive parameter mapping contract 🟡

**What is referenced but not defined:**
Audio reactivity is the highest-priority future feature across multiple documents.
`EXPANSION_V2.md` provides implementation code for the audio system (AnalyserNode, bands).
`GPT_HANDOFF_2026_06_25.md` provides per-module mapping suggestions.
But the formal mapping schema — how a module declares its audio-reactive params and
what band signals it expects — has never been defined as a standard.

**What needs to be defined:**
- `ABANDS` shape: `{bass:0–1, mid:0–1, high:0–1, presence:0–1}`
- How a module declares audio-mappable params: flag in param schema? `audioMappable: true`?
- Default mapping per module type (bass→height, mids→density, highs→glow)
- Whether the mapping is shell-controlled (global) or module-controlled (local)
- Whether audio is always mic-based or can also accept a dropped audio file

**Where it is partially addressed:**
`EXPANSION_V2.md` §Audio-Reactive Mode, `GPT_HANDOFF_2026_06_25.md`, `NGL_PLAN_06062026.md`

---

## MS-06 — Theme bundle schema and named theme bank 🟡

**What is referenced but not defined:**
`CODEX_TASK_theme_system.md` defines the THEMES array shape:
```
{ name, palette:[[bg],[accent],[ink]], finish:{contrast,vignette,grain,glow},
  material:{metallic,rough,sheen,opacity}, bias:{density} }
```
But the actual named themes (beyond "wrap the existing 12 palettes with default
finish/material values") have never been defined. The "hero few" themes (ember, teal,
violet, steel, synth) are named but not specified.

**What needs to be defined:**
- The canonical THEMES array (all named themes with their full bundle values)
- Which themes should be "hero" (hand-tuned toward dark/mid/bright focal)
- Whether themes are additive to palettes or replace them

**Where it is partially addressed:**
`CODEX_TASK_theme_system.md`, `CHATGPT_BRIEF.md`

---

## MS-07 — SVG export contract 🟡

**What is referenced but not defined:**
`CODEX_QUEUE.md` Task 5 specifies SVG export for `truchet`, `contour_field`, and `l_system`.
The approach is: optional `renderSVG()` per piece; engine wires the button only when defined.
But the SVG schema — what SVG elements are used, how colors map from `pal`, how paths are
structured — has never been defined.

**What needs to be defined:**
- Which SVG elements: `<path>` strokes? `<line>`? `<polygon>` fills?
- How palette maps to SVG stroke/fill
- Whether all 10 palettes produce valid SVG or only mono-line palettes
- Filename convention for SVG exports
- Whether SVG is always `viewBox="0 0 W H"` at canvas resolution

**Where it is partially addressed:**
`CODEX_QUEUE.md` Task 5, `IDEAS_module_expansion.md` Part 4 §SVG export

---

## MS-08 — Blender bridge JSON schema 🟡

**What is referenced but not defined:**
Multiple documents name a Blender bridge as a goal. `FUTURE_INSTALLMENTS.md` and
`IDEAS_module_expansion.md` both describe it as "module writes a small JSON;
a Blender Python script rebuilds it." But no JSON schema has been defined.

**What needs to be defined:**
```json
{
  "schema": "noixzy_blender_bridge_v1",
  "module": "reaction_diffusion",
  "seed": 12345,
  "params": { "feed": 0.055, "kill": 0.062, ... },
  "heightField": { "G": 256, "data": "base64 float32 ..." },
  "points": [...],
  "palette": [[r,g,b], [r,g,b], [r,g,b]]
}
```

**Where it is partially addressed:**
`FUTURE_INSTALLMENTS.md`, `IDEAS_module_expansion.md` Part 4, `HANDOFF.md` §Blender pipeline

---

## MS-09 — Default param values standard (per module type) 🔴

**What is referenced but not defined:**
`IDEAS_module_expansion.md` Part 2 gives per-module enhancement notes (e.g., flow_field
"variable line weight by speed," contour_field "quantize into terraces"). `CODEX_QUEUE.md`
Task 6 ("strong default looks") defers all default tuning to a taste pass. But there is no
formal standard for what a "gallery-worthy default" requires per module type.

**What needs to be defined:**
- Minimum visual quality bar for a module's cold-open defaults
- Which param groups must be tuned (system defaults, look defaults, material defaults)
- Whether defaults are locked in `build_lab.js` or overridden by the theme system
- A review process: "gallery-worthy" requires browser-verified, not just coded

**Where it is partially addressed:**
`CODEX_QUEUE.md` Task 6, `IDEAS_module_expansion.md` Parts 2 & 3

---

## MS-10 — Architectural module shared parameter set 🟡

**What is referenced but not defined:**
`ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md` §"Shared Parameters For Architecture Modules"
lists a recommended set of shared controls for architectural modules:
`seed`, `palette`, `scale`, `density`, `void_ratio`, `line_hierarchy`, `depth`, `sun_angle`,
`shadow_softness`, `material`, `weathering`, `axonometric`, `export_mode`.

But this is a suggestion, not a standard. The architectural modules in the escrow shell
each define their own param sets independently. There is no architectural equivalent of the
engine SHARED params array.

**What needs to be defined:**
- Which architectural module params are truly shared (required across all architectural modules)
- How they map to the existing SHARED params (are `depth`, `sun_angle`, `shadow_softness`
  new additions to SHARED, or per-module?)
- Whether architectural modules use the same engine groups (system, extrude, material, frame,
  look, motion) or a different grouping

**Where it is partially addressed:**
`ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md` §Shared Parameters

---

## MS-11 — Thumbnail generation workflow and spec 🟡

**What is referenced but not defined:**
Thumbnails exist at `gallery/thumbs/<module_id>.png`. They are captured manually
via a `→ thumb` button or via `node contact_sheet.js`. But the spec for a thumbnail
(size, format, timing after load, how many frames to let run before capture) has never
been formally defined.

**What needs to be defined:**
- Thumbnail dimensions (currently 16:9 implied; specific resolution?)
- Capture timing (how many frames / seconds after module load?)
- Whether thumbnails are captured at default params or at a designated "showcase frame"
- The exact relationship between `contact_sheet.js` and `→ thumb` (both produce
  `gallery/thumbs/*.png` but via different mechanisms)

**Where it is partially addressed:**
`HANDOFF.md`, `GPT_HANDOFF_2026_06_25.md`, `unified_shell_functionality_restoration_20260627.md`

---

## MS-12 — Preset / favorites schema and cross-module library 🟡

**What is referenced but not defined:**
Each module stores favorites in localStorage using `_loadFavs()` / `_saveFavs()`.
The shell's future preset system should store more:
`{moduleId, seed, params, theme, colors, transparentBg, audioMap, createdAt, version}`.
But the actual localStorage key structure, serialization format, and version strategy
have never been formally defined.

**What needs to be defined:**
- localStorage key convention for module-local favorites vs shell-global presets
- The full preset object schema (as above)
- Version/migration strategy for when params change
- Whether cross-module presets are global (any module can import any preset) or module-scoped

**Where it is partially addressed:**
`GPT_HANDOFF_2026_06_25.md` §Local preset save/load, `NGL_PLAN_06062026.md` §Preset System

---

## MS-13 — "Drawing mode" vs "render mode" standard for architectural modules ⚪

**What is referenced but not defined:**
Multiple entries in `ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md` suggest a
"drawing mode" vs "render mode" toggle for architectural modules — drawing mode disables
glow/grain and uses clean architectural line weights; render mode adds material finish.
This pattern is never defined as an engine feature.

**What needs to be defined:**
- Whether "drawing mode" is a system-level toggle (like transparent background) or a theme
- What the exact param overrides are in drawing mode (grain→0, glow→0, contrast→neutral?)
- Whether SVG export and drawing mode are related

**Where it is partially addressed:**
`ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md` §Implementation Fit

---

## MS-14 — Performance benchmark for escrow module promotion ⚪

**What is referenced but not defined:**
The tier system identifies "Tier 3" modules as needing renderer polish. CPU/GPU risk tiers
are documented per module. But no formal FPS benchmark exists for what constitutes
"acceptable" performance before a module can be promoted.

**What needs to be defined:**
- Target FPS at 1280×800 for promotion eligibility
- Maximum acceptable CPU spike on param change
- Whether there is a "lite mode" requirement for modules above the HIGH risk tier

**Where it is partially addressed:**
`CODEX_TASK_volumetric_extrude.md` (50fps target for heightfield), `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`
§Performance Audit
