# Scroll Kaos channel policy (full rules)

Reply in simple English; explain hard words in (brackets); bold key terms; medium-plus length. Project rules: mark unverifiable claims with UNVERIFIED, suggest no card-required service, hardcode no secrets, make only the requested changes, never send the user's email to unrelated services.

## 0. EXACT DELIVERABLES (every run, nothing more, nothing less)
1. Video 1: YouTube video, 1920x1080 (16:9), English voice.
2. Video 2: Reel video, 1080x1920 (9:16), English voice. Its ARTWORK IS DRAWN AGAIN at 1080x1920 (section 4). Never the YouTube picture resized, cropped, zoomed, panned or letterboxed.
3. Two subtitle files only: English .srt and Hindi .srt (UTF-8, CRLF, no BOM).
4. FOUR thumbnails (section 5): THREE YouTube thumbnails 1280x720 (A, B, C = the A/B test set for the long video, each JPG under 2 MB, UNVERIFIED limit) and ONE Reel thumbnail drawn natively at 1080x1920. Never one resized from another. Shorts/Reels get NO A/B set.
5. One .md file with all upload details for every platform (section 6), including the A/B test plan, the community post schedule, the pinned comment and the end-screen steps.

"Reel only" mode: make ONLY the Reel video, the Reel thumbnail (1080x1920), both .srt and the .md (no YouTube video, no 1280x720 thumbnails, no A/B plan; the community post schedule and pinned comment for the Short/Reel stay).
NEVER make or send: a Hindi video, Hindi audio/MP3/voice, .sbv files, transcripts, zip files, voice-only wavs, reel cover files, or any other extra file. Hindi exists ONLY as the Hindi .srt (natural Hindi, timed to the English cues).

## 1. Plan before drawing
- Read the WHOLE story first (if a video is given, transcribe it, then retell in own words; never copy frames, script or voice).
- Write a story bible (places, characters, objects, timeline, twist) and a scene map: for every scene, where it fits, light, layout, camera, written TWICE: one 16:9 layout and one separate 9:16 layout.
- Retell in OWN words and keep it NON-GRAPHIC: imply, never show injuries or weapons touching people. Remove sexual content and gore from dark source stories and flag it. Suicide in a source story becomes "X had died" with no method; flag it.
- If the user attaches a famous image of the creature: never copy or trace it. Draw an original design with no blood, and flag it.

## 1A. PERMANENT CAST (MANDATORY in every video)
The channel has ONE fixed character design. It lives in the engine (src/Body.tsx, Faces.tsx, Cast.tsx, Kit.tsx, Thumbs.tsx). Never invent a new face style per video.
- HERO: Noah Reed (FullMan + FaceNoah; teal shirt, satchel, red wrist cord).
- GHOSTS for scary reveals: Ghost Woman (GhostWoman + FaceWoman), The Grinner (GhostGrin + FaceGrin), The Drenched Child (GhostChild + FaceChild). Pale blue-white skin, huge hollow black eyes, dark tear tracks.
- SIDE CAST (living people): Mira Vale (young woman), Elias Gray (grandfather), Rose Marlow (grandmother), Sam Carter (teen), Lily (child), Officer Dale Reyes (police), Lyra (teen girl), Dr. Oliver (woman doctor), Terence (man, glasses). Use FullPerson / FacePerson with CAST.<id> (Terence = TERENCE in SD.tsx).
- Pick the people the story needs from this cast. Rename them only in narration and on-screen text; the DRAWING stays the same. A story person not in the cast = ONE new Spec entry with the same builder; list it in the final message so it is added to the cast notes.
- STYLE LAW: painted faces with grain speckle, thick ink outline (7-8), muted palette, ONE red accent, dark right-side shading, human proportions (adult about 7 heads, child bigger head, shorter legs). No cartoon blobs, no new face style, never copy anime characters.
- Costume colours may change only for a story note in the story bible. Face, hair, body shape and height never change.
- Non-graphic: ghost faces use dark tear tracks, not red blood.
- QA: stills of blinking faces use f >= 4.
- Every character moves in every scene (Alive wrapper: idle breathing, walk, shake, lean). No frozen people.

## 1B. VARIETY RULES (the setting changes, the cast does not)
- Never repeat the last 3 videos' setting, base palette, room and prop shapes, camera habit or title-card style (list in kits-used.md).
- Pick a NEW look kit per story and write it in the story bible: (1) setting type and era, (2) main palette (one base tone + single red accent), (3) room and prop shapes, (4) a different main camera move (src/camera.ts), (5) title-card frame ornament and paper tone (src/Card.tsx, same Lora font).
- Free-licence textures only (the engine makes its own paper and grain). Keep a SOURCES list for any outside image (Wikimedia Commons, Openverse, Unsplash, Internet Archive).

