import React from 'react';
import { INK, RED } from './Kit';
import { sf } from './Beast';
import {
  Q,
  NOAH_SCHOLAR,
  VICAR_MCKENZIE,
  ALANA_CHILD,
  Alive,
  FaceSolomon,
  FullSolomon,
  AncientTome,
  CarvedDoll,
  StoneCottage,
  BurningCabin,
  RagingRiver,
} from './SolomonKit';
import { FacePerson } from './Cast';

// Widescreen 1920x1080 Sets for "The Melancholy of Herbert Solomon"
export const SETS: Record<string, React.FC<{ f: number; v?: any }>> = {
  // 1. St Andrews University Library (16th Century Tome)
  standrews_library: ({ f, v = {} }) => {
    const t = sf(f, 3);
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Deep Gothic Library Interior */}
        <rect width="1920" height="1080" fill={Q.skyDk} />
        {/* Stone Arched Library Wall */}
        <path d="M0,0 H1920 V1080 H0Z" fill="#141a22" />

        {/* Tall Gothic Arched Window with Moonlight */}
        <g transform="translate(960, 360)">
          <path d="M-180,240 V-180 C-180,-380 0,-480 0,-480 C0,-480 180,-380 180,-180 V240Z" fill="#1c2c38" stroke={INK} strokeWidth={9} />
          {/* Gothic stone tracery */}
          <path d="M0,-480 V240 M-90,-160 V240 M90,-160 V240 M-180,-40 H180 M-180,100 H180" stroke={INK} strokeWidth={6} />
          {/* Soft Moonlight Beam downward onto desk */}
          <polygon points="-140,-120 140,-120 420,720 -420,720" fill="#cde0ed" opacity={0.12} />
        </g>

        {/* Background Wooden Bookcases packed with ancient manuscripts */}
        {[-850, 480].map((bx, bi) => (
          <g key={bi} transform={`translate(${bx + 400}, 240)`}>
            <rect x="0" y="0" width="380" height="740" fill="#1a140f" stroke={INK} strokeWidth={8} />
            {[0, 1, 2, 3, 4].map((sh) => (
              <g key={sh} transform={`translate(0, ${sh * 140 + 40})`}>
                <rect x="10" y="100" width="360" height="18" fill="#322216" stroke={INK} strokeWidth={5} />
                {Array.from({ length: 14 }).map((_, bk) => (
                  <rect
                    key={bk}
                    x={20 + bk * 24}
                    y={10 + (bk % 3) * 12}
                    width={18}
                    height={90 - (bk % 3) * 12}
                    fill={bk % 2 === 0 ? '#422c1d' : '#281c14'}
                    stroke={INK}
                    strokeWidth={3}
                  />
                ))}
              </g>
            ))}
          </g>
        ))}

        {/* Large Oak Scholar's Desk */}
        <polygon points="120,720 1800,720 1920,1080 0,1080" fill="#24170f" stroke={INK} strokeWidth={9} />
        <line x1="0" y1="720" x2="1920" y2="720" stroke={INK} strokeWidth={8} />

        {/* Flickering Brass Candle Sconce on left */}
        <g transform="translate(380, 680)">
          <ellipse cx="0" cy="0" rx="45" ry="14" fill="#a07c36" stroke={INK} strokeWidth={5} />
          <rect x="-8" y="-70" width="16" height="70" fill="#e8dcc4" stroke={INK} strokeWidth={4} />
          {/* Flame */}
          <path d={`M-8,-70 C-16,-90 0,-120 0,-120 C0,-120 16,-90 8,-70Z`} fill={Q.torchFlame} stroke={RED} strokeWidth={3} />
          <circle cx="0" cy="-85" r={50 + Math.sin(t / 4) * 6} fill={Q.torchAmber} opacity={0.18} />
        </g>

        {/* The 16th-Century Tome opened in centre */}
        <AncientTome x={960} y={860} w={720} h={440} open={true} />

        {/* Scholar Noah Reed looking down at the book from right */}
        <g transform="translate(1520, 840) scale(0.6)">
          <FacePerson s={NOAH_SCHOLAR} expr="fear" f={f} />
        </g>
      </svg>
    );
  },

  // 2. 16th-Century Ettrick Village (Wide Hamlet)
  ettrick_hamlet: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Bleak Scottish Moorland Sky */}
        <rect width="1920" height="1080" fill={Q.skyDk} />
        <rect y="200" width="1920" height="880" fill={Q.skyMoor} opacity={0.7} />

        {/* Cold Distant Moorland Hills */}
        <path d="M0,480 Q480,380 960,440 T1920,400 V640 H0Z" fill="#141f26" stroke={INK} strokeWidth={6} />
        <path d="M0,520 Q560,460 1200,500 T1920,480 V660 H0Z" fill="#1a272f" stroke={INK} strokeWidth={6} />

        {/* Parish Church with Steeple in background */}
        <g transform="translate(1320, 480)">
          <rect x="-90" y="-180" width="180" height="180" fill="#243038" stroke={INK} strokeWidth={7} />
          <polygon points="0,-360 -70,-180 70,-180" fill="#182026" stroke={INK} strokeWidth={7} />
          {/* Gothic Cross atop steeple */}
          <line x1="0" y1="-390" x2="0" y2="-360" stroke={INK} strokeWidth={5} />
          <line x1="-14" y1="-380" x2="14" y2="-380" stroke={INK} strokeWidth={5} />
        </g>

        {/* Scots Pines on hills */}
        {[-30, 240, 1680].map((px, pi) => (
          <g key={pi} transform={`translate(${px}, 480)`}>
            <polygon points="0,-180 -50,-60 50,-60" fill="#0d191d" stroke={INK} strokeWidth={5} />
            <polygon points="0,-120 -65,-10 65,-10" fill="#0d191d" stroke={INK} strokeWidth={5} />
            <rect x="-10" y="-10" width="20" height="50" fill="#1a120c" stroke={INK} strokeWidth={4} />
          </g>
        ))}

        {/* Cobblestone Village Ground */}
        <rect x="0" y="620" width="1920" height="460" fill="#182024" />
        <line x1="0" y1="620" x2="1920" y2="620" stroke={INK} strokeWidth={8} />

        {/* Row of Stone Cottages with thatched roofs */}
        <StoneCottage x={340} y={640} w={420} h={340} />
        <StoneCottage x={840} y={640} w={440} h={350} />
        <StoneCottage x={1640} y={640} w={480} h={360} />

        {/* Cobblestone Street Grid with puddle reflections */}
        {Array.from({ length: 8 }).map((_, ci) => (
          <ellipse key={ci} cx={200 + ci * 210} cy={780 + (ci % 3) * 60} rx={45} ry={14} fill="#232f36" stroke={INK} strokeWidth={3} />
        ))}

        {/* Ground Fog drifting through street */}
        <rect x="0" y="740" width="1920" height="340" fill={Q.snowMist} opacity={0.16} />
      </svg>
    );
  },

  // 3. The Lonely Stone Well at Sunset
  stone_well: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Cold Winter Sunset Sky (Dull Amber into Indigo) */}
        <rect width="1920" height="1080" fill="#18131e" />
        <rect y="380" width="1920" height="700" fill="#301d24" opacity={0.65} />
        <ellipse cx="960" cy="540" rx="600" ry="240" fill="#e58c28" opacity={0.18} />

        {/* Barren Scots Pines silhouetted */}
        {[-80, 220, 1620, 1840].map((px, pi) => (
          <g key={pi} transform={`translate(${px}, 620)`}>
            <polygon points="0,-320 -80,-100 80,-100" fill="#0f161a" stroke={INK} strokeWidth={7} />
            <polygon points="0,-220 -100,0 100,0" fill="#0f161a" stroke={INK} strokeWidth={7} />
            <rect x="-14" y="0" width="28" height="80" fill="#1c120c" stroke={INK} strokeWidth={5} />
          </g>
        ))}

        {/* Frozen Field Ground */}
        <rect x="0" y="680" width="1920" height="400" fill="#1a2024" />
        <line x1="0" y1="680" x2="1920" y2="680" stroke={INK} strokeWidth={8} />

        {/* Old Stone Well in foreground center */}
        <g transform="translate(960, 800)">
          {/* Well Base - Circular Mossy Stones */}
          <ellipse cx="0" cy="0" rx="220" ry="60" fill="#2a3538" stroke={INK} strokeWidth={8} />
          <path d="M-220,0 C-220,60 220,60 220,0 V100 C220,160 -220,160 -220,100Z" fill="#1e272b" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          {/* Stone Texture cracks */}
          <line x1="-120" y1="20" x2="-60" y2="70" stroke={INK} strokeWidth={4} />
          <line x1="80" y1="30" x2="140" y2="75" stroke={INK} strokeWidth={4} />

          {/* Well Inner Abyss */}
          <ellipse cx="0" cy="-5" rx="180" ry="44" fill="#07090c" stroke={INK} strokeWidth={6} />

          {/* Wooden Well Canopy Structure */}
          <rect x="-160" y="-280" width="22" height="280" fill="#2c1e14" stroke={INK} strokeWidth={6} />
          <rect x="138" y="-280" width="22" height="280" fill="#2c1e14" stroke={INK} strokeWidth={6} />
          <polygon points="0,-360 -200,-280 200,-280" fill="#1e150f" stroke={INK} strokeWidth={7} />
          {/* Rope & Pulley */}
          <circle cx="0" cy="-240" r="24" fill="#523d2b" stroke={INK} strokeWidth={5} />
          <line x1="0" y1="-216" x2="0" y2="-5" stroke="#7a5a40" strokeWidth={5} />

          {/* Alana's hand-carved doll dropped on well rim */}
          <g transform="translate(110, -10) scale(0.7)">
            <CarvedDoll x={0} y={0} />
          </g>
        </g>

        {/* Alana Sutherland walking towards well in silhouette on left */}
        <g transform="translate(420, 740) scale(0.55)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FacePerson s={ALANA_CHILD} expr="fear" f={f} />
          </Alive>
        </g>
      </svg>
    );
  },

  // 4. Herbert Solomon's Secluded Forest Cabin
  woods_cabin: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Cold Moonlight Night Sky */}
        <rect width="1920" height="1080" fill={Q.skyDk} />
        <circle cx="1600" cy="180" r="70" fill="#eaf2f5" opacity={0.8} />

        {/* Dense Pine Forest */}
        {[-40, 180, 420, 1420, 1680, 1900].map((px, pi) => (
          <g key={pi} transform={`translate(${px}, 620)`}>
            <polygon points="0,-420 -90,-140 90,-140" fill="#0d181c" stroke={INK} strokeWidth={8} />
            <polygon points="0,-280 -120,0 120,0" fill="#0d181c" stroke={INK} strokeWidth={8} />
            <rect x="-16" y="0" width="32" height="120" fill="#18120c" stroke={INK} strokeWidth={6} />
          </g>
        ))}

        {/* Snow covered ground */}
        <rect x="0" y="680" width="1920" height="400" fill="#151e24" />
        <line x1="0" y1="680" x2="1920" y2="680" stroke={INK} strokeWidth={8} />

        {/* Solomon's Log Cabin in center */}
        <g transform="translate(880, 680)">
          {/* Cabin Base */}
          <rect x="-240" y="-280" width="480" height="280" fill={Q.woodCabin} stroke={INK} strokeWidth={9} />
          {/* Timber Planks */}
          {[0, 1, 2, 3, 4, 5].map((log) => (
            <line key={log} x1="-230" y1={-240 + log * 42} x2="230" y2={-240 + log * 42} stroke="#17100b" strokeWidth={5} />
          ))}
          {/* Gable Roof */}
          <polygon points="0,-440 -280,-280 280,-280" fill="#1c140e" stroke={INK} strokeWidth={9} />
          {/* Stone Chimney with faint smoke */}
          <rect x="140" y="-480" width="60" height="180" fill="#2d383e" stroke={INK} strokeWidth={6} />
          {/* Faint amber glow from single small window */}
          <rect x="-140" y="-190" width="80" height="90" fill={Q.torchAmber} stroke={INK} strokeWidth={6} />

          {/* Tree Stump with gifts: Hand-carved wooden dolls for village children */}
          <g transform="translate(380, 20)">
            <rect x="-40" y="-50" width="80" height="50" fill="#3a281c" stroke={INK} strokeWidth={6} />
            <ellipse cx="0" cy="-50" rx="40" ry="12" fill="#4d3726" stroke={INK} strokeWidth={5} />
            <CarvedDoll x="-12" y="-95" s={0.45} />
            <CarvedDoll x="16" y="-90" s={0.4} />
          </g>
        </g>

        {/* Herbert Solomon standing at forest edge in shadows */}
        <g transform="translate(1360, 690) scale(0.68)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FullSolomon x={0} y={0} f={f} mode="stand" />
          </Alive>
        </g>
      </svg>
    );
  },

  // 5. The Mob Burning Solomon's Cabin
  burning_cabin: ({ f, v = {} }) => {
    const t = sf(f, 3);
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Sky consumed by smoke and red embers */}
        <rect width="1920" height="1080" fill="#1a0c0a" />
        <rect y="200" width="1920" height="880" fill="#38100e" opacity={0.6} />

        {/* Roaring Burning Cabin in center */}
        <BurningCabin x={960} y={680} f={f} />

        {/* Embers and Sparks rising */}
        {Array.from({ length: 18 }).map((_, ei) => {
          const ex = 400 + ((ei * 85 + t * 40) % 1120);
          const ey = 600 - ((ei * 35 + t * 25) % 550);
          return <circle key={ei} cx={ex} cy={ey} r={3 + (ei % 4)} fill={Q.torchFlame} opacity={0.8} />;
        })}

        {/* Angry Villagers Mob in foreground with pitchforks and flaming torches */}
        {[-380, -220, -60, 100, 260, 420].map((vx, vi) => (
          <g key={vi} transform={`translate(${960 + vx}, 860)`}>
            {/* Villager Silhouette */}
            <path d="M-40,0 L-45,-140 L-30,-220 L30,-220 L45,-140 L40,0Z" fill="#140b08" stroke={INK} strokeWidth={7} />
            <ellipse cx="0" cy="-260" rx="24" ry="32" fill="#140b08" stroke={INK} strokeWidth={6} />
            {/* Raised Flaming Torch */}
            <line x1={20} y1={-180} x2={50} y2={-320} stroke="#422e1e" strokeWidth={8} strokeLinecap="round" />
            <circle cx="50" cy="-340" r={22 + Math.sin(t / 3 + vi) * 5} fill={Q.torchFlame} stroke={RED} strokeWidth={4} />
          </g>
        ))}
      </svg>
    );
  },

  // 6. Herbert Solomon's Shadow in the Foggy Cobblestone Streets
  foggy_street_stalk: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Cold midnight village alleyway */}
        <rect width="1920" height="1080" fill="#080d12" />

        {/* Old Stone Cottages flanking both sides */}
        <StoneCottage x={280} y={720} w={520} h={420} />
        <StoneCottage x={1640} y={720} w={520} h={420} />

        {/* Cobblestone floor */}
        <polygon points="340,720 1580,720 1920,1080 0,1080" fill="#161e24" stroke={INK} strokeWidth={8} />

        {/* Sprawling Spider-like Shadow projected on wall */}
        <g transform="translate(680, 720) skewX(-45) scale(1.4, 0.6)" opacity={0.75}>
          <FullSolomon x={0} y={0} f={f} mode="stand" />
        </g>

        {/* Herbert Solomon walking down the center of the mist */}
        <g transform="translate(960, 720) scale(0.85)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FullSolomon x={0} y={0} f={f} mode="stand" />
          </Alive>
        </g>

        {/* Heavy ground fog layers */}
        <rect x="0" y="680" width="1920" height="400" fill={Q.snowMist} opacity={0.22} />
      </svg>
    );
  },

  // 7. Inside the Parish Church of Ettrick
  church_interior: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Dark Nave of the Parish Church */}
        <rect width="1920" height="1080" fill="#0a0e14" />

        {/* High Gothic Stone Vault Pillars */}
        {[-600, -200, 200, 600].map((px, pi) => (
          <g key={pi} transform={`translate(${960 + px}, 0)`}>
            <rect x="-40" y="0" width="80" height="840" fill="#1c242c" stroke={INK} strokeWidth={8} />
            {/* Arches curving to ceiling */}
            <path d="M-40,240 C-40,80 -160,0 -200,0" stroke={INK} strokeWidth={8} fill="none" />
            <path d="M40,240 C40,80 160,0 200,0" stroke={INK} strokeWidth={8} fill="none" />
          </g>
        ))}

        {/* Stained Glass Window with Moonbeam */}
        <g transform="translate(960, 280)">
          <path d="M-120,160 V-120 C-120,-240 0,-300 0,-300 C0,-300 120,-240 120,-120 V160Z" fill="#203040" stroke={INK} strokeWidth={8} />
          <polygon points="-80,-60 80,-60 260,780 -260,780" fill="#c2d5e2" opacity={0.12} />
        </g>

        {/* Church Flagstone Aisle */}
        <polygon points="680,680 1240,680 1480,1080 440,1080" fill="#182028" stroke={INK} strokeWidth={8} />

        {/* Wooden Pews on both sides */}
        {[-380, 380].map((pw, pwi) => (
          <g key={pwi} transform={`translate(${960 + pw}, 780)`}>
            <rect x="-180" y="-80" width="360" height="80" fill="#2e2118" stroke={INK} strokeWidth={7} />
            <rect x="-180" y="-140" width="360" height="40" fill="#241a12" stroke={INK} strokeWidth={6} />
          </g>
        ))}

        {/* Tall Solomon stepping past the center pillar */}
        <g transform="translate(860, 780) scale(0.72)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FullSolomon x={0} y={0} f={f} mode="stand" />
          </Alive>
        </g>
      </svg>
    );
  },

  // 8. The Street Ambush: McKenzie & Armed Men
  street_ambush: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Foggy Street Atmosphere */}
        <rect width="1920" height="1080" fill="#0d141a" />
        <rect y="400" width="1920" height="680" fill="#18232c" opacity={0.6} />

        {/* Cobblestone ground */}
        <rect x="0" y="680" width="1920" height="400" fill="#141c22" />
        <line x1="0" y1="680" x2="1920" y2="680" stroke={INK} strokeWidth={8} />

        {/* Vicar McKenzie on Left with Holy Water and Bible */}
        <g transform="translate(480, 760) scale(0.75)">
          <FacePerson s={VICAR_MCKENZIE} expr="fear" f={f} />
        </g>

        {/* Men on Left brandishing torches */}
        <g transform="translate(240, 780)">
          <line x1="0" y1="0" x2="40" y2="-160" stroke="#3d2a1b" strokeWidth={8} />
          <circle cx="40" cy="-180" r="28" fill={Q.torchFlame} stroke={RED} strokeWidth={4} />
        </g>

        {/* Herbert Solomon fleeing on right, sleeve catching fire */}
        <g transform="translate(1380, 720) scale(0.8)">
          <Alive x={0} y={0} f={f} mode="flame">
            <FullSolomon x={0} y={0} f={f} mode="flee" />
            {/* Burning Cloth Sleeve Effect */}
            <circle cx="-60" cy="-780" r="24" fill={Q.torchFlame} stroke={RED} strokeWidth={4} />
          </Alive>
        </g>
      </svg>
    );
  },

  // 9. The Secret in the Cellar (The True Fiend Revealed)
  secret_cellar: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Damp Stone Cellar Vault */}
        <rect width="1920" height="1080" fill="#090c10" />

        {/* Low Arched Stone Vault Ceilings */}
        <path d="M0,0 H1920 V480 C1540,320 1200,340 960,340 C720,340 380,320 0,480Z" fill="#182026" stroke={INK} strokeWidth={8} />

        {/* Hanging Iron Chains from ceiling */}
        {[-420, -280, 280, 420].map((cx, ci) => (
          <g key={ci} transform={`translate(${960 + cx}, 280)`}>
            <line x1="0" y1="0" x2="0" y2="280" stroke="#3a444c" strokeWidth={6} strokeDasharray="8 6" />
            <circle cx="0" cy="285" r="14" fill="none" stroke="#2a333a" strokeWidth={5} />
          </g>
        ))}

        {/* Flickering Wall Oil Lantern */}
        <g transform="translate(960, 420)">
          <circle cx="0" cy="0" r="120" fill={Q.torchAmber} opacity={0.16} />
          <rect x="-18" y="-30" width="36" height="60" rx="6" fill="#8c6a38" stroke={INK} strokeWidth={5} />
          <polygon points="-12,-15 12,-15 0,-28" fill={Q.torchFlame} />
        </g>

        {/* Cellar Floor with spilled herbs & dark shadows */}
        <rect x="0" y="680" width="1920" height="400" fill="#12181e" />
        <line x1="0" y1="680" x2="1920" y2="680" stroke={INK} strokeWidth={8} />

        {/* Chained Missing Children huddled safely on left */}
        <g transform="translate(420, 780)">
          <ellipse cx="0" cy="0" rx="140" ry="40" fill="#28323a" stroke={INK} strokeWidth={7} />
          {/* Children silhouettes bundled in wool shawls */}
          <ellipse cx="-45" cy="-50" rx="28" ry="34" fill="#1c252c" />
          <ellipse cx="40" cy="-55" rx="30" ry="36" fill="#1c252c" />
          {/* Hand-carved wooden doll in girl's hand */}
          <CarvedDoll x="-10" y="-40" s={0.4} />
        </g>

        {/* Tom Sutherland sprawled motionless on the stone floor */}
        <g transform="translate(1340, 840)">
          {/* Sutherland body face down, twisted unnatural neck */}
          <path d="M-180,20 L-60,-40 L80,-30 L160,10 L140,40 L-160,40Z" fill="#241a14" stroke={INK} strokeWidth={7} />
          {/* Head facing backward (broken neck) */}
          <ellipse cx="-180" cy="0" rx="26" ry="22" fill="#8a6548" stroke={INK} strokeWidth={6} />
          {/* Dropped Iron Dagger */}
          <line x1="60" y1="40" x2="120" y2="45" stroke="#7a8c96" strokeWidth={6} strokeLinecap="round" />
        </g>
      </svg>
    );
  },

  // 10. The Modern Epilogue: Raging River Rescue
  raging_river: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Overcast Scottish Countryside Sky */}
        <rect width="1920" height="1080" fill="#18222a" />
        <rect y="200" width="1920" height="880" fill="#243038" opacity={0.5} />

        {/* Grassy River Embankments */}
        <polygon points="0,480 540,540 0,680" fill="#202c25" stroke={INK} strokeWidth={7} />
        <polygon points="1920,440 1380,520 1920,680" fill="#202c25" stroke={INK} strokeWidth={7} />

        {/* The Violent Swollen River */}
        <RagingRiver x={960} y={760} w={1920} f={f} />

        {/* The Gnarled Tree Root the child was clinging to */}
        <path d="M420,540 C520,620 580,720 640,780" stroke="#3b2618" strokeWidth={24} fill="none" strokeLinecap="round" />
        <path d="M480,580 C560,640 620,700 660,740" stroke={INK} strokeWidth={5} fill="none" />

        {/* The little girl saved on the grassy bank */}
        <g transform="translate(680, 680) scale(0.65)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FacePerson s={ALANA_CHILD} expr="fear" f={f} />
          </Alive>
        </g>

        {/* Herbert Solomon reaching over the bank, pulling her to safety */}
        <g transform="translate(1120, 640) scale(0.78)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FullSolomon x={0} y={0} f={f} mode="reach" />
          </Alive>
        </g>
      </svg>
    );
  },

  // 11. Solomon Detailed Portrait Close-Up
  solomon_portrait: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        {/* Dark Slate Atmosphere with subtle cold rim light */}
        <rect width="1920" height="1080" fill="#090d14" />
        <circle cx="960" cy="540" r="540" fill="#1b2a33" opacity={0.25} />

        {/* Giant Painted Face of Herbert Solomon in center */}
        <g transform="translate(960, 540) scale(1.65)">
          <Alive x={0} y={0} f={f} mode="sorrow">
            <FaceSolomon f={f} expr="melancholy" />
          </Alive>
        </g>
      </svg>
    );
  },

  // 12. Title Card: The Melancholy of Herbert Solomon
  qcard: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.skyDk} />
        {/* 16th Century Ornamental Border */}
        <rect x="80" y="80" width="1760" height="920" fill="none" stroke={Q.tomeGold} strokeWidth={8} rx={16} />
        <rect x="110" y="110" width="1700" height="860" fill="none" stroke="#3d2a1b" strokeWidth={4} rx={10} />

        {/* Corner Filigree Flourishes */}
        {[-1, 1].map((qx) =>
          [-1, 1].map((qy) => (
            <path
              key={`${qx}_${qy}`}
              d={`M${960 + qx * 840},${540 + qy * 420} L${960 + qx * 760},${540 + qy * 420} M${960 + qx * 840},${540 + qy * 420} L${960 + qx * 840},${540 + qy * 340}`}
              stroke={Q.tomeGold}
              strokeWidth={6}
            />
          ))
        )}

        {/* Title Text */}
        <text x="960" y="440" textAnchor="middle" fill="#eaf2f5" fontFamily="serif" fontSize={58} fontWeight="bold" letterSpacing={4}>
          THE MELANCHOLY OF
        </text>
        <text x="960" y="550" textAnchor="middle" fill={RED} fontFamily="serif" fontSize={76} fontWeight="bold" letterSpacing={6}>
          HERBERT SOLOMON
        </text>
        <text x="960" y="660" textAnchor="middle" fill="#9eaeb8" fontFamily="serif" fontSize={28} fontStyle="italic" letterSpacing={2}>
          A 16th-Century Scottish Tale of Ettrick
        </text>
      </svg>
    );
  },

  // 13. End Screen: The Closing Question
  end: ({ f, v = {} }) => {
    return (
      <svg viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <rect width="1920" height="1080" fill={Q.skyDk} />
        <rect x="120" y="120" width="1680" height="840" fill="none" stroke={Q.solomonShade} strokeWidth={4} opacity={0.4} />

        {/* Carved Doll in center */}
        <g transform="translate(960, 420) scale(1.4)">
          <CarvedDoll x={0} y={0} />
        </g>

        {/* Closing Question */}
        <text x="960" y="680" textAnchor="middle" fill="#eaf2f5" fontFamily="serif" fontSize={46} fontWeight="bold" letterSpacing={2}>
          Would you have judged him by his face?
        </text>
        <text x="960" y="760" textAnchor="middle" fill="#8d9ea8" fontFamily="serif" fontSize={24} fontStyle="italic" letterSpacing={1}>
          Scroll Kaos
        </text>
      </svg>
    );
  },
};
