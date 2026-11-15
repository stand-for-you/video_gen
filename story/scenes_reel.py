# Scene table for the REEL (vertical 1080x1920): exactly 10 beats matching script_reel.BEATS.
# Format: S(st, **v) with SetsR names and vertical coordinates.
# Close-up focus points kept between y 600-900 so face/prop stays above captions (~y 1450).

def S(st, **v):
    return (st, v)

SC = [
    # Beat 0: Intro Teaser (bedroom at 5:30, propped parents, creature under mattress)
    [
        S('bedroom_awake', fc=[540, 750, 1.8]),
        S('sam_terror', fc=[540, 750, 2.0]),
        S('creature_stalk', crawl=True, fc=[540, 850, 1.8]),
        S('parents_propped', fc=[360, 680, 1.9], last=True),
    ],
    # Beat 1: Scream at 2:30 AM / bathroom detour
    [
        S('sam_terror', fc=[540, 750, 2.0]),
        S('bathroom_dark', fc=[540, 680, 1.8]),
        S('sam_terror', fc=[540, 750, 2.2]),
    ],
    # Beat 2: Bloody hallway trails / bolting back to room
    [
        S('hallway_blood', fc=[540, 800, 1.8]),
        S('sam_terror', fc=[540, 750, 2.2]),
        S('bedroom_awake', time="02:35", father=False, creatureUnder=False, fc=[460, 1180, 1.8]),
    ],
    # Beat 3: Door creaking / eyeless creature dragging parents
    [
        S('creature_dragging', fc=[540, 750, 1.8]),
        S('creature_stalk', reach=False, fc=[540, 800, 2.0]),
        S('sam_terror', fc=[540, 750, 2.2]),
    ],
    # Beat 4: Propping father against bed / seating mother in chair
    [
        S('parents_propped', fc=[360, 680, 2.0]),
        S('parents_propped', fc=[740, 940, 2.0]),
        S('bedroom_awake', father=True, fc=[540, 850, 1.8]),
    ],
    # Beat 5: Smearing ritual symbols & carving words into plaster
    [
        S('wall_reveal', fc=[540, 750, 1.8]),
        S('creature_stalk', reach=True, fc=[540, 850, 2.0]),
        S('wall_reveal', fc=[540, 750, 2.2]),
    ],
    # Beat 6: Slithering beneath bed / slats dipping under weight
    [
        S('creature_stalk', crawl=True, fc=[540, 850, 2.0]),
        S('bedroom_awake', creatureUnder=True, fc=[460, 1200, 2.0]),
        S('sam_terror', fc=[540, 750, 2.2]),
    ],
    # Beat 7: Pre-dawn light / reading carved letters
    [
        S('bedroom_awake', time="05:30", creatureUnder=True, fc=[80, 260, 1.8]),
        S('sam_terror', fc=[540, 750, 2.2]),
        S('wall_reveal', fc=[540, 750, 2.0]),
    ],
    # Beat 8: "I KNOW YOU ARE AWAKE"
    [
        S('wall_reveal', fc=[540, 750, 2.4]),
        S('sam_terror', fc=[540, 750, 2.4]),
        S('wall_reveal', fc=[540, 750, 2.6], last=True),
    ],
    # Beat 9: Credit beat & Closing Question
    [
        S('end')
    ],
]
