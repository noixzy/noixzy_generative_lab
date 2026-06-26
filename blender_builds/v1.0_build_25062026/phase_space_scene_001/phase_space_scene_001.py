# Author: Chris Tucker and OpenAI
# Phase Space Scene 001 — headless procedural Blender production scene

from __future__ import annotations

import os
import sys
from pathlib import Path

import bpy

THIS = Path(__file__).resolve()
SCENE_DIR = THIS.parent
RENDERS_DIR = SCENE_DIR / 'renders'
BLEND_PATH = SCENE_DIR / 'phase_space_scene_001.blend'
RENDER_PATH = RENDERS_DIR / 'phase_space_scene_001.png'
FLAT_COPY = Path('/Volumes/noixzy T5 EVO SSD/ASSET LIBRARY/______newDemo Renders/phase_space_scene_001.png')

sys.path.insert(0, str(SCENE_DIR))

from ps_math import FieldConfig
from ps_materials import build_materials
from ps_geometry import build_geometry
from ps_lighting import build_lighting
from ps_camera import build_camera
from ps_render import save_and_render
from ps_verify import verify


def clean_scene():
    print('[phase_space] clean scene')
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for datablock in [bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.textures, bpy.data.images]:
        for item in list(datablock):
            if item.users == 0:
                datablock.remove(item)


def set_units():
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.frame_set(1)


def main():
    print('=== PHASE SPACE SCENE 001 START ===')
    print(f'[phase_space] scene dir: {SCENE_DIR}')
    RENDERS_DIR.mkdir(parents=True, exist_ok=True)
    clean_scene()
    set_units()
    cfg = FieldConfig(seed=41017, swirl=1.18, fold=0.79, lift=0.31, drift=0.16)
    mats = build_materials()
    build_geometry(mats, cfg)
    build_lighting()
    build_camera()
    save_and_render(BLEND_PATH, RENDER_PATH, FLAT_COPY)
    verify([BLEND_PATH, RENDER_PATH, FLAT_COPY])
    print('=== PHASE SPACE SCENE 001 DONE ===')


if __name__ == '__main__':
    main()
