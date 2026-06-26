import math
import os
import random
from datetime import datetime

import bpy
from mathutils import Vector


PROJECT_DIR = "/Users/noixzy.macbookpro/Documents/__Blender 5.1 Projects"
RENDER_DIR = "/Volumes/noixzy T5 EVO SSD/ASSET LIBRARY/______newDemo Renders"

STAMP = datetime.now().strftime("%Y%m%d_%H%M%S")
VARIANT = os.environ.get("NOIXZY_LATTICE_VARIANT", "hybrid")
SEED = int(os.environ.get("NOIXZY_LATTICE_SEED", "5719"))
BASE = f"noixzy_neural_lattice_{VARIANT}_{STAMP}"
BLEND_PATH = os.path.join(PROJECT_DIR, BASE + ".blend")


def ensure_dirs():
    os.makedirs(PROJECT_DIR, exist_ok=True)
    os.makedirs(RENDER_DIR, exist_ok=True)


def clear_default_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def make_mat(name, color, emission=None, strength=0.0, alpha=1.0, metallic=0.0, roughness=0.45):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.blend_method = "BLEND" if alpha < 1.0 else "OPAQUE"
    mat.use_screen_refraction = alpha < 1.0
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        if "Base Color" in bsdf.inputs:
            bsdf.inputs["Base Color"].default_value = color
        if "Alpha" in bsdf.inputs:
            bsdf.inputs["Alpha"].default_value = alpha
        if "Metallic" in bsdf.inputs:
            bsdf.inputs["Metallic"].default_value = metallic
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = roughness
        if emission and "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = emission
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = strength
    return mat


def link_object(obj, collection):
    for c in obj.users_collection:
        c.objects.unlink(obj)
    collection.objects.link(obj)


