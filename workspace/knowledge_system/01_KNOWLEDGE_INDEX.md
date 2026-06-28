# 01 — Knowledge Index
# noixzy Generative Lab — Canonical Knowledge Base

> This index maps every major topic to the documents where it is defined.
> Use it to locate authoritative guidance before reading any other knowledge file.

---

## How to read this index

Each entry names a topic, lists the **authoritative source** document(s) first,
then secondary sources that reinforce or extend it. Citations use short names;
full paths are under `workspace/` unless noted otherwise.

---

## A. Project Identity & Purpose

| Topic | Primary Source | Secondary |
|---|---|---|
| What the lab is | `OVERVIEW.md`, `HANDOFF.md` | `READ_FIRST.md` |
| Artist identity (noixzy, Chris Tucker) | `READ_FIRST.md`, `SESSION_BRIDGE.md` | `CHATGPT_BRIEF.md` |
| Production pipeline (Blender integration) | `HANDOFF.md` | `OVERVIEW.md`, `CODEX_TASK_volumetric_extrude.md` |
| Working-copy & mirror convention | `READ_FIRST.md`, `HANDOFF.md` | `GPT_HANDOFF_2026_06_25.md` |
| Repository branch / commit state | `NGL_UNIFIED_SHELL_HANDOFF_20260627.md` | `NGL_TOTAL_AUDIT_20260627.md` |

---

## B. Architecture

| Topic | Primary Source | Secondary |
|---|---|---|
| Module taxonomy (generated vs hand-authored) | `HANDOFF.md`, `CHATGPT_BRIEF.md` | `GPT_HANDOFF_2026_06_25.md` |
| Generator pattern (`build_lab.js`) | `READ_FIRST.md`, `HANDOFF.md` | `CODEX_QUEUE.md`, `CHATGPT_BRIEF.md` |
| Flagship / hand-authored HTML pattern | `CHATGPT_BRIEF.md`, `HANDOFF.md` | `GPT_HANDOFF_2026_06_25.md` |
| Module anatomy: `build()`, `render()`, `heightField()` | `CHATGPT_BRIEF.md`, `CODEX_TASK_volumetric_extrude.md` | `EXPANSION_V2.md` |
| SHARED params (zoom, rot, mirror, cx, cy …) | `CHATGPT_BRIEF.md`, `CAMERA_CONTROLS_PLAN.md` | `NGL_TOTAL_AUDIT_20260627.md` |
| ALL_MODULES array (navigation) | `GPT_HANDOFF_2026_06_25.md`, `SESSION_BRIDGE.md` | — |
| Template generations A / B / C (control IDs) | `unified_shell_functionality_restoration_20260627.md` | — |
| Unified shell + iframe bridge architecture | `NGL_PLAN_06062026.md`, `CODEX_TASK_engine_shell.md` | `unified_shell_functionality_restoration_20260627.md` |
| postMessage bridge protocol | `CODEX_TASK_engine_shell.md`, `NGL_PLAN_06062026.md` | `unified_shell_functionality_restoration_20260627.md` |
| Module manifest (`modules.manifest.json`) | `NGL_PLAN_06062026.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` | — |
| Gallery (`gallery/index.html`) | `HANDOFF.md`, `GPT_HANDOFF_2026_06_25.md` | — |
| Escrow shell (candidate staging area) | `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`, `NGL_TOTAL_AUDIT_20260627.md` | `noixzy_randomization_geometry_audit_20260627.md` |

---

## C. Engineering Standards

