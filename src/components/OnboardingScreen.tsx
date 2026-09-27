import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Compass, Radio, Bot, ShieldCheck, Sparkles, Mic, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { Sticker3D } from '../components/Sticker3D';

interface OnboardingScreenProps {
  onFinish: () => void;
}

interface SlideItem {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  accentColor: string;
}

const ONBOARDING_SLIDES: SlideItem[] = [
  {
    id: 1,
    badge: 'CHUẨN QUỐC TẾ IMO & STCW',
    title: 'Tiếng Anh Hàng Hải Chuyên Sâu',
    highlight: 'Hơn 500+ thuật ngữ',
    description: 'Bao quát toàn diện ngành máy tàu & boong lái. Học theo phương pháp Active Recall thẻ lật 3D ghi nhớ sâu.',
    icon: <Compass size={56} color="#FFFFFF" strokeWidth={2.2} />,
    bgGradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    accentColor: '#2563EB'
  },
  {
    id: 2,
    badge: 'MÔ PHỎNG THỰC TẾ 100%',
    title: 'Đài Thoại VHF & Khẩn Cấp SOLAS',
    highlight: '8 Mẫu Chuẩn SMCP',
    description: 'Thực hành đàm thoại buồng lái với nút PTT, quy trình ứng phó cháy nổ buồng máy và cứu sinh chân thực.',
    icon: <Radio size={56} color="#FFFFFF" strokeWidth={2.2} />,
    bgGradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
    accentColor: '#0D9488'
  },
  {
    id: 3,
    badge: 'TRỢ LÝ AI 24/7',
    title: 'Luyện Nói Phản Xạ 1-1 Với AI',
    highlight: 'Chấm Điểm Chuẩn Giọng',
    description: 'Tương tác trực tiếp với Thuyền trưởng & Máy trưởng AI. Nhận phản hồi độ chính xác ngữ âm tức thì.',
    icon: <Bot size={56} color="#FFFFFF" strokeWidth={2.2} />,
    bgGradient: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
    accentColor: '#4F46E5'
  },
  {
    id: 4,
    badge: 'QUYỀN BẮT BUỘC ĐỂ TRẢI NGHIỆM',
    title: 'Kích Hoạt Quyền Ứng Dụng',
    highlight: 'Yêu cầu để học nói & nhận thông báo',
    description: 'Ứng dụng cần quyền Micro để chấm điểm phát âm thực tế và quyền Thông báo để duy trì ngọn lửa Streak mỗi ngày.',
    icon: <ShieldCheck size={56} color="#FFFFFF" strokeWidth={2.2} />,
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
    accentColor: '#0284C7'
  }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  // Mandatory Permission States
  const [micGranted, setMicGranted] = useState<boolean>(() => {
    return localStorage.getItem('dio_permission_mic') === 'granted';
  });
  const [notifGranted, setNotifGranted] = useState<boolean>(() => {
    return localStorage.getItem('dio_permission_notif') === 'granted';
  });
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRequestingMic, setIsRequestingMic] = useState<boolean>(false);
  const [isRequestingNotif, setIsRequestingNotif] = useState<boolean>(false);

  // Check initial permissions if browser supports Query API
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((res) => {
        if (res.state === 'granted') {
          setMicGranted(true);
          localStorage.setItem('dio_permission_mic', 'granted');
        }
      }).catch(() => {});

      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          setNotifGranted(true);
          localStorage.setItem('dio_permission_notif', 'granted');
        }
      }
    }
  }, []);

  const requestMicrophone = async () => {
    setIsRequestingMic(true);
    setPermissionError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setMicGranted(true);
        localStorage.setItem('dio_permission_mic', 'granted');
      } else {
        setPermissionError('Thiết bị chưa hỗ trợ yêu cầu quyền Micro trực tiếp. Hãy mở phần Cài đặt ứng dụng để cấp quyền Microphone.');
      }
    } catch (err: any) {
      console.warn('Microphone permission error:', err);
      // Even if user blocks on browser, give clear guidance or allow retry
      setPermissionError('Vui lòng bấm "Cho phép" (Allow) khi trình duyệt/điện thoại hiện thông báo cấp quyền Micro.');
    } finally {
      setIsRequestingMic(false);
    }
  };

  const requestNotification = async () => {
    setIsRequestingNotif(true);
    setPermissionError(null);
    try {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setNotifGranted(true);
          localStorage.setItem('dio_permission_notif', 'granted');
        } else {
          setPermissionError('Vui lòng cho phép quyền Thông báo để không bị gián đoạn chuỗi ngày học Streak.');
        }
      } else {
        setPermissionError('Thiết bị chưa hỗ trợ thông báo trình duyệt. Bạn vẫn có thể bật nhắc học trong Cài đặt hệ thống sau.');
      }
    } catch (err: any) {
      console.warn('Notification permission error:', err);
      setPermissionError('Không thể yêu cầu quyền Thông báo. Bạn vẫn có thể tiếp tục học và bật lại trong Cài đặt hệ thống.');
    } finally {
      setIsRequestingNotif(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;

    if (diff > 45 && currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else if (diff < -45 && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      if (!micGranted) {
        setPermissionError('Bạn cần cấp quyền Microphone để kích hoạt học nói và luyện phát âm.');
        return;
      }
      onFinish();
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const isLastSlide = currentSlide === ONBOARDING_SLIDES.length - 1;
  const allPermissionsReady = micGranted;

  return (
    <div 
      className="dio-onboarding-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header: Logo & Skip Button */}
      <div className="dio-onboarding-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sticker3D name="ship" size={24} />
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', letterSpacing: '0.5px' }}>
            Dio Talk
          </span>
        </div>

        {!isLastSlide ? (
          <button 
            className="dio-onboarding-skip-btn" 
            onClick={() => setCurrentSlide(ONBOARDING_SLIDES.length - 1)}
            title="Đến phần kích hoạt quyền"
          >
            Bỏ qua
          </button>
        ) : (
          <div style={{ width: 60 }} />
        )}
      </div>

      {/* Main Slide Card Area */}
      <div className="dio-onboarding-content">
        {currentSlide !== 3 ? (
          <>
            <div 
              className="dio-onboarding-hero-card"
              style={{ background: slide.bgGradient }}
            >
              <div className="dio-onboarding-icon-wrap">
                {slide.icon}
              </div>
              <div className="dio-onboarding-card-tag">
                <Sparkles size={12} />
                <span>{slide.badge}</span>
              </div>
            </div>

            {/* Text Presentation */}
            <div className="dio-onboarding-text-wrap">
              <h2 className="dio-onboarding-title">{slide.title}</h2>
              <div className="dio-onboarding-highlight" style={{ color: slide.accentColor }}>
                {slide.highlight}
              </div>
              <p className="dio-onboarding-desc">{slide.description}</p>
            </div>
          </>
        ) : (
          /* Slide 4: Mandatory Permissions Verification Step */
          <div className="dio-onboarding-permissions-box" style={{ width: '100%', maxWidth: 350, textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ display: 'inline-flex', padding: 12, borderRadius: 20, background: '#EFF6FF', marginBottom: 10 }}>
                <Sticker3D name="security-shield" size={44} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0' }}>
                Cấp Quyền Để Sử Dụng App
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                Bắt buộc cho phép 2 quyền sau để bắt đầu học tập:
              </p>
            </div>

            {permissionError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '10px 12px', marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: '0.74rem', color: '#991B1B', lineHeight: 1.4, fontWeight: 600 }}>
                  {permissionError}
                </span>
              </div>
            )}

            {/* Permission 1: Microphone */}
            <div style={{
              background: '#FFFFFF',
              border: `1.5px solid ${micGranted ? '#86EFAC' : '#CBD5E1'}`,
              borderRadius: 16,
              padding: 14,
              marginBottom: 12,
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: micGranted ? '#DCFCE7' : '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: micGranted ? '#16A34A' : '#2563EB',
                    flexShrink: 0
                  }}>
                    <Mic size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                      1. Microphone (Ghi âm)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>
                      Thu âm giọng nói, chấm điểm phát âm chuẩn STCW & phản xạ đàm thoại AI.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                {micGranted ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#16A34A', fontSize: '0.75rem', fontWeight: 800 }}>
                    <CheckCircle2 size={16} />
                    <span>ĐÃ CẤP QUYỀN</span>
                  </div>
                ) : (
                  <button
                    onClick={requestMicrophone}
                    disabled={isRequestingMic}
                    style={{
                      background: '#2563EB',
                      color: '#FFF',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: 10,
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 3px 8px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {isRequestingMic ? 'Đang xác nhận...' : 'Cho phép Micro'}
                  </button>
                )}
              </div>
            </div>

            {/* Permission 2: Notifications */}
            <div style={{
              background: '#FFFFFF',
              border: `1.5px solid ${notifGranted ? '#86EFAC' : '#CBD5E1'}`,
              borderRadius: 16,
              padding: 14,
              marginBottom: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: notifGranted ? '#DCFCE7' : '#FFF7ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: notifGranted ? '#16A34A' : '#EA580C',
                    flexShrink: 0
                  }}>
                    <Bell size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                      2. Thông Báo (Notifications)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2, lineHeight: 1.4 }}>
                      Nhắc giữ chuỗi ngày học (Streak 25 câu), cập nhật từ mới & thông báo sự kiện.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                {notifGranted ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#16A34A', fontSize: '0.75rem', fontWeight: 800 }}>
                    <CheckCircle2 size={16} />
                    <span>ĐÃ CẤP QUYỀN</span>
                  </div>
                ) : (
                  <button
                    onClick={requestNotification}
                    disabled={isRequestingNotif}
                    style={{
                      background: '#EA580C',
                      color: '#FFF',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: 10,
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 3px 8px rgba(234, 88, 12, 0.3)'
                    }}
                  >
                    {isRequestingNotif ? 'Đang xác nhận...' : 'Cho phép Thông báo'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Indicators & Action Button */}
      <div className="dio-onboarding-bottom">
        {/* Page Indicator Dots */}
        <div className="dio-onboarding-dots">
          {ONBOARDING_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              className={`dio-onboarding-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              title={`Trang ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button 
          className="study-action-btn primary dio-onboarding-action-btn"
          onClick={handleNext}
          style={{
            background: isLastSlide 
              ? (allPermissionsReady ? '#16A34A' : '#64748B') 
              : undefined,
            cursor: isLastSlide && !allPermissionsReady ? 'not-allowed' : 'pointer'
          }}
        >
          <span>
            {isLastSlide 
              ? (allPermissionsReady ? 'Bắt đầu sử dụng ngay 🚀' : 'Vui lòng cấp quyền Micro để tiếp tục')
              : 'Tiếp theo'}
          </span>
          {isLastSlide ? <ShieldCheck size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
};

