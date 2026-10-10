import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parent.parent / 'tools'))
import make_shape as ms

P = [
    # bust base, left to right
    (215, 950), (515, 956), (805, 950),
    # veil draped over the chest, rising to the chin
    (838, 875), (812, 785), (758, 712), (708, 652), (688, 612),
    # face profile, chin to forehead: few, broad features so the bevel keeps them
    (704, 584), (724, 560), (712, 538), (724, 516), (718, 498),
    (764, 466), (724, 416), (712, 372),
    # veil edge over the forehead, then the crown
    (738, 336), (736, 272), (680, 192), (585, 142), (470, 138), (368, 180), (298, 258),
    # veil falling behind the head and flaring down the back
    (262, 365), (250, 485), (236, 605), (212, 725), (185, 845),
]
outline = ms.smooth_closed(P, steps=20)
print('crossings', ms.self_crossings(outline), 'kernel', round(ms.kernel_area(outline) / ms.area(outline), 3))
ms.write_fitted([outline], sys.argv[1])