| Topic | Primary Source | Secondary |
|---|---|---|
| Self-contained / CDN-only rule | `READ_FIRST.md`, `HANDOFF.md` | `CODEX_QUEUE.md` |
| p5.js global mode | `CHATGPT_BRIEF.md`, `SESSION_BRIDGE.md` | `GPT_HANDOFF_2026_06_25.md` |
| UI binds in `setup()`, never `DOMContentLoaded` | `READ_FIRST.md`, `CHATGPT_BRIEF.md` | `HANDOFF.md`, `CODEX_QUEUE.md` |
| `dirty` flag + re-render pattern | `CHATGPT_BRIEF.md` | `CODEX_TASK_volumetric_extrude.md` |
| `animT` / time-based animation | `CHATGPT_BRIEF.md` | — |
| `mix()` GLSL-only rule | `SESSION_BRIDGE.md`, `GPT_HANDOFF_2026_06_25.md` | `CHATGPT_BRIEF.md` |
| `_edgeMask()` edge-fade helper | `SESSION_BRIDGE.md` | — |
| `makeField(N, fn)` pixel grid helper | `EXPANSION_V2.md` (ChatGPT handoff block) | — |
| `heightField(G)` → `Float32Array` | `CODEX_TASK_volumetric_extrude.md`, `CHATGPT_BRIEF.md` | — |
| `renderHeightfield()` shared iso renderer | `CHATGPT_BRIEF.md`, `CODEX_TASK_volumetric_extrude.md` | — |
| Naming: `noixzy_<module_id>.html` | `HANDOFF.md`, `GPT_HANDOFF_2026_06_25.md` | — |
| Author credit: "Chris Tucker" only | `READ_FIRST.md`, `SESSION_BRIDGE.md` | `CHATGPT_BRIEF.md` |
| Mirror workflow (Downloads copy) | `READ_FIRST.md`, `CODEX_QUEUE.md` | `HANDOFF.md` |
| Browser verify rule | `READ_FIRST.md`, `CODEX_QUEUE.md` | `CAMERA_CONTROLS_PLAN.md` |
| Git: explicit adds only, never `git add .` | `NGL_UNIFIED_SHELL_HANDOFF_20260627.md` | — |
| Commit per-file scope | `NGL_UNIFIED_SHELL_HANDOFF_20260627.md` | — |
| No `.bak` files committed | `unified_shell_functionality_restoration_20260627.md` | — |

---

## D. Parameter Schema

| Topic | Primary Source | Secondary |
|---|---|---|
| Param shape `{k, g, label, min, max, step, v}` | `CHATGPT_BRIEF.md` | `CODEX_TASK_engine_shell.md` |
| Groups: system, extrude, material, frame, look, motion | `CHATGPT_BRIEF.md`, `HANDOFF.md` | — |
| PALETTES shape `[[r,g,b]bg, [r,g,b]acc, [r,g,b]ink]` | `CHATGPT_BRIEF.md`, `HANDOFF.md` | `EXPANSION_V2.md` |
| Theme system spec | `CODEX_TASK_theme_system.md` | `CHATGPT_BRIEF.md` |
| `localStorage['noixzy_lab_theme']` persistence key | `CODEX_TASK_theme_system.md`, `CHATGPT_BRIEF.md` | — |
| Palette count (12 current) | `CHATGPT_BRIEF.md` | `HANDOFF.md` (10 earlier), `SESSION_BRIDGE.md` |
| `P` live params object | `CHATGPT_BRIEF.md`, `CODEX_TASK_volumetric_extrude.md` | — |

---

## E. Visual Language

| Topic | Primary Source | Secondary |
|---|---|---|
| 3-value luminance structure (dark/mid/bright focal) | `IDEAS_module_expansion.md` Part 3 | `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` |
| Noir / CRT aesthetic | `NGL_UNIFIED_SHELL_HANDOFF_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` | `NGL_TOTAL_AUDIT_20260627.md` |
| Palette discipline (3-value, 2 hues + 1 neutral) | `IDEAS_module_expansion.md` Part 3 | — |
| Negative space as a first-class param | `IDEAS_module_expansion.md` Parts 3 & 5 | `ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md` |
| SDF philosophy (genuine vs 2.5D illusion) | `NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` | — |
| Iso heightfield extrude / painter's algorithm | `CODEX_TASK_volumetric_extrude.md`, `CHATGPT_BRIEF.md` | — |
| Camera: cx/cy pan, orbit radius u_dist, elevation u_elev | `CAMERA_CONTROLS_PLAN.md`, `NGL_TOTAL_AUDIT_20260627.md` | — |
| Finishing defaults (contrast, vignette, grain, glow) | `IDEAS_module_expansion.md` Part 3 | `CHATGPT_BRIEF.md` |
| Architectural / algorithmic module categories | `ALGORITHMIC_ARCHITECTURAL_ART.md`, `ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md` | — |
| Motion graphics / music-visual intent | `OVERVIEW.md`, `IDEAS_module_expansion.md` | `FUTURE_INSTALLMENTS.md` |

---

## F. UI / Shell Design

