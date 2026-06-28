# Author: Chris Tucker and OpenAI
from __future__ import annotations

from pathlib import Path


def verify(paths):
    print('[phase_space] final verify')
    for p in paths:
        p = Path(p)
        if p.exists():
            print(f'  OK  {p}  {p.stat().st_size:,} bytes')
        else:
            print(f'  MISS {p}')
