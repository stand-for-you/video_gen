# Scene table for the LONG video: exactly 25 beats matching script_long.BEATS.
# Format: S(st, **v), where fc=[x, y, zoom] sets the closeup focus.
# Beat 0 scene 0 MUST be the creepiest scene: first_frame.
# Beat 23 is credit card: [S('qcard', title='THE TREELINE MIMIC', sub='Vocal mimicry folklore')]
# Beat 24 is end screen: [S('end')]

def S(st, **v):
    return (st, v)

SC = [
    # ---- TEASER (beats 0..2)
    # Beat 0: If you hear your family calling...
    [
        S('first_frame', fc=[1260, 520, 2.2]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.2]),
        S('mimic_full', reach=True, fc=[960, 680, 2.0]),
    ],
    # Beat 1: Stands nine feet tall at edge of clearing...
    [
        S('mimic_face', fc=[960, 460, 2.0]),
        S('woods_wide', mimic=True, fc=[960, 600, 2.2]),
        S('mimic_full', reach=False, fc=[960, 480, 2.4], last=True),
    ],
    # Beat 2: Exact trick to unlock the door...
    [
        S('porch_door', shadow=True, fc=[560, 680, 2.0]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.4]),
        S('first_frame', fc=[360, 660, 2.2], last=True),
    ],

    # ---- 1: The Voice (beats 3..5)
    # Beat 3: 2:15 AM call outside cabin...
    [
        S('first_frame', fc=[360, 660, 2.0]),
        S('noah_closeup', expr='neutral', fc=[960, 540, 2.2]),
        S('porch_door', shadow=False, fc=[560, 680, 2.0]),
    ],
    # Beat 4: Sister Mira pleading for car keys...
    [
        S('woods_wide', mimic=False, fc=[960, 600, 2.0]),
        S('first_frame', fc=[1260, 520, 2.4]),
        S('porch_door', shadow=False, fc=[340, 240, 2.2]),
    ],
    # Beat 5: Hand on brass deadbolt / Mira in city...
    [
        S('porch_door', shadow=False, fc=[270, 520, 2.5]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.4]),
        S('woods_wide', mimic=True, fc=[960, 600, 2.0]),
    ],

    # ---- 2: Two Throats (beats 6..8)
    # Beat 6: Looked out porch window / trick of mind...
    [
        S('porch_door', shadow=False, fc=[560, 680, 2.2]),
        S('first_frame', fc=[1260, 520, 2.5]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.3]),
    ],
    # Beat 7: Human vocal cord vs dual voice boxes...
    [
        S('dual_syrinx', fc=[960, 540, 1.8]),
        S('dual_syrinx', fc=[875, 630, 2.4]),
        S('dual_syrinx', fc=[1045, 630, 2.4]),
    ],
    # Beat 8: Lyrebird chainsaw & cry of infant...
    [
        S('dual_syrinx', fc=[960, 540, 2.0]),
        S('mimic_face', fc=[960, 460, 2.2]),
        S('woods_wide', mimic=True, fc=[960, 600, 2.4]),
    ],

    # ---- 3: The Replay (beats 9..11)
    # Beat 9: Copying is not speaking / no soul...
    [
        S('mimic_face', fc=[960, 460, 2.5]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.2]),
        S('mimic_full', reach=False, fc=[960, 680, 2.2]),
    ],
    # Beat 10: Phonograph / parrot repeats twice...
    [
        S('first_frame', fc=[1260, 520, 2.2]),
        S('dual_syrinx', fc=[960, 540, 2.2]),
        S('mimic_face', fc=[960, 460, 2.4]),
    ],
    # Beat 11: Voice replayed outside fence...
    [
        S('woods_wide', mimic=True, fc=[960, 600, 2.2]),
        S('porch_door', shadow=True, fc=[560, 680, 2.2]),
        S('first_frame', fc=[1260, 520, 2.5]),
    ],

    # ---- 4: The Treeline (beats 12..14)
    # Beat 12: Bleached bone skin / stays back...
    [
        S('mimic_full', reach=True, fc=[960, 680, 2.0]),
        S('mimic_face', fc=[960, 460, 2.4]),
        S('woods_wide', mimic=True, fc=[960, 600, 2.2]),
    ],
    # Beat 13: Cold air bends sound waves...
    [
        S('first_frame', fc=[360, 660, 1.8]),
        S('woods_wide', mimic=True, fc=[960, 600, 2.0]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.2]),
    ],
    # Beat 14: Tapetum lucidum mirror eye reflection...
    [
        S('mirror_eye', fc=[960, 520, 1.8]),
        S('mirror_eye', fc=[910, 520, 2.4]),
        S('first_frame', fc=[1260, 520, 2.6]),
    ],

    # ---- 5: The Lure (beats 15..17)
    # Beat 15: Thin predator cannot win a fight...
    [
        S('mimic_full', reach=True, fc=[960, 680, 2.2]),
        S('mimic_face', fc=[960, 460, 2.4]),
        S('woods_wide', mimic=True, fc=[960, 600, 2.0]),
    ],
    # Beat 16: Anglerfish deep sea lure / voice of loved one...
    [
        S('noah_closeup', expr='fear', fc=[960, 540, 2.4]),
        S('first_frame', fc=[1260, 520, 2.5]),
        S('mimic_full', reach=True, fc=[960, 680, 2.2]),
    ],
    # Beat 17: Waiting in pitch black for pity...
    [
        S('woods_wide', mimic=True, fc=[960, 600, 2.4]),
        S('porch_door', shadow=True, fc=[560, 680, 2.2]),
        S('mimic_face', fc=[960, 460, 2.5]),
    ],

    # ---- 6: The Weakness & Test (beats 18..22)
    # Beat 18: One fatal flaw: cannot answer unscripted question...
    [
        S('noah_closeup', expr='fear', fc=[960, 540, 2.4]),
        S('porch_door', shadow=False, fc=[270, 520, 2.5]),
        S('first_frame', fc=[360, 660, 2.0]),
    ],
    # Beat 19: Noah calls out test question...
    [
        S('porch_door', shadow=False, fc=[560, 680, 2.3]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.5]),
        S('porch_door', shadow=False, fc=[340, 240, 2.4]),
    ],
    # Beat 20: 30-second heavy silence...
    [
        S('woods_wide', mimic=True, fc=[960, 600, 2.0]),
        S('first_frame', fc=[1260, 520, 2.4]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.2]),
    ],
    # Beat 21: Identical replay of the same line...
    [
        S('first_frame', fc=[1260, 520, 2.6]),
        S('mimic_face', fc=[960, 460, 2.5]),
        S('porch_door', shadow=True, fc=[560, 680, 2.4]),
    ],
    # Beat 22: Deadbolt thrown, 9-foot shadow on porch...
    [
        S('porch_door', shadow=True, fc=[270, 520, 2.6]),
        S('noah_closeup', expr='fear', fc=[960, 540, 2.6]),
        S('mimic_full', reach=True, fc=[960, 680, 2.4], last=True),
    ],

    # ---- Closing / Credit (beats 23..24)
    # Beat 23: Credit card
    [
        S('qcard', title='THE TREELINE MIMIC', sub='Inspired by modern folklore'),
    ],
    # Beat 24: End Screen (20s)
    [
        S('end'),
    ],
]
