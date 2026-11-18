import { CAST3 } from './Cast3D';
import { P3 } from './k3/Person';
// ---- cast for "Eyeless Jack" (kit r). The faces and bodies are the channel's permanent cast; only the clothes change,
// and each change has a story reason. ONE person is not in the cast at all: Edwin, the brother, who gets a new spec.
export const MITCH: P3 = { ...CAST3.noah, name: 'Mitch', top: 'shirt', topC: '#3f5f68', inner: '#9fc0c6', botC: '#3b4450' };
// in bed and in hospital: no satchel, a pale t-shirt
export const MITCH_BED: P3 = { ...MITCH, top: 'workshirt', topC: '#b9c2bd', inner: '#b9c2bd', acc: ['redThread'], botC: '#44505a' };
// NEW SPEC: Edwin, the older brother - same family look as the hero, heavier build, untidy hair, grey work shirt
export const EDWIN: P3 = { id: 'edwin', name: 'Edwin', sex: 'm', age: 2, h: 1.82, skin: '#c2926b', hair: '#241f1c', hairStyle: 'messy',
  eyeC: '#3a2a1c', jaw: 'square', nose: 'straight', brow: 1.25, beard: true, top: 'workshirt', topC: '#6b7069', inner: '#cfc8ba',
  bottom: 'jeans', botC: '#3b4450', shoeC: '#2a231c' };
// the doctor: Elias Gray's face and glasses, in a white coat (a story reason, allowed by policy 1A)
export const DOCTOR: P3 = { ...CAST3.elias, name: 'the doctor', top: 'coat', topC: '#e4e8e2', inner: '#9fb6ae', botC: '#3a4048', acc: [] };
