# Scene table for the REEL video: exactly 10 beats matching script_reel.BEATS.
# Uses vertical SetsR names (canvas 1080x1920).
# Focal points kept at y 600-900 to stay above burned-in subtitles at y 1420.

def S(st, **v):
    return (st, v)

SC = [
    # Beat 0: St Andrews University Archives & Solomon Sketch
    [
        S('reel_tome', fc=[540, 880, 2.0]),
        S('reel_solomon_face', fc=[540, 820, 2.2]),
    ],
    # Beat 1: Winter of 1577 Disappearances in Ettrick
    [
        S('reel_hamlet', fc=[540, 920, 2.0]),
        S('reel_well', fc=[540, 1100, 2.2]),
    ],
    # Beat 2: Recluse Woodcarver & Cabin Burning
    [
        S('reel_cabin_burning', fc=[540, 980, 2.2]),
        S('reel_well', fc=[540, 1100, 2.0]),
    ],
    # Beat 3: The Haunting in the Mist
    [
        S('reel_fog_stalk', fc=[540, 1180, 2.2]),
        S('reel_hamlet', fc=[540, 920, 2.0]),
    ],
    # Beat 4: The Ambush & Flight into the Cottage
    [
        S('reel_fog_stalk', fc=[540, 1180, 2.4]),
        S('reel_cellar', fc=[540, 980, 2.0]),
    ],
    # Beat 5: The Secret in the Cellar Vault
    [
        S('reel_cellar', fc=[320, 1260, 2.2]),
        S('reel_solomon_face', fc=[540, 820, 2.0]),
    ],
    # Beat 6: The True Monster Sutherland Defeated
    [
        S('reel_cellar', fc=[760, 1320, 2.4]),
        S('reel_solomon_face', fc=[540, 820, 2.2]),
    ],
    # Beat 7: The Raging River Rescue
    [
        S('reel_river', fc=[540, 1020, 2.2]),
        S('reel_solomon_face', fc=[540, 820, 2.0]),
    ],
    # Beat 8: The Kindest and Gentlest of Souls
    [
        S('reel_solomon_face', fc=[540, 820, 2.4]),
        S('reel_qcard', fc=[540, 960, 1.8]),
    ],
    # Beat 9: Closing Question
    [
        S('reel_qcard', fc=[540, 960, 2.0]),
    ],
]
