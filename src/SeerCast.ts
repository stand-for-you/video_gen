import { P3 } from './k3/Person';
import { CAST3 } from './Cast3D';
// ===== STORY CAST for "The Seer of Possibilities" (kit q).
// The permanent models are NOT changed: only the clothes change, and only for a story reason (modern office story).
// Two people are not in the permanent cast, so they get ONE new spec each, at the bottom of this file.
export const JACK: P3 = { ...CAST3.noah, top: 'shirt', topC: '#8fa2ae', inner: '#dfe4e8', bottom: 'trousers', botC: '#3a3f46', shoeC: '#2a2420', acc: ['redThread'] };
export const JACK_HOME: P3 = { ...JACK, top: 'hoodie', topC: '#4a5058', inner: '#cfd4d8' };
export const ALLIE: P3 = { ...CAST3.mira, top: 'shirt', topC: '#e4e0d6', inner: '#cfc8bc', bottom: 'skirtLong', botC: '#3a3a44', shoeC: '#2a2420' };
export const JAMES: P3 = { ...CAST3.tom, top: 'shirt', topC: '#b8bcc4', inner: '#8a2a2a', bottom: 'trousers', botC: '#33363c', shoeC: '#201a15', acc: ['collar'] };
export const DIEGO: P3 = { ...CAST3.elias, top: 'jacket', topC: '#2e3238', inner: '#e0ddd6', bottom: 'trousers', botC: '#2a2d32', acc: ['collar'], glasses: true };
export const LOTTERY: P3 = { ...CAST3.dale, top: 'workshirt', topC: '#c8a23a', inner: '#55585e', bottom: 'jeans', botC: '#3a4450', shoeC: '#2a2018', acc: ['hat'], accC: '#3a4450' };
export const LOTTERY_RICH: P3 = { ...LOTTERY, top: 'jacket', topC: '#4a3a2a', inner: '#e8e4d8', bottom: 'trousers', botC: '#2e2a26', acc: ['hat'], accC: '#2e2a26' };
// NEW 1: Donna, Jack's wife. About thirty five, dark auburn hair in a loose bun, warm rust cardigan.
export const DONNA: P3 = { id: 'donna', name: 'Donna', sex: 'f', age: 1, h: 1.68, skin: '#d6ac89', hair: '#5a3524', hairStyle: 'bun', eyeC: '#3d2a1c', jaw: 'soft', nose: 'small', lip: '#8f514c', freckles: true, top: 'cardigan', topC: '#8a5440', inner: '#e4ded0', bottom: 'trousers', botC: '#3a3630', shoeC: '#2a2420' };
// NEW 2: the delivery boy. Seventeen, almost two metres, heavy, a cap, a dark red work shirt, a blank face.
export const BOY: P3 = { id: 'delivery', name: 'The delivery boy', sex: 'm', age: 0, h: 1.98, build: 1.32, skin: '#c59a74', hair: '#1a1714', hairStyle: 'cap', eyeC: '#2a1d14', jaw: 'square', nose: 'broad', brow: 1.3, stubble: true, top: 'workshirt', topC: '#6e2420', inner: '#1a1714', bottom: 'jeans', botC: '#2e333a', shoeC: '#17140f' };
export const STORY_CAST: Record<string, P3> = { JACK, JACK_HOME, ALLIE, JAMES, DIEGO, LOTTERY, LOTTERY_RICH, DONNA, BOY };
