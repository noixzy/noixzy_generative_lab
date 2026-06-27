// noixzy custom leading keyframe animator
// Custom keyframes: Frame 0 @ 23px → Frame 20 @ 183px
// Select one text layer in After Effects before running.

(function customLeadingAnimation() {
    app.beginUndoGroup("noixzy custom leading keyframes");

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

    // Custom config
    var config = {
        startLeading: 23,      // Frame 0
        endLeading: 183,       // Frame 20
        frameCount: 20,        // Total frames
        ease: true
    };

    var textProps = layer.property("Text");
    var animators = textProps.property("Animators");
    var animator = animators.addProperty("ADBE Text Animator");
    animator.name = "noixzy_leading_custom";

    var animatorProps = animator.property("Properties");
    var lineSpacing = animatorProps.addProperty("ADBE Text Line Spacing");

    // Calculate times in seconds (assuming 24fps)
    var frameRate = comp.frameRate;
    var startTime = comp.time;
    var endTime = startTime + (config.frameCount / frameRate);

    // Set keyframes
    lineSpacing.setValueAtTime(startTime, [0, config.startLeading]);
    lineSpacing.setValueAtTime(endTime, [0, config.endLeading]);

    // Apply easing if enabled
    if (config.ease) {
        var easeIn = new KeyframeEase(0, 50);
        var easeOut = new KeyframeEase(0, 50);

        for (var i = 1; i <= lineSpacing.numKeys; i++) {
            lineSpacing.setTemporalEaseAtKey(i, [easeIn], [easeOut]);
            lineSpacing.setInterpolationTypeAtKey(
                i,
                KeyframeInterpolationType.BEZIER,
                KeyframeInterpolationType.BEZIER
            );
        }
    }

    $.writeln("✓ Custom leading animation applied");
    $.writeln("  Layer: " + layer.name);
    $.writeln("  Frame 0: " + config.startLeading + "px leading");
    $.writeln("  Frame " + config.frameCount + ": " + config.endLeading + "px leading");
    $.writeln("  Easing: Bezier smooth");

    app.endUndoGroup();
})();
