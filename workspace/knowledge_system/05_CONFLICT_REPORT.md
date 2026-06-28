# 05 — Conflict Report
# noixzy Generative Lab — Duplicated, Contradictory, Obsolete, and Unresolved Guidance

---

## How to read this report

Each entry names the conflict, where it appears, and a recommended resolution.
Severity ratings:
- **🔴 Breaking** — following the wrong version will corrupt the build or break modules
- **🟡 Confusing** — creates ambiguity for agents but does not break the build
- **⚪ Stale** — guidance that was once true but no longer matches current state

---

## 1. Duplicated Guidance

### D-01 — Module count stated differently across documents
**Conflict:**
- `READ_FIRST.md` (2026-06-23): "11 modules today"
- `HANDOFF.md` (2026-06-23): "11 modules"
- `GPT_HANDOFF_2026_06_25.md`: "23 total" (after 4 new standalones + metafluid)
- `SESSION_BRIDGE.md` (2026-06-25): "22 modules total"
- `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`: "48 modules registered in modules.manifest.json"
- `NGL_PLAN_06062026.md`: "47 gallery-listed live modules: 12 hand-authored and 35 generated"
- `unified_shell_functionality_restoration_20260627.md`: "58 in manifest, 57 enabled"

**Severity:** 🟡 Confusing — counts differ because they were written at different points
in time, and because "modules" means different things (gallery-listed, manifest-registered,
or including escrow candidates).

**Resolution:** The authoritative current count is the `modules.manifest.json` file itself.
As of 2026-06-27: **58 manifest entries (57 enabled)**. All earlier counts are snapshots.
Do not rely on any prose count.

---

### D-02 — Palette count stated as 10 vs 12
**Conflict:**
- `HANDOFF.md`: "10-palette selector"
- `OVERVIEW.md`: "10 color palettes"
- `CHATGPT_BRIEF.md`: "12 palettes (ember, mineral, violet, amber, graphite, cyan, acid, magenta, gold, neutral, copper, ice)"
- `IDEAS_module_expansion.md`: "10 palettes"

**Severity:** 🟡 Confusing — 10 was the original count; 12 is the current count per CHATGPT_BRIEF.

**Resolution:** There are now **12 palettes**. `CHATGPT_BRIEF.md` and the live `build_lab.js`
are authoritative. `HANDOFF.md` and `OVERVIEW.md` are outdated at this point.

---

### D-03 — `ALL_MODULES` array count stated as 22 vs 23
**Conflict:**
- `SESSION_BRIDGE.md` (2026-06-25): "ALL_MODULES array has 22 entries"
- `GPT_HANDOFF_2026_06_25.md`: "23 entries" (after metafluid was added)

**Severity:** 🟡 Confusing — metafluid was added between the two documents.
The `ALL_MODULES` array in `build_lab.js` and the live module files is authoritative.

**Resolution:** Read `build_lab.js` or any live module to get the current `ALL_MODULES`
count. Both documents are historical snapshots at different points in the same session.
As of 2026-06-25 end-of-session: **23 entries** (including metafluid).
The count has grown since — always read the live file.

---

### D-04 — Generated module count: 9 vs 12 vs 36+
**Conflict:**
- Early docs (`READ_FIRST.md`, `HANDOFF.md`, `CHATGPT_BRIEF.md`): "9 engine modules"
- `GPT_HANDOFF_2026_06_25.md`: "12 generated modules"
- `NGL_PLAN_06062026.md` (audit): "35 generated" (47 total − 12 hand-authored)
- `unified_shell_functionality_restoration_20260627.md`: "`node build_lab.js`: `done: 46 pieces`"

**Severity:** 🟡 Confusing — the generator has been expanded from the original 9 pieces.

**Resolution:** The `build_lab.js` PIECES array is authoritative. As of 2026-06-27:
**`node build_lab.js` reports `done: 46 pieces`**. Earlier counts (9, 12) are historical.

---

### D-05 — "Shared features go in engine first, then replicate into flagships"
This rule is stated in multiple documents and is consistent. However, the list of what
counts as a "flagship" varies:

- `READ_FIRST.md` / `HANDOFF.md`: 2 flagships — `grid_extrude`, `sdf_raymarch`
- `CHATGPT_BRIEF.md`: 6 flagships (adds gyroid, displacement, mandelbulb, fold)
- `GPT_HANDOFF_2026_06_25.md`: 8 GLSL SDF flagships (adds displacement_primitives, metafluid)

**Severity:** 🟡 Confusing only — the rule is consistent; only the count of flagships has grown.

