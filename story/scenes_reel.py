def S(st, **v):
    return (st, v)


# Beat 0 — Intro (teaser, 7 shots, cuts <= 2.5s)
B0 = [
    S('rbedroom', fr='wide', night=True, angle='bed_left', tossing=True, cm='rise', fc=[540, 700, 1.6]),
    S('rface', fr='close', who='mitch', expr='fear', loc='bedroom', x=680, k=1.5, turn=0.15, tag='NO LONGER NONSENSE'),
    S('rbedroom', fr='bust', night=True, angle='window_top', c='jack', shadow='jack', face=1, px=-80, ooze=0.3, pose='lean', dark=0.255, cm='rise', fc=[600, 720, 1.8]),
    S('rhallway', fr='wide', night=True, angle='flee', fleeing=True, dark=0.25, cm='truck', fc=[540, 700, 1.5]),
    S('rwoods', fr='wide', night=True, angle='pines_left', c='jack', creature='jack', face=-1, px=100, ooze=0.5, pose='stand', dark=0.25, cm='push', fc=[560, 720, 1.7]),
    S('rcar', fr='bust', day=False, angle='seat_prop', holding=True, dark=0.2, cm='truck', fc=[540, 800, 1.8]),
    S('rwoods', fr='waist', night=True, angle='clearing', c='jack', shadow='jack', dark=0.25, cm='pull', fc=[520, 700, 1.6]),
]

# Beat 1 — cut line (1 shot)
B1 = [
    S('rhallway', fr='wide', night=True, angle='stairs', empty=True, dark=0.25, cm='rise', fc=[540, 700, 1.5]),
]

# Beat 2 — Moving In (6 shots)
B2 = [
    S('rkitchen', fr='wide', day=True, angle='boxes_left', boxes=True, cm='rise', fc=[540, 720, 1.6]),
    S('rhallway', fr='bust', day=True, angle='greet', who2='edwin', greet=True, cm='rise', fc=[540, 760, 1.7]),
    S('rbedroom', fr='wide', day=True, angle='door_open', settling=True, cm='rise', fc=[480, 700, 1.6]),
    S('rkitchen', fr='bust', day=True, angle='table_talk', who2='edwin', expr='neutral', cm='truck', fc=[520, 740, 1.6]),
    S('rkitchen', fr='wide', day=True, angle='counter', settling=True, dark=0.15, cm='pull', fc=[540, 720, 1.6]),
    S('rbedroom', fr='waist', day=True, angle='bed_left', settling=True, dark=0.1, cm='push', fc=[460, 720, 1.6]),
]

# Beat 3 — The Raccoon (7 shots)
B3 = [
    S('rbedroom', fr='wide', night=True, angle='window_top', curtain=True, cm='rise', fc=[480, 700, 1.7]),
    S('rface', fr='close', who='mitch', expr='fear', loc='kitchen', x=420, k=1.4, turn=-0.1, tag='JUST A RACCOON'),
    S('rhallway', fr='bust', night=True, angle='mirror', empty=True, dark=0.2, cm='truck', fc=[540, 680, 1.7]),
    S('rwoods', fr='wide', night=True, angle='standard', running=False, dark=0.2, cm='pull', fc=[520, 700, 1.6]),
    S('rkitchen', fr='bust', day=True, angle='counter', who2='edwin', talk=True, cm='rise', fc=[540, 740, 1.6]),
    S('rkitchen', fr='wide', day=True, angle='door_yard', greet=True, dark=0.1, cm='pull', fc=[500, 720, 1.6]),
    S('rhallway', fr='waist', night=True, angle='flee', empty=True, dark=0.35, cm='push', fc=[540, 710, 1.6]),
]

# Beat 4 — Open Window + Gash (8 shots)
B4 = [
    S('rbedroom', fr='wide', night=True, angle='bed_left', open_win=True, c='jack', shadow='jack', face=-1, px=120, ooze=0.15, pose='stand', dark=0.25, cm='rise', fc=[640, 680, 1.8]),
    S('rface', fr='close', who='mitch', expr='fear', loc='emergency', x=540, k=1.8, turn=0.2, tag='SOMETHING CAME IN'),
    S('rhallway', fr='bust', day=True, angle='stairs', who2='edwin', expr='fear', cm='rise', fc=[540, 720, 1.8]),
    S('rwoods', fr='wide', day=True, angle='clearing', cm='push', fc=[540, 720, 1.7]),
    S('rkitchen', fr='waist', day=True, angle='mug_floor', talk=True, dark=0.2, cm='pull', fc=[500, 730, 1.7]),
    S('rface', fr='close', who='mitch', expr='fear', loc='kitchen', x=680, k=1.5, gash=True, turn=0.0, tag='WHAT HAPPENED TO ME'),
    S('rhallway', fr='bust', day=True, angle='mirror', mirror=True, gash=True, cm='rise', fc=[540, 760, 1.8]),
    S('rcar', fr='wide', day=True, angle='exterior', driving=False, dark=0.25, cm='truck', fc=[520, 720, 1.6]),
]

# Beat 5 — Missing (5 shots)
B5 = [
    S('rhospital', fr='wide', day=True, angle='wide_clinic', who2='doctor', cm='rise', fc=[540, 700, 1.6]),
    S('rface', fr='close', who='mitch', expr='fear', loc='hospital', x=400, k=1.4, turn=0.1, tag='MY KIDNEY IS GONE'),
    S('rhospital', fr='bust', day=True, angle='xray_chart', bandage=True, red=0.4, cm='rise', fc=[560, 780, 1.8]),
    S('rhospital', fr='wide', day=True, angle='bed_monitor', bedridden=True, dark=0.15, cm='pull', fc=[520, 720, 1.6]),
    S('rhospital', fr='bust', day=True, angle='bed_monitor', who2='doctor', expr='neutral', cm='truck', fc=[550, 740, 1.7]),
]

