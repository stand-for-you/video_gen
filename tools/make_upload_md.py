"""Build the upload-details .md in the channel's fixed format (references/upload-details-gold.md, the
"It's Inside Your House" file the user approved as perfect). Only story-specific text comes from story/upload.json;
every fixed block (A/B steps and rules, pin steps, AI note, Instagram steps, community table, upload order, standard flags)
is written word for word the same every time. Chapters come from src/shots_long.json; lengths from the final MP4s.
Usage (work folder): python3 tools/make_upload_md.py <File_Prefix>   ->  final/<File_Prefix>_Upload_Details.md
Add --gold to reproduce the gold file exactly (no end-screen block, gold upload order, gold voice note) for testing."""
import sys, os, json, subprocess, importlib
sys.path[:0] = ['story', '.']
T = sys.argv[1]; GOLD = '--gold' in sys.argv
U = json.load(open('story/upload.json', encoding='utf-8'))
NEED = ['title', 'question', 'titles', 'hindi_title', 'thumbs', 'description', 'credit_long', 'hashtags_long', 'tags_story', 'short_title', 'short_hook',
        'short_credit', 'short_hashtags', 'ig_caption', 'ig_credit', 'ig_hashtags', 'hindi_caption', 'facebook', 'facebook_credit', 'threads',
        'pinterest_title', 'pinterest_description', 'community', 'flags']
miss = [k for k in NEED if k not in U] + [f'titles.{k}' for k in 'ABC' if k not in U.get('titles', {})] + [f'thumbs.{k}' for k in 'ABC' if k not in U.get('thumbs', {})]
miss += [f'community.{k}' for k in ('teaser', 'long_first_line', 'long_second_line', 'short_line', 'poll_options') if k not in U.get('community', {})]
miss += [f'flags.{k}' for k in ('top', 'age_restriction', 'bottom') if k not in U.get('flags', {})]
if GOLD and 'voice_note_gold' not in U: miss.append('voice_note_gold')
if miss: sys.exit('story/upload.json is missing: ' + ', '.join(miss) + '  (see references/upload-md-guide.md)')
Q = U['question']
assert U['hindi_caption'] and U['ig_caption'], 'captions must not be empty'
DEFAULT_TAGS = 'scary stories, horror stories, creepypasta, creepy stories, mystery stories, unsolved mysteries, horror shorts, scary shorts, short horror story, nightmare stories, paranormal, spooky stories, late night stories, dark stories, story time, Scroll Kaos'

def mmss(sec, floor=False): sec = int(sec) if floor else int(round(sec)); return f'{sec // 60}:{sec % 60:02d}'
def length(kind):
    if U.get(f'{kind}_length'): return U[f'{kind}_length']
    f = f'final/{T}_{"YouTube_1920x1080" if kind == "long" else "Reel_1080x1920"}.mp4'
    if os.path.exists(f):
        r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True)
        return mmss(float(r.stdout.strip()))
    _d = json.load(open(f'src/shots_{kind}.json'))
    return mmss(_d.get('total_frames', _d.get('frames', 0)) / 10)
def chapters():
    if U.get('chapters'): return U['chapters']
    data = json.load(open('src/shots_long.json'))
    if 'chapter_times' in data:
        return [f'{mmss(t, floor=True)} {c}' for t, c in data['chapter_times']]
    if 'chapters' in data:
        return [f'{mmss(ch["t"], floor=True)} {ch["title"]}' for ch in data['chapters']]
    return ['0:00 Intro']
def block(lines): return '```\n' + ('\n'.join(lines) if isinstance(lines, list) else lines) + '\n```'
def tags():
    story = [t.strip() for t in U['tags_story'].split(',') if t.strip()]
    seen, out = set(), []
    for t in story + [t.strip() for t in DEFAULT_TAGS.split(',')]:
        if t.lower() not in seen: seen.add(t.lower()); out.append(t)
    return ', '.join(out)
def voices_line():
    if U.get('voice_licence_flag'): return U['voice_licence_flag']
    try:
        v = importlib.import_module('voices'); names = []
        for k, (n, _) in v.VOICES.items():
            if n not in names: names.append(n)
    except Exception:
        names = ['af_nicole']
    vs = ', '.join(names[:-1]) + ' and ' + names[-1] if len(names) > 1 else names[0]
    return f'- AI voice licences: Kokoro-82M is Apache-2.0; the terms for the {vs} voice{"s" if len(names) > 1 else ""} are UNVERIFIED. Check before monetising.'

