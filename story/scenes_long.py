# Scene table for the LONG video - "The Seer of Possibilities" (engine v0.5, 3D, sets in src/SetsL.tsx).
# ONE LIST PER SPOKEN SENTENCE (the sync law). Written as story/plan_long.txt, expanded by story/expand_long.py.
def S(st, **v): return (st, v)
SC = [
 #   0   5.9s [nar] There is a house at the end of a long road, and one window is still lit.
 [S('house', fr='wide', cm='push', dir=1), S('house', fr='waist', cm='tilt', dir=-1), S('house', fr='waist', cm='pull', dir=-1, alt=1)],
 #   1   5.5s [nar] Inside that house a man sits very still in front of a screen.
 [S('upstairs', fr='wide', expr='fear', lamp=0.45, cm='truck', dir=-1), S('upstairs', fr='waist', expr='fear', lamp=0.45, cm='push', dir=1), S('upstairs', fr='waist', expr='fear', lamp=0.45, cm='drop', dir=1, alt=1)],
 #   2   1.7s [nar] The screen is black.
 [S('screen', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], cm='crane', dir=1)],
 #   3   2.3s [nar] The words on it are red.
 [S('screen', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], cm='vertigo', dir=-1)],
 #   4   7.0s [nar] They have just told him that his wife is already dead, downstairs, on their own sofa.
 [S('after', fr='wide', cm='arc', dir=1), S('doorway', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], cm='truck', dir=-1, alt=1), S('house', fr='wide', cm='push', dir=1, alt=2), S('doorway', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], cm='tilt', dir=-1, alt=3)],
 #   5   5.7s [nar] They have told him that the boy who did it is still inside the house.
 [S('doorway', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], bpose='idle', cm='pull', dir=-1), S('upstairs', fr='bust', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], expr='sad', tremble=0.5, lamp=0.45, cm='crane', dir=1, alt=1), S('after', cm='truck', dir=-1, alt=2)],
 #   6   3.2s [seer] 'He is coming up for you now, Jack. You cannot stop him.'
 [S('screen', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], cm='drop', dir=1), S('upstairs', fr='bust', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], expr='sad', tremble=0.5, lamp=0.45, cm='pull', dir=-1)],
 #   7   1.8s [nar] The man does not run.
 [S('upstairs', fr='waist', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], expr='sad', tremble=0.5, lamp=0.45, cm='orbit', dir=-1)],
 #   8   1.6s [nar] He does not shout.
 [S('upstairs', fr='bust', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], expr='sad', tremble=0.5, lamp=0.45, cm='pan', dir=1)],
 #   9   7.8s [nar] He is crying, and he is also thinking about the last twelve years, the best years of h
 [S('living', fr='wide', donna=True, jack=True, pizza=True, lamp=0.6, cm='tilt', dir=-1), S('upstairs', fr='bust', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], expr='sad', tremble=0.5, lamp=0.45, cm='pan', dir=1), S('living', fr='waist', donna=True, jack=True, pizza=True, lamp=0.6, cm='arc', dir=1, alt=1), S('upstairs', fr='close', txt=['He is coming up for you now, Jack.', 'You cannot stop him.'], expr='sad', tremble=0.5, lamp=0.45, cm='vertigo', dir=-1, alt=2)],
 #  10   4.7s [nar] In a moment he will turn to that screen and say two words.
 [S('upstairs', fr='waist', txt=['Thank you.'], expr='fear', tremble=0.5, lamp=0.45, cm='push', dir=1), S('screen', txt=['Thank you.'], cm='tilt', dir=-1), S('upstairs', fr='bust', txt=['Thank you.'], expr='fear', tremble=0.5, lamp=0.45, cm='pull', dir=-1, alt=1)],
 #  11   1.2s [nar] Thank you.
 [S('screen', txt=['Thank you.'], cm='truck', dir=-1)],
 #  12   4.5s [nar] What can take everything from a man, and still be thanked for it?
 [S('seer', fr='wide', cm='crane', dir=1), S('seer', fr='waist', cm='orbit', dir=-1, alt=1), S('seer', fr='bust', cm='drop', dir=-1, alt=2)],
 #  13   2.4s [nar] Let us go back to the beginning.
 [S('gallery', face=3, cm='vertigo', dir=-1), S('gallery', face=3, cm='push', dir=1, alt=1)],
 #  14   4.2s [nar] Jack lived alone in a small flat on the third floor.
 [S('flat', fr='wide', cm='arc', dir=1), S('flat', fr='waist', cm='tilt', dir=-1, alt=1)],
 #  15   6.9s [nar] He had a desk, a chair, an old computer, and a window that looked at a car park.
 [S('flat', fr='detail', cm='pull', dir=-1), S('flat', fr='wide', cm='arc', dir=1), S('flat', fr='close', cm='push', dir=1, alt=1)],
 #  16   2.0s [nar] He was thirty one years old.
 [S('flat', fr='bust', cm='drop', dir=1)],
 #  17   7.6s [nar] He was polite at work, quiet in the lift, and he went home every evening to nobody.
 [S('lobby', fr='wide', out=0, cm='orbit', dir=-1), S('flat', fr='wide', cm='drop', dir=1), S('lobby', fr='waist', out=0, cm='crane', dir=1, alt=1)],
 #  18   7.5s [nar] That night he was playing cards on the screen, moving them one at a time, not really t
 [S('flat', fr='waist', cm='pan', dir=1), S('screen', txt=['...'], cm='orbit', dir=-1), S('flat', fr='bust', cm='vertigo', dir=-1, alt=1)],
 #  19   3.9s [nar] The little light on his router was blinking red.
 [S('flat', fr='detail', cm='tilt', dir=-1)],
 #  20   2.6s [nar] His internet was down again.
 [S('flat', fr='detail', cm='push', dir=1)],
 #  21   4.9s [nar] It went down almost every week, so he hardly noticed it.
 [S('flat', fr='waist', cm='truck', dir=-1), S('flat', fr='bust', cm='drop', dir=1, alt=1)],
 #  22   2.0s [nar] Then the cards faded away.
 [S('screen', txt=['Hello Jack. I need a favour from', 'you.'], cm='crane', dir=1)],
 #  23   1.7s [nar] The screen went black.
 [S('screen', txt=['Hello Jack. I need a favour from', 'you.'], cm='vertigo', dir=-1)],
 #  24   4.8s [nar] And red letters began to appear, one line at a time.
 [S('screen', txt=['Hello Jack. I need a favour from', 'you.'], cm='arc', dir=1), S('flat', fr='bust', txt=['Hello Jack. I need a favour from', 'you.'], cm='vertigo', dir=-1)],
 #  25   2.6s [seer] 'Hello Jack. I need a favour from you.'
 [S('screen', txt=['Hello Jack. I need a favour from', 'you.'], cm='pull', dir=-1)],
 #  26   1.3s [nar] Jack stopped.
 [S('flat', fr='bust', cm='drop', dir=1)],
 #  27   1.6s [nar] He looked at the router.
 [S('flat', fr='detail', cm='orbit', dir=-1)],
 #  28   2.5s [nar] The light was still blinking red.
 [S('flat', fr='detail', cm='pan', dir=1)],
 #  29   1.3s [nar] No internet.
 [S('flat', fr='detail', cm='tilt', dir=-1)],
 #  30   1.9s [nar] No connection at all.
 [S('flat', fr='detail', cm='push', dir=1)],
 #  31   1.8s [jack] 'Is this some kind of joke?'
 [S('flat', fr='bust', cm='truck', dir=-1)],
 #  32   2.2s [nar] he said to the empty room.
 [S('flat', fr='wide', cm='crane', dir=1)],
 #  33   2.0s [nar] The screen answered him.
 [S('screen', txt=['Is this some kind of joke?'], cm='vertigo', dir=-1)],
 #  34   6.4s [seer] 'I know this is strange for you. But do not worry. It is a small favour, an easy one. 
 [S('screen', txt=['I know this is strange for you.', 'But do not worry. It is a small', 'favour, an easy one. And you will'], cm='arc', dir=1), S('flat', fr='waist', txt=['I know this is strange for you.', 'But do not worry. It is a small', 'favour, an easy one. And you will'], cm='vertigo', dir=-1)],
 #  35   1.7s [nar] Now he was frightened.
 [S('flat', fr='bust', expr='fear', cm='pull', dir=-1)],
 #  36   6.6s [nar] He reached behind the desk and pulled the internet cable right out of the wall.
 [S('flat', fr='detail', expr='fear', pose='reach', cm='drop', dir=1), S('flat', fr='close', expr='fear', pose='reach', cm='truck', dir=-1, alt=1)],
 #  37   2.7s [nar] The red letters did not stop.
 [S('screen', txt=['I know this is strange for you.', 'But do not worry. It is a small', 'favour, an easy one. And you will'], cm='orbit', dir=-1)],
 #  38   1.7s [seer] 'Still here, Jack.'
 [S('screen', txt=['Still here, Jack.'], cm='pan', dir=1)],
 #  39   5.2s [nar] He sat there with the cable in his hand, and the words kept coming.
 [S('flat', fr='waist', txt=['Still here, Jack.'], expr='fear', pose='reach', cm='tilt', dir=-1), S('screen', txt=['Still here, Jack.'], cm='pan', dir=1)],
 #  40  12.2s [seer] 'Tomorrow, when you go to work, move the big potted plant that stands next to the lift
 [S('screen', txt=['Tomorrow, when you go to work,', 'move the big potted plant that', 'stands next to the lift on the'], cm='push', dir=1), S('lobby', fr='detail', out=0, cm='tilt', dir=-1), S('flat', fr='bust', txt=['Tomorrow, when you go to work,', 'move the big potted plant that', 'stands next to the lift on the'], expr='fear', cm='orbit', dir=-1, alt=1), S('lobby', fr='wide', out=0, cm='arc', dir=1, alt=2), S('flat', fr='bust', txt=['Tomorrow, when you go to work,', 'move the big potted plant that', 'stands next to the lift on the'], expr='fear', cm='pull', dir=-1, alt=3)],
 #  41   1.5s [nar] Jack said nothing.
 [S('flat', fr='bust', expr='fear', cm='truck', dir=-1)],
 #  42   2.1s [nar] He did not know what to say.
 [S('flat', fr='waist', expr='fear', cm='crane', dir=1)],
 #  43   6.1s [seer] 'I am asking you because I know you will do it. You will not let me down. You are spec
 [S('screen', txt=['I am asking you because I know you', 'will do it. You will not let me', 'down. You are special. We will'], cm='vertigo', dir=-1), S('flat', fr='bust', txt=['I am asking you because I know you', 'will do it. You will not let me', 'down. You are special. We will'], cm='push', dir=1, alt=1)],
 #  44   3.0s [nar] He pulled the power cord out of the wall.
 [S('flat', fr='detail', cm='arc', dir=1)],
 #  45   1.4s [nar] The screen died.
 [S('screen', txt=['I am asking you because I know you', 'will do it. You will not let me', 'down. You are special. We will'], off=True, cm='pull', dir=-1)],
 #  46   5.5s [nar] The room went dark, except for the orange street light outside.
 [S('flat', fr='wide', off=True, cm='drop', dir=1), S('flat', fr='waist', off=True, cm='truck', dir=-1, alt=1)],
 #  47   3.0s [nar] He stood in that dark for a long time.
 [S('flat', fr='waist', cm='orbit', dir=-1)],
 #  48   9.0s [nar] Then he had a hot shower, and he went to bed, telling himself it was a dream, or a tri
 [S('flat', fr='wide', cm='pan', dir=1), S('flat', fr='waist', cm='orbit', dir=-1), S('flat', fr='waist', cm='vertigo', dir=-1, alt=1)],
 #  49   3.0s [nar] But he had no friends who played jokes.
 [S('flat', fr='bust', cm='tilt', dir=-1)],
 #  50   2.4s [nar] And he had no enemies either.
 [S('flat', fr='waist', cm='push', dir=1)],
 #  51   2.2s [nar] He had nobody at all.
 [S('flat', fr='wide', cm='truck', dir=-1)],
 #  52   2.9s [nar] He woke up feeling strangely rested.
 [S('flat', fr='waist', cm='crane', dir=1)],
 #  53   6.4s [nar] Work started at half past eight, and Jack was never late in his life.
 [S('tower', fr='wide', cm='vertigo', dir=-1), S('lobby', fr='wide', out=0, cm='push', dir=1, alt=1)],
 #  54   2.4s [nar] He parked at ten past eight.
 [S('tower', fr='wide', cm='arc', dir=1)],
 #  55   2.4s [nar] Normally he would walk straight in.
 [S('tower', fr='waist', cm='pull', dir=-1)],
 #  56   3.9s [nar] Today he sat in the car and watched the clock.
 [S('tower', fr='waist', cm='drop', dir=1)],
 #  57   2.2s [nar] In the night he had been afraid.
 [S('flat', fr='bust', cm='orbit', dir=-1)],
 #  58   3.0s [nar] In the morning he was only curious.
 [S('tower', fr='bust', cm='pan', dir=1)],
 #  59   3.7s [nar] He thought about it the way a careful man thinks.
 [S('tower', fr='bust', cm='tilt', dir=-1)],
 #  60   2.5s [nar] Moving a plant is not wrong.
 [S('lobby', fr='detail', out=0, jack=False, cm='push', dir=1)],
 #  61   1.9s [nar] It is not against the law.
 [S('lobby', fr='detail', out=0, jack=False, cm='truck', dir=-1)],
 #  62   4.2s [nar] Nobody gets hurt when a plant moves three inches.
 [S('lobby', fr='detail', out=0, jack=False, cm='crane', dir=1), S('lobby', fr='close', out=0, jack=False, cm='orbit', dir=-1, alt=1)],
 #  63   4.4s [nar] So the most sensible thing, he decided, was to do it.
 [S('tower', fr='bust', cm='vertigo', dir=-1), S('lobby', fr='wide', out=0, cm='push', dir=1, alt=1)],
 #  64   5.4s [nar] Nothing would happen, and then he could forget the whole stupid business.
 [S('tower', fr='waist', cm='arc', dir=1), S('lobby', fr='wide', out=0, cm='truck', dir=-1, alt=1)],
 #  65   4.3s [nar] At sixteen minutes past eight he got out of the car.
 [S('tower', fr='wide', cm='pull', dir=-1), S('lobby', fr='wide', out=0, cm='crane', dir=1, alt=1)],
 #  66   6.4s [nar] He walked into the lobby at exactly the right minute, and the lobby was empty.
 [S('lobby', fr='wide', out=0, cm='drop', dir=1), S('lobby', fr='waist', out=0, cm='truck', dir=-1, alt=1)],
 #  67   2.4s [nar] That was the first strange thing.
 [S('lobby', fr='waist', out=0, cm='orbit', dir=-1)],
 #  68   4.7s [nar] At that time of the morning the ground floor was always full.
 [S('lobby', fr='wide', out=0, people=4, cm='pan', dir=1), S('lobby', fr='waist', out=0, people=4, cm='vertigo', dir=-1, alt=1)],
 #  69   3.7s [nar] People, coats, coffee, the ping of the lifts.
 [S('lobby', fr='wide', out=0, people=4, cm='tilt', dir=-1)],
 #  70   1.7s [nar] Today, nobody.
 [S('lobby', fr='wide', out=0, cm='push', dir=1)],
 #  71   3.4s [nar] The quiet had been predicted, to the minute.
 [S('lobby', fr='waist', out=0, cm='truck', dir=-1)],
 #  72   0.9s [jack] 'Fine,'
 [S('lobby', fr='bust', out=0, cm='crane', dir=1)],
 #  73   1.9s [nar] he said under his breath.
 [S('lobby', fr='bust', out=0, cm='vertigo', dir=-1)],
 #  74   2.0s [nar] 'Let us see what happens.'
 [S('lobby', fr='waist', out=0, cm='arc', dir=1)],
 #  75   7.3s [nar] The plant stood between the two lift doors, a big dark green thing in a heavy pot.
 [S('lobby', fr='detail', out=0, cm='pull', dir=-1), S('lobby', fr='close', out=0, cm='push', dir=1, alt=1), S('lobby', fr='wide', out=0, cm='tilt', dir=1, alt=2)],
 #  76   1.3s [nar] It looked fake.
 [S('lobby', fr='detail', out=0, cm='drop', dir=1)],
 #  77   7.0s [nar] It was the kind of thing a thousand people walk past every day without ever seeing it.
 [S('lobby', fr='wide', out=0, cm='orbit', dir=-1), S('lobby', fr='waist', out=0, cm='crane', dir=1, alt=1), S('lobby', fr='bust', out=0, cm='truck', dir=1, alt=2)],
 #  78   2.4s [nar] It was heavier than he expected.
 [S('lobby', fr='detail', out=0, pose='crouch', cm='pan', dir=1)],
 #  79   1.7s [nar] He had to lean into it.
 [S('lobby', fr='waist', out=0, pose='crouch', cm='tilt', dir=-1)],
 #  80   8.2s [nar] The pot scraped across the floor, and he pulled it out about three inches, as well as 
 [S('lobby', fr='detail', out=1, pose='crouch', cm='push', dir=1), S('lobby', fr='waist', out=1, pose='crouch', cm='tilt', dir=-1), S('lobby', fr='close', out=1, pose='crouch', cm='pull', dir=-1, alt=1)],
 #  81   1.3s [nar] He stepped back.
 [S('lobby', fr='waist', out=1, cm='truck', dir=-1)],
 #  82   1.3s [nar] He looked at it.
 [S('lobby', fr='detail', out=1, cm='crane', dir=1)],
 #  83   2.1s [nar] Then he looked around the lobby.
 [S('lobby', fr='wide', out=1, cm='vertigo', dir=-1)],
 #  84   2.6s [nar] People were coming in behind him now.
 [S('lobby', fr='wide', out=1, people=4, cm='arc', dir=1)],
 #  85   5.4s [nar] The doors were turning, voices were back, the floor was filling up.
 [S('lobby', fr='wide', out=1, people=4, cm='pull', dir=-1), S('lobby', fr='waist', out=1, people=4, cm='push', dir=1, alt=1)],
 #  86   2.1s [nar] Nobody looked at the plant.
 [S('lobby', fr='detail', out=1, people=4, cm='drop', dir=1)],
 #  87   2.8s [nar] Nobody noticed anything at all.
 [S('lobby', fr='wide', out=1, people=4, cm='orbit', dir=-1)],
 #  88   2.6s [nar] Jack let one lift go without him.
 [S('lobby', fr='waist', out=1, cm='pan', dir=1)],
 #  89   3.0s [nar] He waited, for something, for anything.
 [S('lobby', fr='bust', out=1, cm='tilt', dir=-1)],
 #  90   1.3s [nar] Nothing happened.
 [S('lobby', fr='wide', out=1, cm='push', dir=1)],
 #  91   9.1s [nar] So he took the next lift up to the seventh floor and sat down in his cubicle, on time,
 [S('office', fr='wide', cm='truck', dir=-1), S('office', fr='waist', cm='drop', dir=1, alt=1), S('office', fr='bust', cm='pull', dir=1, alt=2)],
 #  92   7.8s [nar] If you asked the people in that office about Jack, they would say polite, quiet, hard 
 [S('office', fr='wide', cm='crane', dir=1), S('office', fr='waist', cm='orbit', dir=-1, alt=1), S('office', fr='bust', cm='drop', dir=-1, alt=2)],
 #  93   2.4s [nar] All true, and all useless.
 [S('office', fr='bust', cm='vertigo', dir=-1)],
 #  94   4.2s [nar] The truth was that Jack did not really like people.
 [S('office', fr='waist', cm='arc', dir=1), S('office', fr='bust', cm='tilt', dir=-1, alt=1)],
 #  95   2.5s [nar] Not hate, nothing so strong.
 [S('office', fr='bust', cm='pull', dir=-1)],
 #  96   2.6s [nar] He simply had no interest in them.
 [S('office', fr='wide', cm='drop', dir=1)],
 #  97   1.4s [nar] Except one.
 [S('office', fr='waist', cm='orbit', dir=-1)],
 #  98   2.3s [nar] Allie sat two cubicles down.
 [S('allie', fr='wide', aexpr='smile', cm='pan', dir=1)],
 #  99   4.8s [nar] Big smile, loud laugh, always talking about her weekend.
 [S('allie', fr='waist', aexpr='smile', cm='tilt', dir=-1), S('allie', fr='bust', aexpr='smile', cm='arc', dir=1, alt=1)],
 # 100   4.5s [nar] Every morning Jack stopped at her desk on his way past.
 [S('allie', fr='wide', aexpr='smile', cm='push', dir=1), S('allie', fr='waist', aexpr='smile', cm='pull', dir=-1, alt=1)],
 # 101   2.3s [nar] The first chats were one minute.
 [S('allie', fr='waist', aexpr='smile', cm='truck', dir=-1)],
 # 102   1.4s [nar] Then two minutes.
 [S('allie', fr='waist', aexpr='smile', cm='crane', dir=1)],
 # 103   4.6s [nar] Lately they were long enough that he had to hurry to his chair.
 [S('allie', fr='wide', aexpr='smile', cm='vertigo', dir=-1), S('office', fr='waist', cm='crane', dir=1)],
 # 104   2.0s [nar] He could not believe his luck.
 [S('allie', fr='bust', aexpr='smile', cm='arc', dir=1)],
 # 105   1.8s [nar] She seemed to like him.
 [S('allie', fr='waist', aexpr='smile', cm='pull', dir=-1)],
 # 106  11.1s [nar] That morning they talked about her wild night out, and he laughed in the right places,
 [S('allie', fr='wide', aexpr='smile', cm='drop', dir=1), S('allie', fr='waist', aexpr='smile', cm='pull', dir=-1), S('allie', fr='waist', aexpr='smile', cm='truck', dir=-1, alt=1), S('allie', fr='detail', aexpr='smile', cm='push', dir=1, alt=2)],
 # 107   7.3s [nar] Out came James Bentley, the boss of them both, limping badly, holding the wall.
 [S('liftout', fr='wide', cm='orbit', dir=-1), S('liftout', fr='waist', cm='drop', dir=1), S('liftout', fr='waist', cm='crane', dir=1, alt=1)],
 # 108   1.2s [james] 'My foot,'
 [S('liftout', fr='bust', cm='pan', dir=1)],
 # 109   3.5s [nar] he was saying, loud enough for the whole floor.
 [S('liftout', fr='wide', cm='tilt', dir=-1)],
 # 110   1.5s [nar] 'My damn foot.'
 [S('liftout', fr='bust', cm='push', dir=1)],
 # 111   5.0s [nar] People came out of their cubicles, asking him what had happened.
 [S('office', fr='wide', crowd=True, cm='truck', dir=-1), S('office', fr='waist', crowd=True, cm='drop', dir=1, alt=1)],
 # 112   5.3s [james] 'That plant. The one downstairs by the lift. I walked straight into it and twisted my 
 [S('liftout', fr='waist', cm='crane', dir=1), S('lobby', fr='detail', out=1, cm='truck', dir=-1)],
 # 113   2.6s [nar] Jack felt the floor move under him.
 [S('office', fr='bust', expr='fear', cm='vertigo', dir=-1)],
 # 114   3.7s [allie] 'James, you can hardly walk. You should go to the hospital.'
 [S('allie', fr='waist', aexpr='smile', jexpr='shock', cm='arc', dir=1)],
 # 115   4.8s [james] 'I have meetings all day. Too important to cancel. I will just have to live with it.'
 [S('liftout', fr='waist', cm='pull', dir=-1), S('liftout', fr='bust', cm='push', dir=1, alt=1)],
 # 116   4.0s [nar] Jack walked away from Allie in the middle of a sentence.
 [S('allie', fr='wide', aexpr='smile', jexpr='shock', cm='drop', dir=1)],
 # 117   4.4s [nar] He sat down in his chair and stared at his screen.
 [S('office', fr='waist', expr='fear', cm='orbit', dir=-1), S('office', fr='bust', expr='fear', cm='crane', dir=1, alt=1)],
 # 118   1.4s [nar] It was his fault.
 [S('office', fr='bust', expr='fear', cm='pan', dir=1)],
 # 119   1.3s [nar] He had done that.
 [S('office', fr='bust', expr='fear', cm='tilt', dir=-1)],
 # 120   3.8s [nar] He had moved a plant three inches and hurt a man.
 [S('lobby', fr='detail', out=1, jack=False, cm='push', dir=1)],
 # 121   2.5s [nar] Then he told himself to be calm.
 [S('office', fr='waist', expr='fear', cm='truck', dir=-1)],
 # 122   2.1s [nar] A twisted ankle heals.
 [S('office', fr='bust', expr='fear', cm='crane', dir=1)],
 # 123   3.2s [nar] In a week it would be a joke in the office.
 [S('office', fr='wide', expr='fear', cm='vertigo', dir=-1)],
 # 124   3.6s [nar] Nothing was broken that could not be fixed.
 [S('office', fr='waist', expr='fear', cm='arc', dir=1)],
 # 125   5.1s [nar] That evening he went straight to his computer and switched it on.
 [S('flat', fr='waist', cm='pull', dir=-1), S('flat', fr='bust', cm='push', dir=1, alt=1)],
 # 126   4.7s [nar] The screen went black before the desktop even appeared.
 [S('screen', txt=['How was your day, Jack?'], cm='drop', dir=1), S('flat', fr='bust', cm='vertigo', dir=-1, alt=1)],
 # 127   2.0s [seer] 'How was your day, Jack?'
 [S('screen', txt=['How was your day, Jack?'], cm='orbit', dir=-1)],
 # 128   1.7s [nar] He did not answer.
 [S('flat', fr='bust', cm='pan', dir=1)],
 # 129  14.4s [seer] 'I already know how your day was. But it is polite to ask. You want to know why James 
 [S('screen', txt=['I already know how your day was.', 'But it is polite to ask. You want', 'to know why James Bentley had to'], cm='tilt', dir=-1), S('flat', fr='waist', txt=['I already know how your day was.', 'But it is polite to ask. You want', 'to know why James Bentley had to'], cm='pan', dir=1), S('flat', fr='bust', txt=['I already know how your day was.', 'But it is polite to ask. You want', 'to know why James Bentley had to'], cm='drop', dir=1, alt=1), S('flat', fr='detail', txt=['I already know how your day was.', 'But it is polite to ask. You want', 'to know why James Bentley had to'], cm='vertigo', dir=-1, alt=2), S('flat', fr='bust', txt=['I already know how your day was.', 'But it is polite to ask. You want', 'to know why James Bentley had to'], cm='arc', dir=1, alt=3)],
 # 130   7.2s [nar] And Jack, sitting alone in the orange street light, felt something he had not expected
 [S('flat', fr='wide', cm='push', dir=1), S('flat', fr='waist', cm='pull', dir=-1, alt=1), S('flat', fr='bust', cm='arc', dir=-1, alt=2)],
 # 131   1.1s [nar] Not fear.
 [S('flat', fr='bust', cm='truck', dir=-1)],
 # 132   1.5s [nar] Curiosity.
 [S('flat', fr='bust', cm='crane', dir=1)],
 # 133   4.4s [nar] The next morning the plant had been pushed back against the wall.
 [S('lobby', fr='detail', out=0, cm='vertigo', dir=-1), S('lobby', fr='close', out=0, cm='pan', dir=1, alt=1)],
 # 134   4.6s [nar] The cleaners had done it in the night, the way cleaners do.
 [S('lobby', fr='wide', out=0, cm='arc', dir=1), S('lobby', fr='waist', out=0, cm='tilt', dir=-1, alt=1)],
 # 135  10.8s [nar] James came in after lunch, hopping on one good foot, still refusing to go to a doctor,
 [S('liftout', fr='wide', cm='pull', dir=-1), S('liftout', fr='waist', cm='arc', dir=1), S('liftout', fr='waist', cm='push', dir=1, alt=1), S('liftout', fr='detail', cm='tilt', dir=-1, alt=2)],
 # 136   5.0s [nar] At three in the afternoon he came limping up to Allie's desk.
 [S('allie', fr='wide', aexpr='smile', james=True, cm='drop', dir=1), S('allie', fr='waist', aexpr='smile', james=True, cm='truck', dir=-1, alt=1)],
 # 137   2.9s [james] 'Allie, you are not busy right now, are you?'
 [S('allie', fr='waist', aexpr='smile', james=True, cm='orbit', dir=-1)],
 # 138   2.4s [allie] 'Nothing that cannot wait until tomorrow.'
 [S('allie', fr='bust', aexpr='smile', james=True, cm='pan', dir=1)],
 # 139   6.3s [james] 'Could you drive me to my doctor? I should have gone yesterday. I can barely press the
 [S('allie', fr='waist', aexpr='smile', james=True, cm='tilt', dir=-1), S('allie', fr='bust', aexpr='smile', james=True, cm='arc', dir=1, alt=1)],
 # 140   2.3s [allie] 'Of course. No problem at all.'
 [S('allie', fr='bust', aexpr='smile', james=True, cm='push', dir=1)],
 # 141   1.5s [nar] She put on her coat.
 [S('allie', fr='waist', aexpr='smile', james=True, cm='truck', dir=-1)],
 # 142   5.6s [nar] She turned to Jack, half way down the aisle, and she smiled at him.
 [S('allie', fr='bust', aexpr='smile', cm='crane', dir=1), S('office', fr='waist', cm='truck', dir=-1)],
 # 143   2.0s [allie] 'See you tomorrow, Jackie.'
 [S('allie', fr='bust', aexpr='smile', cm='vertigo', dir=-1)],
 # 144   3.5s [nar] That was the last thing she ever said to him.
 [S('allie', fr='wide', aexpr='smile', cm='arc', dir=1)],
 # 145   3.3s [nar] The office felt emptier after she left.
 [S('office', fr='wide', expr='sad', cm='pull', dir=-1)],
 # 146   3.7s [nar] Jack went back to his screen and tried to work.
 [S('office', fr='waist', expr='sad', cm='drop', dir=1)],
 # 147   2.8s [nar] Ten minutes later they all heard it.
 [S('office', fr='wide', expr='sad', cm='orbit', dir=-1)],
 # 148   2.7s [nar] A truck horn, long and flat.
 [S('crash', fr='wide', dir=1)],
 # 149   1.2s [nar] Then brakes.
 [S('crash', fr='wide', dir=-1)],
 # 150   3.4s [nar] Then a sound like a wall falling over.
 [S('crash', fr='wide', dir=1)],
 # 151   4.6s [nar] The whole floor stood up at once and ran to the windows.
 [S('office', fr='wide', crowd=True, cm='truck', dir=-1), S('window7', fr='wide', cm='push', dir=1)],
 # 152   7.0s [nar] Seven floors down, at the junction, a lorry had stopped across both lanes.
 [S('window7', fr='wide', cm='crane', dir=1), S('window7', fr='waist', cm='orbit', dir=-1, alt=1), S('window7', fr='bust', cm='drop', dir=-1, alt=2)],
 # 153   4.9s [nar] In front of it there was a car that no longer looked like a car.
 [S('window7', fr='waist', cm='vertigo', dir=-1), S('crash', fr='wide', dir=1)],
 # 154   3.6s [nar] Somebody asked whether that was James' car.
 [S('window7', fr='waist', cm='arc', dir=1)],
 # 155   3.6s [nar] Somebody else said it was too smashed to tell.
 [S('window7', fr='wide', cm='pull', dir=-1)],
 # 156   1.1s [nar] Jack knew.
 [S('office', fr='bust', expr='fear', cm='drop', dir=1)],
 # 157   3.4s [nar] He knew before anyone said another word.
 [S('office', fr='bust', expr='fear', cm='orbit', dir=-1)],
 # 158   1.1s [nar] He ran.
 [S('office', fr='wide', expr='fear', cm='pan', dir=1)],
 # 159   3.2s [nar] He did not wait for the lift to come back.
 [S('lobby', fr='wide', out=0, people=4, cm='tilt', dir=-1)],
 # 160   5.1s [nar] He pushed in with four other people and watched the numbers fall.
 [S('lobby', fr='waist', out=0, people=4, cm='push', dir=1), S('lobby', fr='bust', out=0, people=4, cm='pull', dir=-1, alt=1)],
 # 161  14.7s [nar] On the street there was broken glass across the road, and a crowd already standing in 
 [S('crash', fr='wide', jack=True, dir=-1), S('crash', fr='waist', jack=True, dir=1, cm='drop', alt=1), S('crash', fr='bust', jack=True, dir=1, cm='pull', alt=2), S('crash', fr='detail', jack=True, dir=1, cm='arc', alt=3), S('crash', fr='close', jack=True, dir=1, cm='vertigo', alt=1)],
 # 162   3.8s [nar] He could hear sirens somewhere behind the buildings.
 [S('crash', fr='wide', jack=True, dir=1)],
 # 163   3.7s [nar] The lorry had hit the car on the driver's side.
 [S('crash', fr='waist', jack=True, cm='vertigo', dir=-1)],
 # 164   3.8s [nar] The driver's side was where Allie had been sitting.
 [S('crash', fr='waist', jack=True, cm='arc', dir=1)],
 # 165   4.1s [nar] I am not going to describe what the people in that crowd saw.
 [S('crash', fr='wide', jack=True, dir=-1), S('crash', fr='waist', jack=True, dir=1, cm='push', alt=1)],
 # 166   7.7s [nar] Allie died there, in the street, ten minutes after she smiled at him and called him Ja
 [S('crash', fr='wide', jack=True, dir=1), S('allie', fr='bust', aexpr='smile', jack=False, cm='pull', dir=-1), S('crash', fr='waist', jack=True, dir=-1, cm='truck', alt=1)],
 # 167   1.3s [nar] James lived.
 [S('crash', fr='waist', jack=True, cm='orbit', dir=-1)],
 # 168   8.7s [nar] He was carried away in an ambulance, deep in a coma, and the doctors would not promise
 [S('crash', fr='wide', jack=True, dir=1), S('crash', fr='waist', jack=True, dir=-1, cm='vertigo', alt=1), S('crash', fr='bust', jack=True, dir=-1, cm='crane', alt=2)],
 # 169   2.6s [nar] Jack did not go back into the building.
 [S('tower', fr='wide', cm='tilt', dir=-1)],
 # 170   5.3s [nar] He walked to his car with his hands shaking and he drove home.
 [S('tower', fr='waist', cm='push', dir=1), S('lobby', fr='wide', out=0, cm='orbit', dir=-1, alt=1)],
 # 171   5.9s [nar] He stood in front of his computer for a long time without turning it on.
 [S('flat', fr='waist', off=True, cm='truck', dir=-1), S('flat', fr='bust', off=True, cm='drop', dir=1, alt=1)],
 # 172   2.3s [nar] He was afraid of what it would say.
 [S('flat', fr='bust', expr='fear', cm='crane', dir=1)],
 # 173   3.8s [nar] He was more afraid that it would say nothing at all.
 [S('flat', fr='bust', expr='fear', cm='vertigo', dir=-1)],
 # 174   1.9s [nar] Then he pressed the button.
 [S('flat', fr='detail', expr='fear', cm='arc', dir=1)],
 # 175   7.4s [seer] 'No Jack. It is not your fault. I know you are blaming yourself. But everyone dies. So
 [S('screen', txt=['No Jack. It is not your fault. I', 'know you are blaming yourself. But', 'everyone dies. Some of them simply'], cm='pull', dir=-1), S('flat', fr='waist', txt=['No Jack. It is not your fault. I', 'know you are blaming yourself. But', 'everyone dies. Some of them simply'], expr='fear', cm='arc', dir=1), S('flat', fr='bust', txt=['No Jack. It is not your fault. I', 'know you are blaming yourself. But', 'everyone dies. Some of them simply'], expr='fear', cm='crane', dir=1, alt=1)],
 # 176   3.1s [nar] He wanted to throw the screen on the floor.
 [S('flat', fr='bust', expr='fear', cm='drop', dir=1)],
 # 177   3.5s [nar] He held on to the edge of the desk instead.
 [S('flat', fr='detail', expr='fear', cm='orbit', dir=-1)],
 # 178  11.6s [seer] 'Jack, I am going to tell you something, and I want you to think about it properly. Yo
 [S('screen', txt=['Jack, I am going to tell you', 'something, and I want you to think', 'about it properly. You believed'], cm='pan', dir=1), S('flat', fr='waist', txt=['Jack, I am going to tell you', 'something, and I want you to think', 'about it properly. You believed'], cm='orbit', dir=-1), S('flat', fr='bust', txt=['Jack, I am going to tell you', 'something, and I want you to think', 'about it properly. You believed'], cm='pull', dir=-1, alt=1), S('flat', fr='detail', txt=['Jack, I am going to tell you', 'something, and I want you to think', 'about it properly. You believed'], cm='crane', dir=1, alt=2)],
 # 179  10.2s [seer] 'She was not the one for you. She would have made your life small and bitter. Yes, you
 [S('screen', txt=['She was not the one for you. She', 'would have made your life small', 'and bitter. Yes, you would have'], cm='tilt', dir=-1), S('allie', fr='wide', aexpr='smile', jack=False, cm='pan', dir=1), S('flat', fr='bust', txt=['She was not the one for you. She', 'would have made your life small', 'and bitter. Yes, you would have'], cm='drop', dir=1, alt=1), S('allie', fr='bust', aexpr='smile', jack=False, cm='vertigo', dir=-1, alt=2)],
 # 180   4.5s [seer] 'Think about the things she told you herself. Why did her last boyfriend leave her?'
 [S('screen', txt=['Think about the things she told', 'you herself. Why did her last', 'boyfriend leave her?'], cm='push', dir=1), S('flat', fr='bust', txt=['Think about the things she told', 'you herself. Why did her last', 'boyfriend leave her?'], cm='orbit', dir=-1, alt=1)],
 # 181   6.0s [nar] Jack answered out loud, to an empty room, in a very quiet voice.
 [S('flat', fr='bust', expr='sad', cm='truck', dir=-1), S('flat', fr='detail', expr='sad', cm='drop', dir=1, alt=1)],
 # 182   1.8s [jack] 'Because she cheated on him.'
 [S('flat', fr='bust', expr='sad', cm='crane', dir=1)],
 # 183  12.0s [seer] 'Because she cheated on him, Jack. And she would have done the same to you. Two happy 
 [S('screen', txt=['Because she cheated on him, Jack.', 'And she would have done the same', 'to you. Two happy months. Four'], cm='vertigo', dir=-1), S('flat', fr='bust', txt=['Because she cheated on him, Jack.', 'And she would have done the same', 'to you. Two happy months. Four'], expr='sad', cm='push', dir=1, alt=1), S('upstairs', fr='bust', txt=['Because she cheated on him, Jack.', 'And she would have done the same', 'to you. Two happy months. Four'], lamp=0.45, cm='tilt', dir=-1, alt=2), S('flat', fr='bust', txt=['Because she cheated on him, Jack.', 'And she would have done the same', 'to you. Two happy months. Four'], expr='sad', cm='pan', dir=1, alt=3)],
 # 184  10.6s [seer] 'This is true. I see every possibility, the ones that happen and the ones that do not.
 [S('seer', fr='wide', cm='arc', dir=1), S('screen', txt=['This is true. I see every', 'possibility, the ones that happen', 'and the ones that do not. You saw'], cm='vertigo', dir=-1), S('seer', fr='waist', cm='tilt', dir=-1, alt=1), S('upstairs', fr='bust', txt=['This is true. I see every', 'possibility, the ones that happen', 'and the ones that do not. You saw'], lamp=0.45, cm='push', dir=1, alt=2)],
 # 185   3.0s [seer] 'One more thing, Jack. This is still not finished.'
 [S('screen', txt=['One more thing, Jack. This is', 'still not finished.'], cm='pull', dir=-1)],
 # 186   2.0s [nar] Jack screamed at the screen.
 [S('flat', fr='bust', expr='fear', tremble=0.5, cm='drop', dir=1)],
 # 187   8.9s [nar] He picked up the monitor with both hands and threw it on the floor, where it sparked o
 [S('flat', fr='waist', off=True, expr='fear', tremble=0.5, cm='orbit', dir=-1), S('flat', fr='detail', off=True, expr='fear', tremble=0.5, cm='drop', dir=1), S('flat', fr='bust', off=True, expr='fear', tremble=0.5, cm='crane', dir=1, alt=1)],
 # 188   1.4s [nar] He hardly slept.
 [S('flat', fr='wide', expr='fear', tremble=0.5, cm='pan', dir=1)],
 # 189  11.2s [nar] In the morning he did not want to go to work, but the last words on that screen had ho
 [S('flat', fr='waist', cm='tilt', dir=-1), S('tower', fr='wide', cm='pan', dir=1), S('flat', fr='bust', cm='arc', dir=1, alt=1), S('office', fr='wide', cm='pull', dir=-1, alt=2)],
 # 190   1.9s [nar] Nobody worked that day.
 [S('office', fr='wide', crowd=True, cm='push', dir=1)],
 # 191   2.6s [nar] The company brought in counsellors.
 [S('office', fr='wide', crowd=True, cm='truck', dir=-1)],
 # 192   8.6s [nar] People sat in meeting rooms and cried and hugged each other, and Jack sat among them a
 [S('office', fr='wide', crowd=True, cm='crane', dir=1), S('office', fr='bust', crowd=True, cm='truck', dir=-1), S('office', fr='waist', crowd=True, cm='orbit', dir=-1, alt=1)],
 # 193   7.3s [nar] In the afternoon Diego Salbara, the head of the division, came and found him.
 [S('office', fr='waist', crowd=True, cm='vertigo', dir=-1), S('office', fr='bust', crowd=True, cm='pan', dir=1, alt=1), S('office', fr='detail', crowd=True, cm='orbit', dir=1, alt=2)],
 # 194   2.2s [nar] Diego was a direct man.
 [S('office', fr='bust', crowd=True, cm='arc', dir=1)],
 # 195   2.3s [nar] He did not soften anything.
 [S('office', fr='bust', crowd=True, cm='pull', dir=-1)],
 # 196   9.6s [diego] 'I am offering you James' position. Temporary, officially. But James will not be back 
 [S('office', fr='waist', crowd=True, cm='drop', dir=1), S('office', fr='bust', crowd=True, cm='truck', dir=-1, alt=1), S('office', fr='detail', crowd=True, cm='push', dir=-1, alt=2), S('office', fr='close', crowd=True, cm='tilt', dir=-1, alt=3)],
 # 197   1.7s [nar] Jack stared at him.
 [S('office', fr='bust', crowd=True, expr='sad', cm='orbit', dir=-1)],
 # 198  12.0s [diego] 'Keep it quiet for now. I know how it looks, two days after. But the Lancaster project
 [S('office', fr='waist', crowd=True, expr='sad', cm='pan', dir=1), S('office', fr='bust', crowd=True, expr='sad', cm='vertigo', dir=-1, alt=1), S('office', fr='detail', crowd=True, expr='sad', cm='crane', dir=-1, alt=2), S('office', fr='close', crowd=True, expr='sad', cm='truck', dir=-1, alt=3)],
 # 199   1.4s [nar] Jack said yes.
 [S('office', fr='bust', crowd=True, expr='sad', cm='tilt', dir=-1)],
 # 200   2.6s [nar] He did not even decide to say it.
 [S('office', fr='bust', crowd=True, expr='sad', cm='push', dir=1)],
 # 201   1.7s [nar] It simply came out.
 [S('office', fr='waist', crowd=True, expr='sad', cm='truck', dir=-1)],
 # 202  12.0s [nar] On the way home he stopped at an electronics shop under cold white lights and bought a
 [S('shop', fr='wide', kind='tech', man=False, cm='crane', dir=1), S('shop', fr='waist', kind='tech', man=False, cm='orbit', dir=-1, alt=1), S('shop', fr='bust', kind='tech', man=False, cm='drop', dir=-1, alt=2), S('shop', fr='detail', kind='tech', man=False, cm='pull', dir=-1, alt=3)],
 # 203   1.5s [nar] He plugged it in.
 [S('flat', fr='detail', cm='vertigo', dir=-1)],
 # 204   1.3s [nar] He sat down.
 [S('flat', fr='waist', cm='arc', dir=1)],
 # 205   3.0s [nar] The red letters were already waiting.
 [S('screen', txt=['Jack. I want to be the first to', 'congratulate you. I am proud of', 'what you have done.'], cm='pull', dir=-1)],
 # 206   4.8s [seer] 'Jack. I want to be the first to congratulate you. I am proud of what you have done.'
 [S('screen', txt=['Jack. I want to be the first to', 'congratulate you. I am proud of', 'what you have done.'], cm='drop', dir=1), S('flat', fr='bust', txt=['Jack. I want to be the first to', 'congratulate you. I am proud of', 'what you have done.'], cm='vertigo', dir=-1, alt=1)],
 # 207   4.9s [nar] He put his hands flat on the desk and made himself breathe.
 [S('flat', fr='detail', cm='orbit', dir=-1), S('flat', fr='close', cm='crane', dir=1, alt=1)],
 # 208   8.0s [seer] 'Forgive me, I have not introduced myself. I am called the Seer. I see what will be, a
 [S('seer', fr='wide', cm='pan', dir=1), S('screen', txt=['Forgive me, I have not introduced', 'myself. I am called the Seer. I', 'see what will be, and I see what'], cm='orbit', dir=-1), S('seer', fr='waist', cm='vertigo', dir=-1, alt=1)],
 # 209  10.3s [seer] 'But for all of it, I can touch nothing. I can predict. I can watch. With great effort
 [S('seer', fr='waist', cm='tilt', dir=-1), S('screen', txt=['But for all of it, I can touch', 'nothing. I can predict. I can', 'watch. With great effort, I can'], cm='pan', dir=1), S('seer', fr='bust', cm='arc', dir=1, alt=1), S('upstairs', fr='bust', txt=['But for all of it, I can touch', 'nothing. I can predict. I can', 'watch. With great effort, I can'], lamp=0.45, cm='pull', dir=-1, alt=2)],
 # 210   6.1s [seer] 'That is why I need you. I am an artist. My art is people. You will be my brush, Jack,
 [S('gallery', face=0, cm='push', dir=1), S('seer', fr='wide', cm='tilt', dir=-1)],
 # 211  11.3s [nar] And Jack, who had no friends and no enemies and nobody at all, read that word, needed,
 [S('flat', fr='bust', cm='truck', dir=-1), S('screen', txt=['That is why I need you. I am an', 'artist. My art is people. You will', 'be my brush, Jack, and my canvas.'], cm='push', dir=1), S('flat', fr='detail', cm='drop', dir=1, alt=1), S('upstairs', fr='bust', lamp=0.45, cm='orbit', dir=-1, alt=2)],
 # 212   8.8s [seer] 'Before you answer, two things. First, I will never lie to you. Second, I will never a
 [S('screen', txt=['Before you answer, two things.', 'First, I will never lie to you.', 'Second, I will never ask you to do'], cm='crane', dir=1), S('flat', fr='bust', txt=['Before you answer, two things.', 'First, I will never lie to you.', 'Second, I will never ask you to do'], cm='tilt', dir=-1, alt=1), S('upstairs', fr='bust', txt=['Before you answer, two things.', 'First, I will never lie to you.', 'Second, I will never ask you to do'], lamp=0.45, cm='pan', dir=1, alt=2)],
 # 213   8.8s [seer] 'Bad things will come of it. People will die. But they were going to die anyway, were 
 [S('screen', txt=['Bad things will come of it. People', 'will die. But they were going to', 'die anyway, were they not? And'], cm='vertigo', dir=-1), S('seer', fr='wide', cm='crane', dir=1), S('flat', fr='bust', txt=['Bad things will come of it. People', 'will die. But they were going to', 'die anyway, were they not? And'], cm='push', dir=1, alt=1)],
 # 214   1.6s [nar] He thought about that.
 [S('flat', fr='bust', cm='arc', dir=1)],
 # 215   6.9s [nar] He hated it, and it still sounded reasonable, and that was the frightening part.
 [S('flat', fr='waist', cm='pull', dir=-1), S('flat', fr='bust', cm='push', dir=1, alt=1), S('flat', fr='detail', cm='tilt', dir=1, alt=2)],
 # 216   2.3s [nar] The Seer had not lied to him.
 [S('seer', fr='wide', cm='drop', dir=1)],
 # 217   3.0s [nar] It had simply not told him everything.
 [S('seerTags', cm='orbit', dir=-1)],
 # 218   3.6s [nar] He noticed the difference, and he let it pass.
 [S('flat', fr='bust', cm='pan', dir=1)],
 # 219  10.5s [seer] 'Work with me, Jack. Small tasks, from time to time. Little things with enormous resul
 [S('screen', txt=['Work with me, Jack. Small tasks,', 'from time to time. Little things', 'with enormous results. That is my'], cm='tilt', dir=-1), S('flat', fr='bust', txt=['Work with me, Jack. Small tasks,', 'from time to time. Little things', 'with enormous results. That is my'], cm='drop', dir=1, alt=1), S('upstairs', fr='bust', txt=['Work with me, Jack. Small tasks,', 'from time to time. Little things', 'with enormous results. That is my'], lamp=0.45, cm='pull', dir=-1, alt=2), S('flat', fr='bust', txt=['Work with me, Jack. Small tasks,', 'from time to time. Little things', 'with enormous results. That is my'], cm='arc', dir=1, alt=3)],
 # 220  10.8s [seer] 'One last thing, because I can see you struggling. If I stopped speaking to you now, i
 [S('screen', txt=['One last thing, because I can see', 'you struggling. If I stopped', 'speaking to you now, it would take'], cm='push', dir=1), S('flat', fr='bust', txt=['One last thing, because I can see', 'you struggling. If I stopped', 'speaking to you now, it would take'], cm='orbit', dir=-1, alt=1), S('upstairs', fr='bust', txt=['One last thing, because I can see', 'you struggling. If I stopped', 'speaking to you now, it would take'], lamp=0.45, cm='drop', dir=1, alt=2), S('flat', fr='bust', txt=['One last thing, because I can see', 'you struggling. If I stopped', 'speaking to you now, it would take'], cm='pull', dir=-1, alt=3)],
 # 221   5.2s [seer] 'Let us begin. And when all of this is over, you are going to thank me. I promise you 
 [S('screen', txt=['Let us begin. And when all of this', 'is over, you are going to thank', 'me. I promise you that.'], cm='truck', dir=-1), S('seer', fr='wide', cm='push', dir=1)],
 # 222   3.3s [nar] Jack sat in the glow of the new monitor.
 [S('flat', fr='waist', cm='crane', dir=1)],
 # 223   6.3s [nar] Then, for the first time, he put his fingers on the keys and typed an answer.
 [S('flat', fr='detail', cm='vertigo', dir=-1), S('flat', fr='close', cm='pan', dir=1, alt=1)],
 # 224   2.0s [jack] 'What do you want me to do next?'
 [S('screen', txt=['What do you want me to do next?'], typed=0.9, cm='arc', dir=1)],
 # 225   4.6s [nar] After that, Jack did every favour he was asked to do.
 [S('flat', fr='waist', cm='pull', dir=-1), S('screen', txt=['What do you want me to do next?'], cm='arc', dir=1)],
 # 226   2.8s [nar] One a month, more or less, for years.
 [S('flat', fr='wide', cm='drop', dir=1)],
 # 227   6.9s [nar] The tasks were always small, always strange, and never once against the law.
 [S('screen', txt=['What do you want me to do next?'], cm='orbit', dir=-1), S('flat', fr='bust', cm='arc', dir=1, alt=1), S('upstairs', fr='bust', lamp=0.45, cm='vertigo', dir=-1, alt=2)],
 # 228   3.4s [nar] Stand on a certain corner at a certain minute.
 [S('tower', fr='wide', cm='pan', dir=1)],
 # 229   4.0s [nar] Post a letter on a Thursday instead of a Wednesday.
 [S('tower', fr='waist', cm='tilt', dir=-1)],
 # 230   3.5s [nar] Let a stranger go in front of you at a till.
 [S('shop', fr='wide', kind='booze', man=True, cm='push', dir=1)],
 # 231   3.7s [nar] And every time, the Seer kept its promise.
 [S('seer', fr='wide', cm='truck', dir=-1)],
 # 232   5.5s [nar] Something good came back to Jack, in ways he could never have guessed.
 [S('flat', fr='waist', cm='crane', dir=1), S('flat', fr='bust', cm='orbit', dir=-1, alt=1)],
 # 233   5.6s [nar] About two years in, there was one he remembered for the rest of his life.
 [S('flat', fr='bust', cm='vertigo', dir=-1), S('flat', fr='detail', cm='pan', dir=1, alt=1)],
 # 234   9.2s [seer] 'Go into town tomorrow. Enter Garmin's off licence at twelve thirty seven exactly. A m
 [S('screen', txt=['Go into town tomorrow. Enter', "Garmin's off licence at twelve", 'thirty seven exactly. A man will'], cm='arc', dir=1), S('shop', fr='wide', kind='booze', man=True, cm='vertigo', dir=-1), S('flat', fr='bust', txt=['Go into town tomorrow. Enter', "Garmin's off licence at twelve", 'thirty seven exactly. A man will'], cm='truck', dir=-1, alt=1)],
 # 235   4.3s [nar] The next day Jack walked in at exactly that minute.
 [S('shop', fr='wide', kind='booze', man=True, cm='pull', dir=-1), S('shop', fr='waist', kind='booze', man=True, cm='push', dir=1, alt=1)],
 # 236   8.7s [nar] At the counter there was a big man in work clothes, filling in a lottery slip with a s
 [S('shop', fr='detail', kind='booze', man=True, mpose='reach', cm='drop', dir=1), S('shop', fr='close', kind='booze', man=True, mpose='reach', cm='truck', dir=-1, alt=1), S('shop', fr='wide', kind='booze', man=True, mpose='reach', cm='push', dir=-1, alt=2)],
 # 237   5.9s [man] 'My birthday, that is the fifteenth. Wife's birthday, the twenty fourth. Kids are two,
 [S('shop', fr='waist', kind='booze', man=True, mpose='reach', cm='orbit', dir=-1), S('shop', fr='bust', kind='booze', man=True, mpose='reach', cm='crane', dir=1, alt=1)],
 # 238   6.6s [nar] He scratched his head and looked round the shop, and his eyes landed on Jack.
 [S('shop', fr='waist', kind='booze', man=True, cm='pan', dir=1), S('shop', fr='bust', kind='booze', man=True, cm='vertigo', dir=-1, alt=1)],
 # 239   3.2s [man] 'Hey, mate. I need one more number. Got one for me?'
 [S('shop', fr='bust', kind='booze', man=True, cm='tilt', dir=-1)],
 # 240   1.4s [nar] Jack smiled.
 [S('shop', fr='bust', kind='booze', man=True, jexpr='smile', cm='push', dir=1)],
 # 241   1.3s [jack] 'Twenty seven.'
 [S('shop', fr='bust', kind='booze', man=True, jexpr='smile', cm='truck', dir=-1)],
 # 242   5.9s [man] 'Twenty seven? I was going to put thirty five. But you know what, I like your face. Tw
 [S('shop', fr='waist', kind='booze', man=True, jexpr='smile', cm='crane', dir=1), S('shop', fr='bust', kind='booze', man=True, jexpr='smile', cm='orbit', dir=-1, alt=1)],
 # 243   6.3s [nar] He paid for his ticket, patted Jack on the shoulder, and walked out whistling.
 [S('shop', fr='wide', kind='booze', man=True, jexpr='smile', cm='vertigo', dir=-1), S('shop', fr='waist', kind='booze', man=True, jexpr='smile', cm='pan', dir=1, alt=1)],
 # 244   4.7s [nar] Jack tried not to think about what he had just done to that man.
 [S('shop', fr='bust', kind='booze', man=True, jexpr='sad', cm='arc', dir=1), S('shop', fr='detail', kind='booze', man=True, jexpr='sad', cm='tilt', dir=-1, alt=1)],
 # 245   8.1s [nar] Two weeks later he met him again, in a supermarket, and the man looked like a million 
 [S('shop', fr='wide', kind='food', man=True, rich=True, cm='pull', dir=-1), S('shop', fr='waist', kind='food', man=True, rich=True, cm='push', dir=1, alt=1), S('shop', fr='bust', kind='food', man=True, rich=True, cm='tilt', dir=1, alt=2)],
 # 246   6.7s [nar] New coat, new boots, a gold watch, and a smile that took up half his face.
 [S('shop', fr='detail', kind='food', man=True, rich=True, cm='drop', dir=1), S('shop', fr='close', kind='food', man=True, rich=True, cm='truck', dir=-1, alt=1)],
 # 247   4.3s [man] 'It is you! I won, mate. I won. I would never have won without you.'
 [S('shop', fr='waist', kind='food', man=True, rich=True, jexpr='smile', cm='orbit', dir=-1), S('shop', fr='bust', kind='food', man=True, rich=True, jexpr='smile', cm='crane', dir=1, alt=1)],
 # 248   2.3s [nar] He tried to pay for Jack's shopping.
 [S('shop', fr='waist', kind='food', man=True, rich=True, jexpr='smile', cm='pan', dir=1)],
 # 249  11.3s [nar] Then he decided shopping was not enough, took out a chequebook, leaned it on a freezer
 [S('shop', fr='detail', kind='food', man=True, rich=True, jexpr='smile', cm='tilt', dir=-1), S('shop', fr='close', kind='food', man=True, rich=True, jexpr='smile', cm='arc', dir=1, alt=1), S('shop', fr='wide', kind='food', man=True, rich=True, jexpr='smile', cm='vertigo', dir=1, alt=2), S('shop', fr='waist', kind='food', man=True, rich=True, jexpr='smile', cm='crane', dir=1, alt=3)],
 # 250   4.1s [man] 'For my lucky charm. My mum always said, treat people right.'
 [S('shop', fr='bust', kind='food', man=True, rich=True, jexpr='smile', cm='push', dir=1), S('shop', fr='detail', kind='food', man=True, rich=True, jexpr='smile', cm='pull', dir=-1, alt=1)],
 # 251   6.2s [nar] Jack drove home with that cheque on the passenger seat, and he felt something new.
 [S('flat', fr='waist', expr='sad', cm='truck', dir=-1), S('flat', fr='bust', expr='sad', cm='drop', dir=1, alt=1)],
 # 252   1.5s [nar] He felt good.
 [S('flat', fr='bust', expr='sad', cm='crane', dir=1)],
 # 253   3.1s [jack] 'We have never helped anybody before. Why now?'
 [S('flat', fr='waist', cm='vertigo', dir=-1), S('screen', txt=['We have never helped anybody', 'before. Why now?'], typed=0.9, cm='crane', dir=1)],
 # 254   2.2s [seer] 'Oh Jack. We have not helped him.'
 [S('screen', txt=['Oh Jack. We have not helped him.'], cm='arc', dir=1)],
 # 255  11.4s [seer] 'That man will lose every penny inside two years. You saw him. He gives money away. Ol
 [S('screen', txt=['That man will lose every penny', 'inside two years. You saw him. He', 'gives money away. Old friends will'], cm='pull', dir=-1), S('shop', fr='wide', kind='booze', man=True, cm='arc', dir=1), S('flat', fr='bust', txt=['That man will lose every penny', 'inside two years. You saw him. He', 'gives money away. Old friends will'], cm='crane', dir=1, alt=1), S('shop', fr='bust', kind='booze', man=True, cm='tilt', dir=-1, alt=2)],
 # 256  11.9s [seer] 'The money will go, and the fear of losing it will finish his marriage. His wife will 
 [S('screen', txt=['The money will go, and the fear of', 'losing it will finish his', 'marriage. His wife will take the'], cm='drop', dir=1), S('flat', fr='bust', txt=['The money will go, and the fear of', 'losing it will finish his', 'marriage. His wife will take the'], cm='vertigo', dir=-1, alt=1), S('upstairs', fr='bust', txt=['The money will go, and the fear of', 'losing it will finish his', 'marriage. His wife will take the'], lamp=0.45, cm='crane', dir=1, alt=2), S('flat', fr='bust', txt=['The money will go, and the fear of', 'losing it will finish his', 'marriage. His wife will take the'], cm='truck', dir=-1, alt=3)],
 # 257   4.2s [seer] 'You need not feel bad. It is his own greed that will do it, not you.'
 [S('screen', txt=['You need not feel bad. It is his', 'own greed that will do it, not', 'you.'], cm='orbit', dir=-1), S('flat', fr='bust', txt=['You need not feel bad. It is his', 'own greed that will do it, not', 'you.'], cm='arc', dir=1, alt=1)],
 # 258   2.6s [nar] And that was how it always went.
 [S('flat', fr='waist', cm='pan', dir=1)],
 # 259  13.5s [nar] The Seer explained, and the explanation always made room for Jack, and Jack always had
 [S('seer', fr='wide', cm='tilt', dir=-1), S('screen', txt=['You need not feel bad. It is his', 'own greed that will do it, not', 'you.'], cm='pan', dir=1), S('seer', fr='waist', cm='arc', dir=1, alt=1), S('upstairs', fr='bust', lamp=0.45, cm='pull', dir=-1, alt=2), S('seer', fr='detail', cm='crane', dir=1, alt=3)],
 # 260   2.8s [nar] The tasks never repeated themselves.
 [S('screen', txt=['You need not feel bad. It is his', 'own greed that will do it, not', 'you.'], cm='push', dir=1)],
 # 261   3.4s [nar] Sometimes the result was easy to see.
 [S('flat', fr='waist', cm='truck', dir=-1)],
 # 262   5.8s [nar] Sometimes it was so tangled that Jack could not follow it at all.
 [S('gallery', face=2, cm='crane', dir=1), S('gallery', face=2, cm='tilt', dir=-1, alt=1)],
 # 263   5.0s [seer] 'Go to the county offices. Park in space forty three, at seven minutes to five.'
 [S('screen', txt=['Go to the county offices. Park in', 'space forty three, at seven', 'minutes to five.'], cm='vertigo', dir=-1), S('carpark', fr='wide', jack=True, cm='crane', dir=1)],
 # 264   2.2s [nar] He did it, and nothing happened.
 [S('carpark', fr='wide', jack=True, lights=True, cm='arc', dir=1)],
 # 265   7.8s [nar] Two months later he met a woman called Donna, and sixteen months after that he married
 [S('living', fr='wide', donna=True, jack=True, lamp=0.6, cm='pull', dir=-1), S('living', fr='waist', donna=True, jack=True, lamp=0.6, cm='push', dir=1, alt=1), S('living', fr='bust', donna=True, jack=True, lamp=0.6, cm='tilt', dir=1, alt=2)],
 # 266   4.0s [nar] He would never have connected the two if he had not asked.
 [S('flat', fr='waist', cm='drop', dir=1)],
 # 267  10.1s [seer] 'When you parked in that space, Jack, the woman who would have parked there had to use
 [S('screen', txt=['When you parked in that space,', 'Jack, the woman who would have', 'parked there had to use another'], cm='orbit', dir=-1), S('carpark', fr='wide', jack=True, cm='drop', dir=1), S('flat', fr='bust', txt=['When you parked in that space,', 'Jack, the woman who would have', 'parked there had to use another'], cm='arc', dir=1, alt=1), S('carpark', fr='bust', jack=True, cm='truck', dir=-1, alt=2)],
 # 268   8.1s [seer] 'He left his office eleven minutes late. He missed his train. While he waited for the 
 [S('screen', txt=['He left his office eleven minutes', 'late. He missed his train. While', 'he waited for the next one he was'], cm='pan', dir=1), S('flat', fr='bust', txt=['He left his office eleven minutes', 'late. He missed his train. While', 'he waited for the next one he was'], cm='pull', dir=-1, alt=1), S('upstairs', fr='bust', txt=['He left his office eleven minutes', 'late. He missed his train. While', 'he waited for the next one he was'], lamp=0.45, cm='arc', dir=1, alt=2)],
 # 269  11.8s [seer] 'The men who robbed him took his cards and used them, and I could go on, Jack, but the
 [S('screen', txt=['The men who robbed him took his', 'cards and used them, and I could', 'go on, Jack, but there are another'], cm='tilt', dir=-1), S('gallery', face=0, cm='pan', dir=1), S('flat', fr='bust', txt=['The men who robbed him took his', 'cards and used them, and I could', 'go on, Jack, but there are another'], cm='drop', dir=1, alt=1), S('gallery', face=1, cm='pull', dir=-1, alt=2)],
 # 270  14.6s [nar] Jack read that, and he thought about the man on the platform, and then he looked acros
 [S('flat', fr='waist', cm='push', dir=1), S('living', fr='wide', donna=True, jack=True, lamp=0.6, cm='tilt', dir=-1), S('flat', fr='bust', cm='pull', dir=-1, alt=1), S('living', fr='bust', donna=True, jack=True, lamp=0.6, cm='arc', dir=1, alt=2), S('flat', fr='close', cm='vertigo', dir=-1, alt=3)],
 # 271   4.5s [nar] That is the part people never understand about Jack.
 [S('flat', fr='bust', cm='truck', dir=-1), S('flat', fr='detail', cm='drop', dir=1, alt=1)],
 # 272   1.7s [nar] He was not a monster.
 [S('flat', fr='bust', cm='crane', dir=1)],
 # 273   7.6s [nar] He was a quiet man who had been lonely for thirty one years and was not lonely any mor
 [S('living', fr='wide', donna=True, jack=True, lamp=0.6, cm='vertigo', dir=-1), S('living', fr='waist', donna=True, jack=True, lamp=0.6, cm='pan', dir=1, alt=1), S('living', fr='bust', donna=True, jack=True, lamp=0.6, cm='orbit', dir=1, alt=2)],
 # 274   8.4s [nar] Over the years the Seer told him a little about itself, never very much, always in pie
 [S('seer', fr='wide', cm='arc', dir=1), S('seer', fr='waist', cm='tilt', dir=-1, alt=1), S('seer', fr='bust', cm='pan', dir=-1, alt=2)],
 # 275   6.0s [nar] From the things it mentioned, Jack worked out that it was thousands of years old.
 [S('seer', fr='wide', cm='pull', dir=-1), S('seer', fr='waist', cm='push', dir=1, alt=1)],
 # 276   7.9s [nar] When it was alive it had been a fortune teller and an artist, and it painted what was 
 [S('gallery', face=1, cm='drop', dir=1), S('seer', fr='waist', canvases=3, cm='pull', dir=-1), S('gallery', face=1, cm='vertigo', dir=-1, alt=1)],
 # 277   2.5s [nar] Kings paid for those paintings.
 [S('gallery', face=2, cm='orbit', dir=-1)],
 # 278   6.6s [nar] One king read a painting badly, took his army out, and lost everything.
 [S('gallery', face=3, cm='pan', dir=1), S('gallery', face=3, cm='pull', dir=-1, alt=1)],
 # 279   4.4s [nar] Angry and ashamed, he had the painter executed.
 [S('seerTags', cm='tilt', dir=-1), S('seer', fr='wide', canvases=3, cm='drop', dir=1, alt=1)],
 # 280   2.6s [nar] And then something went wrong with death.
 [S('seer', fr='wide', cm='push', dir=1)],
 # 281  13.9s [nar] With no body, no eyes, no hands, floating in a dark with nothing to look at, the Seer'
 [S('seer', fr='wide', cm='truck', dir=-1), S('seer', fr='bust', cm='push', dir=1), S('seer', fr='waist', cm='drop', dir=1, alt=1), S('seer', fr='close', cm='pull', dir=-1, alt=2), S('seer', fr='detail', cm='arc', dir=1, alt=3)],
 # 282   4.7s [nar] It took a very long time to learn how to speak to the living.
 [S('seer', fr='waist', cm='crane', dir=1), S('seer', fr='bust', cm='orbit', dir=-1, alt=1)],
 # 283   5.0s [nar] When it finally could, it reached out to the ones who would answer.
 [S('seer', fr='wide', cm='vertigo', dir=-1), S('screen', txt=['...'], cm='crane', dir=1)],
 # 284   1.5s [nar] Jack answered.
 [S('screen', txt=['...'], cm='arc', dir=1)],
 # 285  10.8s [nar] In the end it was as close to a friendship as a living man can have with something tha
 [S('seer', fr='wide', cm='pull', dir=-1), S('upstairs', fr='waist', lamp=0.45, cm='arc', dir=1), S('seer', fr='waist', cm='push', dir=1, alt=1), S('upstairs', fr='detail', lamp=0.45, cm='tilt', dir=-1, alt=2)],
 # 286   1.8s [nar] And Jack was grateful.
 [S('upstairs', fr='bust', lamp=0.45, cm='drop', dir=1)],
 # 287   9.7s [nar] He had a good job, a big house in the country, a wife who laughed at his jokes, and pe
 [S('house', fr='wide', cm='orbit', dir=-1), S('living', fr='wide', donna=True, jack=True, lamp=0.6, cm='drop', dir=1), S('house', fr='waist', cm='crane', dir=1, alt=1), S('living', fr='bust', donna=True, jack=True, lamp=0.6, cm='truck', dir=-1, alt=2)],
 # 288   1.3s [nar] He was happy.
 [S('living', fr='bust', donna=True, jack=True, lamp=0.6, cm='pan', dir=1)],
 # 289   2.3s [nar] He had never been happy before.
 [S('living', fr='wide', donna=True, jack=True, lamp=0.6, cm='tilt', dir=-1)],
 # 290   2.3s [nar] Twelve years passed like that.
 [S('house', fr='wide', cm='push', dir=1)],
 # 291   1.5s [nar] Twelve good years.
 [S('house', fr='waist', cm='truck', dir=-1)],
 # 292   7.1s [nar] More than a hundred favours, each one small, each one harmless on its own.
 [S('gallery', face=2, cm='crane', dir=1), S('gallery', face=2, cm='tilt', dir=-1, alt=1), S('gallery', face=4, cm='pan', dir=1, alt=2)],
 # 293   7.3s [nar] It was a Friday evening in the office of his big house, and the red letters came again
 [S('upstairs', fr='wide', txt=['Hello Jack. I have a favour to', 'ask. This one is the easiest of', 'them all. You do not even have to'], lamp=0.45, cm='vertigo', dir=-1), S('screen', txt=['Hello Jack. I have a favour to', 'ask. This one is the easiest of', 'them all. You do not even have to'], crt=False, cm='crane', dir=1), S('upstairs', fr='waist', txt=['Hello Jack. I have a favour to', 'ask. This one is the easiest of', 'them all. You do not even have to'], lamp=0.45, cm='pan', dir=1, alt=1)],
 # 294   6.3s [seer] 'Hello Jack. I have a favour to ask. This one is the easiest of them all. You do not e
 [S('screen', txt=['Hello Jack. I have a favour to', 'ask. This one is the easiest of', 'them all. You do not even have to'], crt=False, cm='arc', dir=1), S('upstairs', fr='bust', txt=['Hello Jack. I have a favour to', 'ask. This one is the easiest of', 'them all. You do not even have to'], lamp=0.45, cm='truck', dir=-1, alt=1)],
 # 295   6.2s [seer] 'In exactly two minutes, call Riago's pizza. Let it ring three times. Then put the pho
 [S('screen', txt=['In exactly two minutes, call', "Riago's pizza. Let it ring three", 'times. Then put the phone down.'], crt=False, cm='pull', dir=-1), S('upstairs', fr='detail', txt=['In exactly two minutes, call', "Riago's pizza. Let it ring three", 'times. Then put the phone down.'], lamp=0.45, cm='arc', dir=1)],
 # 296   1.3s [nar] Jack smiled.
 [S('upstairs', fr='bust', lamp=0.45, cm='drop', dir=1)],
 # 297   3.5s [nar] After twelve years he did not wonder any more.
 [S('upstairs', fr='waist', lamp=0.45, cm='orbit', dir=-1)],
 # 298   5.4s [nar] He waited two minutes, dialled, counted three rings, and hung up.
 [S('upstairs', fr='detail', lamp=0.45, cm='pan', dir=1), S('upstairs', fr='close', lamp=0.45, cm='vertigo', dir=-1, alt=1)],
 # 299   2.7s [nar] Half an hour later the doorbell rang.
 [S('frontdoor', fr='wide', cm='tilt', dir=-1)],
 # 300   1.3s [nar] That was odd.
 [S('living', fr='waist', donna=True, jack=True, pizza=False, lamp=0.6, cm='push', dir=1)],
 # 301   8.3s [nar] Neither of them was expecting anybody out here, at the end of a long road, in the dark
 [S('house', fr='wide', door=0.8, cm='truck', dir=-1), S('house', fr='waist', door=0.8, cm='drop', dir=1, alt=1), S('house', fr='bust', door=0.8, cm='pull', dir=1, alt=2)],
 # 302  11.1s [nar] Jack looked through the little glass in the door and saw a delivery boy holding a flat
 [S('frontdoor', fr='waist', cm='crane', dir=1), S('frontdoor', fr='bust', cm='orbit', dir=-1, alt=1), S('frontdoor', fr='detail', cm='drop', dir=-1, alt=2), S('frontdoor', fr='close', cm='pull', dir=-1, alt=3)],
 # 303   1.7s [nar] He opened the door.
 [S('frontdoor', fr='wide', cm='vertigo', dir=-1)],
 # 304   1.3s [boy] 'Your pizza.'
 [S('frontdoor', fr='bust', cm='arc', dir=1)],
 # 305   3.5s [nar] The boy pushed the box into Jack's hands.
 [S('frontdoor', fr='detail', cm='pull', dir=-1)],
 # 306   1.7s [jack] 'I did not order this.'
 [S('frontdoor', fr='bust', cm='drop', dir=1)],
 # 307   7.1s [boy] 'I do not care whether you ordered it. Mister Riago told me this address, so this is t
 [S('frontdoor', fr='waist', cm='orbit', dir=-1), S('frontdoor', fr='bust', cm='crane', dir=1, alt=1), S('frontdoor', fr='detail', cm='truck', dir=1, alt=2)],
 # 308   8.9s [nar] And Jack, standing in his own doorway with a warm box in his hands, really looked at h
 [S('frontdoor', fr='waist', cm='pan', dir=1), S('frontdoor', fr='bust', cm='vertigo', dir=-1, alt=1), S('frontdoor', fr='detail', cm='crane', dir=-1, alt=2)],
 # 309   2.3s [nar] The boy was about seventeen.
 [S('frontdoor', fr='bust', cm='tilt', dir=-1)],
 # 310   1.4s [nar] And he was enormous.
 [S('frontdoor', fr='wide', cm='push', dir=1)],
 # 311   8.5s [nar] Six and a half feet of him, filling the whole door frame, with shoulders like a man tw
 [S('frontdoor', fr='wide', cm='truck', dir=-1), S('frontdoor', fr='waist', cm='drop', dir=1, alt=1), S('frontdoor', fr='bust', cm='pull', dir=1, alt=2)],
 # 312   3.2s [boy] 'It is paid for. Card. I am not driving it back.'
 [S('frontdoor', fr='bust', cm='crane', dir=1)],
 # 313   2.4s [nar] He put out his hand for a tip.
 [S('frontdoor', fr='detail', cm='vertigo', dir=-1)],
 # 314   2.7s [jack] 'I am sorry. I have no cash in the house.'
 [S('frontdoor', fr='bust', cm='arc', dir=1)],
 # 315   1.6s [boy] 'Of course you do not.'
 [S('frontdoor', fr='bust', cm='pull', dir=-1)],
 # 316   2.5s [nar] The boy did not move for a moment.
 [S('frontdoor', fr='waist', cm='drop', dir=1)],
 # 317   9.4s [nar] He looked past Jack, into the hall, at the warm light and the big rooms and the sound 
 [S('frontdoor', fr='waist', cm='orbit', dir=-1), S('living', fr='wide', donna=False, jack=False, lamp=0.6, cm='drop', dir=1), S('frontdoor', fr='bust', cm='crane', dir=1, alt=1)],
 # 318   8.7s [nar] Then he turned and walked back to his car, slowly, looking over his shoulder twice bef
 [S('frontdoor', fr='wide', cm='pan', dir=1), S('frontdoor', fr='waist', cm='vertigo', dir=-1, alt=1), S('frontdoor', fr='bust', cm='crane', dir=-1, alt=2)],
 # 319   8.5s [nar] Jack shut the door and carried the pizza through to the living room, where Donna was c
 [S('living', fr='wide', donna=True, jack=True, pizza=True, lamp=0.6, cm='tilt', dir=-1), S('living', fr='waist', donna=True, jack=True, pizza=True, lamp=0.6, cm='arc', dir=1, alt=1), S('living', fr='bust', donna=True, jack=True, pizza=True, lamp=0.6, cm='vertigo', dir=1, alt=2)],
 # 320   6.0s [nar] He told her the whole silly story, and she opened the box and laughed.
 [S('living', fr='waist', donna=True, jack=True, pizza=True, lamp=0.6, cm='push', dir=1), S('living', fr='bust', donna=True, jack=True, pizza=True, lamp=0.6, cm='pull', dir=-1, alt=1)],
 # 321   5.5s [donna] 'It has got every single one of your toppings on it. Come back quickly, before I eat i
 [S('living', fr='bust', donna=True, jack=True, pizza=True, lamp=0.6, cm='truck', dir=-1), S('living', fr='detail', donna=True, jack=True, pizza=True, lamp=0.6, cm='drop', dir=1, alt=1)],
 # 322   8.0s [nar] He promised he would be two minutes, and he went upstairs to the office, because he al
 [S('upstairs', fr='wide', lamp=0.45, cm='crane', dir=1), S('upstairs', fr='waist', lamp=0.45, cm='orbit', dir=-1, alt=1), S('upstairs', fr='bust', lamp=0.45, cm='drop', dir=-1, alt=2)],
 # 323  13.4s [seer] 'Confused? Do not be. Your neighbours down the road ordered that pizza. Mister Riago g
 [S('screen', txt=['Confused? Do not be. Your', 'neighbours down the road ordered', 'that pizza. Mister Riago gave the'], crt=False, cm='vertigo', dir=-1), S('upstairs', fr='waist', txt=['Confused? Do not be. Your', 'neighbours down the road ordered', 'that pizza. Mister Riago gave the'], lamp=0.45, cm='crane', dir=1), S('upstairs', fr='bust', txt=['Confused? Do not be. Your', 'neighbours down the road ordered', 'that pizza. Mister Riago gave the'], lamp=0.45, cm='push', dir=1, alt=1), S('upstairs', fr='detail', txt=['Confused? Do not be. Your', 'neighbours down the road ordered', 'that pizza. Mister Riago gave the'], lamp=0.45, cm='orbit', dir=-1, alt=2), S('upstairs', fr='bust', txt=['Confused? Do not be. Your', 'neighbours down the road ordered', 'that pizza. Mister Riago gave the'], lamp=0.45, cm='pan', dir=1, alt=3)],
 # 324   2.0s [jack] 'So my reward is a pizza?'
 [S('upstairs', fr='bust', txt=['So my reward is a pizza?'], typed=0.9, lamp=0.45, cm='arc', dir=1), S('screen', txt=['So my reward is a pizza?'], crt=False, typed=0.9, cm='vertigo', dir=-1)],
 # 325  10.6s [seer] 'Your reward is a pizza, and an evening with your wife. Go down. Share it. Enjoy it. A
 [S('screen', txt=['Your reward is a pizza, and an', 'evening with your wife. Go down.', 'Share it. Enjoy it. Afterwards,'], crt=False, cm='pull', dir=-1), S('upstairs', fr='bust', txt=['Your reward is a pizza, and an', 'evening with your wife. Go down.', 'Share it. Enjoy it. Afterwards,'], lamp=0.45, cm='crane', dir=1, alt=1), S('flat', fr='bust', txt=['Your reward is a pizza, and an', 'evening with your wife. Go down.', 'Share it. Enjoy it. Afterwards,'], cm='truck', dir=-1, alt=2), S('upstairs', fr='bust', txt=['Your reward is a pizza, and an', 'evening with your wife. Go down.', 'Share it. Enjoy it. Afterwards,'], lamp=0.45, cm='push', dir=1, alt=3)],
 # 326  10.7s [seer] 'Your neighbours, by the way, are arguing about the pizza that never came. People argu
 [S('screen', txt=['Your neighbours, by the way, are', 'arguing about the pizza that never', 'came. People argue about the'], crt=False, cm='drop', dir=1), S('upstairs', fr='bust', txt=['Your neighbours, by the way, are', 'arguing about the pizza that never', 'came. People argue about the'], lamp=0.45, cm='vertigo', dir=-1, alt=1), S('flat', fr='bust', txt=['Your neighbours, by the way, are', 'arguing about the pizza that never', 'came. People argue about the'], cm='crane', dir=1, alt=2), S('upstairs', fr='bust', txt=['Your neighbours, by the way, are', 'arguing about the pizza that never', 'came. People argue about the'], lamp=0.45, cm='truck', dir=-1, alt=3)],
 # 327   1.1s [nar] So he did.
 [S('living', fr='wide', donna=True, jack=True, pizza=True, lamp=0.6, cm='orbit', dir=-1)],
 # 328  10.1s [nar] They ate on the sofa with the lamp low and the television murmuring, and they laughed,
 [S('living', fr='wide', donna=True, jack=True, pizza=True, lamp=0.6, cm='pan', dir=1), S('living', fr='waist', donna=True, jack=True, pizza=True, lamp=0.6, cm='orbit', dir=-1), S('living', fr='waist', donna=True, jack=True, pizza=True, lamp=0.6, cm='vertigo', dir=-1, alt=1), S('living', fr='detail', donna=True, jack=True, pizza=True, lamp=0.6, cm='crane', dir=1, alt=2)],
 # 329   5.9s [nar] Donna went to sleep a little after eleven, with her head on his shoulder.
 [S('living', fr='waist', donna=True, jack=True, pizza=True, dpose='sleep', dexpr='calm', lamp=0.6, cm='tilt', dir=-1), S('living', fr='bust', donna=True, jack=True, pizza=True, dpose='sleep', dexpr='calm', lamp=0.6, cm='arc', dir=1, alt=1)],
 # 330   3.2s [nar] Jack lay in the dark with his eyes open.
 [S('living', fr='bust', donna=True, jack=True, pizza=True, dpose='sleep', dexpr='calm', jexpr='fear', lamp=0.6, cm='push', dir=1)],
 # 331   6.3s [nar] Something about this favour was sitting wrong in him, and he could not say why.
 [S('living', fr='bust', donna=True, jack=True, pizza=True, dpose='sleep', dexpr='calm', jexpr='fear', lamp=0.6, cm='truck', dir=-1), S('living', fr='detail', donna=True, jack=True, pizza=True, dpose='sleep', dexpr='calm', jexpr='fear', lamp=0.6, cm='drop', dir=1, alt=1)],
 # 332   7.9s [nar] He moved his arm out from under her very carefully, so that she would not wake, and he
 [S('living', fr='waist', donna=True, jack=True, pizza=True, dpose='sleep', dexpr='calm', lamp=0.6, cm='crane', dir=1), S('upstairs', fr='wide', lamp=0.45, cm='truck', dir=-1), S('living', fr='bust', donna=True, jack=True, pizza=True, dpose='sleep', dexpr='calm', lamp=0.6, cm='orbit', dir=-1, alt=1)],
 # 333   1.3s [jack] 'Are you there?'
 [S('upstairs', fr='detail', txt=['Are you there?'], typed=0.9, lamp=0.45, cm='vertigo', dir=-1), S('screen', txt=['Are you there?'], crt=False, typed=0.9, cm='crane', dir=1)],
 # 334   3.7s [seer] 'I am always here. I have been waiting for you to come back up.'
 [S('screen', txt=['I am always here. I have been', 'waiting for you to come back up.'], crt=False, cm='arc', dir=1)],
 # 335   3.9s [seer] 'That delivery boy. He really is quite a specimen, is he not?'
 [S('screen', txt=['That delivery boy. He really is', 'quite a specimen, is he not?'], crt=False, cm='pull', dir=-1)],
 # 336   2.2s [nar] Jack read the line twice.
 [S('upstairs', fr='bust', txt=['That delivery boy. He really is', 'quite a specimen, is he not?'], lamp=0.45, cm='drop', dir=1)],
 # 337  10.2s [seer] 'He is a terrible employee. Three days in the job and Mister Riago already wants rid o
 [S('screen', txt=['He is a terrible employee. Three', 'days in the job and Mister Riago', 'already wants rid of him. But as a'], crt=False, cm='orbit', dir=-1), S('upstairs', fr='bust', txt=['He is a terrible employee. Three', 'days in the job and Mister Riago', 'already wants rid of him. But as a'], lamp=0.45, cm='arc', dir=1, alt=1), S('flat', fr='bust', txt=['He is a terrible employee. Three', 'days in the job and Mister Riago', 'already wants rid of him. But as a'], cm='vertigo', dir=-1, alt=2), S('upstairs', fr='bust', txt=['He is a terrible employee. Three', 'days in the job and Mister Riago', 'already wants rid of him. But as a'], lamp=0.45, cm='crane', dir=1, alt=3)],
 # 338   4.3s [seer] 'For example, he noticed that you did not lock your front door after he left.'
 [S('screen', txt=['For example, he noticed that you', 'did not lock your front door after', 'he left.'], crt=False, cm='pan', dir=1), S('frontdoor', fr='wide', cm='orbit', dir=-1)],
 # 339   2.4s [nar] Jack was already standing up.
 [S('upstairs', fr='waist', txt=['For example, he noticed that you', 'did not lock your front door after', 'he left.'], expr='fear', lamp=0.45, cm='tilt', dir=-1)],
 # 340   5.1s [seer] 'Sit down, Jack. Locking it now will change nothing, and there is something I want you
 [S('screen', txt=['Sit down, Jack. Locking it now', 'will change nothing, and there is', 'something I want you to hear.'], crt=False, cm='push', dir=1), S('upstairs', fr='bust', txt=['Sit down, Jack. Locking it now', 'will change nothing, and there is', 'something I want you to hear.'], expr='fear', lamp=0.45, cm='orbit', dir=-1, alt=1)],
 # 341   1.3s [nar] He sat down.
 [S('upstairs', fr='waist', txt=['Sit down, Jack. Locking it now', 'will change nothing, and there is', 'something I want you to hear.'], expr='fear', lamp=0.45, cm='truck', dir=-1)],
 # 342   4.9s [nar] He looked back at the dark doorway behind him, and he sat down.
 [S('doorway', txt=['Sit down, Jack. Locking it now', 'will change nothing, and there is', 'something I want you to hear.'], bpose='idle', cm='crane', dir=1), S('upstairs', fr='bust', txt=['Sit down, Jack. Locking it now', 'will change nothing, and there is', 'something I want you to hear.'], expr='fear', lamp=0.45, cm='tilt', dir=-1, alt=1)],
 # 343   6.2s [seer] 'It is true that I have never lied to you. Everything I have told you is honest. But I
 [S('screen', txt=['It is true that I have never lied', 'to you. Everything I have told you', 'is honest. But I have kept things'], crt=False, cm='vertigo', dir=-1), S('seerTags', cm='crane', dir=1)],
 # 344   9.7s [seer] 'I told you that every task brings one bad thing for the world and one good thing for 
 [S('screen', txt=['I told you that every task brings', 'one bad thing for the world and', 'one good thing for you. There is a'], crt=False, cm='arc', dir=1), S('upstairs', fr='bust', txt=['I told you that every task brings', 'one bad thing for the world and', 'one good thing for you. There is a'], expr='fear', lamp=0.45, cm='truck', dir=-1, alt=1), S('flat', fr='bust', txt=['I told you that every task brings', 'one bad thing for the world and', 'one good thing for you. There is a'], cm='push', dir=1, alt=2), S('upstairs', fr='bust', txt=['I told you that every task brings', 'one bad thing for the world and', 'one good thing for you. There is a'], expr='fear', lamp=0.45, cm='tilt', dir=-1, alt=3)],
 # 345   1.7s [seer] 'Do you remember Allie?'
 [S('screen', txt=['Do you remember Allie?'], crt=False, cm='pull', dir=-1), S('allie', fr='wide', aexpr='smile', jack=False, cm='arc', dir=1)],
 # 346   1.9s [nar] Jack did not answer.
 [S('upstairs', fr='bust', txt=['Do you remember Allie?'], expr='sad', lamp=0.45, cm='drop', dir=1)],
 # 347  11.9s [seer] 'Of course you do. What you never knew is that Allie was paying for her younger brothe
 [S('screen', txt=['Of course you do. What you never', 'knew is that Allie was paying for', "her younger brother's studies."], crt=False, cm='orbit', dir=-1), S('gallery', face=1, cm='drop', dir=1), S('upstairs', fr='bust', txt=['Of course you do. What you never', 'knew is that Allie was paying for', "her younger brother's studies."], expr='fear', lamp=0.45, cm='arc', dir=1, alt=1), S('gallery', face=4, cm='vertigo', dir=-1, alt=2)],
 # 348   7.3s [seer] 'Which is a pity for our delivery boy. He needed a very good psychologist four years a
 [S('screen', txt=['Which is a pity for our delivery', 'boy. He needed a very good', 'psychologist four years ago.'], crt=False, cm='pan', dir=1), S('gallery', face=1, cm='orbit', dir=-1), S('upstairs', fr='bust', txt=['Which is a pity for our delivery', 'boy. He needed a very good', 'psychologist four years ago.'], expr='fear', lamp=0.45, cm='pull', dir=-1, alt=1)],
 # 349   7.3s [seer] 'And our lottery winner? He lost his money, exactly as I said, and he moved to a cheap
 [S('screen', txt=['And our lottery winner? He lost', 'his money, exactly as I said, and', 'he moved to a cheaper street. He'], crt=False, cm='tilt', dir=-1), S('shop', fr='wide', kind='booze', man=True, jexpr='sad', cm='pan', dir=1), S('upstairs', fr='bust', txt=['And our lottery winner? He lost', 'his money, exactly as I said, and', 'he moved to a cheaper street. He'], expr='fear', lamp=0.45, cm='drop', dir=1, alt=1)],
 # 350   9.2s [seer] 'One evening the boy ran into the road in front of his car, and that ruined, angry man
 [S('screen', txt=['One evening the boy ran into the', 'road in front of his car, and that', 'ruined, angry man beat him in the'], crt=False, cm='push', dir=1), S('gallery', face=3, cm='tilt', dir=-1), S('upstairs', fr='bust', txt=['One evening the boy ran into the', 'road in front of his car, and that', 'ruined, angry man beat him in the'], expr='fear', lamp=0.45, cm='orbit', dir=-1, alt=1)],
 # 351   7.1s [seer] 'His mother did not protect him. She could not. She was not really there any more, bec
 [S('screen', txt=['His mother did not protect him.', 'She could not. She was not really', 'there any more, because of the'], crt=False, cm='truck', dir=-1), S('upstairs', fr='bust', txt=['His mother did not protect him.', 'She could not. She was not really', 'there any more, because of the'], expr='fear', lamp=0.45, cm='pan', dir=1, alt=1), S('flat', fr='bust', txt=['His mother did not protect him.', 'She could not. She was not really', 'there any more, because of the'], cm='orbit', dir=-1, alt=2)],
 # 352  11.0s [seer] 'And her boyfriend was one of the two men who robbed an insurance agent at a railway s
 [S('screen', txt=['And her boyfriend was one of the', 'two men who robbed an insurance', 'agent at a railway station, twelve'], crt=False, cm='crane', dir=1), S('upstairs', fr='bust', txt=['And her boyfriend was one of the', 'two men who robbed an insurance', 'agent at a railway station, twelve'], expr='fear', lamp=0.45, cm='tilt', dir=-1, alt=1), S('flat', fr='bust', txt=['And her boyfriend was one of the', 'two men who robbed an insurance', 'agent at a railway station, twelve'], cm='pan', dir=1, alt=2), S('upstairs', fr='bust', txt=['And her boyfriend was one of the', 'two men who robbed an insurance', 'agent at a railway station, twelve'], expr='fear', lamp=0.45, cm='orbit', dir=-1, alt=3)],
 # 353   2.2s [seer] 'Now. Do you see the size of it?'
 [S('gallery', face=3, cm='vertigo', dir=-1), S('screen', txt=['Now. Do you see the size of it?'], crt=False, cm='crane', dir=1)],
 # 354   5.8s [nar] Jack sat in his chair with his hands in his lap and did not move.
 [S('upstairs', fr='wide', txt=['Now. Do you see the size of it?'], expr='fear', lamp=0.45, cm='arc', dir=1), S('upstairs', fr='waist', txt=['Now. Do you see the size of it?'], expr='fear', lamp=0.45, cm='tilt', dir=-1, alt=1)],
 # 355   9.9s [seer] 'You have done more than a hundred favours for me, Jack, and every one of them was a b
 [S('gallery', face=0, cm='pull', dir=-1), S('gallery', face=0, cm='crane', dir=1, alt=1), S('gallery', face=2, cm='truck', dir=-1, alt=2), S('gallery', face=4, cm='push', dir=1, alt=3)],
 # 356   9.2s [seer] 'Tens of thousands of lives were touched. Billions of possibilities had to fall the ri
 [S('gallery', face=2, cm='drop', dir=1), S('gallery', face=1, cm='vertigo', dir=-1, alt=1), S('gallery', face=3, cm='crane', dir=1, alt=2)],
 # 357   5.1s [seer] 'I saw it. You made it. It begins and it ends with you, and that is what makes it mine
 [S('gallery', face=4, seer=True, cm='orbit', dir=-1), S('seer', fr='wide', canvases=3, cm='drop', dir=1)],
 # 358   6.3s [seer] 'Tonight, the wrong address, and no tip, and the big house, and the open door. Tonight
 [S('screen', txt=['Tonight, the wrong address, and no', 'tip, and the big house, and the', 'open door. Tonight that boy'], crt=False, cm='pan', dir=1), S('frontdoor', fr='wide', cm='orbit', dir=-1)],
 # 359   5.7s [seer] 'He is downstairs now, Jack. He is standing over your wife. He is doing it at this exa
 [S('screen', txt=['He is downstairs now, Jack. He is', 'standing over your wife. He is', 'doing it at this exact moment.'], crt=False, cm='tilt', dir=-1), S('upstairs', fr='bust', txt=['He is downstairs now, Jack. He is', 'standing over your wife. He is', 'doing it at this exact moment.'], expr='fear', lamp=0.45, cm='pan', dir=1)],
 # 360   2.9s [nar] From the living room came a short sound.
 [S('after', fr='wide', cm='push', dir=1)],
 # 361   1.3s [nar] Not a scream.
 [S('after', fr='wide', cm='truck', dir=-1)],
 # 362   3.4s [nar] Something smaller, and then nothing at all.
 [S('after', fr='waist', cm='crane', dir=1)],
 # 363   1.0s [jack] 'No!'
 [S('upstairs', fr='bust', txt=['No!'], typed=0.9, expr='fear', tremble=0.5, lamp=0.45, cm='vertigo', dir=-1)],
 # 364   2.8s [nar] Jack was already out of the chair.
 [S('upstairs', fr='wide', txt=['No!'], expr='fear', tremble=0.5, lamp=0.45, cm='arc', dir=1)],
 # 365   1.6s [seer] 'Jack. Stop.'
 [S('screen', txt=['Jack. Stop.'], crt=False, cm='pull', dir=-1)],
 # 366   5.6s [nar] And Jack stopped, because this time the words were not on the screen.
 [S('upstairs', fr='waist', txt=['Jack. Stop.'], expr='fear', tremble=0.5, lamp=0.45, cm='drop', dir=1), S('upstairs', fr='bust', txt=['Jack. Stop.'], expr='fear', tremble=0.5, lamp=0.45, cm='truck', dir=-1, alt=1)],
 # 367   1.9s [nar] They were inside his head.
 [S('seer', fr='bust', glow=1.3, cm='orbit', dir=-1)],
 # 368   1.7s [nar] It was a woman's voice.
 [S('seer', fr='bust', glow=1.3, cm='pan', dir=1)],
 # 369   2.4s [nar] Calm, warm, almost kind.
 [S('seer', fr='waist', glow=1.3, cm='tilt', dir=-1)],
 # 370   5.6s [nar] The voice of somebody telling a child that the hard part is over.
 [S('seer', fr='wide', glow=1.3, cm='push', dir=1), S('seer', fr='waist', glow=1.3, cm='pull', dir=-1, alt=1)],
 # 371   5.9s [seer] 'You cannot help her. She was gone before you stood up. He is coming for you now, and 
 [S('seer', fr='bust', glow=1.3, cm='truck', dir=-1), S('upstairs', fr='bust', txt=['You cannot help her. She was gone', 'before you stood up. He is coming', 'for you now, and you cannot stop'], expr='fear', tremble=0.5, lamp=0.45, cm='push', dir=1)],
 # 372   1.2s [jack] 'But why?'
 [S('upstairs', fr='bust', txt=['But why?'], typed=0.9, expr='sad', tremble=0.5, lamp=0.45, cm='crane', dir=1)],
 # 373   4.3s [nar] Jack said it with the tears running down his face.
 [S('upstairs', fr='bust', txt=['But why?'], expr='sad', tremble=0.5, lamp=0.45, cm='vertigo', dir=-1), S('upstairs', fr='detail', txt=['But why?'], expr='sad', tremble=0.5, lamp=0.45, cm='pan', dir=1, alt=1)],
 # 374   5.0s [seer] 'Because a picture is not finished if it does not end where it began. It began with yo
 [S('gallery', seer=True, face=4, cm='arc', dir=1), S('seer', fr='wide', cm='vertigo', dir=-1)],
 # 375  11.0s [seer] 'I want you to understand what it costs me to speak to you like this. All of my streng
 [S('seer', fr='wide', cm='pull', dir=-1), S('seer', fr='waist', cm='push', dir=1, alt=1), S('seer', fr='bust', cm='tilt', dir=1, alt=2), S('seer', fr='detail', cm='pan', dir=1, alt=3)],
 # 376   4.2s [seer] 'Do not feel bad, Jack. Stand still for a moment and look at what we made.'
 [S('gallery', seer=True, face=1, cm='drop', dir=1), S('gallery', seer=True, face=1, cm='vertigo', dir=-1, alt=1)],
 # 377   2.6s [nar] Downstairs, a door moved.
 [S('doorway', txt=['Do not feel bad, Jack. Stand still', 'for a moment and look at what we', 'made.'], bpose='idle', cm='orbit', dir=-1)],
 # 378  10.7s [seer] 'Shall I tell you something? If I had never spoken to you, you would have lived to eig
 [S('screen', txt=['Shall I tell you something? If I', 'had never spoken to you, you would', 'have lived to eighty five. Eighty'], crt=False, cm='pan', dir=1), S('seer', fr='wide', cm='orbit', dir=-1), S('upstairs', fr='bust', txt=['Shall I tell you something? If I', 'had never spoken to you, you would', 'have lived to eighty five. Eighty'], expr='sad', tremble=0.5, lamp=0.45, cm='pull', dir=-1, alt=1), S('seer', fr='bust', cm='crane', dir=1, alt=2)],
 # 379   7.9s [seer] 'I gave you twelve years that meant something. You were happy, Jack. You were loved. A
 [S('screen', txt=['I gave you twelve years that meant', 'something. You were happy, Jack.', 'You were loved. And together we'], crt=False, cm='tilt', dir=-1), S('living', fr='wide', donna=True, jack=True, pizza=True, lamp=0.6, cm='pan', dir=1), S('upstairs', fr='bust', txt=['I gave you twelve years that meant', 'something. You were happy, Jack.', 'You were loved. And together we'], expr='sad', tremble=0.5, lamp=0.45, cm='drop', dir=1, alt=1)],
 # 380   6.1s [nar] Jack stood in the red light of the screen and thought about the twelve years.
 [S('upstairs', fr='waist', txt=['I gave you twelve years that meant', 'something. You were happy, Jack.', 'You were loved. And together we'], expr='sad', tremble=0.5, lamp=0.45, cm='push', dir=1), S('upstairs', fr='bust', txt=['I gave you twelve years that meant', 'something. You were happy, Jack.', 'You were loved. And together we'], expr='sad', tremble=0.5, lamp=0.45, cm='pull', dir=-1, alt=1)],
 # 381   7.2s [nar] He thought about Donna laughing with the pizza box on her knees, an hour ago, downstai
 [S('living', fr='waist', donna=True, jack=True, pizza=True, lamp=0.6, cm='truck', dir=-1), S('living', fr='bust', donna=True, jack=True, pizza=True, lamp=0.6, cm='drop', dir=1, alt=1), S('living', fr='detail', donna=True, jack=True, pizza=True, lamp=0.6, cm='pull', dir=1, alt=2)],
 # 382  12.2s [nar] And behind him, filling the doorway of the little office, there was a very large shape
 [S('doorway', txt=['I gave you twelve years that meant', 'something. You were happy, Jack.', 'You were loved. And together we'], shake=0.5, cm='crane', dir=1), S('upstairs', fr='bust', txt=['I gave you twelve years that meant', 'something. You were happy, Jack.', 'You were loved. And together we'], expr='fear', tremble=0.5, lamp=0.45, cm='tilt', dir=-1, alt=1), S('after', cm='pan', dir=1, alt=2), S('upstairs', fr='bust', txt=['I gave you twelve years that meant', 'something. You were happy, Jack.', 'You were loved. And together we'], expr='fear', tremble=0.5, lamp=0.45, cm='orbit', dir=-1, alt=3), S('after', cm='drop', dir=1, alt=1)],
 # 383   3.7s [nar] On the screen, the last red words appeared.
 [S('screen', txt=['I gave you twelve years that meant', 'something. You were happy, Jack.', 'You were loved. And together we'], crt=False, cm='vertigo', dir=-1)],
 # 384   2.4s [seer] 'Have you nothing to say to me, Jack?'
 [S('screen', txt=['Have you nothing to say to me,', 'Jack?'], crt=False, cm='arc', dir=1)],
 # 385   3.4s [nar] Jack wiped his face with the back of his hand.
 [S('upstairs', fr='bust', txt=['Have you nothing to say to me,', 'Jack?'], expr='fear', tremble=0.5, lamp=0.45, cm='pull', dir=-1)],
 # 386   2.5s [nar] The shape took one step closer.
 [S('doorway', txt=['Have you nothing to say to me,', 'Jack?'], shake=0.5, cm='drop', dir=1)],
 # 387   6.6s [nar] And Jack said the two words he had been promised, twelve years before, that he would s
 [S('upstairs', fr='bust', txt=['Thank you.'], expr='fear', tremble=0.5, lamp=0.45, cm='orbit', dir=-1), S('screen', txt=['Thank you.'], crt=False, cm='drop', dir=1)],
 # 388   1.2s [jack] 'Thank you.'
 [S('screen', txt=['Thank you.'], crt=False, typed=0.9, cm='pan', dir=1), S('upstairs', fr='bust', txt=['Thank you.'], typed=0.9, expr='fear', tremble=0.5, lamp=0.45, cm='orbit', dir=-1)],
 # 389  10.6s [nar] This story is my retelling of The Seer of Possibilities, by Thomas O., as published on
 [S('gallery', face=4, cm='tilt', dir=-1), S('gallery', face=4, cm='drop', dir=1, alt=1), S('gallery', face=1, cm='pull', dir=-1, alt=2), S('gallery', face=3, cm='arc', dir=1, alt=3)],
 # 390  12.6s [nar] It began with a plant, moved three inches, by a man who was told that it was not wrong
 [S('lobby', fr='detail', out=0, jack=False, cm='push', dir=1), S('lobby', fr='close', out=0, jack=False, cm='pull', dir=-1, alt=1), S('lobby', fr='wide', out=0, jack=False, cm='arc', dir=-1, alt=2), S('lobby', fr='waist', out=0, jack=False, cm='vertigo', dir=-1, alt=3), S('lobby', fr='bust', out=0, jack=False, cm='crane', dir=-1, alt=1)],
 # 391   2.0s [nar] Would you have done the first favour?
 [S('end', cm='truck', dir=-1)],
]
