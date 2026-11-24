#!/bin/bash
# PRE-FLIGHT: everything that can be checked WITHOUT rendering. Takes about a second.
# Usage (work folder):  bash tools/preflight.sh
#
# Why this exists: repeated pictures are fully visible in the shot list. Checking them
# after a 14-minute cloud render turns every fix into a 25-minute guess. Run this instead,
# fix what it names, run it again, and only compile once it is green.
#
# THE LOOP:
#   edit story/scenes_<name>.py  ->  bash tools/preflight.sh  ->  repeat until green
#   then, and only then:  gh workflow run compile.yml -f target=all
set -u
cd "$(dirname "$0")/.."
fail=0
for n in long reel; do
  [ -f "story/scenes_$n.py" ] || continue
  echo "=============================== $n"
  if ! python3 tools/build_shots.py "$n"; then fail=1; echo "  (build_shots stopped: see the fix list above)"; continue; fi
  python3 tools/quality_gate.py shots "$n" || fail=1
done
echo
if [ "$fail" = 0 ]; then
  echo "PRE-FLIGHT PASS - safe to compile:  gh workflow run compile.yml -f target=all"
else
  cat <<'EOF'
PRE-FLIGHT FAIL - do NOT compile yet. Nothing has been rendered, so nothing is wasted.

How to fix, in order:
  1. "identical scene specs"  -> the FIX LIST names each repeated shot and its timestamps.
                                 Give each one its own entry in story/scenes_<name>.py.
  2. "beats needing more scenes" -> add that many MORE scenes to those beats, so the
                                 builder never has to recycle one.
  3. "one set carrying too much of the video" -> this is the real cause of a repetitive
                                 video. Three rooms cannot carry 74 shots. Write more
                                 places: outside, a corridor, a different time of day.

A shot counts as NEW only if at least TWO of these change:
  camera position / angle, who is in shot and where, the light, a prop's state.
Changing only the framing tag, or mirroring the shot, does not count.
EOF
fi
exit $fail
