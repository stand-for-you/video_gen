# Scene table for REEL (9:16 vertical sets in src/SetsR.tsx).
# ONE LIST PER SPOKEN SENTENCE (28 sentences total).
def S(st, **v): return (st, v)

SC = [
  # 0: In nineteen eighty-three, deep beneath an underground bunker, an old man lay strapped to a metal table in total silence. (10.5s -> 5)
  [S('rchamber', fr='wide'), S('rchamber', fr='waist'), S('robs', fr='wide'), S('rtapes', fr='bust'), S('rchamber', fr='bust')],
  
  # 1: Every sensory nerve in his body had been surgically cut. (4.5s -> 2)
  [S('rsurgery', fr='wide'), S('rsurgery', fr='waist')],
  
  # 2: The scientists believed that without the five senses, human thought could reach the pure presence of God. (8.3s -> 3)
  [S('robs', fr='wide'), S('robs', fr='waist'), S('rtapes', fr='waist')],
  
  # 3: Instead, something far darker found him in the void: hundreds of dead voices that refused to leave him alone. (9.9s -> 4)
  [S('rvoid', fr='wide'), S('rvoid', fr='waist'), S('rwife', fr='bust'), S('rvoid', fr='bust')],
  
  # 4: And before his heart stopped forever, he delivered one final message. (5.8s -> 2)
  [S('reye', fr='waist'), S('reye', fr='close')],
  
  # 5: Let us go back to the beginning. (2.1s -> 1)
  [S('rchamber', fr='wide')],
  
  # 6: A team of deeply religious scientists had theorized that physical senses cloud our awareness of eternity. (9.7s -> 4)
  [S('robs', fr='wide'), S('robs', fr='waist'), S('rtapes', fr='waist'), S('robs', fr='bust')],
  
  # 7: They believed that without stimuli, a person could touch the divine. (5.0s -> 2)
  [S('rtapes', fr='wide'), S('rtapes', fr='bust')],
  
  # 8: An elderly volunteer with nothing left to live for agreed to the radical surgery. (7.2s -> 3)
  [S('rchamber', fr='wide'), S('rchamber', fr='waist'), S('rchamber', fr='bust')],
  
  # 9: Surgeons severed every sensory nerve connection leading into his brain. (6.1s -> 2)
  [S('rsurgery', fr='wide'), S('rsurgery', fr='bust')],
  
  # 10: Although he retained full muscular function, he was completely trapped inside his own mind. (7.6s -> 3)
  [S('rchamber', fr='wide'), S('rchamber', fr='waist'), S('rchamber', fr='bust')],
  
  # 11: Through one-way glass, researchers monitored his slurred speech into a microphone. (6.5s -> 2)
  [S('robs', fr='wide'), S('rmic', fr='bust')],
  
  # 12: On day four, he whispered that he heard hushed, unintelligible voices in his head. (6.6s -> 2)
  [S('rwhisper', fr='wide'), S('rwhisper', fr='bust')],
  
  # 13: Two days later, he began to weep, crying out that his dead wife was speaking to him. (7.2s -> 3)
  [S('rchamber', fr='waist'), S('rwife', fr='wide'), S('rwife', fr='bust')],
  
  # 14: Then, he began reciting the private names and secrets of the scientists' own dead relatives. (8.6s -> 3)
  [S('rshock', fr='wide'), S('rshock', fr='waist'), S('rshock', fr='bust')],
  
  # 15: Terrified by what they had unsealed, half of the research team fled the facility that night. (7.7s -> 3)
  [S('rhall', fr='wide'), S('rhall', fr='waist'), S('rhall', fr='wide')],
  
  # 16: Within a week, the whispers turned into a deafening roar of hundreds of spirits. (6.2s -> 2)
  [S('rvoid', fr='wide'), S('rvoid', fr='bust')],
  
  # 17: The man slammed himself against walls seeking pain, then begged for sedatives to sleep. (7.9s -> 3)
  [S('rslam', fr='wide'), S('rslam', fr='waist'), S('rsedative', fr='bust')],
  
  # 18: But in his dreams, he could see the dead circling him. (4.0s -> 1)
  [S('rvoid', fr='bust')],
  
  # 19: He clawed at his useless eyes, screaming that the voices spoke only of hell. (6.2s -> 2)
  [S('ralarm', fr='wide'), S('ralarm', fr='bust')],
  
  # 20: For five straight hours, he shrieked: No heaven, no forgiveness! (5.5s -> 2)
  [S('ralarm', fr='waist'), S('rmic', fr='bust')],
  
  # 21: The scientists refused to stop, convinced they were moments away from contacting God. (7.2s -> 3)
  [S('robs', fr='wide'), S('robs', fr='waist'), S('robs', fr='bust')],
  
  # 22: Driven to absolute madness, he began thrashing violently until researchers strapped him down. (7.9s -> 3)
  [S('rslam', fr='wide'), S('rrestrain', fr='wide'), S('rrestrain', fr='bust')],
  
  # 23: For two weeks, he stared blankly at the ceiling as silent tears ran down his face, kept alive only by intravenous fluids. (12.0s -> 4)
  [S('rrestrain', fr='waist'), S('rtears', fr='waist'), S('rtears', fr='bust'), S('rtears', fr='close')],
  
  # 24: On the fifteenth night, the blind man slowly turned his head and made dead-center eye contact with the lead scientist through the glass. (11.4s -> 4)
  [S('rchamber', fr='wide'), S('reye', fr='waist'), S('reye', fr='bust'), S('reye', fr='close')],
  
  # 25: He whispered: I have spoken with God, and he has abandoned us. (5.0s -> 2)
  [S('reye', fr='bust'), S('reye', fr='close')],
  
  # 26: In that exact second, his heart stopped forever. (4.1s -> 2)
  [S('rflatline', fr='waist'), S('rflatline', fr='detail')],
  
  # 27: Would you have severed every sensory nerve to hear the voice of God? (5.5s -> 1)
  [S('rqcard')],
]
