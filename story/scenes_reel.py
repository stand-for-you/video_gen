# Scene table for the REEL - "The Seer of Possibilities" (engine v0.5, 3D, 9:16 sets in src/SetsR.tsx).
# ONE LIST PER SPOKEN SENTENCE. Written as story/plan_reel.txt, expanded by story/expand_reel.py.
def S(st, **v): return (st, v)
SC = [
 #  0   3.8s A man sits in a dark room in front of a black screen.
 [S('rupstairs', fr='wide', txt=['He is coming up for you now,', 'Jack. You cannot stop him.'], lamp=0.45, expr='fear', cm='push', dir=1), S('rupstairs', fr='waist', txt=['He is coming up for you now,', 'Jack. You cannot stop him.'], lamp=0.45, expr='fear', cm='tilt', dir=-1)],
 #  1   5.0s The red words tell him his wife is already dead downstairs.
 [S('rscreen', txt=['Your wife is already dead.'], cm='truck', dir=-1), S('rafter', cm='push', dir=1), S('rscreen', txt=['Your wife is already dead.'], cm='drop', dir=1, alt=1)],
 #  2   6.4s They say the man who did it is still in the house, coming up the stairs for 
 [S('rdoor', cm='crane', dir=1), S('rupstairs', fr='bust', txt=['He is coming up for you now,', 'Jack. You cannot stop him.'], lamp=0.45, expr='fear', cm='truck', dir=-1), S('rdoor', cm='orbit', dir=-1, alt=1)],
 #  3   1.7s Jack does not run.
 [S('rupstairs', fr='waist', txt=['He is coming up for you now,', 'Jack. You cannot stop him.'], lamp=0.45, expr='fear', tremble=0.5, cm='vertigo', dir=-1)],
 #  4   4.5s He is crying, and he is about to thank the thing on the screen.
 [S('rupstairs', fr='bust', txt=['Thank you.'], lamp=0.45, expr='fear', tremble=0.5, cm='arc', dir=1), S('rscreen', txt=['Thank you.'], cm='vertigo', dir=-1), S('rupstairs', fr='detail', txt=['Thank you.'], lamp=0.45, expr='fear', tremble=0.5, cm='tilt', dir=-1, alt=1)],
 #  5   2.2s Let us go back to the beginning.
 [S('rseer', fr='wide', cm='pull', dir=-1), S('rgallery', face=1, cm='arc', dir=1)],
 #  6   5.2s Twelve years earlier, Jack had a cheap flat and a tired job.
 [S('rflat', fr='wide', txt=['Thank you.'], expr='fear', cm='drop', dir=1), S('rflat', fr='waist', txt=['Thank you.'], expr='fear', cm='pull', dir=-1)],
 #  7   6.2s One night his screen went black, and red letters asked him for a favour.
 [S('rscreen', txt=['Hello Jack.', 'I need a favour from you.'], cm='orbit', dir=-1), S('rflat', fr='bust', txt=['Hello Jack.', 'I need a favour from you.'], expr='fear', cm='drop', dir=1)],
 #  8   3.1s In his office lobby there was a plant.
 [S('rlobby', fr='wide', out=0, pose='crouch', cm='pan', dir=1), S('rlobby', fr='detail', out=0, pose='crouch', cm='orbit', dir=-1)],
 #  9   2.4s Move it three inches to the left.
 [S('rlobby', fr='detail', out=0, pose='crouch', cm='tilt', dir=-1)],
 # 10   4.5s Nothing wrong, nothing against the law, nobody hurt.
 [S('rlobby', fr='detail', out=0, pose='crouch', cm='push', dir=1), S('rlobby', fr='waist', out=0, pose='crouch', cm='tilt', dir=-1)],
 # 11   3.1s So he did it, and he forgot about it.
 [S('rlobby', fr='waist', out=1, cm='truck', dir=-1)],
 # 12   8.5s Three days later a woman stopped to push that plant straight, and was still 
 [S('rlobby', fr='wide', out=1, people=3, cm='crane', dir=1), S('rlobby', fr='waist', out=1, people=3, cm='truck', dir=-1), S('rlobby', fr='detail', out=1, people=3, cm='push', dir=1)],
 # 13   2.0s That is how Jack met Allie.
 [S('roffice', fr='wide', aexpr='smile', cm='vertigo', dir=-1)],
 # 14   5.5s Two cubicles away for a year, and he had never spoken to her once.
 [S('roffice', fr='waist', aexpr='smile', cm='arc', dir=1), S('roffice', fr='wide', aexpr='smile', cm='vertigo', dir=-1)],
 # 15   1.8s He asked what it was.
 [S('rflat', fr='waist', txt=['Nothing wrong.', 'Nothing against the law.', 'Nobody hurt.'], cm='pull', dir=-1)],
 # 16   1.7s It said it was a seer.
 [S('rseer', fr='wide', cm='drop', dir=1)],
 # 17   5.8s It could see every possible thing that could happen, and every road to it.
 [S('rseer', fr='wide', cm='orbit', dir=-1), S('rgallery', face=3, cm='drop', dir=1)],
 # 18   6.0s It had done this for thousands of years, and always took the same payment.
 [S('rseer', fr='wide', cm='pan', dir=1), S('rgallery', face=4, cm='orbit', dir=-1)],
 # 19   2.4s One favour, then the next.
 [S('rscreen', txt=['One favour, then the next.'], cm='tilt', dir=-1)],
 # 20   6.6s A lorry missed Allie by two seconds because Jack made a phone ring at a junc
 [S('rcrash', fr='wide', jack=False, cm='push', dir=1), S('rcrash', fr='waist', jack=False, cm='tilt', dir=-1)],
 # 21   5.3s A stranger won twenty seven million because Jack stood in a queue.
 [S('rshop', fr='wide', man=True, kind='booze', cm='truck', dir=-1), S('rshop', fr='waist', man=True, kind='booze', cm='push', dir=1)],
 # 22   2.6s The screen was not giving him luck.
 [S('rscreen', txt=['I am not giving you luck.'], cm='crane', dir=1)],
 # 23   4.4s It was spending other people to build the life he wanted.
 [S('rgallery', face=3, cm='vertigo', dir=-1), S('rseer', fr='wide', cm='crane', dir=1)],
 # 24   1.4s He married Donna.
 [S('rliving', fr='wide', donna=True, jack=True, lamp=0.6, cm='arc', dir=1)],
 # 25   3.5s He bought the big house at the end of the long road.
 [S('rhouse', fr='wide', cm='pull', dir=-1), S('rhouse', fr='waist', cm='arc', dir=1)],
 # 26   5.2s Twelve good years, paid for by favours he never questioned.
 [S('rhouse', fr='wide', cm='drop', dir=1), S('rliving', fr='wide', donna=True, jack=True, lamp=0.6, pizza=True, cm='pull', dir=-1)],
 # 27   9.5s Then came the doorbell, a delivery boy with a warm box, and a wife on the so
 [S('rdoor', fr='wide', boy=True, cm='orbit', dir=-1), S('rdoor', fr='waist', boy=True, cm='drop', dir=1), S('rliving', fr='wide', donna=True, jack=True, lamp=0.6, pizza=True, cm='pull', dir=-1), S('rafter', cm='arc', dir=1)],
 # 28   3.5s Upstairs the red letters told him the truth.
 [S('rupstairs', fr='waist', txt=['The boy was a favour too.'], lamp=0.45, cm='pan', dir=1), S('rscreen', txt=['The boy was a favour too.'], crt=False, cm='orbit', dir=-1)],
 # 29   2.1s The boy had been a favour too.
 [S('rscreen', txt=['The boy was a favour too.'], crt=False, cm='tilt', dir=-1)],
 # 30   4.8s Years before, Jack had held a door for a frightened child.
 [S('rdoor', fr='waist', boy=True, cm='push', dir=1), S('rgallery', face=1, cm='tilt', dir=-1)],
 # 31  10.8s It said it had been painting one picture for a very long time, that Jack was
 [S('rgallery', face=1, cm='truck', dir=-1), S('rseer', fr='wide', cm='push', dir=1), S('rgallery', face=3, cm='tilt', dir=-1), S('rgallery', face=1, cm='drop', dir=1, alt=1)],
 # 32   6.2s In the doorway stood a large shape, breathing hard, with a knife held low.
 [S('rdoor', cm='crane', dir=1), S('rdoor', fr='waist', cm='truck', dir=-1)],
 # 33   3.3s The screen asked if he had nothing to say.
 [S('rscreen', txt=['Have you nothing to say to me,', 'Jack?'], crt=False, cm='vertigo', dir=-1), S('rupstairs', fr='bust', txt=['Have you nothing to say to me,', 'Jack?'], lamp=0.45, expr='fear', cm='crane', dir=1)],
 # 34   9.8s And Jack, who had been given twelve good years for a plant moved three inche
 [S('rupstairs', fr='bust', txt=['Have you nothing to say to me,', 'Jack?'], lamp=0.45, expr='fear', tremble=0.5, cm='arc', dir=1), S('rscreen', txt=['Have you nothing to say to me,', 'Jack?'], crt=False, cm='vertigo', dir=-1), S('rupstairs', fr='waist', txt=['Have you nothing to say to me,', 'Jack?'], lamp=0.45, expr='fear', tremble=0.5, cm='crane', dir=1), S('rupstairs', fr='detail', txt=['Have you nothing to say to me,', 'Jack?'], lamp=0.45, expr='fear', tremble=0.5, cm='tilt', dir=-1, alt=1)],
 # 35   1.2s Thank you.
 [S('rscreen', txt=['Thank you.'], crt=False, cm='pull', dir=-1)],
 # 36   8.5s This is my retelling of The Seer of Possibilities, by Thomas O., on creepypa
 [S('rgallery', face=1, cm='drop', dir=1), S('rseer', fr='wide', cm='pull', dir=-1), S('rgallery', face=3, cm='arc', dir=1)],
 # 37   2.0s Would you have done the first favour?
 [S('rseer', fr='wide', cm='orbit', dir=-1)],
]
