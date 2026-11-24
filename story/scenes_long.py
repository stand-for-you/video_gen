# Scene table for the LONG video (16:9, src/SetsL.tsx): one list per beat of script_long.BEATS (13 beats).
# Each scene = (set, variant). fr = framing class (wide | waist | bust | close | detail). cm = camera move override.
# fc = close-up focus [x, y, zoom] if the scene is shown again. last = the final shot of its beat. n = unique id (keeps variants distinct).
def S(st, **v): return (st, v)
SC = [
 # 0 TEASER (creepiest first): the Long-Hair Woman behind the glass, then a close look, the subject's fear, the recorder, the Grinner, the bed
 [S('glass', fr='wide', ghost='woman', n=1, cm='truck', fc=[1330, 420, 1.6]), S('glass', fr='close', ghost='woman', close=True, n=2, expr='fear', fc=[1500, 420, 1.6]),
  S('chambercu', fr='bust', expr='fear', tag=True, n=3, x=960, fc=[960, 420, 1.3]), S('recorder', fr='detail', n=4, fc=[1120, 540, 1.5]),
  S('glass', fr='wide', ghost='grin', n=5, cm='push', fc=[1200, 420, 1.5]), S('chamber', fr='wide', expr='sleepy', n=6, cm='truck', fc=[960, 620, 1.4], last=True)],
 # 1 "What did they want? Let us go back"
 [S('corridor', fr='wide', n=7, expr='worry', fc=[560, 600, 1.4]), S('recorder', fr='detail', rev=True, n=8, fc=[1120, 540, 1.5], last=True)],
 # 2 The Experiment (the scientists, the lab corridor)
 [S('corridor', fr='wide', n=9, expr='neutral', fc=[1000, 600, 1.4]), S('chamber', fr='wide', expr='sleepy', n=10, cm='push', fc=[960, 620, 1.4]),
  S('recorder', fr='detail', n=11, fc=[1120, 540, 1.5]), S('corridor', fr='wide', leave=True, n=12, fc=[1080, 600, 1.4]), S('glass', fr='wide', ghost='grin', n=13, cm='still', fc=[1200, 420, 1.5])],
 # 3 They chose an elderly man (the subject, the nerves cut)
 [S('chamber', fr='wide', expr='sleepy', n=14, cm='still', fc=[960, 620, 1.4]), S('chambercu', fr='bust', expr='sleepy', n=15, x=960, fc=[960, 420, 1.3]),
  S('glass', fr='wide', ghost='child', n=16, cm='push', fc=[1400, 420, 1.5]), S('recorder', fr='detail', rev=True, n=17, fc=[1120, 540, 1.5]),
  S('chamber', fr='wide', expr='neutral', n=18, cm='truck', fc=[960, 620, 1.4], last=True)],
 # 4 Alone with his thoughts
 [S('chambercu', fr='bust', expr='sleepy', n=19, x=900, fc=[960, 420, 1.3]), S('chamber', fr='wide', expr='fear', n=20, cm='push', fc=[960, 620, 1.4]),
  S('recorder', fr='detail', n=21, fc=[1120, 540, 1.5], last=True)],
 # 5 After four days: hushed voices
 [S('chambercu', fr='bust', expr='worry', n=22, x=980, fc=[980, 420, 1.3]), S('glass', fr='close', ghost='woman', close=True, n=23, expr='neutral', fc=[1480, 420, 1.6]),
  S('corridor', fr='wide', expr='fear', n=24, fc=[560, 600, 1.4]), S('chamber', fr='wide', expr='sleepy', n=25, cm='truck', fc=[960, 620, 1.4], last=True)],
 # 6 The voice of his wife (the Long-Hair Woman; the scientists; the names)
 [S('ghostbed', fr='wide', n=26, cm='truck', fc=[1240, 560, 1.4]), S('relatives', fr='wide', n=27, cm='push', fc=[420, 600, 1.4]),
  S('glass', fr='close', ghost='woman', close=True, n=28, expr='sleepy', fc=[1480, 420, 1.6]), S('chambercu', fr='bust', expr='speak', tag=True, n=29, x=960, fc=[960, 420, 1.3]),
  S('ghostbed', fr='wide', n=30, cm='pull', fc=[1240, 560, 1.4], last=True)],
 # 7 The voices never stop (the wall, the sedatives, the dreams)
 [S('wallhit', fr='wide', n=31, cm='truck', fc=[960, 620, 1.4]), S('chamber', fr='wide', expr='fear', n=32, cm='push', fc=[960, 620, 1.4]),
  S('chambercu', fr='bust', expr='fear', n=33, x=960, fc=[960, 420, 1.3]), S('child', fr='wide', n=34, cm='truck', fc=[1490, 560, 1.4]),
  S('recorder', fr='detail', n=35, fc=[1120, 540, 1.5]), S('wallhit', fr='wide', n=36, cm='push', fc=[960, 620, 1.4], last=True)],
 # 8 No heaven (the hostile voices, five hours)
 [S('chambercu', fr='bust', expr='shock', n=37, x=960, fc=[960, 420, 1.3]), S('relatives', fr='wide', n=38, cm='push', fc=[420, 600, 1.4]),
  S('glass', fr='close', ghost='grin', close=True, n=39, fc=[1480, 420, 1.6]), S('child', fr='wide', n=40, cm='pull', fc=[1490, 560, 1.4], last=True)],
 # 9 Soon he could not form a sentence (restraint, tears, two weeks)
 [S('chamber', fr='wide', expr='worry', n=41, cm='truck', fc=[960, 620, 1.4]), S('chambercu', fr='bust', expr='sad', n=42, x=960, fc=[960, 420, 1.3]),
  S('relatives', fr='wide', n=43, cm='truck', fc=[420, 600, 1.4]), S('glass', fr='wide', ghost='woman', n=44, cm='pull', fc=[1330, 420, 1.5]),
  S('child', fr='wide', n=45, cm='still', fc=[1490, 560, 1.4], last=True)],
 # 10 The last words (the turned head, the flatline)
 [S('lastlook', fr='bust', n=46, x=960, fc=[960, 420, 1.3]), S('chamber', fr='wide', expr='sad', n=47, cm='push', fc=[960, 620, 1.4]),
  S('glass', fr='wide', ghost='woman', n=48, cm='truck', fc=[1330, 420, 1.5]), S('flatline', fr='detail', n=49, fc=[960, 520, 1.5]),
  S('lastlook', fr='bust', expr='neutral', n=50, x=960, cm='pull', fc=[960, 420, 1.3], last=True)],
 # 11 credit (card)
 [S('credit', fr='detail', n=51), S('recorder', fr='detail', rev=False, n=52, fc=[1120, 540, 1.5], last=True)],
 # 12 the closing question -> end screen (last 20 s)
 [S('end', fr='wide', n=53)],
]
# --- extra scenes (more variety per beat; keeps re-shows low) ---
SC[2] += [S('corridor', fr='wide', n=60, expr='fear', cm='push', fc=[1000, 600, 1.4]), S('glass', fr='wide', ghost='woman', n=61, cm='pull', fc=[1330, 420, 1.5]), S('chambercu', fr='bust', expr='neutral', n=62, x=900, fc=[900, 420, 1.3])]
SC[3] += [S('chambercu', fr='bust', expr='worry', n=63, x=1000, fc=[1000, 420, 1.3]), S('corridor', fr='wide', leave=True, expr='neutral', n=64, cm='truck', fc=[1080, 600, 1.4]), S('recorder', fr='detail', rev=False, n=65, fc=[1120, 540, 1.5])]
SC[4] += [S('chamber', fr='wide', expr='neutral', n=66, cm='truck', fc=[960, 620, 1.4]), S('glass', fr='wide', ghost='child', n=67, cm='still', fc=[1400, 420, 1.5])]
SC[5] += [S('chamber', fr='wide', expr='worry', n=68, cm='pull', fc=[960, 620, 1.4]), S('recorder', fr='detail', rev=True, n=69, fc=[1120, 540, 1.5])]
SC[6] += [S('relatives', fr='wide', n=70, cm='truck', fc=[420, 600, 1.4]), S('chambercu', fr='bust', expr='sleepy', n=71, x=900, fc=[900, 420, 1.3]), S('glass', fr='wide', ghost='grin', n=72, cm='still', fc=[1250, 420, 1.5])]
SC[7] += [S('chamber', fr='wide', expr='sad', n=73, cm='push', fc=[960, 620, 1.4])]
SC[8] += [S('wallhit', fr='wide', n=74, cm='pull', fc=[960, 620, 1.4]), S('recorder', fr='detail', n=75, rev=True, fc=[1120, 540, 1.5])]
SC[9] += [S('recorder', fr='detail', n=76, fc=[1120, 540, 1.5]), S('corridor', fr='wide', expr='sad', n=77, cm='truck', fc=[560, 600, 1.4])]
SC[10] += [S('chamber', fr='wide', expr='neutral', n=78, cm='truck', fc=[960, 620, 1.4]), S('chambercu', fr='bust', expr='sad', n=79, x=980, fc=[980, 420, 1.3])]
SC[11] += [S('glass', fr='wide', ghost='woman', n=80, cm='truck', fc=[1330, 420, 1.5]), S('chamber', fr='wide', expr='sleepy', n=81, cm='still', fc=[960, 620, 1.4])]
