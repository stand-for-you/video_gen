"""Scroll Kaos v0.5 - the one helper a scene table imports.

    S(id, kit=..., opts=..., anchor=..., preset=..., secs=..., framing=..., hands=...,
      actors=[...], sfx=[...], glitch=..., wash=..., held=False)

It is a dict builder with checks, so a typo fails at build time with a readable message
instead of silently drawing an empty room.
"""
from __future__ import annotations

KITS = ("CityBlock", "CarInterior", "ApartmentInterior", "RooftopBeam", "AwakeHouse")
PRESETS = ("idle_breath", "walk_bob", "sprint_bob", "lookback_sprint", "whip_pan",
           "impact_jolt", "vertigo_tilt", "crouch_peek", "backseat_car", "drift_wide")
HANDS = ("balance_wide", "reach_grab", "brace_door", "push_punch",
         "knock_open", "hold_phone", "brace_fall", "grip_rail")
FRAMING = ("full", "waist", "face")


def S(sid, kit, anchor, secs, opts=None, preset="idle_breath", framing="full",
      hands=None, actors=None, sfx=None, glitch=0, wash=None, washAmount=0,
      boil=2.2, held=False):
    assert kit in KITS, "%s: unknown kit %r (have %s)" % (sid, kit, ", ".join(KITS))
    assert preset in PRESETS, "%s: unknown camera preset %r" % (sid, preset)
    assert framing in FRAMING, "%s: framing must be one of %s" % (sid, ", ".join(FRAMING))
    assert hands is None or hands in HANDS, "%s: unknown hand pose %r" % (sid, hands)
    assert "pos" in anchor and "yaw" in anchor, "%s: anchor needs pos and yaw" % sid
    assert len(anchor["pos"]) == 3, "%s: anchor pos must be [x, y, z]" % sid
    for a in (actors or []):
        assert "id" in a, "%s: every actor needs an id" % sid
    return dict(id=sid, kit=kit, opts=opts or {}, anchor=anchor, preset=preset, secs=secs,
                framing=framing, hands=hands, actors=actors or [], sfx=sfx or [],
                glitch=glitch, wash=wash, washAmount=washAmount, boil=boil, held=held)
