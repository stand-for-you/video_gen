# Scene table for LONG video ("Gateway of the Mind", Kit q: Facility83).
# ONE LIST PER SPOKEN SENTENCE (40 sentences total).
def S(st, **v): return (st, v)

SC = [
  # 0: In nineteen eighty-three, deep beneath a concrete bunker, an old man lay strapped to a metal table in total silence. (10.1s -> 5)
  [S('chamber_iso', fr='wide'), S('chamber_iso', fr='waist'), S('obs_window', fr='wide'), S('reels_tape', fr='bust'), S('chamber_iso', fr='bust')],
  
  # 1: Every sensory nerve in his body had been surgically cut, leaving him unable to see, hear, smell, taste, or feel a single thing. (12.5s -> 6)
  [S('retro_surgery', fr='wide'), S('retro_surgery', fr='waist'), S('retro_surgery', fr='bust'), S('chamber_iso', fr='waist'), S('tears_ceiling', fr='bust'), S('chamber_iso', fr='close')],
  
  # 2: The scientists believed that without the five physical senses, human thought could reach the pure presence of God. (9.1s -> 4)
  [S('obs_window', fr='wide'), S('obs_window', fr='waist'), S('reels_tape', fr='waist'), S('obs_window', fr='bust')],
  
  # 3: Instead, something else found him in the dark: hundreds of dead voices that refused to leave. (8.4s -> 4)
  [S('nightmare_void', fr='wide'), S('nightmare_void', fr='waist'), S('wife_apparition', fr='bust'), S('nightmare_void', fr='bust')],
  
  # 4: And before his heart stopped forever, he opened his blind eyes and delivered one final message. (8.3s -> 4)
  [S('eye_contact_shot', fr='waist'), S('eye_contact_shot', fr='bust'), S('whisper_god', fr='close'), S('eye_contact_shot', fr='close')],
  
  # 5: Let us go back to the beginning. (2.2s -> 1)
  [S('restricted_door', fr='wide')],
  
  # 6: In nineteen eighty-three, a team of deeply religious scientists gathered at an undisclosed research facility. (9.2s -> 3)
  [S('fleeing_hall', fr='wide'), S('obs_window', fr='wide'), S('reels_tape', fr='bust')],
  
  # 7: They had theorized that our physical senses cloud our awareness of eternity, and without them, a human could actually contact God by thought alone. (12.7s -> 5)
  [S('obs_window', fr='waist'), S('reels_tape', fr='waist'), S('speaking_mic', fr='waist'), S('obs_window', fr='wide'), S('reels_tape', fr='bust')],
  
  # 8: An elderly man who claimed he had nothing left to live for was the only test subject to volunteer. (7.8s -> 3)
  [S('chamber_iso', fr='wide'), S('chamber_iso', fr='waist'), S('chamber_iso', fr='bust')],
  
  # 9: To purge him of all stimuli, surgeons performed a complex operation, severing every sensory nerve connection leading into his brain. (12.1s -> 4)
  [S('retro_surgery', fr='wide'), S('retro_surgery', fr='waist'), S('retro_surgery', fr='bust'), S('retro_surgery', fr='detail')],
  
  # 10: Although the man retained full muscular function, he could no longer see, hear, taste, smell, or feel. (9.2s -> 3)
  [S('chamber_iso', fr='wide'), S('chamber_iso', fr='waist'), S('chamber_iso', fr='bust')],
  
  # 11: With no possible way to sense the outside world, he was completely alone with his thoughts. (7.3s -> 3)
  [S('chamber_iso', fr='wide'), S('tears_ceiling', fr='bust'), S('chamber_iso', fr='bust')],
  
  # 12: This story is inspired by Gateway of the Mind, as published on the Creepypasta Wiki. (7.7s -> 3)
  [S('restricted_door', fr='wide'), S('fleeing_hall', fr='wide'), S('restricted_door', fr='waist')],
  
  # 13: Scientists monitored him through one-way glass as he spoke aloud in jumbled, slurred sentences that he could not even hear. (11.2s -> 4)
  [S('obs_window', fr='wide'), S('speaking_mic', fr='bust'), S('obs_window', fr='waist'), S('speaking_mic', fr='close')],
  
  # 14: After four days, the man claimed he was hearing hushed, unintelligible voices whispering inside his head. (9.2s -> 3)
  [S('whisper_mist', fr='wide'), S('whisper_mist', fr='waist'), S('whisper_mist', fr='bust')],
  
  # 15: Assuming it was merely an onset of psychosis, the researchers paid little attention to his concerns. (8.4s -> 3)
  [S('obs_window', fr='waist'), S('reels_tape', fr='bust'), S('obs_window', fr='wide')],
  
  # 16: Two days later, the subject began to weep, crying out that he could hear his dead wife conversing with him. (9.2s -> 3)
  [S('chamber_iso', fr='bust'), S('wife_apparition', fr='wide'), S('wife_apparition', fr='bust')],
  
  # 17: He claimed he could communicate back through his thoughts, whispering: "She is right here with me." (7.9s -> 3)
  [S('wife_apparition', fr='waist'), S('speaking_mic', fr='bust'), S('speaking_mic', fr='close')],
  
  # 18: The scientists were skeptical, until the man began reciting the private names and secrets of their own dead relatives. (10.2s -> 4)
  [S('secrets_shock', fr='wide'), S('secrets_shock', fr='bust'), S('obs_window', fr='waist'), S('secrets_shock', fr='close')],
  
  # 19: He repeated personal truths that only their deceased spouses and parents could have known, driving a sizable portion of the team to abandon the facility. (13.1s -> 5)
  [S('secrets_shock', fr='waist'), S('fleeing_hall', fr='wide'), S('fleeing_hall', fr='waist'), S('secrets_shock', fr='bust'), S('fleeing_hall', fr='wide')],
  
  # 20: After a week of conversing with the dead through his mind, the subject became intensely distressed, saying the voices were overwhelming his consciousness. (12.5s -> 5)
  [S('nightmare_void', fr='wide'), S('whisper_mist', fr='waist'), S('nightmare_void', fr='bust'), S('whisper_mist', fr='bust'), S('nightmare_void', fr='wide')],
  
  # 21: In every waking moment, he was bombarded by hundreds of spirits that refused to leave him alone. (8.3s -> 3)
  [S('nightmare_void', fr='wide'), S('nightmare_void', fr='waist'), S('nightmare_void', fr='bust')],
  
  # 22: He frequently threw his body against the padded walls, desperately seeking any sensation of physical pain. (9.2s -> 3)
  [S('hysteria_slam', fr='wide'), S('hysteria_slam', fr='waist'), S('hysteria_slam', fr='bust')],
  
  # 23: He begged the scientists for heavy sedatives so he could escape the voices through sleep. (6.8s -> 3)
  [S('speaking_mic', fr='bust'), S('obs_window', fr='waist'), S('sedative_sleep', fr='bust')],
  
  # 24: This tactic worked for three days, until violent night terrors began. (5.8s -> 2)
  [S('sedative_sleep', fr='wide'), S('sedative_sleep', fr='bust')],
  
  # 25: The subject repeatedly cried that in his dreams, the dead were no longer just voices; he could clearly see and hear them surrounding him. (11.7s -> 4)
  [S('nightmare_void', fr='wide'), S('wife_apparition', fr='waist'), S('nightmare_void', fr='bust'), S('wife_apparition', fr='bust')],
  
  # 26: Only a day later, he began to scream, clawing at his useless eyes in hopes of sensing something in the physical world. (10.4s -> 4)
  [S('clawing_eyes', fr='waist'), S('alarm_shriek', fr='wide'), S('clawing_eyes', fr='bust'), S('alarm_shriek', fr='bust')],
  
  # 27: The hysterical man said the voices were now deafening and hostile, speaking of hell and the end of the world. (9.1s -> 3)
  [S('alarm_shriek', fr='wide'), S('alarm_shriek', fr='waist'), S('nightmare_void', fr='bust')],
  
  # 28: For five agonizing hours, he shrieked the words: "No heaven! No forgiveness!" (8.1s -> 3)
  [S('alarm_shriek', fr='waist'), S('speaking_mic', fr='bust'), S('alarm_shriek', fr='bust')],
  
  # 29: He continually begged to be killed, but the remaining scientists were convinced they were close to touching God. (8.9s -> 3)
  [S('obs_window', fr='wide'), S('secrets_shock', fr='waist'), S('obs_window', fr='bust')],
  
  # 30: After another day, the subject could no longer form coherent sentences. (5.9s -> 2)
  [S('chamber_iso', fr='waist'), S('speaking_mic', fr='bust')],
  
  # 31: Seemingly mad, he began thrashing violently, biting at his own flesh in frenzy. (7.5s -> 3)
  [S('hysteria_slam', fr='wide'), S('hysteria_slam', fr='waist'), S('alarm_shriek', fr='bust')],
  
  # 32: The scientists rushed into the chamber and strapped him flat against a metal table so he could not harm himself. (9.3s -> 3)
  [S('retro_surgery', fr='wide'), S('restrained_flat', fr='wide'), S('restrained_flat', fr='waist')],
  
  # 33: After hours of being tied down, the subject abruptly halted his struggling and screaming. (7.5s -> 3)
  [S('restrained_flat', fr='waist'), S('restrained_flat', fr='bust'), S('restrained_flat', fr='wide')],
  
  # 34: He stared blankly at the ceiling as teardrops silently streaked across his face. (6.8s -> 3)
  [S('tears_ceiling', fr='waist'), S('tears_ceiling', fr='bust'), S('tears_ceiling', fr='close')],
  
  # 35: For two whole weeks, he lay motionless and had to be manually rehydrated through intravenous fluids due to the constant crying. (10.7s -> 4)
  [S('rehydration_iv', fr='wide'), S('rehydration_iv', fr='waist'), S('chamber_iso', fr='waist'), S('rehydration_iv', fr='bust')],
  
  # 36: Eventually, he turned his head and, despite his blindness, made direct, focused eye contact with a scientist for the first time in the study. (13.1s -> 5)
  [S('restrained_flat', fr='wide'), S('eye_contact_shot', fr='waist'), S('eye_contact_shot', fr='bust'), S('obs_window', fr='waist'), S('eye_contact_shot', fr='close')],
  
  # 37: He whispered his final words: "I have spoken with God, and he has abandoned us." (7.6s -> 3)
  [S('eye_contact_shot', fr='bust'), S('whisper_god', fr='close'), S('obs_window', fr='bust')],
  
  # 38: And in that exact second, his vital signs stopped forever, with no apparent cause of death. (8.0s -> 3)
  [S('flatline_screen', fr='detail'), S('abandoned_lab', fr='wide'), S('flatline_screen', fr='detail')],
  
  # 39: Closing question -> End Screen (5.5s -> 1)
  [S('end')],
]
