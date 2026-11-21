import { P3 } from './k3/Person';
import { C3, HERBERT, HERBERT_LIVING } from './k3/Creature';
// ===== SCROLL KAOS PERMANENT CAST, 3D (engine v0.5). ONE fixed character model for the whole channel.
// These are the faces that worked best on the channel: the painted cast rebuilt as low-poly flat-shaded 3D people.
// LAW: face, hair, body shape and height of a cast member NEVER change between videos. Only clothes may change, and only for a
// story reason written in the story bible. A story person who is not here gets ONE new spec at the bottom of this file.
// Look: muted palette, ONE red accent (ribbons, scarf), dark night light. Human proportions: adult about 7 heads, child bigger head.
export const CAST3: Record<string, P3> = {
  // ---- HERO
  noah: { id: 'noah', name: 'Noah Reed', sex: 'm', age: 1, h: 1.78, skin: '#c99a73', hair: '#1d1a19', hairStyle: 'messy', eyeC: '#3a2a1c', jaw: 'square', nose: 'straight', brow: 1.2, stubble: true, top: 'shirt', topC: '#4e7a84', inner: '#9fc0c6', bottom: 'trousers', botC: '#4a3728', shoeC: '#3a2a1e', acc: ['satchel', 'redThread'], accC: '#7a5a36' },
  // ---- SIDE CAST (living people)
  mira: { id: 'mira', name: 'Mira Vale', sex: 'f', age: 1, h: 1.66, skin: '#d2a583', hair: '#2a1d18', hairStyle: 'long', eyeC: '#3a2a1c', jaw: 'soft', nose: 'small', lip: '#8a4a48', top: 'cardigan', topC: '#6a4a46', inner: '#d8cdb8', bottom: 'trousers', botC: '#39342e', shoeC: '#241c18' },
  elias: { id: 'elias', name: 'Elias Gray', sex: 'm', age: 3, h: 1.72, skin: '#c2a189', hair: '#8d8a84', hairStyle: 'greyshort', eyeC: '#4a4038', jaw: 'long', nose: 'hook', brow: 1.25, beard: true, glasses: true, top: 'coat', topC: '#2b2b30', inner: '#cfc8ba', bottom: 'trousers', botC: '#2a2622', shoeC: '#1c1814', acc: ['cane'] },
  rose: { id: 'rose', name: 'Rose Marlow', sex: 'f', age: 3, h: 1.58, skin: '#cfb199', hair: '#9b9893', hairStyle: 'bun', eyeC: '#4a4038', jaw: 'round', nose: 'button', lip: '#8a5a56', top: 'cardigan', topC: '#5c5a52', inner: '#ded5c2', bottom: 'skirtLong', botC: '#3a3730', shoeC: '#211b17', acc: ['shawl'], accC: '#6b6355' },
  sam: { id: 'sam', name: 'Sam Carter', sex: 'm', age: 0, h: 1.62, skin: '#cf9f78', hair: '#5a3b26', hairStyle: 'messy', eyeC: '#46301e', jaw: 'soft', nose: 'small', freckles: true, top: 'hoodie', topC: '#44504a', bottom: 'jeans', botC: '#333b46', shoeC: '#2a2420' },
  lily: { id: 'lily', name: 'Lily', sex: 'f', age: 0, kid: true, h: 1.24, skin: '#d8ad8a', hair: '#6b4426', hairStyle: 'pigtails', eyeC: '#3f2a1a', jaw: 'round', nose: 'button', freckles: true, lip: '#95605c', top: 'dress', topC: '#6a5a72', bottom: 'dressKnee', botC: '#6a5a72', shoeC: '#2a2420', acc: ['redRibbons'] },
  dale: { id: 'dale', name: 'Dale Reyes', sex: 'm', age: 2, h: 1.8, skin: '#a9774f', hair: '#17140f', hairStyle: 'short', eyeC: '#2e2014', jaw: 'square', nose: 'broad', brow: 1.2, stache: true, top: 'uniform', topC: '#2d3a4a', bottom: 'trousers', botC: '#232c38', shoeC: '#15120f', acc: ['badge', 'collar'] },
  // ---- THE ETTRICK PEOPLE (from "The Melancholy of Herbert Solomon"; period clothes, same faces)
  isla: { id: 'isla', name: 'Isla Sutherland', sex: 'f', age: 0, kid: true, h: 1.2, skin: '#dcb28e', hair: '#8c4a24', hairStyle: 'long', eyeC: '#43301e', jaw: 'round', nose: 'button', freckles: true, lip: '#96615d', top: 'cardigan', topC: '#6a5f4c', inner: '#cdbfa4', bottom: 'dressKnee', botC: '#7a6a52', shoeC: '#2a2018', acc: ['redRibbons'] },
  erik: { id: 'erik', name: 'Erik Kennedy', sex: 'm', age: 0, kid: true, h: 1.3, skin: '#d2a179', hair: '#4e3522', hairStyle: 'messy', eyeC: '#3d2a18', jaw: 'soft', nose: 'small', freckles: true, top: 'workshirt', topC: '#6d6450', bottom: 'trousers', botC: '#4a4336', shoeC: '#2a2018' },
  tom: { id: 'tom', name: 'Tom Sutherland', sex: 'm', age: 2, h: 1.79, skin: '#bd8a60', hair: '#141210', hairStyle: 'messy', eyeC: '#2a1d12', jaw: 'square', nose: 'broad', brow: 1.35, stache: true, stubble: true, top: 'workshirt', topC: '#5c5448', bottom: 'trousers', botC: '#3f3a31', shoeC: '#201a15' },
  mckenzie: { id: 'mckenzie', name: 'Vicar McKenzie', sex: 'm', age: 3, h: 1.74, skin: '#c2a189', hair: '#8d8a84', hairStyle: 'greyshort', eyeC: '#4a4038', jaw: 'long', nose: 'hook', brow: 1.25, beard: true, top: 'raincoat', topC: '#1b1b20', inner: '#d8d2c4', bottom: 'trousers', botC: '#20201c', shoeC: '#141110', acc: ['collar'] },
  agnes: { id: 'agnes', name: 'Agnes', sex: 'f', age: 3, h: 1.56, skin: '#cfb199', hair: '#9b9893', hairStyle: 'bun', eyeC: '#4a4038', jaw: 'round', nose: 'button', lip: '#8a5a56', top: 'cardigan', topC: '#4e4a44', inner: '#cfc6b2', bottom: 'skirtLong', botC: '#36332c', shoeC: '#211b17', acc: ['shawl'], accC: '#5f594d' },
  terence: { id: 'terence', name: 'Terence', sex: 'm', age: 1, h: 1.76, skin: '#c99a73', hair: '#3a2a1e', hairStyle: 'short', eyeC: '#3a2a1c', jaw: 'soft', nose: 'straight', stubble: true, top: 'workshirt', topC: '#62584a', bottom: 'trousers', botC: '#413a30', shoeC: '#241c18', acc: ['apron'], accC: '#b3a88c' },
  lyra: { id: 'lyra', name: 'Lyra', sex: 'f', age: 0, kid: true, h: 1.18, skin: '#c89a74', hair: '#2f2420', hairStyle: 'wavy', eyeC: '#33231a', jaw: 'round', nose: 'button', lip: '#8f5b57', top: 'shift', topC: '#6b665c', bottom: 'dressKnee', botC: '#6b665c', shoeC: '#2a2018' },
  matthew: { id: 'matthew', name: 'Matthew', sex: 'm', age: 0, kid: true, h: 1.14, skin: '#d6a97f', hair: '#7a5a33', hairStyle: 'short', eyeC: '#3d2a18', jaw: 'round', nose: 'button', freckles: true, top: 'shirt', topC: '#7a7262', bottom: 'trousers', botC: '#4a4336', shoeC: '#2a2018' },
  // ---- GATEWAY OF THE MIND (Kit q)
  subject: { id: 'subject', name: 'Subject 83', sex: 'm', age: 3, h: 1.70, skin: '#c8bbb0', hair: '#9a948e', hairStyle: 'greyshort', eyeC: '#1a1816', jaw: 'long', nose: 'straight', brow: 1.2, top: 'shift', topC: '#dfded8', bottom: 'trousers', botC: '#cac8c0', shoeC: '#202020' },
  dr_reed: { id: 'dr_reed', name: 'Dr. Reed', sex: 'm', age: 1, h: 1.78, skin: '#c99a73', hair: '#1d1a19', hairStyle: 'messy', eyeC: '#3a2a1c', jaw: 'square', nose: 'straight', brow: 1.2, glasses: true, top: 'coat', topC: '#e0e2e0', inner: '#4e7a84', bottom: 'trousers', botC: '#3a342e', shoeC: '#201a14', acc: ['redThread'] },
};
// ---- CREATURES. The channel's monster model. Herbert Solomon is the default creature design (the one the audience liked best).
export const CREAT3: Record<string, C3> = {
  herbert: HERBERT,            // the ghost: burnt black rags, bare white skull, black eye holes, teeth, veins, ribs, scar
  herbertLiving: HERBERT_LIVING, // the living man: brown hat, grey face cloth, long brown coat (same body)
};
// ---- THE THREE CHANNEL GHOSTS (use one of them for a scary reveal when the story has no creature of its own).
// GHOST LAW: pale blue-white skin, huge hollow black eyes, dark tear tracks, bare feet. They float a little and never blink.
export const GHOST3: Record<string, P3> = {
  woman: { id: 'gwoman', name: 'Ghost Woman', sex: 'f', age: 1, h: 1.72, skin: '#dfe6ec', hair: '#0c0c10', hairStyle: 'long', ghost: 'woman', jaw: 'narrow', nose: 'small', lip: '#6a6a74', top: 'shift', topC: '#e6e4da', bottom: 'skirtLong', botC: '#e6e4da' },
  grinner: { id: 'ggrin', name: 'The Grinner', sex: 'm', age: 1, h: 1.86, skin: '#e2e8ec', hair: '#101014', hairStyle: 'messy', ghost: 'grin', jaw: 'square', nose: 'small', top: 'workshirt', topC: '#7f9168', inner: '#e8e8e0', bottom: 'trousers', botC: '#3b4048' },
  child: { id: 'gchild', name: 'The Drenched Child', sex: 'm', age: 0, kid: true, h: 1.14, skin: '#dfe8ee', hair: '#101014', hairStyle: 'messy', ghost: 'child', jaw: 'round', nose: 'button', top: 'shift', topC: '#c6a042', bottom: 'dressKnee', botC: '#c6a042' },
};
export type CastId = keyof typeof CAST3;
export const castOf = (id: string): P3 => CAST3[id] || CAST3.noah;
