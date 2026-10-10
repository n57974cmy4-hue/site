"""Moorish window: a panel with a pointed top, pierced by a pointed horseshoe arch."""
import math, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / 'tools'))
import make_shape as ms

def pointed_arch(cx, half, spring_y, apex_y, horseshoe, steps=60):
    """Two circular arcs meeting at the apex. Each arc is centred on the far side of
    the axis; `horseshoe` > 0 carries the arcs below the springing line, inwards."""
    # circle through (cx - half, spring_y) and apex (cx, apex_y), centre on y = spring_y
    # centre x = cx + d, radius r: (half + d)^2 = r^2 = d^2 + (spring_y - apex_y)^2
    h = spring_y - apex_y
    d = (h * h - half * half) / (2 * half)
    r = half + d
    # left arc: centre (cx + d, spring_y), from below the springing up to the apex
    a0 = math.pi + horseshoe                       # below horizontal on the left side
    a1 = math.atan2(-(apex_y - spring_y), -d)      # angle of the apex (y up convention)
    a1 = math.pi - math.atan2(h, d)
    left = [(cx + d + r * math.cos(a0 + (a1 - a0) * k / steps),
             spring_y - r * math.sin(a0 + (a1 - a0) * k / steps)) for k in range(steps + 1)]
    right = [(2 * cx - x, y) for x, y in reversed(left)]
    return left + right[1:]

def build():
    # outer panel: straight sides, pointed top, softened corners
    outer_top = pointed_arch(500, 250, 430, 60, 0.0, steps=70)
    outer = [(250, 940)] + outer_top + [(750, 940)]
    outer = ms.fillet(outer, [40] + [2] * (len(outer_top)) + [40])
    # opening: pointed horseshoe arch on straight jambs, closed by a sill
    arch = pointed_arch(500, 178, 450, 175, 0.42, steps=70)
    jl, jr = arch[0], arch[-1]
    hole = [(jl[0], 868)] + arch + [(jr[0], 868)]
    hole = ms.fillet(hole, [14] + [1] * len(arch) + [14])
    return [outer, list(reversed(hole))]

contours = build()
for c in contours:
    print('crossings', ms.self_crossings(c), 'kernel', round(ms.kernel_area(c) / abs(ms.area(c)), 3))
ms.write_fitted(contours, sys.argv[1])
