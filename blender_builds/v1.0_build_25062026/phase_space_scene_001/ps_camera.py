# Author: Chris Tucker and OpenAI
from __future__ import annotations

import math
import bpy
from mathutils import Vector


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def build_camera():
    print('[phase_space] placing camera — rev framed wide 16:9')

    # Target is slightly above center so the mass feels suspended, not dumped in frame.
    bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0.0, 0.15, 0.35))
    target = bpy.context.object
    target.name = 'PS_camera_target'

    # Pulled back and raised. This shows the full vector-field body instead of macro ribbons.
    bpy.ops.object.camera_add(location=(13.8, -20.5, 8.2))
    cam = bpy.context.object
    cam.name = 'CAM_phase_space_scene_001'
    cam.data.name = 'CAMDATA_phase_space_scene_001'

    look_at(cam, target.location)

    # Wider than before. 95mm was too compressed/close for this structure.
    cam.data.lens = 52
    cam.data.sensor_width = 36

    # Keep cinematic depth, but not so shallow that the scene becomes a texture crop.
    cam.data.dof.use_dof = True
    cam.data.dof.focus_object = target
    cam.data.dof.aperture_fstop = 9.5

    # 16:9 safe framing with slight vertical headroom.
    cam.data.shift_x = 0.0
    cam.data.shift_y = -0.035

    bpy.context.scene.camera = cam
    return cam
