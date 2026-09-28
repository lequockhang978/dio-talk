import React from 'react';
import { type PetSkin } from '../data/petSkins';

interface PetMascotProps {
  skin: PetSkin;
  size?: number;
  isAnimated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PetMascot: React.FC<PetMascotProps> = ({
  skin,
  size = 120,
  isAnimated = true,
  className = '',
  onClick
}) => {
  return (
    <div
      className={`pet-mascot-container ${isAnimated ? 'idle-float' : ''} ${className}`}
      style={{ width: size, height: size, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 160 160"
        width={size}
        height={size}
        style={{ overflow: 'visible', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.14))' }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="petBodyGrad" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>
          <radialGradient id="petBellyGrad" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>
          <linearGradient id="petBeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="cyberNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* 1. PEDESTAL SHADOW */}
        <ellipse cx="80" cy="148" rx="42" ry="9" fill="rgba(15, 23, 42, 0.22)" filter="blur(2px)" />

        {/* 2. PET FEET */}
        <ellipse cx="62" cy="142" rx="13" ry="6" fill="#F59E0B" />
        <ellipse cx="98" cy="142" rx="13" ry="6" fill="#F59E0B" />

        {/* 3. FLIPPERS (ARMS) */}
        {/* Left Flipper */}
        <path
          d="M 38 88 C 24 100 24 116 35 120 C 42 122 47 110 45 96 Z"
          fill="#1E293B"
          transform="rotate(-5 38 88)"
        />
        {/* Right Flipper (Holding Tool/Wrench/Binoculars if equipped) */}
        <path
          d="M 122 88 C 136 100 136 116 125 120 C 118 122 113 110 115 96 Z"
          fill="#1E293B"
          transform="rotate(5 122 88)"
        />

        {/* 4. MAIN BODY (CHUBBY CUTE CHIBI PENGUIN) */}
        <ellipse cx="80" cy="94" rx="48" ry="50" fill="url(#petBodyGrad)" />

        {/* 5. WHITE PLUMP BELLY */}
        <ellipse cx="80" cy="102" rx="34" ry="38" fill="url(#petBellyGrad)" />

        {/* 6. OUTFIT LAYERS ACCORDING TO SKIN */}
        {skin.outfitType === 'sailor' && (
          <g>
            {/* Sailor blue collar */}
            <path d="M 52 86 Q 80 112 108 86 Q 80 94 52 86 Z" fill="#0284C7" />
            <path d="M 58 88 Q 80 110 102 88" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
            {/* Red necktie ribbon */}
            <path d="M 77 98 L 74 116 L 80 114 L 86 116 L 83 98 Z" fill="#EF4444" />
          </g>
        )}

        {skin.outfitType === 'boiler-suit' && (
          <g>
            {/* Engine orange jumpsuit/dungarees */}
            <path d="M 54 102 C 54 136 106 136 106 102 L 102 100 L 94 136 L 66 136 L 58 100 Z" fill="#EA580C" />
            {/* Straps */}
            <rect x="62" y="94" width="7" height="24" rx="3" fill="#C2410C" />
            <rect x="91" y="94" width="7" height="24" rx="3" fill="#C2410C" />
            {/* Center Pocket with wrench handle */}
            <rect x="73" y="112" width="14" height="12" rx="2" fill="#9A3412" />
            <circle cx="65.5" cy="116" r="2.5" fill="#FBBF24" />
            <circle cx="94.5" cy="116" r="2.5" fill="#FBBF24" />
          </g>
        )}

        {skin.outfitType === 'chef-apron' && (
          <g>
            {/* White chef coat */}
            <path d="M 52 90 C 52 138 108 138 108 90 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Red neckerchief tie */}
            <path d="M 68 88 Q 80 98 92 88 Q 80 93 68 88 Z" fill="#EF4444" />
            <path d="M 77 93 L 74 105 L 80 103 L 86 105 L 83 93 Z" fill="#EF4444" />
            {/* Double breasted buttons */}
            <circle cx="73" cy="104" r="2" fill="#0F172A" />
            <circle cx="87" cy="104" r="2" fill="#0F172A" />
            <circle cx="73" cy="116" r="2" fill="#0F172A" />
            <circle cx="87" cy="116" r="2" fill="#0F172A" />
            <circle cx="73" cy="128" r="2" fill="#0F172A" />
            <circle cx="87" cy="128" r="2" fill="#0F172A" />
            <line x1="54" y1="124" x2="106" y2="124" stroke="#10B981" strokeWidth="2" />
          </g>
        )}

        {skin.outfitType === 'white-shirt' && (
          <g>
            {/* Officer crisp white uniform coat */}
            <path d="M 52 92 C 52 136 108 136 108 92 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Black & Gold Epaulets on shoulders */}
            <rect x="42" y="86" width="16" height="6" rx="2" fill="#0F172A" />
            <line x1="44" y1="89" x2="56" y2="89" stroke="#EAB308" strokeWidth="2" />
            <rect x="102" y="86" width="16" height="6" rx="2" fill="#0F172A" />
            <line x1="104" y1="89" x2="116" y2="89" stroke="#EAB308" strokeWidth="2" />
            {/* Gold Buttons */}
            <circle cx="80" cy="106" r="2.5" fill="#EAB308" />
            <circle cx="80" cy="118" r="2.5" fill="#EAB308" />
            <circle cx="80" cy="130" r="2.5" fill="#EAB308" />
          </g>
        )}

        {skin.outfitType === 'doctor-coat' && (
          <g>
            {/* Medical white lab coat */}
            <path d="M 52 92 C 52 138 108 138 108 92 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Teal inner shirt V-neck */}
            <polygon points="72,88 88,88 80,102" fill="#06B6D4" />
            {/* Left pocket with Red Cross */}
            <rect x="58" y="112" width="13" height="13" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <rect x="63" y="114" width="3" height="9" fill="#EF4444" rx="0.5" />
            <rect x="60" y="117" width="9" height="3" fill="#EF4444" rx="0.5" />
            {/* Stethoscope neck tubing */}
            <path d="M 66 88 Q 63 108 77 114" stroke="#334155" strokeWidth="2.5" fill="none" />
            <path d="M 94 88 Q 97 108 83 114" stroke="#334155" strokeWidth="2.5" fill="none" />
            <circle cx="80" cy="116" r="4.5" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            <circle cx="80" cy="116" r="2" fill="#CBD5E1" />
          </g>
        )}

        {skin.outfitType === 'captain-coat' && (
          <g>
            {/* Navy blue royal maritime coat */}
            <path d="M 50 90 C 50 140 110 140 110 90 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
            {/* Gold braid trims */}
            <path d="M 50 96 Q 80 120 110 96" stroke="url(#goldTrimGrad)" strokeWidth="3" fill="none" />
            <path d="M 52 104 Q 80 128 108 104" stroke="url(#goldTrimGrad)" strokeWidth="2.5" fill="none" />
            {/* Shiny gold medals */}
            <circle cx="68" cy="110" r="4.5" fill="#F59E0B" />
            <circle cx="78" cy="114" r="4.5" fill="#EF4444" />
          </g>
        )}

        {skin.outfitType === 'diving-suit' && (
          <g>
            {/* Heavy neoprene underwater suit */}
            <path d="M 50 90 C 50 140 110 140 110 90 Z" fill="#0F766E" stroke="#115E59" strokeWidth="2" />
            <path d="M 60 98 C 60 130 100 130 100 98 Z" fill="#134E4A" stroke="#0D9488" strokeWidth="1.5" />
            <circle cx="80" cy="114" r="7.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
            <line x1="80" y1="114" x2="84" y2="110" stroke="#DC2626" strokeWidth="1.5" />
            <path d="M 52 94 Q 40 110 52 130" stroke="#F59E0B" strokeWidth="3" fill="none" strokeDasharray="3,1.5" />
            <rect x="54" y="132" width="52" height="6" rx="2" fill="#1E293B" />
            <rect x="66" y="131" width="6" height="8" rx="1" fill="#64748B" />
            <rect x="77" y="131" width="6" height="8" rx="1" fill="#F59E0B" />
            <rect x="88" y="131" width="6" height="8" rx="1" fill="#64748B" />
          </g>
        )}

        {skin.outfitType === 'cyber-armor' && (
          <g>
            {/* Cyber holographic tech chestplate */}
            <path d="M 50 92 C 50 138 110 138 110 92 Z" fill="#18181B" stroke="#8B5CF6" strokeWidth="2" />
            <path d="M 64 100 L 96 100 L 80 126 Z" fill="none" stroke="url(#cyberNeonGrad)" strokeWidth="3" />
            <circle cx="80" cy="112" r="5" fill="#06B6D4" filter="drop-shadow(0 0 5px #06B6D4)" />
          </g>
        )}

        {skin.outfitType === 'admiral-uniform' && (
          <g>
            {/* Royal Admiral Imperial Crimson Coat */}
            <path d="M 50 90 C 50 142 110 142 110 90 Z" fill="#881337" stroke="#4C0519" strokeWidth="2" />
            {/* Grand Diagonal Gold Sash */}
            <polygon points="56,92 68,92 104,136 92,136" fill="#F59E0B" opacity="0.9" />
            <line x1="68" y1="102" x2="92" y2="102" stroke="#FDE047" strokeWidth="2" />
            <line x1="66" y1="112" x2="94" y2="112" stroke="#FDE047" strokeWidth="2" />
            <line x1="68" y1="122" x2="92" y2="122" stroke="#FDE047" strokeWidth="2" />
            {/* Gold Epaulets */}
            <g transform="translate(38, 85)">
              <rect x="0" y="0" width="18" height="6" rx="2" fill="#EAB308" />
              <line x1="2" y1="6" x2="2" y2="12" stroke="#FDE047" strokeWidth="1.5" />
              <line x1="6" y1="6" x2="6" y2="13" stroke="#FDE047" strokeWidth="1.5" />
              <line x1="10" y1="6" x2="10" y2="13" stroke="#FDE047" strokeWidth="1.5" />
              <line x1="14" y1="6" x2="14" y2="12" stroke="#FDE047" strokeWidth="1.5" />
            </g>
            <g transform="translate(104, 85)">
              <rect x="0" y="0" width="18" height="6" rx="2" fill="#EAB308" />
              <line x1="4" y1="6" x2="4" y2="12" stroke="#FDE047" strokeWidth="1.5" />
              <line x1="8" y1="6" x2="8" y2="13" stroke="#FDE047" strokeWidth="1.5" />
              <line x1="12" y1="6" x2="12" y2="13" stroke="#FDE047" strokeWidth="1.5" />
              <line x1="16" y1="6" x2="16" y2="12" stroke="#FDE047" strokeWidth="1.5" />
            </g>
            <polygon points="73,108 77,105 81,108 79,113 75,113" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}

        {/* 7. CHEEKS (BLUSH) */}
        <ellipse cx="61" cy="74" rx="6" ry="4" fill="#F87171" opacity="0.6" />
        <ellipse cx="99" cy="74" rx="6" ry="4" fill="#F87171" opacity="0.6" />

        {/* 8. BIG SHINY ANIME EYES */}
        {/* Left Eye */}
        <ellipse cx="66" cy="67" rx="8" ry="10" fill="#0F172A" />
        <circle cx="64" cy="64" r="3.5" fill="#FFFFFF" />
        <circle cx="68" cy="71" r="1.5" fill="#FFFFFF" />

        {/* Right Eye (Normal or Cyber Laser/Eyepatch) */}
        {skin.accessory === 'laser-eye' ? (
          <g>
            <circle cx="94" cy="67" r="11" fill="#09090B" stroke="#06B6D4" strokeWidth="2.5" />
            <circle cx="94" cy="67" r="5" fill="#06B6D4" filter="drop-shadow(0 0 6px #06B6D4)" />
            <line x1="83" y1="67" x2="70" y2="62" stroke="#27272A" strokeWidth="2" />
            <line x1="105" y1="67" x2="118" y2="62" stroke="#27272A" strokeWidth="2" />
          </g>
        ) : (
          <g>
            <ellipse cx="94" cy="67" rx="8" ry="10" fill="#0F172A" />
            <circle cx="92" cy="64" r="3.5" fill="#FFFFFF" />
            <circle cx="96" cy="71" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* Sunglasses if equipped */}
        {skin.accessory === 'sunglasses' && (
          <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))">
            <rect x="54" y="60" width="22" height="15" rx="5" fill="#0F172A" stroke="#EAB308" strokeWidth="1.5" />
            <rect x="84" y="60" width="22" height="15" rx="5" fill="#0F172A" stroke="#EAB308" strokeWidth="1.5" />
            <line x1="76" y1="66" x2="84" y2="66" stroke="#EAB308" strokeWidth="2" />
            {/* Lens glare reflections */}
            <line x1="57" y1="63" x2="68" y2="72" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <line x1="87" y1="63" x2="98" y2="72" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          </g>
        )}

        {/* 9. CUTE ORANGE BEAK */}
        <polygon points="73,73 87,73 80,84" fill="url(#petBeakGrad)" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.15))" />

        {/* 10. HELD ACCESSORIES (Wrench, Binoculars, Ladle, Stethoscope, Flashlight, Sword) */}
        {skin.accessory === 'wrench' && (
          <g transform="translate(112, 85) rotate(25)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
            <rect x="6" y="2" width="6" height="32" rx="2" fill="#94A3B8" />
            <circle cx="9" cy="6" r="8" fill="#64748B" />
            <rect x="6" y="2" width="6" height="8" fill="#F8FAFC" />
          </g>
        )}

        {skin.accessory === 'binoculars' && (
          <g transform="translate(108, 92) rotate(-10)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
            <rect x="0" y="0" width="10" height="20" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="1" />
            <rect x="12" y="0" width="10" height="20" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="1" />
            <rect x="7" y="6" width="8" height="4" fill="#78350F" />
            <circle cx="5" cy="18" r="4.5" fill="#38BDF8" />
            <circle cx="17" cy="18" r="4.5" fill="#38BDF8" />
          </g>
        )}

        {skin.accessory === 'ladle' && (
          <g transform="translate(112, 82) rotate(20)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
            <rect x="6" y="10" width="4.5" height="28" rx="2" fill="#92400E" />
            <ellipse cx="8.2" cy="8" rx="7" ry="5.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <ellipse cx="8.2" cy="7.5" rx="5" ry="3.5" fill="#FDE047" />
          </g>
        )}

        {skin.accessory === 'stethoscope' && (
          <g transform="translate(108, 90) rotate(8)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))">
            <rect x="0" y="4" width="22" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="7" y="1" width="8" height="4" rx="1.5" fill="#64748B" />
            <rect x="9.5" y="8" width="3" height="10" rx="0.5" fill="#EF4444" />
            <rect x="6" y="11.5" width="10" height="3" rx="0.5" fill="#EF4444" />
          </g>
        )}

        {skin.accessory === 'flashlight' && (
          <g transform="translate(110, 88) rotate(-15)" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.35))">
            <rect x="2" y="8" width="8" height="24" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            <rect x="0" y="0" width="12" height="9" rx="2" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
            <ellipse cx="6" cy="1" rx="5" ry="2" fill="#67E8F9" />
            <polygon points="2,0 10,0 22,-14 -10,-14" fill="#67E8F9" opacity="0.35" />
          </g>
        )}

        {skin.accessory === 'ceremonial-sword' && (
          <g transform="translate(112, 84) rotate(18)" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.35))">
            <rect x="6" y="12" width="4.5" height="32" rx="1.5" fill="#0F172A" stroke="#EAB308" strokeWidth="1" />
            <ellipse cx="8.2" cy="11" rx="8" ry="3" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
            <rect x="6.5" y="2" width="3.5" height="9" rx="1" fill="#78350F" />
            <circle cx="8.2" cy="2" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <path d="M 8 3 Q 14 7 13 13" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
          </g>
        )}

        {/* 11. HATS ON HEAD */}
        {skin.hatType === 'beret' && (
          <g transform="translate(16, 2) rotate(-6 80 40)">
            {/* French/Sailor white beret with anchor pin */}
            <ellipse cx="72" cy="42" rx="32" ry="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <circle cx="72" cy="36" r="3" fill="#0284C7" />
            {/* Small Gold Anchor insignia */}
            <circle cx="68" cy="42" r="5" fill="#F59E0B" />
          </g>
        )}

        {skin.hatType === 'hard-hat' && (
          <g transform="translate(10, 4)">
            {/* Yellow Engine room safety helmet with visor */}
            <path d="M 44 48 C 44 26 96 26 96 48 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="70" cy="48" rx="34" ry="7" fill="#F59E0B" />
            {/* Center ridge */}
            <path d="M 68 28 L 72 28 L 72 48 L 68 48 Z" fill="#D97706" />
          </g>
        )}

        {skin.hatType === 'chef-toque' && (
          <g transform="translate(12, -8)">
            <rect x="52" y="44" width="56" height="12" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="56" y1="50" x2="104" y2="50" stroke="#E2E8F0" strokeWidth="1.5" />
            <path
              d="M 50 45 C 38 32 46 14 62 20 C 68 8 92 8 98 20 C 114 14 122 32 110 45 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            <path d="M 68 22 Q 72 40 70 44" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
            <path d="M 80 18 Q 80 38 80 44" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
            <path d="M 92 22 Q 88 40 90 44" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
            <circle cx="80" cy="50" r="3" fill="#10B981" />
          </g>
        )}

        {skin.hatType === 'officer-cap' && (
          <g transform="translate(8, 2)">
            {/* White peak officer cap */}
            <ellipse cx="72" cy="44" rx="36" ry="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Black visor brim */}
            <path d="M 44 46 C 52 56 92 56 100 46 Z" fill="#0F172A" />
            {/* Gold officer oak leaves band */}
            <rect x="48" y="40" width="48" height="6" rx="2" fill="#1E293B" />
            <line x1="50" y1="43" x2="94" y2="43" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="72" cy="38" r="4.5" fill="#EAB308" />
          </g>
        )}

        {skin.hatType === 'doctor-mirror' && (
          <g transform="translate(8, 6)">
            <path d="M 44 48 Q 80 38 116 48" stroke="#334155" strokeWidth="3" fill="none" />
            <circle cx="80" cy="38" r="13" fill="url(#silverGrad)" stroke="#64748B" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))" />
            <circle cx="80" cy="38" r="8" fill="#F8FAFC" opacity="0.6" />
            <circle cx="80" cy="38" r="3" fill="#0F172A" />
            <circle cx="60" cy="42" r="5" fill="#EF4444" />
            <rect x="58.5" y="39" width="3" height="6" fill="#FFFFFF" rx="0.5" />
            <rect x="57" y="40.5" width="6" height="3" fill="#FFFFFF" rx="0.5" />
          </g>
        )}

        {skin.hatType === 'captain-cap' && (
          <g transform="translate(8, -2)">
            {/* Master Captain Grand Cap */}
            <path d="M 38 42 C 40 18 104 18 106 42 Z" fill="#0F172A" />
            <ellipse cx="72" cy="40" rx="38" ry="10" fill="#1E293B" />
            {/* Glossy Black Visor with gold leaf embroideries */}
            <path d="M 42 44 C 52 58 92 58 102 44 Z" fill="#020617" />
            <path d="M 46 47 Q 72 56 98 47" stroke="#FBBF24" strokeWidth="2" fill="none" />
            {/* Grand Imperial Maritime Crest */}
            <circle cx="72" cy="32" r="7" fill="#EAB308" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.4))" />
            <path d="M 72 28 L 74 36 L 70 36 Z" fill="#B45309" />
          </g>
        )}

        {skin.hatType === 'diver-helmet' && (
          <g transform="translate(6, -2)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))">
            <path d="M 42 54 C 40 18 118 18 116 54 C 114 62 44 62 42 54 Z" fill="#D97706" stroke="#B45309" strokeWidth="2" />
            <ellipse cx="79" cy="20" rx="9" ry="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <rect x="76" y="14" width="6" height="6" fill="#B45309" />
            <circle cx="43" cy="42" r="5" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
            <circle cx="115" cy="42" r="5" fill="#F59E0B" stroke="#92400E" strokeWidth="1" />
            <circle cx="79" cy="42" r="17" fill="#0284C7" stroke="#F59E0B" strokeWidth="3.5" />
            <line x1="79" y1="26" x2="79" y2="58" stroke="#FDE047" strokeWidth="1.5" />
            <line x1="63" y1="42" x2="95" y2="42" stroke="#FDE047" strokeWidth="1.5" />
            <path d="M 68 33 Q 79 38 88 33" stroke="#BAE6FD" strokeWidth="2" fill="none" opacity="0.8" />
            <circle cx="85" cy="36" r="2" fill="#FFFFFF" opacity="0.9" />
            <path d="M 48 58 Q 79 66 110 58" stroke="#92400E" strokeWidth="4" fill="none" />
            <circle cx="60" cy="61" r="1.5" fill="#FEF08A" />
            <circle cx="79" cy="62.5" r="1.5" fill="#FEF08A" />
            <circle cx="98" cy="61" r="1.5" fill="#FEF08A" />
          </g>
        )}

        {skin.hatType === 'pirate-hat' && (
          <g transform="translate(4, -4)">
            {/* Tricorn Cyber Pirate Hat */}
            <path d="M 28 44 C 40 16 112 16 124 44 C 104 38 48 38 28 44 Z" fill="#18181B" stroke="#9333EA" strokeWidth="2" />
            {/* Skull & Crossbones or Cyber Matrix badge */}
            <circle cx="76" cy="34" r="6" fill="#9333EA" filter="drop-shadow(0 0 6px #A855F7)" />
            <line x1="68" y1="28" x2="84" y2="40" stroke="#06B6D4" strokeWidth="2" />
            <line x1="84" y1="28" x2="68" y2="40" stroke="#06B6D4" strokeWidth="2" />
          </g>
        )}

        {skin.hatType === 'admiral-bicorn' && (
          <g transform="translate(6, -6)" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.35))">
            <path
              d="M 28 46 C 40 22 62 20 79 32 C 96 20 118 22 130 46 C 105 38 53 38 28 46 Z"
              fill="#0F172A"
              stroke="#1E293B"
              strokeWidth="2"
            />
            <path
              d="M 32 43 C 44 24 62 23 79 33 C 96 23 114 24 126 43"
              stroke="url(#goldTrimGrad)"
              strokeWidth="2.5"
              fill="none"
            />
            <path d="M 74 30 C 72 14 78 8 84 6 C 88 12 86 22 84 30 Z" fill="#F8FAFC" />
            <path d="M 82 28 C 84 16 90 10 96 8 C 96 16 92 24 88 28 Z" fill="#EF4444" />
            <circle cx="79" cy="38" r="6" fill="#DC2626" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="79" cy="38" r="2.5" fill="#FDE047" />
          </g>
        )}
      </svg>
    </div>
  );
};