## 1C. FIRST 30 SECONDS = SUSPENSE HOOK (retention law, long and Reel)
Why: the user's analytics (a 2:31 Short) showed most viewers leave in the first 30 s, then the line stays flat. Fix the opening, not the length. Results are not promised (UNVERIFIED); judge after 4-5 videos.
- Picture: the FIRST FRAME is the creepiest scene of the video (not a house, title card or map); a creepy shape (eyes, shadow, hand or creature) appears before 0:20; a picture change at least every 2.5 s. No logo, title card or silence before the first word.
- Words: simple short sentences; a new tension fact every 5-7 s; the teaser ends on an open question or promise, never on a calm line.
- NEVER spend the first 45 s on: the credit line, the AI or fiction disclaimer, the narrator's life summary, or place facts and numbers. The spoken credit comes after 0:45 (or at the end) in one sentence. A small on-screen "fiction" tag is allowed.
- Self-check: read the first 80 words aloud; if the first 2 sentences do not create fear or a question, rewrite them.

## 1D. TEASER, THEN THE REAL STORY FROM THE BEGINNING, THEN A CLOSING QUESTION
1. TEASER (about 30 s; Reel about 15-20 s): the most suspenseful moment in own words, no twist spoiled. It may use a character voice line in the long video. Fast pictures. Ends on an open question or promise.
2. A clear cut line such as "Let us go back to the beginning." Then the REAL STORY from its very first event, in order, nothing skipped. The teaser moment is shown again at its real place.
3. LAST BEAT = ONE simple story-based question to viewers, answerable in one short comment. The SAME exact words are used (a) as the last on-screen text, (b) as the last line of the Reel caption, (c) in the YouTube pinned comment, (d) in the Short pinned comment. No bait, no "like and subscribe" pressure.
- Print the question once at the top of the YouTube section of the .md.
- In the final message, quote the first 3 spoken lines and the closing question.
- Credit wording: say "inspired by <title>, as published on <site>" unless the original first source is verified (a legend may be older than the page).

## 2. Look (Yamishibai style)
- Japanese paper-cutout animation feel: textured paper, ink outlines, painted shading, slow STEPPED camera, slight boil.
- Characters look HUMAN (permanent cast). Backgrounds detailed and layered. No empty screens.
- Every scene UNIQUE (no repeated frame). At least 20 different screens per minute, each with its own animation.
- Dark muted palette, one red accent. Same Lora font on all cards.
- PHOTOSENSITIVE SAFETY: no flashing, strobe or fast flicker anywhere (a camera flash is drawn as a still pool of light; lightning only as a slow single brighten, never repeated fast). Slow cursor blinks only.

## 2A. Language on screen: English only
- Never draw Japanese words or kanji/kana. All words in frames are English; names become simple English names.
- A famous legend name people search for may stay in English letters in the title/description.
- Do not copy a famous movie mask or character; use a generic design.

## 3. Sound (every video must be translatable by Instagram Voice translation)
- English only. Narrator Kokoro af_nicole at speed 1.1. No Hindi voice.
- CHARACTER VOICES (LONG VIDEO ONLY): main speaking characters get their own fixed voice for short quoted lines (1-2 sentences): (1) one fixed voice per character from the installed Kokoro voices (list them first; choice UNVERIFIED until checked); (2) creature/child/ghost voices by a pitch or speed change, kept clear; (3) the narrator carries the rest; (4) no overlapping speech, gaps about 0.3 s; (5) all voices level-matched; (6) no effect that sounds like music.
- THE REEL HAS EXACTLY ONE SPEAKER: the narrator. Instagram refused a Scroll Kaos Reel with "Translations failed ... because it has multiple speakers" (screenshot, 2026-11-12). The engine enforces this (tts.py turns every tag into the narrator for the reel). Check it before sending.
- Instagram said voice translation is not available when speech is too short or there is too much background music. So: speech almost non-stop (gaps about 0.3 s); music = one very low steady drone (55-110 Hz) + faint wind, NO melody, bells, beat or singing; music about 25 dB under the voice, ducked 60% under speech.
- Loudness: about -16 LUFS (YouTube) / -14 LUFS (Reel), true peak at or below -1.5 dBTP in the WAV; the ENCODED file must never peak above 0 dBFS (tools/safe_audio.py checks it; AAC can overshoot by 3-4 dB).
- Whether Instagram accepts AI voices is UNVERIFIED; say so in the .md.

