import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type PetSkin } from '../data/petSkins';
import { PetMascot } from './PetMascot';
import { soundService } from '../services/soundService';
import { BookOpen, Sparkles, X, Moon } from 'lucide-react';

interface PetShimejiPatrolProps {
  skin: PetSkin;
  onStudyClick: () => void;
  onWardrobeClick: () => void;
  currentGems: number;
}

const STUDY_TIPS = [
  { text: 'Thuyền viên ơi, học 1 bài nào! 🌊', action: 'study', actionLabel: 'Học Ngay 📚' },
  { text: 'Chuỗi Streak đang chờ bạn thắp sáng! 🔥', action: 'study', actionLabel: 'Giữ Streak ⚡' },
  { text: 'Đá quý đủ rồi kìa, thử đổi đồ mới chưa? ✨', action: 'wardrobe', actionLabel: 'Mở Tủ Đồ 💎' },
  { text: '10 phút luyện tập mỗi ngày để lên Thuyền Trưởng! ⚓', action: 'study', actionLabel: 'Vào Học 🚢' },
  { text: 'Trí nhớ từ vựng hôm nay đang đạt đỉnh cao đấy! 🧠', action: 'study', actionLabel: 'Ôn Tập 🚀' },
  { text: 'Gió thuận buồm xuôi, Dio đồng hành cùng bạn! 🐧', action: 'study', actionLabel: 'Luyện Nói 🎙️' },
];

