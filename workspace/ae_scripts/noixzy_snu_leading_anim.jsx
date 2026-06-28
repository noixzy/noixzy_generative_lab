/*
noixzy_snu_leading_anim.jsx
Target comp:  Comp 1
Target layer: s.n.u
Keyframes:    0s=23px  10s=23px  20s=183px
Method:       Text Animator > Range Selector (added FIRST) > Line Spacing
Fix:          Delete any existing noixzy_leading_animator, rebuild from scratch
              with selector added BEFORE properties — required by AE scripting.
*/

(function () {
    app.beginUndoGroup("noixzy animate s.n.u leading");

    var log = new File("/tmp/noixzy_snu_leading_log.txt");
    log.open("w");
    log.writeln("START " + new Date().toString());
    log.close();

    function L(msg) {
        log.open("a"); log.writeln(msg); log.close();
    }

    function bail(msg) {
        L("BAIL: " + msg);
        alert("noixzy_snu_leading_anim:\n" + msg + "\n\nSee log: /tmp/noixzy_snu_leading_log.txt");
        app.endUndoGroup();
    }

    // ── 1. Find Comp 1 ──────────────────────────────────────────────────────
    var comp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem &&
            app.project.item(i).name === "Comp 1") {
            comp = app.project.item(i);
            break;
        }
    }
    if (!comp) { bail("Comp 'Comp 1' not found."); return; }
    L("Comp found: " + comp.name + " (" + comp.duration + "s @ " + comp.frameRate + "fps)");

    // ── 2. Find layer s.n.u ──────────────────────────────────────────────────
    var layer = null;
    for (var j = 1; j <= comp.numLayers; j++) {
        if (comp.layer(j).name === "s.n.u") { layer = comp.layer(j); break; }
    }
    if (!layer) { bail("Layer 's.n.u' not found in Comp 1."); return; }
    L("Layer found: " + layer.name + " (index " + layer.index + ")");

    // ── 3. Confirm text layer ────────────────────────────────────────────────
    var textProps = layer.property("ADBE Text Properties");
    if (!textProps) { bail("Layer is not a text layer (no ADBE Text Properties)."); return; }
    var animators = textProps.property("ADBE Text Animators");
    if (!animators) { bail("ADBE Text Animators group not accessible."); return; }
    L("Text layer confirmed. Existing animators: " + animators.numProperties);

    // ── 4. Remove any existing noixzy_leading_animator ──────────────────────
    // Must start fresh — a partially-built animator from a previous run
    // will have its properties in a hidden state.
    for (var a = animators.numProperties; a >= 1; a--) {
        if (animators.property(a).name === "noixzy_leading_animator") {
            animators.property(a).remove();
            L("Removed existing noixzy_leading_animator.");
        }
    }

    // ── 5. Create animator ───────────────────────────────────────────────────
    var animator = animators.addProperty("ADBE Text Animator");
    animator.name = "noixzy_leading_animator";
    L("Created animator: " + animator.name);

    // ── 6. Add Range Selector FIRST (required before properties) ────────────
    var selectors = animator.property("ADBE Text Selectors");
    var sel = selectors.addProperty("ADBE Text Selector");
    L("Range Selector added. Selectors now: " + selectors.numProperties);

    // ── 7. Add Line Spacing property ─────────────────────────────────────────
    var animProps = animator.property("ADBE Text Animator Properties");
    if (!animProps) { bail("ADBE Text Animator Properties not found after build."); return; }
    var lineSpacing = animProps.addProperty("ADBE Text Line Spacing");
    if (!lineSpacing) { bail("addProperty('ADBE Text Line Spacing') returned null."); return; }
    L("Line Spacing property added. isModified=" + lineSpacing.isModified);

    // ── 8. Keyframe ──────────────────────────────────────────────────────────
    lineSpacing.setValueAtTime(0,  [0, 23]);
    lineSpacing.setValueAtTime(10, [0, 23]);
    lineSpacing.setValueAtTime(20, [0, 183]);
    L("Keyframes set: 0s=[0,23]  10s=[0,23]  20s=[0,183]");
    L("numKeys: " + lineSpacing.numKeys);

    // ── 9. Save ───────────────────────────────────────────────────────────────
    if (app.project.file) {
        app.project.save(app.project.file);
        L("Project saved: " + app.project.file.fsName);
    } else {
        L("WARNING: Project has no file path — save skipped.");
    }

    L("DONE — noixzy_snu_leading_anim completed successfully.");
    app.endUndoGroup();
})();
