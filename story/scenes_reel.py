# Scene table for the REEL (9:16, src/SetsR.tsx): one list per beat of script_reel.BEATS (11 beats). Coordinates are vertical.
def S(st, **v): return (st, v)
SC = [
 # 0 TEASER (creepiest first): the Long-Hair Woman behind the glass
 [S('rglass', fr='wide', n=1, cm='truck', fc=[650, 900, 1.5]), S('rglass', fr='close', close=True, n=2, expr='fear', fc=[700, 900, 1.6]),
  S('rlast', fr='bust', expr='fear', n=3, fc=[540, 900, 1.3]), S('rchamber', fr='wide', expr='sleepy', n=4, cm='push', fc=[540, 1000, 1.4]),
  S('rflat', fr='detail', n=5, fc=[500, 980, 1.4]), S('rglass', fr='wide', n=6, cm='push', fc=[650, 900, 1.5])],
 # 1 the experiment
 [S('rchamber', fr='wide', expr='sleepy', n=7, cm='truck', fc=[540, 1000, 1.4]), S('rglass', fr='wide', n=8, cm='still', fc=[650, 900, 1.5]), S('rlast', fr='bust', expr='sleepy', n=9, fc=[540, 900, 1.3])],
 # 2 the subject chosen, the nerves cut
 [S('rchamber', fr='wide', expr='neutral', n=10, cm='push', fc=[540, 1000, 1.4]), S('rglass', fr='close', close=True, n=11, expr='sleepy', fc=[700, 900, 1.6]), S('rwall', fr='wide', n=12, cm='truck', fc=[540, 1100, 1.4])],
 # 3 nothing reached him; four days; the voices
 [S('rchamber', fr='wide', expr='fear', n=13, cm='push', fc=[540, 1000, 1.4]), S('rlast', fr='bust', expr='worry', n=14, fc=[540, 900, 1.3]), S('rglass', fr='wide', n=15, cm='pull', fc=[650, 900, 1.5])],
 # 4 two days later: his dead wife
 [S('rghost', fr='wide', n=16, cm='truck', fc=[780, 1000, 1.4]), S('rlast', fr='bust', expr='speak', n=17, fc=[540, 900, 1.3]), S('rghost', fr='wide', n=18, cm='pull', fc=[780, 1000, 1.4])],
 # 5 a week of voices: the wall, the sedatives
 [S('rwall', fr='wide', n=19, cm='push', fc=[540, 1100, 1.4]), S('rchamber', fr='wide', expr='fear', n=20, cm='truck', fc=[540, 1000, 1.4]), S('rflat', fr='detail', n=21, fc=[500, 980, 1.4])],
 # 6 hostile voices, five hours
 [S('rlast', fr='bust', expr='shock', n=22, fc=[540, 900, 1.3]), S('rglass', fr='wide', ghost='grin', n=23, cm='push', fc=[650, 900, 1.5]), S('rwall', fr='wide', n=24, cm='truck', fc=[540, 1100, 1.4])],
 # 7 restraint and tears
 [S('rchamber', fr='wide', expr='worry', n=25, cm='truck', fc=[540, 1000, 1.4]), S('rlast', fr='bust', expr='sad', n=26, fc=[540, 900, 1.3]), S('rflat', fr='detail', n=27, fc=[500, 980, 1.4])],
 # 8 the last words, the flatline
 [S('rlast', fr='bust', expr='sad', n=28, fc=[540, 900, 1.3]), S('rchamber', fr='wide', expr='sad', n=29, cm='pull', fc=[540, 1000, 1.4]), S('rflat', fr='detail', n=30, fc=[500, 980, 1.4], last=True)],
 # 9 credit card
 [S('rqcard', n=31, last=True)],
 # 10 the closing question (last on-screen text)
 [S('rqend', n=32, last=True)],
]
# --- extra scenes (more variety per beat) ---
SC[1] += [S('rchamber', fr='wide', expr='fear', n=33, cm='push', fc=[540, 1000, 1.4]), S('rwall', fr='wide', n=34, cm='pull', fc=[540, 1100, 1.4]), S('rflat', fr='detail', n=35, fc=[500, 980, 1.4])]
SC[2] += [S('rlast', fr='bust', expr='fear', n=36, fc=[540, 900, 1.3]), S('rflat', fr='detail', n=37, fc=[500, 980, 1.4]), S('rglass', fr='wide', ghost='child', n=38, cm='still', fc=[650, 900, 1.5])]
SC[3] += [S('rglass', fr='wide', ghost='woman', n=39, cm='pull', fc=[650, 900, 1.5]), S('rwall', fr='wide', n=40, cm='truck', fc=[540, 1100, 1.4]), S('rlast', fr='bust', expr='neutral', n=41, fc=[540, 900, 1.3])]
SC[4] += [S('rchamber', fr='wide', expr='worry', n=42, cm='truck', fc=[540, 1000, 1.4]), S('rflat', fr='detail', n=43, fc=[500, 980, 1.4]), S('rglass', fr='wide', ghost='grin', n=44, cm='push', fc=[650, 900, 1.5])]
SC[5] += [S('rlast', fr='bust', expr='speak', n=45, fc=[540, 900, 1.3]), S('rchamber', fr='wide', expr='neutral', n=46, cm='pull', fc=[540, 1000, 1.4]), S('rglass', fr='wide', n=47, cm='truck', fc=[650, 900, 1.5])]
SC[6] += [S('rflat', fr='detail', n=48, fc=[500, 980, 1.4]), S('rwall', fr='wide', n=49, cm='push', fc=[540, 1100, 1.4]), S('rlast', fr='bust', expr='fear', n=50, fc=[540, 900, 1.3])]
SC[7] += [S('rglass', fr='wide', ghost='woman', n=51, cm='still', fc=[650, 900, 1.5]), S('rchamber', fr='wide', expr='sad', n=52, cm='push', fc=[540, 1000, 1.4]), S('rwall', fr='wide', n=53, cm='truck', fc=[540, 1100, 1.4])]
SC[8] += [S('rchamber', fr='wide', expr='sad', n=54, cm='truck', fc=[540, 1000, 1.4]), S('rglass', fr='wide', n=55, cm='pull', fc=[650, 900, 1.5]), S('rlast', fr='bust', expr='neutral', n=56, fc=[540, 900, 1.3])]
SC[9] += [S('rglass', fr='wide', ghost='woman', n=57, cm='truck', fc=[650, 900, 1.5]), S('rflat', fr='detail', n=58, fc=[500, 980, 1.4])]
SC[10] = [S('rchamber', fr='wide', expr='neutral', n=59, cm='still', fc=[540, 1000, 1.4])] + SC[10]
SC[0] += [S('rwall', fr='wide', n=64, cm='truck', fc=[540, 1100, 1.4])]
SC[1] += [S('rflat', fr='detail', n=60, fc=[500, 980, 1.4]), S('rwall', fr='wide', n=61, cm='push', fc=[540, 1100, 1.4])]
SC[2] += [S('rghost', fr='wide', n=62, cm='truck', fc=[780, 1000, 1.4]), S('rlast', fr='bust', expr='worry', n=63, fc=[540, 900, 1.3])]
SC[3] += [S('rglass', fr='wide', ghost='child', n=65, cm='still', fc=[650, 900, 1.5])]
SC[4] += [S('rwall', fr='wide', n=66, cm='pull', fc=[540, 1100, 1.4])]
SC[5] += [S('rghost', fr='wide', n=67, cm='push', fc=[780, 1000, 1.4])]
SC[8] += [S('rglass', fr='wide', ghost='woman', n=68, cm='truck', fc=[650, 900, 1.5])]
