# Scroll Kaos Video Generator & Cloud Compiler

An automated Yamishibai horror animation pipeline using **Remotion**, **Kokoro TTS**, **FFmpeg**, and **GitHub Actions**.

## 🚀 Cloud Rendering via GitHub Actions

This repository is configured to render and encode high-definition videos completely in the cloud using **GitHub Actions**, keeping your local computer cool and responsive.

### Deliverables Generated per Run:
1. **YouTube Long Video:** 1920x1080 (16:9), Lanczos scaled, 2-pass libx264, continuous narration + ducked drone audio.
2. **Reel / Short Video:** 1080x1920 (9:16), redrawn scenes, burned-in ASS subtitles with Lora font.
3. **Subtitles:** English `.srt` and Hindi `.srt` (UTF-8 CRLF without BOM).
4. **4 Thumbnails:**
   - 3 YouTube Thumbnails (1280x720, Variants A, B, C for A/B testing).
   - 1 Reel Thumbnail (1080x1920).
5. **Upload Details:** Markdown file containing titles, descriptions, chapters, tags, comments, and schedule.

---

## ⚡ How to Trigger Cloud Compilation

### Option A: From GitHub Actions Web UI
1. Go to the **Actions** tab on your GitHub repository: [`stand-for-you/video_gen`](https://github.com/stand-for-you/video_gen/actions).
2. Select **Scroll Kaos Video Cloud Compiler** in the left sidebar.
3. Click **Run workflow**:
   - **File Prefix:** e.g. `I_Know_Youre_Awake`
   - **Target:** `all`, `long`, `reel`, or `thumbs`
4. Click **Run workflow**.

### Option B: From Command Line via GitHub CLI (`gh`)
```bash
# Render all videos, subtitles, and thumbnails in parallel
gh workflow run render.yml -f file_prefix=I_Know_Youre_Awake -f target=all

# Or render only the Reel video:
gh workflow run render.yml -f file_prefix=I_Know_Youre_Awake -f target=reel

# Check the live progress:
gh run watch
```

---

## 📁 Project Architecture

- `src/` — Remotion React compositions, character models, scene definitions, and animations.
- `story/` — Story script, scene maps, voice assignments, and upload metadata.
- `tools/` — Automation scripts for TTS, shot calculation, audio ducking/limiting, and rendering.
- `audio/` — Pre-encoded loudness-normalized voice and sound effects.
- `fonts/` — Lora typeface for burned-in captions.
- `.github/workflows/render.yml` — Multi-runner parallel cloud build workflow.
