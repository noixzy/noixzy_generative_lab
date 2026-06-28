(function () {
  "use strict";

  const MODULES = {
    differential_growth: {
      title: "noixzy differential growth",
      sub: "self-avoiding contour colonies, membrane pressure, coral linework",
      seed: "growth-colonies-001",
      accent: "#b7d7c0",
      defaults: { colonies: 5, nodes: 118, growth: 62, repulsion: 54, stroke: 3, drift: 35 },
      controls: [
        ["colonies", "colonies", 1, 12, 1],
        ["nodes", "nodes", 36, 220, 1],
        ["growth", "growth", 0, 100, 1],
        ["repulsion", "repulsion", 0, 100, 1],
        ["stroke", "stroke", 1, 7, 1],
        ["drift", "drift", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, frame, running, rng, hsl, clamp } = env;
        const minDim = Math.min(w, h);
        const colonyCount = s.colonies;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let c = 0; c < colonyCount; c++) {
          const angle = (Math.PI * 2 * c) / colonyCount + rng() * 0.8;
          const ring = 0.12 + rng() * 0.22;
          const cx = w * 0.5 + Math.cos(angle) * minDim * ring;
          const cy = h * 0.5 + Math.sin(angle * 1.2) * minDim * ring * 0.74;
          const base = minDim * (0.055 + rng() * 0.055 + s.growth * 0.0008);
          const wobble = 0.16 + s.repulsion * 0.004;
          const pulse = running ? Math.sin(frame * 0.012 + c) * s.drift * 0.0018 : 0;
          const pts = [];

          for (let i = 0; i < s.nodes; i++) {
            const t = (Math.PI * 2 * i) / s.nodes;
            const n1 = Math.sin(t * (3 + c % 5) + rng() * 3 + frame * 0.004);
            const n2 = Math.cos(t * (7 + c % 4) + c * 1.9 - frame * 0.003);
            const crowd = Math.sin(t * colonyCount + angle) * s.repulsion * 0.0014;
            const r = base * (1 + n1 * wobble + n2 * 0.09 + crowd + pulse);
            pts.push([
              cx + Math.cos(t) * r * (1.22 + c * 0.015),
              cy + Math.sin(t) * r * (0.74 + rng() * 0.16)
            ]);
          }

          ctx.beginPath();
          pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
          ctx.closePath();
          ctx.fillStyle = `hsla(${136 + c * 17}, 19%, ${clamp(9 + c * 2, 8, 22)}%, .46)`;
          ctx.fill();

          for (let pass = 0; pass < 3; pass++) {
            ctx.beginPath();
            pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
            ctx.closePath();
            ctx.strokeStyle = pass === 2 ? hsl(118 + c * 14, 36, 68, 0.85) : hsl(95 + c * 10, 12, 35 + pass * 12, 0.42);
            ctx.lineWidth = s.stroke * (2.2 - pass * 0.72);
            ctx.stroke();
          }
        }
      }
    },

    wfc_tiles: {
      title: "noixzy wfc tile pressure",
      sub: "constraint-solved architectural tiles, truchet gates, entropy bands",
      seed: "wfc-pressure-001",
      accent: "#9ec7d6",
      defaults: { cells: 24, alphabet: 5, constraint: 68, thickness: 3, diagonals: 58, entropy: 26 },
      controls: [
        ["cells", "cells", 8, 42, 1],
        ["alphabet", "alphabet", 2, 8, 1],
        ["constraint", "constraint", 0, 100, 1],
        ["thickness", "thickness", 1, 8, 1],
        ["diagonals", "diagonals", 0, 100, 1],
        ["entropy", "entropy", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, hsl } = env;
        const cells = s.cells;
        const size = Math.min(w, h) * 0.82;
        const cell = size / cells;
        const ox = (w - size) * 0.5;
        const oy = (h - size) * 0.5;
        const grid = [];
        ctx.lineCap = "square";

        for (let y = 0; y < cells; y++) {
          grid[y] = [];
          for (let x = 0; x < cells; x++) {
            const left = x ? grid[y][x - 1] : Math.floor(rng() * s.alphabet);
            const up = y ? grid[y - 1][x] : Math.floor(rng() * s.alphabet);
            const choice = rng() < s.constraint / 100
              ? (left + up + Math.floor(rng() * 2)) % s.alphabet
              : Math.floor(rng() * s.alphabet);
            grid[y][x] = choice;
          }
        }

        for (let y = 0; y < cells; y++) {
          for (let x = 0; x < cells; x++) {
            const v = grid[y][x];
            const px = ox + x * cell;
            const py = oy + y * cell;
            const hue = 190 + v * 13;
            ctx.fillStyle = hsl(hue, 12 + v * 3, 8 + v * 2, 0.38);
            ctx.fillRect(px, py, cell + 0.5, cell + 0.5);
            ctx.strokeStyle = hsl(hue, 35, 58, 0.72);
            ctx.lineWidth = Math.max(1, s.thickness * 0.42);

            const pad = cell * 0.16;
            ctx.beginPath();
            if ((v + x + y) % 2 === 0) {
              ctx.arc(px, py, cell - pad, 0, Math.PI * 0.5);
              ctx.arc(px + cell, py + cell, cell - pad, Math.PI, Math.PI * 1.5);
            } else {
              ctx.arc(px + cell, py, cell - pad, Math.PI * 0.5, Math.PI);
              ctx.arc(px, py + cell, cell - pad, Math.PI * 1.5, Math.PI * 2);
            }
            ctx.stroke();

            if (rng() * 100 < s.diagonals) {
              ctx.beginPath();
              if ((v + x) % 3 === 0) {
                ctx.moveTo(px + pad, py + pad);
                ctx.lineTo(px + cell - pad, py + cell - pad);
              } else {
                ctx.moveTo(px + cell - pad, py + pad);
                ctx.lineTo(px + pad, py + cell - pad);
              }
              ctx.globalAlpha = 0.18 + s.entropy * 0.004;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        }
      }
    },

    islamic_geometric: {
      title: "noixzy girih star field",
      sub: "islamic geometric rosettes, strapwork subdivisions, radial tiling",
      seed: "girih-field-001",
      accent: "#d1b77e",
      defaults: { repeats: 5, points: 10, radius: 66, subdivision: 4, lineWeight: 2, phase: 18 },
      controls: [
        ["repeats", "repeats", 2, 8, 1],
        ["points", "points", 6, 16, 1],
        ["radius", "radius", 25, 100, 1],
        ["subdivision", "subdivision", 1, 8, 1],
        ["lineWeight", "line weight", 1, 6, 1],
        ["phase", "phase", 0, 90, 1]
      ],
      render(ctx, env) {
        const { w, h, s, frame, running, hsl } = env;
        const minDim = Math.min(w, h);
        const step = minDim / (s.repeats + 1.15);
        const phase = (s.phase + (running ? frame * 0.018 : 0)) * Math.PI / 180;

        function poly(cx, cy, r, n, skip, alpha) {
          ctx.beginPath();
          for (let i = 0; i <= n; i++) {
            const a = phase + Math.PI * -0.5 + (Math.PI * 2 * ((i * skip) % n)) / n;
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.strokeStyle = hsl(42, 40, 66, alpha);
          ctx.stroke();
        }

        ctx.lineWidth = s.lineWeight;
        ctx.lineJoin = "round";
        for (let gy = 0; gy < s.repeats; gy++) {
          for (let gx = 0; gx < s.repeats; gx++) {
            const cx = w * 0.5 + (gx - (s.repeats - 1) / 2) * step;
            const cy = h * 0.5 + (gy - (s.repeats - 1) / 2) * step;
            const r = step * s.radius * 0.0049;
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = hsl(39, 16, 16, 1);
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.06, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            for (let k = 1; k <= s.subdivision; k++) {
              poly(cx, cy, r * (k / s.subdivision), s.points, 2 + (k % 3), 0.32 + k * 0.045);
            }

            ctx.strokeStyle = hsl(189, 20, 56, 0.32);
            ctx.lineWidth = Math.max(1, s.lineWeight * 0.72);
            for (let i = 0; i < s.points; i++) {
              const a = phase + (Math.PI * 2 * i) / s.points;
              ctx.beginPath();
              ctx.moveTo(cx + Math.cos(a) * r * 0.22, cy + Math.sin(a) * r * 0.22);
              ctx.lineTo(cx + Math.cos(a) * r * 1.18, cy + Math.sin(a) * r * 1.18);
              ctx.stroke();
            }
          }
        }
      }
    },

    penrose_field: {
      title: "noixzy penrose deflation",
      sub: "aperiodic kite and dart field, golden-ratio rings, print-ready edges",
      seed: "penrose-deflate-001",
      accent: "#c6c0ef",
      defaults: { rings: 7, spokes: 10, deflation: 58, jitter: 14, lineWeight: 2, rotation: 0 },
      controls: [
        ["rings", "rings", 2, 12, 1],
        ["spokes", "spokes", 5, 16, 1],
        ["deflation", "deflation", 0, 100, 1],
        ["jitter", "jitter", 0, 60, 1],
        ["lineWeight", "line weight", 1, 6, 1],
        ["rotation", "rotation", -90, 90, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, frame, running, hsl } = env;
        const phi = (1 + Math.sqrt(5)) / 2;
        const cx = w * 0.5;
        const cy = h * 0.5;
        const maxR = Math.min(w, h) * 0.42;
        const rot = (s.rotation + (running ? frame * 0.025 : 0)) * Math.PI / 180;
        ctx.lineJoin = "round";
        ctx.lineWidth = s.lineWeight;

        for (let r = s.rings; r >= 1; r--) {
          const outer = maxR * Math.pow(phi, r - s.rings);
          const inner = outer / (phi + s.deflation * 0.006);
          for (let i = 0; i < s.spokes; i++) {
            const a0 = rot + (Math.PI * 2 * i) / s.spokes;
            const a1 = rot + (Math.PI * 2 * (i + 1)) / s.spokes;
            const mid = (a0 + a1) * 0.5 + (rng() - 0.5) * s.jitter * 0.003;
            const p0 = [cx + Math.cos(a0) * outer, cy + Math.sin(a0) * outer];
            const p1 = [cx + Math.cos(mid) * inner, cy + Math.sin(mid) * inner];
            const p2 = [cx + Math.cos(a1) * outer, cy + Math.sin(a1) * outer];
            const p3 = [cx + Math.cos(mid + Math.PI) * inner * 0.34, cy + Math.sin(mid + Math.PI) * inner * 0.34];
            const hue = (i + r) % 2 ? 251 : 44;

            ctx.beginPath();
            ctx.moveTo(p0[0], p0[1]);
            ctx.lineTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p3[0], p3[1]);
            ctx.closePath();
            ctx.fillStyle = hsl(hue, 19, 12 + r * 2, 0.5);
            ctx.strokeStyle = hsl(hue, 34, 64, 0.62);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
    },

    substrate_cracks: {
      title: "noixzy substrate cracks",
      sub: "geologic crack propagation, branching stress fields, plotted fracture maps",
      seed: "substrate-cracks-001",
      accent: "#d8b19b",
      defaults: { cracks: 24, steps: 110, branchRate: 22, noiseScale: 44, thickness: 2, drift: 40 },
      controls: [
        ["cracks", "cracks", 4, 70, 1],
        ["steps", "steps", 20, 220, 1],
        ["branchRate", "branch rate", 0, 70, 1],
        ["noiseScale", "noise scale", 5, 100, 1],
        ["thickness", "thickness", 1, 6, 1],
        ["drift", "drift", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, frame, running, hsl } = env;
        const total = Math.floor(s.steps * (running ? 0.72 + Math.sin(frame * 0.012) * 0.04 : 1));
        ctx.lineCap = "round";
        ctx.lineWidth = s.thickness;

        function walk(x, y, a, len, alpha) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          for (let i = 0; i < len; i++) {
            const turn = Math.sin((x * 0.014 + y * 0.011) * (s.noiseScale * 0.02) + i * 0.17) * 0.42;
            a += turn * (0.18 + s.drift * 0.006) + (rng() - 0.5) * 0.18;
            x += Math.cos(a) * (2.6 + rng() * 3.4);
            y += Math.sin(a) * (2.6 + rng() * 3.4);
            ctx.lineTo(x, y);
            if (rng() * 100 < s.branchRate * 0.025 && i > 8) {
              ctx.strokeStyle = hsl(21, 34, 62, alpha * 0.48);
              ctx.stroke();
              walk(x, y, a + (rng() > 0.5 ? 1 : -1) * (0.7 + rng()), Math.floor(len * 0.22), alpha * 0.62);
              ctx.beginPath();
              ctx.moveTo(x, y);
            }
          }
          ctx.strokeStyle = hsl(20, 38, 68, alpha);
          ctx.stroke();
        }

        for (let i = 0; i < s.cracks; i++) {
          const edge = Math.floor(rng() * 4);
          const x = edge === 0 ? 0 : edge === 1 ? w : rng() * w;
          const y = edge === 2 ? 0 : edge === 3 ? h : rng() * h;
          const a = Math.atan2(h * 0.5 - y, w * 0.5 - x) + (rng() - 0.5) * 1.2;
          walk(x, y, a, total, 0.28 + rng() * 0.55);
        }
      }
    },

    vault_generator: {
      title: "noixzy rib vault generator",
      sub: "gothic rib networks, bay grids, catenary arches, structural diagrams",
      seed: "rib-vault-001",
      accent: "#a8c6f2",
      defaults: { baysX: 5, baysY: 4, vaultHeight: 66, ribDensity: 5, perspective: 48, lineWeight: 2 },
      controls: [
        ["baysX", "bays x", 2, 8, 1],
        ["baysY", "bays y", 2, 7, 1],
        ["vaultHeight", "vault height", 20, 100, 1],
        ["ribDensity", "rib density", 1, 10, 1],
        ["perspective", "perspective", 0, 100, 1],
        ["lineWeight", "line weight", 1, 6, 1]
      ],
      render(ctx, env) {
        const { w, h, s, hsl } = env;
        const cx = w * 0.5;
        const cy = h * 0.62;
        const bayW = Math.min(w * 0.72 / s.baysX, h * 0.7 / s.baysY);
        const bayH = bayW * (0.58 + s.perspective * 0.004);
        const startX = cx - (s.baysX * bayW) * 0.5;
        const startY = cy - (s.baysY * bayH) * 0.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = s.lineWeight;

        function iso(x, y, z) {
          return [
            startX + (x - y) * bayW * 0.5 + s.baysY * bayW * 0.25,
            startY + (x + y) * bayH * 0.5 - z
          ];
        }

        for (let y = 0; y <= s.baysY; y++) {
          for (let x = 0; x <= s.baysX; x++) {
            const p = iso(x, y, 0);
            const q = iso(x, y, bayW * s.vaultHeight * 0.006);
            ctx.strokeStyle = hsl(210, 26, 57, 0.34);
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
            ctx.lineTo(q[0], q[1]);
            ctx.stroke();
          }
        }

        for (let y = 0; y < s.baysY; y++) {
          for (let x = 0; x < s.baysX; x++) {
            const a = iso(x, y, 0);
            const b = iso(x + 1, y, 0);
            const c = iso(x + 1, y + 1, 0);
            const d = iso(x, y + 1, 0);
            const z = bayW * s.vaultHeight * 0.006;
            const crown = iso(x + 0.5, y + 0.5, z);

            ctx.strokeStyle = hsl(213, 38, 70, 0.68);
            [[a, crown, c], [b, crown, d]].forEach(path => {
              ctx.beginPath();
              ctx.moveTo(path[0][0], path[0][1]);
              ctx.quadraticCurveTo(path[1][0], path[1][1], path[2][0], path[2][1]);
              ctx.stroke();
            });

            ctx.strokeStyle = hsl(38, 25, 62, 0.42);
            for (let r = 1; r <= s.ribDensity; r++) {
              const t = r / (s.ribDensity + 1);
              const p0 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
              const p1 = [d[0] + (c[0] - d[0]) * t, d[1] + (c[1] - d[1]) * t];
              ctx.beginPath();
              ctx.moveTo(p0[0], p0[1]);
              ctx.quadraticCurveTo(crown[0], crown[1], p1[0], p1[1]);
              ctx.stroke();
            }
          }
        }
      }
    },

    dla_cluster: {
      title: "noixzy diffusion aggregate",
      sub: "branching mineral clusters, lightning cores, frozen deposition fields",
      seed: "dla-cluster-001",
      accent: "#c8d7ff",
      defaults: { branches: 88, depth: 7, split: 42, spread: 68, thickness: 3, glow: 46 },
      controls: [
        ["branches", "branches", 16, 180, 1],
        ["depth", "depth", 2, 10, 1],
        ["split", "split", 0, 100, 1],
        ["spread", "spread", 5, 100, 1],
        ["thickness", "thickness", 1, 8, 1],
        ["glow", "glow", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, frame, running, hsl } = env;
        const cx = w * 0.5;
        const cy = h * 0.53;
        const maxLen = Math.min(w, h) * 0.22;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        function branch(x, y, a, len, depth, alpha) {
          if (depth <= 0 || len < 2) return;
          const sway = running ? Math.sin(frame * 0.01 + depth + a) * 0.05 : 0;
          const nx = x + Math.cos(a + sway) * len;
          const ny = y + Math.sin(a + sway) * len;
          ctx.strokeStyle = hsl(220 - depth * 7, 45, 62 + depth, alpha);
          ctx.lineWidth = Math.max(0.6, s.thickness * depth * 0.22);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          ctx.stroke();

          const fork = 1 + (rng() * 100 < s.split ? 1 : 0) + (rng() * 100 < s.split * 0.28 ? 1 : 0);
          for (let i = 0; i < fork; i++) {
            const turn = (rng() - 0.5) * s.spread * 0.026 + (i - (fork - 1) / 2) * 0.48;
            branch(nx, ny, a + turn, len * (0.62 + rng() * 0.13), depth - 1, alpha * 0.86);
          }
        }

        if (s.glow > 0) {
          ctx.shadowColor = "rgba(170,190,255,.45)";
          ctx.shadowBlur = s.glow * 0.18;
        }
        for (let i = 0; i < s.branches; i++) {
          const a = (Math.PI * 2 * i) / s.branches + (rng() - 0.5) * 0.45;
          branch(cx, cy, a, maxLen * (0.24 + rng() * 0.32), s.depth, 0.42 + rng() * 0.34);
        }
        ctx.shadowBlur = 0;
      }
    },

    apollonian_packing: {
      title: "noixzy apollonian packing",
      sub: "recursive circle pressure, nested voids, stone-inlay packing studies",
      seed: "apollonian-001",
      accent: "#d6c08d",
      defaults: { rings: 6, count: 11, shrink: 58, lineWeight: 2, fill: 32, rotation: 12 },
      controls: [
        ["rings", "rings", 2, 10, 1],
        ["count", "count", 5, 20, 1],
        ["shrink", "shrink", 10, 90, 1],
        ["lineWeight", "line weight", 1, 6, 1],
        ["fill", "fill", 0, 100, 1],
        ["rotation", "rotation", -90, 90, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, frame, running, hsl } = env;
        const cx = w * 0.5;
        const cy = h * 0.5;
        const baseR = Math.min(w, h) * 0.36;
        const rot = (s.rotation + (running ? frame * 0.03 : 0)) * Math.PI / 180;
        ctx.lineWidth = s.lineWeight;

        function circle(x, y, r, hue, alpha) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = hsl(hue, 18, 11 + s.fill * 0.08, 0.18 + s.fill * 0.003);
          ctx.strokeStyle = hsl(hue, 36, 67, alpha);
          ctx.fill();
          ctx.stroke();
        }

        circle(cx, cy, baseR, 42, 0.72);
        for (let ring = 1; ring <= s.rings; ring++) {
          const n = Math.max(3, Math.round(s.count * (1 + ring * 0.16)));
          const rr = baseR * Math.pow(0.44 + s.shrink * 0.0025, ring);
          const orbit = baseR - rr * (1.05 + ring * 0.18);
          for (let i = 0; i < n; i++) {
            const a = rot + (Math.PI * 2 * (i + (ring % 2) * 0.5)) / n;
            const jitter = (rng() - 0.5) * rr * 0.12;
            circle(cx + Math.cos(a) * orbit + jitter, cy + Math.sin(a) * orbit - jitter, rr * (0.82 + rng() * 0.2), 38 + ring * 15, 0.42);
          }
        }
      }
    },

    hilbert_plan: {
      title: "noixzy hilbert plan",
      sub: "space-filling circulation paths, obsessive plan diagrams, routed density",
      seed: "hilbert-plan-001",
      accent: "#9fd8c7",
      defaults: { order: 5, margin: 12, lineWeight: 3, nodes: 42, secondary: 55, rotation: 0 },
      controls: [
        ["order", "order", 2, 7, 1],
        ["margin", "margin", 4, 24, 1],
        ["lineWeight", "line weight", 1, 8, 1],
        ["nodes", "nodes", 0, 100, 1],
        ["secondary", "secondary", 0, 100, 1],
        ["rotation", "rotation", -90, 90, 1]
      ],
      render(ctx, env) {
        const { w, h, s, frame, running, hsl } = env;
        const n = Math.pow(2, s.order);
        const total = n * n;
        const size = Math.min(w, h) * (1 - s.margin * 0.01);
        const ox = (w - size) * 0.5;
        const oy = (h - size) * 0.5;
        const step = size / (n - 1);
        const theta = (s.rotation + (running ? Math.sin(frame * 0.01) * 2 : 0)) * Math.PI / 180;
        const cx = w * 0.5;
        const cy = h * 0.5;

        function d2xy(d) {
          let x = 0;
          let y = 0;
          for (let t = d, scale = 1; scale < n; scale *= 2) {
            const rx = 1 & Math.floor(t / 2);
            const ry = 1 & (t ^ rx);
            if (ry === 0) {
              if (rx === 1) {
                x = scale - 1 - x;
                y = scale - 1 - y;
              }
              const tmp = x;
              x = y;
              y = tmp;
            }
            x += scale * rx;
            y += scale * ry;
            t = Math.floor(t / 4);
          }
          return [x, y];
        }

        function project(p) {
          const x = ox + p[0] * step - cx;
          const y = oy + p[1] * step - cy;
          return [
            cx + x * Math.cos(theta) - y * Math.sin(theta),
            cy + x * Math.sin(theta) + y * Math.cos(theta)
          ];
        }

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = hsl(160, 38, 67, 0.82);
        ctx.lineWidth = s.lineWeight;
        ctx.beginPath();
        for (let d = 0; d < total; d++) {
          const p = project(d2xy(d));
          d ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
        }
        ctx.stroke();

        if (s.secondary > 0) {
          ctx.strokeStyle = hsl(42, 22, 58, s.secondary * 0.004);
          ctx.lineWidth = Math.max(1, s.lineWeight * 0.45);
          for (let y = 0; y < n; y += 2) {
            const a = project([0, y]);
            const b = project([n - 1, y]);
            ctx.beginPath();
            ctx.moveTo(a[0], a[1]);
            ctx.lineTo(b[0], b[1]);
            ctx.stroke();
          }
        }

        if (s.nodes > 0) {
          ctx.fillStyle = hsl(166, 42, 74, 0.5);
          for (let d = 0; d < total; d += Math.max(1, Math.floor(110 - s.nodes))) {
            const p = project(d2xy(d));
            ctx.beginPath();
            ctx.arc(p[0], p[1], s.lineWeight * 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    },

    floorplan_bsp: {
      title: "noixzy floorplan splitter",
      sub: "bsp room subdivision, corridor traces, plan massing diagrams",
      seed: "floorplan-bsp-001",
      accent: "#d0d4be",
      defaults: { splits: 28, minRoom: 16, corridor: 52, wall: 3, poche: 44, doors: 34 },
      controls: [
        ["splits", "splits", 4, 70, 1],
        ["minRoom", "min room", 8, 34, 1],
        ["corridor", "corridor", 0, 100, 1],
        ["wall", "wall", 1, 8, 1],
        ["poche", "poche", 0, 100, 1],
        ["doors", "doors", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, hsl } = env;
        const pad = Math.min(w, h) * 0.09;
        const rooms = [{ x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 }];
        const minSize = Math.min(w, h) * s.minRoom * 0.006;

        for (let i = 0; i < s.splits; i++) {
          rooms.sort((a, b) => b.w * b.h - a.w * a.h);
          const room = rooms.shift();
          if (!room) break;
          const vertical = room.w > room.h || (rng() > 0.5 && room.w > minSize * 2);
          if (vertical && room.w > minSize * 2) {
            const cut = room.w * (0.36 + rng() * 0.28);
            rooms.push({ x: room.x, y: room.y, w: cut, h: room.h });
            rooms.push({ x: room.x + cut, y: room.y, w: room.w - cut, h: room.h });
          } else if (room.h > minSize * 2) {
            const cut = room.h * (0.36 + rng() * 0.28);
            rooms.push({ x: room.x, y: room.y, w: room.w, h: cut });
            rooms.push({ x: room.x, y: room.y + cut, w: room.w, h: room.h - cut });
          } else {
            rooms.push(room);
          }
        }

        ctx.fillStyle = hsl(67, 8, 13, 0.2 + s.poche * 0.004);
        ctx.strokeStyle = hsl(64, 18, 72, 0.78);
        ctx.lineWidth = s.wall;
        rooms.forEach(room => {
          ctx.fillRect(room.x, room.y, room.w, room.h);
          ctx.strokeRect(room.x, room.y, room.w, room.h);
          if (rng() * 100 < s.doors) {
            const side = Math.floor(rng() * 4);
            ctx.strokeStyle = "#050505";
            ctx.lineWidth = s.wall + 2;
            ctx.beginPath();
            if (side < 2) {
              const x = room.x + room.w * (0.35 + rng() * 0.3);
              const y = side ? room.y + room.h : room.y;
              ctx.moveTo(x - 10, y);
              ctx.lineTo(x + 10, y);
            } else {
              const x = side === 2 ? room.x : room.x + room.w;
              const y = room.y + room.h * (0.35 + rng() * 0.3);
              ctx.moveTo(x, y - 10);
              ctx.lineTo(x, y + 10);
            }
            ctx.stroke();
            ctx.strokeStyle = hsl(64, 18, 72, 0.78);
            ctx.lineWidth = s.wall;
          }
        });

        if (s.corridor > 0) {
          ctx.strokeStyle = hsl(187, 28, 62, s.corridor * 0.006);
          ctx.lineWidth = Math.max(1, s.wall * 0.7);
          const sorted = rooms.slice().sort((a, b) => a.x + a.y - b.x - b.y);
          for (let i = 1; i < sorted.length; i++) {
            const a = sorted[i - 1];
            const b = sorted[i];
            ctx.beginPath();
            ctx.moveTo(a.x + a.w / 2, a.y + a.h / 2);
            ctx.lineTo(b.x + b.w / 2, a.y + a.h / 2);
            ctx.lineTo(b.x + b.w / 2, b.y + b.h / 2);
            ctx.stroke();
          }
        }
      }
    },

    brick_bond_field: {
      title: "noixzy brick bond field",
      sub: "flemish bonds, herringbone courses, masonry rhythm, facade studies",
      seed: "brick-bond-001",
      accent: "#d69f8b",
      defaults: { courses: 18, brickRatio: 62, offset: 50, herringbone: 24, mortar: 3, weather: 44 },
      controls: [
        ["courses", "courses", 6, 34, 1],
        ["brickRatio", "brick ratio", 30, 90, 1],
        ["offset", "offset", 0, 100, 1],
        ["herringbone", "herringbone", 0, 100, 1],
        ["mortar", "mortar", 1, 8, 1],
        ["weather", "weather", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, hsl } = env;
        const pad = Math.min(w, h) * 0.08;
        const areaW = w - pad * 2;
        const areaH = h - pad * 2;
        const courseH = areaH / s.courses;
        const brickW = courseH * (1.4 + s.brickRatio * 0.025);
        ctx.lineWidth = s.mortar;
        ctx.strokeStyle = hsl(28, 12, 8, 0.9);

        for (let y = 0; y < s.courses; y++) {
          const oy = pad + y * courseH;
          const shift = ((y % 2) * s.offset / 100) * brickW;
          for (let x = -brickW; x < areaW + brickW; x += brickW) {
            const px = pad + x + shift;
            const hue = 12 + rng() * 20;
            ctx.fillStyle = hsl(hue, 28, 18 + rng() * s.weather * 0.22, 0.9);
            if (rng() * 100 < s.herringbone) {
              ctx.save();
              ctx.translate(px + brickW * 0.5, oy + courseH * 0.5);
              ctx.rotate((y + Math.floor(x / brickW)) % 2 ? Math.PI / 4 : -Math.PI / 4);
              ctx.fillRect(-brickW * 0.38, -courseH * 0.38, brickW * 0.76, courseH * 0.76);
              ctx.strokeRect(-brickW * 0.38, -courseH * 0.38, brickW * 0.76, courseH * 0.76);
              ctx.restore();
            } else {
              ctx.fillRect(px, oy, brickW - s.mortar, courseH - s.mortar);
              ctx.strokeRect(px, oy, brickW - s.mortar, courseH - s.mortar);
            }
          }
        }
      }
    },

    catenary_arches: {
      title: "noixzy catenary arches",
      sub: "hanging-chain curves, parabolic vault studies, structural section stacks",
      seed: "catenary-arches-001",
      accent: "#e4cf98",
      defaults: { arches: 9, sag: 62, span: 78, thickness: 3, layers: 5, compression: 46 },
      controls: [
        ["arches", "arches", 2, 18, 1],
        ["sag", "sag", 10, 100, 1],
        ["span", "span", 30, 100, 1],
        ["thickness", "thickness", 1, 8, 1],
        ["layers", "layers", 1, 10, 1],
        ["compression", "compression", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, frame, running, hsl } = env;
        const baseY = h * 0.76;
        const center = w * 0.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let a = 0; a < s.arches; a++) {
          const t = s.arches === 1 ? 0 : a / (s.arches - 1);
          const span = Math.min(w, h) * s.span * 0.006 * (0.62 + t * 0.55);
          const sag = Math.min(w, h) * s.sag * 0.004 * (1.08 - t * 0.045);
          const yoff = -a * Math.min(w, h) * 0.022;
          const wobble = running ? Math.sin(frame * 0.012 + a) * 4 : 0;
          for (let layer = 0; layer < s.layers; layer++) {
            const inset = layer * s.thickness * 1.8;
            ctx.beginPath();
            for (let i = 0; i <= 80; i++) {
              const u = i / 80;
              const x = center - span + u * span * 2;
              const nx = (u - 0.5) * 2;
              const y = baseY + yoff - sag * (1 - nx * nx) + Math.cosh(nx * (0.8 + s.compression * 0.012)) * 3 + inset + wobble;
              i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            }
            ctx.strokeStyle = hsl(41, 35, 64 - layer * 3, 0.68 - layer * 0.04);
            ctx.lineWidth = Math.max(0.8, s.thickness - layer * 0.12);
            ctx.stroke();
          }
        }
      }
    },

    urban_voronoi: {
      title: "noixzy urban voronoi",
      sub: "district seeds, arterial cuts, block diagrams, city-cell pressure",
      seed: "urban-voronoi-001",
      accent: "#b9d5cf",
      defaults: { districts: 34, roads: 72, jitter: 46, blockSize: 54, lineWeight: 2, parks: 18 },
      controls: [
        ["districts", "districts", 8, 80, 1],
        ["roads", "roads", 0, 100, 1],
        ["jitter", "jitter", 0, 100, 1],
        ["blockSize", "block size", 10, 100, 1],
        ["lineWeight", "line weight", 1, 6, 1],
        ["parks", "parks", 0, 60, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, hsl } = env;
        const pts = [];
        for (let i = 0; i < s.districts; i++) {
          pts.push([w * (0.12 + rng() * 0.76), h * (0.12 + rng() * 0.76), rng()]);
        }
        ctx.lineWidth = s.lineWeight;

        pts.forEach((p, i) => {
          const near = pts
            .map((q, j) => ({ j, d: Math.hypot(q[0] - p[0], q[1] - p[1]) }))
            .filter(q => q.j !== i)
            .sort((a, b) => a.d - b.d)
            .slice(0, 4);
          near.forEach(n => {
            if (n.j < i && rng() * 100 > s.roads) return;
            const q = pts[n.j];
            ctx.strokeStyle = hsl(174, 20, 55, 0.18 + s.roads * 0.004);
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
            const mx = (p[0] + q[0]) * 0.5 + (rng() - 0.5) * s.jitter;
            const my = (p[1] + q[1]) * 0.5 + (rng() - 0.5) * s.jitter;
            ctx.quadraticCurveTo(mx, my, q[0], q[1]);
            ctx.stroke();
          });
        });

        pts.forEach(p => {
          const r = Math.min(w, h) * (0.01 + s.blockSize * 0.0008) * (0.6 + p[2]);
          ctx.fillStyle = p[2] * 100 < s.parks ? hsl(104, 20, 26, 0.75) : hsl(34, 16, 18, 0.74);
          ctx.strokeStyle = hsl(48, 22, 66, 0.52);
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = Math.PI * 2 * k / 6 + p[2];
            const x = p[0] + Math.cos(a) * r * (1 + (rng() - 0.5) * 0.35);
            const y = p[1] + Math.sin(a) * r * (1 + (rng() - 0.5) * 0.35);
            k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      }
    },

    chladni_plate: {
      title: "noixzy chladni plate",
      sub: "standing-wave nodal geometry, cymatic sand maps, acoustic sections",
      seed: "chladni-plate-001",
      accent: "#d8d7ff",
      defaults: { modeA: 5, modeB: 7, threshold: 18, density: 78, grain: 2, phase: 20 },
      controls: [
        ["modeA", "mode a", 1, 12, 1],
        ["modeB", "mode b", 1, 14, 1],
        ["threshold", "threshold", 2, 50, 1],
        ["density", "density", 20, 120, 1],
        ["grain", "grain", 1, 5, 1],
        ["phase", "phase", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, frame, running, hsl } = env;
        const step = Math.max(3, Math.floor(122 - s.density));
        const phase = (s.phase * 0.04) + (running ? frame * 0.015 : 0);
        const pad = Math.min(w, h) * 0.08;
        ctx.fillStyle = hsl(242, 42, 74, 0.72);
        for (let y = pad; y < h - pad; y += step) {
          for (let x = pad; x < w - pad; x += step) {
            const nx = (x - pad) / (w - pad * 2);
            const ny = (y - pad) / (h - pad * 2);
            const v = Math.sin(Math.PI * s.modeA * nx + phase) * Math.sin(Math.PI * s.modeB * ny) -
              Math.sin(Math.PI * s.modeB * nx) * Math.sin(Math.PI * s.modeA * ny - phase * 0.7);
            if (Math.abs(v) < s.threshold * 0.01) {
              ctx.globalAlpha = 0.22 + (1 - Math.abs(v) / (s.threshold * 0.01)) * 0.72;
              ctx.beginPath();
              ctx.arc(x, y, s.grain, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = hsl(243, 20, 58, 0.34);
        ctx.lineWidth = 1;
        ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
      }
    },

    physarum_network: {
      title: "noixzy physarum network",
      sub: "transport slime paths, weighted nodes, adaptive connective tissue",
      seed: "physarum-network-001",
      accent: "#d2e48e",
      defaults: { nodes: 42, links: 4, attraction: 58, thickness: 3, glow: 34, drift: 32 },
      controls: [
        ["nodes", "nodes", 8, 90, 1],
        ["links", "links", 1, 8, 1],
        ["attraction", "attraction", 0, 100, 1],
        ["thickness", "thickness", 1, 8, 1],
        ["glow", "glow", 0, 100, 1],
        ["drift", "drift", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, frame, running, hsl } = env;
        const pts = [];
        for (let i = 0; i < s.nodes; i++) {
          const a = rng() * Math.PI * 2;
          const r = Math.min(w, h) * (0.08 + rng() * 0.36);
          const wob = running ? Math.sin(frame * 0.008 + i) * s.drift * 0.25 : 0;
          pts.push([w * 0.5 + Math.cos(a) * (r + wob), h * 0.5 + Math.sin(a * 1.18) * (r * 0.72 + wob), rng()]);
        }
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(205,230,120,.36)";
        ctx.shadowBlur = s.glow * 0.18;
        pts.forEach((p, i) => {
          const near = pts.map((q, j) => ({ j, d: Math.hypot(q[0] - p[0], q[1] - p[1]) }))
            .filter(q => q.j !== i).sort((a, b) => a.d - b.d).slice(0, s.links);
          near.forEach(n => {
            if (n.j < i && rng() * 100 > s.attraction) return;
            const q = pts[n.j];
            ctx.strokeStyle = hsl(76, 42, 66, 0.16 + (1 - n.d / Math.max(w, h)) * 0.7);
            ctx.lineWidth = Math.max(0.8, s.thickness * (1.2 - n.d / Math.max(w, h)));
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
            ctx.quadraticCurveTo((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 - (p[2] - 0.5) * 80, q[0], q[1]);
            ctx.stroke();
          });
        });
        ctx.shadowBlur = 0;
        pts.forEach(p => {
          ctx.fillStyle = hsl(72, 50, 72, 0.72);
          ctx.beginPath();
          ctx.arc(p[0], p[1], 2 + p[2] * 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    },

    phyllotaxis_dome: {
      title: "noixzy phyllotaxis dome",
      sub: "golden-angle packing, seed heads, radial architectural panels",
      seed: "phyllotaxis-dome-001",
      accent: "#e0c879",
      defaults: { points: 520, angle: 137, scale: 74, dot: 3, spiral: 48, lift: 36 },
      controls: [
        ["points", "points", 80, 900, 1],
        ["angle", "angle", 120, 150, 1],
        ["scale", "scale", 20, 100, 1],
        ["dot", "dot", 1, 8, 1],
        ["spiral", "spiral", 0, 100, 1],
        ["lift", "lift", 0, 80, 1]
      ],
      render(ctx, env) {
        const { w, h, s, frame, running, hsl } = env;
        const cx = w * 0.5;
        const cy = h * 0.52;
        const ga = (s.angle + (running ? Math.sin(frame * 0.01) * 0.4 : 0)) * Math.PI / 180;
        const k = Math.min(w, h) * s.scale * 0.00055;
        for (let i = 0; i < s.points; i++) {
          const r = k * Math.sqrt(i) * 11;
          const a = i * ga + s.spiral * 0.003;
          const z = Math.sin((i / s.points) * Math.PI) * s.lift * 0.55;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r * 0.72 - z;
          const light = 38 + z * 0.45 + (i / s.points) * 24;
          ctx.fillStyle = hsl(43 + i * 0.025, 42, light, 0.78);
          ctx.beginPath();
          ctx.arc(x, y, s.dot * (0.55 + i / s.points), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },

    moire_facade: {
      title: "noixzy moire facade",
      sub: "overlaid louvers, phase-shift screens, kinetic brise-soleil",
      seed: "moire-facade-001",
      accent: "#9fcde8",
      defaults: { blades: 42, angleA: 12, angleB: -18, spacing: 18, opacity: 54, warp: 26 },
      controls: [
        ["blades", "blades", 12, 90, 1],
        ["angleA", "angle a", -45, 45, 1],
        ["angleB", "angle b", -45, 45, 1],
        ["spacing", "spacing", 6, 42, 1],
        ["opacity", "opacity", 10, 100, 1],
        ["warp", "warp", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, frame, running, hsl } = env;
        const pad = Math.min(w, h) * 0.08;
        ctx.strokeStyle = hsl(197, 42, 66, s.opacity * 0.006);
        ctx.lineWidth = 2;
        function layer(angle, hue, offset) {
          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.rotate(angle * Math.PI / 180);
          ctx.translate(-w / 2, -h / 2);
          ctx.strokeStyle = hsl(hue, 42, 66, s.opacity * 0.005);
          for (let i = -s.blades; i < s.blades * 2; i++) {
            const x = pad + i * s.spacing + (running ? Math.sin(frame * 0.018 + i) * s.warp * 0.04 : 0) + offset;
            ctx.beginPath();
            ctx.moveTo(x, pad);
            ctx.lineTo(x + s.warp * 0.5, h - pad);
            ctx.stroke();
          }
          ctx.restore();
        }
        layer(s.angleA, 196, 0);
        layer(s.angleB, 42, s.spacing * 0.5);
        ctx.strokeStyle = hsl(210, 12, 65, 0.4);
        ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
      }
    },

    weave_matrix: {
      title: "noixzy weave matrix",
      sub: "plain, twill, satin-like crossings, textile logic as facade",
      seed: "weave-matrix-001",
      accent: "#d7b3e8",
      defaults: { threads: 28, over: 3, under: 2, thickness: 7, gap: 4, contrast: 58 },
      controls: [
        ["threads", "threads", 8, 48, 1],
        ["over", "over", 1, 8, 1],
        ["under", "under", 1, 8, 1],
        ["thickness", "thickness", 2, 14, 1],
        ["gap", "gap", 1, 12, 1],
        ["contrast", "contrast", 0, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, hsl } = env;
        const pad = Math.min(w, h) * 0.08;
        const size = Math.min(w - pad * 2, h - pad * 2);
        const step = size / s.threads;
        ctx.lineCap = "round";
        for (let i = 0; i < s.threads; i++) {
          const p = pad + i * step + step / 2;
          ctx.strokeStyle = hsl(282, 30, 38 + s.contrast * 0.18, 0.72);
          ctx.lineWidth = s.thickness;
          ctx.beginPath();
          ctx.moveTo(p, pad);
          ctx.lineTo(p, pad + size);
          ctx.stroke();
          ctx.strokeStyle = hsl(36, 34, 34 + s.contrast * 0.22, 0.78);
          for (let j = 0; j < s.threads; j++) {
            const over = (i + j) % (s.over + s.under) < s.over;
            if (!over) continue;
            const y = pad + j * step + step / 2;
            ctx.beginPath();
            ctx.moveTo(p - step * 0.5 + s.gap, y);
            ctx.lineTo(p + step * 0.5 - s.gap, y);
            ctx.stroke();
          }
        }
      }
    },

    labyrinth_field: {
      title: "noixzy labyrinth field",
      sub: "recursive maze circuits, ritual paths, plan-view linework",
      seed: "labyrinth-field-001",
      accent: "#bfc6aa",
      defaults: { cells: 24, turnBias: 48, braid: 22, lineWeight: 3, markers: 30, scale: 86 },
      controls: [
        ["cells", "cells", 8, 42, 1],
        ["turnBias", "turn bias", 0, 100, 1],
        ["braid", "braid", 0, 100, 1],
        ["lineWeight", "line weight", 1, 8, 1],
        ["markers", "markers", 0, 100, 1],
        ["scale", "scale", 50, 100, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, hsl } = env;
        const n = s.cells;
        const size = Math.min(w, h) * s.scale * 0.01;
        const cell = size / n;
        const ox = (w - size) / 2;
        const oy = (h - size) / 2;
        const visited = Array.from({ length: n }, () => Array(n).fill(false));
        const walls = Array.from({ length: n }, () => Array.from({ length: n }, () => [1, 1, 1, 1]));
        const stack = [[0, 0]];
        visited[0][0] = true;
        while (stack.length) {
          const cur = stack[stack.length - 1];
          const dirs = [[0, -1, 0, 2], [1, 0, 1, 3], [0, 1, 2, 0], [-1, 0, 3, 1]]
            .sort(() => rng() - 0.5 + (s.turnBias - 50) * 0.0005);
          const next = dirs.map(d => [cur[0] + d[0], cur[1] + d[1], d[2], d[3]])
            .find(p => p[0] >= 0 && p[0] < n && p[1] >= 0 && p[1] < n && !visited[p[1]][p[0]]);
          if (!next) { stack.pop(); continue; }
          walls[cur[1]][cur[0]][next[2]] = 0;
          walls[next[1]][next[0]][next[3]] = 0;
          visited[next[1]][next[0]] = true;
          stack.push([next[0], next[1]]);
        }
        ctx.strokeStyle = hsl(70, 22, 66, 0.82);
        ctx.lineWidth = s.lineWeight;
        ctx.lineCap = "square";
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
          if (rng() * 100 < s.braid) walls[y][x][Math.floor(rng() * 4)] = 0;
          const px = ox + x * cell, py = oy + y * cell;
          const ws = walls[y][x];
          [[0, px, py, px + cell, py], [1, px + cell, py, px + cell, py + cell], [2, px, py + cell, px + cell, py + cell], [3, px, py, px, py + cell]].forEach(e => {
            if (!ws[e[0]]) return;
            ctx.beginPath(); ctx.moveTo(e[1], e[2]); ctx.lineTo(e[3], e[4]); ctx.stroke();
          });
          if (rng() * 100 < s.markers * 0.03) {
            ctx.fillStyle = hsl(42, 30, 66, 0.5);
            ctx.fillRect(px + cell * 0.35, py + cell * 0.35, cell * 0.3, cell * 0.3);
          }
        }
      }
    },

    tensegrity_web: {
      title: "noixzy tensegrity web",
      sub: "floating compression bars, tension cables, structural equilibrium diagrams",
      seed: "tensegrity-web-001",
      accent: "#a9c8ff",
      defaults: { struts: 18, cables: 4, spread: 72, barWeight: 5, cableWeight: 1, spin: 18 },
      controls: [
        ["struts", "struts", 4, 42, 1],
        ["cables", "cables", 1, 8, 1],
        ["spread", "spread", 20, 100, 1],
        ["barWeight", "bar weight", 2, 12, 1],
        ["cableWeight", "cable weight", 1, 5, 1],
        ["spin", "spin", -80, 80, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, frame, running, hsl } = env;
        const pts = [];
        const rot = (s.spin + (running ? frame * 0.025 : 0)) * Math.PI / 180;
        for (let i = 0; i < s.struts * 2; i++) {
          const a = rot + i * Math.PI * 2 / (s.struts * 2);
          const r = Math.min(w, h) * (0.08 + rng() * s.spread * 0.004);
          pts.push([w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a * 1.33) * r * 0.72]);
        }
        ctx.lineCap = "round";
        ctx.strokeStyle = hsl(218, 38, 68, 0.28);
        ctx.lineWidth = s.cableWeight;
        for (let i = 0; i < pts.length; i++) {
          for (let c = 1; c <= s.cables; c++) {
            const q = pts[(i + c * 3) % pts.length];
            ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
          }
        }
        ctx.strokeStyle = hsl(39, 28, 72, 0.82);
        ctx.lineWidth = s.barWeight;
        for (let i = 0; i < pts.length - 1; i += 2) {
          ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke();
        }
      }
    },

    section_stack: {
      title: "noixzy section stack",
      sub: "topographic building sections, layered strata, extrusion slices",
      seed: "section-stack-001",
      accent: "#d3c09b",
      defaults: { layers: 24, amplitude: 52, frequency: 5, offset: 34, thickness: 2, cutaways: 28 },
      controls: [
        ["layers", "layers", 6, 48, 1],
        ["amplitude", "amplitude", 0, 100, 1],
        ["frequency", "frequency", 1, 12, 1],
        ["offset", "offset", 0, 80, 1],
        ["thickness", "thickness", 1, 6, 1],
        ["cutaways", "cutaways", 0, 80, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, frame, running, hsl } = env;
        const pad = Math.min(w, h) * 0.08;
        const layerGap = (h - pad * 2) / s.layers;
        ctx.lineWidth = s.thickness;
        ctx.lineJoin = "round";
        for (let l = 0; l < s.layers; l++) {
          const y = pad + l * layerGap;
          ctx.beginPath();
          for (let i = 0; i <= 100; i++) {
            const u = i / 100;
            const x = pad + u * (w - pad * 2);
            const wave = Math.sin(u * Math.PI * 2 * s.frequency + l * 0.38 + (running ? frame * 0.01 : 0));
            const cut = rng() * 100 < s.cutaways && i % 11 < 2 ? -layerGap * 0.8 : 0;
            const yy = y + wave * s.amplitude * 0.12 + Math.sin(l * 0.7) * s.offset * 0.08 + cut;
            i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
          }
          ctx.strokeStyle = hsl(38 + l, 26, 62 - l * 0.45, 0.72);
          ctx.stroke();
        }
      }
    },

    lsystem_canopy: {
      title: "noixzy l-system canopy",
      sub: "branching grammar, column-to-canopy growth, botanical structure plans",
      seed: "lsystem-canopy-001",
      accent: "#b7d7a2",
      defaults: { depth: 7, angle: 24, shrink: 68, branches: 2, thickness: 7, sway: 26 },
      controls: [
        ["depth", "depth", 2, 10, 1],
        ["angle", "angle", 5, 48, 1],
        ["shrink", "shrink", 45, 82, 1],
        ["branches", "branches", 1, 4, 1],
        ["thickness", "thickness", 1, 12, 1],
        ["sway", "sway", 0, 80, 1]
      ],
      render(ctx, env) {
        const { w, h, s, rng, frame, running, hsl } = env;
        ctx.lineCap = "round";
        function branch(x, y, len, a, d) {
          if (d <= 0 || len < 2) return;
          const wob = running ? Math.sin(frame * 0.012 + d + a) * s.sway * 0.003 : 0;
          const nx = x + Math.cos(a + wob) * len;
          const ny = y + Math.sin(a + wob) * len;
          ctx.strokeStyle = hsl(92, 32, 32 + d * 5, 0.72);
          ctx.lineWidth = Math.max(0.8, s.thickness * d / s.depth);
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();
          for (let i = 0; i < s.branches; i++) {
            const spread = (i - (s.branches - 1) / 2) * s.angle * Math.PI / 180;
            branch(nx, ny, len * s.shrink * 0.01 * (0.94 + rng() * 0.12), a - Math.PI / 2 * 0.05 + spread + (rng() - 0.5) * 0.24, d - 1);
          }
        }
        branch(w * 0.5, h * 0.86, Math.min(w, h) * 0.17, -Math.PI / 2, s.depth);
      }
    }
  };

  function installStyle(accent) {
    const style = document.createElement("style");
    style.textContent = `
      :root { color-scheme: dark; --bg:#050505; --panel:#101010; --line:#2c2c2c; --text:#e7e2d8; --muted:#8f8a82; --accent:${accent}; }
      * { box-sizing: border-box; }
      html, body { width:100%; height:100%; margin:0; overflow:hidden; background:var(--bg); color:var(--text); font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace; }
      body { display:grid; grid-template-columns:minmax(0,1fr) 292px; min-height:100vh; }
      main { min-width:0; min-height:0; background:radial-gradient(circle at 50% 28%, rgba(255,255,255,.07), transparent 34%), linear-gradient(180deg,#101010,#020202 85%); }
      canvas { display:block; width:100%; height:100%; }
      aside { border-left:1px solid var(--line); background:rgba(13,13,13,.97); padding:14px; overflow:auto; }
      h1 { margin:0 0 4px; font-size:15px; letter-spacing:0; text-transform:lowercase; }
      .sub { margin:0 0 14px; color:var(--muted); font-size:11px; line-height:1.45; }
      .buttons { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px; }
      button { min-height:34px; border:1px solid #373737; background:#171717; color:var(--text); font:inherit; font-size:11px; text-transform:lowercase; cursor:pointer; }
      button:hover { border-color:var(--accent); }
      .seed-row { display:grid; grid-template-columns:44px 1fr; gap:8px; align-items:center; margin-bottom:14px; }
      label, .seed-row span { color:var(--muted); font-size:11px; text-transform:lowercase; }
      input[type="text"] { width:100%; border:1px solid #343434; background:#080808; color:var(--text); padding:8px; font:inherit; font-size:11px; }
      .control { padding:10px 0; border-top:1px solid #222; }
      .control-head { display:flex; justify-content:space-between; gap:12px; margin-bottom:7px; font-size:11px; }
      .value { color:var(--accent); min-width:42px; text-align:right; }
      input[type="range"] { width:100%; accent-color:var(--accent); }
      .physics-toggle { display:flex; align-items:center; gap:8px; margin:10px 0 12px; padding:9px 0; border-top:1px solid #222; border-bottom:1px solid #222; color:var(--muted); font-size:11px; text-transform:lowercase; }
      .physics-toggle input { accent-color:var(--accent); }
      .note { margin-top:14px; padding-top:12px; border-top:1px solid #222; color:#706b64; font-size:10px; line-height:1.45; }
      @media (max-width:760px) { body { grid-template-columns:1fr; grid-template-rows:minmax(0,1fr) 315px; } aside { border-left:0; border-top:1px solid var(--line); } }
    `;
    document.head.appendChild(style);
  }

  function hashString(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function randomSource(seed) {
    let t = hashString(seed) || 1;
    return function random() {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function hsl(h, s, l, a) {
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  window.initNoixzyCandidate = function initNoixzyCandidate(id) {
    const mod = MODULES[id];
    if (!mod) throw new Error(`Unknown noixzy candidate: ${id}`);
    document.title = mod.title;
    installStyle(mod.accent);
    document.body.innerHTML = `
      <main><canvas id="view" aria-label="${mod.title} canvas"></canvas></main>
      <aside>
        <h1>${mod.title}</h1>
        <p class="sub">${mod.sub}</p>
        <div class="buttons">
          <button id="play">pause</button>
          <button id="randomize">randomize</button>
          <button id="reset">reset</button>
          <button id="export">export png</button>
        </div>
        <div class="seed-row">
          <span>seed</span>
          <input id="seed" type="text" value="${mod.seed}" spellcheck="false">
        </div>
        <div id="controls"></div>
        <label class="physics-toggle"><input id="experimental-physics" type="checkbox"> experimental physics</label>
        <p class="note">escrow candidate. controls are intentionally narrow so the module can graduate into the main lab shell cleanly.</p>
      </aside>
    `;

    const canvas = document.getElementById("view");
    const ctx = canvas.getContext("2d");
    const controls = document.getElementById("controls");
    const seedInput = document.getElementById("seed");
    const playButton = document.getElementById("play");
    const values = {};
    const controlMeta = Object.fromEntries(mod.controls.map(([key, label, min, max]) => [key, { min, max, label }]));
    let state = { ...mod.defaults };
    let stageBaseState = { ...state };
    let running = true;
    let frame = 0;
    let w = 1;
    let h = 1;
    let dpr = 1;
    let experimentalPhysics = false;
    function snapToStep(value, min, max, step) {
      const safeStep = Number(step) || 1;
      const snapped = Math.round(value / safeStep) * safeStep;
      const clamped = Math.max(Number(min), Math.min(Number(max), snapped));
      return Number.isInteger(safeStep) ? Math.round(clamped) : Number(clamped.toFixed(3));
    }
    function randomBiasFor(key) {
      const k = String(key).toLowerCase();
      if (/palette|material|color|hue/.test(k)) return Math.random();
      if (/density|count|steps|grid|cells|points|nodes|modules|copies|ribbons|rings|lots|pins|markers|bays|divisions|segments|particles|agents|threads|strands|colonies|cracks|repeats/.test(k)) return 0.38 + Math.random() * 0.62;
      if (/extrude|depth|height|stack|layer|relief|bump|displace|amplitude|thickness|width|size|scale|span|vault|socket|scaffold|subdivision|recursion|order|branch|iteration|deflation/.test(k)) return 0.28 + Math.random() * 0.72;
      if (/offset|jitter|noise|field|force|curl|twist|warp|phase|bias|tilt|rotation|entropy|diffusion|oscillation|turbulence|morph|strictness|void|mortar/.test(k)) return 0.12 + Math.random() * 0.76;
      if (/line|stroke|trace|arc/.test(k)) return 0.18 + Math.random() * 0.62;
      return 0.15 + Math.random() * 0.7;
    }
    function randomizeModuleControls() {
      controls.querySelectorAll(".control").forEach(wrap => {
        const input = wrap.querySelector('input[type="range"]');
        if (!input) return;
        const labelNode = wrap.querySelector(".head span, .control-head label");
        const valueNode = wrap.querySelector(".head b, .value");
        const key = labelNode ? labelNode.textContent.trim() : input.id;
        const min = Number(input.min), max = Number(input.max), step = Number(input.step) || 1;
        const value = snapToStep(min + (max - min) * randomBiasFor(key), min, max, step);
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        if (valueNode) valueNode.textContent = value;
      });
      experimentalPhysics = Math.random() > 0.55;
      const physics = document.getElementById("experimental-physics");
      if (physics) physics.checked = experimentalPhysics;
      applyExperimentalPhysics();
    }
    function applyExperimentalPhysics() {
      const dx = experimentalPhysics ? Math.sin(frame * 0.017) * 4.5 : 0;
      const dy = experimentalPhysics ? Math.cos(frame * 0.013) * 3.5 : 0;
      const breathe = experimentalPhysics ? 1 + Math.sin(frame * 0.011) * 0.004 : 1;
      canvas.style.transformOrigin = "50% 50%";
      canvas.style.transform = experimentalPhysics ? `translate3d(${dx}px, ${dy}px, 0) scale(${breathe})` : "";
      canvas.style.filter = experimentalPhysics ? "contrast(1.06) saturate(1.08)" : "";
    }


    function buildControls() {
      controls.innerHTML = "";
      mod.controls.forEach(([key, label, min, max, step]) => {
        const wrap = document.createElement("div");
        wrap.className = "control";
        wrap.innerHTML = `
          <div class="control-head">
            <label for="${key}">${label}</label>
            <span class="value" id="${key}Value">${state[key]}</span>
          </div>
          <input id="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}">
        `;
        controls.appendChild(wrap);
        values[key] = wrap.querySelector(".value");
        const input = wrap.querySelector("input");
        input.addEventListener("input", event => {
          state[key] = Number(event.target.value);
          stageBaseState[key] = state[key];
          values[key].textContent = state[key];
          draw();
        });
      });
    }

    function applyStateToUi() {
      mod.controls.forEach(([key]) => {
        const input = document.getElementById(key);
        if (!input) return;
        input.value = state[key];
        if (values[key]) values[key].textContent = state[key];
      });
    }

    function drive(keys, blend) {
      keys.forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(state, key)) return;
        const meta = controlMeta[key];
        if (!meta) return;
        const span = meta.max - meta.min;
        state[key] = clamp(stageBaseState[key] + span * blend, meta.min, meta.max);
      });
    }

    function applyStageParams(stage) {
      if (!stage || typeof stage !== "object") return;
      const geom = clamp((Math.abs(stage.depth) / 260 + Math.abs(stage.rotateX) / 55 + Math.abs(stage.rotateY) / 55) / 3, 0, 1);
      const arrayEnergy = clamp(((stage.arrayCount - 1) / 8) * 0.7 + (stage.arraySpread / 180) * 0.3, 0, 1);
      const kitbashEnergy = stage.kitbash === "none" ? 0 : clamp((stage.kitbashDensity / 14) * 0.55 + (stage.kitbashScale / 140) * 0.45, 0, 1);
      const materialEnergy = clamp((stage.material + 80) / 160, 0, 1);
      const tempo = clamp((stage.zoom - 55) / 90, 0, 1);

      state = { ...stageBaseState };
      drive(["density", "cells", "colonies", "nodes", "repeats", "rings", "cracks", "baysX", "baysY", "divisions", "pointCount", "agentCount", "curveCount", "strands", "threads", "segments", "orbitCount", "seedCount", "count", "moduleCount", "unitCount"], (arrayEnergy + kitbashEnergy) * 0.24);
      drive(["lineWeight", "stroke", "thickness", "lineScale", "bandWidth", "strandWidth", "traceWeight", "lineDensity", "ribDensity"], (materialEnergy + kitbashEnergy) * 0.22 - 0.08);
      drive(["depth", "extrude", "extrusion", "vaultHeight", "amplitude", "height", "displace", "offset"], (geom + arrayEnergy) * 0.28 - 0.1);
      drive(["subdivision", "subdivisions", "detail", "detailLevel", "recursion", "recursionDepth", "branchDepth", "iterations", "deflation"], (geom + kitbashEnergy) * 0.2);
      drive(["jitter", "noiseScale", "noise", "drift", "turbulence", "chaos", "branchRate", "repulsion", "constraint", "entropy", "phase", "rotation", "twist", "perspective"], (arrayEnergy + materialEnergy + (stage.rotateY / 55)) * 0.16);
      drive(["speed", "flow", "velocity", "growth", "tempo", "curl", "waveSpeed"], tempo * 0.22 + arrayEnergy * 0.06);
      applyStateToUi();
      draw();
    }


    const physicsToggle = document.getElementById("experimental-physics");
    if (physicsToggle) physicsToggle.onchange = () => { experimentalPhysics = physicsToggle.checked; applyExperimentalPhysics(); draw(true); };

    function resize() {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      w = Math.max(320, Math.floor(rect.width));
      h = Math.max(260, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "#101010");
      gradient.addColorStop(0.58, "#070707");
      gradient.addColorStop(1, "#020202");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const rng = randomSource(`${seedInput.value}|${id}`);
      mod.render(ctx, { w, h, dpr, s: state, frame, running, rng, clamp, hsl });

      ctx.fillStyle = "rgba(231,226,216,.68)";
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText(seedInput.value || "seed", 16, h - 18);
    }

    function tick() {
      if (running) {
        frame++;
        applyExperimentalPhysics();
        draw();
      }
      requestAnimationFrame(tick);
    }

    function randomSeed() {
      const base = id.replace(/^noixzy_/, "").replace(/_/g, "-");
      return `${base}-${Math.floor(Math.random() * 999999).toString(36)}`;
    }

    function resetAll() {
      experimentalPhysics = false;
      const physics = document.getElementById("experimental-physics");
      if (physics) physics.checked = false;
      applyExperimentalPhysics();
      state = { ...mod.defaults };
      stageBaseState = { ...state };
      seedInput.value = mod.seed;
      mod.controls.forEach(([key]) => {
        const input = document.getElementById(key);
        input.value = state[key];
        values[key].textContent = state[key];
      });
      frame = 0;
      draw();
    }

    function exportPng() {
      draw();
      const link = document.createElement("a");
      link.download = `${id}_${seedInput.value || "seed"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }

    seedInput.addEventListener("input", draw);
    playButton.addEventListener("click", () => {
      running = !running;
      playButton.textContent = running ? "pause" : "play";
      draw();
    });
    document.getElementById("randomize").addEventListener("click", () => {
      seedInput.value = randomSeed();
      randomizeModuleControls();
      stageBaseState = { ...state };
      draw();
    });
    document.getElementById("reset").addEventListener("click", resetAll);
    document.getElementById("export").addEventListener("click", exportPng);
    window.addEventListener("message", event => {
      if (!event.data || event.data.type !== "noixzy:stage-params") return;
      applyStageParams(event.data.stage);
    });
    window.addEventListener("resize", resize);

    buildControls();
    resize();
    applyExperimentalPhysics();
    tick();
  };
})();
