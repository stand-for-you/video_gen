// Scroll Kaos v0.5 - kit registry. A shot names its set by this key and nothing else.
// Adding a kit = add the builder here AND a row in references/kits-used.md.
import { buildCityBlock, CITYBLOCK_READABLE } from './CityBlock';
import { buildCarInterior, CARINTERIOR_READABLE } from './CarInterior';
import { buildApartmentInterior, APARTMENT_READABLE } from './ApartmentInterior';
import { buildRooftopBeam, ROOFTOP_READABLE } from './RooftopBeam';
import { buildStudio, STUDIO_READABLE } from './Studio';
import { buildAwakeHouse, AWAKEHOUSE_READABLE } from './AwakeHouse';

export const KITS = {
  CityBlock: buildCityBlock,
  CarInterior: buildCarInterior,
  ApartmentInterior: buildApartmentInterior,
  RooftopBeam: buildRooftopBeam,
  // story kit for "I Know You're Awake" (bedroom / hall / bathroom)
  AwakeHouse: buildAwakeHouse,
  // Character-sheet backdrop only. build_shots.py refuses it inside a story.
  Studio: buildStudio,
} as const;

export const READABLE: Record<keyof typeof KITS, string[]> = {
  CityBlock: CITYBLOCK_READABLE,
  CarInterior: CARINTERIOR_READABLE,
  ApartmentInterior: APARTMENT_READABLE,
  RooftopBeam: ROOFTOP_READABLE,
  AwakeHouse: AWAKEHOUSE_READABLE,
  Studio: STUDIO_READABLE,
};

export type KitName = keyof typeof KITS;
export { buildCityBlock, buildCarInterior, buildApartmentInterior, buildRooftopBeam, buildStudio, buildAwakeHouse };

/** Kits a story shot may name. Studio is a sheet backdrop, never a scene. */
export const STORY_KITS = ['CityBlock', 'CarInterior', 'ApartmentInterior', 'RooftopBeam', 'AwakeHouse'] as const;
