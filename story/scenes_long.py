# Scene table for the LONG video: exactly 31 beats matching script_long.BEATS.
# Format: S(st, **v), where fc=[x, y, zoom] sets the closeup focus.
# First scene (beat 0 scene 0) MUST be the creepiest scene: bedroom_awake.
# Credit beat = [S('qcard')]
# Last beat = [S('end')]

def S(st, **v):
    return (st, v)

SC = [
    # ---- TEASER (beats 0..2)
    # Beat 0: 5:30 AM bedroom frozen under sheets
    [
        S('bedroom_awake', fc=[680, 720, 2.0]),
        S('sam_terror', fc=[960, 480, 2.2]),
        S('creature_stalk', crawl=True, fc=[960, 580, 1.8]),
    ],
    # Beat 1: Dead parents staring
    [
        S('parents_propped', fc=[620, 480, 2.0]),
        S('bedroom_awake', father=True, fc=[1120, 680, 2.2]),
        S('parents_propped', fc=[1300, 480, 2.2], last=True),
    ],
    # Beat 2: Creature under bed waiting
    [
        S('creature_stalk', crawl=True, fc=[960, 580, 2.0]),
        S('sam_terror', fc=[960, 480, 2.4]),
        S('bedroom_awake', creatureUnder=True, fc=[680, 820, 2.2], last=True),
    ],

    # ---- CHAPTER 1: The Scream (beats 3..6)
    # Beat 3: 2:30 AM scream
    [
        S('bedroom_awake', time="02:30", father=False, creatureUnder=False, fc=[180, 320, 1.8]),
        S('sam_terror', fc=[960, 480, 2.0]),
        S('bedroom_awake', time="02:30", father=False, creatureUnder=False, fc=[680, 720, 2.2]),
    ],
    # Beat 4: Waking in cold sweat
    [
        S('sam_terror', fc=[960, 480, 2.2]),
        S('bedroom_awake', time="02:31", father=False, creatureUnder=False, fc=[160, 680, 2.5]),
        S('sam_terror', fc=[960, 480, 2.4]),
    ],
    # Beat 5: Bad dream thought / bathroom need
    [
        S('sam_terror', fc=[960, 480, 2.0]),
        S('bathroom_dark', fc=[960, 420, 1.8]),
        S('sam_terror', fc=[960, 480, 2.3]),
    ],
    # Beat 6: Slipping out of sheets
    [
        S('bedroom_awake', time="02:33", father=False, creatureUnder=False, fc=[680, 720, 2.0]),
        S('hallway_blood', feet=True, fc=[960, 960, 2.2]),
        S('bathroom_dark', fc=[760, 400, 2.0]),
    ],

    # ---- CHAPTER 2: The Hallway (beats 7..10)
    # Beat 7: Pitch black bathroom
    [
        S('bathroom_dark', fc=[960, 420, 2.0]),
        S('bathroom_dark', fc=[760, 680, 2.2]),
        S('bathroom_dark', fc=[960, 420, 2.4]),
    ],
    # Beat 8: Stepping out / damp cold carpet
    [
        S('hallway_blood', feet=True, fc=[960, 960, 2.2]),
        S('hallway_blood', fc=[760, 500, 2.0]),
        S('hallway_blood', fc=[860, 750, 2.4]),
    ],
    # Beat 9: Terror / bolting back to room
    [
        S('sam_terror', fc=[960, 480, 2.2]),
        S('bedroom_awake', time="02:35", father=False, creatureUnder=False, fc=[680, 720, 2.2]),
        S('sam_terror', fc=[960, 480, 2.5]),
    ],
    # Beat 10: Squeezing eyes under blankets
    [
        S('sam_terror', fc=[960, 480, 2.4]),
        S('bedroom_awake', time="02:37", father=False, creatureUnder=False, fc=[680, 720, 2.0]),
        S('sam_terror', fc=[960, 480, 2.5]),
    ],

    # ---- CHAPTER 3: The Intruder (beats 11..14)
    # Beat 11: Door hinges creaking open
    [
        S('bedroom_awake', time="02:40", father=False, creatureUnder=False, fc=[1420, 320, 1.8]),
        S('creature_dragging', fc=[960, 450, 2.0]),
        S('sam_terror', fc=[960, 480, 2.2]),
    ],
    # Beat 12: Peeking out / tall hairless creature
    [
        S('sam_terror', fc=[960, 480, 2.4]),
        S('creature_stalk', reach=False, fc=[960, 450, 2.2]),
        S('creature_dragging', fc=[960, 400, 2.2]),
    ],
    # Beat 13: Hunched spine / eyeless sockets
    [
        S('creature_stalk', reach=True, fc=[960, 350, 2.5]),
        S('creature_stalk', reach=False, fc=[960, 500, 2.0]),
        S('sam_terror', fc=[960, 480, 2.5]),
    ],
    # Beat 14: Dragging parents
    [
        S('creature_dragging', fc=[680, 500, 2.2]),
        S('parents_propped', fc=[620, 480, 2.0]),
        S('creature_dragging', fc=[960, 450, 2.2]),
    ],

    # ---- CHAPTER 4: The Masterpiece (beats 15..19)
    # Beat 15: Biting tongue / careful staging
    [
        S('sam_terror', fc=[960, 480, 2.4]),
        S('creature_stalk', reach=True, fc=[960, 500, 2.0]),
        S('parents_propped', fc=[620, 480, 2.0]),
    ],
    # Beat 16: Father propped against bed
    [
        S('parents_propped', fc=[620, 480, 2.2]),
        S('bedroom_awake', father=True, creatureUnder=False, fc=[680, 720, 2.2]),
        S('parents_propped', fc=[620, 480, 2.5]),
    ],
    # Beat 17: Mother seated in chair
    [
        S('parents_propped', fc=[1300, 480, 2.2]),
        S('bedroom_awake', father=True, creatureUnder=False, fc=[1120, 680, 2.2]),
        S('parents_propped', fc=[1300, 480, 2.5]),
    ],
    # Beat 18: Finger smearing ritual pentagram
    [
        S('wall_reveal', fc=[960, 420, 1.8]),
        S('creature_stalk', reach=True, fc=[960, 480, 2.2]),
        S('wall_reveal', fc=[960, 420, 2.2]),
    ],
    # Beat 19: Carving line of words in plaster
    [
        S('wall_reveal', fc=[960, 480, 2.0]),
        S('creature_stalk', reach=True, fc=[960, 520, 2.2]),
        S('sam_terror', fc=[960, 480, 2.3]),
    ],

    # ---- CHAPTER 5: Beneath the Bed (beats 20..23)
    # Beat 20: Creature turns to mattress / pretending sleep
    [
        S('creature_stalk', reach=False, fc=[960, 450, 2.2]),
        S('sam_terror', fc=[960, 480, 2.4]),
        S('bedroom_awake', creatureUnder=False, fc=[680, 720, 2.0]),
    ],
    # Beat 21: Slithering beneath bed / slats dipping
    [
        S('creature_stalk', crawl=True, fc=[960, 580, 2.0]),
        S('bedroom_awake', creatureUnder=True, fc=[680, 800, 2.2]),
        S('sam_terror', fc=[960, 480, 2.5]),
    ],
    # Beat 22: Three hours trapped (2:30 to 5:30)
    [
        S('bedroom_awake', time="05:30", creatureUnder=True, fc=[160, 680, 2.2]),
        S('sam_terror', fc=[960, 480, 2.2]),
        S('bedroom_awake', time="05:30", creatureUnder=True, fc=[680, 720, 2.0]),
    ],
    # Beat 23: Considering sprinting for the door
    [
        S('sam_terror', fc=[960, 480, 2.4]),
        S('bedroom_awake', time="05:30", creatureUnder=True, fc=[1420, 320, 2.0]),
        S('creature_stalk', crawl=True, fc=[960, 580, 2.2]),
    ],

    # ---- CHAPTER 6: The Message (beats 24..28)
    # Beat 24: Pre-dawn light in window
    [
        S('bedroom_awake', time="05:30", creatureUnder=True, fc=[180, 240, 2.0]),
        S('sam_terror', fc=[960, 480, 2.0]),
        S('bedroom_awake', time="05:30", creatureUnder=True, fc=[680, 720, 2.2]),
    ],
    # Beat 25: Gaze drifting to wall inscription
    [
        S('sam_terror', fc=[960, 480, 2.2]),
        S('wall_reveal', fc=[960, 450, 2.0]),
        S('sam_terror', fc=[960, 480, 2.4]),
    ],
    # Beat 26: Eyes adjusted / words sharp
    [
        S('wall_reveal', fc=[960, 480, 2.2]),
        S('sam_terror', fc=[960, 480, 2.5]),
        S('wall_reveal', fc=[960, 480, 2.5]),
    ],
    # Beat 27: Four simple words
    [
        S('sam_terror', fc=[960, 480, 2.4]),
        S('wall_reveal', fc=[960, 660, 2.2]),
        S('sam_terror', fc=[960, 480, 2.5]),
    ],
    # Beat 28: "I KNOW YOU ARE AWAKE"
    [
        S('wall_reveal', fc=[960, 660, 2.6]),
        S('bedroom_awake', time="05:30", creatureUnder=True, fc=[1420, 500, 2.2]),
        S('wall_reveal', fc=[960, 660, 2.8], last=True),
    ],

    # ---- CREDIT & END SCREEN (beats 29..30)
    # Beat 29: Credit beat (one still card)
    [
        S('qcard')
    ],
    # Beat 30: End Screen (20s)
    [
        S('end')
    ],
]
