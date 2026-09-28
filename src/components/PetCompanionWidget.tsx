import React, { useState } from 'react';
import { type PetSkin } from '../data/petSkins';
import { PetMascot } from './PetMascot';
import { Sticker3D } from './Sticker3D';
import { soundService } from '../services/soundService';

interface PetCompanionWidgetProps {
  skin: PetSkin;
  currentGems: number;
  onOpenWardrobe: () => void;
}

export const PetCompanionWidget: React.FC<PetCompanionWidgetProps> = ({
  skin,
  currentGems,
  onOpenWardrobe
}) => {
  const [bounceCount, setBounceCount] = useState(0);

  const handlePetTap = () => {
    soundService.playPop();
    setBounceCount(prev => prev + 1);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
        borderRadius: 20,
        padding: '14px 16px',
        margin: '14px 0',
        border: '1.5px solid #BAE6FD',
        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background nautical aura pattern */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: `${skin.themeColor}12`,
          pointerEvents: 'none'
        }}
      />

      {/* Interactive Mascot Avatar */}
      <div
        onClick={handlePetTap}
        key={bounceCount}
        style={{
          flexShrink: 0,
          cursor: 'pointer',
          animation: bounceCount > 0 ? 'petBounce 0.45s ease' : undefined
        }}
        title="Nhấn để tương tác với Dio"
      >
        <PetMascot skin={skin} size={76} isAnimated={true} />
      </div>

      {/* Speech & Status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0F172A' }}>
              Dio Thủy Thủ
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 8,
                background: `${skin.themeColor}18`,
                color: skin.themeColor
              }}
            >
              {skin.name}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.76rem', color: '#334155', lineHeight: 1.35, fontStyle: 'italic', marginBottom: 8 }}>
          "{skin.quote}"
        </div>

        {/* Change skin button */}
        <button
          onClick={onOpenWardrobe}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #BAE6FD',
            borderRadius: 12,
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#0284C7',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
          }}
        >
          <Sticker3D name="sparkles" size={14} />
          <span>Tủ đồ Skin ({currentGems} 💎) ❯</span>
        </button>
      </div>
    </div>
  );
};
