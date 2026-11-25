def S(st, **v):
    return (st, v)


# Beat 0 — Intro (teaser: 7 shots, cuts <= 2.5s, creepiest first)
B0 = [
    S('bedroom', fr='wide', night=True, angle='bed_left', tossing=True, cm='rise', fc=[960, 420, 1.6]),
    S('face', fr='close', who='mitch', expr='fear', loc='bedroom', x=1180, k=1.3, turn=0.15, tag='NO LONGER NONSENSE'),
    S('bedroom', fr='bust', night=True, angle='window_left', c='jack', shadow='jack', face=1, px=-260, ooze=0.3, pose='lean', dark=0.255, cm='rise', fc=[1280, 500, 1.8]),
    S('hallway', fr='wide', night=True, angle='flee', fleeing=True, dark=0.25, cm='truck', fc=[960, 460, 1.5]),
    S('woods', fr='wide', night=True, angle='pines_left', c='jack', creature='jack', face=-1, px=180, ooze=0.5, pose='stand', dark=0.25, cm='push', fc=[1100, 440, 1.7]),
    S('car', fr='bust', day=False, angle='seat_prop', holding=True, dark=0.2, cm='truck', fc=[960, 540, 1.8]),
    S('woods', fr='waist', night=True, angle='clearing', c='jack', shadow='jack', dark=0.25, cm='pull', fc=[960, 420, 1.6]),
]

# Beat 1 — Cut Line (1 shot)
B1 = [
    S('hallway', fr='wide', night=True, angle='plain', empty=True, dark=0.25, cm='rise', fc=[960, 420, 1.5]),
]

# Beat 2 — Moving In (5 shots)
B2 = [
    S('kitchen', fr='wide', day=True, angle='boxes_left', boxes=True, cm='rise', fc=[760, 500, 1.6]),
    S('hallway', fr='bust', day=True, angle='greet', who2='edwin', greet=True, cm='rise', fc=[960, 480, 1.7]),
    S('bedroom', fr='wide', day=True, angle='door_open', settling=True, cm='rise', fc=[1040, 460, 1.6]),
    S('kitchen', fr='bust', day=True, angle='table_talk', who2='edwin', expr='neutral', cm='truck', fc=[860, 480, 1.6]),
    S('kitchen', fr='wide', day=True, angle='counter', settling=True, dark=0.15, cm='pull', fc=[900, 480, 1.6]),
]

# Beat 3 — The Raccoon (5 shots)
B3 = [
    S('bedroom', fr='wide', night=True, angle='window_left', curtain=True, cm='rise', fc=[640, 420, 1.7]),
    S('face', fr='close', who='mitch', expr='fear', loc='kitchen', x=740, k=1.2, turn=-0.1, tag='JUST A RACCOON'),
    S('kitchen', fr='bust', day=True, angle='counter', who2='edwin', talk=True, cm='rise', fc=[900, 480, 1.6]),
    S('hallway', fr='wide', night=True, angle='flee', empty=True, dark=0.2, cm='truck', fc=[940, 440, 1.6]),
    S('kitchen', fr='wide', day=True, angle='door_yard', broken_mug=False, cm='pull', fc=[800, 500, 1.6]),
]

# Beat 4 — The Open Window (5 shots)
B4 = [
    S('bedroom', fr='wide', night=True, angle='bed_left', open_win=True, c='jack', shadow='jack', face=-1, px=180, ooze=0.15, pose='stand', dark=0.15, cm='rise', fc=[1360, 440, 1.8]),
    S('face', fr='close', who='mitch', expr='fear', loc='emergency', x=960, k=1.5, turn=0.2, tag='SOMETHING CAME IN'),
    S('hallway', fr='bust', day=True, angle='stairs', who2='edwin', expr='fear', cm='rise', fc=[560, 480, 1.8]),
    S('bedroom', fr='wide', day=True, angle='window_left', settling=True, cm='push', fc=[800, 460, 1.7]),
    S('kitchen', fr='waist', day=True, angle='door_yard', talk=True, dark=0.15, cm='pull', fc=[800, 460, 1.7]),
]

# Beat 5 — The Gash (4 shots)
B5 = [
    S('kitchen', fr='wide', day=True, angle='mug_floor', broken_mug=True, cm='rise', fc=[700, 480, 1.7]),
    S('face', fr='close', who='mitch', expr='fear', loc='kitchen', x=1220, k=1.35, gash=True, turn=0.0, tag='WHAT HAPPENED TO ME'),
    S('hallway', fr='bust', day=True, angle='mirror', mirror=True, gash=True, cm='rise', fc=[980, 440, 1.8]),
    S('hallway', fr='wide', day=True, angle='plain', fleeing=True, dark=0.2, cm='truck', fc=[900, 460, 1.6]),
]

# Beat 6 — Missing (5 shots)
B6 = [
    S('hospital', fr='wide', day=True, angle='wide_clinic', who2='doctor', cm='rise', fc=[820, 460, 1.6]),
    S('face', fr='close', who='mitch', expr='fear', loc='hospital', x=1180, k=1.25, turn=0.1, tag='MY KIDNEY IS GONE'),
    S('hospital', fr='bust', day=True, angle='xray_chart', bandage=True, red=0.4, cm='rise', fc=[1040, 500, 1.8]),
    S('hospital', fr='wide', day=True, angle='bed_monitor', bedridden=True, dark=0.15, cm='pull', fc=[700, 500, 1.6]),
    S('hospital', fr='bust', day=True, angle='xray_chart', who2='doctor', expr='neutral', cm='truck', fc=[880, 480, 1.7]),
]

