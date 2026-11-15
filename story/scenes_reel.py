# Scene table for the REEL video: exactly 10 beats matching script_reel.BEATS.
# Uses vertical SetsR names (canvas 1080x1920).
# Focal points kept at y 600-900 to stay above burned-in subtitles at y 1420.

def S(st, **v):
    return (st, v)

SC = [
    # Beat 0: Intro Teaser (nine feet tall, mimicking loved one)
    [
        S('reel_first', fc=[680, 820, 2.0]),
        S('reel_mimic_face', fc=[540, 680, 2.2]),
        S('reel_porch', fc=[540, 880, 2.0]),
    ],
    # Beat 1: 2 AM sister Mira pleading at door
    [
        S('reel_porch', fc=[540, 880, 2.2]),
        S('reel_noah_face', fc=[540, 740, 2.3]),
        S('reel_first', fc=[680, 820, 2.2]),
    ],
    # Beat 2: Dual Syrinx voice boxes
    [
        S('reel_syrinx', fc=[540, 720, 1.8]),
        S('reel_syrinx', fc=[455, 810, 2.3]),
        S('reel_syrinx', fc=[625, 810, 2.3]),
    ],
    # Beat 3: Copying is not speaking / repeats twice
    [
        S('reel_mimic_face', fc=[540, 680, 2.4]),
        S('reel_noah_face', fc=[540, 740, 2.2]),
        S('reel_first', fc=[680, 820, 2.4]),
    ],
    # Beat 4: Bleached frame, cold air, tapetum mirror eyes
    [
        S('reel_eye', fc=[540, 700, 1.9]),
        S('reel_eye', fc=[490, 700, 2.4]),
        S('reel_first', fc=[680, 820, 2.5]),
    ],
    # Beat 5: Brittle predator / anglerfish lure
    [
        S('reel_mimic_full', fc=[540, 1140, 1.8]),
        S('reel_noah_face', fc=[540, 740, 2.4]),
        S('reel_mimic_face', fc=[540, 680, 2.5]),
    ],
    # Beat 6: The test question through the door
    [
        S('reel_porch', fc=[305, 907, 2.6]),
        S('reel_noah_face', fc=[540, 740, 2.4]),
        S('reel_first', fc=[680, 820, 2.2]),
    ],
    # Beat 7: Dead silence, replay, 9-foot shadow on porch
    [
        S('reel_first', fc=[680, 820, 2.5]),
        S('reel_mimic_full', fc=[540, 1140, 2.0]),
        S('reel_mimic_face', fc=[540, 680, 2.6], last=True),
    ],
    # Beat 8: Credit card
    [
        S('reel_qcard', title='THE TREELINE MIMIC'),
    ],
    # Beat 9: Question card
    [
        S('reel_qcard', title='WOULD YOU OPEN THE DOOR?'),
    ],
]
