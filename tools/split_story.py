"""STORY SPLITTING (engine v0.6). Decides whether a story is one part or two, and where Part 1 ends.

Usage (work folder, after tools/tts.py has written audio/<name>/timing.json):
  python3 tools/split_story.py plan long     # decide + write story/split/split_plan.json and story/split/part1.txt, part2.txt
  python3 tools/split_story.py check long    # re-check the saved plan against the timing; exit 1 = FAIL
  python3 tools/split_story.py selftest      # unit tests of the rules (no audio needed)

RULES (permanent default, see references/story-splitting.md):
  - total narration <= 360 s (6:00 exactly)  -> ONE part, the normal workflow. Nothing is split.
  - total narration >  360 s                 -> TWO parts: Part 1 and Part 2, split at a natural breakpoint.
  - The cut is always at the END of a spoken sentence (never inside a sentence or a quote).
  - The cut is scored: a new chapter starting after the cut, a question or an exclamation at the cut, cue words that
    raise tension ("suddenly", "door", "voice" ...), and a balance rule (each part near the middle, but not forced equal).
  - Dialogue is not cut in the middle of a back-and-forth (both sides spoken by characters).
  - The closing question always stays in Part 2 (Part 2 is the ending).
Standard library only, so it runs anywhere Python 3 runs.
"""
import sys, json, os, re

LIMIT_S = 360.0          # strictly more than this splits. Exactly 360.0 s stays one part.
MIN_PART_S = 120.0       # a part shorter than this is refused (a Part must be a complete mini-story)
BAL_LO, BAL_HI = 0.35, 0.65   # share of the total that Part 1 may take (hard rule when a cut exists)
RELAX_LO, RELAX_HI = 0.20, 0.80  # used only when no cut exists in 35-65 %; a WARN is written

# words that raise tension at the cut (each one counts once, the cue score is capped at 3)
CUES = ['suddenly', 'then', 'but', 'never', 'until', 'door', 'voice', 'behind', 'knock', 'whisper',
        'gone', 'nothing', 'again', 'someone', 'heard', 'scream', 'screamed', 'dead', 'silence', 'waited',
        'footsteps', 'window', 'phone', 'message', 'reply', 'morning', 'night', 'secret', 'truth']


def clean(text):
    """Remove a character tag such as [girl] at the start of a unit (same rule as tools/words.py)."""
    return re.sub(r'^\[\w+\]', '', str(text)).strip()


def ends_cleanly(text):
    """True when a unit ends on a full stop, question mark, exclamation mark or closing quote."""
    return bool(re.search(r'[.?!]["\')\]]?$', clean(text)))


def cue_score(text):
    low = clean(text).lower()
    hits = [c for c in CUES if re.search(r'\b' + re.escape(c) + r'\b', low)]
    return min(3, len(hits)), hits


def load_units(name):
    tm = json.load(open(f'audio/{name}/timing.json', encoding='utf-8'))
    units = []
    for k, u in enumerate(tm['units']):
        units.append(dict(i=u.get('i', k), beat=u.get('beat'), chapter=u.get('chapter'),
                          text=clean(u.get('text', '')), who=u.get('who', 'nar'),
                          start=float(u['start']), end=float(u['end'])))
    if not units:
        raise SystemExit('timing.json has no units')
    return units


def total_seconds(units):
    return units[-1]['end'] - units[0]['start']


def score_cut(units, k, total):
    """Score a cut that puts units[:k] in Part 1 and units[k:] in Part 2."""
    a, b = units[k - 1], units[k]
    d1 = a['end'] - units[0]['start']
    d2 = units[-1]['end'] - b['start']
    frac = d1 / (d1 + d2)
    comp = {}
    comp['new_chapter_after_cut'] = 4 if b.get('chapter') else 0
    comp['question_or_exclaim'] = 3 if a['text'].endswith('?') else (2 if a['text'].endswith('!') else 0)
    cues, hits = cue_score(a['text'])
    comp['tension_words'] = cues
    comp['no_dialogue_break'] = -3 if (a['who'] != 'nar' and b['who'] != 'nar') else 0
    comp['balance'] = round(-6 * abs(frac - 0.5), 2)
    return dict(k=k, frac=round(frac, 3), d1=round(d1, 2), d2=round(d2, 2),
                score=round(sum(comp.values()), 2), parts=comp, cue_words=hits)