**Resolution:** The rule stands. "Flagships" now means all hand-authored HTML modules:
`grid_extrude`, `sdf_raymarch`, `gyroid`, `displacement`, `displacement_primitives`,
`mandelbulb`, `fold`, `metafluid`, `hex_grid`, `rose_curve`, `lissajous_mesh`, `torus_knot`.

---

## 2. Contradictory Guidance

### C-01 — "Experimental Physics" label vs intended behavior
**Conflict:**
- `noixzy_randomization_geometry_audit_20260627.md` adds the `Experimental Physics` checkbox
  as module-level drift/breathing via CSS transform
- `NGL_TOTAL_AUDIT_20260627.md` and `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` both state
  the feature is misleadingly named and should be called **"Drift Mode"** — it is not physics
- The same reports recommend a future upgrade to wire real force accumulation into particle
  positions for modules like `pressure_thread_physics`

**Severity:** 🟡 Confusing — the feature exists under one name but is recommended for
renaming. Any agent implementing it should use "Drift Mode" labeling.

**Resolution:** Label the checkbox "Drift Mode" in any new or upgraded implementation.
Keep the CSS transform mechanism. Future physics integration is separate and must be
per-module, not a canvas-level CSS change.

---

### C-02 — Camera Phase 1 status: "not done" vs "already done"
**Conflict:**
- `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` (top): lists "Camera controls (cx/cy for
  generated modules)" as "explicitly NOT done yet"
- `NGL_TOTAL_AUDIT_20260627.md` §2a and §4: "cx/cy pan was **already fully wired** before
  this session" — status: ALREADY DONE. No action taken.

**Severity:** 🔴 Breaking if acted upon — an agent following the "not done" guidance
from the creative director report would attempt to add cx/cy again, potentially
introducing a duplicate or regression.

**Resolution:** Camera Phase 1 (cx/cy) is **complete**. The total audit report is the
correct reference — it directly inspected the code and confirmed the implementation.
The creative director report was based on an earlier known-state list that was stale
at the moment of writing.

---

### C-03 — "Extrude" label on 2D canvas modules
**Conflict:**
- `HANDOFF.md` documents an `extrude` control on all modules in the "depth" group
- `NGL_TOTAL_AUDIT_20260627.md` and `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` both state:
  "any 'extrude' slider that only changes canvas CSS transform is misleading and should be
  labeled 'depth illusion' or 'relief' instead"

**Severity:** 🟡 Confusing — the slider exists under the label "extrude" in generated modules,
but documentation calls it misleading. The underlying behavior is a stamp-offset, not geometry.

**Resolution:** The label conflict is unresolved at the code level. Future work should
rename the depth-illusion variant to "relief" when replacing it with `renderHeightfield`.
Until then, agents should understand that "extrude" in 2D canvas modules = depth illusion.

---

### C-04 — Whether `sdf` module is gallery-listed
**Conflict:**
- `NGL_PLAN_06062026.md` (audit): "`sdf` exists as generated but is not gallery-listed"
- `CHATGPT_BRIEF.md`: includes `sdf` in the per-piece params table; implies it is live
- `HANDOFF.md`: lists `sdf` as one of the 11 modules; includes it in the gallery order

**Severity:** 🟡 Confusing — `sdf` exists as a generated module but the gallery listing
may have been dropped at some point.

**Resolution:** Verify in `gallery/index.html`. If `sdf` is missing, add it. The `sdf`
module folder exists (`sdf/noixzy_sdf.html`) and the generator produces it.

---

## 3. Obsolete Guidance

### O-01 — `HANDOFF.md` read-order / task queue
**Stale content:** `HANDOFF.md` lists a task queue (Tasks 1–7 + Stretch) as "open / next steps."
Some of these tasks have been partially completed or superseded by later work.

**What is obsolete:** The task queue in `HANDOFF.md` does not reflect current completion
status. `CODEX_QUEUE.md` + `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` §"What is explicitly
NOT done yet" are the authoritative current state.

**Severity:** ⚪ Stale — will not break anything; just misleading for planning.

---

### O-02 — Old stage-message compatibility code in escrow runtimes
**Content:** Some escrow runtime files contain compatibility code for an earlier
`stage-message` shell protocol that is now inert. The randomization audit noted it
should be removed.

**Severity:** ⚪ Stale — inert code, does not break anything.

**Resolution:** Remove in a cleanup pass. Do not add new stage-message compatibility code.

---

### O-03 — `noixzy_lab_shell_v1.html` as the shell reference
**Content:** Multiple early documents reference `noixzy_lab_shell_v1.html` as "the shell
prototype" or "the design reference." As of 2026-06-27, `unified_shell.html` is the
production shell.

