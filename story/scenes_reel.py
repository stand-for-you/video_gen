# Scene table for the REEL - "Eyeless Jack" (engine v0.5, 3D, sets in src/SetsR.tsx).
# ONE LIST PER SPOKEN SENTENCE (the sync law). Written as story/plan_reel.txt, expanded by story/expand_reel.py.
def S(st, **v): return (st, v)
SC = [
 #   0   4.6s [nar] You wake in the night because something near your bed made a sound.
 [S('rbedroom', fr='bust', lamp=0, open=0, cm='push', dir=1), S('rbedroom', fr='detail', lamp=0, open=0, cm='pull', dir=-1), S('rbedroom', fr='close', lamp=0, open=0, cm='arc', dir=-1)],
 #   1   5.1s [nar] You open your eyes, and the black above you is not the ceiling.
 [S('rbedroom', fr='waist', lamp=0, open=0, cm='truck', dir=-1), S('rbedroom', fr='bust', lamp=0, open=0, cm='drop', dir=1), S('rbedroom', fr='detail', lamp=0, open=0, cm='pull', dir=1)],
 #   2   3.6s [nar] It is two empty holes where eyes should be.
 [S('rsockets', cm='crane', dir=1), S('rover', fr='waist', sit=False, cm='orbit', dir=1)],
 #   3   2.9s [nar] Something dark is running out of them.
 [S('rsockets', cm='vertigo', dir=-1), S('rover', fr='waist', sit=False, cm='pan', dir=-1)],
 #   4   2.2s [nar] Let us go back to the beginning.
 [S('rhouse', fr='wide', mitch=False, door=0, cm='arc', dir=1)],
 #   5   5.4s [nar] Mitch lost his house that spring, so his brother Edwin took him in.
 [S('rporch', fr='wide', door=0.5, mitch=True, cm='pull', dir=-1), S('rporch', fr='waist', door=0.5, mitch=True, cm='push', dir=1), S('rporch', fr='bust', door=0.5, mitch=True, cm='tilt', dir=1)],
 #   6   5.7s [nar] A cheap house at the end of a long street, pine woods behind the fence.
 [S('rhouse', fr='wide', mitch=False, door=0, cm='drop', dir=1), S('rhouse', fr='waist', mitch=False, door=0, cm='truck', dir=-1), S('rhouse', fr='bust', mitch=False, door=0, cm='push', dir=-1)],
 #   7   1.7s [nar] He took the back room.
 [S('rbedroom', fr='wide', lamp=0.5, open=0, cm='orbit', dir=-1)],
 #   8   6.1s [nar] A week in, a rustling under his window woke him at one in the morning.
 [S('rwindow', fr='waist', open=0.15, cm='pan', dir=1), S('rwindow', fr='bust', open=0.15, cm='vertigo', dir=-1)],
 #   9   1.9s [nar] Probably a raccoon.
 [S('ryard', fr='wide', porch=0.9, cm='tilt', dir=-1)],
 #  10   6.6s [nar] The next night he woke all at once, sure he had heard the window lifted open.
 [S('rbedroom', fr='bust', lamp=0, open=0.9, sit=True, expr='fear', cm='push', dir=1), S('rbedroom', fr='detail', lamp=0, open=0.9, sit=True, expr='fear', cm='pull', dir=-1)],
 #  11   5.9s [nar] Then a soft, heavy thump, like a person landing with their knees bent.
 [S('rwindow', fr='wide', open=0.9, cm='truck', dir=-1), S('rwindow', fr='waist', open=0.9, cm='drop', dir=1)],
 #  12   1.7s [nar] The window was shut.
 [S('rwindow', fr='detail', open=0.9, cm='crane', dir=1)],
 #  13   3.4s [nar] In the morning Edwin dropped his coffee cup.
 [S('rkitchen', fr='wide', cup=1, mirror=True, mitch=True, eexpr='shock', cm='vertigo', dir=-1)],
 #  14   5.5s [nar] There was a long clean cut down Mitch's cheek, and he had not felt it.
 [S('rmirror', fr='bust', cm='arc', dir=1), S('rmirror', fr='detail', cm='tilt', dir=-1)],
 #  15   3.0s [nar] The doctor said it was probably sleepwalking.
 [S('rward', fr='waist', doc=True, chart=True, cm='pull', dir=-1)],
 #  16   2.9s [nar] Then he asked him to lift his shirt.
 [S('rward', fr='bust', doc=True, chart=True, cm='drop', dir=1)],
 #  17   5.4s [nar] There was a surgical cut in his side, closed with neat stitches.
 [S('rward', fr='detail', doc=True, chart=True, cm='orbit', dir=-1), S('rward', fr='close', doc=True, chart=True, cm='crane', dir=1)],
 #  18   2.3s [nar] His left kidney was gone.
 [S('rward', fr='waist', doc=True, chart=True, cm='pan', dir=1)],
 #  19   3.3s [nar] That evening he went back to the same room.
 [S('rbedroom', fr='wide', lamp=0, open=0.9, cm='tilt', dir=-1)],
 #  20   5.2s [nar] At midnight he opened his eyes, and it stood over his bed.
 [S('rover', fr='wide', sit=False, cm='push', dir=1), S('rover', fr='waist', sit=False, cm='pull', dir=-1)],
 #  21   1.2s [nar] A black hood.
 [S('rsockets', cm='truck', dir=-1)],
 #  22   6.2s [nar] A face the colour of old grey paint, with no nose and no mouth.
 [S('rsockets', cm='crane', dir=1), S('rover', fr='waist', sit=False, cm='orbit', dir=1)],
 #  23   7.0s [nar] His hand went sideways on its own, to the camera on the shelf, and took the pict
 [S('rcamera', cm='vertigo', dir=-1), S('rbedroom', fr='detail', lamp=0, open=0.9, cm='pan', dir=-1), S('rbedroom', fr='bust', lamp=0, open=0.9, cm='orbit', dir=1)],
 #  24   1.9s [nar] The flash filled the room.
 [S('rflash', cm='arc', dir=1)],
 #  25   3.6s [nar] Then the dark came back, and it came at him.
 [S('rflash', cm='pull', dir=-1)],
 #  26   6.6s [nar] He kicked it in the face, ran barefoot into the woods, and tripped on a rock.
 [S('rwoods', fr='wide', amber=0.4, pose='run', cm='drop', dir=1), S('rwoods', fr='waist', amber=0.4, pose='run', cm='truck', dir=-1)],
 #  27   8.2s [nar] He woke in a hospital bed, and the doctor sat down, which nobody does when the n
 [S('rward', fr='waist', doc=True, chart=False, cm='orbit', dir=-1), S('rward', fr='bust', doc=True, chart=False, cm='crane', dir=1), S('rward', fr='detail', doc=True, chart=False, cm='truck', dir=1)],
 #  28   1.9s [nar] Mitch was only bruised.
 [S('rward', fr='bust', doc=True, chart=False, cm='pan', dir=1)],
 #  29   3.8s [nar] His brother had been found in the house that morning.
 [S('rhouse', fr='wide', mitch=True, door=0.7, cm='tilt', dir=-1)],
 #  30   7.3s [nar] Three days later he went back for his things, and from his door he saw down the 
 [S('rfar', shake=0.3, cm='push', dir=1), S('rhall', fr='waist', lamp=1.0, cm='pull', dir=1), S('rhall', fr='wide', lamp=1.0, cm='arc', dir=-1)],
 #  31   4.7s [nar] Beside his brother was something small, wrapped in cloth.
 [S('rfar', shake=0.3, cm='truck', dir=-1), S('rhall', fr='waist', lamp=1.0, cm='drop', dir=-1)],
 #  32   2.1s [nar] He carried it out to the car.
 [S('rcar', fr='wide', cm='crane', dir=1)],
 #  33   2.6s [nar] Two streets away he opened it.
 [S('rseat', fr='waist', open=True, cm='vertigo', dir=-1)],
 #  34   5.3s [nar] It was the piece taken out of his side, and some of it was gone.
 [S('rseat', fr='detail', open=True, cm='arc', dir=1), S('rseat', fr='close', open=True, cm='tilt', dir=-1)],
 #  35   3.2s [nar] The photograph is still on that camera.
 [S('rcamera', cm='pull', dir=-1)],
 #  36   5.0s [nar] It is dark and blurred, but the hood and the holes are there.
 [S('rsockets', cm='drop', dir=1), S('rover', fr='waist', sit=False, cm='truck', dir=1)],
 #  37   3.4s [nar] And in the picture it is not looking at Mitch.
 [S('rcreature', fr='wide', pose='stand', cm='orbit', dir=-1)],
 #  38   3.6s [nar] It is looking past him, at his open door.
 [S('rfar', shake=0.3, cm='pan', dir=1)],
 #  39  10.1s [nar] This is my retelling of the creepypasta Eyeless Jack, posted by a user called Az
 [S('rcreature', fr='wide', pose='stand', cm='tilt', dir=-1), S('rcreature', fr='waist', pose='stand', cm='arc', dir=1), S('rcreature', fr='bust', pose='stand', cm='vertigo', dir=1), S('rcreature', fr='detail', pose='stand', cm='crane', dir=1)],
 #  40   1.9s [nar] Would you have taken the photograph?
 [S('rbedroom', fr='wide', lamp=0, open=0.9, mitch=False, cm='push', dir=1)],
]
