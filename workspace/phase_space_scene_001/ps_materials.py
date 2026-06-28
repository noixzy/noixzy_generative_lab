# Author: Chris Tucker and OpenAI
from __future__ import annotations

import bpy


def make_principled(name: str, base=(0.02, 0.02, 0.024, 1), metallic=1.0, roughness=0.28, alpha=1.0, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.diffuse_color = base
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    if bsdf:
        def set_input(names, value):
            for n in names:
                if n in bsdf.inputs:
                    bsdf.inputs[n].default_value = value
                    return
        set_input(['Base Color'], base)
        set_input(['Metallic'], metallic)
        set_input(['Roughness'], roughness)
        set_input(['Alpha'], alpha)
        if emission:
            set_input(['Emission Color', 'Emission'], emission)
            set_input(['Emission Strength'], strength)
    if alpha < 1.0:
        mat.blend_method = 'BLEND'
        mat.use_screen_refraction = True
        mat.show_transparent_back = True
    return mat


def build_materials():
    mats = {}
    mats['dark_chrome'] = make_principled('PS_dark_chrome', (0.012, 0.013, 0.016, 1), 1.0, 0.18)
    mats['black_titanium'] = make_principled('PS_black_titanium', (0.025, 0.023, 0.028, 1), 1.0, 0.34)
    mats['brushed_aluminum'] = make_principled('PS_brushed_aluminum', (0.52, 0.53, 0.55, 1), 1.0, 0.22)
    mats['blue_edge'] = make_principled('PS_faint_blue_emission', (0.05, 0.08, 0.11, 1), 0.35, 0.31, emission=(0.05, 0.35, 0.95, 1), strength=0.42)
    mats['hot_blue'] = make_principled('PS_internal_blue_glow', (0.01, 0.035, 0.08, 1), 0.0, 0.4, emission=(0.02, 0.28, 0.9, 1), strength=1.8)
    mats['floor'] = make_principled('PS_absorbing_graphite_floor', (0.009, 0.009, 0.011, 1), 0.0, 0.62)
    mats['glass'] = make_principled('PS_smoked_boundary_glass', (0.06, 0.075, 0.09, 0.23), 0.0, 0.04, alpha=0.23)
    return mats
