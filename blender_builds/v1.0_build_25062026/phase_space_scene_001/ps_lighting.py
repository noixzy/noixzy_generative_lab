# Author: Chris Tucker and OpenAI
from __future__ import annotations

import math
import bpy


def add_area(name, loc, rot, size, power, color=(1,1,1)):
    bpy.ops.object.light_add(type='AREA', location=loc, rotation=rot)
    l = bpy.context.object
    l.name = name
    l.data.name = name + '_data'
    l.data.energy = power
    l.data.size = size
    l.data.color = color
    return l


def build_lighting():
    print('[phase_space] building lighting')
    world = bpy.context.scene.world or bpy.data.worlds.new('World')
    bpy.context.scene.world = world
    world.color = (0.002, 0.0025, 0.004)
    add_area('PS_key_softbox_left', (-5.0, -5.0, 5.4), (math.radians(64), 0, math.radians(-38)), 5.5, 580, (0.78, 0.86, 1.0))
    add_area('PS_long_strip_right', (6.5, -1.2, 3.1), (math.radians(73), 0, math.radians(82)), 7.8, 280, (0.94, 0.96, 1.0))
    add_area('PS_low_blue_graze', (0.0, -6.7, -0.8), (math.radians(87), 0, 0), 9.0, 140, (0.15, 0.37, 1.0))
    add_area('PS_top_silk', (0.0, 1.0, 7.5), (0, 0, 0), 8.0, 110, (1.0, 0.96, 0.88))