# Beat 6 — Face to Face (6 shots)
B6 = [
    S('rbedroom', fr='wide', night=True, angle='door_open', c='jack', creature='jack', face=1, px=-80, ooze=0.6, pose='lean', dark=0.25, cm='rise', fc=[520, 680, 1.7]),
    S('rface', fr='close', who='mitch', expr='fear', loc='bedroom', x=660, k=1.65, turn=0.3, tag='EMPTY BLACK SOCKETS'),
    S('rbedroom', fr='bust', night=True, angle='door_open', c='jack', creature='jack', face=-1, px=160, ooze=0.75, pose='lean', dark=0.255, cm='rise', fc=[600, 700, 1.9]),
    S('rbedroom', fr='waist', night=True, angle='window_top', c='jack', creature='jack', face=1, px=0, ooze=0.65, pose='stand', dark=0.2, cm='push', fc=[540, 700, 1.7]),
    S('rwoods', fr='wide', night=True, angle='pines_left', c='jack', shadow='jack', face=-1, px=100, ooze=0.7, pose='lean', dark=0.25, cm='pull', fc=[560, 690, 1.7]),
    S('rwoods', fr='bust', night=True, angle='clearing', c='jack', creature='jack', face=1, px=40, ooze=0.8, pose='stand', dark=0.252, cm='truck', fc=[540, 710, 1.8]),
]

# Beat 7 — Into the Woods (6 shots)
B7 = [
    S('rbedroom', fr='wide', night=True, angle='bed_left', c='jack', creature='jack', face=1, px=40, ooze=0.9, pose='lunge', dark=0.25, cm='rise', fc=[540, 700, 1.8]),
    S('rhallway', fr='wide', night=True, angle='mirror', fleeing=True, dark=0.2, cm='rise', fc=[520, 710, 1.6]),
    S('rwoods', fr='wide', night=True, angle='standard', running=True, mist=True, cm='rise', fc=[500, 740, 1.7]),
    S('rwoods', fr='bust', night=True, angle='moon_left', c='jack', creature='jack', face=-1, px=-100, ooze=0.5, pose='stand', dark=0.25, cm='rise', fc=[600, 760, 1.8]),
    S('rwoods', fr='waist', night=True, angle='clearing', c='jack', creature='jack', face=1, px=50, ooze=0.6, pose='lunge', dark=0.255, cm='push', fc=[520, 730, 1.8]),
    S('rcar', fr='wide', night=True, angle='dash_interior', driving=False, dark=0.2, cm='pull', fc=[520, 740, 1.7]),
]

# Beat 8 — Edwin (5 shots)
B8 = [
    S('rhospital', fr='wide', day=True, angle='xray_chart', bedridden=True, cm='rise', fc=[540, 700, 1.6]),
    S('rface', fr='close', who='mitch', expr='fear', loc='woods', x=540, k=1.8, turn=-0.2, tag='EDWIN IS DEAD'),
    S('rhospital', fr='bust', day=True, angle='bed_monitor', who2='doctor', expr='neutral', cm='rise', fc=[560, 730, 1.8]),
    S('rhospital', fr='wide', day=True, angle='bed_monitor', bandage=True, red=0.3, dark=0.1, cm='pull', fc=[530, 710, 1.6]),
    S('rhospital', fr='bust', day=True, angle='xray_chart', bedridden=True, dark=0.2, cm='truck', fc=[550, 720, 1.7]),
]

# Beat 9 — The Kidney (8 shots)
B9 = [
    S('rhallway', fr='wide', day=True, angle='stairs', shadowed=True, dark=0.35, red=0.2, cm='rise', fc=[500, 700, 1.6]),
    S('rcar', fr='wide', day=True, angle='exterior', driving=True, cm='rise', fc=[520, 740, 1.6]),
    S('rcar', fr='bust', day=True, angle='seat_prop', holding=True, dark=0.3, cm='rise', fc=[560, 820, 1.9]),
    S('rhallway', fr='bust', day=True, angle='mirror', shadowed=True, dark=0.2, cm='truck', fc=[530, 720, 1.7]),
    S('rcar', fr='waist', day=True, angle='exterior', holding=True, dark=0.25, cm='push', fc=[540, 780, 1.7]),
    S('rcar', fr='wide', day=True, angle='exterior', driving=True, dark=0.2, cm='pull', fc=[510, 730, 1.6]),
    S('rcar', fr='bust', day=True, angle='wheel_steer', holding=True, dark=0.35, cm='rise', fc=[550, 800, 1.8]),
    S('rface', fr='close', who='mitch', expr='fear', loc='car', x=680, k=1.5, turn=-0.1, tag='STILL WARM'),
]

# Beat 10 — credit
B10 = [
    S('rqcard', credit=True),
]

# Beat 11 — closing question
B11 = [
    S('rqcard', question=True),
]

SC = [B0, B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11]

_CARDS = {'rqcard'}
_FACE = 'rface'
for _b, _scn in enumerate(SC):
    _j = 0
    for _st, _v in _scn:
        if _st in _CARDS:
            continue
        if _st == _FACE:
            _v.setdefault('fr', 'close')
            continue
        if 'fr' not in _v:
            _v['fr'] = 'wide' if _j % 2 == 0 else 'bust'
        _j += 1
