// noixzy batch leading animator
// Applies leading animation to ALL text layers in composition
// No selection required.

(function animateLeadingBatch() {
    app.beginUndoGroup("noixzy batch leading animation");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Open a composition.");
        app.endUndoGroup();
        return;
    }

    var textLayers = [];
    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        if (layer.property("Source Text")) {
            textLayers.push(layer);
        }
    }

    if (textLayers.length === 0) {
        alert("No text layers found in composition.");
        app.endUndoGroup();
        return;
    }

    var applied = 0;
    for (var t = 0; t < textLayers.length; t++) {
        var layer = textLayers[t];
        var textProps = layer.property("Text");
        var animators = textProps.property("Animators");
        var animator = animators.addProperty("ADBE Text Animator");
        animator.name = "noixzy_leading_batch_" + (t + 1);

        var animatorProps = animator.property("Properties");
        var lineSpacing = animatorProps.addProperty("ADBE Text Line Spacing");

        var startTime = comp.time;
        var midTime = startTime + 1.0;
        var endTime = startTime + 2.0;

        lineSpacing.setValueAtTime(startTime, [0, 6]);
        lineSpacing.setValueAtTime(midTime, [0, 48]);
        lineSpacing.setValueAtTime(endTime, [0, 6]);

        var easeIn = new KeyframeEase(0, 60);
        var easeOut = new KeyframeEase(0, 60);

        for (var k = 1; k <= lineSpacing.numKeys; k++) {
            lineSpacing.setTemporalEaseAtKey(k, [easeIn], [easeOut]);
            lineSpacing.setInterpolationTypeAtKey(
                k,
                KeyframeInterpolationType.BEZIER,
                KeyframeInterpolationType.BEZIER
            );
        }

        applied++;
    }

    $.writeln("✓ Batch leading animation complete");
    $.writeln("  Applied to " + applied + " text layer(s)");

    app.endUndoGroup();
})();
