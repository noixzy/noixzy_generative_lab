# Author: Chris Tucker and OpenAI
from __future__ import annotations

import os
import shutil
from pathlib import Path
import bpy


def enable_gpu():
    print('[phase_space] enabling GPU if available')
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        # Mac first, then fallback.
        for ctype in ['METAL', 'OPTIX', 'CUDA', 'HIP', 'ONEAPI']:
            try:
                prefs.compute_device_type = ctype
                prefs.get_devices()
                if prefs.devices:
                    for d in prefs.devices:
                        d.use = True
                    scene.cycles.device = 'GPU'
                    print(f'[phase_space] GPU compute: {ctype}')
                    return
            except Exception:
                pass
    except Exception as exc:
        print(f'[phase_space] GPU preference unavailable: {exc}')
    scene.cycles.device = 'CPU'
    print('[phase_space] using CPU render fallback')


def configure_render(output_png: Path):
    scene = bpy.context.scene
    enable_gpu()
    scene.render.resolution_x = 2400
    scene.render.resolution_y = 2400
    scene.render.film_transparent = False
    scene.cycles.samples = 256
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.035
    try:
        scene.cycles.denoiser = 'OPENIMAGEDENOISE'
        scene.cycles.use_denoising = True
    except Exception:
        pass
    scene.view_settings.view_transform = 'Filmic'
    scene.view_settings.look = 'Medium High Contrast'
    scene.view_settings.exposure = -0.15
    scene.view_settings.gamma = 1.0
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '16'
    scene.render.filepath = str(output_png)


def save_and_render(blend_path: Path, render_path: Path, flat_copy_path: Path):
    print(f'[phase_space] saving blend: {blend_path}')
    blend_path.parent.mkdir(parents=True, exist_ok=True)
    render_path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
    configure_render(render_path)
    print(f'[phase_space] rendering: {render_path}')
    bpy.ops.render.render(write_still=True)
    if not render_path.exists() or render_path.stat().st_size < 100_000:
        raise RuntimeError(f'Render failed or too small: {render_path}')
    try:
        flat_copy_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(render_path, flat_copy_path)
        print(f'[phase_space] flat browse copy: {flat_copy_path}')
    except Exception as exc:
        print(f'[phase_space] flat browse copy skipped: {exc}')
