"""Shared engine settings (engine.json) for every Python tool."""
import json, os
_C = json.load(open(os.path.join(os.path.dirname(__file__), '..', 'engine.json')))
FPS = int(_C.get('fps', 30)); SCALE = float(_C.get('scale', 1.0)); DISSOLVE = int(_C.get('dissolve', 8)); CRF = int(_C.get('crf', 18)); PARTS = int(_C.get('parts', 6))