## 4. The two videos
- Video 1 (YouTube) 1920x1080 holds the full story. Chapter cards allowed. Subtitles only in the .srt (no burned-in captions).
- The long video ends with a 20-second END SCREEN: the closing question as the last on-screen text, the channel name, a tiny idle hero, a faint creature, and clear empty zones for 2 video elements on the right and a Subscribe button in the lower middle. The narration ends at or within its first 3 s; the drone continues; nothing important is covered by the zones.
- Video 2 (Reel) is a SEPARATE ARTWORK SET drawn for 1080x1920 (SetsR.tsx, its own Remotion composition). Never reuse the 16:9 scene files, never resize, crop, zoom, pan, scale-to-fit, blur-pad or letterbox YouTube frames. Same story content, recomposed for vertical; share only the art kit and the cast.
- Proof: Reel is exactly 1080x1920; contact sheets checked; SetsR.tsx imports nothing from SetsL.tsx.
- Reel length: over about 3 min may be rejected (UNVERIFIED). Story up to 2:55: whole script. Longer: a shorter retelling with the same beats and twist, aim 2:40-2:55; tell the user what was shortened.
- Reel captions: burned-in English captions in the safe area (about 430 px above the bottom, 70 px side margins, about 22 characters per line). Keep faces and key props between y 180 and 1420 of the vertical canvas.

## 5. Thumbnails (FOUR per full run: 3 YouTube A/B + 1 Reel, most-horror backdrop)
- THREE separate YouTube thumbnails (A, B, C), each 1280x720 on its own canvas, plus ONE Reel thumbnail 1080x1920 on its own canvas. Never resize or crop one into another. JPG, YouTube ones under 2 MB (UNVERIFIED).
- The three differ in ONE clear way each (fair test), same horror law, same story:
  - A (main): giant ghost face on the right, title on the left, tiny hero from behind.
  - B: much closer face crop (only eyes and mouth huge), 2-word title, the red moon smaller.
  - C: key story object big and glowing, the ghost smaller and further away, title on top.
- Reel thumbnail: title on top, giant face in the middle, tiny hero from behind below.
- BACKDROP RULE: HorrorBack from Thumbs.tsx on all: near-black sky to blood-red, a huge blood-red moon, dead bare trees, crooked gravestones and crosses, ground fog, bats, pale hands reaching up, snow or ash specks. Keep moon, trees and gravestones visible; heavy vignette only at the edges.
- Subject: one GIANT permanent-cast ghost face (usually FaceWoman, or Grinner / Drenched Child when the story fits) with huge hollow black eyes and a dark open mouth, plus Noah Reed as a tiny back view facing it, and the key object. When the story has NO ghost, the giant face is the story's creature.
- Text: 2-3 big words, white first word, glowing red second word, Lora bold, readable on a phone, not misleading, English only.
- Non-graphic: no red blood on faces, no gore, no weapons on people. The red sky and moon are allowed.
- Check all four at phone size.

## 6. The ONE .md upload file (every section copyable)
- FIXED FORMAT: the user approved references/upload-details-gold.md as the perfect file. Every .md must match its headings, order, fixed sentences and code blocks; only story text changes. Build it with tools/make_upload_md.py from story/upload.json (references/upload-md-guide.md). The only allowed additions are the end-screen block, the one-speaker Instagram note and the .srt/end screen in Upload order step 2.
- Every pasteable text in its own fenced code block with only the pasteable text inside.
- Chapters: one fenced block, plain lines like `0:00 Intro` (first at 0:00, at least 3 chapters, each at least 10 s, ascending), taken from the real timings.
- One heading per platform, in this order: YouTube (closing question at the top, 3 title options each in its own block, Hindi title, A/B test plan from 6B, description with chapters and credit line, tags, pinned comment from 6C, end-screen steps, AI-content disclosure note), YouTube Shorts (ONE title, description, pinned comment; no A/B), Instagram Reel (caption ending with the question, hashtags, Hindi caption, Voice translation steps, AI label note, reach blocks from 6A), Facebook (post), Threads (post), Pinterest (title, description), then the Community post schedule (6D) and Upload order, then Flags.
- Tags: story tags PLUS: scary stories, horror stories, creepypasta, creepy stories, mystery stories, unsolved mysteries, horror shorts, scary shorts, short horror story, nightmare stories, paranormal, spooky stories, late night stories, dark stories, story time, Scroll Kaos
- Credit line: Inspired by <legend/author>. If the author is not named, credit the title and site and flag it. Add photo credits for CC BY / CC BY-SA images.
- Flags section (UNVERIFIED items: thumbnail limit, Reel length limit, Instagram Voice translation with AI voices, AI voice licences, age-restriction risk, A/B test availability, end-screen menu names, community post scheduling, story rights, plus the reach note from 6A).
- Titles and captions in English; add a Hindi title and a Hindi Reel caption in their own blocks.

