import React, { useState } from 'react';
import { X, Check, Lock, Sparkles } from 'lucide-react';
import { PET_SKINS, type PetSkin } from '../data/petSkins';
import { PetMascot } from './PetMascot';
import { Sticker3D } from './Sticker3D';
import { soundService } from '../services/soundService';

interface PetWardrobeModalProps {
  currentGems: number;
  activeSkinId: string;
  unlockedSkinIds: string[];
  onClose: () => void;
  onEquipSkin: (skinId: string) => void;
  onBuySkin: (skin: PetSkin) => void;
}

export const PetWardrobeModal: React.FC<PetWardrobeModalProps> = ({
  currentGems,
  activeSkinId,
  unlockedSkinIds,
  onClose,
  onEquipSkin,
  onBuySkin
}) => {
  const [selectedPreviewSkinId, setSelectedPreviewSkinId] = useState<string>(activeSkinId);

  const previewSkin = PET_SKINS.find(s => s.id === selectedPreviewSkinId) || PET_SKINS[0];
  const isSelectedUnlocked = unlockedSkinIds.includes(previewSkin.id);
  const isSelectedEquipped = previewSkin.id === activeSkinId;
  const canAffordSelected = currentGems >= previewSkin.price;

  const handleSelectSkin = (skin: PetSkin) => {
    soundService.playClick();
    setSelectedPreviewSkinId(skin.id);
  };

  const handleAction = () => {
    if (isSelectedEquipped) return;

    if (isSelectedUnlocked) {
      soundService.playCorrect();
      onEquipSkin(previewSkin.id);
    } else {
      if (canAffordSelected) {
        soundService.playCelebrationFanfare();
        onBuySkin(previewSkin);
      } else {
        soundService.playWrong();
      }
    }
  };

  return (
    <div
      className="streak-celebration-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ zIndex: 9999 }}
    >
      <div
        className="streak-celebration-dialog"
        style={{
          maxWidth: 440,
          maxHeight: '92vh',
          overflowY: 'auto',
          textAlign: 'left',
          padding: 0,
          borderRadius: 24,
          background: '#FFFFFF'
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            padding: '16px 20px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="#FBBF24" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF' }}>
                Tủ Đồ Thú Cưng Dio
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Dùng 💎 Đá quý đổi trang phục hàng hải</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Gem Balance Chip */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '4px 10px',
                borderRadius: 20,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Sticker3D name="gem" size={18} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#60A5FA' }}>
                {currentGems}
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                width: 32,
                height: 32,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#CBD5E1'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* LIVE PET PREVIEW SHOWCASE STAGE */}
        <div
          style={{
            background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '20px 16px 14px 16px',
            textAlign: 'center',
            position: 'relative',
            borderBottom: '1px solid #BAE6FD'
          }}
        >
          {/* Pet Mascot */}
          <PetMascot skin={previewSkin} size={135} />

          {/* Speech Bubble */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '10px 14px',
              maxWidth: 340,
              margin: '10px auto 0 auto',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.12)',
              border: '1.5px solid #BAE6FD',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: previewSkin.themeColor, textTransform: 'uppercase', marginBottom: 2 }}>
              {previewSkin.roleTitle}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', fontStyle: 'italic', lineHeight: 1.35 }}>
              "{previewSkin.quote}"
            </div>
          </div>
        </div>

        {/* SKIN LIST / WARDROBE RACK */}
        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>
            Bộ Sưu Tập Skin ({PET_SKINS.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PET_SKINS.map((skin) => {
              const isUnlocked = unlockedSkinIds.includes(skin.id);
              const isEquipped = activeSkinId === skin.id;
              const isSelected = selectedPreviewSkinId === skin.id;
              const canAfford = currentGems >= skin.price;

              return (
                <div
                  key={skin.id}
                  onClick={() => handleSelectSkin(skin)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 16,
                    border: isSelected
                      ? `2px solid ${skin.themeColor}`
                      : '1.5px solid #E2E8F0',
                    background: isSelected ? '#F8FAFC' : '#FFFFFF',
                    boxShadow: isSelected
                      ? `0 4px 12px ${skin.themeColor}22`
                      : '0 2px 4px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Mini Preview Avatar */}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    <PetMascot skin={skin} size={46} isAnimated={false} />
                    {isEquipped && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: -3,
                          right: -3,
                          background: '#16A34A',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid white'
                        }}
                      >
                        <Check size={11} color="white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                        {skin.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: 6,
                          background: `${skin.themeColor}18`,
                          color: skin.themeColor
                        }}
                      >
                        {skin.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {skin.description}
                    </div>
                  </div>

                  {/* Status / Price */}
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    {isEquipped ? (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16A34A' }}>
                        ĐANG MẶC
                      </span>
                    ) : isUnlocked ? (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563EB' }}>
                        ĐÃ MỞ
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Sticker3D name="gem" size={16} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: canAfford ? '#2563EB' : '#94A3B8' }}>
                          {skin.price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <div style={{ padding: '0 16px 16px 16px' }}>
          <button
            onClick={handleAction}
            disabled={isSelectedEquipped || (!isSelectedUnlocked && !canAffordSelected)}
            className="streak-claim-btn"
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: '0.95rem',
              borderRadius: 16,
              background: isSelectedEquipped
                ? '#E2E8F0'
                : isSelectedUnlocked
                  ? 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)'
                  : canAffordSelected
                    ? 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)'
                    : '#CBD5E1',
              boxShadow: isSelectedEquipped || (!isSelectedUnlocked && !canAffordSelected)
                ? 'none'
                : isSelectedUnlocked
                  ? '0 4px 0 #1E40AF'
                  : '0 4px 0 #B45309',
              color: isSelectedEquipped || (!isSelectedUnlocked && !canAffordSelected)
                ? '#94A3B8'
                : '#FFFFFF',
              cursor: isSelectedEquipped || (!isSelectedUnlocked && !canAffordSelected)
                ? 'not-allowed'
                : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            {isSelectedEquipped ? (
              <>
                <Check size={18} />
                <span>ĐANG TRANG BỊ SKIN NÀY</span>
              </>
            ) : isSelectedUnlocked ? (
              <>
                <Sparkles size={18} />
                <span>MẶC TRANG PHỤC NÀY</span>
              </>
            ) : canAffordSelected ? (
              <>
                <Sticker3D name="gem" size={20} />
                <span>MỞ KHÓA BẰNG {previewSkin.price} 💎</span>
              </>
            ) : (
              <>
                <Lock size={16} />
                <span>CẦN {previewSkin.price} 💎 (THIẾU {previewSkin.price - currentGems} 💎)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
