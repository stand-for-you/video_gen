# Scene table for the REEL (9:16, src/SetsR.tsx). One list per beat of script_reel.BEATS (12 beats).
# Same rules as the long table: every (set,v) is a NEW picture; the antagonist is tagged c='mask' (>= 8 shots).
def S(st, **v): return (st, v)
SC = [
 # 0 TEASER / intro (library watcher -> the hook -> back to the beginning)
 [S('rlibrary', fr='wide', watch=True, expr='worry', cm='push', n=1, fc=[540, 760, 1.4]),
  S('rface', fr='close', who='ethan', expr='fear', tag='WATCHED', turn=0.1, n=2, fc=[540, 760, 1.5]),
  S('rlibrary', fr='wide', watch=True, expr='fear', cm='truck', n=3, fc=[560, 820, 1.35]),
  S('rlibrary', fr='waist', expr='sad', cm='pull', n=4, fc=[560, 700, 1.3], last=True)],
 # 1 a new friend + Elisa appears
 [S('rcommon', fr='wide', who='both', expr='smile', jexpr='smile', cm='push', n=5, fc=[500, 800, 1.35]),
  S('rface', fr='bust', who='jack', expr='smile', warm=True, turn=0.1, n=6, fc=[540, 760, 1.4]),
  S('rcommon', fr='wide', who='jack', jexpr='neutral', cm='truck', n=7, fc=[640, 800, 1.35]),
  S('rhall', fr='wide', expr='smile', cm='still', n=8, last=True)],
 # 2 she seems kind, then he changes (pull away + cafeteria)
 [S('rcommon', fr='wide', who='jack', jexpr='sad', cm='still', n=9, fc=[640, 800, 1.35]),
  S('rcafeteria', fr='wide', cm='push', n=10, fc=[500, 760, 1.35]),
  S('rface', fr='close', who='jack', expr='stern', turn=0.2, n=11, fc=[540, 760, 1.5]),
  S('rcafeteria', fr='wide', tag=True, cm='truck', n=12, fc=[520, 800, 1.35], last=True)],
 # 3 the hall, the wrong smile
 [S('rhall', fr='wide', tag=True, expr='smile', cm='push', n=13, fc=[740, 760, 1.35]),
  S('rface', fr='close', who='elisa', expr='cruel', turn=-0.1, n=14, fc=[540, 760, 1.5]),
  S('rhall', fr='waist', expr='cruel', cm='still', n=15, fc=[740, 700, 1.3], last=True)],
 # 4 the phone call -> he comes over
 [S('rphone', fr='wide', expr='worry', cm='push', n=16, fc=[440, 760, 1.35]),
  S('rface', fr='close', who='ethan', expr='worry', warm=True, turn=0.0, n=17, fc=[540, 760, 1.5]),
  S('rphone', fr='waist', expr='fear', cm='still', n=18, fc=[440, 700, 1.3]),
  S('rapartment', fr='wide', dark=False, jexpr='sad', cm='truck', n=19, fc=[560, 800, 1.35], last=True)],
 # 5 black tears + the knock
 [S('rapartment', fr='wide', dark=True, jexpr='fear', cm='still', n=20, fc=[560, 800, 1.35]),
  S('rface', fr='close', who='jack', expr='fear', tears=True, turn=0.0, n=21, fc=[540, 760, 1.5]),
  S('rapartment', fr='wide', dark=True, tears=True, tag=True, jexpr='fear', cm='push', n=22, fc=[540, 800, 1.35]),
  S('rdoor', fr='wide', cm='truck', n=23, fc=[560, 760, 1.35], last=True)],
 # 6 chased, taken, the clearing  -- creature
 [S('rwoods', fr='wide', run=False, cm='push', n=24, fc=[480, 800, 1.35]),
  S('rclearing', fr='wide', c='mask', tar=0.35, cm='push', n=25, fc=[560, 760, 1.3]),
  S('rclearing', fr='wide', c='mask', unmask=True, tag=True, tar=0.4, cm='truck', n=26, fc=[700, 760, 1.3]),
  S('rclearing', fr='waist', c='mask', read=True, tar=0.45, cm='still', n=27, fc=[555, 720, 1.3], last=True)],
 # 7 the ritual -- creature
 [S('rritual', fr='wide', c='mask', tar=0.6, tend=0.4, cm='push', n=28, fc=[545, 700, 1.3]),
  S('rclearing', fr='wide', c='mask', read=True, tar=0.6, tend=0.5, cm='still', n=29, fc=[555, 760, 1.3]),
  S('rritual', fr='waist', c='mask', tar=0.8, tend=0.8, cm='pull', n=30, fc=[545, 680, 1.28], last=True)],
 # 8 you made him mad -- creature
 [S('runleashed', fr='wide', c='mask', pose2='loom', pp=0.5, cm='still', n=31, fc=[460, 760, 1.3]),
  S('runleashed', fr='wide', c='mask', pp=0.3, cm='truck', n=32, fc=[460, 760, 1.3]),
  S('runleashed', fr='waist', c='mask', pp=0.8, cm='push', n=33, fc=[460, 700, 1.28], last=True)],
 # 9 what I lost (hospital)
 [S('rhospital', fr='wide', expr='sad', cm='push', n=34, fc=[540, 760, 1.3]),
  S('rface', fr='close', who='ethan', expr='sad', warm=False, turn=0.1, n=35, fc=[540, 760, 1.5]),
  S('rhospital', fr='wide', tag=True, expr='neutral', cm='still', n=36, fc=[640, 760, 1.3], last=True)],
 # 10 credit card
 [S('rqcard', fr='detail', n=37)],
 # 11 closing question card
 [S('rqend', fr='detail', n=38)],
]
# --- extra reel scenes (more variety per beat; avoid over-using rface; every entry is a NEW picture) ---
SC[0] += [S('rlibrary', fr='wide', watch=True, expr='neutral', cm='orbit', n=50, fc=[540, 760, 1.4]),
          S('rlibrary', fr='waist', expr='fear', cm='rise', n=51, fc=[560, 700, 1.3])]
