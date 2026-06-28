var f = new File('/tmp/ae_full_verify.txt');
f.open('w');
var proj = app.project;
f.write('PROJECT:' + (proj.file ? proj.file.fsName : 'NO_PROJECT') + '\n');
var comp = null;
for (var i = 1; i <= proj.numItems; i++) {
    if (proj.item(i) instanceof CompItem && proj.item(i).name === 'Comp 1') {
        comp = proj.item(i); break;
    }
}
f.write('COMP_1:' + (comp ? 'FOUND dur=' + comp.duration + 's fps=' + comp.frameRate : 'NOT_FOUND') + '\n');
var layer = null;
if (comp) {
    f.write('ALL_LAYERS:');
    for (var l = 1; l <= comp.numLayers; l++) { f.write('[' + comp.layer(l).name + ']'); }
    f.write('\n');
    for (var j = 1; j <= comp.numLayers; j++) {
        if (comp.layer(j).name === 's.n.u') { layer = comp.layer(j); break; }
    }
}
f.write('LAYER_SNU:' + (layer ? 'FOUND idx=' + layer.index : 'NOT_FOUND') + '\n');
if (layer) {
    var isText = !!layer.property('Source Text');
    f.write('IS_TEXT:' + isText + '\n');
    if (isText) {
        var anims = layer.property('Text').property('Animators');
        f.write('ANIM_COUNT:' + anims.numProperties + '\n');
        for (var k = 1; k <= anims.numProperties; k++) {
            f.write('ANIM_' + k + ':' + anims.property(k).name + '\n');
        }
    }
}
f.close();
