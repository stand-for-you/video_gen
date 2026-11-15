# Scene table for the LONG video: exactly 29 beats matching script_long.BEATS.
# Format: S(st, **v), where fc=[x, y, zoom] sets the closeup focus.

def S(st, **v):
    return (st, v)

SC = [
    # ---- 0: TEASER / INTRO (beats 0..2)
    # Beat 0: In the deepest shadows of St Andrews University library...
    [
        S('standrews_library', fc=[960, 480, 2.0]),
        S('solomon_portrait', fc=[960, 540, 2.2]),
        S('ettrick_hamlet', fc=[840, 640, 2.0]),
    ],
    # Beat 1: On the inside of the back cover, an artist in 1578...
    [
        S('standrews_library', fc=[960, 860, 2.2]),
        S('solomon_portrait', fc=[960, 540, 2.0]),
    ],
    # Beat 2: Veins bulge across his pale, hairless skull...
    [
        S('solomon_portrait', fc=[960, 460, 2.4]),
        S('standrews_library', fc=[960, 540, 2.0]),
    ],

    # ---- 1: THE DISAPPEARANCES (beats 3..5)
    # Beat 3: The book chronicles the isolated town of Ettrick...
    [
        S('ettrick_hamlet', fc=[840, 640, 2.0]),
        S('stone_well', fc=[960, 700, 2.0]),
    ],
    # Beat 4: The first to disappear was young Alana Sutherland...
    [
        S('stone_well', fc=[960, 780, 2.4]),
        S('ettrick_hamlet', fc=[1320, 480, 2.2]),
    ],
    # Beat 5: Days later, another child vanished...
    [
        S('ettrick_hamlet', fc=[340, 640, 2.2]),
        S('stone_well', fc=[960, 800, 2.0]),
    ],

    # ---- 2: THE RECLUSE IN THE WOODS (beats 6..8)
    # Beat 6: When two more children vanished in mid-February...
    [
        S('ettrick_hamlet', fc=[840, 640, 2.0]),
        S('woods_cabin', fc=[880, 680, 2.2]),
    ],
    # Beat 7: Solomon was an outsider who lived in a small wooden cabin...
    [
        S('woods_cabin', fc=[1360, 690, 2.2]),
        S('solomon_portrait', fc=[960, 540, 2.0]),
    ],
    # Beat 8: He would watch the village children play from the tree line...
    [
        S('woods_cabin', fc=[1260, 700, 2.4]),
        S('stone_well', fc=[960, 780, 2.2]),
    ],

    # ---- 3: THE MOB AND THE FLAMES (beats 9..11)
    # Beat 9: On a freezing February night, grief and hatred...
    [
        S('burning_cabin', fc=[960, 680, 2.0]),
        S('woods_cabin', fc=[880, 680, 2.2]),
    ],
    # Beat 10: They surrounded his humble cabin and barred the heavy timbers...
    [
        S('burning_cabin', fc=[960, 680, 2.4]),
        S('woods_cabin', fc=[880, 680, 2.0]),
    ],
    # Beat 11: Solomon's desperate screams echoed through the Scots pines...
    [
        S('burning_cabin', fc=[960, 540, 2.2]),
        S('ettrick_hamlet', fc=[840, 640, 2.0]),
    ],

    # ---- 4: THE GHOST IN THE MIST (beats 12..14)
    # Beat 12: Yet within days, a suffocating fog descended...
    [
        S('foggy_street_stalk', fc=[960, 720, 2.0]),
        S('ettrick_hamlet', fc=[840, 640, 2.2]),
    ],
    # Beat 13: An elderly woman woke to rustling beneath her bed...
    [
        S('foggy_street_stalk', fc=[680, 720, 2.2]),
        S('solomon_portrait', fc=[960, 540, 2.0]),
    ],
    # Beat 14: Then, the impossible occurred: an orphan girl was snatched...
    [
        S('church_interior', fc=[860, 780, 2.2]),
        S('foggy_street_stalk', fc=[960, 720, 2.0]),
    ],

    # ---- 5: THE AMBUSH ON THE COBBLESTONES (beats 15..17)
    # Beat 15: Believing Solomon's vengeful wraith had returned...
    [
        S('street_ambush', fc=[480, 760, 2.2]),
        S('church_interior', fc=[960, 280, 2.0]),
    ],
    # Beat 16: They waited in the midnight mist until the solitary figure appeared...
    [
        S('street_ambush', fc=[1380, 720, 2.2]),
        S('foggy_street_stalk', fc=[960, 720, 2.0]),
    ],
    # Beat 17: The vicar splashed holy water across the stone...
    [
        S('street_ambush', fc=[1380, 720, 2.5]),
        S('foggy_street_stalk', fc=[680, 720, 2.0]),
    ],

    # ---- 6: THE TRUTH IN THE CELLAR (beats 18..21)
    # Beat 18: Pursued by the shouting mob, Solomon sprinted...
    [
        S('foggy_street_stalk', fc=[960, 720, 2.0]),
        S('secret_cellar', fc=[960, 540, 2.2]),
    ],
    # Beat 19: With her last ounce of strength, the child pointed...
    [
        S('secret_cellar', fc=[420, 780, 2.4]),
        S('stone_well', fc=[960, 780, 2.0]),
    ],
    # Beat 20: Chained against the damp stone walls were the missing children...
    [
        S('secret_cellar', fc=[420, 780, 2.2]),
        S('secret_cellar', fc=[1340, 840, 2.4]),
    ],
    # Beat 21: Sutherland had killed his daughter in a drunken rage...
    [
        S('secret_cellar', fc=[1340, 840, 2.4]),
        S('solomon_portrait', fc=[960, 540, 2.2]),
    ],

    # ---- 7: THE RIVER GUARDIAN (beats 22..26)
    # Beat 22: The town rejoiced, realizing with heavy shame...
    [
        S('ettrick_hamlet', fc=[840, 640, 2.0]),
        S('solomon_portrait', fc=[960, 540, 2.2]),
    ],
    # Beat 23: Centuries later, while researching the Ettrick tome...
    [
        S('standrews_library', fc=[960, 480, 2.0]),
        S('raging_river', fc=[960, 760, 2.0]),
    ],
    # Beat 24: Swept by torrential currents toward jagged rocks...
    [
        S('raging_river', fc=[680, 680, 2.4]),
        S('solomon_portrait', fc=[960, 540, 2.0]),
    ],
    # Beat 25: Suddenly, the forest branches cracked...
    [
        S('raging_river', fc=[960, 760, 2.2]),
        S('solomon_portrait', fc=[960, 540, 2.2]),
    ],
    # Beat 26: The pale, withered man placed the child on the grass...
    [
        S('raging_river', fc=[1120, 640, 2.4]),
        S('solomon_portrait', fc=[960, 540, 2.2]),
    ],

    # ---- 8: CLOSING (beats 27..28)
    # Beat 27: Credit Card
    [
        S('qcard', title='THE MELANCHOLY OF HERBERT SOLOMON'),
    ],
    # Beat 28: End Screen
    [
        S('end'),
    ],
]