def valid_cuts(units, total, lo, hi):
    out = []
    for k in range(1, len(units)):          # the last unit always stays in Part 2
        a = units[k - 1]
        if not ends_cleanly(a['text']):
            continue                          # never cut inside a sentence
        c = score_cut(units, k, total)
        if c['d1'] < MIN_PART_S or c['d2'] < MIN_PART_S:
            continue
        if not (lo <= c['frac'] <= hi):
            continue
        out.append(c)
    return out


def active_chapter(units, idx):
    """The chapter title in force at unit idx (the last chapter that started at or before it); '' if none yet."""
    name = ''
    for u in units[:idx + 1]:
        if u.get('chapter'):
            name = u['chapter']
    return name


def make_plan(units, title='STORY TITLE'):
    total = total_seconds(units)
    if total <= LIMIT_S:
        return dict(mode='single', total_s=round(total, 2), limit_s=LIMIT_S, title=title,
                    note='Total is 6:00 or less. One part. The normal workflow runs unchanged.')
    warnings = []
    cands = valid_cuts(units, total, BAL_LO, BAL_HI)
    if not cands:
        cands = valid_cuts(units, total, RELAX_LO, RELAX_HI)
        warnings.append('No natural cut between 35 % and 65 %. The cut was widened to 20-80 %. Check the Part 2 writing.')
    if not cands:
        raise SystemExit('No sentence boundary gives two parts of at least 2 minutes each. Add a chapter break in the script.')
    best = max(cands, key=lambda c: (c['score'], -abs(c['frac'] - 0.5)))
    k = best['k']
    if best['d1'] > LIMIT_S or best['d2'] > LIMIT_S:
        warnings.append('One part is longer than 6:00. The rule still makes two parts; tell the user.')
    p1_end_text = units[k - 1]['text']
    p2_start_text = units[k]['text']
    if best['score'] < 3:
        warnings.append('Weak cliffhanger at the cut (score %s). Try rewriting the last sentence of Part 1.' % best['score'])
    last_chapter_p1 = active_chapter(units, k - 1)
    chapter_p2 = active_chapter(units, k)
    plan = dict(
        mode='two-part', total_s=round(total, 2), limit_s=LIMIT_S, title=title,
        cut_after_unit=k - 1, cut_before_unit=k, chosen=best,
        candidates_considered=len(cands),
        part1=dict(name='Part 1', title='%s | Part 1' % title, subtitle=last_chapter_p1 or '',
                   units=[0, k - 1], start_s=round(units[0]['start'], 2), end_s=round(units[k - 1]['end'], 2),
                   duration_s=round(best['d1'], 2), last_line=p1_end_text),
        part2=dict(name='Part 2', title='%s | Part 2' % title, subtitle=chapter_p2 or '',
                   units=[k, len(units) - 1], start_s=round(units[k]['start'], 2), end_s=round(units[-1]['end'], 2),
                   duration_s=round(best['d2'], 2), first_line=p2_start_text),
        closing_question=units[-1]['text'],
        warnings=warnings,
        note=('Cut after a finished sentence at a natural breakpoint. Part 2 must open by continuing the same moment '
              '(add a 1-sentence recap only if needed). Subtitles are a suggestion: the writer confirms them.'))
    return plan


