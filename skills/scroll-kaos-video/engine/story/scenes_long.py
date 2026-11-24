# Scene table for the LONG video (16:9): one list of scenes per beat (same order as script_long.BEATS).
# Each scene = (set, variant dict). 'fc' = close-up focus (x, y, zoom) used when the scene is shown a second time. 'last' = always the final shot of its beat.
def S(st, **v): return (st, v)
SC = [
 # 0 TEASER: the picture in Mary's sleep (first frame = the creepiest picture)
 [S('photo', dream=True, fc=[1080, 360, 2.2]), S('marybed', dream=True, fc=[660, 520, 2.0]), S('hand', x=760, rot=60, fc=[760, 540, 1.8]), S('photo', grin=0.4, dx=1250, dark=0.3, fc=[260, 600, 2.2])],
 # 1 the dog with human teeth; it talks
 [S('photo', dx=960, ds=0.5, grin=0.7, fc=[960, 320, 2.0]), S('dogface', fc=[960, 720, 1.7]), S('dogface', rot=-6, k=1.15, y=560, eyes=1.2, fc=[960, 420, 1.8]), S('marybed', open=True, dark=0.4, fc=[660, 520, 2.2]), S('dogface', talk=True, k=1.3, y=600, last=True)],
 # 2 what did it want? -> back to the beginning
 [S('faces', who='mary', bg='dark', expr='fear', tears=True, fc=[960, 520, 1.4]), S('screen', mode='picture', x=960, fc=[960, 440, 2.2]), S('crtoff', last=True)],
 # 3 The Locked Door: summer 2007, a young writer
 [S('city', seed=3, fc=[960, 520, 1.5]), S('campus', fc=[960, 420, 1.6]), S('dorm', noah=True, mode='post', lamp=True, fc=[520, 260, 2.2]), S('notes', fc=[860, 460, 1.5]), S('faces', who='noah', bg='dorm', expr='speak', fc=[960, 520, 1.3])],
 # 4 Terence agreed; Chicago weekend; knocking
 [S('city', apt=True, seed=5, fc=[1490, 560, 1.8]), S('aptdoor', nx=420, walk=True, fc=[700, 300, 2.0]), S('aptdoor', open=1, nx=640, fc=[1100, 260, 2.2]), S('faces', who='terence', bg='hall', expr='speak', x=1000, fc=[1000, 520, 1.4])],
 # 5 Mary changed her mind; locked door
 [S('door', feet=True, fc=[960, 900, 1.8]), S('hall', tx=860, nx=1500, texpr='fear', tmode='idle', fc=[860, 230, 2.2]), S('faces', who='terence', bg='hall', expr='fear', x=900, rot=-4, fc=[900, 480, 1.5])],
 # 6 half an hour in the hallway; notes
 [S('hall', fc=[720, 220, 2.2]), S('door', hand=True, fc=[960, 560, 1.6]), S('notes', page=1, k=2, fc=[960, 520, 1.6]), S('faces', who='noah', bg='hall', expr='neutral', x=1000, turn=-0.4, fc=[1000, 520, 1.4])],
 # 7 crying behind the door; the same nightmare
 [S('door', cry=True, fc=[900, 420, 1.6]), S('hall', shadow=True, cry=True, fc=[960, 600, 1.7]), S('faces', who='noah', bg='hall', expr='fear', x=880, k=1.6, fc=[880, 500, 1.5]), S('notes', page=2, fc=[860, 520, 1.6])],
 # 8 Terence gives up; I leave
 [S('faces', who='terence', bg='hall', tears=True, x=940, fc=[940, 500, 1.5]), S('hall', texpr='neutral', nexpr='speak', tmode='shake', dark=0.3, fc=[1380, 230, 2.2]), S('aptdoor', open=0.3, nx=300, walk=True, dark=0.3, fc=[1100, 400, 1.6]), S('city', seed=7, train=False, dark=0.25, fc=[700, 500, 1.6])],
 # 9 smile.jpg: 1992, Mary's bulletin board
 [S('city', era='1992', apt=True, seed=9, fc=[1490, 500, 1.8]), S('bbs', mary=True, fc=[1060, 420, 2.2]), S('bbsface', fc=[960, 430, 1.5]), S('screen', mode='bbs', fc=[960, 440, 2.0]), S('bbs', mode='bbs', dark=0.35, fc=[760, 610, 2.4])],
 # 10 the link; 400 people saw it; silence
 [S('screen', mode='bbs', x=900, rot=-2, disk=True, fc=[900, 470, 2.4]), S('bbs', mary=True, mexpr='fear', mx=820, fc=[820, 300, 2.4]), S('screen', mode='users', fc=[960, 440, 2.0]), S('bbsface', expr='fear', x=900, k=1.25, fc=[900, 420, 1.5]), S('screen', mode='picture', x=1000, rot=2, s=1.6, fc=[1000, 400, 2.2])],
 # 11 2005: tenth grade, hooked on internet stories
 [S('teen', fc=[980, 420, 2.2]), S('faces', who='noah', bg='teen', expr='neutral', fc=[960, 500, 1.4]), S('screen', mode='search', fc=[960, 440, 2.0]), S('teen', nx=540, mode='forum', fc=[540, 300, 2.2])],
 # 12 the picture is nowhere
 [S('screen', mode='search', x=900, rot=-2, fc=[900, 400, 2.3]), S('teen', nx=840, dark=0.42, fc=[980, 420, 2.4]), S('faces', who='noah', bg='teen', expr='neutral', turn=0.5, x=1040, fc=[1040, 500, 1.5]), S('screen', mode='off', disk=True, fc=[960, 440, 1.8])],
 # 13 the fakes
 [S('fakes', fc=[700, 360, 1.8]), S('screen', mode='fakes', fc=[960, 440, 2.0]), S('fakes', noah=True, dark=0.35, fc=[1280, 360, 1.9]), S('faces', who='noah', bg='teen', expr='neutral', turn=-0.3, x=900, k=1.6, fc=[900, 500, 1.5])],
 # 14 seizures and fear; ridiculous; scared
 [S('photo', dark=0.35, grin=0.8, fc=[1080, 360, 2.0]), S('faces', who='noah', bg='teen', expr='fear', x=980, rot=3, fc=[980, 500, 1.5]), S('screen', mode='forum', fc=[960, 440, 2.0]), S('hand', x=900, rot=80, fc=[900, 560, 1.7])],
 # 15 The Legend: message boards, newsgroups, a big comedy forum
 [S('screen', mode='forum', x=900, rot=-1, disk=True, fc=[900, 420, 2.2]), S('screen', mode='post', dev='laptop', fc=[960, 480, 1.9]), S('bbs', mode='users', dark=0.4, fc=[1060, 420, 2.2]), S('city', seed=11, train=True, dark=0.2, fc=[1200, 450, 1.6]), S('teen', nx=620, mode='forum', dark=0.38, fc=[980, 420, 2.4])],
 # 16 the chain email
 [S('screen', mode='chain', fc=[960, 420, 2.0]), S('screen', mode='chain', x=1000, rot=2, disk=True, fc=[1000, 380, 2.4]), S('city', era='1992', seed=13, train=False, fc=[900, 500, 1.6]), S('faces', who='noah', bg='dark', expr='neutral', fc=[960, 500, 1.4])],
 # 17 what the witnesses describe: a dim room, a husky-like creature, a flash
 [S('photo', hand=False, dark=0.25, fc=[1080, 380, 2.0]), S('dogface', eyes=0.7, grin=0.4, fc=[960, 460, 1.6]), S('photo', hand=False, dx=880, ds=0.5, fc=[880, 330, 2.1]), S('faces', who='mary', bg='bbs', expr='neutral', x=980, gx=600, fc=[980, 480, 1.5])],
 # 18 the beckoning hand
 [S('hand', fc=[640, 560, 1.8]), S('photo', hy=500, dark=0.2, fc=[260, 520, 2.4]), S('hand', eyes=True, x=700, rot=95, k=2.7, fc=[1500, 420, 2.0])],
 # 19 the grin: very human teeth
 [S('dogface', k=1.25, y=440, fc=[960, 640, 1.6]), S('dogface', rot=8, x=900, grin=0.9, dark=0.2, fc=[900, 420, 1.8]), S('photo', dx=1000, ds=0.48, grin=1, hand=False, dark=0.15, fc=[1000, 300, 2.3])],
 # 20 behind their eyes, in their nightmares
 [S('marybed', dream=True, dark=0.5, fc=[1160, 240, 2.0]), S('faces', who='mary', bg='dark', expr='fear', glow='#8fe0d8', x=980, fc=[980, 480, 1.5]), S('photo', dream=True, dx=1200, grin=0.6, hand=False, fc=[1200, 340, 2.0]), S('faces', who='mary', bg='bbs', expr='fear', tears=True, x=900, k=1.4, fc=[900, 480, 1.5])],
 # 21 questions online; nobody answered; college
 [S('screen', mode='post', dev='laptop', x=900, mug=True, fc=[900, 460, 2.0]), S('dorm', noah=True, mode='search', nx=560, fc=[1080, 470, 2.2]), S('campus', dark=0.3, fc=[1200, 420, 1.7]), S('dorm', books=True, mode='off', fc=[850, 520, 2.0])],
 # 22 Mary's Letter: March 2008, an email
 [S('dorm', noah=True, mode='inboxm', view='three', nx=600, fc=[1080, 470, 2.4]), S('screen', mode='inboxm', dev='laptop', fc=[960, 450, 1.9])],
 # 23 sorry; "At the time, I was afraid."
 [S('screen', mode='letter', dev='laptop', fc=[960, 470, 2.0]), S('faces', who='mary', bg='dark', expr='fear', tears=True, x=980, rot=-3, fc=[980, 480, 1.5]), S('dorm', noah=True, mode='letter', nx=500, expr='fear', fc=[500, 260, 2.4])],
 # 24 fifteen years of the same dream; "It talks to me."
 [S('marybed', dream=True, open=True, fc=[660, 520, 2.2]), S('photo', dream=True, dx=1000, ds=0.46, dark=0.2, fc=[1000, 330, 2.1]), S('hand', x=820, rot=70, k=2.2, fc=[820, 560, 1.8]), S('faces', who='mary', bg='dark', expr='fear', x=940, rot=-6, fc=[940, 480, 1.5]), S('faces', who='mary', bg='bbs', expr='neutral', x=1000, gx=1400, rot=3, fc=[1000, 480, 1.4])],
 # 25 not really a dog; the offer: "Spread the word."
 [S('dogface', eyes=1.1, grin=0.8, x=1000, fc=[1000, 440, 1.8]), S('screen', mode='letter', dev='laptop', x=880, s=1.6, fc=[880, 440, 2.2]), S('photo', dx=1100, ds=0.52, dark=0.2, hy=540, fc=[1100, 330, 2.1]), S('dogface', talk=True, rot=-4, k=1.2, x=980, y=580, last=True)],
 # 26 the brown envelope; a single floppy disk
 [S('envelope', fc=[960, 600, 1.6]), S('envelope', open=True, hand=True, fc=[1140, 460, 1.8]), S('floppy', hand=True, fc=[960, 560, 1.6]), S('kitchen92', fc=[1180, 540, 2.4])],
 # 27 a stranger, a coworker, even Terence
 [S('kitchen92', terence=True, mx=1100, expr='fear', fc=[310, 400, 2.0]), S('floppy', glow=True, x=900, rot=6, k=1.8, fc=[900, 560, 1.5]), S('faces', who='mary', bg='dark', expr='neutral', turn=0, x=900, k=1.6, fc=[900, 480, 1.5]), S('city', era='1992', apt=True, seed=15, dark=0.3, fc=[1490, 560, 1.8])],
 # 28 she did nothing; fifteen years; the board went quiet
 [S('closet', lid=True, fc=[960, 340, 1.8]), S('floppy', box=True, glow=True, fc=[960, 560, 1.5]), S('screen', mode='users', x=1000, dark=0.3, fc=[1000, 440, 2.0]), S('marybed', dream=True, dark=0.45, open=True, fc=[1160, 240, 2.0]), S('bbs', mode='users', dark=0.5, fc=[1060, 430, 2.3])],
 # 29 she had planned to give the disk to me
 [S('faces', who='noah', bg='dorm', expr='fear', x=960, fc=[960, 500, 1.4]), S('floppy', hand=True, x=1000, rot=0, k=1.9, fc=[1000, 560, 1.5]), S('door', dark=0.35, fc=[960, 940, 1.7]), S('closet', lid=True, dark=0.4, fc=[1000, 300, 2.0])],
 # 30 she could not do it; that was why she locked the door
 [S('door', feet=True, dark=0.3, fc=[960, 900, 1.9]), S('faces', who='mary', bg='dark', expr='fear', tears=True, x=1000, rot=4, k=1.6, fc=[1000, 480, 1.5]), S('hall', who='terence', tx=800, texpr='fear', tmode='idle', dark=0.3, fc=[800, 230, 2.3])],
 # 31 the warning: "Stop while you are still whole."
 [S('screen', mode='letter', dev='laptop', x=1000, s=1.5, fc=[960, 640, 2.2]), S('faces', who='noah', bg='dorm', expr='fear', x=900, turn=0.3, fc=[900, 500, 1.5]), S('dorm', noah=True, mode='letter', nx=560, expr='fear', dark=0.45, fc=[1080, 470, 2.3])],
 # 32 The Diskette: Terence contacts me; Mary had died
 [S('faces', who='terence', bg='hall', phone=True, x=880, fc=[880, 480, 1.5]), S('faces', who='noah', bg='dorm', phone=True, expr='fear', x=900, fc=[900, 500, 1.4])],
 # 33 "Please. Do what she said."
 [S('faces', who='terence', bg='hall', phone=True, tears=True, expr='fear', x=900, k=1.6, fc=[900, 480, 1.5]), S('faces', who='noah', bg='dorm', phone=True, expr='neutral', x=980, k=1.6, fc=[980, 480, 1.4])],
 # 34 he burned the disk; it hissed like an animal
 [S('burn', disk=True, fc=[1100, 600, 1.9]), S('burn', close=True, fc=[960, 700, 1.4]), S('faces', who='terence', bg='yard', expr='fear', x=1000, fc=[1000, 480, 1.5]), S('burn', bx=1200, tx=800, expr='neutral', dark=0.3, fc=[800, 290, 2.3])],
 # 35 the obituaries
 [S('screen', mode='obit', dev='laptop', fc=[960, 400, 2.0]), S('dorm', noah=True, mode='obit', nx=540, dark=0.4, fc=[1080, 470, 2.3]), S('faces', who='noah', bg='dorm', expr='neutral', turn=-0.3, x=1000, fc=[1000, 500, 1.4])],
 # 36 leave it alone; final exams
 [S('finals', fc=[1300, 330, 1.9]), S('dorm', books=True, mode='off', lamp=False, wx=1500, fc=[850, 520, 2.0]), S('campus', dark=0.1, fc=[960, 400, 1.5])],
 # 37 Spread the Word: a year later, elzahir82, subject "Smile"
 [S('campus', dark=0.4, fc=[700, 420, 1.8]), S('dorm', noah=True, mode='inbox', nx=640, dark=0.4, fc=[1080, 470, 2.4]), S('screen', mode='inbox', dev='laptop', x=900, mug=True, fc=[900, 420, 2.2]), S('faces', who='noah', bg='dorm', expr='neutral', x=1060, k=1.35, fc=[1060, 500, 1.4])],
 # 38 "Just spreading the word."
 [S('screen', mode='zahir', dev='laptop', fc=[960, 480, 1.9]), S('dorm', noah=True, mode='zahir', nx=560, view='three', fc=[1080, 470, 2.3]), S('faces', who='noah', bg='dorm', expr='neutral', x=940, k=1.4, rot=-3, fc=[940, 500, 1.4])],
 # 39 the sideways smile (:
 [S('screen', mode='zahir', dev='laptop', x=1000, s=1.6, fc=[700, 620, 2.6]), S('faces', who='noah', bg='dark', expr='fear', x=960, k=1.7, fc=[960, 480, 1.5])],
 # 40 one attachment: smile.jpg
 [S('screen', mode='attach', dev='laptop', fc=[960, 470, 2.0]), S('faces', who='noah', bg='dorm', expr='neutral', glow='#8fe0d8', x=980, fc=[980, 500, 1.4]), S('dorm', noah=True, mode='attach', nx=600, dark=0.5, fc=[1080, 470, 2.4]), S('reflect', fc=[870, 520, 1.6])],
 # 41 what if the dog came to my dreams?
 [S('nightNoah', fc=[620, 560, 2.2]), S('reflect', dog=True, fc=[1100, 420, 1.6]), S('faces', who='noah', bg='dark', expr='fear', tears=True, x=1000, rot=4, fc=[1000, 480, 1.5]), S('photo', dream=True, dx=900, ds=0.47, grin=0.9, fc=[900, 330, 2.1])],
 # 42 fight it, or give in? who would I give it to?
 [S('nightNoah', hand=True, fc=[1600, 320, 1.8]), S('nightNoah', eyes=True, expr='neutral', fc=[1100, 400, 1.6]), S('faces', who='noah', bg='dark', expr='neutral', tears=True, x=920, k=1.6, fc=[920, 480, 1.5]), S('city', seed=17, train=True, dark=0.35, fc=[960, 520, 1.6])],
 # 43 the article: attach the picture as proof
 [S('screen', mode='article', dev='laptop', fc=[960, 480, 1.9]), S('dorm', noah=True, mode='article', nx=580, lamp=False, dark=0.5, fc=[1080, 470, 2.4]), S('faces', who='noah', bg='dorm', expr='speak', x=1000, rot=2, k=1.5, fc=[1000, 500, 1.4])],
 # 44 "Yes. Yes, I could."
 [S('reflect', dog=True, expr='speak', fc=[870, 520, 1.7]), S('faces', who='noah', bg='dark', expr='neutral', glow='#8fe0d8', x=960, k=1.8, fc=[960, 460, 1.5]), S('dogface', grin=1, k=1.45, y=600, dark=0.18, last=True)],
 # 45 credit line
 [S('qcard', credit=True)],
 # 46 closing question -> END SCREEN (handled in build_shots: single 'end' shot for the last 20 s)
 [S('end')],
]
