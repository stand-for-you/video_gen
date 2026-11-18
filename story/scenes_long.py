# Scene table for the LONG video (engine v0.5, 3D, 16:9 sets in src/SetsL.tsx).
# ONE LIST PER SPOKEN SENTENCE, in the same order as the narration (SYNC LAW: the picture always shows what the words say).
# Sets available: bedover, jackfull, houseout, bedwin, kitchen, hospital, snap, lunge, flee, hall, carout, carin, end.
def S(st, **v): return (st, v)
SC = [
 #  0  I woke up in the dark, something breathing right over my bed.  (teaser - creepiest first picture)
 [S('bedover', fr='wide'), S('bedover', fr='waist')],
 #  1  I looked up, and two black holes stared back at me.
 [S('jackfull', fr='detail')],
 #  2  Where its eyes should be, only empty darkness, leaking something black.
 [S('jackfull', fr='detail', ang=1), S('bedover', fr='close'), S('jackfull', fr='close')],
 #  3  A blue mask.
 [S('jackfull', fr='bust')],
 #  4  A black hoodie.
 [S('jackfull', fr='waist')],
 #  5  No nose, and no mouth.
 [S('jackfull', fr='detail')],
 #  6  And this was not the first time it had come for me.
 [S('bedover', fr='wide', ang=-1)],
 #  7  So what did it want?
 [S('jackfull', fr='wide')],
 #  8  And where was my brother?
 [S('houseout', fr='wide')],
 #  9  Let us go back to the beginning.
 [S('kitchen', fr='wide')],
 # 10  My name is Mitch.
 [S('kitchen', fr='waist')],
 # 11  The bank took my family's house, so I moved in with my brother, Edwin.
 [S('kitchen', fr='wide', ang=1), S('kitchen', fr='waist', ang=-1)],
 # 12  We had not seen each other for ten years, so we were both happy.
 [S('kitchen', fr='bust'), S('kitchen', fr='waist')],
 # 13  For one whole week, everything was normal.
 [S('kitchen', fr='wide')],
 # 14  I unpacked, and I slept, and I got used to the quiet house.
 [S('bedover', fr='wide'), S('kitchen', fr='wide', ang=1)],
 # 15  Then, one night at about one in the morning, I heard rustling outside.
 [S('bedwin', fr='wide'), S('bedwin', fr='waist')],
 # 16  I thought it was a raccoon, so I ignored it.
 [S('bedwin', fr='bust')],
 # 17  The next morning, I told Edwin about it, and he agreed.
 [S('kitchen', fr='waist', ang=1), S('kitchen', fr='bust', ang=-1)],
 # 18  The next night, I heard my window open.
 [S('bedwin', fr='waist', ang=1)],
 # 19  Then came a loud thump, as if something had climbed inside.
 [S('bedwin', fr='detail'), S('bedover', fr='wide')],
 # 20  I sat up fast and looked around my room.
 [S('bedover', fr='waist')],
 # 21  There was nothing there.
 [S('bedover', fr='bust')],
 # 22  In the morning, Edwin dropped his coffee cup the moment he saw me.
 [S('kitchen', fr='wide', ang=-1), S('kitchen', fr='detail')],
 # 23  He held up a mirror, and I saw a deep cut across my cheek.
 [S('kitchen', fr='bust', ang=1), S('kitchen', fr='detail', ang=-1)],
 # 24  At the hospital, the doctor said I must have been sleepwalking.
 [S('hospital', fr='wide'), S('hospital', fr='waist')],
 # 25  Then he showed me something that made my blood run cold.
 [S('hospital', fr='bust')],
 # 26  There was a neat, stitched line on my side.
 [S('hospital', fr='detail')],
 # 27  'You somehow lost your left kidney last night. We do not know how, Mitch. I am sorry.'  [doc]
 [S('hospital', fr='waist', ang=1), S('hospital', fr='bust', ang=-1)],
 # 28  The next night was my breaking point.
 [S('bedover', fr='wide', ang=1)],
 # 29  Around midnight, I woke up, and I froze.
 [S('bedover', fr='waist', ang=-1)],
 # 30  A creature was staring down at me, face to face.
 [S('jackfull', fr='close')],
 # 31  It wore a black hoodie and a dark blue mask, with no nose and no mouth.
 [S('jackfull', fr='waist', ang=1), S('jackfull', fr='bust', ang=-1)],
 # 32  But the worst part was its eyes.
 [S('jackfull', fr='detail')],
 # 33  It had none.
 [S('jackfull', fr='close', ang=1)],
 # 34  There were only empty black sockets, with a black liquid dripping out.
 [S('jackfull', fr='detail', ang=-1), S('jackfull', fr='close')],
 # 35  I grabbed the camera from the mantel and took a picture.
 [S('snap', fr='detail')],
 # 36  The moment I did, it lunged at me, and reached for my chest with its claws.
 [S('lunge', fr='wide'), S('lunge', fr='waist')],
 # 37  I kicked it in the face as hard as I could.
 [S('lunge', fr='bust')],
 # 38  Then I grabbed my wallet, because I knew I would need money, and I ran out into the night.
 [S('bedover', fr='waist', ang=1), S('flee', fr='wide'), S('flee', fr='waist')],
 # 39  I ran until I reached the woods near Edwin's house.
 [S('houseout', fr='wide', fig=1), S('flee', fr='waist', ang=1)],
 # 40  Then I tripped on a rock, and everything went black.
 [S('flee', fr='bust')],
 # 41  I woke up in the hospital, and the same doctor came in.
 [S('hospital', fr='wide', ang=1), S('hospital', fr='waist', ang=-1)],
 # 42  'I have good news and bad news, Mitch. The good news is that your injuries are small, and your parents are coming to take you home.'  [doc]
 [S('hospital', fr='bust'), S('hospital', fr='waist'), S('hospital', fr='detail')],
 # 43  I sighed with relief.
 [S('hospital', fr='bust', ang=1)],
 # 44  'The bad news is that your brother has been killed by something. I am sorry.'  [doc]
 [S('hospital', fr='bust', ang=-1), S('hospital', fr='detail', ang=1)],
 # 45  My parents drove me back to Edwin's house, to collect my things.
 [S('carout', fr='wide'), S('houseout', fr='wide', ang=1)],
 # 46  I was scared, but I stayed calm.
 [S('carout', fr='waist')],
 # 47  I went into my room and took my camera.
 [S('bedover', fr='wide', ang=-1)],
 # 48  Then I stopped dead in the hallway.
 [S('hall', fr='wide')],
 # 49  I saw my brother there, and I could not look for long.
 [S('hall', fr='waist')],
 # 50  Next to him lay something small.
 [S('hall', fr='detail')],
 # 51  I picked it up, and I walked to my parents' car without a word.
 [S('hall', fr='detail', ang=1), S('carout', fr='wide', part='walk')],
 # 52  Inside the car, I looked at what I was holding, and I nearly threw up.
 [S('carin', fr='wide'), S('carin', fr='waist')],
 # 53  It was the part of me that the creature had stolen, black with that same dark liquid.
 [S('carin', fr='bust'), S('carin', fr='detail')],
 # 54  This story is inspired by the Eyeless Jack creepypasta, first posted by a user named Azelf5000, in twenty twelve.  (credit, after 0:45)
 [S('houseout', fr='wide'), S('kitchen', fr='wide'), S('bedover', fr='wide'), S('jackfull', fr='wide')],
 # 55  Would you have stayed in that house a second night?  -> end screen (last 20s)
 [S('end')],
]
