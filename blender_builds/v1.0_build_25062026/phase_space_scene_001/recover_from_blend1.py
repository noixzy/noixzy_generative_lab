import bpy
from pathlib import Path

build = Path("/Users/noixzy.macbookpro/Downloads/noixzy_generative_lab/blender_builds/v1.0_build_25062026/phase_space_scene_001")
old_blend = build / "phase_space_scene_001.blend1"
out = build / "renders" / "recovery" / "phase_space_scene_001_RECOVERED_FROM_BLEND1.png"

print(f"[recover] opening {old_blend}")
bpy.ops.wm.open_mainfile(filepath=str(old_blend))

scene = bpy.context.scene
scene.render.filepath = str(out)
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

print(f"[recover] rendering to {out}")
bpy.ops.render.render(write_still=True)

if not out.exists() or out.stat().st_size < 100_000:
    raise RuntimeError(f"Recovery render failed or too small: {out}")

print(f"[recover] complete: {out}")