export const PetShimejiPatrol: React.FC<PetShimejiPatrolProps> = ({
  skin,
  onStudyClick,
  onWardrobeClick,
  currentGems,
}) => {
  // Bounded coordinates
  const [posX, setPosX] = useState<number>(30);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [state, setState] = useState<'walking' | 'idle' | 'reacting'>('walking');
  const [waddleStep, setWaddleStep] = useState<number>(0);
  const [isAsleep, setIsAsleep] = useState<boolean>(() => {
    return localStorage.getItem('dio_shimeji_asleep') === 'true';
  });
  const [activeSpeech, setActiveSpeech] = useState<{
    text: string;
    action?: string;
    actionLabel?: string;
  } | null>(null);
  const [isJump, setIsJump] = useState<boolean>(false);

  const bubbleTimeoutRef = useRef<number | null>(null);

  // Compute container bounds (centered max 480px or screen width)
  const getBounds = useCallback(() => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 480;
    const containerWidth = Math.min(screenWidth, 480);
    const leftOffset = Math.max(0, (screenWidth - containerWidth) / 2);
    const minX = leftOffset + 12;
    const maxX = leftOffset + containerWidth - 68;
    return { minX, maxX };
  }, []);

  // Show a speech bubble with auto dismiss
  const showBubble = useCallback(
    (speech: { text: string; action?: string; actionLabel?: string }, durationMs = 6000) => {
      setActiveSpeech(speech);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = window.setTimeout(() => {
        setActiveSpeech(null);
      }, durationMs);
    },
    []
  );

  // Toggle sleep/awake
  const toggleSleep = (sleep: boolean) => {
    setIsAsleep(sleep);
    localStorage.setItem('dio_shimeji_asleep', sleep ? 'true' : 'false');
    if (sleep) {
      setActiveSpeech(null);
      soundService.playClick();
    } else {
      soundService.playPop();
      showBubble({ text: 'Dio đã thức dậy! Sẵn sàng tuần tra boong tàu! 🐧', action: 'study', actionLabel: 'Học Ngay 📚' }, 4000);
    }
  };

  // Click on Dio
  const handlePetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.playPop();
    setIsJump(true);
    setTimeout(() => setIsJump(false), 500);

    const randomTip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    showBubble(randomTip, 8000);
  };

  // Periodic random study reminder
  useEffect(() => {
    if (isAsleep) return;

    const tipInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const tip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
        showBubble(tip, 6000);
      }
    }, 28000);

    return () => clearInterval(tipInterval);
  }, [isAsleep, showBubble]);

  // Patrol Walking Engine
  useEffect(() => {
    if (isAsleep) return;

    let currentPos = posX;
    let currentDir = direction;
    let currentState = state;
    let lastWaddleTime = Date.now();
    let lastStateChange = Date.now();
    let walkDuration = 5000 + Math.random() * 4000;
    let idleDuration = 3000 + Math.random() * 2500;

    const interval = setInterval(() => {
      const { minX, maxX } = getBounds();
      const now = Date.now();

      // State transition between walking and idle
      if (currentState === 'walking' && now - lastStateChange > walkDuration) {
        currentState = 'idle';
        setState('idle');
        lastStateChange = now;
        idleDuration = 2500 + Math.random() * 3000;
      } else if (currentState === 'idle' && now - lastStateChange > idleDuration) {
        currentState = 'walking';
        setState('walking');
        lastStateChange = now;
        walkDuration = 4500 + Math.random() * 4000;
        // Occasionally flip direction when resuming walk
        if (Math.random() > 0.6) {
          currentDir = (currentDir * -1) as 1 | -1;
          setDirection(currentDir);
        }
      }

      // If walking, update position
      if (currentState === 'walking') {
        const speed = 0.9;
        currentPos += currentDir * speed;

        // Bounce off walls
        if (currentPos >= maxX) {
          currentPos = maxX;
          currentDir = -1;
          setDirection(-1);
        } else if (currentPos <= minX) {
          currentPos = minX;
          currentDir = 1;
          setDirection(1);
        }
        setPosX(currentPos);

        // Waddle animation step
        if (now - lastWaddleTime > 180) {
          setWaddleStep((prev) => (prev + 1) % 4);
          lastWaddleTime = now;
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isAsleep, getBounds]);

  // If asleep, show mini waking dock pill
  if (isAsleep) {
    return (
      <div
        onClick={() => toggleSleep(false)}
        style={{
          position: 'fixed',
          bottom: 'calc(74px + var(--safe-bottom, 0px))',
          right: 'max(12px, calc((100vw - 480px) / 2 + 12px))',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          color: '#E2E8F0',
          padding: '6px 12px',
          borderRadius: 20,
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          zIndex: 99,
          fontSize: '0.75rem',
          fontWeight: 800,
          userSelect: 'none',
          transition: 'transform 0.15s ease',
        }}
        title="Nhấn để gọi Dio đi tuần tra"
      >
        <span style={{ fontSize: '0.9rem' }}>💤</span>
        <span>Dio đang ngủ (Gọi dậy)</span>
      </div>
    );
  }

  // Waddle oscillation angle
  const waddleAngle =
    state === 'walking' ? (waddleStep === 1 ? 7 : waddleStep === 3 ? -7 : 0) : 0;
  const bounceY = isJump ? -18 : state === 'walking' && (waddleStep === 1 || waddleStep === 3) ? -3 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${posX}px`,
        bottom: 'calc(68px + var(--safe-bottom, 0px))',
        zIndex: 99,
        pointerEvents: 'none', // Allow clicks through container except on interactive elements
        userSelect: 'none',
        transition: 'bottom 0.2s ease',
      }}
    >
      {/* 1. SPEECH BUBBLE (TƯƠNG TÁC & CHỈ HỌC) */}
      {activeSpeech && (
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: direction === 1 ? -20 : -90,
            width: 210,
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '10px 12px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18), 0 2px 6px rgba(2, 132, 199, 0.12)',
            border: `2px solid ${skin.themeColor}`,
            pointerEvents: 'auto',
            animation: 'fadeInUp 0.25s ease',
            zIndex: 100,
          }}
        >
          {/* Close mini bubble */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveSpeech(null);
            }}
            style={{
              position: 'absolute',
              top: 4,
              right: 6,
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: 2,
            }}
          >
            <X size={13} />
          </button>

          {/* Bubble Tail */}
          <div
            style={{
              position: 'absolute',
              bottom: -8,
              left: direction === 1 ? 38 : 120,
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: `8px solid ${skin.themeColor}`,
            }}
          />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 900,
                color: skin.themeColor,
                textTransform: 'uppercase',
                background: `${skin.themeColor}18`,
                padding: '1px 6px',
                borderRadius: 6,
              }}
            >
              Dio • {skin.name}
            </span>
          </div>

          {/* Message Text */}
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.35,
              marginBottom: 8,
            }}
          >
            {activeSpeech.text}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {activeSpeech.action === 'study' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundService.playCorrect();
                  setActiveSpeech(null);
                  onStudyClick();
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 10,
                  padding: '6px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                }}
              >
                <BookOpen size={13} />
                <span>{activeSpeech.actionLabel || 'Học Ngay'}</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundService.playClick();
                  setActiveSpeech(null);
                  onWardrobeClick();
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 10,
                  padding: '6px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)',
                }}
              >
                <Sparkles size={13} />
                <span>Tủ Đồ ({currentGems} 💎)</span>
              </button>
            )}

            {/* Sleep Dio Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSleep(true);
              }}
              title="Cho Dio đi ngủ (ẩn khỏi màn hình)"
              style={{
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              <Moon size={13} />
            </button>
          </div>
        </div>
      )}

      {/* 2. DIO PET CHARACTER (PATROLLING & WADDLING) */}
      <div
        onClick={handlePetClick}
        style={{
          width: 56,
          height: 56,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transform: `scaleX(${direction}) translateY(${bounceY}px) rotate(${waddleAngle}deg)`,
          transformOrigin: 'bottom center',
          transition: isJump
            ? 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            : 'transform 0.12s linear',
          filter: 'drop-shadow(0 4px 8px rgba(15, 23, 42, 0.22))',
        }}
        title="Nhấn vào Dio để tương tác và nhận nhắc nhở học tập"
      >
        <PetMascot skin={skin} size={54} isAnimated={false} />

        {/* Small interaction beacon pulse if idle */}
        {state === 'idle' && !activeSpeech && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 2,
              background: '#F59E0B',
              color: 'white',
              borderRadius: '50%',
              width: 14,
              height: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.55rem',
              fontWeight: 900,
              boxShadow: '0 0 6px #F59E0B',
              animation: 'pulse 1.8s infinite',
            }}
          >
            !
          </div>
        )}
      </div>
    </div>
  );
};
