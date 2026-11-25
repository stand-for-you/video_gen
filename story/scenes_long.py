# Scene table for the LONG video (16:9, src/SetsL.tsx). One list per beat of script_long.BEATS (15 beats).
# Each scene = (set, v). fr = framing (wide|waist|bust|close|detail). cm = camera override. fc = close focus [x,y,zoom].
# last=True marks the final shot of its beat. THE ONE-USE LAW: every (set,v) entry is a NEW picture — never repeated.
# The antagonist "mask" is tagged c='mask' wherever it is on screen (>= 8 shots), so the creature gate counts it.
def S(st, **v): return (st, v)
CEN = [960, 520, 1.45]
SC = [
 # 0 TEASER (creepiest first): the watcher in the library, Ethan turning, a close fearful face, the dark aisle
 [S('library', fr='wide', watch=True, expr='worry', cm='push', n=1, fc=[300, 460, 1.5]),
  S('face', fr='close', who='ethan', expr='fear', turn=0.2, tag='WATCHED', n=2, fc=[960, 360, 1.5]),
  S('library', fr='wide', watch=True, expr='fear', cm='truck', n=3, fc=[820, 480, 1.4]),
  S('library', fr='waist', expr='worry', cm='still', n=4, fc=[820, 420, 1.35]),
  S('library', fr='wide', watch=True, tag=True, expr='fear', cm='pull', n=5, fc=[300, 460, 1.5], last=True)],
 # 1 the cut line: "Let me take you back to the beginning."
 [S('library', fr='wide', expr='sad', cm='pull', n=6, fc=[820, 480, 1.4]),
  S('face', fr='bust', who='ethan', expr='sad', turn=-0.1, n=7, fc=[960, 360, 1.4], last=True)],
 # 2 A New Friend (the common room, games)
 [S('common', fr='wide', who='both', expr='smile', jexpr='smile', cm='push', n=8, fc=[760, 480, 1.4]),
  S('common', fr='waist', who='ethan', expr='smile', cm='still', n=9, fc=[640, 430, 1.35]),
  S('face', fr='bust', who='jack', expr='smile', warm=True, turn=0.1, n=10, fc=[960, 360, 1.4]),
  S('common', fr='wide', who='jack', jexpr='neutral', cm='truck', n=11, fc=[860, 480, 1.4]),
  S('common', fr='wide', who='both', expr='neutral', jexpr='smile', cm='pull', n=12, fc=[760, 480, 1.4], last=True)],
 # 3 The Girl From Class (Elisa; Jack pulls away)
 [S('hall', fr='wide', expr='smile', cm='push', n=13, fc=[1200, 480, 1.4]),
  S('face', fr='close', who='elisa', expr='smile', warm=False, turn=0.0, n=14, fc=[960, 360, 1.5]),
  S('common', fr='wide', who='jack', jexpr='sad', cm='still', n=15, fc=[860, 480, 1.4]),
  S('common', fr='waist', who='ethan', expr='worry', cm='truck', n=16, fc=[640, 430, 1.35]),
  S('hall', fr='wide', expr='neutral', cm='truck', n=17, fc=[1160, 480, 1.4], last=True)],
 # 4 Something Changed (cafeteria outburst)
 [S('cafeteria', fr='wide', cm='push', n=18, fc=[1120, 460, 1.4]),
  S('cafeteria', fr='wide', tray=True, cm='truck', n=19, fc=[1120, 480, 1.4]),
  S('face', fr='close', who='jack', expr='stern', turn=0.2, n=20, fc=[960, 360, 1.5]),
  S('cafeteria', fr='waist', cm='still', n=21, fc=[1200, 420, 1.35]),
  S('cafeteria', fr='wide', tray=True, cm='pull', n=22, fc=[1000, 480, 1.4], last=True)],
 # 5 Better Than Ever (hall; the wrong smile) + lead to credit later
 [S('hall', fr='wide', tag=True, expr='smile', cm='push', n=23, fc=[1200, 460, 1.4]),
  S('face', fr='close', who='elisa', expr='cruel', turn=-0.1, n=24, fc=[960, 360, 1.5]),
  S('hall', fr='waist', expr='cruel', cm='still', n=25, fc=[1200, 420, 1.35]),
  S('hall', fr='wide', expr='smile', cm='truck', n=26, fc=[1160, 480, 1.4], last=True)],
 # 6 The Phone Call
 [S('phone', fr='wide', expr='worry', cm='push', n=27, fc=[760, 460, 1.4]),
  S('face', fr='close', who='ethan', expr='worry', warm=True, turn=0.0, tag='ON THE PHONE', n=28, fc=[960, 360, 1.5]),
  S('phone', fr='waist', expr='fear', cm='still', n=29, fc=[760, 420, 1.35]),
  S('phone', fr='wide', tag=True, expr='fear', cm='truck', n=30, fc=[760, 460, 1.4], last=True)],
 # 7 Black Tears (apartment, lights off)
 [S('apartment', fr='wide', dark=False, jexpr='sad', cm='push', n=31, fc=[820, 460, 1.4]),
  S('apartment', fr='wide', dark=True, jexpr='fear', cm='still', n=32, fc=[820, 460, 1.4]),
  S('face', fr='close', who='jack', expr='fear', tears=True, turn=0.0, n=33, fc=[960, 360, 1.5]),
  S('apartment', fr='wide', dark=True, tears=True, tag=True, jexpr='fear', cm='truck', n=34, fc=[800, 460, 1.4]),
  S('apartment', fr='waist', dark=True, reach=True, jexpr='speak', cm='push', n=35, fc=[820, 420, 1.35]),
  S('face', fr='close', who='jack', expr='sad', tears=True, turn=0.2, n=36, fc=[960, 360, 1.5], last=True)],
 # 8 The Knock (door; Elisa's voice; Jack flees)
 [S('apartment', fr='wide', dark=True, ethan=True, jexpr='fear', cm='still', n=37, fc=[1000, 460, 1.4]),
  S('door', fr='wide', cm='push', n=38, fc=[1180, 460, 1.4]),
  S('door', fr='wide', ethan=True, cm='truck', n=39, fc=[700, 460, 1.4]),
  S('woods', fr='wide', run=True, cm='truck', n=40, fc=[960, 460, 1.4]),
  S('door', fr='waist', cm='still', n=41, fc=[1180, 440, 1.35], last=True)],
 # 9 The Clearing (the circle; Elisa unmasks; the book)  -- creature on screen
 [S('woods', fr='wide', run=False, cm='push', n=42, fc=[900, 460, 1.4]),
  S('clearing', fr='wide', c='mask', tar=0.35, cm='push', n=43, fc=[960, 440, 1.35]),
  S('clearing', fr='wide', c='mask', unmask=True, tag=True, tar=0.4, cm='truck', n=44, fc=[1100, 440, 1.35]),
  S('clearing', fr='wide', c='mask', read=True, tar=0.45, cm='still', n=45, fc=[700, 440, 1.35]),
  S('clearing', fr='waist', c='mask', tar=0.4, cm='push', n=46, fc=[955, 420, 1.3]),
  S('clearing', fr='wide', c='mask', unmask=True, tar=0.5, cm='pull', n=47, fc=[960, 440, 1.35], last=True)],
 # 10 The Ritual (the mask; the tar; tendrils rise) -- creature
 [S('ritual', fr='wide', c='mask', tar=0.6, tend=0.4, cm='push', n=48, fc=[955, 420, 1.35]),
  S('clearing', fr='wide', c='mask', read=True, tar=0.6, tend=0.5, cm='still', n=49, fc=[955, 440, 1.3]),
  S('ritual', fr='waist', c='mask', tar=0.75, tend=0.7, cm='push', n=50, fc=[955, 380, 1.3]),
  S('ritual', fr='wide', c='mask', tar=0.85, tend=0.9, cm='pull', n=51, fc=[955, 420, 1.35], last=True)],
 # 11 You Made Him Mad (it breaks free) -- creature
 [S('unleashed', fr='wide', c='mask', pose2='loom', pp=0.5, cm='still', n=52, fc=[820, 440, 1.35]),
  S('unleashed', fr='wide', c='mask', pp=0.3, cm='truck', n=53, fc=[820, 440, 1.35]),
  S('unleashed', fr='waist', c='mask', pp=0.7, cm='push', n=54, fc=[820, 380, 1.3]),
  S('unleashed', fr='wide', c='mask', pose2='loom', pp=0.9, cm='pull', n=55, fc=[900, 440, 1.35], last=True)],
 # 12 What I Lost (the hospital)
 [S('hospital', fr='wide', officer=True, expr='sad', cm='push', n=56, fc=[1000, 440, 1.35]),
  S('hospital', fr='wide', tag=True, expr='sad', cm='still', n=57, fc=[1120, 440, 1.35]),
  S('face', fr='close', who='ethan', expr='sad', warm=False, turn=0.1, n=58, fc=[960, 360, 1.5]),
  S('hospital', fr='waist', officer=True, expr='neutral', cm='truck', n=59, fc=[900, 420, 1.3], last=True)],
 # 13 credit
 [S('woods', fr='wide', run=False, cm='pull', n=60, fc=[900, 460, 1.4]),
  S('credit', fr='detail', n=61, last=True)],
 # 14 the closing question -> end screen (last 20 s)
 [S('end', fr='wide', n=62)],
]
# --- extra scenes (more variety per beat to satisfy the one-use law; every entry is a NEW picture) ---
SC[0] += [S('library', fr='wide', watch=True, expr='neutral', cm='orbit', n=70, fc=[300, 460, 1.5]),
          S('library', fr='waist', expr='fear', cm='rise', n=71, fc=[820, 420, 1.35])]
