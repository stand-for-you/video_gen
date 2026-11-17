#!/bin/bash
# CLOUD COMPILE: render this work folder on GitHub Actions (free, parallel runners) instead of this computer.
# Needs: the GitHub CLI `gh`, logged in (`gh auth login`) with PUSH rights to the compile repo, e.g. stand-for-you/video_gen.
# The repo receives a copy of this work folder (it already contains ci/ and .github/workflows/compile.yml), then the
# "Scroll Kaos Cloud Compiler" workflow renders every part in parallel and builds the package.
#
# Run from the work folder AFTER: tts, build_shots, quality_gate shots, mix, loud, subs, QA sheets (same point as tools/render.sh).
#   bash tools/cloud_compile.sh start <owner/repo> <File_Prefix> [all|long|reel|thumbs]   -> pushes, starts, prints RUN_ID
#   bash tools/cloud_compile.sh wait  <owner/repo> <RUN_ID>      -> waits up to 9 minutes; run again until it says DONE
#   bash tools/cloud_compile.sh get   <owner/repo> <RUN_ID> <File_Prefix>   -> downloads the package into final/
# Then still run `python3 tools/quality_gate.py video ...` on the downloaded videos (the runner already wrote final/QUALITY_GATE.txt).
set -e
cd "$(dirname "$0")/.."
CMD="${1:?start | wait | get}"; REPO="${2:?owner/repo, e.g. stand-for-you/video_gen}"
[[ "$REPO" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || { echo "bad repo name $REPO"; exit 1; }
command -v gh > /dev/null || { echo "ERROR: GitHub CLI 'gh' is not installed (https://cli.github.com)"; exit 1; }
# Check real API access instead of `gh auth status`: in some sessions the proxy supplies the token and
# `gh auth status` reports a failure although every API call works.
gh api "repos/$REPO" --jq .full_name > /dev/null 2>&1 || { echo "ERROR: gh cannot reach $REPO. Run: gh auth login (or attach the repo to this session)"; exit 1; }

if [ "$CMD" = start ]; then
  T="${3:?give a file prefix, e.g. I_Know_Youre_Awake}"; WHAT="${4:-all}"
  [[ "$T" =~ ^[A-Za-z0-9_-]{1,80}$ ]] || { echo "bad file prefix $T (letters, numbers, _ and - only)"; exit 1; }
  case "$WHAT" in all|long|reel|thumbs) ;; *) echo "bad target $WHAT"; exit 1;; esac
  [ -f src/shots_long.json ] && [ -f src/shots_reel.json ] || { echo "ERROR: run tools/build_shots.py long and reel first"; exit 1; }
  for k in long reel; do
    [ -f "audio/$k/final_safe.m4a" ] || python3 tools/safe_audio.py "$k"   # the runners get the finished audio, not the .wav files
  done
  [ -f out/en.srt ] && [ -f out/hi.srt ] && [ -f audio/reel/captions.ass ] || { echo "ERROR: run tools/subs.py long and reel first"; exit 1; }
  D=.cloud/repo
  if [ -d "$D/.git" ]; then
    git -C "$D" fetch -q --depth 1 origin main && git -C "$D" reset -q --hard origin/main
  else
    # plain git (the GraphQL route that "gh repo clone" uses is blocked in this session)
    rm -rf "$D"; mkdir -p .cloud; git clone -q --depth 1 "https://github.com/$REPO" "$D"
  fi
  # mirror this work folder into the repo (heavy and generated folders stay out; see .gitignore)
  # the compiler itself (.github, ci) stays in the repo; a newer copy from this folder overwrites it
  find "$D" -mindepth 1 -maxdepth 1 ! -name .git ! -name .github ! -name ci ! -name README.md -exec rm -rf {} +
  tar --exclude=./node_modules --exclude=./.cloud --exclude=./build --exclude=./renders --exclude=./final --exclude=./qa \
      --exclude=./models --exclude='*.wav' --exclude=./.browser --exclude='__pycache__' -cf - . | (cd "$D" && tar -xf -)
  git -C "$D" add -A
  ID=(); [ -n "$(git -C "$D" config user.email)" ] || ID=(-c user.name="Scroll Kaos" -c user.email="scroll-kaos@localhost")
  git -C "$D" ${ID[@]+"${ID[@]}"} commit -q -m "compile $T ($WHAT) [skip ci]" || echo "(no file changes; compiling the current repo content)"
  git -C "$D" push -q origin HEAD:main
  SHA=$(git -C "$D" rev-parse HEAD)
  gh api -X POST "repos/$REPO/actions/workflows/compile.yml/dispatches" -f ref=main \
    -f "inputs[file_prefix]=$T" -f "inputs[target]=$WHAT" > /dev/null
  RUN=""
  for i in $(seq 1 30); do
    sleep 4
    RUN=$(gh api "repos/$REPO/actions/workflows/compile.yml/runs?event=workflow_dispatch&per_page=5" --jq ".workflow_runs[] | select(.head_sha == \"$SHA\") | .id" | head -1)
    [ -n "$RUN" ] && break
  done
  [ -n "$RUN" ] || { echo "ERROR: the run did not appear; check https://github.com/$REPO/actions"; exit 1; }
  echo "RUN_ID=$RUN"
  echo "watch: https://github.com/$REPO/actions/runs/$RUN"
  echo "next:  bash tools/cloud_compile.sh wait $REPO $RUN"
elif [ "$CMD" = wait ]; then
  RUN="${3:?RUN_ID}"
  end=$(( $(date +%s) + 540 ))
  while :; do
    S=$(gh api "repos/$REPO/actions/runs/$RUN" --jq '.status + " " + (.conclusion // "")')
    echo "$(date +%H:%M:%S) $S"
    case "$S" in completed\ success) echo "DONE: success. next: bash tools/cloud_compile.sh get $REPO $RUN <File_Prefix>"; exit 0;;
      completed\ *) echo "DONE: FAILED ($S). See: gh run view $RUN -R $REPO --log-failed"; exit 2;; esac
    [ "$(date +%s)" -ge "$end" ] && { echo "still running: run this command again"; exit 0; }
    sleep 45
  done
elif [ "$CMD" = get ]; then
  RUN="${3:?RUN_ID}"; T="${4:?File_Prefix}"
  [[ "$T" =~ ^[A-Za-z0-9_-]{1,80}$ ]] || { echo "bad file prefix $T"; exit 1; }
  rm -rf .cloud/dl; mkdir -p .cloud final   # fresh folder: gh does not overwrite files that already exist
  AID=$(gh api "repos/$REPO/actions/runs/$RUN/artifacts" --jq ".artifacts[] | select(.name == \"scroll-kaos-$T\") | .id" | head -1)
  [ -n "$AID" ] || { echo "ERROR: no artifact scroll-kaos-$T on run $RUN"; exit 2; }
  mkdir -p .cloud/dl; gh api "repos/$REPO/actions/artifacts/$AID/zip" > .cloud/art.zip
  (cd .cloud/dl && unzip -oq ../art.zip)
  cp -f .cloud/dl/* final/ && rm -rf .cloud/dl
  ls -la final
  [ -f final/QUALITY_GATE.txt ] && grep -E "^(==|FAIL|QUALITY)" final/QUALITY_GATE.txt || true
else
  echo "use: start | wait | get"; exit 1
fi
