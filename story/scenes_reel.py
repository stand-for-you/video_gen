# Scene table for the REEL (9:16) - "I Know You're Awake".
#
# The Reel is DRAWN SEPARATELY, never cropped out of the 16:9 video (channel policy, and the
# fault that put sliced-off labels in a delivered Reel). A 9:16 frame is 2.4x taller than it
# is wide, so these cameras sit lower, pitch further, and stand closer to their subject than
# the long video's do - and no camera here repeats a camera from story/scenes_long.py.
#
# Same one-use law, same ids (b<beat>_<n>, matching story/script_reel.py).
from scenes_dsl import S
from cast_dsl import A

K = 'AwakeHouse'

# 9:16 eye positions: closer in, and lower, so a tall frame is filled by the subject and not
# by ceiling and floor.
PILLOW = [-1.15, 0.97, -2.9]
PILLOW_UP = [-1.4, 1.02, -2.98]
CHEST = [-1.1, 0.88, -2.98]
BEDFOOT = [-0.95, 1.12, -1.4]
FLOORLO = [-0.2, 0.36, -2.0]
MIDROOM = [0.45, 1.4, -1.0]
WALLCLOSE = [0.95, 1.3, -0.85]
DOORIN = [0.6, 1.4, 0.3]
H_BATH = [-0.35, 1.4, -0.45]
H_MID = [0.1, 1.4, -2.0]
H_LOW = [0.0, 0.46, -2.5]
H_STAIR = [0.05, 1.4, 0.7]
BA_BASIN = [0.05, 1.48, 0.6]
BA_MIRROR = [0.05, 1.46, -0.02]

FATHER = (-1.05, 0, -1.12)
MOTHER = (1.3, 0, -1.9)
DOORWAY = (0.72, 0, 0.6)


def E(pos, yaw, pitch=0):
    return dict(pos=list(pos), yaw=yaw, pitch=pitch)


NOW = dict(room='bedroom', door='open', window='dawn', ground='pool', clock='5:31',
           shape='pentagram', lightOn=False, bedding='held', handPrints=True, seed=211)


def now(**kw):
    d = dict(NOW)
    d.update(kw)
    return d


DEAD_F = dict(expr='shocked', mouth='open', eyesShut=False, blood='smear')
DEAD_M = dict(expr='shocked', mouth='open', eyesShut=False, blood='spots')

