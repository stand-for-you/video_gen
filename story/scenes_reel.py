# Scene table for the REEL (engine v0.5, 3D, 9:16 sets in src/SetsR.tsx). ONE speaker (narrator) only.
def S(st, **v): return (st, v)
SC = [
 #  0  I woke up in the dark, and something was breathing right over my bed.
 [S('bedover', fr='wide'), S('bedover', fr='waist')],
 #  1  I looked up, and two black holes stared back at me.
 [S('jackfull', fr='detail'), S('jackfull', fr='close')],
 #  2  A blue mask.
 [S('jackfull', fr='bust')],
 #  3  A black hoodie.
 [S('jackfull', fr='waist')],
 #  4  No nose, no mouth.
 [S('jackfull', fr='detail')],
 #  5  And black liquid dripping from its empty eyes.
 [S('jackfull', fr='close')],
 #  6  And this was not the first time it had come for me.
 [S('bedover', fr='wide', ang=1), S('bedover', fr='waist', ang=-1)],
 #  7  So what did it want?
 [S('jackfull', fr='wide')],
 #  8  Let us go back to the beginning.
 [S('kitchen', fr='wide')],
 #  9  My name is Mitch.
 [S('kitchen', fr='waist')],
 # 10  After the bank took our house, I moved in with my brother, Edwin.
 [S('kitchen', fr='wide', ang=1), S('kitchen', fr='waist', ang=-1)],
 # 11  We had not seen each other for ten years, and for one week, everything was normal.
 [S('kitchen', fr='bust'), S('kitchen', fr='waist'), S('kitchen', fr='wide', ang=1)],
 # 12  Then, one night at one in the morning, I heard rustling outside.
 [S('bedwin', fr='wide'), S('bedwin', fr='waist')],
 # 13  I thought it was a raccoon, and Edwin agreed.
 [S('bedwin', fr='bust'), S('kitchen', fr='waist', ang=1)],
 # 14  The next night, I heard my window open, and a loud thump, as if something had climbed inside.
 [S('bedwin', fr='waist', ang=1), S('bedwin', fr='detail'), S('bedover', fr='wide'), S('bedover', fr='waist')],
 # 15  I sat up and looked around.
 [S('bedover', fr='bust')],
 # 16  There was nothing there.
 [S('bedover', fr='close')],
 # 17  In the morning, Edwin dropped his coffee cup the moment he saw me.
 [S('kitchen', fr='wide', ang=-1), S('kitchen', fr='detail')],
 # 18  He held up a mirror, and I saw a deep cut across my cheek.
 [S('kitchen', fr='bust', ang=1), S('kitchen', fr='detail', ang=-1)],
 # 19  At the hospital, the doctor said I must have been sleepwalking.
 [S('hospital', fr='wide'), S('hospital', fr='waist')],
 # 20  Then he showed me a neat, stitched line on my side.
 [S('hospital', fr='bust'), S('hospital', fr='detail')],
 # 21  I had lost my left kidney, and nobody knew how.
 [S('hospital', fr='waist', ang=1), S('hospital', fr='bust', ang=-1)],
 # 22  The next night was my breaking point.
 [S('bedover', fr='wide', ang=1)],
 # 23  Around midnight, I woke up, and I froze.
 [S('bedover', fr='waist', ang=-1)],
 # 24  A creature was staring down at me, face to face.
 [S('jackfull', fr='close'), S('jackfull', fr='bust')],
 # 25  It had a black hoodie, a dark blue mask, and no eyes.
 [S('jackfull', fr='waist', ang=1), S('jackfull', fr='detail')],
 # 26  There were only empty black sockets, dripping.
 [S('jackfull', fr='detail', ang=-1), S('jackfull', fr='close')],
 # 27  I grabbed my camera and took a picture.
 [S('snap', fr='detail')],
 # 28  It lunged at me, reaching for my chest with its claws.
 [S('lunge', fr='wide'), S('lunge', fr='waist')],
 # 29  I kicked it in the face, grabbed my wallet, and ran out into the night.
 [S('lunge', fr='bust'), S('flee', fr='wide'), S('flee', fr='waist')],
 # 30  I ran into the woods near the house, I tripped on a rock, and everything went black.
 [S('flee', fr='waist', ang=1), S('houseout', fr='wide', fig=1), S('flee', fr='bust')],
 # 31  I woke up in the hospital.
 [S('hospital', fr='wide')],
 # 32  The doctor said my injuries were small, and my parents were coming.
 [S('hospital', fr='waist'), S('hospital', fr='bust')],
 # 33  Then he told me that my brother had been killed by something.
 [S('hospital', fr='bust', ang=1), S('hospital', fr='detail')],
 # 34  My parents drove me back to the house to collect my things.
 [S('carout', fr='wide'), S('houseout', fr='wide', ang=1)],
 # 35  In the hallway, I saw my brother, and I could not look for long.
 [S('hall', fr='wide'), S('hall', fr='waist')],
 # 36  Next to him lay something small.
 [S('hall', fr='detail')],
 # 37  I picked it up, and I walked to my parents' car without a word.
 [S('hall', fr='detail', ang=1), S('carout', fr='wide', part='walk')],
 # 38  When I looked at what I was holding, I nearly threw up.
 [S('carin', fr='wide'), S('carin', fr='waist')],
 # 39  It was the part of me that the creature had stolen, black with that same dark liquid.
 [S('carin', fr='bust'), S('carin', fr='detail'), S('carin', fr='waist', ang=1)],
 # 40  This story is inspired by the Eyeless Jack creepypasta, first posted by Azelf5000.  (credit)
 [S('houseout', fr='wide'), S('kitchen', fr='wide'), S('bedover', fr='wide'), S('jackfull', fr='wide')],
 # 41  Would you have stayed in that house a second night?
 [S('jackfull', fr='close')],
]
