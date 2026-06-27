// noixzy companion leading animator
// Adds leading animation to an existing text animator
// Select one text layer with an existing animator.

(function addLeadingToExisting() {
    app.beginUndoGroup("noixzy add leading to animator");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Open a comp and select one text layer.");
        app.endUndoGroup();
        return;
    }

    if (comp.selectedLayers.length !== 1) {
        alert("Select exactly one text layer.");
        app.endUndoGroup();
        return;
    }

    var layer = comp.selectedLayers[0];
    if (!layer.property("Source Text")) {
        alert("Selected layer is not a text layer.");
        app.endUndoGroup();
        return;
    }

    var textProps = layer.property("Text");
    var animators = textProps.property("Animators");

    if (animators.numProperties === 0) {
        alert("No existing animators found. Create one first.");
        app.endUndoGroup();
        return;
    }

    // Add to last animator
    var lastAnimator = animators.property(animators.numProperties);
    var animatorProps = lastAnimator.property("Properties");
    var lineSpacing = animatorProps.addProperty("ADBE Text Line Spacing");

    var startTime = comp.time;
    var midTime = startTime + 1.0;
    var endTime = startTime + 2.0;

    lineSpacing.setValueAtTime(startTime, [0, 6]);
    lineSpacing.setValueAtTime(midTime, [0, 48]);
    lineSpacing.setValueAtTime(endTime, [0, 6]);

    var easeIn = new KeyframeEase(0, 60);
    var easeOut = new KeyframeEase(0, 60);

    for (var i = 1; i <= lineSpacing.numKeys; i++) {
        lineSpacing.setTemporalEaseAtKey(i, [easeIn], [easeOut]);
        lineSpacing.setInterpolationTypeAtKey(
            i,
            KeyframeInterpolationType.BEZIER,
            KeyframeInterpolationType.BEZIER
        );
    }

    $.writeln("✓ Leading animation added to existing animator on: " + layer.name);

    app.endUndoGroup();
})();
