# Scene table for the REEL video (engine v0.5, 3D).
def S(st, **v): return (st, v)
SC = [
 #  0   9.5s  4 shot(s)  [nar]  The monitor in my dark bedroom went black, and glowing red text appear
 [S('r_study', fr='wide', cm='push'), S('r_study', fr='waist', cm='orbit', alt=1), S('r_monitor', fr='detail', cm='push'), S('r_monitor', fr='close', cm='orbit', alt=1)],
 #  1   5.3s  2 shot(s)  [nar]  The internet was disconnected, yet the screen answered my thoughts.
 [S('r_monitor', fr='detail', cm='push'), S('r_study', fr='bust', cm='arc')],
 #  2   3.3s  1 shot(s)  [nar]  It promised wealth if I moved an office plant.
 [S('r_lobby', fr='wide', cm='push')],
 #  3   1.1s  1 shot(s)  [nar]  Let us begin.
 [S('r_study', fr='waist', cm='pull')],
 #  4   9.0s  4 shot(s)  [nar]  An entity called the Seer contacted me through my offline computer, cl
 [S('r_study', fr='wide', cm='push'), S('r_study', fr='waist', cm='orbit', alt=1), S('r_monitor', fr='close', cm='orbit'), S('r_study', fr='bust', cm='arc', alt=1)],
 #  5   7.6s  3 shot(s)  [nar]  Its first favor was simple: move a potted plant in my office lobby at 
 [S('r_lobby', fr='wide', cm='crane'), S('r_lobby', fr='waist', cm='push'), S('r_lobby', fr='detail', cm='orbit', alt=1)],
 #  6   6.3s  3 shot(s)  [nar]  An hour later, my boss tripped over the plant, violently twisting his 
 [S('r_lobby', fr='wide', cm='truck', alt=1), S('r_lobby', fr='waist', cm='push', alt=1), S('r_lobby', fr='bust', cm='arc')],
 #  7   6.9s  3 shot(s)  [nar]  Unable to drive, he asked my favorite coworker, Allie, to take him to 
 [S('r_lobby', fr='waist', cm='follow', alt=1), S('r_lobby', fr='bust', cm='push'), S('r_lobby', fr='wide', cm='pull', alt=1)],
 #  8   6.3s  3 shot(s)  [nar]  Minutes later, a speeding truck crushed their car, killing Allie insta
 [S('r_crash', fr='wide', cm='crane'), S('r_crash', fr='waist', cm='push'), S('r_crash', fr='detail', cm='orbit')],
 #  9   7.5s  3 shot(s)  [nar]  In horror, I wanted to smash the monitor, but the Seer said her death 
 [S('r_study', fr='waist', cm='push', alt=1), S('r_monitor', fr='close', cm='push'), S('r_study', fr='bust', cm='arc', alt=1)],
 # 10   6.5s  3 shot(s)  [nar]  The next morning, I was promoted to division manager with a fortune in
 [S('r_study', fr='wide', cm='push'), S('r_study', fr='waist', cm='orbit'), S('r_study', fr='bust', cm='push', alt=1)],
 # 11   7.0s  3 shot(s)  [nar]  Every monthly favor brought ruin to a stranger, but immense wealth and
 [S('r_monitor', fr='detail', cm='push'), S('r_study', fr='waist', cm='push'), S('r_monitor', fr='close', cm='orbit', alt=1)],
 # 12   8.7s  4 shot(s)  [nar]  A lottery favor ruined a stranger's family, while a parking favor led 
 [S('r_crash', fr='wide', cm='crane'), S('r_living', fr='wide', cm='push'), S('r_living', fr='waist', cm='orbit'), S('r_living', fr='bust', cm='arc', alt=1)],
 # 13   4.5s  2 shot(s)  [nar]  For twelve glorious years, my life was heaven on earth.
 [S('r_living', fr='wide', cm='push'), S('r_living', fr='waist', cm='push', alt=1)],
 # 14   7.3s  3 shot(s)  [nar]  Then came the final favor: call a pizza parlor, let it ring three time
 [S('r_climax', fr='wide', cm='push'), S('r_climax', fr='waist', cm='orbit'), S('r_monitor', fr='detail', cm='push')],
 # 15   8.2s  4 shot(s)  [nar]  Thirty minutes later, a towering delivery brute arrived, glaring with 
 [S('r_courier', fr='wide', cm='push'), S('r_courier', fr='waist', cm='push', alt=1), S('r_courier', fr='bust', cm='arc', alt=1), S('r_courier', fr='detail', cm='orbit')],
 # 16   5.3s  2 shot(s)  [nar]  Donna fell asleep on the couch, and I crept upstairs to the computer.
 [S('r_living', fr='wide', cm='push', alt=1), S('r_climax', fr='waist', cm='push')],
 # 17   3.1s  1 shot(s)  [nar]  The screen lit up with the horrifying truth.
 [S('r_monitor', fr='detail', cm='push')],
 # 18   9.8s  4 shot(s)  [nar]  Every past favor was an engineered domino to turn that delivery boy in
 [S('r_climax', fr='wide', cm='crane'), S('r_climax', fr='waist', cm='push', alt=1), S('r_climax', fr='bust', cm='arc', alt=1), S('r_courier', fr='bust', cm='push')],
 # 19   7.7s  4 shot(s)  [nar]  The screen read: He is downstairs right now, ending Donna's life at th
 [S('r_climax', fr='close', cm='push'), S('r_living', fr='wide', cm='push', alt=1), S('r_living', fr='waist', cm='orbit', alt=1), S('r_climax', fr='bust', cm='arc', alt=1)],
 # 20  14.7s  7 shot(s)  [nar]  As heavy footsteps ascended the stairs, a soothing voice whispered in 
 [S('r_climax', fr='waist', cm='push'), S('r_climax', fr='bust', cm='push', alt=1), S('r_climax', fr='wide', cm='push', alt=1), S('r_climax', fr='waist', cm='arc', alt=1), S('r_study', fr='wide', cm='orbit'), S('r_climax', fr='close', cm='orbit'), S('r_climax', fr='bust', cm='arc')],
 # 21   3.2s  1 shot(s)  [nar]  The giant entered with a bloodstained blade.
 [S('r_climax', fr='bust', cm='push', alt=1)],
 # 22   4.4s  2 shot(s)  [nar]  The screen pulsed: Don't you have something to say to me, Jack?
 [S('r_monitor', fr='detail', cm='push'), S('r_climax', fr='close', cm='push')],
 # 23   3.3s  2 shot(s)  [nar]  With tears in my eyes, I whispered: Thank you.
 [S('r_climax', fr='bust', cm='push'), S('r_climax', fr='waist', cm='pull', alt=1)],
 # 24   4.7s  1 shot(s)  [nar]  Would you trade eighty-five bitter years for twelve perfect ones?
 [S('r_qcard', fr='wide', cm='push')],
]
