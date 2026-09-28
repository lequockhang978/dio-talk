import { useState } from 'react';
import { Anchor, ArrowRight, Check, Compass, Wrench } from 'lucide-react';
import { Sticker3D } from './Sticker3D';
import { Button3D } from './common/Button3D';
import { soundService } from '../services/soundService';

type Department = 'engine' | 'deck';

interface OnboardingScreenProps {
  onFinish: (setup: { department: Department; rank: string; dailyGoal: number }) => void;
}

const RANKS: Record<Department, string[]> = {
  engine: ['Học viên / Wiper', 'Thợ máy (Motorman)', 'Sĩ quan máy (3rd Engineer)', 'Máy trưởng'],
  deck: ['Học viên / OS', 'Thủy thủ lái (AB)', 'Sĩ quan boong (3rd Officer)', 'Thuyền trưởng']
};

export const OnboardingScreen = ({ onFinish }: OnboardingScreenProps) => {
  const [step, setStep] = useState(0);
  const [department, setDepartment] = useState<Department>('engine');
  const [rank, setRank] = useState(RANKS.engine[1]);
  const [dailyGoal, setDailyGoal] = useState(10);
  const steps = ['Chọn hải trình', 'Chọn cấp bậc', 'Đặt ca học', 'Sẵn sàng ra khơi'];

  const chooseDepartment = (next: Department) => {
    soundService.playPop();
    setDepartment(next);
    setRank(RANKS[next][1]);
  };

  const chooseRank = (r: string) => {
    soundService.playPop();
    setRank(r);
  };

  const chooseDailyGoal = (g: number) => {
    soundService.playPop();
    setDailyGoal(g);
  };

  const next = () => {
    if (step === 3) {
      soundService.playCorrect();
      onFinish({ department, rank, dailyGoal });
    } else {
      soundService.playClick();
      setStep(current => current + 1);
    }
  };

  return (
    <main className="dio-onboarding-container" aria-labelledby="onboarding-title">
      <header className="dio-onboarding-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sticker3D name="ship" size={28} />
          <strong style={{ color: 'var(--dt-navy)', fontSize: '1.1rem' }}>Dio Talk</strong>
        </div>
        <span style={{ color: 'var(--text-sub)', fontSize: '.74rem', fontWeight: 800 }}>{step + 1}/{steps.length}</span>
      </header>

      <section className="dio-onboarding-content" style={{ justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 28 }} aria-label={`Bước ${step + 1} trên ${steps.length}`}>
            {steps.map((label, index) => (
              <span
                key={label}
                style={{
                  background: index <= step ? 'var(--dt-aqua)' : '#d9e7e8',
                  borderRadius: 99,
                  flex: 1,
                  height: 7,
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>

          {step === 0 && (
            <>
              <div className="dio-onboarding-hero-card" style={{ background: 'linear-gradient(135deg, #103b52, #087e8b)' }}>
                <Anchor size={58} color="white" />
              </div>
              <h1 id="onboarding-title" className="dio-onboarding-title">Bạn đang trực ban nào?</h1>
              <p className="dio-onboarding-desc">Dio Talk xếp bài học theo đúng môi trường công việc của bạn.</p>
              <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
                {([
                  { id: 'engine', title: 'Ban Máy', text: 'Engine room, maintenance, safety', icon: <Wrench size={24} /> },
                  { id: 'deck', title: 'Ban Boong', text: 'Navigation, VHF, cargo operation', icon: <Compass size={24} /> }
                ] as const).map(item => {
                  const isSel = department === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => chooseDepartment(item.id)}
                      className={`duo-choice-card ${isSel ? 'is-selected' : ''}`}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {item.icon}
                        <span>
                          <strong style={{ display: 'block' }}>{item.title}</strong>
                          <small style={{ color: isSel ? 'var(--dt-aqua)' : 'var(--text-sub)' }}>{item.text}</small>
                        </span>
                      </span>
                      {isSel && <Check color="var(--dt-aqua)" size={20} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="dio-onboarding-hero-card" style={{ background: 'linear-gradient(135deg, #ff7b54, #ffad5c)' }}>
                <Sticker3D name="anchor" size={66} />
              </div>
              <h1 id="onboarding-title" className="dio-onboarding-title">Cấp bậc hiện tại?</h1>
              <p className="dio-onboarding-desc">Để mở đúng tuyến từ vựng STCW. Có thể đổi sau.</p>
              <div style={{ display: 'grid', gap: 10, marginTop: 22 }}>
                {RANKS[department].map(item => {
                  const isSel = rank === item;
                  return (
                    <button
                      key={item}
                      onClick={() => chooseRank(item)}
                      className={`duo-choice-card ${isSel ? 'is-selected' : ''}`}
                    >
                      <span>{item}</span>
                      {isSel && <Check color="var(--dt-aqua)" size={20} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="dio-onboarding-hero-card" style={{ background: 'linear-gradient(135deg, #102a43, #315e7f)' }}>
                <span style={{ color: 'white', fontSize: '3rem', fontWeight: 900 }}>{dailyGoal}</span>
              </div>
              <h1 id="onboarding-title" className="dio-onboarding-title">Ca học mỗi ngày?</h1>
              <p className="dio-onboarding-desc">Nhỏ nhưng đều. Bạn luôn có thể đổi mục tiêu.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 22 }}>
                {[5, 10, 25].map(goal => {
                  const isSel = dailyGoal === goal;
                  return (
                    <button
                      key={goal}
                      onClick={() => chooseDailyGoal(goal)}
                      className={`duo-choice-card ${isSel ? 'is-selected' : ''}`}
                      style={{ justifyContent: 'center' }}
                    >
                      {goal} câu
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="dio-onboarding-hero-card" style={{ background: 'linear-gradient(135deg, #087e8b, #2bbbad)' }}>
                <Sticker3D name="ship" size={72} />
              </div>
              <h1 id="onboarding-title" className="dio-onboarding-title">Sẵn sàng ra khơi.</h1>
              <p className="dio-onboarding-desc">
                Tuyến <strong>{department === 'engine' ? 'Ban Máy' : 'Ban Boong'}</strong> · {rank}
                <br />
                Mục tiêu hôm nay: <strong>{dailyGoal} câu</strong>.
              </p>
            </>
          )}
        </div>
      </section>

      <footer className="dio-onboarding-bottom">
        <Button3D
          variant="marine"
          size="lg"
          fullWidth
          onClick={next}
          rightIcon={<ArrowRight size={20} />}
        >
          {step === 3 ? 'BẮT ĐẦU LESSON ĐẦU' : 'TIẾP TỤC'}
        </Button3D>
      </footer>
    </main>
  );
};
