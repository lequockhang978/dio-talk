import React from 'react';

export type StickerName =
  | 'flame'
  | 'start'
  | 'wood'
  | 'bronze-medal'
  | 'silver-lightning'
  | 'gold-star'
  | 'diamond'
  | 'crown'
  | 'party-popper'
  | 'coin'
  | 'gem'
  | 'heart'
  | 'target'
  | 'trophy'
  | 'chief-engineer'
  | 'vts-radar'
  | 'psc-clipboard'
  | 'oil-barrel'
  | 'anchor'
  | 'security-shield'
  | 'swords'
  | 'radio'
  | 'compass'
  | 'siren'
  | 'gear'
  | 'puzzle'
  | 'headphones'
  | 'speed'
  | 'cards'
  | 'bot'
  | 'lock'
  | 'cloud'
  | 'sparkles'
  | 'rocket'
  | 'pencil'
  | 'medal'
  | 'gamepad'
  | 'document'
  | 'ship'
  | 'bulb'
  | 'mic'
  | 'bell'
  | 'lightning';

const EMOJI_MAP: Record<string, StickerName> = {
  '👨‍✈️': 'chief-engineer',
  '📡': 'vts-radar',
  '📋': 'psc-clipboard',
  '🛢️': 'oil-barrel',
  '🛢': 'oil-barrel',
  '⚓': 'anchor',
  '🛡️': 'security-shield',
  '🛡': 'security-shield',
  '⚔️': 'swords',
  '⚔': 'swords',
  '📻': 'radio',
  '🧭': 'compass',
  '🚨': 'siren',
  '⚙️': 'gear',
  '⚙': 'gear',
  '🧩': 'puzzle',
  '🎧': 'headphones',
  '🏎️': 'speed',
  '🏎': 'speed',
  '🃏': 'cards',
  '👑': 'crown',
  '🎯': 'target',
  '🏆': 'trophy',
  '🔥': 'flame',
  '⚡': 'silver-lightning',
  '🌟': 'sparkles',
  '✨': 'sparkles',
  '💥': 'sparkles',
  '💎': 'diamond',
  '🪙': 'coin',
  '🎉': 'party-popper',
  '❤️': 'heart',
  '🪵': 'start',
  '🤖': 'bot',
  '🔒': 'lock',
  '💾': 'cloud',
  '☁️': 'cloud',
  '☁': 'cloud',
  '🚀': 'rocket',
  '✏️': 'pencil',
  '✏': 'pencil',
  '🎖️': 'medal',
  '🎖': 'medal',
  '🏅': 'medal',
  '🎮': 'gamepad',
  '🕹️': 'gamepad',
  '🕹': 'gamepad',
  '📝': 'document',
  '📄': 'document',
  '📚': 'document',
  '💡': 'bulb',
  '🚢': 'ship',
  '⛴️': 'ship',
  '🎙️': 'mic',
  '🎙': 'mic',
  '🛎️': 'bell',
  '🛎': 'bell',
  '🗺️': 'compass',
  '🗺': 'compass',
  'lightning': 'silver-lightning'
};