def make_curve(name, points, mat, bevel_depth, collection, resolution=3):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = resolution
    curve.bevel_depth = bevel_depth
    curve.bevel_resolution = 3
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for p, co in zip(spline.points, points):
        p.co = (co.x, co.y, co.z, 1.0)
    obj = bpy.data.objects.new(name, curve)
    collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def hash01(i, j):
    h = ((i + 1) * 73856093) ^ ((j + 1) * 19349663) ^ ((i + j + 2) * 83492791)
    h = ((h ^ (h >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFFFFFF) / 0xFFFFFFFF


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def build_scene():
    ensure_dirs()
    clear_default_scene()

    root = bpy.data.collections.new("NOIXZY_neural_lattice_hybrid")
    bpy.context.scene.collection.children.link(root)
    nodes_col = bpy.data.collections.new("nodes")
    near_col = bpy.data.collections.new("near_links")
    long_col = bpy.data.collections.new("long_links")
    field_col = bpy.data.collections.new("field_planes")
    for col in (nodes_col, near_col, long_col, field_col):
        root.children.link(col)

    mat_bg = make_mat("noixzy deep graphite", (0.006, 0.008, 0.011, 1), metallic=0.15, roughness=0.55)
    mat_node = make_mat("noixzy node white cyan", (0.72, 0.95, 1.0, 1), (0.6, 0.96, 1.0, 1), 3.3)
    mat_core = make_mat("noixzy amber core nodes", (1.0, 0.46, 0.08, 1), (1.0, 0.35, 0.06, 1), 4.2)
    mat_near = make_mat("noixzy near link teal", (0.1, 0.9, 1.0, 1), (0.0, 0.85, 1.0, 1), 1.8, alpha=0.78)
    mat_long = make_mat("noixzy long link ghost blue", (0.26, 0.52, 1.0, 0.42), (0.1, 0.34, 1.0, 1), 0.8, alpha=0.34)
    mat_plane = make_mat("noixzy transparent lattice plates", (0.02, 0.08, 0.11, 0.18), (0.0, 0.18, 0.24, 1), 0.15, alpha=0.18)

    bpy.ops.mesh.primitive_cylinder_add(vertices=160, radius=4.2, depth=0.08, location=(0, 0, -0.08))
    base = bpy.context.object
    base.name = "dark circular stage"
    base.data.materials.append(mat_bg)
    link_object(base, field_col)
    bevel = base.modifiers.new("soft machined edge", "BEVEL")
    bevel.width = 0.035
    bevel.segments = 8
    base.modifiers.new("weighted normals", "WEIGHTED_NORMAL")

    random.seed(SEED)
    pts = []
    count = 132
    for i in range(count):
        a = random.random() * math.tau
        r = (random.random() ** 1.38) * 3.05
        z = random.uniform(-0.75, 0.95)
        x = math.cos(a) * r
        y = math.sin(a) * r
        pts.append(Vector((x, y, z)))

    near_range = 0.78
    long_min = 1.35
    long_range = 5.15
    long_density = 0.86
    long_cap = math.ceil(long_density * 5)
    long_counts = [0] * len(pts)

    for i, p in enumerate(pts):
        mat = mat_core if p.length < 0.9 else mat_node
        radius = 0.035 + 0.035 * max(0, 1.0 - p.length / 3.4)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=18, ring_count=9, radius=radius, location=p)
        obj = bpy.context.object
        obj.name = f"node_{i:03d}"
        obj.data.materials.append(mat)
        link_object(obj, nodes_col)

    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            d = (pts[i] - pts[j]).length
            if d < near_range:
                q = 1.0 - d / near_range
                make_curve(f"near_link_{i:03d}_{j:03d}", [pts[i], pts[j]], mat_near, 0.006 + 0.008 * q, near_col)

    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            if long_counts[i] >= long_cap or long_counts[j] >= long_cap:
                continue
            d = (pts[i] - pts[j]).length
            if d <= long_min or d > long_range:
                continue
            q = 1.0 - (d - long_min) / (long_range - long_min)
            gate = 0.30 * long_density * (0.25 + 0.75 * q)
            if hash01(i, j) > gate:
                continue
            mid = (pts[i] + pts[j]) * 0.5
            mid.z += 0.38 + 0.18 * q
            make_curve(f"long_link_{i:03d}_{j:03d}", [pts[i], mid, pts[j]], mat_long, 0.0025 + 0.0045 * q, long_col)
            long_counts[i] += 1
            long_counts[j] += 1

    for z, scale, name in [(-0.55, 5.6, "lower transparent field"), (0.18, 4.8, "middle transparent field"), (0.92, 3.9, "upper transparent field")]:
        bpy.ops.mesh.primitive_plane_add(size=scale, location=(0, 0, z), rotation=(0, 0, math.radians(16)))
        plane = bpy.context.object
        plane.name = name
        plane.data.materials.append(mat_plane)
        link_object(plane, field_col)

    bpy.ops.object.light_add(type="AREA", location=(0, -4.8, 5.2))
    key = bpy.context.object
    key.name = "large softbox over lattice"
    key.data.energy = 430
    key.data.size = 5.0

    bpy.ops.object.light_add(type="POINT", location=(-2.9, 2.4, 1.8))
    rim = bpy.context.object
    rim.name = "cyan rim pulse"
    rim.data.color = (0.25, 0.88, 1.0)
    rim.data.energy = 210

    bpy.ops.object.camera_add(location=(4.9, -6.1, 3.6))
    cam = bpy.context.object
    cam.name = "NOIXZY neural lattice camera"
    cam.data.lens = 46
    look_at(cam, (0, 0, 0.22))
    bpy.context.scene.camera = cam

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.view_settings.view_transform = "Filmic"
    scene.view_settings.look = "Medium High Contrast"
    scene.render.resolution_x = 1800
    scene.render.resolution_y = 1800
    if hasattr(scene, "eevee"):
        scene.eevee.taa_render_samples = 16
    scene.world.color = (0.002, 0.003, 0.006)

    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    return {"blend": BLEND_PATH, "objects": len(bpy.data.objects)}


result = build_scene()
print(result)
