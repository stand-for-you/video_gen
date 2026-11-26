# I Know You're Awake - Scroll Kaos own-words retelling, LONG video (16:9).
#
# First person, the boy telling it afterwards. Text after a [tag] inside double quotes is a
# character voice; every tag has an entry in story/voices.py VOICES. Everything else = narrator.
#
# SHAPE (channel policy):
#   teaser  ~32 s - the 5:30 a.m. frame, the creepiest picture in the story, first
#   the cut line "Let us go back to the beginning." ends the teaser (beat 4)
#   then the story in order from 2:20 a.m., in our own words
#   ONE credit sentence after 0:45 (beat 13, lands at about 1:05)
#   the closing question as the very LAST line (same words in 4 places)
BEATS = [
# ---------------------------------------------------------------- TEASER (~32 s)
("Intro", "It is five thirty in the morning and I have not moved for three hours. Not my legs. Not my hands."),
(None, "My mother is in the chair by my window. My father is propped against the foot of my bed. Both of them are turned to face me, and both of their mouths are open."),
(None, "The smell of blood in here is so strong I can taste it. Neither of them has blinked since I woke up."),
(None, "The thing that put them there has not left this room. If it finds out I am awake, I die in this bed, and there is nobody left in this house to stop it."),
(None, "Let us go back to the beginning."),
# ---------------------------------------------------------------- PART 1: the scream
("The scream", "Three hours ago I was asleep, like any other night."),
(None, "The last thing I remember before all of it is my mother at my door with the landing light behind her."),
(None, '[family]"Lights out, love. I do not want to hear that tablet at midnight."'),
(None, "And my father, further down the hall, not even coming in."),
(None, '[stranger]"Door is locked, mate. Go to sleep."'),
(None, "He checked the locks every night of my life. I need you to know that he checked them that night too."),
(None, "At 2:20 I woke up because somebody was screaming on the other side of the house."),
(None, "Not a shout. Not a word. A long high scream that stopped in the middle, like a door had been closed on it."),
(None, "This is a retelling, inspired by a story told online."),
(None, "I sat up. I got to my door. I want that on the record, because of what I did next."),
# --- CHOICE 1 (the card plays over these words; tools/film.py finds the frames)
(None, "You are twelve years old and somebody just screamed. Do you go and look, or do you use the bathroom first?"),
# ---------------------------------------------------------------- PART 2: the wrong three minutes
("The wrong three minutes", "My body told me something very stupid. I needed the toilet."),
(None, "Somebody had screamed in my house, and I turned left into the bathroom first."),
(None, "I have had three hours to think about those three minutes."),
(None, "I put the light on. I remember the light. It was the last normal thing that ever happened to me."),
(None, "I washed my hands, because that is what you do, even at half past two, even after that."),
(None, "Then I turned the light off, opened the door a crack, and looked out at the hall."),
("Blood on the carpet", "There was blood on the carpet."),
(None, "Not a drop. A smear. A wide dark one that started at the far end by my parents' room and went all the way to the top of the stairs."),
(None, "Something heavy had been pulled along that carpet."),
(None, "The front door was down those stairs. Twelve steps, the hall, one latch, and then the street, and the Kellys across the road with their bedroom light still on."),
(None, "I did not go down the stairs."),
# --- CHOICE 2
(None, "Blood on the carpet. The front door is twelve steps away. Do you run for it, or hide in your bed?"),
(None, "I went back into my room, got into my bed, and pulled the sheets over my head like a seven-year-old, as if that does anything to anything."),
(None, "I lay under there and told myself I was dreaming. I kept that up for about eight minutes."),
# ---------------------------------------------------------------- PART 3: the door
("The door", "Then my bedroom door creaked open."),
(None, "And because something in me needed to know, I pulled the blanket down off one eye and looked."),
(None, "It was bent over in my doorway, and it was far too tall for my room."),
(None, "It was hairless. All of it. Nothing on its head, no eyebrows, nothing anywhere."),
(None, "It had no eyes. I do not mean shut, or white, or hidden. There was nothing on its face where eyes go, and nothing where a mouth goes either. A smooth pale plate, hanging lower than its own shoulders."),
(None, "It wore nothing at all."),
(None, "It moved like something that was never taught to stand up, back slouched right over, arms hanging past its knees."),
(None, "And it was dragging my mother and my father into my bedroom by the arms, one in each hand."),
("The masterpiece", "It was not stupid. That is the part I need you to understand."),
(None, "A thing that walks like that should not have been able to do what it did next."),
(None, "It propped my father against the foot of my bed, sitting up, and turned his face until he was looking at my pillow."),
(None, "Then it lifted my mother into the chair by my window and turned her the same way."),
(None, "It arranged them. Like a photograph. Like something that wanted the picture to come out right."),
(None, "Then it put both hands flat on my wall and started dragging them along it."),
(None, "It drew a circle. Then a star inside the circle, upside down, five points, the kind of thing boys scratch on the back of their school books."),
(None, "It was painting with my parents. And then it stepped back from the wall, the way you step back from a drawing."),
(None, "Then it wrote something under the circle. One line of letters, pulled across my wallpaper with one finger."),
(None, "It was too dark. I could not read it."),
(None, "And then it got down on my floor, folded itself up, and went under my bed."),
(None, "Under my bed. With me on top of it."),
# ---------------------------------------------------------------- PART 4: five thirty
("Five thirty", "That was three hours ago."),
(None, "Here is the thing about lying still for three hours. Your eyes get better at the dark."),
(None, "The clock on my table says 5:30. My window has gone from black to grey. And the writing on my wall has been getting clearer for about twenty minutes."),
(None, "I have not looked at it. I have been looking at my father instead, because he is the only thing in this room that cannot hurt me."),
(None, "I have one plan and it is a bad one. The door is nine feet away. I run, I take the stairs, I get the latch, and I scream until the Kellys put their light on."),
(None, "Nine feet. And it is under the bed. I would have to put my feet on the floor."),
# --- CHOICE 3
(None, "Nine feet to the door. It is under the bed. Do you stay still, or run?"),
(None, "So I have been doing the only thing I can do, which is nothing at all. Breathing slow. Keeping my face soft. Not blinking too much, because I read once that they can tell."),
(None, '[you]"It does not know I am awake."'),
(None, "I have been saying that to myself for three hours."),
(None, "I am going to read the wall now. I do not want to. But I would rather know what it says than die next to it not knowing."),
("The message", "So I move my eyes. Not my head. Just my eyes, right, to the circle and the star and the line underneath it."),
(None, "And my eyes have adjusted. And I can read it."),
(None, "It says: I know you're awake."),
(None, "Under the bed, something shifts its weight."),
(None, "It was never waiting to find out if I woke up. It wrote that before I opened my eyes, because it already knew."),
(None, "It has been waiting three hours for me to read it."),
# ---------------------------------------------------------------- CLOSING QUESTION (last line)
(None, "If you were in that bed, would you have stayed still, or run for the door?"),
]
TEASER_LAST_BEAT = 4
END_SCREEN_S = 20.0