**Severity:** ⚪ Stale — `noixzy_lab_shell_v1.html` still exists but is a static prototype.
Do not edit it; use `unified_shell.html`.

---

### O-04 — `CODEX_TASK_widen_param_ranges.md`
**Content:** This task spec was merged into `CODEX_TASK_ranges_and_gradients.md` and
archived in `workspace/_archive_doc_merge_20260623_020226/`. The archived original should
not be used.

**Severity:** ⚪ Stale — the task was consolidated.

---

### O-05 — `SESSION_BRIDGE.md` resume order
**Content:** `SESSION_BRIDGE.md` states: "Resume order for any LLM: `CHATGPT_PROMPT.md`
→ this file → `NEXT_MODULES.md`"

This was the correct order as of 2026-06-25. Since then, the unified shell session and
the creative director / total audit reports have substantially updated the project state.
The new resume order should be `READ_FIRST.md` → the relevant `workspace/` context.

**Severity:** ⚪ Stale — any agent following the old resume order will miss significant
recent work.

---

### O-06 — `CHATGPT_PROMPT.md` as the single start-here file
**Content:** `SESSION_BRIDGE.md` describes `CHATGPT_PROMPT.md` as the definitive
start-here prompt for any ChatGPT session.

Given the scope of work since 2026-06-25, `CHATGPT_PROMPT.md` may not reflect current
module count, shell state, or task status.

**Severity:** 🟡 Confusing — agents should read `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`
and `NGL_TOTAL_AUDIT_20260627.md` for current state, not rely on `CHATGPT_PROMPT.md` alone.

---

## 4. Unresolved Decisions

### U-01 — Whether `sdf` should be gallery-visible
**Conflict:** `NGL_PLAN_06062026.md` identifies this as "a concrete metadata drift risk."
No decision has been documented.
**Action needed:** Decide: add `sdf` to `gallery/index.html` or mark it as internal-only.

---

### U-02 — `fold` stale manifest entry
**Conflict:** `unified_shell_functionality_restoration_20260627.md` notes a stale reference
to `fold/noixzy_fold.html` in `modules.manifest.json`. This was pre-existing before the
2026-06-27 session and was not resolved.
**Action needed:** Fix or retire the stale `fold` manifest entry.

---

### U-03 — "Extrude" slider rename for 2D canvas modules
**Conflict:** Current code uses "extrude" as the label; documentation recommends "relief"
or "depth illusion."
**Action needed:** Decide on the new label when implementing `renderHeightfield` to replace
the stamp-offset behavior.

---

### U-04 — Shell vs module audio ownership
**Conflict:** `NGL_PLAN_06062026.md` recommends the shell eventually owns the audio analyser
and sends normalized bands to modules. Current modules have local audio panels. No decision
has been made on which model to pursue first.
**Action needed:** Decide before implementing audio in any new module — local vs shell-owned.

---

### U-05 — Hand-authored module migration to Template A IDs
**Conflict:** Template C modules (gyroid, mandelbulb, displacement, etc.) lack support for
pause, reset, newSeed, randomForm, randomColor, randomAll, and transparentBg in the shell.
`unified_shell_functionality_restoration_20260627.md` recommends upgrading them to the new
template IDs but defers this to a future pass.
**Action needed:** Decide which Template C modules to upgrade, in which order.

---

### U-06 — Gallery metadata consolidation (three sources of truth)
**Conflict:** Gallery metadata exists in three places: `gallery/index.html`, `build_lab.js`
PIECES array, and `modules.manifest.json`. They are already drifting (`sdf` mismatch).
`NGL_PLAN_06062026.md` recommends consolidating to one manifest consumed by all three.
**Action needed:** Define the single source of truth and migration plan.

---

### U-07 — `bgAlpha` control ID
**Conflict:** `unified_shell_functionality_restoration_20260627.md` notes that `bgAlpha`
is listed as a target bridge ID in the spec but was not found in any module. It was
deferred.
**Action needed:** Verify whether `bgAlpha` should exist as a module control ID, and if
so, add it to the standard template.

---

### U-08 — Whether the escrow shell font should always be `ui-monospace`
**Conflict:** The unified shell uses `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
monospace` as a hard standard. The escrow shell was upgraded to match in the 2026-06-27
session. However, no formal document establishes this as the lab-wide font standard for
ALL shells (including future shells).
**Action needed:** Formally establish the monospace font stack as a project-wide standard
in the engineering standards (done in `03_ENGINEERING_STANDARDS.md` implicitly via the
unified shell spec, but not stated as a lab-wide rule).
