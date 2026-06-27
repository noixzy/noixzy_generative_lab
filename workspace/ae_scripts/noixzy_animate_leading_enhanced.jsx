// noixzy enhanced leading animator
// Animates text leading with customizable easing and duration
// Select one text layer in After Effects before running.

(function animateLeadingEnhanced() {
    app.beginUndoGroup("noixzy animate leading enhanced");

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

    // Configuration
    var config = {
        startLeading: 6,
        peakLeading: 48,
        endLeading: 6,
        duration: 2.0,
        easeStrength: 60
    };

    var textProps = layer.property("Text");
    var animators = textProps.property("Animators");
    var animator = animators.addProperty("ADBE Text Animator");
    animator.name = "noixzy_leading_enhanced";

    var animatorProps = animator.property("Properties");
    var lineSpacing = animatorProps.addProperty("ADBE Text Line Spacing");

    var startTime = comp.time;
    var midTime = startTime + (config.duration / 2);
    var endTime = startTime + config.duration;

    lineSpacing.setValueAtTime(startTime, [0, config.startLeading]);
    lineSpacing.setValueAtTime(midTime, [0, config.peakLeading]);
    lineSpacing.setValueAtTime(endTime, [0, config.endLeading]);

    var easeIn = new KeyframeEase(0, config.easeStrength);
    var easeOut = new KeyframeEase(0, config.easeStrength);

    for (var i = 1; i <= lineSpacing.numKeys; i++) {
        lineSpacing.setTemporalEaseAtKey(i, [easeIn], [easeOut]);
        lineSpacing.setInterpolationTypeAtKey(
            i,
            KeyframeInterpolationType.BEZIER,
            KeyframeInterpolationType.BEZIER
        );
    }

    $.writeln("✓ Enhanced leading animation added to: " + layer.name);
    $.writeln("  Duration: " + config.duration + "s | Peak: " + config.peakLeading + "px");

    app.endUndoGroup();
})();
