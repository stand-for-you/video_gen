# Scene table for the LONG video - "Eyeless Jack" (engine v0.5, 3D, sets in src/SetsL.tsx).
# ONE LIST PER SPOKEN SENTENCE (the sync law). Written as story/plan_long.txt, expanded by story/expand_long.py.
def S(st, **v): return (st, v)
SC = [
 #   0   8.1s [nar] You wake up in your own room, in the middle of the night, because something clos
 [S('bedroom', fr='wide', lamp=0, open=0, cm='push', dir=1), S('bedroom', fr='waist', lamp=0, open=0, cm='tilt', dir=-1), S('bedroom', fr='waist', lamp=0, open=0, cm='pull', dir=-1), S('bedroom', fr='detail', lamp=0, open=0, cm='arc', dir=1)],
 #   1   3.6s [nar] You open your eyes and you see only black.
 [S('bedroom', fr='bust', lamp=0, open=0, cm='truck', dir=-1), S('bedroom', fr='detail', lamp=0, open=0, cm='drop', dir=1)],
 #   2   2.6s [nar] You lie still and you listen.
 [S('bedroom', fr='waist', lamp=0, open=0, cm='crane', dir=1), S('bedroom', fr='bust', lamp=0, open=0, cm='orbit', dir=-1)],
 #   3   8.4s [nar] Then your eyes begin to work in the dark, and you understand that the black abov
 [S('over', fr='wide', sit=False, cm='vertigo', dir=-1), S('over', fr='waist', sit=False, cm='pan', dir=1), S('over', fr='bust', sit=False, cm='orbit', dir=1), S('over', fr='detail', sit=False, cm='drop', dir=1)],
 #   4   7.7s [nar] It is two empty holes, in a face with no eyes, leaning over you, close enough to
 [S('sockets', cm='arc', dir=1), S('over', fr='waist', sit=False, cm='tilt', dir=1), S('creature', fr='waist', pose='stand', cm='pan', dir=-1), S('over', fr='waist', sit=False, cm='orbit', dir=1)],
 #   5   6.0s [nar] Something dark is running out of those holes and down the side of its face.
 [S('sockets', cm='pull', dir=-1), S('over', fr='waist', sit=False, cm='push', dir=-1), S('creature', fr='waist', pose='stand', cm='tilt', dir=1)],
 #   6   4.5s [nar] This is the story of the thing people call Eyeless Jack.
 [S('creature', fr='wide', pose='stand', cm='drop', dir=1), S('creature', fr='waist', pose='stand', cm='truck', dir=-1), S('creature', fr='bust', pose='stand', cm='push', dir=-1)],
 #   7   2.4s [nar] Let us go back to the beginning.
 [S('house', fr='wide', mitch=False, door=0, cm='orbit', dir=-1), S('house', fr='waist', mitch=False, door=0, cm='crane', dir=1)],
 #   8   8.2s [nar] My name is Mitch, and until a few years ago I did not believe in anything I coul
 [S('house', fr='wide', mitch=False, door=0, cm='pan', dir=1), S('house', fr='waist', mitch=False, door=0, cm='vertigo', dir=-1), S('house', fr='bust', mitch=False, door=0, cm='crane', dir=-1), S('house', fr='detail', mitch=False, door=0, cm='truck', dir=-1)],
 #   9   2.3s [nar] I lost my house that spring.
 [S('house', fr='waist', mitch=False, door=0, cm='tilt', dir=-1)],
 #  10   5.9s [nar] The bank took it, the way banks do, slowly and then all at once.
 [S('house', fr='wide', mitch=False, door=0, cm='push', dir=1), S('house', fr='waist', mitch=False, door=0, cm='pull', dir=-1), S('house', fr='bust', mitch=False, door=0, cm='arc', dir=-1)],
 #  11   9.5s [nar] My older brother Edwin called me the same week and told me to stop being proud a
 [S('porch', fr='wide', door=0.4, mitch=True, expr='sad', cm='truck', dir=-1), S('porch', fr='waist', door=0.4, mitch=True, expr='sad', cm='drop', dir=1), S('porch', fr='bust', door=0.4, mitch=True, expr='sad', cm='pull', dir=1), S('porch', fr='detail', door=0.4, mitch=True, expr='sad', cm='arc', dir=1), S('porch', fr='close', door=0.4, mitch=True, expr='sad', cm='vertigo', dir=1)],
 #  12   7.9s [nar] We had not seen each other properly in ten years, so part of me was actually gla
 [S('porch', fr='waist', door=0.4, mitch=True, expr='sad', cm='crane', dir=1), S('porch', fr='bust', door=0.4, mitch=True, expr='sad', cm='orbit', dir=-1), S('porch', fr='detail', door=0.4, mitch=True, expr='sad', cm='drop', dir=-1)],
 #  13  13.4s [nar] His house was one of those cheap places at the end of a long street, with a wood
 [S('house', fr='wide', mitch=False, door=0, cm='vertigo', dir=-1), S('house', fr='waist', mitch=False, door=0, cm='crane', dir=1), S('house', fr='waist', mitch=False, door=0, cm='pan', dir=1), S('house', fr='detail', mitch=False, door=0, cm='orbit', dir=-1), S('house', fr='detail', mitch=False, door=0, cm='drop', dir=1)],
 #  14   2.1s [nar] It took me a week to unpack.
 [S('hall', fr='wide', mitch=True, lamp=1.0, cm='arc', dir=1)],
 #  15   6.2s [nar] Boxes in the hall, boxes on the landing, boxes down the side of the bed.
 [S('hall', fr='waist', mitch=True, lamp=1.0, cm='pull', dir=-1), S('hall', fr='bust', mitch=True, lamp=1.0, cm='push', dir=1)],
 #  16   4.0s [edwin]  'Take the back room. It is quiet, and the window gets the morning.'
 [S('kitchen', fr='wide', cup=0, mirror=False, mitch=False, cm='drop', dir=1)],
 #  17   1.9s [nar] The back room was quiet.
 [S('bedroom', fr='wide', lamp=0.5, open=0, cm='orbit', dir=-1)],
 #  18   2.8s [nar] That is the part I think about now.
 [S('bedroom', fr='waist', lamp=0.5, open=0, cm='pan', dir=1)],
 #  19   2.3s [nar] I slept well that first week.
 [S('bedroom', fr='wide', lamp=0.5, open=0, cm='tilt', dir=-1)],
 #  20   6.3s [nar] I remember thinking that this was the first time in a year that I had felt safe.
 [S('bedroom', fr='waist', lamp=0.5, open=0, cm='push', dir=1), S('bedroom', fr='bust', lamp=0.5, open=0, cm='pull', dir=-1)],
 #  21   4.1s [nar] About a week in, I woke up at one in the morning.
 [S('bedroom', fr='bust', lamp=0, open=0, expr='sleepy', cm='truck', dir=-1), S('bedroom', fr='detail', lamp=0, open=0, expr='sleepy', cm='drop', dir=1)],
 #  22   4.2s [nar] There was a sound coming from outside, under the window.
 [S('window7', fr='waist', open=0.15, lamp=0, cm='crane', dir=1), S('window7', fr='bust', open=0.15, lamp=0, cm='orbit', dir=-1)],
 #  23   6.9s [nar] A slow, careful rustling, the way something moves when it does not want to be he
 [S('yard', fr='wide', porch=0.9, cm='vertigo', dir=-1), S('yard', fr='waist', porch=0.9, cm='pan', dir=1), S('yard', fr='bust', porch=0.9, cm='orbit', dir=1)],
 #  24   3.8s [nar] I lay there and listened to it for a long time.
 [S('bedroom', fr='bust', lamp=0, open=0, expr='sleepy', cm='arc', dir=1)],
 #  25   3.8s [nar] I told myself it was a raccoon in the bins.
 [S('yard', fr='waist', porch=0.9, cm='pull', dir=-1)],
 #  26   1.5s [nar] We had raccoons.
 [S('yard', fr='wide', porch=0.9, cm='drop', dir=1)],
 #  27   3.4s [nar] Everybody on that street had raccoons.
 [S('house', fr='wide', mitch=False, door=0, cm='orbit', dir=-1)],
 #  28   3.5s [nar] So I turned over and I went back to sleep.
 [S('bedroom', fr='wide', lamp=0, open=0, cm='pan', dir=1)],
 #  29   4.3s [nar] In the morning I told Edwin about it over his coffee.
 [S('kitchen', fr='wide', cup=0, mirror=False, mitch=False, cm='tilt', dir=-1), S('kitchen', fr='waist', cup=0, mirror=False, mitch=False, cm='arc', dir=1)],
 #  30   4.7s [edwin]  'Raccoons. They get into everything out here. I will put a brick on the bin lid
 [S('kitchen', fr='waist', cup=0, mirror=False, mitch=False, cm='push', dir=1), S('kitchen', fr='bust', cup=0, mirror=False, mitch=False, cm='pull', dir=-1)],
 #  31   5.0s [nar] He put a brick on the bin lid, and we both forgot about it.
 [S('yard', fr='waist', porch=0.9, cm='truck', dir=-1), S('yard', fr='bust', porch=0.9, cm='drop', dir=1)],
 #  32   3.0s [nar] I want you to notice how easy that was.
 [S('bedroom', fr='waist', lamp=0, open=0, cm='crane', dir=1)],
 #  33   6.8s [nar] A noise outside, a simple answer, and a man can sleep for one more night.
 [S('bedroom', fr='wide', lamp=0, open=0, cm='vertigo', dir=-1), S('bedroom', fr='waist', lamp=0, open=0, cm='pan', dir=1), S('bedroom', fr='bust', lamp=0, open=0, cm='orbit', dir=1)],
 #  34   2.5s [nar] The next night was different.
 [S('bedroom', fr='wide', lamp=0, open=0, expr='sleepy', cm='arc', dir=1)],
 #  35   2.0s [nar] I did not wake up slowly.
 [S('bedroom', fr='bust', lamp=0, open=0, expr='sleepy', cm='pull', dir=-1)],
 #  36   8.8s [nar] I came awake all at once, the way you do when a sound belongs inside your room a
 [S('bedroom', fr='bust', lamp=0, open=0, expr='sleepy', cm='drop', dir=1), S('bedroom', fr='detail', lamp=0, open=0, expr='sleepy', cm='truck', dir=-1), S('bedroom', fr='close', lamp=0, open=0, expr='sleepy', cm='push', dir=-1)],
 #  37   5.0s [nar] I was almost sure I had heard my window being lifted open.
 [S('window7', fr='waist', open=0.9, lamp=0, cm='orbit', dir=-1), S('window7', fr='bust', open=0.9, lamp=0, cm='crane', dir=1)],
 #  38   7.7s [nar] And then a thump, soft and heavy, like a person landing on the floor with their 
 [S('window7', fr='wide', open=0.9, lamp=0, cm='pan', dir=1), S('window7', fr='waist', open=0.9, lamp=0, cm='vertigo', dir=-1), S('window7', fr='bust', open=0.9, lamp=0, cm='crane', dir=-1)],
 #  39   4.7s [nar] I sat straight up and I looked at every corner of that room.
 [S('bedroom', fr='waist', lamp=0, open=0.9, sit=True, expr='fear', cm='tilt', dir=-1), S('bedroom', fr='bust', lamp=0, open=0.9, sit=True, expr='fear', cm='arc', dir=1)],
 #  40   1.6s [nar] The window was shut.
 [S('window7', fr='detail', open=0.9, lamp=0, cm='push', dir=1)],
 #  41   2.5s [nar] The boxes were where I had left them.
 [S('bedroom', fr='detail', lamp=0, open=0.9, sit=True, expr='fear', cm='truck', dir=-1)],
 #  42   1.5s [nar] Nothing moved.
 [S('bedroom', fr='wide', lamp=0, open=0.9, sit=True, expr='fear', cm='crane', dir=1)],
 #  43   7.2s [nar] I listened until my ears were ringing with the effort, and the house gave me not
 [S('bedroom', fr='bust', lamp=0, open=0.9, sit=True, expr='fear', cm='vertigo', dir=-1), S('bedroom', fr='detail', lamp=0, open=0.9, sit=True, expr='fear', cm='pan', dir=1), S('bedroom', fr='close', lamp=0, open=0.9, sit=True, expr='fear', cm='orbit', dir=1)],
 #  44   8.2s [nar] After a while I told myself I had been dreaming, and I lay down again with my ba
 [S('bedroom', fr='waist', lamp=0, open=0.9, sit=True, expr='fear', cm='arc', dir=1), S('bedroom', fr='bust', lamp=0, open=0.9, sit=True, expr='fear', cm='tilt', dir=-1), S('bedroom', fr='detail', lamp=0, open=0.9, sit=True, expr='fear', cm='pan', dir=-1)],
 #  45   1.1s [nar] I slept.
 [S('bedroom', fr='wide', lamp=0, open=0.9, sit=True, expr='fear', cm='pull', dir=-1)],
 #  46   5.2s [nar] That is the thing I cannot explain to anybody who has not been through it.
 [S('bedroom', fr='bust', lamp=0, open=0.9, sit=True, expr='fear', cm='drop', dir=1), S('bedroom', fr='detail', lamp=0, open=0.9, sit=True, expr='fear', cm='truck', dir=-1)],
 #  47   1.4s [nar] I slept.
 [S('bedroom', fr='wide', lamp=0, open=0.9, sit=True, expr='fear', cm='orbit', dir=-1)],
 #  48   5.6s [nar] The next morning I walked into the kitchen, and Edwin dropped his cup.
 [S('kitchen', fr='wide', cup=1, mirror=True, mitch=True, eexpr='shock', expr='calm', cm='pan', dir=1), S('kitchen', fr='waist', cup=1, mirror=True, mitch=True, eexpr='shock', expr='calm', cm='vertigo', dir=-1)],
 #  49   4.9s [nar] It hit the floor and broke and he did not even look at it.
 [S('kitchen', fr='detail', cup=1, mirror=True, mitch=True, eexpr='shock', expr='calm', cm='tilt', dir=-1), S('kitchen', fr='close', cup=1, mirror=True, mitch=True, eexpr='shock', expr='calm', cm='arc', dir=1)],
 #  50   2.1s [nar] He was looking at my face.
 [S('kitchen', fr='bust', cup=1, mirror=True, mitch=True, eexpr='shock', expr='calm', cm='push', dir=1)],
 #  51   2.9s [edwin]  'Mitch. Do not touch it. Just stand there.'
 [S('kitchen', fr='waist', cup=1, mirror=True, mitch=True, eexpr='shock', expr='calm', cm='truck', dir=-1)],
 #  52   6.2s [nar] He took the little mirror off the shelf by the door and held it up in front of m
 [S('mirror', fr='waist', cm='crane', dir=1), S('mirror', fr='bust', cm='orbit', dir=-1)],
 #  53   2.7s [nar] There was a long cut down my left cheek.
 [S('mirror', fr='bust', cm='vertigo', dir=-1)],
 #  54   6.8s [nar] Clean, straight, and nothing like a scratch from a nail or a corner of a box.
 [S('mirror', fr='bust', cm='arc', dir=1), S('mirror', fr='detail', cm='tilt', dir=-1), S('mirror', fr='close', cm='pan', dir=-1)],
 #  55   1.6s [nar] I had not felt it.
 [S('mirror', fr='waist', cm='pull', dir=-1)],
 #  56   4.6s [nar] I had slept through the whole night and I had not felt a thing.
 [S('mirror', fr='bust', cm='drop', dir=1), S('mirror', fr='detail', cm='truck', dir=-1)],
 #  57   7.7s [nar] Edwin drove me to the hospital with both hands tight on the wheel and the radio 
 [S('car', fr='wide', cm='orbit', dir=-1), S('car', fr='waist', cm='crane', dir=1), S('car', fr='bust', cm='truck', dir=1)],
 #  58   4.8s [nar] The doctor cleaned the cut and asked me the questions they ask.
 [S('ward', fr='wide', doc=True, chart=True, cm='pan', dir=1), S('ward', fr='waist', doc=True, chart=True, cm='vertigo', dir=-1)],
 #  59   7.1s [doc]  'Do you drink before bed? Do you take anything to sleep? Has anyone in your fam
 [S('ward', fr='waist', doc=True, chart=True, cm='tilt', dir=-1), S('ward', fr='bust', doc=True, chart=True, cm='arc', dir=1), S('ward', fr='detail', doc=True, chart=True, cm='vertigo', dir=1)],
 #  60   4.4s [nar] I said no to all of it, and he wrote it down anyway.
 [S('ward', fr='bust', doc=True, chart=True, cm='push', dir=1), S('ward', fr='detail', doc=True, chart=True, cm='pull', dir=-1)],
 #  61   7.5s [doc]  'The most likely answer is that you did this to yourself while you were asleep.
 [S('ward', fr='waist', doc=True, chart=True, cm='truck', dir=-1), S('ward', fr='bust', doc=True, chart=True, cm='drop', dir=1), S('ward', fr='detail', doc=True, chart=True, cm='pull', dir=1)],
 #  62   2.0s [nar] I was ready to believe him.
 [S('ward', fr='bust', doc=True, chart=True, cm='crane', dir=1)],
 #  63   1.9s [nar] I wanted to believe him.
 [S('ward', fr='bust', doc=True, chart=True, cm='vertigo', dir=-1)],
 #  64   4.1s [nar] A sleepwalking man is a problem you can fix.
 [S('ward', fr='wide', doc=True, chart=True, cm='arc', dir=1), S('ward', fr='waist', doc=True, chart=True, cm='tilt', dir=-1)],
 #  65   7.9s [nar] Then he stopped writing, and his face changed, and he asked me to lie back and l
 [S('ward', fr='waist', doc=True, chart=True, cm='pull', dir=-1), S('ward', fr='bust', doc=True, chart=True, cm='push', dir=1), S('ward', fr='detail', doc=True, chart=True, cm='tilt', dir=1)],
 #  66   3.5s [nar] He did not say anything for a long moment.
 [S('ward', fr='bust', doc=True, chart=True, cm='drop', dir=1)],
 #  67   6.8s [doc]  'Mitch. There is a surgical cut in your side, and it has been closed again with
 [S('ward', fr='waist', doc=True, chart=True, cm='orbit', dir=-1), S('ward', fr='bust', doc=True, chart=True, cm='crane', dir=1), S('ward', fr='detail', doc=True, chart=True, cm='truck', dir=1)],
 #  68   5.1s [nar] He turned the screen of the scanner round so that I could see it myself.
 [S('ward', fr='detail', doc=True, chart=True, cm='pan', dir=1), S('ward', fr='close', doc=True, chart=True, cm='vertigo', dir=-1)],
 #  69   7.2s [nar] I am not a doctor and even I could see that there was a space where something sh
 [S('ward', fr='detail', doc=True, chart=True, cm='tilt', dir=-1), S('ward', fr='close', doc=True, chart=True, cm='arc', dir=1), S('ward', fr='wide', doc=True, chart=True, cm='vertigo', dir=1)],
 #  70   5.9s [doc]  'You have lost your left kidney. Some time last night. I am sorry. We do not kn
 [S('ward', fr='waist', doc=True, chart=True, cm='push', dir=1), S('ward', fr='bust', doc=True, chart=True, cm='pull', dir=-1)],
 #  71   3.3s [nar] I remember the sound of the clock on that wall.
 [S('ward', fr='wide', doc=True, chart=True, cm='truck', dir=-1)],
 #  72   3.5s [nar] I remember a trolley going past the door.
 [S('corridor', fr='wide', people=1, cm='crane', dir=1)],
 #  73   6.2s [nar] I remember the word last night, sitting in the middle of the room like a stone.
 [S('ward', fr='bust', doc=True, chart=True, cm='vertigo', dir=-1), S('ward', fr='detail', doc=True, chart=True, cm='pan', dir=1)],
 #  74   9.7s [nar] Somebody had opened me up while I slept, taken a piece of me out, closed me agai
 [S('window7', fr='wide', open=0.9, lamp=0, cm='arc', dir=1), S('window7', fr='waist', open=0.9, lamp=0, cm='tilt', dir=-1), S('window7', fr='bust', open=0.9, lamp=0, cm='pan', dir=-1), S('window7', fr='detail', open=0.9, lamp=0, cm='orbit', dir=-1)],
 #  75  11.9s [nar] This story is my own retelling of the creepypasta Eyeless Jack, first posted by 
 [S('creature', fr='wide', pose='stand', cm='pull', dir=-1), S('creature', fr='waist', pose='stand', cm='push', dir=1), S('creature', fr='bust', pose='stand', cm='tilt', dir=1), S('creature', fr='detail', pose='stand', cm='pan', dir=1)],
 #  76   8.3s [nar] They kept me in for the day and sent me home with painkillers and a sheet of pap
 [S('corridor', fr='wide', people=1, cm='drop', dir=1), S('corridor', fr='waist', people=1, cm='truck', dir=-1), S('corridor', fr='bust', people=1, cm='push', dir=-1)],
 #  77   5.1s [nar] Edwin wanted me to sleep on the couch, downstairs, near him.
 [S('hall', fr='wide', mitch=False, lamp=1.0, cm='orbit', dir=-1), S('hall', fr='waist', mitch=False, lamp=1.0, cm='crane', dir=1)],
 #  78   3.4s [nar] I said I would be fine in the back room.
 [S('bedroom', fr='wide', lamp=0, open=0, cm='pan', dir=1)],
 #  79   1.8s [nar] I was not being brave.
 [S('bedroom', fr='bust', lamp=0, open=0, cm='tilt', dir=-1)],
 #  80   2.0s [nar] I think I wanted to know.
 [S('bedroom', fr='waist', lamp=0, open=0, cm='push', dir=1)],
 #  81   9.7s [nar] I lay in that bed with the lamp off and the painkillers moving in my blood, and 
 [S('bedroom', fr='wide', lamp=0, open=0, cm='truck', dir=-1), S('bedroom', fr='waist', lamp=0, open=0, cm='drop', dir=1), S('bedroom', fr='bust', lamp=0, open=0, cm='pull', dir=1), S('bedroom', fr='detail', lamp=0, open=0, cm='arc', dir=1)],
 #  82   4.6s [nar] Around midnight I opened my eyes, and it was there.
 [S('over', fr='wide', sit=False, cm='crane', dir=1), S('over', fr='waist', sit=False, cm='orbit', dir=-1)],
 #  83   9.4s [nar] It was standing over my bed, bent forward at the waist, close enough that I coul
 [S('over', fr='waist', sit=False, cm='vertigo', dir=-1), S('over', fr='bust', sit=False, cm='pan', dir=1), S('over', fr='detail', sit=False, cm='orbit', dir=1)],
 #  84   2.5s [nar] A black hooded top, the hood up.
 [S('sockets', cm='arc', dir=1)],
 #  85   6.8s [nar] A face the colour of old grey paint, with no nose and no mouth at all.
 [S('sockets', cm='pull', dir=-1), S('over', fr='waist', sit=False, cm='push', dir=-1), S('creature', fr='waist', pose='stand', cm='tilt', dir=1)],
 #  86   7.5s [nar] And where the eyes should have been there were two black holes that went back fu
 [S('sockets', cm='drop', dir=1), S('over', fr='waist', sit=False, cm='truck', dir=1), S('creature', fr='waist', pose='stand', cm='push', dir=-1)],
 #  87   9.6s [nar] Something dark was running slowly out of both of them, down what would have been
 [S('sockets', cm='orbit', dir=-1), S('over', fr='waist', sit=False, cm='crane', dir=-1), S('creature', fr='waist', pose='stand', cm='truck', dir=1), S('over', fr='waist', sit=False, cm='push', dir=-1)],
 #  88   1.5s [nar] I did not scream.
 [S('over', fr='bust', sit=True, expr='fear', tremble=0.5, cm='pan', dir=1)],
 #  89   4.6s [nar] I want to be honest about that, because people always ask.
 [S('over', fr='bust', sit=True, expr='fear', tremble=0.5, cm='tilt', dir=-1), S('over', fr='detail', sit=True, expr='fear', tremble=0.5, cm='arc', dir=1)],
 #  90   2.0s [nar] I did not make a sound.
 [S('over', fr='bust', sit=True, expr='fear', tremble=0.5, cm='push', dir=1)],
 #  91   7.8s [nar] My hand went sideways, on its own, to the little shelf by the bed where I kept m
 [S('camera', cm='truck', dir=-1), S('bedroom', fr='detail', lamp=0, open=0.9, cm='drop', dir=-1), S('bedroom', fr='bust', lamp=0, open=0.9, cm='pull', dir=1)],
 #  92   3.1s [nar] I lifted it, and I took the picture.
 [S('camera', fr='detail', cm='crane', dir=1)],
 #  93  11.9s [nar] The flash filled that room for half a second, and in that half a second I saw al
 [S('flash', cm='vertigo', dir=-1), S('over', fr='waist', sit=False, cm='pan', dir=-1), S('creature', fr='wide', pose='stand', cm='orbit', dir=1), S('over', fr='waist', sit=False, cm='drop', dir=-1)],
 #  94   3.7s [nar] Then the dark came back, and it came at me.
 [S('flash', cm='arc', dir=1)],
 #  95   6.3s [nar] It was fast, and it was strong, and it went for my chest with both hands.
 [S('flash', cm='pull', dir=-1), S('over', fr='waist', sit=False, cm='push', dir=-1)],
 #  96   9.2s [nar] I got my foot up between us and I kicked it in the face as hard as a man with st
 [S('flash', cm='drop', dir=1), S('over', fr='waist', sit=False, cm='truck', dir=1), S('creature', fr='wide', pose='stand', cm='push', dir=-1)],
 #  97   6.6s [nar] It went backwards into the boxes and I was out of that bed and through the door.
 [S('hall', fr='wide', mitch=True, lamp=1.0, pose='run', expr='fear', cm='orbit', dir=-1), S('hall', fr='waist', mitch=True, lamp=1.0, pose='run', expr='fear', cm='crane', dir=1)],
 #  98   3.0s [nar] I grabbed my wallet off the hall table.
 [S('hall', fr='detail', mitch=True, lamp=1.0, pose='run', expr='fear', cm='pan', dir=1)],
 #  99   1.5s [nar] I do not know why.
 [S('hall', fr='waist', mitch=True, lamp=1.0, pose='run', expr='fear', cm='tilt', dir=-1)],
 # 100   1.9s [nar] You do strange things.
 [S('hall', fr='wide', mitch=True, lamp=1.0, pose='run', expr='fear', cm='push', dir=1)],
 # 101   9.7s [nar] I went out of the front door in bare feet and I ran down that long street with t
 [S('house', fr='wide', mitch=True, run=True, pose='run', expr='fear', door=0.7, cm='truck', dir=-1), S('house', fr='waist', mitch=True, run=True, pose='run', expr='fear', door=0.7, cm='drop', dir=1), S('house', fr='bust', mitch=True, run=True, pose='run', expr='fear', door=0.7, cm='pull', dir=1), S('house', fr='detail', mitch=True, run=True, pose='run', expr='fear', door=0.7, cm='arc', dir=1)],
 # 102   2.0s [nar] I did not shout for Edwin.
 [S('house', fr='waist', mitch=True, run=True, pose='run', expr='fear', door=0.7, cm='crane', dir=1)],
 # 103   1.9s [nar] I did not go back for him.
 [S('porch', fr='wide', door=0.7, mitch=True, cm='vertigo', dir=-1)],
 # 104   2.8s [nar] I have had a long time to think about that.
 [S('house', fr='waist', mitch=True, run=True, pose='run', expr='fear', door=0.7, cm='arc', dir=1)],
 # 105   7.4s [nar] At the end of the street I went over the fence and into the pine woods behind th
 [S('woods', fr='wide', amber=0.5, pose='run', cm='pull', dir=-1), S('woods', fr='waist', amber=0.5, pose='run', cm='push', dir=1), S('woods', fr='bust', amber=0.5, pose='run', cm='tilt', dir=1)],
 # 106   2.7s [nar] There was no moon under those trees.
 [S('woods', fr='wide', amber=0.5, pose='run', cm='drop', dir=1)],
 # 107   5.4s [nar] There was no path either, and I was running on roots and stones.
 [S('woods', fr='waist', amber=0.5, pose='run', cm='orbit', dir=-1), S('woods', fr='bust', amber=0.5, pose='run', cm='crane', dir=1)],
 # 108   8.2s [nar] I remember the cold, and my own breath, and the stitches in my side pulling with
 [S('woods', fr='waist', amber=0.15, pose='run', cm='pan', dir=1), S('woods', fr='bust', amber=0.15, pose='run', cm='vertigo', dir=-1), S('woods', fr='detail', amber=0.15, pose='run', cm='crane', dir=-1)],
 # 109   6.5s [nar] I remember looking back once and seeing nothing at all, which was somehow worse.
 [S('woods', fr='wide', amber=0.15, pose='run', cm='tilt', dir=-1), S('woods', fr='waist', amber=0.15, pose='run', cm='arc', dir=1)],
 # 110   8.3s [nar] Then my foot caught a rock and the ground came up and hit me, and the woods went
 [S('woods', fr='bust', amber=0.15, pose='fall', cm='push', dir=1), S('woods', fr='detail', amber=0.15, pose='fall', cm='pull', dir=-1), S('woods', fr='close', amber=0.15, pose='fall', cm='arc', dir=-1)],
 # 111   7.0s [nar] I woke up in a hospital bed with a drip in my arm and daylight on the wall.
 [S('ward', fr='wide', doc=True, chart=False, cm='truck', dir=-1), S('ward', fr='waist', doc=True, chart=False, cm='drop', dir=1), S('ward', fr='bust', doc=True, chart=False, cm='pull', dir=1)],
 # 112   1.7s [nar] It was the same doctor.
 [S('ward', fr='waist', doc=True, chart=False, cm='crane', dir=1)],
 # 113   8.3s [nar] He came in with my notes under his arm and he sat down, which nobody does when t
 [S('ward', fr='waist', doc=True, chart=False, cm='vertigo', dir=-1), S('ward', fr='bust', doc=True, chart=False, cm='pan', dir=1), S('ward', fr='detail', doc=True, chart=False, cm='orbit', dir=1)],
 # 114   3.2s [doc]  'There is good news and bad news, Mitch.'
 [S('ward', fr='waist', doc=True, chart=False, cm='arc', dir=1)],
 # 115   7.8s [doc]  'The good news is that you were lucky. Cuts, bruises, a mild concussion. Your p
 [S('ward', fr='bust', doc=True, chart=False, cm='pull', dir=-1), S('ward', fr='detail', doc=True, chart=False, cm='push', dir=1), S('ward', fr='close', doc=True, chart=False, cm='tilt', dir=1)],
 # 116   4.7s [nar] I let out a breath I think I had been holding since midnight.
 [S('ward', fr='bust', doc=True, chart=False, cm='drop', dir=1), S('ward', fr='detail', doc=True, chart=False, cm='truck', dir=-1)],
 # 117   6.7s [doc]  'The bad news is that your brother was found in the house this morning. He was 
 [S('ward', fr='waist', doc=True, chart=False, cm='orbit', dir=-1), S('ward', fr='bust', doc=True, chart=False, cm='crane', dir=1)],
 # 118   1.4s [mitch]  'Killed by what?'
 [S('ward', fr='bust', doc=True, chart=False, cm='pan', dir=1)],
 # 119   8.5s [nar] He looked at the floor, and then he looked at me, and he told me the truth, whic
 [S('ward', fr='wide', doc=True, chart=False, cm='tilt', dir=-1), S('ward', fr='waist', doc=True, chart=False, cm='arc', dir=1), S('ward', fr='bust', doc=True, chart=False, cm='vertigo', dir=1)],
 # 120   7.7s [nar] I had kicked it in the face and run out of the house, and it had not followed me
 [S('house', fr='wide', mitch=False, door=0, cm='push', dir=1), S('house', fr='waist', mitch=False, door=0, cm='pull', dir=-1), S('house', fr='bust', mitch=False, door=0, cm='arc', dir=-1)],
 # 121   1.7s [nar] It had not needed to.
 [S('far', shake=0.3, cm='truck', dir=-1)],
 # 122   3.3s [nar] There was already somebody in that house.
 [S('far', shake=0.3, cm='crane', dir=1)],
 # 123   5.0s [nar] Three days later my parents drove me back to get my things.
 [S('car', fr='wide', cm='vertigo', dir=-1), S('car', fr='waist', cm='pan', dir=1)],
 # 124   1.9s [nar] They waited in the car.
 [S('car', fr='waist', cm='arc', dir=1)],
 # 125   7.2s [nar] My mother did not want to go in and my father did not want to leave her out ther
 [S('car', fr='wide', cm='pull', dir=-1), S('car', fr='waist', cm='push', dir=1), S('car', fr='bust', cm='tilt', dir=1)],
 # 126   3.9s [nar] The porch light was still on in the middle of the day.
 [S('porch', fr='wide', door=0.7, mitch=False, cm='drop', dir=1)],
 # 127   2.1s [nar] Edwin always forgot it.
 [S('porch', fr='waist', door=0.7, mitch=False, cm='orbit', dir=-1)],
 # 128  10.0s [nar] I went up the stairs to the back room and I made myself calm, the way you do whe
 [S('bedroom', fr='wide', lamp=0.5, open=0, cm='pan', dir=1), S('bedroom', fr='waist', lamp=0.5, open=0, cm='vertigo', dir=-1), S('bedroom', fr='bust', lamp=0.5, open=0, cm='crane', dir=-1), S('bedroom', fr='detail', lamp=0.5, open=0, cm='truck', dir=-1)],
 # 129   4.7s [nar] My camera was still on the shelf where my hand had left it.
 [S('camera', cm='tilt', dir=-1), S('bedroom', fr='detail', lamp=0.5, open=0, cm='arc', dir=-1)],
 # 130   2.1s [nar] I put it in my pocket.
 [S('camera', fr='detail', cm='push', dir=1)],
 # 131   7.9s [nar] And then I stopped, because I could see along the hallway from there, and the ha
 [S('far', shake=0.3, cm='truck', dir=-1), S('hall', fr='waist', mitch=False, lamp=1.0, cm='drop', dir=-1), S('hall', fr='wide', mitch=False, lamp=1.0, cm='pull', dir=1)],
 # 132   6.3s [nar] I am not going to describe what the police had already photographed in that hous
 [S('far', shake=0.3, cm='crane', dir=1), S('hall', fr='waist', mitch=False, lamp=1.0, cm='orbit', dir=1)],
 # 133   5.5s [nar] My brother was at the far end of it, and that is all I will say.
 [S('far', shake=0.3, cm='vertigo', dir=-1), S('hall', fr='waist', mitch=False, lamp=1.0, cm='pan', dir=-1)],
 # 134   6.4s [nar] There was something small lying on the floor beside him, wrapped in a piece of c
 [S('far', shake=0.3, cm='arc', dir=1), S('hall', fr='waist', mitch=False, lamp=1.0, cm='tilt', dir=1)],
 # 135   7.1s [nar] I picked it up without thinking, the way you pick up anything that does not belo
 [S('seat', fr='detail', open=False, cm='pull', dir=-1), S('seat', fr='close', open=False, cm='push', dir=1), S('seat', fr='wide', open=False, cm='tilt', dir=1)],
 # 136   9.4s [nar] I carried it out past my mother and my father and I sat down in the back seat of
 [S('seat', fr='waist', open=False, cm='drop', dir=1), S('seat', fr='bust', open=False, cm='truck', dir=-1), S('seat', fr='detail', open=False, cm='push', dir=-1)],
 # 137   4.0s [nar] We were two streets away before I opened the cloth.
 [S('seat', fr='waist', open=True, cm='orbit', dir=-1)],
 # 138   5.6s [nar] It was the piece of me that had been taken out of my side four nights before.
 [S('seat', fr='detail', open=True, cm='pan', dir=1), S('seat', fr='close', open=True, cm='vertigo', dir=-1)],
 # 139   1.6s [nar] Some of it was gone.
 [S('seat', fr='detail', open=True, cm='tilt', dir=-1)],
 # 140   9.9s [nar] There was a dark stain on the cloth around it, the same colour as the stuff that
 [S('seat', fr='detail', open=True, cm='push', dir=1), S('seat', fr='close', open=True, cm='pull', dir=-1), S('seat', fr='wide', open=True, cm='arc', dir=-1), S('seat', fr='waist', open=True, cm='vertigo', dir=-1)],
 # 141   7.4s [nar] I was sick in my mother's car, and then I cried, and my father did not stop driv
 [S('car', fr='wide', cm='truck', dir=-1), S('car', fr='waist', cm='drop', dir=1), S('car', fr='bust', cm='pull', dir=1)],
 # 142   2.7s [nar] The picture is still on that camera.
 [S('camera', cm='crane', dir=1)],
 # 143   4.5s [nar] I have never shown it to anybody who did not ask twice.
 [S('camera', fr='detail', cm='vertigo', dir=-1), S('bedroom', fr='detail', lamp=0, open=0, cm='pan', dir=-1)],
 # 144   4.9s [nar] It is dark, and it is blurred, because my hand was shaking.
 [S('camera', cm='arc', dir=1), S('bedroom', fr='detail', lamp=0, open=0, cm='tilt', dir=1)],
 # 145   5.7s [nar] But the hood is there, and the face is there, and the two holes are there.
 [S('sockets', cm='pull', dir=-1), S('over', fr='waist', sit=False, cm='push', dir=-1)],
 # 146   5.8s [nar] And there is one more thing in that photograph that I have never been able to ex
 [S('creature', fr='wide', pose='stand', cm='drop', dir=1), S('creature', fr='waist', pose='stand', cm='truck', dir=-1)],
 # 147   2.3s [nar] The thing is not looking at me.
 [S('creature', fr='waist', pose='stand', cm='orbit', dir=-1)],
 # 148   9.9s [nar] It is looking past my shoulder, at the door of my room, which I had left open, a
 [S('far', shake=0.3, cm='pan', dir=1), S('hall', fr='waist', mitch=False, lamp=1.0, cm='vertigo', dir=1), S('hall', fr='wide', mitch=False, lamp=1.0, cm='crane', dir=-1), S('hall', fr='waist', mitch=False, lamp=1.0, cm='truck', dir=1)],
 # 149   1.9s [nar] Would you have taken the photograph?
 [S('end', cm='tilt', dir=-1)],
]