SC[3] += [S('hall', fr='waist', expr='worry', cm='still', n=72, fc=[1200, 420, 1.35])]
SC[4] += [S('cafeteria', fr='wide', tray=True, expr='stern', cm='rise', n=73, fc=[1120, 460, 1.4])]
SC[5] += [S('hall', fr='wide', tag=True, expr='cruel', cm='pull', n=74, fc=[1200, 460, 1.4]),
          S('hall', fr='waist', expr='neutral', cm='orbit', n=75, fc=[1160, 420, 1.35])]
SC[6] += [S('phone', fr='wide', expr='sad', cm='pull', n=76, fc=[760, 460, 1.4]),
          S('phone', fr='waist', expr='worry', cm='orbit', n=77, fc=[760, 420, 1.35])]
SC[8] += [S('woods', fr='wide', run=True, cm='push', n=78, fc=[900, 460, 1.4]),
          S('apartment', fr='waist', dark=True, ethan=True, jexpr='speak', cm='truck', n=79, fc=[1000, 440, 1.35])]
SC[10] += [S('ritual', fr='wide', c='mask', tar=0.65, tend=0.55, cm='truck', n=80, fc=[955, 420, 1.35]),
           S('clearing', fr='waist', c='mask', read=True, tar=0.55, tend=0.6, cm='pull', n=81, fc=[955, 420, 1.3])]
SC[11] += [S('unleashed', fr='wide', c='mask', pp=0.2, cm='push', n=82, fc=[820, 440, 1.35]),
           S('unleashed', fr='waist', c='mask', pose2='loom', pp=0.6, cm='truck', n=83, fc=[820, 380, 1.3]),
           S('unleashed', fr='wide', c='mask', pp=0.8, cm='still', n=84, fc=[900, 440, 1.35])]
SC[12] += [S('hospital', fr='wide', officer=True, expr='worry', cm='pull', n=85, fc=[1000, 440, 1.35]),
           S('hospital', fr='wide', expr='neutral', cm='orbit', n=86, fc=[900, 440, 1.35]),
           S('face', fr='bust', who='ethan', expr='worry', warm=False, turn=-0.1, n=87, fc=[960, 360, 1.4])]
SC[13] += [S('face', fr='bust', who='ethan', expr='sad', warm=False, turn=0.0, n=88, fc=[960, 360, 1.4])]
