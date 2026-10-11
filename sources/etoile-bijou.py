"""Eight-point star jewel, after the khatam of the zellige, pierced at its centre like a brooch.

    python3 sources/etoile-bijou.py assets/shapes/shape.svg
"""
import math, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / 'tools'))
import make_shape as ms

R = 380.0
NOTCH = R * 0.64                                           # depth of the notches between rays


def build():
    corners = []
    for k in range(16):
        a = -math.pi / 2 + k * math.pi / 8
        r = R if k % 2 == 0 else NOTCH
        corners.append((ms.C + r * math.cos(a), ms.C + r * math.sin(a)))
    outline = ms.fillet(corners, [24, 16] * 8)
    hole = list(reversed(ms.circle(ms.C, ms.C, R * 0.24, n=120)))
    return [outline, hole]


if __name__ == '__main__':
    contours = build()
    for c in contours:
        print('crossings', ms.self_crossings(c), 'kernel', round(ms.kernel_area(c) / abs(ms.area(c)), 3))
    ms.write_fitted(contours, sys.argv[1])
