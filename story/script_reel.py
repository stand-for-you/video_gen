# I Know You're Awake - REEL retelling (9:16), 2:40-2:55, ONE speaker (the narrator).
# No [tags] anywhere: tools/tts.py forces a single voice for the Reel, because an Instagram
# Reel with more than one speaker is refused for voice translation (channel rule).
#
# WORD_BEATS lists the beats that get one-word-at-a-time captions - the creature-introduction
# block, exactly where the reference short puts one word on screen per beat.
BEATS = [
("Intro", "It is five thirty in the morning and I have not moved for three hours."),
(None, "My mother is in the chair by my window. My father is propped against the foot of my bed. Both of them are facing me. Both of their mouths are open."),
(None, "Neither of them has blinked since I woke up, and the thing that arranged them has not left this room."),
(None, "At twenty past two I woke up to a scream on the other side of the house. It stopped in the middle, like a door had been shut on it."),
(None, "I got as far as my door. Then I did the stupidest thing I will ever do. I went to the bathroom first."),
(None, "Three minutes. I put the light on, I washed my hands, and I opened the door a crack."),
(None, "There was blood on the carpet. Not a drop. A smear, dragged from my parents' room all the way to the top of the stairs."),
(None, "The front door was twelve steps down those stairs. I did not take them."),
(None, "I got into my bed and pulled the sheets over my head."),
(None, "Then my bedroom door creaked open, and I pulled the blanket down off one eye."),
(None, "It was bent over in my doorway and it was far too tall for my room."),
(None, "Hairless. No eyes. No mouth. Nothing on its face at all."),
(None, "Arms hanging past its knees. Back slouched right over. Wearing nothing."),
(None, "And it was dragging my mother and my father in by the arms, one in each hand."),
(None, "It propped my father against my bed, facing my pillow. Then it sat my mother in the chair, turned the same way."),
(None, "It arranged them, like something that wanted the picture to come out right."),
(None, "Then it put both hands on my wall and painted a circle, and a star inside the circle, upside down."),
(None, "Then it dragged one line of letters underneath it with one finger. It was too dark to read."),
(None, "And then it folded itself up on my floor and went under my bed. Under my bed, with me on top of it."),
(None, "That was three hours ago. Lie still that long and your eyes get better at the dark."),
(None, "So I move my eyes. Not my head. Just my eyes. And I can read it now."),
(None, "It says: I know you're awake."),
(None, "It never had to check. It wrote that before I opened my eyes, and it has waited three hours for me to read it."),
(None, "If you were in that bed, would you have stayed still, or run for the door?"),
]
TEASER_LAST_BEAT = 2
WORD_BEATS = [10, 11, 12]