SCENES = [
    # b00 - the hook: 5:30, and he has not moved
    S('b00_1', kit=K, opts=now(), anchor=E(PILLOW, 180, 15), preset='idle_breath',
      framing='full', secs=2.3, hands='grip_rail',
      actors=[A('father', 'sit', FATHER, yaw=0, state=DEAD_F)]),
    S('b00_2', kit=K, opts=now(window='blind', clock='5:28'), anchor=E(PILLOW, 150, 0),
      preset='idle_breath', framing='full', secs=2.3),
    # b01 - both of them, facing him, mouths open
    S('b01_1', kit=K, opts=now(clock='5:31', ground='smear'), anchor=E(PILLOW, 245, -15),
      preset='idle_breath', framing='full', secs=2.4,
      actors=[A('mother', 'sit', MOTHER, yaw=65, state=DEAD_M)]),
    S('b01_2', kit=K, opts=now(clock='5:31', window='blind', door='wide'),
      anchor=E(BEDFOOT, 165, 0), preset='idle_breath', framing='waist', secs=2.4,
      actors=[A('father', 'sit', FATHER, yaw=0, state=DEAD_F)]),
    S('b01_3', kit=K, opts=now(clock='5:34', ground='smear', door='ajar'),
      anchor=E(PILLOW_UP, 250, 15), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('mother', 'sit', MOTHER, yaw=65, state=DEAD_M)]),
    S('b01_4', kit=K, opts=now(clock='5:34', window='blind', ground='drops'),
      anchor=E(CHEST, 225, 0), preset='idle_breath', framing='full', secs=2.4,
      hands='brace_fall',
      actors=[A('father', 'sit', FATHER, yaw=0, state=DEAD_F),
              A('mother', 'sit', MOTHER, yaw=65, state=DEAD_M)]),
    # b02 - nobody has blinked, and it has not left
    S('b02_1', kit=K, opts=now(clock='5:34', door='wide', ground='smear'),
      anchor=E(PILLOW, 195, -15), preset='idle_breath', framing='face', secs=2.5,
      actors=[A('father', 'sit', FATHER, yaw=0, state=dict(DEAD_F, expr='sad'))]),
    S('b02_2', kit=K, opts=now(clock='5:34', window='blind', ground='pool', door='ajar'),
      anchor=E(FLOORLO, 185, -20), preset='crouch_peek', framing='full', secs=2.5),
    S('b02_3', kit=K, opts=now(clock='5:34', shape='message', door='wide'),
      anchor=E(PILLOW, 235, 15), preset='idle_breath', framing='full', secs=2.5,
      wash='#211f30', washAmount=0.3, hands='grip_rail'),
    # b03 - the scream at twenty past two
    S('b03_1', kit=K, opts=dict(room='bedroom', door='shut', window='curtained', ground='clean',
                                clock='2:22', shape='none', lightOn=False, bedding='tent', seed=212),
      anchor=E([-1.1, 0.86, -3.25], 180, 15), preset='impact_jolt', framing='full', secs=2.2,
      sfx=[dict(t='*SCREAM*', at=5, x=0.5, y=0.26, size=1.0)]),
    S('b03_2', kit=K, opts=dict(room='bedroom', door='shut', window='curtained', ground='clean',
                                clock='2:22', shape='none', lightOn=False, bedding='open', seed=213),
      anchor=E([-1.1, 1.15, -2.8], 185, -5), preset='impact_jolt', framing='full', secs=2.2,
      hands='brace_fall'),
    S('b03_3', kit=K, opts=dict(room='bedroom', door='shut', window='blind', ground='clean',
                                clock='2:22', shape='none', lightOn=False, bedding='open', seed=214),
      anchor=E([-1.1, 1.15, -2.8], 200, 10), preset='idle_breath', framing='full', secs=2.3),
    S('b03_4', kit=K, opts=dict(room='bedroom', door='ajar', window='curtained', ground='clean',
                                clock='2:23', shape='none', lightOn=False, bedding='open', seed=215),
      anchor=E(MIDROOM, 180, -10), preset='whip_pan', framing='full', secs=2.3),
    # b04 - he gets to the door, then goes to the bathroom first
    S('b04_1', kit=K, opts=dict(room='bedroom', door='open', window='curtained', ground='clean',
                                clock='2:23', shape='none', lightOn=False, bedding='open', seed=216),
      anchor=E(DOORIN, 175, -5), preset='walk_bob', framing='full', secs=2.5, hands='brace_door'),
    S('b04_2', kit=K, opts=dict(room='hall', door='open', window='curtained', ground='clean', seed=217),
      anchor=E(H_BATH, 185, -10), preset='idle_breath', framing='full', secs=2.4,
      hands='balance_wide'),
    S('b04_3', kit=K, opts=dict(room='hall', door='wide', window='curtained', ground='clean', seed=218),
      anchor=E([-0.4, 1.4, -0.8], 110, 0), preset='walk_bob', framing='full', secs=2.4,
      hands='reach_grab'),
    # b05 - three minutes: the light, the hands, the crack in the door
    S('b05_1', kit=K, opts=dict(room='bathroom', door='ajar', window='curtained', ground='clean',
                                lightOn=True, seed=219),
      anchor=E(BA_MIRROR, 10, 5), preset='idle_breath', framing='full', secs=2.4),
    S('b05_2', kit=K, opts=dict(room='bathroom', door='ajar', window='curtained', ground='clean',
                                lightOn=True, seed=220),
      anchor=E([0.05, 1.2, -0.3], 5, -40), preset='idle_breath', framing='full', secs=2.4,
      hands='reach_grab'),
    S('b05_3', kit=K, opts=dict(room='bathroom', door='ajar', window='curtained', ground='clean',
                                lightOn=False, seed=221),
      anchor=E([-0.05, 1.42, 0.1], 178, -4), preset='idle_breath', framing='full', secs=2.5,
      hands='brace_door', sfx=[dict(t='*click*', at=8, x=0.3, y=0.24, size=0.5)]),
    # b06 - BLOOD ON THE CARPET
    S('b06_1', kit=K, opts=dict(room='hall', door='open', window='curtained', ground='smear', seed=222),
      anchor=E([-0.3, 1.4, -0.2], 0, -20), preset='impact_jolt', framing='full', secs=2.4,
      hands='brace_door'),
    S('b06_2', kit=K, opts=dict(room='hall', door='open', window='curtained', ground='smear', seed=223),
      anchor=E(H_LOW, 0, -45), preset='crouch_peek', framing='full', secs=2.4),
    S('b06_3', kit=K, opts=dict(room='hall', door='ajar', window='curtained', ground='pool', seed=224),
      anchor=E(H_MID, 0, -30), preset='walk_bob', framing='full', secs=2.4, hands='balance_wide'),
    S('b06_4', kit=K, opts=dict(room='hall', door='ajar', window='dawn', ground='pool', seed=225),
      anchor=E([-0.1, 1.4, -4.2], 0, -15), preset='idle_breath', framing='full', secs=2.4),
    # b07 - twelve steps he did not take
    S('b07_1', kit=K, opts=dict(room='hall', door='open', window='dawn', ground='smear', seed=226),
      anchor=E(H_STAIR, 180, -35), preset='idle_breath', framing='full', secs=2.4,
      hands='grip_rail'),
    S('b07_2', kit=K, opts=dict(room='hall', door='open', window='curtained', ground='smear', seed=227),
      anchor=E([0.05, 1.4, 0.2], 0, 15), preset='whip_pan', framing='full', secs=2.4,
      hands='balance_wide'),
    # b08 - sheets over his head
    S('b08_1', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='clean',
                                clock='2:30', shape='none', lightOn=False, bedding='open', seed=228),
      anchor=E(MIDROOM, 200, -20), preset='sprint_bob', framing='full', secs=2.4,
      hands='brace_fall'),
    S('b08_2', kit=K, opts=dict(room='bedroom', door='ajar', window='curtained', ground='clean',
                                clock='2:34', shape='none', lightOn=False, bedding='tent', seed=229),
      anchor=E([-1.1, 0.86, -3.25], 190, 15), preset='impact_jolt', framing='full', secs=2.4,
      hands='grip_rail'),
    # b09 - the door creaks open, the blanket comes down off one eye
    S('b09_1', kit=K, opts=dict(room='bedroom', door='open', window='curtained', ground='clean',
                                clock='2:44', shape='none', lightOn=False, bedding='tent', seed=230),
      anchor=E([-1.1, 0.86, -3.25], 190, 0), preset='whip_pan', framing='full', secs=2.4,
      sfx=[dict(t='*creak*', at=6, x=0.56, y=0.4, size=0.6)]),
    S('b09_2', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='clean',
                                clock='2:44', shape='none', lightOn=False, bedding='held', seed=231),
      anchor=E(PILLOW, 210, 15), preset='idle_breath', framing='full', secs=2.4, hands='brace_fall',
      actors=[A('entity', 'loom', DOORWAY, yaw=30)]),
    # b10 - WORD CAPTIONS: too tall for the room
    S('b10_1', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='clean',
                                clock='2:44', shape='none', lightOn=False, bedding='held', seed=232),
      anchor=E(PILLOW, 225, 0), preset='idle_breath', framing='full', secs=2.5,
      actors=[A('entity', 'loom', DOORWAY, yaw=30, cstate=dict(tilt=10))]),
    S('b10_2', kit=K, opts=dict(room='bedroom', door='wide', window='blind', ground='clean',
                                clock='2:44', shape='none', lightOn=False, bedding='held', seed=233),
      anchor=E(CHEST, 210, 15), preset='idle_breath', framing='full', secs=2.5,
      actors=[A('entity', 'stand', (0.6, 0, 0.2), yaw=25)]),
    # b11 - WORD CAPTIONS: hairless, no eyes, no mouth
    S('b11_1', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='clean',
                                clock='2:44', shape='none', lightOn=False, bedding='held', seed=234),
      anchor=E(PILLOW, 210, 15), preset='vertigo_tilt', framing='face', secs=2.5, glitch=0.26,
      actors=[A('entity', 'lean_lens', (-0.15, 0, -1.3), yaw=5)]),
    S('b11_2', kit=K, opts=dict(room='bedroom', door='open', window='curtained', ground='clean',
                                clock='2:44', shape='none', lightOn=False, bedding='held', seed=235),
      anchor=E(PILLOW_UP, 195, 0), preset='idle_breath', framing='waist', secs=2.5,
      actors=[A('entity', 'lean_lens', (0.05, 0, -0.85), yaw=10)]),
    # b12 - WORD CAPTIONS: arms past the knees, back slouched, wearing nothing
    S('b12_1', kit=K, opts=dict(room='bedroom', door='wide', window='blind', ground='clean',
                                clock='2:44', shape='none', lightOn=False, bedding='held', seed=236),
      anchor=E(PILLOW, 270, -15), preset='idle_breath', framing='full', secs=2.5,
      actors=[A('entity', 'stand', (0.85, 0, -0.5), yaw=45)]),
    S('b12_2', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='clean',
                                clock='2:52', shape='none', lightOn=False, bedding='held', seed=237),
      anchor=E(FLOORLO, 195, 0), preset='crouch_peek', framing='full', secs=2.5,
      actors=[A('entity', 'crouch_spider', (0.3, 0, -0.6), yaw=20, phase=0.5)]),
    # b13 - dragging both of them in, one in each hand
    S('b13_1', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='smear',
                                clock='2:52', shape='none', lightOn=False, bedding='held', seed=238),
      anchor=E(PILLOW, 180, 0), preset='idle_breath', framing='full', secs=2.4, hands='grip_rail',
      actors=[A('entity', 'hold_two', (0.45, 0, 0.1), yaw=25, cstate=dict(blood=True)),
              A('father', 'lie', (1.15, 0, 0.9), yaw=30, state=DEAD_F),
              A('mother', 'lie', (0.3, 0, 1.0), yaw=45, state=DEAD_M)],
      sfx=[dict(t='*drag*', at=14, x=0.52, y=0.56, size=0.6)]),
    S('b13_2', kit=K, opts=dict(room='bedroom', door='wide', window='blind', ground='smear',
                                clock='2:52', shape='none', lightOn=False, bedding='held', seed=239),
      anchor=E(CHEST, 210, 0), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('entity', 'hold_two', (0.1, 0, -0.7), yaw=20, cstate=dict(blood=True)),
              A('father', 'lie', (0.8, 0, 0.15), yaw=25, state=DEAD_F),
              A('mother', 'lie', (-0.1, 0, 0.3), yaw=40, state=DEAD_M)]),
    S('b13_3', kit=K, opts=dict(room='bedroom', door='open', window='curtained', ground='smear',
                                clock='2:52', shape='none', lightOn=False, bedding='held', seed=240),
      anchor=E(BEDFOOT, 240, 0), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('entity', 'crouch_spider', (-0.3, 0, -1.2), yaw=10, cstate=dict(blood=True)),
              A('father', 'lie', (0.4, 0, -0.5), yaw=20, state=DEAD_F)]),
    # b14 - it props the father, it sits the mother
    S('b14_1', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='smear',
                                clock='2:56', shape='none', lightOn=False, bedding='held', seed=241),
      anchor=E([-1.15, 0.96, -2.98], 195, 10), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('entity', 'reach', (-0.5, 0, -0.8), yaw=5, cstate=dict(blood=True)),
              A('father', 'fall', (-0.95, 0, -1.0), yaw=10, state=DEAD_F)]),
    S('b14_2', kit=K, opts=dict(room='bedroom', door='open', window='curtained', ground='smear',
                                clock='3:02', shape='none', lightOn=False, bedding='held', seed=242),
      anchor=E(PILLOW, 165, 0), preset='idle_breath', framing='waist', secs=2.4,
      actors=[A('father', 'sit', FATHER, yaw=0, state=dict(DEAD_F, expr='sad'))]),
    S('b14_3', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='smear',
                                clock='3:02', shape='none', lightOn=False, bedding='held', seed=243),
      anchor=E(PILLOW, 270, 15), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('entity', 'reach', (0.6, 0, -1.3), yaw=300, cstate=dict(blood=True)),
              A('mother', 'held_up', (0.15, 0, -1.05), yaw=40, state=DEAD_M)]),
    S('b14_4', kit=K, opts=dict(room='bedroom', door='wide', window='blind', ground='smear',
                                clock='3:02', shape='none', lightOn=False, bedding='held', seed=244),
      anchor=E(PILLOW, 255, 0), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('entity', 'stand', (0.95, 0, -1.35), yaw=290, cstate=dict(blood=True)),
              A('mother', 'sit', MOTHER, yaw=65, state=DEAD_M)]),
    # b15 - it arranges them
    S('b15_1', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='pool',
                                clock='3:02', shape='none', lightOn=False, bedding='held', seed=245),
      anchor=E(PILLOW, 215, -15), preset='idle_breath', framing='full', secs=2.4,
      hands='brace_fall',
      actors=[A('father', 'sit', FATHER, yaw=0, state=DEAD_F),
              A('mother', 'sit', MOTHER, yaw=65, state=DEAD_M)]),
    S('b15_2', kit=K, opts=dict(room='bedroom', door='open', window='blind', ground='pool',
                                clock='3:02', shape='none', lightOn=False, bedding='held', seed=246),
      anchor=E(BEDFOOT, 225, 15), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('entity', 'lean_lens', (-0.3, 0, -1.0), yaw=0, cstate=dict(blood=True)),
              A('father', 'sit', FATHER, yaw=0, state=DEAD_F)]),
    # b16 - the circle and the star
    S('b16_1', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='pool',
                                clock='3:06', shape='circle', lightOn=False, bedding='held',
                                handPrints=True, seed=247),
      anchor=E(WALLCLOSE, 330, 15), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('entity', 'reach', (1.1, 0, -1.15), yaw=275, cstate=dict(blood=True))]),
    S('b16_2', kit=K, opts=dict(room='bedroom', door='wide', window='blind', ground='pool',
                                clock='3:06', shape='pentagram', lightOn=False, bedding='held',
                                handPrints=True, seed=248),
      anchor=E(PILLOW, 230, -15), preset='idle_breath', framing='full', secs=2.4,
      actors=[A('entity', 'reach', (1.1, 0, -0.6), yaw=270, cstate=dict(blood=True))]),
    S('b16_3', kit=K, opts=dict(room='bedroom', door='open', window='curtained', ground='pool',
                                clock='3:06', shape='pentagram', lightOn=False, bedding='held',
                                handPrints=True, seed=249),
      anchor=E(WALLCLOSE, 235, 20), preset='idle_breath', framing='waist', secs=2.4),
    # b17 - one line of letters, too dark to read
    S('b17_1', kit=K, opts=dict(room='bedroom', door='wide', window='blind', ground='smear',
                                clock='3:09', shape='message', lightOn=False, bedding='held',
                                handPrints=True, seed=250),
      anchor=E(WALLCLOSE, 330, 0), preset='idle_breath', framing='full', secs=2.4,
      wash='#211f30', washAmount=0.42,
      actors=[A('entity', 'reach', (1.2, 0, -1.4), yaw=270, cstate=dict(blood=True))]),
    S('b17_2', kit=K, opts=dict(room='bedroom', door='open', window='blind', ground='smear',
                                clock='3:09', shape='message', lightOn=False, bedding='held',
                                handPrints=True, seed=251),
      anchor=E(PILLOW, 230, 15), preset='idle_breath', framing='full', secs=2.4,
      wash='#211f30', washAmount=0.42,
      actors=[A('entity', 'stand', (0.65, 0, -0.95), yaw=275, cstate=dict(blood=True))]),
    S('b17_3', kit=K, opts=dict(room='bedroom', door='wide', window='blind', ground='pool',
                                clock='3:09', shape='message', lightOn=False, bedding='held',
                                handPrints=True, seed=252),
      anchor=E(PILLOW, 245, -5), preset='idle_breath', framing='full', secs=2.4,
      wash='#09020b', washAmount=0.5),
    # b18 - it folds itself up and goes under the bed
    S('b18_1', kit=K, opts=dict(room='bedroom', door='wide', window='curtained', ground='pool',
                                clock='3:09', shape='message', lightOn=False, bedding='held',
                                handPrints=True, seed=253),
      anchor=E(PILLOW, 165, 15), preset='idle_breath', framing='full', secs=2.4,
      wash='#211f30', washAmount=0.28,
      actors=[A('entity', 'crouch_spider', (-0.1, 0, -1.3), yaw=100, cstate=dict(blood=True))]),
    S('b18_2', kit=K, opts=dict(room='bedroom', door='wide', window='blind', ground='pool',
                                clock='3:09', shape='message', lightOn=False, bedding='held',
                                handPrints=True, seed=254),
      anchor=E(FLOORLO, 90, 15), preset='crouch_peek', framing='full', secs=2.4,
      actors=[A('entity', 'crouch_spider', (-0.6, 0, -1.95), yaw=115, cstate=dict(blood=True))],
      sfx=[dict(t='*shhff*', at=26, x=0.42, y=0.6, size=0.5)]),
    S('b18_3', kit=K, opts=dict(room='bedroom', door='open', window='curtained', ground='pool',
                                clock='3:09', shape='message', lightOn=False, bedding='held',
                                handPrints=True, seed=255),
      anchor=E(CHEST, 195, -15), preset='impact_jolt', framing='full', secs=2.4, glitch=0.2,
      hands='grip_rail'),
    # b19 - three hours later, his eyes are better at the dark
    S('b19_1', kit=K, opts=now(clock='5:28', window='blind', shape='pentagram', ground='smear'),
      anchor=E(PILLOW, 240, 40), preset='idle_breath', framing='full', secs=2.4),
    S('b19_2', kit=K, opts=now(clock='5:28', window='dawn', ground='smear', door='ajar'),
      anchor=E(PILLOW, 265, 0), preset='idle_breath', framing='full', secs=2.4),
    S('b19_3', kit=K, opts=now(clock='5:31', window='dawn', door='wide', ground='drops'),
      anchor=E(PILLOW, 140, 15), preset='idle_breath', framing='full', secs=2.4,
      hands='brace_fall'),
    # b20 - just his eyes, to the right
    S('b20_1', kit=K, opts=now(clock='5:31', window='dawn', shape='message', ground='smear'),
      anchor=E([-1.15, 0.96, -2.98], 215, 0), preset='idle_breath', framing='full', secs=2.4),
    S('b20_2', kit=K, opts=now(clock='5:34', window='dawn', shape='message', door='ajar'),
      anchor=E(PILLOW, 230, 15), preset='vertigo_tilt', framing='full', secs=2.4),
    S('b20_3', kit=K, opts=now(clock='5:34', window='dawn', shape='message', door='wide',
                               ground='smear'),
      anchor=E(WALLCLOSE, 245, 0), preset='idle_breath', framing='full', secs=2.4),
    # b21 - IT SAYS: I KNOW YOU'RE AWAKE
    S('b21_1', kit=K, opts=now(clock='5:34', window='dawn', shape='message', door='open'),
      anchor=E(PILLOW, 250, -15), preset='idle_breath', framing='full', secs=2.6, glitch=0.3),
    # b22 - it never had to check
    S('b22_1', kit=K, opts=now(clock='5:34', window='dawn', shape='message', door='wide',
                               ground='pool'),
      anchor=E(FLOORLO, 190, -25), preset='impact_jolt', framing='full', secs=2.4,
      sfx=[dict(t='*shift*', at=12, x=0.46, y=0.66, size=0.6)]),
    S('b22_2', kit=K, opts=now(clock='5:34', window='blind', shape='message', door='open',
                               ground='drops'),
      anchor=E(PILLOW, 180, -15), preset='idle_breath', framing='full', secs=2.4, glitch=0.14,
      actors=[A('father', 'sit', FATHER, yaw=0, state=DEAD_F)]),
    S('b22_3', kit=K, opts=now(clock='5:34', window='dawn', shape='message', door='ajar',
                               ground='pool'),
      anchor=E(FLOORLO, 60, 15), preset='crouch_peek', framing='full', secs=2.4,
      actors=[A('entity', 'crouch_spider', (-1.05, 0, -2.45), yaw=0, cstate=dict(blood=True))]),
    # b23 - the closing question
    S('b23_1', kit=K, opts=now(clock='5:34', window='dawn', shape='message', door='open',
                               ground='smear'),
      anchor=E(PILLOW, 255, 25), preset='idle_breath', framing='full', secs=2.6, hands='grip_rail',
      actors=[A('father', 'sit', FATHER, yaw=0, state=DEAD_F),
              A('mother', 'sit', MOTHER, yaw=65, state=DEAD_M)]),
    S('b23_2', kit=K, opts=now(clock='5:34', window='dawn', shape='message', door='wide',
                               ground='drops'),
      anchor=E(PILLOW_UP, 215, 55), preset='idle_breath', framing='full', secs=2.7,
      actors=[A('father', 'sit', FATHER, yaw=0, state=DEAD_F),
              A('mother', 'sit', MOTHER, yaw=65, state=DEAD_M)]),
]

CHAPTERS = []
PARTS = []

# tools/lint_story.py (a v0.4 check that is still useful for spotting leaked sets) reads a
# module-level SC from a scene table. v0.5 tables are SCENES; this empty SC tells the linter
# that this story names no v0.4 set at all, which is true.
SC = []