interface Sticker3DProps {
  name?: StickerName | string;
  emoji?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Sticker3D: React.FC<Sticker3DProps> = ({
  name,
  emoji,
  size = 32,
  className = '',
  style = {}
}) => {
  // Resolve key from name or emoji
  const query = emoji || name || 'flame';
  const resolvedName: StickerName | string = EMOJI_MAP[query] || query;

  const commonStyle: React.CSSProperties = {
    display: 'inline-block',
    verticalAlign: 'middle',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18))',
    flexShrink: 0,
    ...style
  };

  switch (resolvedName) {
    /* -------------------------------------------------------------
       1. AI CHARACTERS & MARITIME ROLES
       ------------------------------------------------------------- */
    case 'chief-engineer':
      return (
        <svg width={size} height={size} viewBox="0 0 54 54" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="engShirt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="engCap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="engGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <radialGradient id="engSkin" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </radialGradient>
          </defs>
          {/* Shoulders / Uniform */}
          <path d="M10 48C10 40 16 36 27 36C38 36 44 40 44 48H10Z" fill="#1E293B" />
          <path d="M22 36L27 44L32 36H22Z" fill="url(#engShirt)" />
          {/* Gold Chief Engineer epaulettes (4 bars) */}
          <rect x="11" y="41" width="7" height="2" rx="1" fill="url(#engGold)" />
          <rect x="36" y="41" width="7" height="2" rx="1" fill="url(#engGold)" />
          {/* Neck & Face */}
          <rect x="23" y="30" width="8" height="8" rx="2" fill="url(#engSkin)" />
          <circle cx="27" cy="25" r="10" fill="url(#engSkin)" />
          {/* Eyes & Friendly Smile */}
          <circle cx="23" cy="24" r="1.5" fill="#0F172A" />
          <circle cx="31" cy="24" r="1.5" fill="#0F172A" />
          <path d="M25 28C26 29 28 29 29 28" stroke="#7C2D12" strokeWidth="1.2" strokeLinecap="round" />
          {/* Chief Officer Maritime Cap 3D */}
          <path d="M15 17C15 10 20 6 27 6C34 6 39 10 39 17H15Z" fill="url(#engCap)" />
          {/* Black Visor with 3D Shine */}
          <path d="M13 18C13 18 19 22 27 22C35 22 41 18 41 18L39 16C33 19 21 19 15 16L13 18Z" fill="#0F172A" />
          <ellipse cx="27" cy="18" rx="7" ry="1.5" fill="#FFFFFF" opacity="0.3" />
          {/* Gold Maritime Oak Leaf Crest */}
          <ellipse cx="27" cy="13" rx="3.5" ry="3" fill="url(#engGold)" stroke="#78350F" strokeWidth="0.5" />
          <circle cx="27" cy="13" r="1.5" fill="#EF4444" />
        </svg>
      );

    case 'vts-radar':
      return (
        <svg width={size} height={size} viewBox="0 0 54 54" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="vtsDish" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="vtsWave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Base Stand */}
          <ellipse cx="20" cy="46" rx="10" ry="3" fill="#334155" />
          <path d="M18 46L22 34H26L22 46H18Z" fill="#64748B" />
          {/* Parabolic Radar Dish */}
          <path
            d="M12 28C10 20 18 10 28 8C32 7 35 12 33 16C29 23 23 31 16 31C14 31 12 30 12 28Z"
            fill="url(#vtsDish)"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {/* Inner dish cavity */}
          <ellipse cx="22" cy="19" rx="6" ry="9" transform="rotate(-35 22 19)" fill="#0F172A" opacity="0.15" />
          {/* Feed horn */}
          <path d="M22 19L32 14" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="14" r="3" fill="#EF4444" stroke="#FEF2F2" strokeWidth="1" />
          {/* Pulsing Cyan Radio Waves */}
          <path d="M36 10C39 12 41 16 41 20" stroke="url(#vtsWave)" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 6C47 10 50 16 50 23" stroke="url(#vtsWave)" strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
        </svg>
      );

    case 'psc-clipboard':
      return (
        <svg width={size} height={size} viewBox="0 0 54 54" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="boardWood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="metalClip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          {/* Clipboard Board */}
          <rect x="10" y="8" width="34" height="42" rx="5" fill="url(#boardWood)" stroke="#92400E" strokeWidth="1.5" />
          {/* White Paper Page */}
          <rect x="14" y="14" width="26" height="32" rx="3" fill="#FFFFFF" />
          {/* Inspection Lines & Green Checkmarks */}
          <rect x="22" y="20" width="14" height="2" rx="1" fill="#94A3B8" />
          <rect x="22" y="27" width="14" height="2" rx="1" fill="#94A3B8" />
          <rect x="22" y="34" width="14" height="2" rx="1" fill="#94A3B8" />
          {/* Checks */}
          <path d="M17 21L18.5 22.5L20.5 19.5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 28L18.5 29.5L20.5 26.5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 35L18.5 36.5L20.5 33.5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Golden Stamp */}
          <circle cx="33" cy="38" r="4.5" fill="#EF4444" opacity="0.85" />
          <circle cx="33" cy="38" r="3.5" stroke="#FFF" strokeWidth="0.8" fill="none" />
          {/* Metallic Top Clip 3D */}
          <rect x="19" y="5" width="16" height="7" rx="2" fill="url(#metalClip)" />
          <circle cx="27" cy="8" r="2" fill="#0F172A" opacity="0.3" />
        </svg>
      );

    case 'oil-barrel':
      return (
        <svg width={size} height={size} viewBox="0 0 54 54" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="barrelGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B91C1C" />
              <stop offset="35%" stopColor="#EF4444" />
              <stop offset="70%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          {/* Barrel Body */}
          <path d="M12 12C12 9 18 7 27 7C36 7 42 9 42 12V42C42 45 36 47 27 47C18 47 12 45 12 42V12Z" fill="url(#barrelGrad)" />
          {/* Barrel Top Rim */}
          <ellipse cx="27" cy="12" rx="15" ry="5" fill="#DC2626" stroke="#FEF2F2" strokeWidth="1" />
          <ellipse cx="27" cy="12" rx="12" ry="3.5" fill="#991B1B" />
          <circle cx="23" cy="12" r="2" fill="#475569" stroke="#E2E8F0" strokeWidth="0.8" />
          {/* Steel Ribs / Corrugation rings 3D */}
          <ellipse cx="27" cy="22" rx="15" ry="4" stroke="#7F1D1D" strokeWidth="2.5" fill="none" />
          <ellipse cx="27" cy="32" rx="15" ry="4" stroke="#7F1D1D" strokeWidth="2.5" fill="none" />
          {/* Flame / Hazmat Diamond on barrel */}
          <rect x="23" y="24" width="8" height="8" rx="1.5" transform="rotate(45 27 28)" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1" />
          <circle cx="27" cy="28" r="1.5" fill="#B91C1C" />
        </svg>
      );

    case 'anchor':
      return (
        <svg width={size} height={size} viewBox="0 0 54 54" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="anchorSteel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="40%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="anchorGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          {/* Top Ring */}
          <circle cx="27" cy="11" r="5" stroke="url(#anchorSteel)" strokeWidth="3" fill="none" />
          {/* Golden Cable wrapped */}
          <path d="M25 15C29 17 29 20 25 22C21 24 21 27 25 29" stroke="url(#anchorGold)" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Crossbar */}
          <rect x="13" y="18" width="28" height="4" rx="2" fill="url(#anchorSteel)" />
          <circle cx="14" cy="20" r="3" fill="url(#anchorSteel)" />
          <circle cx="40" cy="20" r="3" fill="url(#anchorSteel)" />
          {/* Central Shank */}
          <rect x="25" y="14" width="4" height="28" rx="2" fill="url(#anchorSteel)" />
          {/* Curved Flukes */}
          <path
            d="M10 28C11 40 21 46 27 46C33 46 43 40 44 28H39C38 36 32 40 27 40C22 40 16 36 15 28H10Z"
            fill="url(#anchorSteel)"
          />
          {/* Sharp Fluke Tips */}
          <polygon points="10,29 6,24 15,26" fill="url(#anchorSteel)" />
          <polygon points="44,29 48,24 39,26" fill="url(#anchorSteel)" />
        </svg>
      );

    case 'security-shield':
      return (
        <svg width={size} height={size} viewBox="0 0 54 54" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="shieldLeft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="shieldRight" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="shieldBorder" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          {/* Golden Shield Bevel Base */}
          <path
            d="M27 5L44 11V26C44 38 36 46 27 49C18 46 10 38 10 26V11L27 5Z"
            fill="url(#shieldBorder)"
          />
          {/* Inner Left (Red) */}
          <path
            d="M27 8L13 13V26C13 36 20 43 27 46V8Z"
            fill="url(#shieldLeft)"
          />
          {/* Inner Right (White/Silver) */}
          <path
            d="M27 8L41 13V26C41 36 34 43 27 46V8Z"
            fill="url(#shieldRight)"
          />
          {/* Center 3D Security Star */}
          <polygon
            points="27,18 29,24 35,24 30,28 32,34 27,30 22,34 24,28 19,24 25,24"
            fill="#FEF08A"
            stroke="#B45309"
            strokeWidth="1"
          />
        </svg>
      );

    /* -------------------------------------------------------------
       2. GAMIFICATION, STREAK & PRACTICE STICKERS
       ------------------------------------------------------------- */
    case 'flame':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <radialGradient id="flameBack" cx="50%" cy="85%" r="70%">
              <stop offset="0%" stopColor="#FF1E00" />
              <stop offset="45%" stopColor="#FF5500" />
              <stop offset="100%" stopColor="#CC0000" />
            </radialGradient>
            <linearGradient id="flameMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE600" />
              <stop offset="60%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#FF3D00" />
            </linearGradient>
            <radialGradient id="flameCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFF275" />
              <stop offset="100%" stopColor="#FFA600" />
            </radialGradient>
          </defs>
          <path
            d="M24 2C24 2 29 10 29 16C29 18.5 27.5 20.5 26 22C30 19 36 21 38 27C40 33 36 44 24 46C12 44 8 33 10 27C11.5 22.5 15.5 19.5 19 20C17 17 17 12 24 2Z"
            fill="url(#flameBack)"
          />
          <path
            d="M24 14C25.5 18 29 21 28 26C27 31 23 33 25 38C22 36 19 33 20 28C21 23 18 21 24 14Z"
            fill="url(#flameMid)"
          />
          <ellipse cx="24" cy="35" rx="5" ry="7" fill="url(#flameCore)" />
        </svg>
      );

    case 'start':
    case 'wood':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <radialGradient id="sproutPot" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#92400E" />
            </radialGradient>
            <linearGradient id="leafLeft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="40%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="leafRight" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="50%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </linearGradient>
          </defs>
          <ellipse cx="24" cy="38" rx="14" ry="6" fill="#78350F" opacity="0.4" />
          <path d="M14 34L17 42C17.5 43.5 19 44 24 44C29 44 30.5 43.5 31 42L34 34C32 35 28 36 24 36C20 36 16 35 14 34Z" fill="url(#sproutPot)" />
          <path d="M23 20C23 26 23 34 25 36C23 36 21 28 22 20Z" fill="#15803D" />
          <path d="M23 22C15 22 10 16 11 9C17 9 23 14 23 22Z" fill="url(#leafLeft)" />
          <path d="M23 20C32 18 38 12 36 5C29 6 23 12 23 20Z" fill="url(#leafRight)" />
          <circle cx="16" cy="14" r="1.5" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );

    case 'bronze-medal':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="ribbonLeft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="ribbonRight" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <radialGradient id="bronzeCoin" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="35%" stopColor="#D97706" />
              <stop offset="80%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>
          </defs>
          <path d="M19 4L12 24L18 25L24 12L19 4Z" fill="url(#ribbonLeft)" />
          <path d="M29 4L36 24L30 25L24 12L29 4Z" fill="url(#ribbonRight)" />
          <circle cx="24" cy="30" r="14" fill="url(#bronzeCoin)" />
          <circle cx="24" cy="30" r="11" stroke="#FDE68A" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          <text x="24" y="35" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFFBEB">3</text>
        </svg>
      );

    case 'silver-lightning':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="boltGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF" />
              <stop offset="25%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <filter id="boltGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M26 3L10 24H22L18 45L38 20H24L26 3Z"
            fill="url(#boltGrad)"
            stroke="#FEF08A"
            strokeWidth="1.5"
            strokeLinejoin="round"
            filter="url(#boltGlow)"
          />
          <path d="M26 3L10 24H22L18 45L23 24H15L26 3Z" fill="#FFFFFF" opacity="0.35" />
        </svg>
      );

    case 'gold-star':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <radialGradient id="goldStarGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="30%" stopColor="#FACC15" />
              <stop offset="75%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
          </defs>
          <path
            d="M24 3L29.5 16.5L44 17.5L33 27L36.5 41.5L24 33.5L11.5 41.5L15 27L4 17.5L18.5 16.5L24 3Z"
            fill="url(#goldStarGrad)"
            stroke="#FEF9C3"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M24 3L29.5 16.5L24 33.5L18.5 16.5L24 3Z" fill="#FFFFFF" opacity="0.3" />
        </svg>
      );

    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="diaTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="diaBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          <polygon points="14,14 34,14 42,22 6,22" fill="url(#diaTop)" />
          <polygon points="18,14 30,14 34,22 14,22" fill="#BAE6FD" />
          <polygon points="6,22 42,22 24,44" fill="url(#diaBottom)" />
          <polygon points="14,22 34,22 24,44" fill="#0EA5E9" />
          <line x1="24" y1="22" x2="24" y2="44" stroke="#7DD3FC" strokeWidth="1" opacity="0.7" />
        </svg>
      );

    case 'crown':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="45%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          <path d="M8 38H40V34C40 33 39 32 38 32H10C9 32 8 33 8 34V38Z" fill="#B45309" />
          <path d="M9 36H39V34H9V36Z" fill="#FEF9C3" />
          <path d="M8 32L12 16L20 25L24 11L28 25L36 16L40 32H8Z" fill="url(#crownGrad)" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="24" cy="11" r="3.5" fill="#EF4444" stroke="#FEF2F2" strokeWidth="1" />
          <circle cx="12" cy="16" r="3" fill="#3B82F6" stroke="#EFF6FF" strokeWidth="1" />
          <circle cx="36" cy="16" r="3" fill="#10B981" stroke="#ECFDF5" strokeWidth="1" />
        </svg>
      );

    case 'party-popper':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="popperCone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <path d="M6 38L22 42L34 26L18 14L6 38Z" fill="url(#popperCone)" />
          <path d="M18 14L34 26C36 23 35 17 31 15C27 13 21 13 18 14Z" fill="#FDE047" />
          <circle cx="38" cy="12" r="3" fill="#3B82F6" />
          <circle cx="44" cy="22" r="2.5" fill="#10B981" />
          <circle cx="32" cy="6" r="2" fill="#EC4899" />
          <path d="M28 8C32 7 36 9 37 4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <path d="M38 18C42 19 45 16 46 12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'coin':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <radialGradient id="coinFace" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#EAB308" />
              <stop offset="85%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </radialGradient>
          </defs>
          <circle cx="24" cy="24" r="20" fill="url(#coinFace)" stroke="#FEF9C3" strokeWidth="2" />
          <circle cx="24" cy="24" r="15" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.8" />
          <text x="24" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="#FEF9C3">★</text>
        </svg>
      );

    case 'gem':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="gemGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="40%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
          <polygon points="12,12 36,12 44,24 24,44 4,24" fill="url(#gemGrad)" />
          <polygon points="16,12 32,12 38,24 10,24" fill="#93C5FD" />
          <polygon points="10,24 38,24 24,44" fill="#1D4ED8" />
          <line x1="24" y1="12" x2="24" y2="44" stroke="#BFDBFE" strokeWidth="1.5" opacity="0.75" />
        </svg>
      );

    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <radialGradient id="heartGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="35%" stopColor="#EF4444" />
              <stop offset="85%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </radialGradient>
          </defs>
          <path
            d="M24 42C24 42 6 29 6 17C6 10.5 11 6 17 6C20.5 6 23.5 8 24 10C24.5 8 27.5 6 31 6C37 6 42 10.5 42 17C42 29 24 42 24 42Z"
            fill="url(#heartGrad)"
          />
          <ellipse cx="14" cy="13" rx="4" ry="2.5" transform="rotate(-30 14 13)" fill="#FFFFFF" opacity="0.6" />
        </svg>
      );

    case 'target':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <circle cx="24" cy="24" r="20" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
          <circle cx="24" cy="24" r="15" fill="#FFFFFF" />
          <circle cx="24" cy="24" r="10" fill="#EF4444" />
          <circle cx="24" cy="24" r="5" fill="#FEF08A" />
        </svg>
      );

    case 'trophy':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="trophyCup" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>
          </defs>
          <rect x="14" y="38" width="20" height="6" rx="2" fill="#78350F" />
          <rect x="20" y="30" width="8" height="8" fill="url(#trophyCup)" />
          <path d="M12 8H36V22C36 28 30 32 24 32C18 32 12 28 12 22V8Z" fill="url(#trophyCup)" />
          <path d="M12 12H6C6 18 10 22 14 22V19C11 19 8 16 8 12H12V12Z" fill="#CA8A04" />
          <path d="M36 12H42C42 18 38 22 34 22V19C37 19 40 16 40 12H36V12Z" fill="#CA8A04" />
          <polygon points="24,14 26,19 31,19 27,22 29,27 24,24 19,27 21,22 17,19 22,19" fill="#FFFBEB" />
        </svg>
      );

    case 'swords':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <path d="M8 8L20 20M40 8L28 20" stroke="url(#bladeGrad)" strokeWidth="4" strokeLinecap="round" />
          <path d="M6 6L24 24M42 6L24 24" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="20" y="24" width="8" height="3" rx="1.5" transform="rotate(45 24 25.5)" fill="#F59E0B" />
          <rect x="20" y="24" width="8" height="3" rx="1.5" transform="rotate(-45 24 25.5)" fill="#F59E0B" />
          <circle cx="10" cy="38" r="3" fill="#CA8A04" />
          <circle cx="38" cy="38" r="3" fill="#CA8A04" />
        </svg>
      );

    case 'radio':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <rect x="12" y="14" width="24" height="28" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <path d="M18 14V4" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="18" cy="4" r="2.5" fill="#EF4444" />
          <rect x="16" y="19" width="16" height="8" rx="2" fill="#0284C7" />
          <text x="24" y="25" textAnchor="middle" fontSize="6" fontWeight="900" fill="#FFF">CH 16</text>
          <circle cx="20" cy="33" r="3.5" fill="#334155" />
          <circle cx="28" cy="33" r="3.5" fill="#334155" />
        </svg>
      );

    case 'compass':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <circle cx="24" cy="24" r="20" fill="#F8FAFC" stroke="#D97706" strokeWidth="3" />
          <polygon points="24,8 28,24 24,21 20,24" fill="#EF4444" />
          <polygon points="24,40 28,24 24,27 20,24" fill="#3B82F6" />
          <circle cx="24" cy="24" r="3" fill="#F59E0B" />
        </svg>
      );

    case 'siren':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <rect x="10" y="32" width="28" height="8" rx="3" fill="#334155" />
          <path d="M14 32C14 20 20 12 24 12C28 12 34 20 34 32H14Z" fill="#EF4444" stroke="#F87171" strokeWidth="1.5" />
          <ellipse cx="24" cy="20" rx="4" ry="2" fill="#FFFFFF" opacity="0.6" />
          <path d="M10 16L6 14M38 16L42 14M24 8V4" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'gear':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <circle cx="24" cy="24" r="16" fill="#64748B" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="24" cy="24" r="8" fill="#1E293B" />
          <path d="M22 4H26V10H22ZM22 38H26V44H22ZM4 22H10V26H4ZM38 22H44V26H38Z" fill="#94A3B8" />
        </svg>
      );

    case 'puzzle':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <rect x="10" y="10" width="28" height="28" rx="6" fill="#8B5CF6" stroke="#C4B5FD" strokeWidth="2" />
          <circle cx="24" cy="10" r="4" fill="#8B5CF6" />
          <circle cx="38" cy="24" r="4" fill="#8B5CF6" />
        </svg>
      );

    case 'headphones':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <path d="M10 26C10 16 16 8 24 8C32 8 38 16 38 26" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" fill="none" />
          <rect x="8" y="24" width="6" height="14" rx="3" fill="#1D4ED8" />
          <rect x="34" y="24" width="6" height="14" rx="3" fill="#1D4ED8" />
        </svg>
      );

    case 'speed':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <circle cx="24" cy="24" r="18" fill="#0F172A" stroke="#EF4444" strokeWidth="2.5" />
          <path d="M12 28C12 18 18 12 24 12C30 12 36 18 36 28" stroke="#F59E0B" strokeWidth="3" strokeDasharray="3 3" fill="none" />
          <line x1="24" y1="24" x2="32" y2="16" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="24" r="3.5" fill="#FFFFFF" />
        </svg>
      );

    case 'cards':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <rect x="14" y="12" width="22" height="30" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(12 25 27)" />
          <rect x="10" y="8" width="22" height="30" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <text x="21" y="26" textAnchor="middle" fontSize="16" fill="#EF4444">♠</text>
        </svg>
      );

    case 'bot':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <rect x="12" y="14" width="24" height="22" rx="6" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1.5" />
          <line x1="24" y1="14" x2="24" y2="8" stroke="#3B82F6" strokeWidth="2.5" />
          <circle cx="24" cy="6" r="3" fill="#F59E0B" />
          <circle cx="19" cy="23" r="2.5" fill="#FFFFFF" />
          <circle cx="29" cy="23" r="2.5" fill="#FFFFFF" />
          <rect x="19" y="29" width="10" height="2" rx="1" fill="#FFFFFF" />
        </svg>
      );

    case 'lock':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="shackleMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="lockBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <path d="M16 20V15C16 10.58 19.58 7 24 7C28.42 7 32 10.58 32 15V20" stroke="url(#shackleMetal)" strokeWidth="4.5" strokeLinecap="round" />
          <rect x="11" y="19" width="26" height="22" rx="6" fill="url(#lockBody)" stroke="#F59E0B" strokeWidth="1" />
          <path d="M14 22H34" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <circle cx="24" cy="28" r="3" fill="#78350F" />
          <path d="M22.5 28L21.5 35H26.5L25.5 28Z" fill="#78350F" />
          <circle cx="24" cy="27.5" r="1.2" fill="#FEF3C7" />
        </svg>
      );

    case 'cloud':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <ellipse cx="24" cy="29" rx="16" ry="9" fill="url(#cloudGrad)" />
          <circle cx="19" cy="22" r="8" fill="url(#cloudGrad)" />
          <circle cx="29" cy="20" r="9.5" fill="url(#cloudGrad)" />
          <path d="M18 17C21 15 25 15 28 17" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="24" cy="27" rx="14" ry="7" fill="#FFFFFF" opacity="0.18" />
        </svg>
      );

    case 'sparkles':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          <path d="M24 4C24 14 27 21 37 21C27 21 24 28 24 38C24 28 21 21 11 21C21 21 24 14 24 4Z" fill="url(#sparkGrad)" />
          <path d="M37 28C37 32 38 35 42 35C38 35 37 38 37 42C37 38 36 35 32 35C36 35 37 32 37 28Z" fill="#FDE047" />
          <path d="M11 8C11 11 12 13 15 13C12 13 11 15 11 18C11 15 10 13 7 13C10 13 11 11 11 8Z" fill="#FDE047" />
          <circle cx="24" cy="21" r="3" fill="#FFFFFF" opacity="0.9" />
        </svg>
      );

    case 'rocket':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="flameThrust" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <path d="M14 34L8 42L16 36Z" fill="url(#flameThrust)" />
          <path d="M17 26L11 32L17 33Z" fill="#DC2626" />
          <path d="M22 21L28 27L29 21Z" fill="#DC2626" />
          <path d="M36 12C36 12 34 22 24 28L18 22C24 12 36 12 36 12Z" fill="url(#rocketBody)" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M36 12C33 13 30 16 28 18C30 20 33 23 36 24C38 20 38 16 36 12Z" fill="#EF4444" />
          <circle cx="26" cy="19" r="3" fill="#0284C7" stroke="#BAE6FD" strokeWidth="1.2" />
        </svg>
      );

    case 'pencil':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="pencilWood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          <g transform="rotate(-45 24 24)">
            <rect x="20" y="6" width="8" height="6" rx="2" fill="#F43F5E" />
            <rect x="20" y="11" width="8" height="4" fill="#94A3B8" />
            <rect x="20" y="15" width="8" height="20" fill="url(#pencilWood)" />
            <line x1="24" y1="15" x2="24" y2="35" stroke="#A16207" strokeWidth="1" />
            <polygon points="20,35 28,35 24,42" fill="#FED7AA" />
            <polygon points="22.5,39 25.5,39 24,42" fill="#1E293B" />
          </g>
        </svg>
      );

    case 'medal':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="ribbonBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="goldMedal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <polygon points="17,6 24,20 19,20 13,6" fill="url(#ribbonBlue)" />
          <polygon points="31,6 24,20 29,20 35,6" fill="#EF4444" />
          <circle cx="24" cy="30" r="13" fill="url(#goldMedal)" stroke="#FDE047" strokeWidth="1.5" />
          <circle cx="24" cy="30" r="10" stroke="#92400E" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          <path d="M24 23L26 27.5L30.5 28L27 31.5L28 36L24 33.5L20 36L21 31.5L17.5 28L22 27.5Z" fill="#FEF08A" />
        </svg>
      );

    case 'gamepad':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="padBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="60%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <path d="M12 16H36C41 16 43 21 41 31L39 37C38 40 34 40 32 37L28 32H20L16 37C14 40 10 40 9 37L7 31C5 21 7 16 12 16Z" fill="url(#padBody)" stroke="#60A5FA" strokeWidth="1.2" />
          <rect x="14" y="22" width="3" height="7" rx="1" fill="#E2E8F0" />
          <rect x="12" y="24" width="7" height="3" rx="1" fill="#E2E8F0" />
          <circle cx="34" cy="22" r="2" fill="#EF4444" />
          <circle cx="31" cy="25" r="2" fill="#10B981" />
          <circle cx="37" cy="25" r="2" fill="#F59E0B" />
          <circle cx="34" cy="28" r="2" fill="#38BDF8" />
          <circle cx="21" cy="27" r="2.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
          <circle cx="27" cy="27" r="2.5" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
        </svg>
      );

    case 'document':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="docGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>
          </defs>
          <path d="M12 8C12 6.89 12.89 6 14 6H28L36 14V40C36 41.11 35.11 42 34 42H14C12.89 42 12 41.11 12 40V8Z" fill="url(#docGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M28 6V14H36" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="17" y="19" width="14" height="2.5" rx="1" fill="#3B82F6" />
          <rect x="17" y="25" width="14" height="2" rx="1" fill="#94A3B8" />
          <rect x="17" y="30" width="11" height="2" rx="1" fill="#94A3B8" />
          <rect x="17" y="35" width="8" height="2" rx="1" fill="#10B981" />
        </svg>
      );

    case 'ship':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="shipHull" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="60%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="oceanWave" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <path d="M8 26L12 36C13 37 15 38 17 38H33C35 38 37 37 38 36L42 26H8Z" fill="url(#shipHull)" stroke="#334155" strokeWidth="1" />
          <rect x="15" y="16" width="12" height="10" rx="1.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="17" y="18" width="8" height="3" rx="0.5" fill="#0284C7" />
          <rect x="23" y="11" width="4" height="6" fill="#EF4444" />
          <rect x="23" y="11" width="4" height="1.5" fill="#0F172A" />
          <rect x="29" y="20" width="10" height="6" rx="0.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
          <path d="M6 37C10 35 14 39 18 37C22 35 26 39 30 37C34 35 38 39 42 37" stroke="url(#oceanWave)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'bulb':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="bulbGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <path d="M16 19C16 14.58 19.58 11 24 11C28.42 11 32 14.58 32 19C32 22.4 29.8 25.3 27 26.8V31H21V26.8C18.2 25.3 16 22.4 16 19Z" fill="url(#bulbGlow)" stroke="#FDE047" strokeWidth="1.2" />
          <ellipse cx="21" cy="16" rx="2" ry="4" transform="rotate(-30 21 16)" fill="#FFFFFF" opacity="0.6" />
          <rect x="21" y="32" width="6" height="2" rx="0.5" fill="#94A3B8" />
          <rect x="22" y="35" width="4" height="2" rx="0.5" fill="#64748B" />
        </svg>
      );

    case 'mic':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="micSilver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <rect x="18" y="8" width="12" height="20" rx="6" fill="url(#micSilver)" stroke="#475569" strokeWidth="1" />
          <path d="M13 20C13 26 18 31 24 31C30 31 35 26 35 20" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <line x1="24" y1="31" x2="24" y2="39" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <line x1="17" y1="39" x2="31" y2="39" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'bell':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={commonStyle} className={className}>
          <defs>
            <linearGradient id="bellGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>
          </defs>
          <ellipse cx="24" cy="38" rx="16" ry="3.5" fill="#334155" />
          <path d="M12 36C12 24 16 16 24 16C32 16 36 24 36 36H12Z" fill="url(#bellGold)" stroke="#CA8A04" strokeWidth="1" />
          <path d="M18 20C21 18 27 18 30 20" stroke="#FEF9C3" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <rect x="23" y="11" width="2" height="5" fill="#475569" />
          <circle cx="24" cy="10" r="3" fill="#D97706" />
        </svg>
      );

    default:
      // Fallback for any other emoji/symbol: Wrap in an isometric 3D glossy badge container
      return (
        <span
          className={`sticker-3d-badge ${className}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            fontSize: size * 0.58,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 50%, #E2E8F0 100%)',
            borderRadius: Math.round(size * 0.32),
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12), inset 0 1px 1px #FFFFFF, inset 0 -2px 3px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            ...commonStyle
          }}
        >
          {query}
        </span>
      );
  }
};