| Topic | Primary Source | Secondary |
|---|---|---|
| Unified shell visual spec (CRT rail, badge, glow) | `NGL_UNIFIED_SHELL_HANDOFF_20260627.md` | `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` |
| CSS targets (`.rail`, `.logoOverlay`, `.thumbRail` …) | `NGL_UNIFIED_SHELL_HANDOFF_20260627.md` | — |
| Module button opacity tiers (.50/.58/.64) | `NGL_TOTAL_AUDIT_20260627.md` | — |
| Control strip (unified shell) | `unified_shell_functionality_restoration_20260627.md` | — |
| Bridge action ID lookup order | `unified_shell_functionality_restoration_20260627.md` | — |
| Settings menu: safe vs risky changes | `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` | — |
| Keyboard shortcuts | `CODEX_TASK_engine_shell.md`, `CHATGPT_BRIEF.md` | `unified_shell_functionality_restoration_20260627.md` |

---

## G. QA & Performance

| Topic | Primary Source | Secondary |
|---|---|---|
| CPU/GPU risk tiers per module type | `NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` | — |
| Lighter alternatives for heavy modules | `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` | `NGL_TOTAL_AUDIT_20260627.md` |
| `heightField` performance budget (G≈130, 50fps) | `CODEX_TASK_volumetric_extrude.md` | — |
| `thumbnails must NOT use loading="lazy"` | `HANDOFF.md` | — |
| `contact_sheet.js` / gallery thumb refresh | `READ_FIRST.md`, `HANDOFF.md` | — |
| Additive work rule (no regressions) | `READ_FIRST.md`, `CODEX_QUEUE.md` | — |

---

## H. Roadmap & Task State

| Topic | Primary Source | Secondary |
|---|---|---|
| Codex task queue (ordered) | `CODEX_QUEUE.md` | `HANDOFF.md` |
| Volumetric extrude spec (Task 1) | `CODEX_TASK_volumetric_extrude.md` | `CODEX_QUEUE.md` |
| Theme system spec (Task 7) | `CODEX_TASK_theme_system.md` | `CODEX_QUEUE.md` |
| Engine shell spec | `CODEX_TASK_engine_shell.md`, `NGL_PLAN_06062026.md` | — |
| Camera controls plan | `CAMERA_CONTROLS_PLAN.md` | `NGL_TOTAL_AUDIT_20260627.md` |
| Module escrow tier system (1/2/3) | `NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` | — |
| Module expansion roadmap (algorithmic) | `ALGORITHMIC_ARCHITECTURAL_ART.md`, `IDEAS_module_expansion.md` | `EXPANSION_V2.md` |
| Module expansion roadmap (architectural) | `ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md` | — |
| What is NOT yet built | `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` §"What is explicitly NOT done yet" | `HANDOFF.md` |

---

## I. Blender Pipeline

| Topic | Primary Source | Secondary |
|---|---|---|
| Displacement map pipeline | `HANDOFF.md` | `OVERVIEW.md` |
| Blender project locations | `HANDOFF.md` | `READ_FIRST.md` |
| SDF → Blender metaballs | `HANDOFF.md` | — |
| Voronoi → scatter field | `HANDOFF.md` | — |
| PBR map export spec (Task 2) | `CODEX_QUEUE.md` | — |
| Blender bridge JSON (future) | `FUTURE_INSTALLMENTS.md`, `IDEAS_module_expansion.md` | — |

---

## J. Cross-references

| Concept A | Concept B | Where the connection is made |
|---|---|---|
| `heightField(G)` | volumetric extrude (Task 1) | `CODEX_TASK_volumetric_extrude.md` |
| `heightField(G)` | PBR export (Task 2) | `CODEX_QUEUE.md` |
| `heightField(G)` | SVG export (Task 5) | `CODEX_QUEUE.md` |
| Gray-Scott presets | reaction_diffusion | `IDEAS_module_expansion.md` Part 1 §B.12 |
| `animT` | per-frame animation gates | `CHATGPT_BRIEF.md` |
| `_edgeMask()` | heightField borders | `SESSION_BRIDGE.md` |
| `cx/cy` pan | camera Phase 1 | `CAMERA_CONTROLS_PLAN.md`, `NGL_TOTAL_AUDIT_20260627.md` |
| `u_dist`/`u_elev` | camera Phase 2 (SDF orbit) | `CAMERA_CONTROLS_PLAN.md` |
| Experimental Physics checkbox | canvas CSS drift (not geometry) | `NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` |
| CRT rail CSS | `.logoOverlay` badge | `NGL_UNIFIED_SHELL_HANDOFF_20260627.md` |
| `noixzy_lab_theme` key | theme persistence across modules | `CODEX_TASK_theme_system.md` |
| Escrow tier 1 candidates | promotion to unified shell | `NGL_TOTAL_AUDIT_20260627.md` §14 |
