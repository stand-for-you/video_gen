# Scene table for the REEL (9:16, its own vertical artwork in SetsR.tsx). One list per beat of script_reel.BEATS.
# Reel order: each scene's close-up ('fc' = x, y, zoom on the 1080x1920 canvas) follows its wide shot. 'last' = final shot of its beat.
def S(st, **v): return (st, v)
SC = [
 # 0 TEASER: the picture in Mary's sleep (first frame = the creepiest picture) -> back to the beginning
 [S('rphoto', dream=True, fc=[600, 520, 2.0]), S('rmarybed', dream=True, fc=[540, 560, 1.7]), S('rhand', eyes=True, fc=[420, 900, 1.6]), S('rdog', fc=[540, 1000, 1.5]), S('rdog', talk=True, k=1.2, y=860, eyes=1.1, fc=[540, 1020, 1.5]), S('rcrtoff', last=True)],
 # 1 1992: Mary's bulletin board; the link; 400 people saw it
 [S('rcity', era='1992', apt=True, fc=[790, 900, 1.6]), S('rbbs', mary=True, fc=[620, 880, 2.0]), S('rscreen', mode='bbs', fc=[540, 860, 1.8]), S('rscreen', mode='users', disk=True, fc=[540, 860, 1.6]), S('rbbsface', fc=[540, 760, 1.3])],
 # 2 the legend: no copy found; a dim room, a flash, a beckoning hand, a grinning dog
 [S('rscreen', mode='search', fc=[540, 860, 1.8]), S('rphoto', hand=False, dark=0.25, fc=[600, 560, 2.0]), S('rhand', x=200, y=900, rot=40, k=2.4, fc=[380, 880, 1.7]), S('rdog', k=1.3, y=860, fc=[540, 1050, 1.5]), S('rphoto', grin=1, ds=0.5, dy=1400, dark=0.12, fc=[600, 600, 1.8])],
 # 3 2007: the interview; the locked door; Terence says sorry
 [S('rcity', apt=True, seed=6, fc=[790, 900, 1.6]), S('rhall', fc=[540, 1000, 1.5]), S('rdoor', cry=True, feet=True, fc=[540, 600, 1.5]), S('rfaces', who='noah', bg='hall', expr='fear', fc=[540, 820, 1.25]), S('rfaces', who='terence', bg='hall', tears=True, fc=[540, 820, 1.25])],
 # 4 her email: fifteen years of the dog; spread the word; the floppy disk in the mail
 [S('rdorm', mode='inboxm', fc=[640, 980, 2.2]), S('rscreen', mode='letter', dev='laptop', fc=[540, 1000, 1.6]), S('rmarybed', dream=True, open=True, dark=0.4, fc=[330, 1070, 1.9]), S('rdog', talk=True, rot=-5, k=1.15, fc=[540, 1000, 1.5]), S('rfloppy', env=True, fc=[540, 900, 1.5])],
 # 5 she never used it; she planned to give it to me; the warning
 [S('rfloppy', glow=True, hand=True, fc=[540, 860, 1.4]), S('rfaces', who='mary', bg='dark', expr='fear', tears=True, fc=[540, 820, 1.25]), S('rscreen', mode='letter', dev='laptop', s=1.4, rot=-2, fc=[440, 1130, 2.3]), S('rfaces', who='noah', bg='dorm', expr='fear', rot=3, fc=[540, 820, 1.25])],
 # 6 Terence calls; Mary had died; the disk hissed as it melted
 [S('rfaces', who='terence', bg='hall', phone=True, expr='fear', x=500, fc=[500, 820, 1.25]), S('rburn', fc=[600, 1000, 1.6]), S('rburn', close=True, dark=0.2, fc=[540, 1100, 1.3])],
 # 7 a year later: "Smile"; just spreading the word; smile.jpg attached
 [S('rdorm', mode='inbox', nx=200, dark=0.42, fc=[640, 980, 2.2]), S('rscreen', mode='zahir', dev='laptop', fc=[300, 1150, 2.4]), S('rscreen', mode='attach', dev='laptop', fc=[540, 1000, 1.8]), S('rfaces', who='noah', bg='dorm', expr='neutral', glow='#8fe0d8', fc=[540, 820, 1.25])],
 # 8 would the dog come for me? pass it on? yes, I could
 [S('rnight', hand=True, eyes=True, fc=[700, 700, 1.4]), S('rreflect', dog=True, fc=[700, 900, 1.5]), S('rscreen', mode='article', dev='laptop', fc=[540, 1000, 1.7]), S('rfaces', who='noah', bg='dark', expr='speak', glow='#8fe0d8', fc=[540, 820, 1.25]), S('rdog', grin=1, k=1.35, y=840, dark=0.15, last=True)],
 # 9 credit
 [S('rqcard', credit=True)],
 # 10 closing question (last on-screen text)
 [S('rqcard')],
]