SC[1] += [S('rcommon', fr='waist', who='ethan', expr='smile', cm='still', n=52, fc=[500, 720, 1.3]),
          S('rhall', fr='waist', expr='smile', cm='truck', n=53, fc=[740, 700, 1.3])]
SC[2] += [S('rcafeteria', fr='waist', cm='rise', n=54, fc=[520, 720, 1.3]),
          S('rcommon', fr='wide', who='jack', jexpr='neutral', cm='pull', n=55, fc=[640, 800, 1.35])]
SC[3] += [S('rhall', fr='wide', tag=True, expr='cruel', cm='pull', n=56, fc=[740, 760, 1.35]),
          S('rhall', fr='wide', expr='neutral', cm='orbit', n=57, fc=[720, 800, 1.35])]
SC[4] += [S('rphone', fr='wide', expr='sad', cm='pull', n=58, fc=[440, 760, 1.35]),
          S('rphone', fr='waist', expr='worry', cm='orbit', n=59, fc=[440, 700, 1.3]),
          S('rapartment', fr='wide', dark=False, jexpr='neutral', cm='push', n=60, fc=[560, 800, 1.35])]
SC[5] += [S('rapartment', fr='waist', dark=True, reach=True, jexpr='speak', cm='push', n=61, fc=[560, 720, 1.3])]
SC[6] += [S('rwoods', fr='waist', run=False, cm='truck', n=62, fc=[480, 720, 1.3]),
          S('rclearing', fr='wide', c='mask', read=True, tar=0.4, cm='still', n=63, fc=[555, 760, 1.3]),
          S('rclearing', fr='waist', c='mask', unmask=True, tar=0.5, cm='pull', n=64, fc=[555, 720, 1.3])]
SC[7] += [S('rritual', fr='wide', c='mask', tar=0.7, tend=0.6, cm='truck', n=65, fc=[545, 700, 1.3]),
          S('rclearing', fr='wide', c='mask', read=True, tar=0.55, tend=0.5, cm='pull', n=66, fc=[555, 760, 1.3])]
SC[8] += [S('runleashed', fr='wide', c='mask', pp=0.2, cm='push', n=67, fc=[460, 760, 1.3]),
          S('runleashed', fr='waist', c='mask', pose2='loom', pp=0.6, cm='truck', n=68, fc=[460, 700, 1.28])]
SC[9] += [S('rhospital', fr='waist', expr='sad', cm='truck', n=69, fc=[540, 720, 1.3]),
          S('rhospital', fr='wide', tag=True, expr='worry', cm='orbit', n=70, fc=[640, 760, 1.3])]
SC[8] += [S('runleashed', fr='wide', c='mask', pose2='loom', pp=0.95, cm='pull', n=71, fc=[500, 760, 1.3])]