def write_plan(name, plan, units):
    os.makedirs('story/split', exist_ok=True)
    json.dump(plan, open('story/split/split_plan.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    if plan['mode'] != 'two-part':
        print(plan['note'])
        return
    for pid, rng in (('part1', plan['part1']['units']), ('part2', plan['part2']['units'])):
        lines = ['# %s - narration lines (writer reviews, then the normal pipeline runs on this text)' % pid, '']
        for u in units[rng[0]:rng[1] + 1]:
            if u.get('chapter'):
                lines.append('## %s' % u['chapter'])
            lines.append('[%0.2f-%0.2f] %s' % (u['start'], u['end'], u['text']))
        open('story/split/%s.txt' % pid, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')


def check_plan(name, units):
    fails, warns = [], []
    plan = json.load(open('story/split/split_plan.json', encoding='utf-8'))
    total = total_seconds(units)
    def ok(cond, msg):
        if not cond: fails.append(msg)
    print('Total narration: %.2f s (limit %.0f s)' % (total, LIMIT_S))
    expect = 'single' if total <= LIMIT_S else 'two-part'
    ok(plan['mode'] == expect, 'mode is %s but duration says %s' % (plan['mode'], expect))
    if plan['mode'] == 'two-part':
        p1, p2 = plan['part1'], plan['part2']
        a, b = p1['units'][1], p2['units'][0]
        ok(b == a + 1, 'parts do not join: Part 1 ends at unit %d, Part 2 starts at %d' % (a, b))
        ok(p1['units'][0] == 0 and p2['units'][1] == len(units) - 1, 'parts do not cover the whole story')
        ok(p1['duration_s'] >= MIN_PART_S and p2['duration_s'] >= MIN_PART_S,
           'a part is shorter than %.0f s' % MIN_PART_S)
        share = p1['duration_s'] / (p1['duration_s'] + p2['duration_s'])
        if not (BAL_LO <= share <= BAL_HI):
            warns.append('Part 1 share is %.0f %% (aim 35-65 %%)' % (share * 100))
        last = units[a]['text']
        ok(ends_cleanly(last), 'Part 1 ends in the middle of a sentence: "%s"' % last[-60:])
        ok(units[-1]['text'] == plan['closing_question'], 'closing question is not the last line of Part 2')
        if plan['chosen']['score'] < 3:
            warns.append('weak cliffhanger at the cut (score %s)' % plan['chosen']['score'])
    for f in fails: print('FAIL  ' + f)
    for w in warns: print('WARN  ' + w)
    if not fails and not warns: print('PASS  split plan matches the timing')
    return 1 if fails else 0


def main(argv):
    if len(argv) < 2:
        print(__doc__); return 2
    cmd = argv[1]
    if cmd == 'selftest':
        import unittest, test_split_story
        suite = unittest.defaultTestLoader.loadTestsFromModule(test_split_story)
        res = unittest.TextTestRunner(verbosity=1).run(suite)
        return 0 if res.wasSuccessful() else 1
    name = argv[2] if len(argv) > 2 else 'long'
    units = load_units(name)
    title = 'STORY TITLE'
    if os.path.exists('story/upload.json'):
        title = str(json.load(open('story/upload.json', encoding='utf-8')).get('title') or title)
    if cmd == 'plan':
        plan = make_plan(units, title)
        write_plan(name, plan, units)
        print('mode: %s   total: %.2f s' % (plan['mode'], plan['total_s']))
        if plan['mode'] == 'two-part':
            c = plan['chosen']
            print('Part 1: %.1f s  |  Part 2: %.1f s  |  cut after: "%s"' % (c['d1'], c['d2'], plan['part1']['last_line']))
            print('Part 2 opens with: "%s"' % plan['part2']['first_line'])
            print('score %s (new chapter %s, question %s, tension words %s)' % (
                c['score'], c['parts']['new_chapter_after_cut'], c['parts']['question_or_exclaim'], c['cue_words']))
        for w in plan.get('warnings', []): print('WARN  ' + w)
        return 0
    if cmd == 'check':
        return check_plan(name, units)
    print(__doc__); return 2


if __name__ == '__main__':
    sys.exit(main(sys.argv))