# Beat 7 — Face to Face (6 shots)
B7 = [
    S('bedroom', fr='wide', night=True, angle='window_left', c='jack', creature='jack', face=1, px=-120, ooze=0.6, pose='lean', dark=0.25, cm='rise', fc=[860, 400, 1.7]),
    S('face', fr='close', who='mitch', expr='fear', loc='bedroom', x=720, k=1.45, turn=0.3, tag='EMPTY BLACK SOCKETS'),
    S('bedroom', fr='bust', night=True, angle='bed_left', c='jack', creature='jack', face=-1, px=340, ooze=0.75, pose='lean', dark=0.255, cm='rise', fc=[1420, 420, 1.9]),
    S('bedroom', fr='waist', night=True, angle='door_open', c='jack', creature='jack', face=1, px=0, ooze=0.65, pose='stand', dark=0.2, cm='push', fc=[1000, 440, 1.7]),
    S('woods', fr='wide', night=True, angle='pines_left', c='jack', shadow='jack', face=-1, px=100, ooze=0.7, pose='lean', dark=0.25, cm='pull', fc=[1060, 440, 1.8]),
    S('woods', fr='bust', night=True, angle='clearing', c='jack', creature='jack', face=1, px=40, ooze=0.8, pose='stand', dark=0.252, cm='truck', fc=[1000, 420, 1.8]),
]

# Beat 8 — Into the Woods (7 shots)
B8 = [
    S('bedroom', fr='wide', night=True, angle='bed_left', c='jack', creature='jack', face=1, px=60, ooze=0.9, pose='lunge', dark=0.25, cm='rise', fc=[1000, 440, 1.8]),
    S('hallway', fr='wide', night=True, angle='mirror', fleeing=True, dark=0.2, cm='rise', fc=[940, 440, 1.6]),
    S('woods', fr='wide', night=True, angle='dense_left', running=True, mist=True, cm='rise', fc=[760, 480, 1.7]),
    S('woods', fr='bust', night=True, angle='pines_left', c='jack', creature='jack', face=-1, px=-200, ooze=0.5, pose='stand', dark=0.25, cm='rise', fc=[1180, 500, 1.8]),
    S('woods', fr='waist', night=True, angle='clearing', c='jack', creature='jack', face=1, px=100, ooze=0.6, pose='lunge', dark=0.255, cm='push', fc=[950, 480, 1.8]),
    S('woods', fr='wide', night=True, angle='pines_left', fallen=True, rock=True, cm='rise', fc=[700, 520, 1.7]),
    S('face', fr='close', who='mitch', expr='fear', loc='woods', x=960, k=1.6, turn=0.1, tag='BLIND PANIC'),
]

# Beat 9 — Edwin (5 shots)
B9 = [
    S('hospital', fr='wide', day=True, angle='xray_chart', bedridden=True, cm='rise', fc=[840, 460, 1.6]),
    S('face', fr='close', who='mitch', expr='fear', loc='hospital', x=720, k=1.2, turn=-0.2, tag='EDWIN IS DEAD'),
    S('hospital', fr='bust', day=True, angle='bed_monitor', who2='doctor', expr='neutral', cm='rise', fc=[980, 480, 1.8]),
    S('hospital', fr='wide', day=True, angle='bed_monitor', bandage=True, red=0.3, dark=0.1, cm='pull', fc=[720, 500, 1.6]),
    S('hospital', fr='bust', day=True, angle='wide_clinic', bedridden=True, dark=0.2, cm='truck', fc=[800, 490, 1.7]),
]

# Beat 10 — The Kidney (6 shots)
B10 = [
    S('hallway', fr='wide', day=True, angle='mirror', shadowed=True, dark=0.35, red=0.2, cm='rise', fc=[760, 460, 1.6]),
    S('car', fr='wide', day=True, angle='exterior', driving=True, cm='rise', fc=[700, 500, 1.6]),
    S('car', fr='bust', day=True, angle='seat_prop', holding=True, dark=0.3, cm='rise', fc=[960, 540, 1.9]),
    S('hallway', fr='bust', day=True, angle='plain', shadowed=True, dark=0.2, cm='truck', fc=[840, 480, 1.7]),
    S('car', fr='waist', day=True, angle='dash_interior', holding=True, dark=0.25, cm='push', fc=[900, 520, 1.7]),
    S('car', fr='wide', day=True, angle='exterior', driving=True, dark=0.2, cm='pull', fc=[800, 510, 1.6]),
]

# Beat 11 — credit (3 shots, duration ~8.7s -> ~2.9s each)
B11 = [
    S('car', fr='waist', day=True, angle='exterior', driving=True, dark=0.2, cm='pull', fc=[800, 510, 1.6]),
    S('car', fr='bust', day=True, angle='wheel_steer', holding=True, dark=0.2, cm='rise', fc=[900, 520, 1.7]),
    S('qcard', credit=True),
]

# Beat 12 — closing question (end screen)
B12 = [
    S('end'),
]

SC = [B0, B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12]

_CARDS = {'qcard', 'end'}
_FACE = 'face'
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