## 6A. Instagram REACH rules (from Instagram's "Best practices > Reach" page)
What Instagram says (short): (1) eligible content is first shown to an audience likely to enjoy it, follower or not, and grows as they engage; (2) followers see content based on things like when they visit, so post when followers are active; (3) follower count may dip short term, track long-term growth; (4) reach varies, especially with new ideas; (5) inviting a collaborator shares the post with a broader audience.
How to apply (design choices; whether they raise reach is UNVERIFIED):
- Narration and a striking picture from 0:00, a clear closing line and last frame, the twist kept.
- Caption ends with ONE simple question. No "like/comment/follow to win" bait.
- Best posting time block: Professional dashboard > Insights > Total followers > Most active times (menu names UNVERIFIED); post in those slots on a steady schedule. Never invent times or numbers.
- Collab block: Reel > Tag people > Invite collaborator; the other account must accept (menu names UNVERIFIED). List 2-3 TYPES of accounts (horror story pages, paper-art or animation pages, narrators). Never name real accounts, never contact anyone.
- Reach note in the flags: reach varies; judge after 4-5 Reels; follower count can dip. Instagram only; nothing promised for other platforms.

## 6B. YouTube A/B test (LONG VIDEO ONLY: 3 thumbnails + 3 titles)
- Shorts and Reels get ONE title and ONE thumbnail.
- Block with Thumbnail A, B, C (file names + one line each on the difference) and Title A, B, C, each title in its own fenced block: under about 60 characters, no clickbait lies, the story's real hook, English, each a different angle (a question, a place/time fact, a short warning).
- Steps (Studio names UNVERIFIED): YouTube Studio > Content > open the video > click the thumbnail > "Test & compare" > upload the 3 thumbnails (and the 3 titles if offered) > start. If only one test type at a time: thumbnails first, titles later.
- Rules: do not edit title/thumbnail while a test runs; let YouTube pick the winner (can take days, UNVERIFIED); do not judge by the first hours; do not share in family/friends groups to "help" (creator advice, UNVERIFIED).

## 6C. Pinned comment (one text for BOTH the long video and the Short)
- Friendly, 2-4 lines, says thanks, asks the SAME closing question, points to the other format ("Watch the full story on the channel" / "New short stories every week"). No "sub for sub", no bait, no outside links.
- Steps: post from the channel account right after publishing, three dots > Pin. One pinned comment at a time (UNVERIFIED).
- Never invent viewer names or replies.

## 6D. Community post schedule (with the long video and the Short)
- A table (YouTube Studio > Create > Create post; scheduling UNVERIFIED) matching each upload:
  1. TEASER post, about 1 day before the long video: one creepy line (own words, no twist) and a question. Image: Reel thumbnail or Thumbnail A.
  2. LONG VIDEO post at publish time: text, link placeholder, the winning/first thumbnail, the question.
  3. SHORT post at the Short's publish time: text, link placeholder, one line pointing to the full story.
  4. FOLLOW-UP poll (optional, a day or more later): "which moment scared you?" with 3-4 options from the story.
- Each text in its own fenced block. No invented clock times: give offsets and point to YouTube Studio > Analytics > Audience > "When your viewers are on YouTube" (UNVERIFIED).
- Possible extra (creator advice, UNVERIFIED): a Community post at publish time may give a second notification. Promise nothing.
- Upload order list: teaser post, long video (+ srt, end screen, pinned comment, A/B test), long video post, Short (+ pinned comment), Short post, Instagram Reel, follow-up poll.

## 7. Safety and rights
- Own words and own art only. Non-graphic horror. No real victims. Check voice/model licences before monetising (Kokoro-82M model is Apache-2.0; per-voice terms UNVERIFIED). Remotion is free for individuals and teams of up to 3 people; a company licence is needed for 4 or more.
- Story rights: check the story page for a narration rule and the author; tell the user to get written permission before monetising (UNVERIFIED unless the page says it).

## 8. Final self-check (before sending)
Exactly the requested files (2 videos + 4 thumbnails + 2 .srt + 1 .md, or the reel-only set) and nothing else; Reel redrawn at 1080x1920; YouTube exactly 1920x1080; thumbnails exactly 1280x720 (x3) and 1080x1920 (x1), drawn natively; English-only text on screen; all people drawn with the permanent cast; no repeated or empty scenes; 20+ screens/min; first frame = creepiest; teaser cuts every <= 2.5 s; speech continuous and music very quiet; Reel = one speaker; loudness on target and no encoded peak above 0 dBFS; end screen present (long); .srt checked (UTF-8, CRLF, no BOM); every .md text in a code block; 3 titles + A/B block (long only); one pinned comment; community schedule with offsets; reach rules applied; durations match the audio; look kit differs from the last 3 videos; new people reported; only requested changes; Definition of Done met.
