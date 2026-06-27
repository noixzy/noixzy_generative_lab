// noixzy animated leading setup
// Select one text layer in After Effects before running.

(function animateLeading() {
    app.beginUndoGroup("noixzy animate leading");

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
    var animator = animators.addProperty("ADBE Text Animator");
    animator.name = "noixzy_leading_animator";

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

    for (var i = 1; i <= lineSpacing.numKeys; i++) {
        lineSpacing.setTemporalEaseAtKey(i, [easeIn], [easeOut]);
        lineSpacing.setInterpolationTypeAtKey(
            i,
            KeyframeInterpolationType.BEZIER,
            KeyframeInterpolationType.BEZIER
        );
    }

    app.endUndoGroup();
})();