L_LEN, R_LEN = length('long'), length('reel')
CH = chapters()
reel_min = int(R_LEN.split(':')[0])
out = []
W = out.append
W(f"# {U['title']} — Upload Details (Scroll Kaos)\n")
W('Files in this set:')
W(f'- {T}_YouTube_1920x1080.mp4 (long video, about {L_LEN})')
W(f'- {T}_Reel_1080x1920.mp4 (Reel / Short, about {R_LEN}, English captions burned in)')
W(f'- {T}_Thumb_A_1280x720.jpg, _Thumb_B_, _Thumb_C_ (YouTube A/B test set)')
W(f'- {T}_Reel_Thumb_1080x1920.jpg (Reel / Short cover)')
W(f'- {T}_English.srt, {T}_Hindi.srt\n')
W('---\n')
W('## YouTube (long video)\n')
W('**Closing question (the same exact words are used in 4 places: the last spoken line, the last on-screen text, the end of the Reel caption, and both pinned comments):**\n')
W(block(Q) + '\n')
W('### Title options\n')
for k in 'ABC':
    W(f"Title {k} ({U['titles'][k]['angle']}):")
    W(block(U['titles'][k]['text']) + '\n')
W('Hindi title (optional, for a Hindi title track):')
W(block(U['hindi_title']) + '\n')
W('### A/B test (long video only)\n')
W('| File | How it differs |')
W('|---|---|')
for k in 'ABC': W(f"| {T}_Thumb_{k}_1280x720.jpg | {U['thumbs'][k]} |")
W('')
W('Titles for the title test: use Title A, Title B and Title C above.\n')
W('Steps (YouTube Studio menu names are UNVERIFIED):')
W(block(['1. YouTube Studio > Content > open the video > click the thumbnail.',
         '2. Choose "Test & compare" and upload Thumbnail A, B and C.',
         '3. If Studio also offers a title test, add Title A, B and C.',
         '4. Start the test.',
         '5. If Studio only allows one test type at a time: run the THUMBNAIL test first, then test the titles on a later video or after the first test ends.']) + '\n')
W('Rules while the test runs:')
W(block(['- Do not change the title or thumbnail by hand while a test is running.',
         '- Let YouTube pick the winner. It can take days (UNVERIFIED). Do not judge it by the first few hours.',
         '- Do not share the link in family or friends groups to "help" the test. Weak early watching can confuse the result (creator advice, UNVERIFIED).',
         '- Keep the winning title and thumbnail. Tell me the winner and I will note it.']) + '\n')
W('### Description\n')
desc = []
for p in U['description']: desc += [p, '']
desc += [Q, '', 'Chapters:'] + CH + ['', U['credit_long'], '', 'The narration voices are AI generated (text-to-speech). The story is fiction.', '', U['hashtags_long']]
W(block(desc) + '\n')
W('### Chapters only (if you need them on their own)\n')
W(block(CH) + '\n')
W('### Tags\n')
W(block(tags()) + '\n')
W('### Pinned comment (one text for BOTH the long video and the Short)\n')
W(block([U.get('pinned_first_line', 'Thank you for watching this one in the dark 🖤'), Q, 'Watch the full story on the channel. New short stories every week.']) + '\n')
W('How to pin it:')
W(block(['1. Right after you publish, post the comment above from your channel account.',
         '2. Tap the three dots next to the comment > Pin.',
         '3. Only one comment can be pinned at a time (UNVERIFIED if this changes).']) + '\n')
if not GOLD:
    W('### End screen (last 20 seconds of the long video)\n')
    W('The last 20 seconds are drawn with two empty video boxes on the right and an empty circle in the lower middle. Put YouTube\'s end-screen elements on them:')
    W(block(['1. YouTube Studio > Content > open the video > Editor > End screen (menu names UNVERIFIED).',
             '2. Add 2 video elements (for example "Most recent upload" and "Best for viewer") on the two boxes on the right.',
             '3. Add a Subscribe element on the circle in the lower middle.',
             '4. Start all elements at the start of the last 20 seconds and save.']) + '\n')
W('### AI-content disclosure note\n')
W(block('When you upload, YouTube Studio may ask if the video has "altered or synthetic content". The narration voices are AI text-to-speech; the pictures are drawn animation, not realistic people. Answer the question honestly for your channel (whether a label is required for this kind of video is UNVERIFIED).') + '\n')
W('---\n')
W('## YouTube Shorts (use the Reel file; ONE title, no A/B test)\n')
W('Title:')
W(block(U['short_title']) + '\n')
W('Description:')
W(block([U['short_hook'], U['short_credit'], 'Watch the full story on the channel.', Q, U['short_hashtags']]) + '\n')
W('Pinned comment: use the same pinned comment from the YouTube section above.\n')
W('---\n')
W('## Instagram Reel\n')
W('Caption (ends with the closing question):')
W(block(U['ig_caption'] + ['', U['ig_credit'], '', Q]) + '\n')
W('Hashtags:')
W(block(U['ig_hashtags']) + '\n')
W('Hindi caption (optional):')
W(block(U['hindi_caption']) + '\n')
W('Voice translation steps (menu names UNVERIFIED):')
note = U['voice_note_gold'] if GOLD else 'Note: this Reel has exactly ONE speaker (the narrator), so the "multiple speakers" error should not happen. Whether Instagram translates AI voices is UNVERIFIED. If it still fails, tell me.'
W(block(['1. Upload the Reel and go to the last screen before sharing.',
         '2. Open "Advanced settings" (or "More options").',
         '3. Turn on "Translate your voice with Meta AI" (or a similar voice translation switch).',
         '4. Pick the languages if it asks, then share.', note]) + '\n')
