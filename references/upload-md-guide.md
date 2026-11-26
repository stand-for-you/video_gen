# Upload-details .md: the fixed format

The user approved `upload-details-gold.md` (It's Inside Your House) as the PERFECT upload file. Every video's .md must look exactly like it: same headings, same order, same fixed sentences, same code blocks. Only the story parts change.

Never write this file by hand. Fill `story/upload.json`, then run:
```
python3 tools/make_upload_md.py <File_Prefix>      ->  final/<File_Prefix>_Upload_Details.md
```
The script writes every fixed block word for word, takes the chapters from `src/shots_long.json` and the lengths from the final MP4s, adds the default tags, and lists the Kokoro voices from `story/voices.py` in the licence flag. It stops with a clear message if a field is missing.

Only 3 things differ from the gold file, because the engine improved after it: an "End screen" block after "How to pin it" (the long video now ends with a 20 s end screen), the Instagram note says the Reel has exactly ONE speaker, and Upload order step 2 mentions the .srt files and the end screen. (`--gold` turns these off; it rebuilds the gold file exactly and is only for testing.)

After running it, READ the whole file once: check the question appears in the 4 places, the chapters look right, nothing says "UNVERIFIED" where it is verified, and nothing invents numbers, times or account names.

## story/upload.json fields (copy the style of the gold file and engine/story/upload.json)
| Field | What to write |
|---|---|
| `title` | Story title for the heading, e.g. "It's Inside Your House" |
| `question` | The closing question, exactly as spoken last (used in 4 places automatically) |
| `titles.A/B/C` | `angle` = the kind of title in a few words (a short hook + the legend name; a time/place fact; a short warning). `text` = the title, under about 60 characters, no clickbait lies |
| `hindi_title` | Natural Hindi title (Devanagari) |
| `thumbs.A/B/C` | One line each: how that thumbnail looks and differs (A main, B close crop + 2-word title + smaller moon, C key object big and glowing) |
| `description` | 3 short paragraphs: (1) one creepy hook line, (2) the setup in 2-3 sentences without the twist, (3) "A Scroll Kaos paper-cutout horror story[, told in the ... person]. Watch until the very end." |
| `credit_long` | "Inspired by "<title>" by <author> (<site>, <year>). This is a [shortened,] non-graphic retelling in our own words, with original artwork." If the author is unknown, say so and use "as published on <site>". |
| `hashtags_long` | 4 hashtags: #horrorstories #<legend> #scarystories #creepypasta |
| `tags_story` | Story tags only, comma separated (the default channel tags are added by the script) |
| `short_title` | ONE Shorts title ending with " #shorts" |
| `short_hook` | One or two short sentences, no twist |
| `short_credit` | "Inspired by "<title>" by <author>. AI narration, original animation." |
| `short_hashtags` | "#shorts #horrorstories #<legend> #scarystories" |
| `ig_caption` | 2-3 caption lines (emoji allowed, 1-2 total); the script adds the credit and the question |
| `ig_credit` | "Inspired by ... AI narration, original paper-cutout animation by Scroll Kaos." |
| `ig_hashtags` | About 13 hashtags ending with #scrollkaos |
| `hindi_caption` | The Hindi caption as lines (use "" for an empty line); last line = the question in Hindi |
| `facebook` | 1-2 lines; the script adds `facebook_credit` and the question |
| `facebook_credit` | "Our new paper-cutout horror story, inspired by ... AI narration, original animation." |
| `threads` | 3 short lines (the last one: "New Scroll Kaos story, inspired by ..."); the script adds the question |
| `pinterest_title`, `pinterest_description` | Title with "Paper-Cutout Horror Story"; one-paragraph description with the credit and "AI narration." |
| `community.teaser` | 3 lines: a creepy moment, a "Tomorrow's story ..." line, a short question (no twist) |
| `community.long_first_line` | `New story is live: "<title>"` + 1-2 emoji |
| `community.long_second_line` | One line about the setting and the threat |
| `community.short_line` | One line after "The N-minute version is up as a Short." |
| `community.poll_options` | 4 scary moments from the story |
| `flags.top` | Story rights first (what the story page says about narration, the author, "get written permission before you publish or monetise"), then any legend-name or famous-image note |
| `flags.voice_translation` | Optional; default says the Reel has one speaker and AI voices are UNVERIFIED |
| `flags.age_restriction` | What could trigger an age restriction, and that nothing graphic is shown (UNVERIFIED) |
| `flags.bottom` | Non-graphic changes made; photosensitive note if relevant; what the Reel shortened; any other story-specific flag |
| `long_length`, `reel_length`, `chapters` | Optional overrides (normally left out: the script measures them) |
