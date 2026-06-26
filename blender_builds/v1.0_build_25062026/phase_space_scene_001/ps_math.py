# Author: Chris Tucker and OpenAI
# Phase Space Scene 001 — procedural vector-field math helpers

from __future__ import annotations

import math
import random
from dataclasses import dataclass
from typing import Iterable, Tuple

Vec3 = Tuple[float, float, float]


@dataclass(frozen=True)
class FieldConfig:
    seed: int = 41017
    swirl: float = 1.15
    fold: float = 0.72
    lift: float = 0.36
    drift: float = 0.18
    scale: float = 1.0


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def mix(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def smoothstep(edge0: float, edge1: float, x: float) -> float:
    if edge0 == edge1:
        return 0.0
    t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def length(v: Vec3) -> float:
    return math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])


def normalize(v: Vec3) -> Vec3:
    l = length(v)
    if l < 1e-9:
        return (0.0, 0.0, 0.0)
    return (v[0] / l, v[1] / l, v[2] / l)


def add(a: Vec3, b: Vec3) -> Vec3:
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def mul(a: Vec3, s: float) -> Vec3:
    return (a[0] * s, a[1] * s, a[2] * s)


def hash01(n: int) -> float:
    n = (n << 13) ^ n
    return 1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0


def noise3(x: float, y: float, z: float, seed: int = 0) -> float:
    # Tiny deterministic pseudo-noise: smooth trigonometric value noise hybrid.
    return (
        math.sin(x * 1.713 + y * 0.337 + z * 0.921 + seed * 0.017) * 0.37
        + math.sin(x * 0.431 - y * 1.119 + z * 1.531 + seed * 0.031) * 0.31
        + math.cos(x * 1.977 + y * 1.523 - z * 0.272 + seed * 0.047) * 0.22
        + math.sin((x + y + z) * 0.63 + seed * 0.071) * 0.10
    )


def fbm3(x: float, y: float, z: float, seed: int = 0, octaves: int = 4) -> float:
    amp = 0.5
    freq = 1.0
    out = 0.0
    norm = 0.0
    for i in range(octaves):
        out += amp * noise3(x * freq, y * freq, z * freq, seed + i * 97)
        norm += amp
        freq *= 2.03
        amp *= 0.52
    return out / max(norm, 1e-6)


def vector_field(p: Vec3, cfg: FieldConfig, time: float = 0.0) -> Vec3:
    x, y, z = p
    r = math.sqrt(x * x + y * y) + 1e-6
    theta = math.atan2(y, x)

    # Central orbital field.
    orbital = (-y / r, x / r, 0.0)

    # Folded curl-like perturbation.
    n1 = fbm3(x * 0.42, y * 0.42, z * 0.42 + time, cfg.seed, 4)
    n2 = fbm3(y * 0.51 + 7.1, z * 0.51, x * 0.51 - time, cfg.seed + 11, 4)
    n3 = fbm3(z * 0.61 - 3.4, x * 0.61, y * 0.61 + time, cfg.seed + 23, 4)
    folded = (
        math.sin(y * 0.63 + n2 * 2.2) - math.cos(z * 0.44 + n1 * 1.7),
        math.sin(z * 0.58 + n3 * 2.0) - math.cos(x * 0.49 + n2 * 1.9),
        math.sin(x * 0.52 + n1 * 2.4) - math.cos(y * 0.56 + n3 * 1.5),
    )

    # Slow vertical pressure wave.
    lift = math.sin(theta * 3.0 + r * 0.7 + n1 * 2.0) * cfg.lift
    drift = (math.cos(z * 0.31 + r * 0.2), math.sin(x * 0.25 - y * 0.18), math.cos(theta * 2.0) * 0.5)

    v = (
        orbital[0] * cfg.swirl + folded[0] * cfg.fold + drift[0] * cfg.drift,
        orbital[1] * cfg.swirl + folded[1] * cfg.fold + drift[1] * cfg.drift,
        folded[2] * cfg.fold * 0.55 + lift + drift[2] * cfg.drift,
    )
    return normalize(v)


def integrate_streamline(start: Vec3, steps: int, step_size: float, cfg: FieldConfig, jitter: float = 0.0) -> list[Vec3]:
    pts: list[Vec3] = []
    p = start
    rnd = random.Random(cfg.seed + int(abs(start[0]) * 1000) + int(abs(start[1]) * 2000) + int(abs(start[2]) * 3000))
    for i in range(steps):
        pts.append(p)
        v1 = vector_field(p, cfg, i * 0.01)
        mid = add(p, mul(v1, step_size * 0.5))
        v2 = vector_field(mid, cfg, i * 0.01)
        j = jitter * (0.5 - rnd.random())
        p = add(p, mul(v2, step_size * (1.0 + j)))
        # Soft containment. Let lines bend back inward rather than hard-clipping.
        d = length(p)
        if d > 9.0:
            p = mul(p, 8.8 / d)
    return pts


def seeded_shell_points(count: int, radius: float, cfg: FieldConfig) -> list[Vec3]:
    rnd = random.Random(cfg.seed)
    pts: list[Vec3] = []
    golden = math.pi * (3.0 - math.sqrt(5.0))
    for i in range(count):
        t = (i + 0.5) / count
        z = 1.0 - 2.0 * t
        rr = math.sqrt(max(0.0, 1.0 - z * z))
        theta = i * golden
        shell = radius * (0.42 + 0.58 * (rnd.random() ** 0.38))
        warp = 1.0 + 0.11 * fbm3(math.cos(theta) * 2.0, math.sin(theta) * 2.0, z * 2.0, cfg.seed + i, 3)
        pts.append((math.cos(theta) * rr * shell * warp, math.sin(theta) * rr * shell * warp, z * shell * 0.72))
    return pts
