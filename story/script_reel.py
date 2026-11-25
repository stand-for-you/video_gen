# Reel: single narrator voice ONLY (channel rule — no [tag] lines). Target 2:40-2:55.
# IMPORTANT: after running `python3 tools/tts.py reel`, check audio/reel/timing.json's total
# duration. If it is outside 160-175 s, trim or add a sentence here and re-run tts.py reel —
# it only re-renders the lines you changed.
BEATS = [
    ("Intro",
     "My name is Mitch, and I want to tell you about the thing that visited me after I "
     "moved into my brother's house. I used to call ghosts nonsense. Then something "
     "climbed through my window with empty black eyes, and I never called it nonsense "
     "again."),
    (None,
     "Let us go back to the beginning."),
    (None,
     "A week after my own house was foreclosed, I moved in with my brother Edwin. We had "
     "not spoken in ten years, so I was glad to be there. The first night I fell asleep "
     "fast, happy for once."),
    (None,
     "Around one in the morning I heard rustling outside my window. Something scratched slowly "
     "against the glass pane. I told myself it was only a raccoon and went back to sleep. In the "
     "morning I mentioned it to Edwin, and he agreed it was probably nothing."),
    (None,
     "The next night I woke to my window sliding open, then a heavy thump on the floor, as "
     "if something had climbed inside. I searched the room, but I saw nothing there. In the "
     "morning Edwin dropped his coffee cup the moment he saw my face. He held up a mirror. "
     "A long gash had opened across my left cheek overnight, and I had no memory of it."),
    (None,
     "At the hospital the doctor lifted my shirt to show me a fresh, sewn incision where a "
     "kidney should have been. He told me I had somehow lost it in the night, and that he "
     "did not know how. I could not answer him."),
    (None,
     "On the third night I woke at midnight to a creature leaning over my bed, a dark hoodie "
     "pulled low, a cracked blue mask with no mouth and no nose. Where its eyes should have "
     "been there was only black, empty sockets, with a black fluid dripping from them."),
    (None,
     "It lunged for my chest with long pale fingers, clawing for my ribs. I grabbed the "
     "camera from the mantel and took one picture before I kicked it hard in the face and "
     "ran. I fled into the dark woods behind the house, until I tripped on a rock and "
     "everything went black."),
    (None,
     "I woke again in a hospital bed with only minor injuries. The doctor said my parents "
     "were coming for me, and then his face changed. My brother, he told me, had been "
     "killed by something. I am sorry, Mitch, he said."),
    (None,
     "My parents drove me back to gather my things. In the hallway lay Edwin's body, and "
     "beside it something small. I picked it up without telling them what I had found, and "
     "in the car I finally looked down at what I was holding. It was wrapped in dark cloth, "
     "cold and wet with that black fluid. It was the piece taken from my side, half-eaten "
     "and still warm."),
    (None,
     "This story is inspired by the Eyeless Jack creepypasta, shared online in twenty "
     "twelve."),
    (None,
     "Now tell me. Would you have believed it was only a raccoon?"),
]

QUESTION = "Would you have believed it was only a raccoon?"
TEASER_LAST_BEAT = 3
