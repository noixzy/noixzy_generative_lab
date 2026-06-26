# Author: Chris Tucker and OpenAI
from __future__ import annotations

import math
import random
from typing import Sequence

import bpy
from mathutils import Vector

from ps_math import FieldConfig, integrate_streamline, length, seeded_shell_points, smoothstep


def ensure_collection(name: str):
    col = bpy.data.collections.get(name)
    if not col:
        col = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(col)
    return col


def curve_from_points(name: str, pts, radius: float, mat, collection, bevel_resolution=2, resolution=3):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.resolution_u = resolution
    cu.bevel_depth = radius
    cu.bevel_resolution = bevel_resolution
    cu.twist_smooth = 6
    spl = cu.splines.new('POLY')
    spl.points.add(len(pts) - 1)
    for pnt, co in zip(spl.points, pts):
        pnt.co = (co[0], co[1], co[2], 1.0)
    obj = bpy.data.objects.new(name, cu)
    obj.data.materials.append(mat)
    collection.objects.link(obj)
    return obj


def make_streamlines(mats, cfg: FieldConfig, count: int = 1800):
    print(f'[phase_space] generating {count} field curves')
    col = ensure_collection('PS_streamlines')
    starts = seeded_shell_points(count, 6.2, cfg)
    rnd = random.Random(cfg.seed + 881)
    materials = [mats['dark_chrome'], mats['black_titanium'], mats['brushed_aluminum'], mats['blue_edge']]
    objs = []
    for i, start in enumerate(starts):
        local_steps = rnd.randint(22, 74)
        step_size = rnd.uniform(0.075, 0.18)
        pts = integrate_streamline(start, local_steps, step_size, cfg, jitter=0.18)
        if len(pts) < 4:
            continue
        radial = length(start)
        radius = 0.0035 + 0.022 * smoothstep(1.2, 6.4, radial) * (0.45 + rnd.random() * 0.9)
        mat = materials[0]
        roll = rnd.random()
        if roll > 0.965:
            mat = mats['hot_blue']
            radius *= 1.25
        elif roll > 0.82:
            mat = mats['blue_edge']
        elif roll > 0.46:
            mat = mats['black_titanium']
        elif roll > 0.22:
            mat = mats['brushed_aluminum']
        obj = curve_from_points(f'PS_streamline_{i:04d}', pts, radius, mat, col)
        obj.rotation_euler[2] += math.sin(i * 12.9898) * 0.01
        objs.append(obj)
        if i and i % 250 == 0:
            print(f'[phase_space] curve progress {i}/{count}')
    return objs


def make_ribbon_arcs(mats, cfg: FieldConfig, count: int = 72):
    print(f'[phase_space] generating {count} wider ribbon arcs')
    col = ensure_collection('PS_primary_ribbons')
    rnd = random.Random(cfg.seed + 1201)
    objs = []
    for i in range(count):
        ang = (i / count) * math.tau + rnd.uniform(-0.04, 0.04)
        rad = rnd.uniform(2.0, 6.6)
        z = rnd.uniform(-2.0, 2.3)
        start = (math.cos(ang) * rad, math.sin(ang) * rad, z)
        pts = integrate_streamline(start, rnd.randint(80, 135), rnd.uniform(0.115, 0.205), cfg, jitter=0.09)
        obj = curve_from_points(f'PS_primary_ribbon_{i:03d}', pts, rnd.uniform(0.026, 0.064), mats['black_titanium'] if i % 3 else mats['brushed_aluminum'], col, bevel_resolution=5, resolution=5)
        objs.append(obj)
    return objs


def add_micro_nodes(mats, count: int = 380):
    print(f'[phase_space] adding {count} micro highlight nodes')
    col = ensure_collection('PS_micro_nodes')
    rnd = random.Random(92341)
    mesh = bpy.data.meshes.new('PS_micro_node_mesh')
    verts = []
    faces = []
    # create one lowpoly octahedron mesh duplicated as instances via object copies
    verts = [(0,0,0.055),(0.055,0,0),(0,0.055,0),(-0.055,0,0),(0,-0.055,0),(0,0,-0.055)]
    faces = [(0,1,2),(0,2,3),(0,3,4),(0,4,1),(5,2,1),(5,3,2),(5,4,3),(5,1,4)]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    base = bpy.data.objects.new('PS_micro_node_BASE', mesh)
    base.data.materials.append(mats['hot_blue'])
    col.objects.link(base)
    base.hide_viewport = True
    base.hide_render = True
    for i in range(count):
        obj = base.copy()
        obj.data = base.data
        r = rnd.uniform(1.1, 6.4)
        a = rnd.uniform(0, math.tau)
        z = rnd.uniform(-2.6, 2.6)
        obj.location = (math.cos(a)*r, math.sin(a)*r, z)
        s = rnd.uniform(0.25, 1.05)
        obj.scale = (s, s, s)
        obj.rotation_euler = (rnd.random()*math.tau, rnd.random()*math.tau, rnd.random()*math.tau)
        obj.hide_viewport = False
        obj.hide_render = False
        col.objects.link(obj)


def add_boundary_glass(mats):
    print('[phase_space] adding smoked boundary glass planes and graphite floor')
    col = ensure_collection('PS_environment_geometry')
    bpy.ops.mesh.primitive_plane_add(size=18, location=(0,0,-3.15), rotation=(0,0,0))
    floor = bpy.context.object
    floor.name = 'PS_graphite_floor'
    floor.data.materials.append(mats['floor'])
    if floor.name not in col.objects:
        try:
            bpy.context.collection.objects.unlink(floor)
        except Exception:
            pass
        col.objects.link(floor)
    for name, loc, rot, scale in [
        ('PS_back_smoked_glass', (0, 4.85, 0.4), (math.radians(74), 0, 0), (1.0, 1.0, 1.0)),
        ('PS_left_smoked_glass', (-5.9, 0, 0.5), (0, math.radians(76), math.radians(90)), (0.75, 1.0, 1.0)),
        ('PS_right_smoked_glass', (5.9, 0, 0.5), (0, math.radians(-76), math.radians(90)), (0.75, 1.0, 1.0)),
    ]:
        bpy.ops.mesh.primitive_plane_add(size=10.5, location=loc, rotation=rot)
        p = bpy.context.object
        p.name = name
        p.scale = scale
        p.data.materials.append(mats['glass'])
        try:
            bpy.context.collection.objects.unlink(p)
        except Exception:
            pass
        col.objects.link(p)


def build_geometry(mats, cfg: FieldConfig):
    make_streamlines(mats, cfg, count=1650)
    make_ribbon_arcs(mats, cfg, count=84)
    add_micro_nodes(mats, count=420)
    add_boundary_glass(mats)