W('AI label note:')
W(block('In "Advanced settings", turn on the AI label ("AI info" or "Made with AI") if Instagram offers it, because the narration voices are AI generated (menu name UNVERIFIED).') + '\n')
W('Best posting time (do not guess times):')
W(block(['1. Professional dashboard > Insights > Total followers > Most active times (menu names UNVERIFIED).',
         '2. Look at the days and hours when your followers are most active.',
         '3. Post Reels inside those hours, on a steady schedule (for example the same days each week).']) + '\n')
W('Collab invite (you do this yourself; I never contact anyone):')
W(block(['1. On the last screen before sharing: Tag people > Invite collaborator (menu names UNVERIFIED).',
         '2. Choose the account. They must accept. The Reel then shows to both audiences.',
         'Types of accounts to invite:',
         '- Horror story or creepypasta pages',
         '- Paper-art, paper-cutout or animation pages',
         '- Horror narrators or voice storytellers']) + '\n')
W('---\n')
W('## Facebook (post)\n')
W(block(U['facebook'] + ['', U['facebook_credit'], '', Q]) + '\n')
W('## Threads (post)\n')
W(block(U['threads'] + [Q]) + '\n')
W('## Pinterest\n')
W('Title:')
W(block(U['pinterest_title']) + '\n')
W('Description:')
W(block(U['pinterest_description']) + '\n')
W('---\n')
W('## Community post schedule (YouTube Studio > Create > Create post; scheduling in the post box is UNVERIFIED)\n')
W('Use the best times from YouTube Studio > Analytics > Audience > "When your viewers are on YouTube" (menu names UNVERIFIED). No clock times are given here on purpose.\n')
W('| # | Post | When (offset) | Image |')
W('|---|---|---|---|')
W('| 1 | Teaser | About 1 day before the long video goes public | Reel thumbnail or Thumbnail A |')
W('| 2 | Long video post | At the same time the long video is published | The winning (or first) thumbnail |')
W('| 3 | Short post | Same day as the Short, at its publish time | Reel thumbnail |')
W('| 4 | Follow-up poll (optional) | A day or more after the long video | No image needed |\n')
C = U['community']
W('1. Teaser:')
W(block(C['teaser']) + '\n')
W('2. Long video post:')
W(block([C['long_first_line'], C['long_second_line'], Q, '[paste the video link here]']) + '\n')
W('3. Short post:')
W(block([f'The {reel_min}-minute version is up as a Short. {C["short_line"]}', 'Watch the full story on the channel.', '[paste the Short link here]']) + '\n')
W('4. Follow-up poll — question:')
W(block('Which moment scared you the most?'))
W('Poll options (one per line):')
W(block(C['poll_options']) + '\n')
W('Possible extra (creator advice from a video you watched, UNVERIFIED, not confirmed by YouTube): a Community post made when the video is published may give viewers a second notification. It is only a possible extra; no result is promised.\n')
W('### Upload order\n')
step2 = '2. Long video (+ pinned comment, start the A/B test)' if GOLD else '2. Long video (+ English and Hindi .srt, end screen, pinned comment, start the A/B test)'
W(block(['1. Teaser community post (about 1 day before)', step2, '3. Long video community post', '4. Short (+ pinned comment)', '5. Short community post', '6. Follow-up poll (a day or more later)']) + '\n')
W('---\n')
W('## Flags (please read)\n')
F = U['flags']
flags = list(F['top'])
flags += ['- Thumbnail size limit (2 MB) is UNVERIFIED. Our files are about 100-250 KB.',
          f'- Reel length: Reels over about 3 minutes may be rejected (UNVERIFIED). This Reel is about {R_LEN}.',
          F.get('voice_translation', '- Instagram Voice translation with AI voices is UNVERIFIED. This Reel has one speaker only.'),
          voices_line(),
          '- Remotion (the animation tool) is free for individuals and teams of up to 3 people; a company licence is needed for 4 or more.',
          F['age_restriction'],
          '- A/B test availability (thumbnail test, title test, 3 variants) on your channel is UNVERIFIED.',
          '- Community post scheduling is UNVERIFIED.',
          '- Reach note: reach changes from post to post. Judge after several Reels (for example 4-5), not one. Follower count can dip for a while. These reach notes are for Instagram only; nothing here is promised for YouTube or other platforms.']
flags += F['bottom']
W('\n'.join(flags))
os.makedirs('final', exist_ok=True)
dst = f'final/{T}_Upload_Details.md'
open(dst, 'w', encoding='utf-8').write('\n'.join(out))
print('written', dst, '| long', L_LEN, '| reel', R_LEN, '| chapters', len(CH))
