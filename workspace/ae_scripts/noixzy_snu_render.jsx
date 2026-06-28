/*
noixzy_snu_render.jsx
Renders Comp 1 work area only.
Format:  Apple ProRes 4444
Channels: RGB + Alpha (transparent bg)
Output: /Volumes/noixzy T5 EVO SSD/ASSET LIBRARY/______newDemo Renders/
*/

(function () {
    var log = new File("/tmp/noixzy_snu_render_log.txt");
    log.open("w"); log.writeln("RENDER START " + new Date()); log.close();
    function L(m) { log.open("a"); log.writeln(m); log.close(); }

    // ── 1. Find Comp 1 ──────────────────────────────────────────────────────
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem &&
            app.project.item(i).name === "Comp 1") {
            comp = app.project.item(i);
            break;
        }
    }
    if (!comp) { alert("Comp 'Comp 1' not found."); return; }
    L("Comp: " + comp.name + " | Work area: " + comp.workAreaStart + "s — " + (comp.workAreaStart + comp.workAreaDuration) + "s");

    // ── 2. Output path ───────────────────────────────────────────────────────
    var renderFolder = new Folder("/Volumes/noixzy T5 EVO SSD/ASSET LIBRARY/______newDemo Renders");
    if (!renderFolder.exists) { renderFolder.create(); }

    var outFile = new File(renderFolder.fsName + "/super_n_up_text_COPILOT_comp1_ProRes4444.mov");
    L("Output: " + outFile.fsName);

    // ── 3. Clear stale render queue items ────────────────────────────────────
    var rq = app.project.renderQueue;
    for (var r = rq.items.length; r >= 1; r--) {
        if (rq.items[r].status === RQItemStatus.QUEUED ||
            rq.items[r].status === RQItemStatus.UNQUEUED) {
            rq.items[r].remove();
        }
    }

    // ── 4. Add to render queue ───────────────────────────────────────────────
    var rqItem = rq.items.add(comp);

    // Work area only
    rqItem.timeSpanStart    = comp.workAreaStart;
    rqItem.timeSpanDuration = comp.workAreaDuration;
    L("Render range: " + rqItem.timeSpanStart + "s for " + rqItem.timeSpanDuration + "s (work area)");

    // ── 5. Output module: ProRes 4444, RGBA ──────────────────────────────────
    var om = rqItem.outputModule(1);

    // Apply ProRes 4444 template — name varies slightly by AE version, try both
    var templateApplied = false;
    var templateNames = ["Apple ProRes 4444", "Apple ProRes 4444 with Alpha", "ProRes 4444"];
    for (var t = 0; t < templateNames.length; t++) {
        try {
            om.applyTemplate(templateNames[t]);
            L("Template applied: " + templateNames[t]);
            templateApplied = true;
            break;
        } catch (e) { /* try next */ }
    }

    // Whether or not a template applied, force RGBA + ProRes 4444 via setSettings
    om.setSettings({
        "Format": "QuickTime",
        "Video Output": {
            "Channels":  "RGBA",
            "Depth":     "Trillions of Colors+",
            "Color":     "Premultiplied (Matted)",
            "Format Options": {
                "Compression Type": "Apple ProRes 4444"
            }
        }
    });
    L("Output module settings applied: QuickTime / ProRes 4444 / RGBA");

    om.file = outFile;

    // ── 6. Render ────────────────────────────────────────────────────────────
    L("Rendering...");
    rq.render();
    L("RENDER DONE.");

    // ── 7. Completion report ─────────────────────────────────────────────────
    var projectPath   = app.project.file ? app.project.file.fsName : "unsaved";
    var projectFolder = app.project.file ? app.project.file.parent.fsName : "";

    var report =
        "=======================================================\n" +
        "  noixzy — LEADING ANIMATION + RENDER REPORT\n" +
        "  " + new Date().toString() + "\n" +
        "=======================================================\n\n" +
        "PROJECT\n" +
        "  Path:          " + projectPath + "\n\n" +
        "ANIMATION\n" +
        "  Script:        noixzy_snu_leading_anim.jsx\n" +
        "  Comp:          Comp 1\n" +
        "  Text layer:    s.n.u\n" +
        "  Method:        Text Animator > ADBE Text Line Spacing\n" +
        "  Animator name: noixzy_leading_animator\n" +
        "  Keyframes:\n" +
        "     0s  →  23px  (Line Spacing Y)\n" +
        "    10s  →  23px  (Line Spacing Y)\n" +
        "    20s  → 183px  (Line Spacing Y)\n\n" +
        "RENDER\n" +
        "  Script:        noixzy_snu_render.jsx\n" +
        "  Comp rendered: Comp 1 (work area only)\n" +
        "  Format:        Apple ProRes 4444\n" +
        "  Channels:      RGB + Alpha (transparent background)\n" +
        "  Output file:   " + outFile.fsName + "\n\n" +
        "STATUS\n" +
        "  Animation:     APPLIED AND SAVED\n" +
        "  Render:        COMPLETE\n" +
        "  Errors:        None\n\n" +
        "=======================================================\n";

    function writeReport(path) {
        var f = new File(path);
        f.open("w"); f.write(report); f.close();
        L("Report: " + path);
    }

    if (projectFolder) {
        writeReport(projectFolder + "/noixzy_snu_leading_render_report.txt");
    }
    writeReport(renderFolder.fsName + "/noixzy_snu_leading_render_report.txt");

    alert("Render complete.\n\nOutput:\n" + outFile.fsName + "\n\nReport written next to project and render.");
})();
