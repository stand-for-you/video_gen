"""Unit tests for tools/split_story.py (engine v0.6). Run: python3 tools/split_story.py selftest
Synthetic timings only: they test the rules, not the voice. The 373 s case matches the length of the
reference video "I Know You're Awake" (6 min 13 s), which must split into two parts.
"""
import os, sys, json, tempfile, unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import split_story as S


def units_from(durations, texts, chapters=None, whos=None):
    chapters = chapters or {}
    whos = whos or {}
    out, t = [], 0.0
    for i, (d, txt) in enumerate(zip(durations, texts)):
        out.append(dict(i=i, beat=None, chapter=chapters.get(i), text=txt, who=whos.get(i, 'nar'),
                        start=t, end=t + d))
        t += d
    return out


def long_story(total=373.0, n=60, chapters=None, cue_unit=None, whos=None):
    d = [total / n] * n
    texts = ['The hallway was quiet and cold.'] * n
    texts[-1] = 'Would you have opened that door?'
    if cue_unit is not None:
        texts[cue_unit] = 'Suddenly the door opened.'
    return units_from(d, texts, chapters=chapters, whos=whos)


class Rules(unittest.TestCase):
    def test_clean_strips_character_tag(self):
        self.assertEqual(S.clean('[girl] "Mom, come down."'), '"Mom, come down."')

    def test_sentence_end_rule(self):
        self.assertTrue(S.ends_cleanly('She ran.'))
        self.assertTrue(S.ends_cleanly('Who is there?'))
        self.assertTrue(S.ends_cleanly('He said "run."'))
        self.assertFalse(S.ends_cleanly('and then the'))

    def test_cue_score_is_capped_at_three(self):
        score, hits = S.cue_score('Suddenly the door opened and a voice whispered, then nothing.')
        self.assertEqual(score, 3)
        self.assertIn('door', hits)


class Split(unittest.TestCase):
    def test_exactly_six_minutes_stays_one_part(self):
        plan = S.make_plan(long_story(total=360.0))
        self.assertEqual(plan['mode'], 'single')

    def test_just_over_six_minutes_splits(self):
        plan = S.make_plan(long_story(total=360.01))
        self.assertEqual(plan['mode'], 'two-part')

    def test_six_minutes_thirteen_seconds_splits_inside_the_balance_range(self):
        plan = S.make_plan(long_story(total=373.0))
        self.assertEqual(plan['mode'], 'two-part')
        share = plan['part1']['duration_s'] / plan['total_s']
        self.assertTrue(S.BAL_LO <= share <= S.BAL_HI, share)
        self.assertGreaterEqual(plan['part1']['duration_s'], S.MIN_PART_S)
        self.assertGreaterEqual(plan['part2']['duration_s'], S.MIN_PART_S)

    def test_cut_is_after_a_finished_sentence_and_question_stays_in_part_two(self):
        units = long_story(total=373.0)
        plan = S.make_plan(units)
        a = plan['part1']['units'][1]
        self.assertEqual(plan['part2']['units'][1], len(units) - 1)
        self.assertTrue(S.ends_cleanly(units[a]['text']))
        self.assertEqual(plan['closing_question'], 'Would you have opened that door?')

    def test_chapter_start_is_preferred_as_the_breakpoint(self):
        # chapter 'The Hallway' starts at unit 38 (inside the 35-65 % range); a tension sentence sits at unit 30
        units = long_story(total=373.0, chapters={38: 'The Hallway'}, cue_unit=30)
        plan = S.make_plan(units)
        self.assertEqual(plan['chosen']['k'], 38)
        self.assertEqual(plan['chosen']['parts']['new_chapter_after_cut'], 4)
        self.assertEqual(plan['part2']['subtitle'], 'The Hallway')

    def test_cut_between_two_dialogue_lines_is_penalised(self):
        whos = {20: 'girl', 21: 'girl'}
        units = long_story(total=373.0, whos=whos)
        c = S.score_cut(units, 21, 373.0)       # cut between unit 20 and 21, both spoken by the girl
        self.assertEqual(c['parts']['no_dialogue_break'], -3)

    def test_part_titles_use_the_story_title(self):
        plan = S.make_plan(long_story(total=373.0))
        self.assertTrue(plan['part1']['title'].endswith(' | Part 1'))
        self.assertTrue(plan['part2']['title'].endswith(' | Part 2'))


class RoundTrip(unittest.TestCase):
    def test_plan_then_check_on_disk(self):
        here = os.getcwd()
        with tempfile.TemporaryDirectory() as tmp:
            os.chdir(tmp)
            try:
                os.makedirs('audio/long')
                units = long_story(total=373.0)
                json.dump({'duration': 373.0, 'units': [dict(i=u['i'], beat=None, chapter=u['chapter'], text=u['text'],
                                                          who=u['who'], start=u['start'], end=u['end'])
                                                     for u in units]}, open('audio/long/timing.json', 'w'))
                self.assertEqual(S.main(['x', 'plan', 'long']), 0)
                self.assertTrue(os.path.exists('story/split/part1.txt'))
                self.assertTrue(os.path.exists('story/split/part2.txt'))
                self.assertEqual(S.main(['x', 'check', 'long']), 0)
            finally:
                os.chdir(here)


if __name__ == '__main__':
    unittest.main()
