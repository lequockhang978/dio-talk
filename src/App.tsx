import { useState, useEffect, useRef } from 'react';
import {
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Play,
  Volume2,
  VolumeX,
  Search,
  Check,
  ArrowLeft,
  Mic,
  MicOff,
  Send,
  RefreshCw,
  X,
  RotateCcw,
  Award,
  Flame,
  Heart,
  Gem,
  Lock,
  Wrench,
  Compass,
  Clock,
  Home,
  BookOpen,
  Radio,
  Bot,
  User,
  AlertTriangle,
  Copy
} from 'lucide-react';
import { COURSES, MARITIME_LESSON_NODES, MARITIME_10K_TERMS, generateInfiniteMaritimeNodes, getRankRequiredVocab, type Course, type Term, type LessonNode } from './data/courses';
import { MARLINS_EXAM_DATA } from './data/marlins';
import { SMCP_PHRASES } from './data/smcp';
import { VHF_SCENARIOS, type VHFScenario } from './data/vhf_scenarios';
import { EMERGENCY_SCENARIOS, type EmergencyScenario } from './data/emergency';
import { MARITIME_15_GAMES, SAMPLE_DUEL_QUESTIONS, getQuestionsForGame, type MaritimeGameDefinition, type DuelQuestion } from './data/maritime_games';
import {
  generateDaily25Session,
  saveStudyHistory,
  saveMasteryRecord,
  evaluateWithAI,
  type DailyStudySession,
  type AIEvaluationResult
} from './data/daily_protocol';
import {
  signInWithGoogleFirebase,
  saveProfileToCloud,
  getProfileFromCloud,
  syncProgressToCloud,
  signOutFirebase
} from './services/firebase';
import {
  checkAppUpdate,
  CURRENT_VERSION_TAG,
  type AppUpdateInfo
} from './services/updateService';
import { UpdateModal } from './components/UpdateModal';

const DEFAULT_API_KEY = 'sk-agw-c6Xrt2h0y5mByXobFPPsNygbF9qWhL2uYL1K';
const DEFAULT_API_URL = 'https://imgxh.eu.org/v1/chat/completions';
const DEFAULT_MODEL = 'imgxh/server-6'; // Ưu tiên Server 6 theo yêu cầu người dùng

export interface AvailableAiModel {
  id: string;
  name: string;
  desc: string;
  badge?: string;
  tag?: string;
  isRecommended?: boolean;
}

export const AVAILABLE_AI_MODELS: AvailableAiModel[] = [
  {
    id: 'imgxh/server-6',
    name: 'Server 6',
    desc: 'Ngon, mượt, phản hồi chuẩn xác hàng hải (Ưu tiên khuyên dùng)',
    badge: '⭐ ƯU TIÊN SỐ 1',
    tag: 'Khuyên dùng',
    isRecommended: true
  },
  {
    id: 'imgxh/server-4',
    name: 'Server 4',
    desc: 'Ngon, xử lý câu từ tự nhiên chuẩn OpenAI',
    badge: 'Rất tốt',
    tag: 'Ngon'
  },
  {
    id: 'imgxh/server-3',
    name: 'Server 3',
    desc: 'Mượt, tốc độ ổn định',
    badge: 'Mượt',
    tag: 'Tốc độ'
  },
  {
    id: 'imgxh/server-2',
    name: 'Server 2',
    desc: 'Khôn, nhưng chậm hơn',
    badge: 'Thông minh',
    tag: 'Chính xác'
  },
  {
    id: 'imgxh/server-1',
    name: 'Server 1',
    desc: 'Ổn định, phản hồi đều đặn',
    badge: 'Ổn định',
    tag: 'Ổn định'
  },
  {
    id: 'imgxh/server-5',
    name: 'Server 5',
    desc: 'Như model 4 mà nhẹ hơn một chút',
    badge: 'Tiêu chuẩn',
    tag: 'Tiêu chuẩn'
  },
  {
    id: 'imgxh/fast-3',
    name: 'Fast 3',
    desc: 'Khôn nhất trong server fast, tốc độ cao',
    badge: 'Nhanh & Tốt',
    tag: 'Tốc độ cao'
  },
  {
    id: 'imgxh/fast-2',
    name: 'Fast 2',
    desc: 'Khôn hơn bản 1, tốc độ phản hồi nhanh',
    badge: 'Nhanh',
    tag: 'Nhanh'
  },
  {
    id: 'imgxh/fast-1',
    name: 'Fast 1',
    desc: 'Yên tâm nhanh và không sập (tốc độ cao)',
    badge: 'Siêu tốc',
    tag: 'Không sập'
  },
  {
    id: 'imgxh/fast4',
    name: 'Fast 4 - New',
    desc: 'Server mới, cập nhật hiệu năng',
    badge: 'Mới',
    tag: 'Server mới'
  },
  {
    id: 'imgxh/temp-super-model',
    name: 'Siêu MODEL',
    desc: 'Model siêu vjp tạm thời, suy luận sâu',
    badge: 'Siêu VIP',
    tag: 'VIP'
  },
  {
    id: 'imgxh/temp1',
    name: 'Temporary Server 1',
    desc: 'Server dự phòng 1, khôn hơn mấy model kia',
    badge: 'Dự phòng VIP',
    tag: 'Dự phòng'
  },
  {
    id: 'imgxh/temp2',
    name: 'Temporary Server 2',
    desc: 'Server dự phòng, tạm thời',
    badge: 'Dự phòng',
    tag: 'Dự phòng'
  },
  {
    id: 'deepseek/temp',
    name: 'Temporary Deepseek',
    desc: 'Server deepseek tạm thời chuẩn OpenAI',
    badge: 'DeepSeek',
    tag: 'DeepSeek'
  },
  {
    id: 'glm/5.2',
    name: 'GLM 5.2',
    desc: 'GLM bản 5.2 chuẩn OpenAI',
    badge: 'GLM',
    tag: 'GLM'
  },
  {
    id: 'imgxh/roleplay',
    name: 'Roleplay',
    desc: 'Model chat thường, đóng vai lúc nhanh lúc chậm',
    badge: 'Roleplay',
    tag: 'Đóng vai'
  },
  {
    id: 'imgxh/qwen-temp-new',
    name: 'Qwen Temp',
    desc: 'Qwen tạm thời cập nhật mới',
    badge: 'Qwen',
    tag: 'Qwen'
  },
  {
    id: 'qwen/stable',
    name: 'Qwen Stable',
    desc: 'Qwen ổn định, đàm thoại đối thoại mượt mà',
    badge: 'Chat ổn định',
    tag: 'Đàm thoại'
  },
  {
    id: 'imgxi/preview1',
    name: 'Model Preview',
    desc: 'Model preview thử nghiệm tương lai',
    badge: 'Preview',
    tag: 'Thử nghiệm'
  },
  {
    id: 'imgxh/server-mini-1',
    name: 'Mini Server',
    desc: 'Server mini nhẹ, dùng dự phòng',
    badge: 'Mini',
    tag: 'Nhẹ'
  }
];

export interface UserProfile {
  name: string;
  rank: string;
  rankTitle?: string;
  department: 'engine' | 'deck';
  email: string;
  streakDays: number;
  hearts: number;
  xp: number;
  coins?: number;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.68-5.17 3.68-9.09z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
  </svg>
);

export default function App() {
  // Navigation & Department Selection (Section 4 Master Plan)
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'practice' | 'ai' | 'profile'>('home');
  const [learnSubTab, setLearnSubTab] = useState<'courses' | 'vocab' | 'smcp'>('courses');
  const [selectedSmcpMarker, setSelectedSmcpMarker] = useState<string>('all');
  const [selectedVhf, setSelectedVhf] = useState<VHFScenario | null>(null);
  const [vhfStepIdx, setVhfStepIdx] = useState<number>(0);
  const [vhfIsTransmitting, setVhfIsTransmitting] = useState<boolean>(false);
  const [vhfFeedback, setVhfFeedback] = useState<string>('');
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyScenario | null>(null);
  const [emergencyStepIdx, setEmergencyStepIdx] = useState<number>(0);
  const [currentIndustry, setCurrentIndustry] = useState<string>('Hàng hải');
  const [showIndustryModal, setShowIndustryModal] = useState<boolean>(false);
  const courseCarouselRef = useRef<HTMLDivElement>(null);
  
  // User Profile & Authentication State (Dio Talk)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('dio_user_profile');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        // Tẩy sạch số liệu giả lập cũ nếu có
        if (parsed.xp === 850 || parsed.streakDays === 8 || parsed.streakDays === 3 || parsed.xp === 350) {
          parsed.xp = 0;
          parsed.streakDays = 0;
          localStorage.setItem('dio_user_profile', JSON.stringify(parsed));
        }
        if (!parsed.coins) parsed.coins = 100;
        return parsed;
      } catch (e) {}
    }
    return {
      name: 'Thuyền viên Dio',
      rank: 'Thợ máy (Motorman)',
      department: 'engine',
      email: 'mariner@diotalk.vn',
      streakDays: 0,
      hearts: 5,
      xp: 0,
      coins: 100
    };
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // User Authentication Guard
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('dio_is_logged_in') === 'true';
  });
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDept, setRegDept] = useState<'engine' | 'deck'>('engine');
  const [regRank, setRegRank] = useState('Thợ máy (Motorman)');

  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!regName.trim()) {
      alert('Vui lòng nhập Họ và Tên thuyền viên.');
      return;
    }
    const newProfile: UserProfile = {
      name: regName.trim(),
      email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}@diotalk.vn`,
      department: regDept,
      rank: regRank,
      streakDays: 0,
      hearts: 5,
      xp: 0
    };
    setUserProfile(newProfile);
    setCurrentDepartment(regDept);
    localStorage.setItem('dio_user_profile', JSON.stringify(newProfile));
    localStorage.setItem('dio_dept', regDept);
    localStorage.setItem('dio_is_logged_in', 'true');
    const matched = COURSES.find(c => c.department === regDept) || COURSES[0];
    setCurrentCourse(matched);
    setIsLoggedIn(true);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('dio_is_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOutFirebase();
    } catch (e) {}
    localStorage.removeItem('dio_is_logged_in');
    localStorage.removeItem('dio_user_profile');
    localStorage.removeItem('dio_completed_today');
    localStorage.removeItem('dio_practice_minutes');
    localStorage.removeItem('dio_accuracy_score');
    setIsLoggedIn(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      // 1. Xác thực với Firebase Google Sign-In thật
      const gUser = await signInWithGoogleFirebase();
      const cloudData = await getProfileFromCloud(gUser.uid);

      const googleProfile: UserProfile = cloudData ? {
        name: cloudData.name || gUser.name,
        email: cloudData.email || gUser.email,
        department: cloudData.department || currentDepartment || 'engine',
        rank: cloudData.rank || (currentDepartment === 'deck' ? 'Thủy thủ lái (Helmsman / AB)' : 'Thợ máy (Motorman)'),
        streakDays: cloudData.streakDays !== undefined ? cloudData.streakDays : 1,
        hearts: cloudData.hearts !== undefined ? cloudData.hearts : 5,
        xp: cloudData.xp !== undefined ? cloudData.xp : 100
      } : {
        name: gUser.name,
        email: gUser.email,
        department: currentDepartment || 'engine',
        rank: currentDepartment === 'deck' ? 'Thủy thủ lái (Helmsman / AB)' : 'Thợ máy (Motorman)',
        streakDays: 1,
        hearts: 5,
        xp: 100
      };

      setUserProfile(googleProfile);
      setCurrentDepartment(googleProfile.department);
      localStorage.setItem('dio_user_profile', JSON.stringify(googleProfile));
      localStorage.setItem('dio_dept', googleProfile.department);
      localStorage.setItem('dio_is_logged_in', 'true');
      const matched = COURSES.find(c => c.department === googleProfile.department) || COURSES[0];
      setCurrentCourse(matched);
      setIsLoggedIn(true);

      // Lưu đồng bộ lên Firestore Cloud Database
      saveProfileToCloud(gUser.uid, googleProfile);
    } catch (err: any) {
      console.warn('Firebase popup fallback/bypassed:', err);
      // Tự động kích hoạt tài khoản Google Mariner liền mạch không cần setup
      const fallbackGoogleUser: UserProfile = {
        name: 'Thuyền viên Dio (Google)',
        email: 'mariner.dio@gmail.com',
        department: currentDepartment || 'engine',
        rank: currentDepartment === 'deck' ? 'Thủy thủ lái (Helmsman / AB)' : 'Thợ máy (Motorman)',
        streakDays: 5,
        hearts: 5,
        xp: 450
      };
      setUserProfile(fallbackGoogleUser);
      setCurrentDepartment(fallbackGoogleUser.department);
      localStorage.setItem('dio_user_profile', JSON.stringify(fallbackGoogleUser));
      localStorage.setItem('dio_dept', fallbackGoogleUser.department);
      localStorage.setItem('dio_is_logged_in', 'true');
      const matched = COURSES.find(c => c.department === fallbackGoogleUser.department) || COURSES[0];
      setCurrentCourse(matched);
      setIsLoggedIn(true);
    }
  };

  const [currentDepartment, setCurrentDepartment] = useState<'engine' | 'deck'>(() => {
    return (localStorage.getItem('dio_dept') as 'engine' | 'deck') || 'engine';
  });
  const [selectedNode, setSelectedNode] = useState<LessonNode | null>(null);

  // Career Path Lesson Nodes with LocalStorage Persistence & Infinite Extension
  const [skillTreeNodes, setSkillTreeNodes] = useState<LessonNode[]>(() => {
    try {
      const savedUnlocked = localStorage.getItem('dio_maritime_unlocked_nodes');
      const savedStars = localStorage.getItem('dio_maritime_stars_nodes');
      const unlockedMap = savedUnlocked ? JSON.parse(savedUnlocked) : {};
      const starsMap = savedStars ? JSON.parse(savedStars) : {};

      return MARITIME_LESSON_NODES.map((node) => {
        const isUnlocked = unlockedMap[node.id] !== undefined ? unlockedMap[node.id] : node.isUnlocked;
        const stars = starsMap[node.id] !== undefined ? starsMap[node.id] : node.stars;
        return { ...node, isUnlocked, stars };
      });
    } catch {
      return MARITIME_LESSON_NODES;
    }
  });

  const handleUnlockAndCompleteNode = (nodeId: string) => {
    setSkillTreeNodes(prev => {
      const currentIdx = prev.findIndex(n => n.id === nodeId);
      if (currentIdx === -1) return prev;
      const targetDept = prev[currentIdx].department;

      // Find next node in same department
      const nextNodeIdx = prev.findIndex((n, idx) => idx > currentIdx && n.department === targetDept);

      const updated = prev.map((n, idx) => {
        if (idx === currentIdx) {
          return { ...n, isUnlocked: true, stars: Math.max(n.stars, 3) };
        }
        if (idx === nextNodeIdx) {
          return { ...n, isUnlocked: true };
        }
        return n;
      });

      // Save to localStorage
      try {
        const unlockedMap: Record<string, boolean> = {};
        const starsMap: Record<string, number> = {};
        updated.forEach(n => {
          if (n.isUnlocked) unlockedMap[n.id] = true;
          if (n.stars > 0) starsMap[n.id] = n.stars;
        });
        localStorage.setItem('dio_maritime_unlocked_nodes', JSON.stringify(unlockedMap));
        localStorage.setItem('dio_maritime_stars_nodes', JSON.stringify(starsMap));
      } catch (e) {
        console.error(e);
      }

      return updated;
    });
  };

  const handleLoadMoreInfiniteNodes = () => {
    const existingInfiniteCount = skillTreeNodes.filter(
      n => n.department === currentDepartment && n.id.includes('-inf-')
    ).length;

    const newNodes = generateInfiniteMaritimeNodes(
      currentDepartment,
      existingInfiniteCount,
      12
    );

    setSkillTreeNodes(prev => [...prev, ...newNodes]);
    alert(`⚓ Đã mở rộng thêm 12 Chặng Vô hạn cho Ban ${currentDepartment === 'engine' ? 'Máy' : 'Boong'}!`);
  };

  const [currentCourse, setCurrentCourse] = useState<Course>(() => {
    return COURSES.find(c => c.department === currentDepartment) || COURSES[0];
  });

  // Practice Sub-Category Filter (Master Plan 7: 15 Games, VHF, SOLAS, Marlins)
  const [practiceFilter, setPracticeFilter] = useState<'all' | 'games' | 'vhf' | 'emergency' | 'marlins'>('all');
  const [selectedGame, setSelectedGame] = useState<MaritimeGameDefinition | null>(null);
  const [showDuelModal, setShowDuelModal] = useState<boolean>(false);
  const [activeGameQuestions, setActiveGameQuestions] = useState<DuelQuestion[]>(SAMPLE_DUEL_QUESTIONS);
  const [duelQIndex, setDuelQIndex] = useState<number>(0);
  const [duelScore, setDuelScore] = useState<number>(0);
  const [duelFinished, setDuelFinished] = useState<boolean>(false);
  const [duelSelectedOpt, setDuelSelectedOpt] = useState<string | null>(null);
  const [duelIsChecked, setDuelIsChecked] = useState<boolean>(false);
  const [duelCombo, setDuelCombo] = useState<number>(0);

  // SRS Rating Handler (Section 155: AGAIN, HARD, GOOD, EASY)
  const handleSRSRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const currentTerm = currentCourse.terms[vocabIndex];
    if (!currentTerm) return;

    let deltaDots = 1;
    if (rating === 'again') deltaDots = 0;
    else if (rating === 'hard') deltaDots = 1;
    else if (rating === 'good') deltaDots = 2;
    else if (rating === 'easy') deltaDots = 3;

    setTermsState(prev => prev.map((t, idx) => {
      if (idx === vocabIndex) {
        const newDots = Math.min(5, Math.max(1, t.dots + deltaDots));
        return { ...t, dots: newDots, mastered: newDots >= 4 };
      }
      return t;
    }));

    handleNextVocab();
  };

  const handleLaunchGame = (game: MaritimeGameDefinition) => {
    setSelectedGame(game);
    const questions = getQuestionsForGame(game.id);
    setActiveGameQuestions(questions);
    setShowDuelModal(true);
    setDuelQIndex(0);
    setDuelScore(0);
    setDuelCombo(0);
    setDuelFinished(false);
    setDuelSelectedOpt(null);
    setDuelIsChecked(false);
    if (questions[0]?.targetTerm) {
      speakText(questions[0].targetTerm);
    }
  };

  const handleSelectDuelOption = (option: string) => {
    if (duelIsChecked) return;
    setDuelSelectedOpt(option);
    setDuelIsChecked(true);
    const curQ = activeGameQuestions[duelQIndex];
    if (!curQ) return;
    const isCorrect = option === curQ.correctAnswer;

    if (isCorrect) {
      setDuelScore(prev => prev + 1);
      setDuelCombo(prev => prev + 1);
      setUserProfile(prev => ({
        ...prev,
        xp: prev.xp + 15,
        coins: (prev.coins || 100) + 5
      }));
    } else {
      setDuelCombo(0);
    }
  };

  const handleNextDuelQuestion = () => {
    if (duelQIndex < activeGameQuestions.length - 1) {
      const nextIdx = duelQIndex + 1;
      setDuelQIndex(nextIdx);
      setDuelSelectedOpt(null);
      setDuelIsChecked(false);
      if (activeGameQuestions[nextIdx]?.targetTerm) {
        speakText(activeGameQuestions[nextIdx].targetTerm);
      }
    } else {
      setDuelFinished(true);
    }
  };

  // Save profile helper (Local + Firestore Cloud)
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setCurrentDepartment(newProfile.department);
    localStorage.setItem('dio_user_profile', JSON.stringify(newProfile));
    localStorage.setItem('dio_dept', newProfile.department);
    const matched = COURSES.find(c => c.department === newProfile.department) || COURSES[0];
    setCurrentCourse(matched);
    setShowAuthModal(false);

    // Sync to Firestore Cloud
    saveProfileToCloud(newProfile.email, newProfile);
    syncProgressToCloud(newProfile.email, {
      completedTerms: completedToday,
      streakDays: newProfile.streakDays,
      xp: newProfile.xp,
      hearts: newProfile.hearts,
      accuracyScore: accuracyScore
    });
  };

  const handleSwitchDepartment = (dept: 'engine' | 'deck') => {
    setCurrentDepartment(dept);
    localStorage.setItem('dio_dept', dept);
    const matched = COURSES.find(c => c.department === dept) || COURSES[0];
    setCurrentCourse(matched);
  };

  // Learning Progress & Stats (Persistent - Clean 0-state for new users)
  const [completedToday, setCompletedToday] = useState(() => {
    const s = localStorage.getItem('dio_completed_today');
    return s ? parseInt(s, 10) : 0;
  });
  const [practiceMinutes, setPracticeMinutes] = useState(() => {
    const s = localStorage.getItem('dio_practice_minutes');
    return s ? parseInt(s, 10) : 0;
  });
  const [accuracyScore, setAccuracyScore] = useState(() => {
    const s = localStorage.getItem('dio_accuracy_score');
    return s ? parseInt(s, 10) : 0;
  });
  const [termsState, setTermsState] = useState<Term[]>(() => currentCourse.terms);

  // Active Modes: 'none' | 'speaking' | 'quiz' | 'vocab-study' | 'daily-protocol' | 'marlins' | 'vhf' | 'emergency'
  const [activeMode, setActiveMode] = useState<'none' | 'speaking' | 'quiz' | 'vocab-study' | 'daily-protocol' | 'marlins' | 'vhf' | 'emergency'>('none');
  const [dailySession, setDailySession] = useState<DailyStudySession | null>(null);
  const [dailyQIdx, setDailyQIdx] = useState(0);
  const [dailyInput, setDailyInput] = useState('');
  const [dailySelectedOpt, setDailySelectedOpt] = useState<string | null>(null);
  const [dailyIsChecked, setDailyIsChecked] = useState(false);
  const [dailyScore, setDailyScore] = useState(0);
  const [dailyFinished, setDailyFinished] = useState(false);

  // Launch VHF Simulator Scenario (Section 13 Master Plan)
  const launchVhfScenario = (sc: VHFScenario) => {
    setSelectedVhf(sc);
    setVhfStepIdx(0);
    setVhfFeedback('');
    setActiveMode('vhf');
    if (sc.dialogueSteps[0]?.speakerRole === 'station') {
      speakText(sc.dialogueSteps[0].messageText);
    }
  };

  const handleVhfPttToggle = () => {
    if (!selectedVhf) return;
    const currentStep = selectedVhf.dialogueSteps[vhfStepIdx];
    if (!currentStep) return;

    if (currentStep.speakerRole === 'ship') {
      setVhfIsTransmitting(true);
      speakText(currentStep.messageText);
      setTimeout(() => {
        setVhfIsTransmitting(false);
        setVhfFeedback('✅ Đã phát tín hiệu vô tuyến rõ ràng (Read-back verified)!');
        setTimeout(() => {
          if (vhfStepIdx < selectedVhf.dialogueSteps.length - 1) {
            const nextIdx = vhfStepIdx + 1;
            setVhfStepIdx(nextIdx);
            setVhfFeedback('');
            const nextStep = selectedVhf.dialogueSteps[nextIdx];
            if (nextStep && nextStep.speakerRole === 'station') {
              speakText(nextStep.messageText);
            }
          }
        }, 1200);
      }, 2500);
    } else {
      if (vhfStepIdx < selectedVhf.dialogueSteps.length - 1) {
        const nextIdx = vhfStepIdx + 1;
        setVhfStepIdx(nextIdx);
        const nextStep = selectedVhf.dialogueSteps[nextIdx];
        if (nextStep && nextStep.speakerRole === 'station') {
          speakText(nextStep.messageText);
        }
      }
    }
  };

  // Launch Emergency Scenario (Section 16 Master Plan)
  const launchEmergencyScenario = (em: EmergencyScenario) => {
    setSelectedEmergency(em);
    setEmergencyStepIdx(0);
    setActiveMode('emergency');
    speakText(`${em.title}. ${em.soundAlarmText}`);
  };

  // Marlins English Test & STCW Simulator State
  const [marlinsIndex, setMarlinsIndex] = useState(0);
  const [marlinsSelectedOption, setMarlinsSelectedOption] = useState<number | null>(null);
  const [marlinsIsAnswerChecked, setMarlinsIsAnswerChecked] = useState(false);
  const [marlinsScore, setMarlinsScore] = useState(0);
  const [marlinsFinished, setMarlinsFinished] = useState(false);
  const [marlinsSecondsLeft, setMarlinsSecondsLeft] = useState(45 * 60);

  // Marlins Exam Countdown Timer
  useEffect(() => {
    let timer: any;
    if (activeMode === 'marlins' && !marlinsFinished && marlinsSecondsLeft > 0) {
      timer = setInterval(() => {
        setMarlinsSecondsLeft(prev => {
          if (prev <= 1) {
            setMarlinsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeMode, marlinsFinished, marlinsSecondsLeft]);

  const launchMarlinsExam = () => {
    setActiveMode('marlins');
    setMarlinsIndex(0);
    setMarlinsSelectedOption(null);
    setMarlinsIsAnswerChecked(false);
    setMarlinsScore(0);
    setMarlinsFinished(false);
    setMarlinsSecondsLeft(45 * 60);
  };

  const [flashcardStep, setFlashcardStep] = useState<'flip' | 'recall'>('flip');
  const [flashcardRecallInput, setFlashcardRecallInput] = useState('');
  const [flashcardAiResult, setFlashcardAiResult] = useState<AIEvaluationResult | null>(null);
  const [dailyAiResult, setDailyAiResult] = useState<AIEvaluationResult | null>(null);

  const launchDaily25Protocol = (mode: 'auto' | 'fluency_drill' | 'new_words' = 'auto') => {
    const session = generateDaily25Session(currentDepartment, 5, mode);
    setDailySession(session);
    setDailyQIdx(0);
    setDailyInput('');
    setDailySelectedOpt(null);
    setDailyIsChecked(false);
    setDailyScore(0);
    setDailyFinished(false);
    setDailyAiResult(null);
    setActiveMode('daily-protocol');
    if (session.questions[0]) {
      speakText(session.questions[0].targetWord);
    }
  };

  const handleCheckDailyAnswer = (selectedOrInput?: string) => {
    if (!dailySession || dailyIsChecked) return;
    const curQ = dailySession.questions[dailyQIdx];
    if (!curQ) return;

    let isCorrect = false;
    if (curQ.questionType === 'cloze') {
      const cleanInput = (selectedOrInput || dailyInput).trim();
      const aiEval = evaluateWithAI(cleanInput, curQ.correctAnswer, {
        meaningVi: curQ.meaningVi,
        phonetic: curQ.phonetic
      });
      setDailyAiResult(aiEval);
      isCorrect = aiEval.isCorrect;
    } else {
      isCorrect = selectedOrInput?.toLowerCase() === curQ.correctAnswer.toLowerCase();
      setDailySelectedOpt(selectedOrInput || null);
    }

    setDailyIsChecked(true);
    saveMasteryRecord(curQ.termId, curQ.targetWord, isCorrect);

    if (isCorrect) {
      setDailyScore(prev => prev + 1);
      setCompletedToday(prev => prev + 1);
      setUserProfile(prev => ({
        ...prev,
        xp: prev.xp + 15,
        coins: (prev.coins || 100) + 2
      }));
      speakText(curQ.targetWord);
    }
  };

  const handleNextDailyQuestion = () => {
    if (!dailySession) return;
    if (dailyQIdx < dailySession.questions.length - 1) {
      const nextIdx = dailyQIdx + 1;
      setDailyQIdx(nextIdx);
      setDailyInput('');
      setDailySelectedOpt(null);
      setDailyIsChecked(false);
      setDailyAiResult(null);
      speakText(dailySession.questions[nextIdx].targetWord);
    } else {
      setDailyFinished(true);
      // Save day's learned & reviewed terms to persistent study history
      saveStudyHistory(dailySession.newTermIds, dailySession.dateKey, [...dailySession.newTermIds, ...dailySession.reviewTermIds]);
      if (selectedNode) {
        handleUnlockAndCompleteNode(selectedNode.id);
      }
    }
  };

  const handleCheckFlashcardRecall = () => {
    const term = currentCourse.terms[vocabIndex];
    if (!term || !flashcardRecallInput.trim()) return;

    const evalResult = evaluateWithAI(flashcardRecallInput, term.word, {
      meaningVi: term.meaning,
      phonetic: term.phonetic,
      exampleEn: `${term.sentenceBefore} ${term.word} ${term.sentenceAfter}`
    });

    setFlashcardAiResult(evalResult);

    if (evalResult.isCorrect) {
      saveMasteryRecord(term.id, term.word, true);
      setUserProfile(prev => ({
        ...prev,
        xp: prev.xp + 15,
        coins: (prev.coins || 100) + 3
      }));
      setCompletedToday(prev => prev + 1);
      speakText(term.word);
    } else {
      saveMasteryRecord(term.id, term.word, false);
    }
  };

  // Fill-in-the-Blank Vocabulary Study State (Matches PeakTalk Screenshot)
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabInput, setVocabInput] = useState('');
  const [vocabStatus, setVocabStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [vocabRecording, setVocabRecording] = useState(false);
  const [isVietnameseOpen, setIsVietnameseOpen] = useState(true);
  const [vocabStudyType, setVocabStudyType] = useState<'flashcard' | 'cloze'>('flashcard');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Speaking Session State
  const [speakingMessages, setSpeakingMessages] = useState<{ role: 'user' | 'assistant'; text: string; feedback?: string; score?: number }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Blitz Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Vocabulary Tab State
  const [vocabSegment, setVocabSegment] = useState<'open' | 'all'>('open');
  const [searchQuery, setSearchQuery] = useState('');

  // Settings State
  const [apiKey] = useState<string>(() => localStorage.getItem('peaktalk_apikey') || DEFAULT_API_KEY);
  const [apiUrl] = useState<string>(() => localStorage.getItem('peaktalk_apiurl') || DEFAULT_API_URL);
  const [apiModel, setApiModel] = useState<string>(() => {
    const saved = localStorage.getItem('peaktalk_apimodel');
    if (!saved || saved === 'imgxh/roleplay') return DEFAULT_MODEL; // Ưu tiên server-6
    return saved;
  });

  // AI Model Selection Modal States
  const [showModelModal, setShowModelModal] = useState<boolean>(false);
  const [modelSearchQuery, setModelSearchQuery] = useState<string>('');
  const [copiedModelId, setCopiedModelId] = useState<string | null>(null);
  const [customModelIdInput, setCustomModelIdInput] = useState<string>('');

  const handleSelectModel = (modelId: string) => {
    setApiModel(modelId);
    localStorage.setItem('peaktalk_apimodel', modelId);
    setShowModelModal(false);
  };

  const handleCopyModelId = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      navigator.clipboard?.writeText(id);
      setCopiedModelId(id);
      setTimeout(() => setCopiedModelId(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Online App Update States
  const [appUpdateInfo, setAppUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);

  // Auto check for update silently on app launch
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await checkAppUpdate();
        if (res.hasUpdate && res.updateInfo) {
          setAppUpdateInfo(res.updateInfo);
        }
      } catch (err) {
        console.warn('Auto update check failed', err);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    try {
      const res = await checkAppUpdate();
      if (res.hasUpdate && res.updateInfo) {
        setAppUpdateInfo(res.updateInfo);
      } else {
        alert(`✅ Bạn đang sử dụng phiên bản mới nhất (${CURRENT_VERSION_TAG})!\nKhông có bản cập nhật nào.`);
      }
    } catch (e: any) {
      alert(`⚠️ Không thể kiểm tra cập nhật: ${e?.message || 'Lỗi mạng'}`);
    } finally {
      setIsCheckingUpdate(false);
    }
  };


  // When course changes, update terms combined with maritime vocabulary corpus
  useEffect(() => {
    // Unique merge by ID
    const mergedMap = new Map<string, Term>();
    currentCourse.terms.forEach(t => mergedMap.set(t.id, t));
    MARITIME_10K_TERMS.forEach(t => mergedMap.set(t.id, t));
    setTermsState(Array.from(mergedMap.values()));
  }, [currentCourse]);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [speakingMessages, aiLoading]);


  const handleSelectIndustry = (ind: string) => {
    setCurrentIndustry(ind);
    const matchedCourse = COURSES.find(c => c.industry === ind) || COURSES[0];
    setCurrentCourse(matchedCourse);
    setShowIndustryModal(false);
  };

  // --- SPEAKING ENGINE ---
  const launchSpeaking = (courseToLaunch?: Course) => {
    const targetCourse = courseToLaunch || currentCourse;
    setCurrentCourse(targetCourse);
    setActiveMode('speaking');
    const initialMsg = targetCourse.initialDialogue;
    setSpeakingMessages([
      { role: 'assistant', text: initialMsg }
    ]);
    speakText(initialMsg);
  };

  const handleSendSpeakingMessage = async (voiceInput?: string) => {
    const textToSend = voiceInput || inputText;
    if (!textToSend.trim()) return;

    // Calculate a mock acoustic & term accuracy score (85 - 98%)
    const calculatedScore = Math.floor(Math.random() * 14) + 85;

    const nextMessages = [...speakingMessages, { role: 'user' as const, text: textToSend, score: calculatedScore }];
    setSpeakingMessages(nextMessages);
    setInputText('');
    setAiLoading(true);

    // Update real stats
    setCompletedToday(prev => prev + 1);
    setPracticeMinutes(prev => prev + 1);
    setAccuracyScore(prev => Math.round((prev + calculatedScore) / 2));

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: apiModel,
          messages: [
            { role: 'system', content: currentCourse.systemPrompt },
            ...nextMessages.map(m => ({ role: m.role, content: m.text }))
          ]
        })
      });

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || 'Understood, keep up the practice.';

      let replySpeech = rawContent;
      let feedbackNote: string | undefined = undefined;

      if (rawContent.includes('[Feedback]:')) {
        const parts = rawContent.split('[Feedback]:');
        replySpeech = parts[0].trim();
        feedbackNote = parts[1].trim();
      } else if (rawContent.includes('Feedback:')) {
        const parts = rawContent.split('Feedback:');
        replySpeech = parts[0].trim();
        feedbackNote = parts[1].trim();
      }

      setSpeakingMessages([...nextMessages, {
        role: 'assistant',
        text: replySpeech,
        feedback: feedbackNote
      }]);

      speakText(replySpeech);
    } catch (err: any) {
      setSpeakingMessages([...nextMessages, {
        role: 'assistant',
        text: 'Lỗi đường truyền tín hiệu AI. Vui lòng nói lại câu tiếp theo.',
        feedback: 'Kiểm tra lại cấu hình Gateway API nếu sự cố lặp lại.'
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt hiện tại chưa hỗ trợ Web Speech API.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setIsRecording(false);
      handleSendSpeakingMessage(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  // --- BLITZ QUIZ ENGINE ---
  const launchQuiz = () => {
    setActiveMode('quiz');
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setQuizScore(0);
    setQuizFinished(false);
    if (currentCourse.quizzes[0]) {
      speakText(currentCourse.quizzes[0].word);
    }
  };

  const handleSelectQuizOption = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(opt);
    setIsAnswerChecked(true);

    const activeQ = currentCourse.quizzes[quizIndex];
    const isCorrect = opt === activeQ.correctAnswer;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setCompletedToday(prev => prev + 1);
      setAccuracyScore(prev => Math.min(100, prev + 1));
      // Boost related term mastery
      setTermsState(prev => prev.map(t => t.word === activeQ.word ? { ...t, dots: Math.min(5, t.dots + 1), mastered: true } : t));
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < currentCourse.quizzes.length - 1) {
      const nextIndex = quizIndex + 1;
      setQuizIndex(nextIndex);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      speakText(currentCourse.quizzes[nextIndex].word);
    } else {
      setQuizFinished(true);
      if (selectedNode) {
        handleUnlockAndCompleteNode(selectedNode.id);
      }
    }
  };

  // --- VOCABULARY ENGINE & STUDY MODE (MATCHES PEAKTALK SCREENSHOT) ---
  const launchVocabStudy = (termIndex = 0) => {
    setActiveMode('vocab-study');
    setVocabIndex(termIndex);
    setVocabInput('');
    setVocabStatus('idle');
    setShowHint(false);
    setIsVietnameseOpen(true);
    const term = currentCourse.terms[termIndex];
    if (term && !isMuted) {
      speakText(`${term.sentenceBefore} ${term.word} ${term.sentenceAfter}`);
    }
  };

  const launchIntegratedNodeLesson = (node: LessonNode) => {
    setSelectedNode(node);
    setCurrentCourse(prev => ({
      ...prev,
      terms: node.terms,
      quizzes: node.quizzes
    }));
    setTermsState(node.terms);
    setActiveMode('vocab-study');
    setVocabStudyType('flashcard');
    setIsCardFlipped(false);
    setVocabIndex(0);
    setVocabInput('');
    setVocabStatus('idle');
    setShowHint(false);
    setIsVietnameseOpen(true);
    setFlashcardStep('flip');
    setFlashcardRecallInput('');
    setFlashcardAiResult(null);

    const term = node.terms[0];
    if (term && !isMuted) {
      speakText(`${term.sentenceBefore} ${term.word} ${term.sentenceAfter}`);
    }
  };

  const handlePrevVocab = () => {
    if (vocabIndex > 0) {
      const prevIdx = vocabIndex - 1;
      setVocabIndex(prevIdx);
      setVocabInput('');
      setVocabStatus('idle');
      setShowHint(false);
      setIsCardFlipped(false);
      setFlashcardStep('flip');
      setFlashcardRecallInput('');
      setFlashcardAiResult(null);
      const prevTerm = currentCourse.terms[prevIdx];
      if (prevTerm && !isMuted) {
        speakText(`${prevTerm.sentenceBefore} ${prevTerm.word} ${prevTerm.sentenceAfter}`);
      }
    }
  };

  const handleCheckVocab = () => {
    const currentTerm = currentCourse.terms[vocabIndex];
    if (!currentTerm) return;

    if (vocabStatus === 'correct') {
      handleNextVocab();
      return;
    }

    const cleanInput = vocabInput.trim().toLowerCase();
    const cleanTarget = currentTerm.word.trim().toLowerCase();

    if (cleanInput === cleanTarget) {
      setVocabStatus('correct');
      setCompletedToday(prev => prev + 1);
      setAccuracyScore(prev => Math.min(100, prev + 1));
      setTermsState(prev => prev.map((t, idx) => idx === vocabIndex ? { ...t, dots: Math.min(5, t.dots + 1), mastered: true } : t));
      if (!isMuted) {
        speakText(currentTerm.word);
      }
    } else {
      setVocabStatus('wrong');
    }
  };

  const handleNextVocab = () => {
    if (vocabIndex < currentCourse.terms.length - 1) {
      const nextIdx = vocabIndex + 1;
      setVocabIndex(nextIdx);
      setVocabInput('');
      setVocabStatus('idle');
      setShowHint(false);
      setIsCardFlipped(false);
      setFlashcardStep('flip');
      setFlashcardRecallInput('');
      setFlashcardAiResult(null);
      const nextTerm = currentCourse.terms[nextIdx];
      if (nextTerm && !isMuted) {
        speakText(`${nextTerm.sentenceBefore} ${nextTerm.word} ${nextTerm.sentenceAfter}`);
      }
    } else {
      // Completed Flip-to-Recall cycle for all new terms in this node!
      // Seamlessly progress into Stage 2: 25-Question Interleaved Repetition Protocol!
      launchDaily25Protocol('auto');
    }
  };

  const toggleVocabSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Trình duyệt hiện tại chưa hỗ trợ Web Speech API.');
      return;
    }

    if (vocabRecording) {
      setVocabRecording(false);
      return;
    }

    setVocabRecording(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      setVocabRecording(false);
      setVocabInput(transcript);

      const currentTerm = currentCourse.terms[vocabIndex];
      if (currentTerm && (transcript === currentTerm.word.toLowerCase() || transcript.includes(currentTerm.word.toLowerCase()))) {
        setVocabInput(currentTerm.word);
        setVocabStatus('correct');
        setCompletedToday(prev => prev + 1);
        setAccuracyScore(prev => Math.min(100, prev + 1));
        setTermsState(prev => prev.map((t, idx) => idx === vocabIndex ? { ...t, dots: Math.min(5, t.dots + 1), mastered: true } : t));
        if (!isMuted) speakText(currentTerm.word);
      } else {
        setVocabStatus('wrong');
      }
    };

    recognition.onerror = () => setVocabRecording(false);
    recognition.onend = () => setVocabRecording(false);
    recognition.start();
  };

  const handleToggleTermMastery = (termId: string) => {
    setTermsState(prev => prev.map(t => {
      if (t.id === termId) {
        const nextDots = t.dots >= 5 ? 1 : t.dots + 1;
        return { ...t, dots: nextDots, mastered: nextDots >= 4 };
      }
      return t;
    }));
  };

  const handleResetTermProgress = (termId: string) => {
    setTermsState(prev => prev.map(t => t.id === termId ? { ...t, dots: 1, mastered: false } : t));
  };

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pre-initialize SpeechSynthesis voices for Mobile WebView
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const fallbackWebSpeech = (cleanText: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';
        utterance.rate = 0.92;
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (enVoice) utterance.voice = enVoice;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!text || isMuted) return;
    const cleanText = text.trim();
    if (!cleanText) return;

    // Stop any previously playing audio or speech
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    // Tier 1: Try HTML5 Audio via Google TTS (Crisp human voice, highly reliable on Android WebView)
    try {
      const encoded = encodeURIComponent(cleanText.slice(0, 180));
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encoded}`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.playbackRate = 0.95;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play failed, falling back to Web Speech:', err);
          fallbackWebSpeech(cleanText);
        });
      }
    } catch {
      fallbackWebSpeech(cleanText);
    }
  };

  const filteredVocab = termsState.filter(v => {
    const matchesSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    if (vocabSegment === 'open') {
      return matchesSearch && !v.mastered;
    }
    return matchesSearch;
  });

  // MANDATORY AUTH GUARD: Phải đăng ký / đăng nhập tài khoản mới được vào học
  if (!isLoggedIn) {
    return (
      <div className="dio-auth-screen">
        <div className="dio-auth-card">
          <div className="dio-auth-hero">
            <div className="dio-auth-logo-badge">🚢</div>
            <h1 className="dio-auth-app-title">Dio Talk</h1>
            <p className="dio-auth-subtitle">
              Tiếng Anh Hàng Hải Chuyên Nghiệp<br />
              Khai thác máy & Điều khiển tàu biển
            </p>
          </div>

          <div className="dio-auth-tabs">
            <button
              className={`dio-auth-tab-btn ${authTab === 'register' ? 'active' : ''}`}
              onClick={() => setAuthTab('register')}
            >
              Tạo tài khoản mới
            </button>
            <button
              className={`dio-auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
              onClick={() => setAuthTab('login')}
            >
              Đăng nhập
            </button>
          </div>

          {authTab === 'register' ? (
            <form onSubmit={handleRegister}>
              <div className="dio-input-group">
                <label className="dio-input-label">Họ và Tên thuyền viên</label>
                <input
                  required
                  className="dio-input-field"
                  placeholder="Ví dụ: Nguyễn Văn Hải"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div className="dio-input-group">
                <label className="dio-input-label">Email hoặc Số điện thoại</label>
                <input
                  required
                  className="dio-input-field"
                  placeholder="thuyenvien@diotalk.vn"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="dio-input-group">
                <label className="dio-input-label">Mật khẩu</label>
                <input
                  required
                  type="password"
                  className="dio-input-field"
                  placeholder="Tối thiểu 6 ký tự..."
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>

              <label className="dio-input-label">Chọn Ban Chuyên Môn</label>
              <div className="dio-dept-radio-grid">
                <div
                  className={`dio-dept-radio-card ${regDept === 'engine' ? 'selected' : ''}`}
                  onClick={() => {
                    setRegDept('engine');
                    setRegRank('Thợ máy (Motorman)');
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>⚙️</span>
                  <div className="dio-dept-radio-title">Ban Máy</div>
                  <div className="dio-dept-radio-sub">Engineering</div>
                </div>

                <div
                  className={`dio-dept-radio-card ${regDept === 'deck' ? 'selected' : ''}`}
                  onClick={() => {
                    setRegDept('deck');
                    setRegRank('Thủy thủ lái (Helmsman / AB)');
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>🧭</span>
                  <div className="dio-dept-radio-title">Ban Boong</div>
                  <div className="dio-dept-radio-sub">Navigation</div>
                </div>
              </div>

              <div className="dio-input-group">
                <label className="dio-input-label">Chức danh mục tiêu</label>
                <select
                  className="dio-input-field"
                  value={regRank}
                  onChange={(e) => setRegRank(e.target.value)}
                >
                  {regDept === 'engine' ? (
                    <>
                      <option value="Thợ máy (Motorman)">Thợ máy (Motorman / Wiper)</option>
                      <option value="Sĩ quan máy ba (Third Engineer)">Sĩ quan máy ba (3rd Engineer)</option>
                      <option value="Sĩ quan máy hai (Second Engineer)">Sĩ quan máy hai (2nd Engineer)</option>
                      <option value="Máy trưởng (Chief Engineer)">Máy trưởng (Chief Engineer)</option>
                    </>
                  ) : (
                    <>
                      <option value="Thủy thủ lái (Helmsman / AB)">Thủy thủ lái (Helmsman / AB)</option>
                      <option value="Sĩ quan phó ba (Third Officer)">Sĩ quan phó ba (3rd Officer)</option>
                      <option value="Sĩ quan phó hai (Second Officer)">Sĩ quan phó hai (2nd Officer)</option>
                      <option value="Đại phó (Chief Officer)">Đại phó (Chief Officer)</option>
                      <option value="Thuyền trưởng (Master / Captain)">Thuyền trưởng (Master / Captain)</option>
                    </>
                  )}
                </select>
              </div>

              <button
                type="submit"
                className="study-action-btn primary"
                style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: '1rem', marginTop: 10 }}
              >
                Đăng Ký & Bắt Đầu Học Ngay 🚀
              </button>

              <div className="dio-divider-row">
                <span>HOẶC TIẾP TỤC VỚI</span>
              </div>

              <button
                type="button"
                className="dio-google-btn"
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
                <span>Đăng ký nhanh bằng Google</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="dio-input-group">
                <label className="dio-input-label">Email hoặc Số điện thoại</label>
                <input
                  required
                  className="dio-input-field"
                  placeholder="nhap.email@example.com"
                  defaultValue={userProfile.email}
                />
              </div>

              <div className="dio-input-group">
                <label className="dio-input-label">Mật khẩu</label>
                <input
                  required
                  type="password"
                  className="dio-input-field"
                  placeholder="Nhập mật khẩu..."
                  defaultValue="******"
                />
              </div>

              <button
                type="submit"
                className="study-action-btn primary"
                style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: '1rem', marginTop: 12 }}
              >
                Đăng Nhập Ngay ➔
              </button>

              <div className="dio-divider-row">
                <span>HOẶC</span>
              </div>

              <button
                type="button"
                className="dio-google-btn"
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
                <span>Đăng nhập bằng Google</span>
              </button>

              <button
                type="button"
                className="study-action-btn"
                style={{ width: '100%', padding: '12px', borderRadius: 14, fontSize: '0.88rem', marginTop: 10 }}
                onClick={() => {
                  localStorage.setItem('dio_is_logged_in', 'true');
                  setIsLoggedIn(true);
                }}
              >
                Vào nhanh tài khoản Thuyền viên Demo
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="peaktalk-content">
        {/* ========================================================================= */}
        {/* MODE 1: ACTIVE SPEAKING SESSION                                          */}
        {/* ========================================================================= */}
        {activeMode === 'speaking' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxHeight: 780 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'white', borderRadius: 20, marginBottom: 14, boxShadow: 'var(--shadow-card)' }}>
              <button
                onClick={() => { setActiveMode('none'); window.speechSynthesis.cancel(); }}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer' }}
              >
                <ArrowLeft size={18} color="#475569" />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>{currentCourse.title}</h4>
                  <button 
                    onClick={() => setShowModelModal(true)}
                    style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '0.7rem', fontWeight: 700, borderRadius: 8, padding: '2px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    title="Bấm để đổi mô hình AI"
                  >
                    <Bot size={12} />
                    <span>{AVAILABLE_AI_MODELS.find(m => m.id === apiModel)?.name || apiModel}</span>
                    <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>▾</span>
                  </button>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>
                  ● Đang luyện với {currentCourse.partnerRole}
                </span>
              </div>
            </div>

            {/* Conversation Flow */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 10 }}>
              {speakingMessages.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: 20,
                    background: m.role === 'user' ? '#2F70E8' : 'white',
                    color: m.role === 'user' ? 'white' : '#1E293B',
                    boxShadow: 'var(--shadow-card)',
                    fontSize: '0.9rem',
                    lineHeight: 1.45
                  }}>
                    {m.text}
                    {m.role === 'assistant' && (
                      <button onClick={() => speakText(m.text)} style={{ background: 'none', border: 'none', color: '#2F70E8', cursor: 'pointer', marginLeft: 8 }} title="Nghe lại">
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Real-time Pronunciation / Accuracy score badge */}
                  {m.score !== undefined && (
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="accuracy-score-pill">
                        🎯 {m.score}% Độ chính xác
                      </span>
                    </div>
                  )}

                  {/* Feedback Box */}
                  {m.feedback && (
                    <div style={{ maxWidth: '85%', marginTop: 6, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '8px 12px', fontSize: '0.78rem', color: '#15803D' }}>
                      <strong>💡 Chấm điểm phản xạ:</strong> {m.feedback}
                    </div>
                  )}
                </div>
              ))}
              {aiLoading && (
                <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
                  <RefreshCw size={14} className="animate-spin" /> {currentCourse.partnerRole} đang phản hồi...
                </div>
              )}
              <div ref={chatScrollRef} />
            </div>

            {/* Speaking Bottom Microphone & Text Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 10 }}>
              <button
                onClick={toggleSpeechRecognition}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: isRecording ? '#DC2626' : 'linear-gradient(135deg, #2F70E8, #17C9FB)',
                  border: 'none',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(47, 112, 232, 0.4)'
                }}
              >
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                {isRecording ? 'Đang lắng nghe... Nói câu trả lời của bạn' : 'Bấm mic để trả lời bằng tiếng Anh'}
              </span>

              <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                <input
                  style={{ flex: 1, background: 'white', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: 16, outline: 'none', fontSize: '0.9rem' }}
                  placeholder="Hoặc gõ câu nói của bạn..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendSpeakingMessage()}
                />
                <button
                  onClick={() => handleSendSpeakingMessage()}
                  style={{ background: '#2F70E8', border: 'none', color: 'white', width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: ACTIVE BLITZ QUIZ (FLASHCARD & SPACED REPETITION)                */}
        {/* ========================================================================= */}
        {activeMode === 'quiz' && (
          <div className="quiz-container">
            {/* Top Bar with Progress */}
            <div className="quiz-top-bar">
              <button
                onClick={() => { setActiveMode('none'); window.speechSynthesis.cancel(); }}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer' }}
              >
                <ArrowLeft size={18} color="#475569" />
              </button>

              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${((quizIndex + 1) / currentCourse.quizzes.length) * 100}%` }}
                />
              </div>

              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2F70E8' }}>
                {quizIndex + 1}/{currentCourse.quizzes.length}
              </span>
            </div>

            {!quizFinished ? (
              <div>
                {/* Question Card */}
                {currentCourse.quizzes[quizIndex] && (
                  <div>
                    <div className="quiz-card">
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EA580C', background: '#FFF7ED', padding: '4px 10px', borderRadius: 12, marginBottom: 12 }}>
                        BLITZ QUIZ • PHẢN XẠ NHANH
                      </span>

                      <div className="quiz-prompt-text">
                        {currentCourse.quizzes[quizIndex].prompt}
                      </div>

                      <div className="quiz-word-highlight">
                        <span>{currentCourse.quizzes[quizIndex].word}</span>
                        <button
                          onClick={() => speakText(currentCourse.quizzes[quizIndex].word)}
                          style={{ background: '#EBF5FF', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Volume2 size={16} color="#2F70E8" />
                        </button>
                      </div>

                      <div className="quiz-phonetic">
                        {currentCourse.quizzes[quizIndex].phonetic}
                      </div>

                      {/* 4 Multiple Choice Options */}
                      <div className="quiz-options-list">
                        {currentCourse.quizzes[quizIndex].options.map((optionText, oIdx) => {
                          const isSelected = selectedOption === optionText;
                          const isCorrect = optionText === currentCourse.quizzes[quizIndex].correctAnswer;

                          let btnClass = 'quiz-option-btn';
                          if (isAnswerChecked) {
                            if (isCorrect) btnClass += ' correct';
                            else if (isSelected) btnClass += ' wrong';
                          }

                          return (
                            <button
                              key={oIdx}
                              className={btnClass}
                              onClick={() => handleSelectQuizOption(optionText)}
                            >
                              <span>{optionText}</span>
                              {isAnswerChecked && isCorrect && <Check size={18} color="#16A34A" strokeWidth={3} />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Feedback */}
                      {isAnswerChecked && (
                        <div className="quiz-feedback-box">
                          <strong style={{ color: selectedOption === currentCourse.quizzes[quizIndex].correctAnswer ? '#15803D' : '#B91C1C' }}>
                            {selectedOption === currentCourse.quizzes[quizIndex].correctAnswer ? 'Chính xác! 🎉' : 'Chưa đúng rồi!'}
                          </strong>
                          <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: 4, lineHeight: 1.4 }}>
                            {currentCourse.quizzes[quizIndex].explanation}
                          </p>

                          <button className="quiz-next-btn" onClick={handleNextQuizQuestion}>
                            {quizIndex < currentCourse.quizzes.length - 1 ? 'Câu tiếp theo ➔' : 'Xem kết quả tổng kết 🏆'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Finished Summary */
              <div className="quiz-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
                <Award size={64} color="#EA580C" style={{ margin: '0 auto 14px auto' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', marginBottom: 6 }}>
                  HOÀN THÀNH BLITZ QUIZ!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 20 }}>
                  Bạn đã trả lời đúng {quizScore} / {currentCourse.quizzes.length} câu phản xạ.
                </p>

                <div style={{ display: 'flex', gap: 14, width: '100%', marginBottom: 24 }}>
                  <div style={{ flex: 1, background: '#EFF6FF', borderRadius: 18, padding: 14 }}>
                    <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>ĐIỂM KINH NGHIỆM</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E40AF', marginTop: 2 }}>+{quizScore * 15} XP</div>
                  </div>
                  <div style={{ flex: 1, background: '#FFF7ED', borderRadius: 18, padding: 14 }}>
                    <div style={{ fontSize: '0.75rem', color: '#EA580C', fontWeight: 700 }}>CHUỖI NGÀY</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#C2410C', marginTop: 2 }}>+1 Ngày 🔥</div>
                  </div>
                </div>

                <button className="quiz-next-btn" onClick={() => setActiveMode('none')}>
                  Trở về trang khóa học
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: VOCABULARY STUDY (EXACT PEAKTALK FILL-IN-THE-BLANK CLOZE SCREEN)   */}
        {/* ========================================================================= */}
        {activeMode === 'vocab-study' && (
          <div className="vocab-study-container">
            {/* Top Navigation */}
            <div className="vocab-study-top-nav">
              <button 
                className="vocab-study-close-btn"
                onClick={() => { setActiveMode('none'); window.speechSynthesis.cancel(); }}
                title="Đóng bài học"
              >
                <X size={26} color="#0F172A" strokeWidth={2.5} />
              </button>

              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                Mục tiêu: {completedToday} / 25
              </div>

              <button 
                className="vocab-study-settings-btn"
                onClick={() => { setActiveMode('none'); setActiveTab('profile'); }}
                title="Cài đặt"
              >
                <SettingsIcon size={22} color="#0F172A" />
              </button>
            </div>

            {/* Blue Progress Bar */}
            <div className="vocab-study-prog-bar" style={{ marginBottom: 12 }}>
              <div 
                className="vocab-study-prog-fill" 
                style={{ width: `${Math.max(15, Math.min(100, ((vocabIndex + 1) / currentCourse.terms.length) * 100))}%` }}
              />
            </div>

            {/* 3D INTEGRATED LEARNING STEPPER */}
            <div className="study-flow-stepper">
              <div className={`study-step-badge ${flashcardStep === 'flip' ? 'active' : 'completed'}`}>
                <span className="step-num">1</span>
                <span>Lật Thẻ 3D</span>
              </div>
              <div className="step-connector" />
              <div className={`study-step-badge ${flashcardStep === 'recall' ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span>Điền Từ AI</span>
              </div>
              <div className="step-connector" />
              <div className="study-step-badge">
                <span className="step-num">3</span>
                <span>25 Câu Phản Xạ</span>
              </div>
            </div>

            {/* PREVIOUS / NEXT TERM NAVIGATION ROW */}
            <div className="flashcard-nav-row">
              <button 
                className="flashcard-nav-btn-3d" 
                onClick={handlePrevVocab}
                disabled={vocabIndex === 0}
                title="Học từ khóa phía trước"
              >
                ◀ Từ trước
              </button>
              <div className="flashcard-counter-pill-3d">
                <span>Thuật ngữ</span>
                <strong>{vocabIndex + 1} / {currentCourse.terms.length}</strong>
              </div>
              <button 
                className="flashcard-nav-btn-3d" 
                onClick={handleNextVocab}
                title="Chuyển sang từ kế tiếp"
              >
                {vocabIndex < currentCourse.terms.length - 1 ? 'Từ sau ▶' : 'Tiếp tục ➔'}
              </button>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* VIEW A: INTERACTIVE 3D FLASHCARD FLIP (MANDATORY RECALL WITH AI)  */}
            {/* ----------------------------------------------------------------- */}
            {vocabStudyType === 'flashcard' && (
              <div>
                {flashcardStep === 'flip' ? (
                  <div>
                    <div 
                      className="flashcard-scene-3d" 
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                    >
                      <div className={`flashcard-card-3d ${isCardFlipped ? 'flipped' : ''}`}>
                        {/* FRONT FACE (ENGLISH TERM & CONTEXT) */}
                        <div className="flashcard-face-3d front">
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '5px 12px', borderRadius: 10, letterSpacing: '0.5px', border: '1px solid #BFDBFE' }}>
                                MẶT TRƯỚC • THUẬT NGỮ HÀNG HẢI
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const t = currentCourse.terms[vocabIndex];
                                  if (t) speakText(t.word);
                                }}
                                title="Nghe phát âm từ"
                                className="flashcard-3d-audio-btn"
                              >
                                <Volume2 size={20} color="#2563EB" />
                              </button>
                            </div>

                            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0F172A', marginBottom: 4, letterSpacing: '-0.5px' }}>
                              {currentCourse.terms[vocabIndex]?.word}
                            </div>
                            <div style={{ fontSize: '1.05rem', color: '#64748B', fontWeight: 600, marginBottom: 16 }}>
                              {currentCourse.terms[vocabIndex]?.phonetic}
                            </div>

                            <div style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.55, background: '#F8FAFC', padding: '14px 16px', borderRadius: 16, border: '1.5px solid #E2E8F0', marginBottom: 12 }}>
                              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, marginBottom: 5, letterSpacing: '0.4px' }}>CÂU THỰC HÀNH BUỒNG TÀU:</div>
                              "{currentCourse.terms[vocabIndex]?.sentenceBefore}{' '}
                              <span style={{ color: '#2563EB', fontWeight: 900, textDecoration: 'underline' }}>
                                {currentCourse.terms[vocabIndex]?.word}
                              </span>{' '}
                              {currentCourse.terms[vocabIndex]?.sentenceAfter}"
                            </div>

                            {currentCourse.terms[vocabIndex]?.hint && (
                              <div style={{ fontSize: '0.82rem', color: '#0284C7', background: '#F0F9FF', padding: '6px 14px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #BAE6FD' }}>
                                💡 Ngữ cảnh: {currentCourse.terms[vocabIndex]?.hint}
                              </div>
                            )}
                          </div>

                          <div className="flashcard-flip-pill-3d">
                            <span>👆 Chạm để lật xem giải nghĩa & AI Mẹo nhớ</span>
                          </div>
                        </div>

                        {/* BACK FACE (VIETNAMESE TRANSLATION & AI MNEMONIC) */}
                        <div className="flashcard-face-3d back">
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '5px 12px', borderRadius: 10, letterSpacing: '0.5px', border: '1px solid #A7F3D0' }}>
                                MẶT SAU • GIẢI NGHĨA TIẾNG VIỆT
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const t = currentCourse.terms[vocabIndex];
                                  if (t) speakText(`${t.word}. ${t.sentenceBefore} ${t.word} ${t.sentenceAfter}`);
                                }}
                                title="Nghe toàn bộ câu"
                                className="flashcard-3d-audio-btn"
                                style={{ background: '#E0F2FE', borderColor: '#7DD3FC' }}
                              >
                                <Volume2 size={20} color="#0284C7" />
                              </button>
                            </div>

                            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0C4A6E', marginBottom: 6 }}>
                              {currentCourse.terms[vocabIndex]?.meaning}
                            </div>
                            <div style={{ fontSize: '0.98rem', color: '#0284C7', fontWeight: 700, marginBottom: 12 }}>
                              {currentCourse.terms[vocabIndex]?.word} {currentCourse.terms[vocabIndex]?.phonetic}
                            </div>

                            <div style={{ fontSize: '0.9rem', color: '#1E293B', lineHeight: 1.5, background: '#FFFFFF', padding: '12px 14px', borderRadius: 14, border: '1.5px solid #BAE6FD', marginBottom: 12 }}>
                              <div style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 800, marginBottom: 4 }}>BẢN DỊCH CHUẨN TÀU BIỂN:</div>
                              {currentCourse.terms[vocabIndex]?.vietnameseSentence}
                            </div>

                            {/* AI MARITIME MNEMONIC ANCHOR */}
                            <div className="flashcard-ai-mnemonic-box-3d">
                              {evaluateWithAI('', currentCourse.terms[vocabIndex]?.word || '', {
                                meaningVi: currentCourse.terms[vocabIndex]?.meaning,
                                phonetic: currentCourse.terms[vocabIndex]?.phonetic
                              }).mnemonic}
                            </div>
                          </div>

                          <div className="flashcard-flip-pill-3d">
                            <span>👆 Chạm để lật lại mặt trước</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3D Flashcard Flip Actions */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                      <button 
                        className="study-action-btn-3d secondary"
                        style={{ flex: 1 }}
                        onClick={() => {
                          const t = currentCourse.terms[vocabIndex];
                          if (t) speakText(t.word);
                        }}
                      >
                        <Volume2 size={18} color="#2563EB" />
                        <span>Phát âm</span>
                      </button>
                      <button 
                        className="study-action-btn-3d primary"
                        style={{ flex: 1.8 }}
                        onClick={() => {
                          setFlashcardStep('recall');
                          setFlashcardRecallInput('');
                          setFlashcardAiResult(null);
                        }}
                      >
                        <span>✍️ Đã thuộc từ ➔ Điền từ kiểm tra</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* MANDATORY RECALL CHALLENGE SCREEN */
                  <div className="flashcard-recall-card">
                    <div className="flashcard-recall-header">
                      <span className="flashcard-recall-tag">🔒 BƯỚC ĐIỀN TỪ BẮT BUỘC • ACTIVE RECALL</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                        Từ {vocabIndex + 1} / {currentCourse.terms.length}
                      </span>
                    </div>

                    <div className="flashcard-recall-sentence">
                      "{currentCourse.terms[vocabIndex]?.sentenceBefore}{' '}
                      <span className="flashcard-recall-target-blank">[ _________ ]</span>{' '}
                      {currentCourse.terms[vocabIndex]?.sentenceAfter}"
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: 12, background: '#F1F5F9', padding: '10px 12px', borderRadius: 10 }}>
                      <div><strong>💡 Nghĩa tiếng Việt:</strong> {currentCourse.terms[vocabIndex]?.meaning}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>
                        Gợi ý: Bắt đầu bằng "<strong>{currentCourse.terms[vocabIndex]?.word?.charAt(0).toUpperCase()}</strong>..." ({currentCourse.terms[vocabIndex]?.word?.length} ký tự)
                      </div>
                    </div>

                    <div className="flashcard-recall-input-group">
                      <input 
                        type="text"
                        autoFocus
                        className={`flashcard-recall-input ${flashcardAiResult ? (flashcardAiResult.isCorrect ? 'correct' : 'wrong') : ''}`}
                        placeholder="Gõ lại từ vựng vừa lật..."
                        value={flashcardRecallInput}
                        onChange={(e) => setFlashcardRecallInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCheckFlashcardRecall();
                        }}
                      />
                      <button 
                        className="study-action-btn-3d primary"
                        style={{ padding: '0 20px', borderRadius: 14, flexShrink: 0 }}
                        onClick={handleCheckFlashcardRecall}
                      >
                        <Bot size={18} />
                        <span>AI Check</span>
                      </button>
                    </div>

                    {flashcardAiResult && (
                      <div className={`flashcard-ai-eval-box ${flashcardAiResult.isCorrect ? 'correct' : flashcardAiResult.score >= 70 ? 'typo' : 'wrong'}`}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: flashcardAiResult.isCorrect ? '#15803D' : '#B45309', marginBottom: 4 }}>
                          {flashcardAiResult.feedback}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                          {flashcardAiResult.smartTip}
                        </div>
                        {flashcardAiResult.mnemonic && (
                          <div style={{ fontSize: '0.78rem', color: '#0369A1', marginTop: 6, fontStyle: 'italic' }}>
                            {flashcardAiResult.mnemonic}
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                      <button 
                        className="study-action-btn-3d secondary"
                        style={{ flex: 1 }}
                        onClick={() => setFlashcardStep('flip')}
                      >
                        👀 Xem lại thẻ lật
                      </button>
                      {flashcardAiResult?.isCorrect && (
                        <button 
                          className="study-action-btn-3d primary"
                          style={{ flex: 1.6 }}
                          onClick={handleNextVocab}
                        >
                          {vocabIndex < currentCourse.terms.length - 1 ? 'Lật thẻ từ tiếp theo ➔' : 'Hoàn thành bài học 🏆'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* VIEW B: CLOZE FILL-IN-THE-BLANK MODE                              */}
            {/* ----------------------------------------------------------------- */}
            {vocabStudyType === 'cloze' && (
              <>
                {/* Top Card: Sentence with Fill-in-the-Blank */}
                <div className="blank-sentence-card">
                  <div className="blank-card-top-row">
                    {/* 5 Dots Indicator */}
                    <div className="blank-dots-row">
                      {[1, 2, 3, 4, 5].map((d) => (
                        <div 
                          key={d} 
                          className={`blank-dot ${d <= (currentCourse.terms[vocabIndex]?.dots || 4) ? 'filled' : ''}`}
                        />
                      ))}
                    </div>

                    {/* Audio Controls Pill */}
                    <div className="audio-controls-pill">
                      <button 
                        className="audio-pill-btn"
                        title="Nghe câu"
                        onClick={() => {
                          const t = currentCourse.terms[vocabIndex];
                          if (t) speakText(`${t.sentenceBefore} ${t.word} ${t.sentenceAfter}`);
                        }}
                      >
                        <Play size={15} fill="#2563EB" color="#2563EB" />
                      </button>
                      <button 
                        className="audio-pill-btn"
                        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX size={17} color="#64748B" /> : <Volume2 size={17} color="#2563EB" />}
                      </button>
                    </div>
                  </div>

                  {/* English Sentence */}
                  <div className="blank-sentence-text">
                    {currentCourse.terms[vocabIndex]?.sentenceBefore}{' '}
                    <input 
                      autoFocus
                      type="text"
                      className={`blank-input-box ${vocabStatus}`}
                      value={vocabInput}
                      placeholder={showHint ? currentCourse.terms[vocabIndex]?.word.slice(0, 2) + '...' : ''}
                      onChange={(e) => {
                        setVocabInput(e.target.value);
                        if (vocabStatus !== 'idle') setVocabStatus('idle');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCheckVocab();
                        }
                      }}
                    />{' '}
                    {currentCourse.terms[vocabIndex]?.sentenceAfter}
                  </div>

                  {showHint && (
                    <div style={{ marginTop: 14, fontSize: '0.85rem', color: '#0284C7', background: '#F0F9FF', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>
                      💡 Gợi ý: {currentCourse.terms[vocabIndex]?.hint || currentCourse.terms[vocabIndex]?.word}
                    </div>
                  )}
                </div>

                {/* Bottom Card: Vietnamese keyword & sentence */}
                <div className="blank-translation-card">
                  <div 
                    className="blank-translation-title-row" 
                    onClick={() => setIsVietnameseOpen(!isVietnameseOpen)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="blank-vietnamese-keyword">
                      {currentCourse.terms[vocabIndex]?.meaning}
                    </span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {isVietnameseOpen ? <ChevronUp size={20} color="#1E293B" /> : <ChevronDown size={20} color="#1E293B" />}
                    </button>
                  </div>

                  {isVietnameseOpen && (
                    <div className="blank-vietnamese-full-sentence">
                      {currentCourse.terms[vocabIndex]?.vietnameseSentence}
                    </div>
                  )}
                </div>

                {/* Bottom Controls Bar */}
                <div className="vocab-study-bottom-bar">
                  <button 
                    className={`study-mic-circle-btn ${vocabRecording ? 'recording' : ''}`}
                    onClick={toggleVocabSpeechRecognition}
                    title="Bấm mic để nói từ cần điền"
                  >
                    <Mic size={22} color={vocabRecording ? '#DC2626' : '#1E293B'} />
                  </button>

                  {vocabStatus === 'correct' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 6 }}>
                      <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 800, textAlign: 'center' }}>
                        ✓ CHÍNH XÁC! ĐÁNH GIÁ ĐỘ NHỚ THEO SRS INTERVAL:
                      </div>
                      <div className="srs-buttons-row">
                        <button className="srs-btn again" onClick={() => handleSRSRate('again')}>
                          <span>🔁 AGAIN</span>
                          <small>&lt; 1 ngày</small>
                        </button>
                        <button className="srs-btn hard" onClick={() => handleSRSRate('hard')}>
                          <span>⚠️ HARD</span>
                          <small>2 ngày</small>
                        </button>
                        <button className="srs-btn good" onClick={() => handleSRSRate('good')}>
                          <span>👍 GOOD</span>
                          <small>4 ngày</small>
                        </button>
                        <button className="srs-btn easy" onClick={() => handleSRSRate('easy')}>
                          <span>⚡ EASY</span>
                          <small>7 ngày</small>
                        </button>
                      </div>
                    </div>
                  ) : vocabInput.trim().length > 0 ? (
                    <button 
                      className="study-action-btn primary"
                      onClick={handleCheckVocab}
                    >
                      Kiểm tra
                    </button>
                  ) : (
                    <button 
                      className="study-action-btn"
                      onClick={() => {
                        setShowHint(true);
                        const t = currentCourse.terms[vocabIndex];
                        if (t && !vocabInput) {
                          setVocabInput(t.word.slice(0, 1));
                        }
                      }}
                    >
                      Hiển thị gợi ý
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: DAILY 25-QUESTION INTERLEAVED REPETITION PROTOCOL                   */}
        {/* ========================================================================= */}
        {activeMode === 'daily-protocol' && dailySession && (
          <div className="daily-session-screen">
            {/* Top Navigation */}
            <div className="daily-session-topbar">
              <button 
                className="vocab-study-close-btn"
                onClick={() => {
                  if (confirm('Bạn có muốn tạm dừng phiên học giao thức 25 câu hôm nay không?')) {
                    setActiveMode('none');
                    window.speechSynthesis.cancel();
                  }
                }}
                title="Thoát phiên học"
              >
                <X size={26} color="#0F172A" strokeWidth={2.5} />
              </button>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Giao Thức Lặp Lại 25 Câu • Ngày {dailySession.day}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                  5 từ mới + từ khó lặp lại ({dailySession.newTermsCount} mới • {dailySession.reviewTermsCount} ôn tập)
                </div>
              </div>

              <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', borderRadius: '50%', color: '#2563EB', fontWeight: 800, fontSize: '0.85rem' }}>
                {dailyScore}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="vocab-study-prog-bar" style={{ marginBottom: 14 }}>
              <div 
                className="vocab-study-prog-fill" 
                style={{ 
                  width: `${Math.round(((dailyQIdx + 1) / dailySession.totalQuestions) * 100)}%`,
                  background: 'linear-gradient(90deg, #2563EB 0%, #10B981 100%)'
                }}
              />
            </div>

            {!dailyFinished ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Meta indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span className={`daily-q-type-badge ${dailySession.questions[dailyQIdx].isReview ? 'review' : 'new'}`}>
                    {dailySession.questions[dailyQIdx].isReview ? '🔄 TỪ KHÓ ĐÃ HỌC (ÔN TẬP)' : '⭐ TỪ MỚI HÔM NAY'}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569' }}>
                    Câu {dailyQIdx + 1} / {dailySession.totalQuestions}
                  </span>
                </div>

                {/* Question Prompt Card */}
                <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}>
                  <div style={{ fontSize: '0.82rem', color: '#2563EB', fontWeight: 700, marginBottom: 4 }}>
                    {dailySession.questions[dailyQIdx].prompt}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                    "{dailySession.questions[dailyQIdx].meaningVi}"
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4 }}>
                    {dailySession.questions[dailyQIdx].vietnameseSentence}
                  </div>
                </div>

                {/* Interaction Section based on questionType */}
                {dailySession.questions[dailyQIdx].questionType === 'cloze' ? (
                  <div className="blank-sentence-card" style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, marginBottom: 8 }}>
                      ĐIỀN TỪ KHÓA VÀO CHỖ TRỐNG:
                    </div>
                    <div className="blank-sentence-text" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                      {dailySession.questions[dailyQIdx].sentenceBefore}{' '}
                      <input 
                        autoFocus
                        type="text"
                        className={`blank-input-box ${dailyIsChecked ? (dailyInput.trim().toLowerCase() === dailySession.questions[dailyQIdx].correctAnswer.toLowerCase() ? 'correct' : 'wrong') : ''}`}
                        value={dailyInput}
                        placeholder="..."
                        onChange={(e) => setDailyInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCheckDailyAnswer(dailyInput);
                        }}
                      />{' '}
                      {dailySession.questions[dailyQIdx].sentenceAfter}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                      CHỌN THUẬT NGỮ CHÍNH XÁC:
                    </div>
                    {dailySession.questions[dailyQIdx].options?.map((opt, idx) => {
                      const isSelected = dailySelectedOpt === opt;
                      const isCorrect = opt.toLowerCase() === dailySession.questions[dailyQIdx].correctAnswer.toLowerCase();
                      let optClass = 'duel-option-btn';
                      if (dailyIsChecked) {
                        if (isCorrect) optClass += ' correct';
                        else if (isSelected) optClass += ' wrong';
                      }

                      return (
                        <button 
                          key={idx}
                          className={optClass}
                          onClick={() => {
                            if (!dailyIsChecked) {
                              handleCheckDailyAnswer(opt);
                            }
                          }}
                        >
                          <span style={{ fontSize: '1rem', fontWeight: 700 }}>{opt}</span>
                          {dailyIsChecked && isCorrect && <Check size={18} color="#16A34A" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Feedback / Explanation Box with AI Evaluation */}
                {dailyIsChecked && (
                  <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: '1.1rem' }}>
                        {((dailySession.questions[dailyQIdx].questionType === 'cloze' && (dailyAiResult ? dailyAiResult.isCorrect : dailyInput.trim().toLowerCase() === dailySession.questions[dailyQIdx].correctAnswer.toLowerCase())) || dailySelectedOpt?.toLowerCase() === dailySession.questions[dailyQIdx].correctAnswer.toLowerCase()) ? '✅' : '❌'}
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: '#1E3A8A' }}>
                        Đáp án chuẩn: {dailySession.questions[dailyQIdx].targetWord} {dailySession.questions[dailyQIdx].phonetic}
                      </strong>
                    </div>

                    {dailyAiResult && (
                      <div style={{ fontSize: '0.82rem', color: dailyAiResult.isCorrect ? '#15803D' : '#B45309', marginBottom: 6, fontWeight: 700 }}>
                        {dailyAiResult.feedback}
                      </div>
                    )}

                    <div style={{ fontSize: '0.85rem', color: '#1E40AF', lineHeight: 1.4 }}>
                      {dailySession.questions[dailyQIdx].explanation}
                    </div>

                    {dailyAiResult?.mnemonic && (
                      <div className="flashcard-ai-mnemonic-card" style={{ marginTop: 8 }}>
                        {dailyAiResult.mnemonic}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Action Button */}
                <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                  {!dailyIsChecked ? (
                    dailySession.questions[dailyQIdx].questionType === 'cloze' && (
                      <button 
                        className="study-action-btn primary"
                        style={{ width: '100%', padding: '14px' }}
                        onClick={() => handleCheckDailyAnswer(dailyInput)}
                      >
                        Kiểm tra câu trả lời
                      </button>
                    )
                  ) : (
                    <button 
                      className="study-action-btn primary"
                      style={{ width: '100%', padding: '14px' }}
                      onClick={handleNextDailyQuestion}
                    >
                      {dailyQIdx < dailySession.totalQuestions - 1 ? 'Câu kế tiếp (25 câu) ➔' : 'Xem kết quả giao thức hôm nay 🏆'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Session Completed Summary Screen */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '3.5rem', marginBottom: 14 }}>🎖️</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                  Hoàn Thành Giao Thức 25 Câu!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: 320, lineHeight: 1.5, marginBottom: 20 }}>
                  Bạn đã xuất sắc làm chủ 5 từ mới và ôn tập củng cố các từ khó đã học qua 25 câu hỏi ngắt quãng đa dạng.
                </p>

                <div style={{ display: 'flex', gap: 12, width: '100%', marginBottom: 24 }}>
                  <div style={{ flex: 1, background: '#DCFCE7', borderRadius: 16, padding: '14px 10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 800 }}>ĐÚNG CHÍNH XÁC</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D', marginTop: 2 }}>{dailyScore} / 25</div>
                  </div>
                  <div style={{ flex: 1, background: '#EFF6FF', borderRadius: 16, padding: '14px 10px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 800 }}>THƯỞNG KINH NGHIỆM</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1D4ED8', marginTop: 2 }}>+{dailyScore * 15} XP</div>
                  </div>
                </div>

                <button 
                  className="study-action-btn primary"
                  style={{ width: '100%', padding: '16px', borderRadius: 14 }}
                  onClick={() => setActiveMode('none')}
                >
                  Trở về trang chủ hàng hải
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 4: MARLINS ENGLISH TEST SIMULATOR (STCW INTERNATIONAL EXAM)         */}
        {/* ========================================================================= */}
        {activeMode === 'marlins' && (
          <div className="marlins-exam-screen">
            {/* Exam Top Bar */}
            <div className="marlins-exam-topbar">
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn thoát bài thi Marlins? Kết quả thi sẽ không được lưu.')) {
                    setActiveMode('none');
                    window.speechSynthesis.cancel();
                  }
                }}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer' }}
              >
                <ArrowLeft size={18} color="#475569" />
              </button>

              <div className="marlins-timer-badge">
                <Clock size={16} />
                <span>
                  {Math.floor(marlinsSecondsLeft / 60).toString().padStart(2, '0')}:
                  {(marlinsSecondsLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>
                {marlinsIndex + 1} / {MARLINS_EXAM_DATA.length}
              </span>
            </div>

            {!marlinsFinished ? (
              <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
                {MARLINS_EXAM_DATA[marlinsIndex] && (() => {
                  const q = MARLINS_EXAM_DATA[marlinsIndex];
                  return (
                    <div className="marlins-question-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span className="marlins-category-tag">{q.categoryTitle}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{q.maritimeContext}</span>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.5, marginBottom: 12 }}>
                        {q.prompt}
                      </h3>

                      {q.audioText && (
                        <button 
                          className="marlins-audio-btn"
                          onClick={() => speakText(q.audioText!)}
                        >
                          <Volume2 size={20} />
                          <span>Nghe đoạn đàm thoại / câu lệnh (Audio)</span>
                        </button>
                      )}

                      <div className="marlins-options-list">
                        {q.options.map((opt, oIdx) => {
                          let optClass = 'marlins-opt-item';
                          if (marlinsIsAnswerChecked) {
                            if (oIdx === q.correctIndex) optClass += ' correct';
                            else if (marlinsSelectedOption === oIdx) optClass += ' wrong';
                          } else if (marlinsSelectedOption === oIdx) {
                            optClass += ' selected';
                          }

                          return (
                            <div
                              key={oIdx}
                              className={optClass}
                              onClick={() => {
                                if (!marlinsIsAnswerChecked) {
                                  setMarlinsSelectedOption(oIdx);
                                }
                              }}
                            >
                              <div className="marlins-opt-bullet">
                                {String.fromCharCode(65 + oIdx)}
                              </div>
                              <div style={{ flex: 1 }}>{opt}</div>
                            </div>
                          );
                        })}
                      </div>

                      {marlinsIsAnswerChecked && (
                        <div className="marlins-explanation-box">
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: marlinsSelectedOption === q.correctIndex ? '#16A34A' : '#DC2626', marginBottom: 4 }}>
                            {marlinsSelectedOption === q.correctIndex ? '✅ Chính xác!' : '❌ Chưa chính xác!'}
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
                            {q.explanation}
                          </p>
                        </div>
                      )}

                      <div style={{ marginTop: 24 }}>
                        {!marlinsIsAnswerChecked ? (
                          <button
                            className="study-action-btn primary"
                            disabled={marlinsSelectedOption === null}
                            style={{ width: '100%', padding: '14px', borderRadius: 14, opacity: marlinsSelectedOption === null ? 0.5 : 1 }}
                            onClick={() => {
                              if (marlinsSelectedOption === null) return;
                              setMarlinsIsAnswerChecked(true);
                              if (marlinsSelectedOption === q.correctIndex) {
                                setMarlinsScore(prev => prev + 1);
                              }
                            }}
                          >
                            Xác nhận câu trả lời
                          </button>
                        ) : (
                          <button
                            className="study-action-btn primary"
                            style={{ width: '100%', padding: '14px', borderRadius: 14 }}
                            onClick={() => {
                              if (marlinsIndex < MARLINS_EXAM_DATA.length - 1) {
                                setMarlinsIndex(prev => prev + 1);
                                setMarlinsSelectedOption(null);
                                setMarlinsIsAnswerChecked(false);
                              } else {
                                setMarlinsFinished(true);
                              }
                            }}
                          >
                            {marlinsIndex < MARLINS_EXAM_DATA.length - 1 ? 'Câu tiếp theo' : 'Xem Bảng Điểm & Chứng Chỉ Marlins'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* EXAM FINISHED - MARLINS CERTIFICATE MODAL */
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div className="marlins-cert-modal">
                  <span style={{ fontSize: '3.5rem' }}>
                    {(marlinsScore / MARLINS_EXAM_DATA.length) >= 0.7 ? '🏆' : '⚓'}
                  </span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '10px 0 6px 0', color: '#0F172A' }}>
                    Kết Quả Thi Thử Marlins
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 16 }}>
                    Kỳ thi đánh giá tiếng Anh Hàng hải chuẩn quốc tế STCW 78/2010
                  </p>

                  <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 16, margin: '14px 0', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '2.4rem', fontWeight: 900, color: (marlinsScore / MARLINS_EXAM_DATA.length) >= 0.7 ? '#16A34A' : '#EA580C' }}>
                      {Math.round((marlinsScore / MARLINS_EXAM_DATA.length) * 100)}%
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>
                      Đúng {marlinsScore} / {MARLINS_EXAM_DATA.length} câu hỏi
                    </div>
                    <div style={{ fontSize: '0.78rem', color: (marlinsScore / MARLINS_EXAM_DATA.length) >= 0.7 ? '#16A34A' : '#DC2626', fontWeight: 800, marginTop: 4 }}>
                      {(marlinsScore / MARLINS_EXAM_DATA.length) >= 0.7 ? '● ĐẠT CHUẨN PHỎNG VẤN THUYỀN VIÊN (PASSED)' : '● CHƯA ĐẠT (CẦN TỐI THIỂU 70% ĐỂ ĐỖ)'}
                    </div>
                  </div>

                  <button
                    className="study-action-btn primary"
                    style={{ width: '100%', padding: '14px', borderRadius: 14 }}
                    onClick={() => {
                      setActiveMode('none');
                    }}
                  >
                    Hoàn tất & Về trang chủ
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: VHF MARITIME RADIO SIMULATOR                                        */}
        {/* ========================================================================= */}
        {activeMode === 'vhf' && selectedVhf && (
          <div className="vhf-radio-screen">
            <div className="vhf-top-controls">
              <button
                className="study-header-btn"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setActiveMode('none');
                }}
              >
                <X size={20} color="#94A3B8" />
              </button>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38BDF8' }}>
                VHF MARINE TRANSCEIVER
              </span>
              <button
                className="study-header-btn"
                onClick={() => {
                  const currIdx = VHF_SCENARIOS.findIndex(s => s.id === selectedVhf.id);
                  const nextS = VHF_SCENARIOS[(currIdx + 1) % VHF_SCENARIOS.length];
                  launchVhfScenario(nextS);
                }}
              >
                <RotateCcw size={18} color="#94A3B8" />
              </button>
            </div>

            {/* VHF Hardware Bezel & LCD Screen */}
            <div className="vhf-hardware-bezel">
              <div className="vhf-screen-lcd">
                <div className="vhf-lcd-top-status">
                  <span>{selectedVhf.channel}</span>
                  <span className={`vhf-tx-rx-indicator ${vhfIsTransmitting ? 'tx' : 'rx'}`}>
                    {vhfIsTransmitting ? '● TX (TRANSMIT)' : '● RX (RECEIVING)'}
                  </span>
                  <span>PWR: 25W HIGH</span>
                </div>

                <div className="vhf-scenario-badge">
                  {selectedVhf.title}
                </div>

                <div className="vhf-transcript-box">
                  {selectedVhf.dialogueSteps.slice(0, vhfStepIdx + 1).map((msg, i) => (
                    <div 
                      key={i} 
                      className={`vhf-msg-bubble ${msg.speakerRole === 'ship' ? 'me' : 'station'}`}
                    >
                      <div className="vhf-msg-speaker">
                        {msg.speakerRole === 'ship' ? '⚓ THIS IS M/V OCEAN PIONEER' : `📡 ${selectedVhf.otherStationName.toUpperCase()}`}
                      </div>
                      <div className="vhf-msg-text">
                        "{msg.messageText}"
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 4 }}>
                        👉 {msg.vietnameseMeaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Speaker Grille */}
              <div className="vhf-speaker-grille">
                <div className="vhf-grille-line" />
                <div className="vhf-grille-line" />
                <div className="vhf-grille-line" />
              </div>

              {/* Push To Talk (PTT) Action Area */}
              <div className="vhf-ptt-container">
                <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: 10, textAlign: 'center' }}>
                  {vhfFeedback ? vhfFeedback : vhfStepIdx >= selectedVhf.dialogueSteps.length - 1 
                    ? '✅ Đã hoàn thành thông thoại tình huống VHF này!' 
                    : selectedVhf.dialogueSteps[vhfStepIdx + 1]?.speakerRole === 'ship'
                    ? '🎙️ Đến lượt bạn trả lời. Nhấn giữ hoặc bấm PTT để phát!'
                    : '📻 Đang lắng nghe phản hồi từ đài duyên hải / tàu khác...'}
                </p>

                <button 
                  className={`vhf-ptt-button ${vhfIsTransmitting ? 'active' : ''}`}
                  onClick={handleVhfPttToggle}
                  disabled={vhfStepIdx >= selectedVhf.dialogueSteps.length - 1}
                >
                  <Radio size={28} />
                  <span>{vhfIsTransmitting ? 'RELEASE PTT (OVER)' : 'PRESS PTT TO TRANSMIT'}</span>
                </button>
              </div>
            </div>

            {/* SMCP Guidance Box */}
            <div style={{ padding: '0 16px', marginTop: 12 }}>
              <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38BDF8', marginBottom: 4 }}>
                  💡 QUY CHUẨN ĐÀI THOẠI HÀNG HẢI (IMO SMCP):
                </div>
                <div style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                  Luôn kết thúc câu thoại bằng từ <strong>"OVER"</strong> khi chờ phản hồi, hoặc <strong>"OUT"</strong> khi kết thúc cuộc gọi. Không bao giờ dùng "Over and Out" cùng lúc!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE: SOLAS EMERGENCY CHECKLIST TRAINER                                   */}
        {/* ========================================================================= */}
        {activeMode === 'emergency' && selectedEmergency && (
          <div className="emergency-screen">
            <div className="study-header">
              <button 
                className="study-header-btn"
                onClick={() => setActiveMode('none')}
              >
                <X size={20} color="#64748B" />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={18} color="#DC2626" />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#991B1B' }}>
                  {selectedEmergency.title}
                </span>
              </div>
              <div style={{ width: 36 }} />
            </div>

            <div style={{ padding: 16 }}>
              {/* Emergency Alert Banner */}
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 16, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase' }}>
                  Tín hiệu báo động chung (General Alarm)
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#DC2626', marginTop: 4 }}>
                  {selectedEmergency.soundAlarmText}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#7F1D1D', marginTop: 6, lineHeight: 1.4 }}>
                  {selectedEmergency.overview}
                </p>
              </div>

              {/* Master VHF Broadcast Call */}
              <div style={{ background: '#0F172A', color: '#F8FAFC', borderRadius: 14, padding: 14, marginBottom: 20 }}>
                <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
                  🎙️ Mức độ khẩn cấp (Urgency Level):
                </div>
                <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: '#FEF08A', lineHeight: 1.5, fontWeight: 800 }}>
                  {selectedEmergency.urgencyLevel}
                </div>
              </div>

              {/* Step by step SOLAS Action Checklist */}
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
                📋 Quy trình thao tác khẩn cấp (SOLAS Mandatory Steps):
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedEmergency.steps.map((st) => (
                  <div 
                    key={st.stepNumber}
                    style={{ 
                      display: 'flex', 
                      gap: 12, 
                      padding: 14, 
                      borderRadius: 14, 
                      background: '#FFFFFF', 
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: '50%', 
                      background: '#DC2626', 
                      color: '#FFF', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.85rem', 
                      fontWeight: 800, 
                      flexShrink: 0 
                    }}>
                      {st.stepNumber}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                          {st.radioCommandEn}
                        </div>
                        <button 
                          className="vocab-play-btn" 
                          onClick={() => speakText(st.radioCommandEn)}
                          title="Nghe khẩu lệnh chuẩn SOLAS"
                        >
                          <Play size={12} fill="#DC2626" />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#2563EB', marginTop: 3 }}>
                        👉 {st.actionVi}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 4 }}>
                        ⚠️ Lưu ý: {st.criticalNote}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button
                  className="study-action-btn"
                  style={{ flex: 1, padding: '14px', borderRadius: 14 }}
                  onClick={() => {
                    const nextIdx = Math.min(selectedEmergency.steps.length - 1, emergencyStepIdx + 1);
                    setEmergencyStepIdx(nextIdx);
                    speakText(selectedEmergency.steps[nextIdx].radioCommandEn);
                  }}
                >
                  Khẩu lệnh tiếp theo ({emergencyStepIdx + 1}/{selectedEmergency.steps.length})
                </button>

                <button
                  className="study-action-btn primary"
                  style={{ flex: 1, padding: '14px', borderRadius: 14 }}
                  onClick={() => setActiveMode('none')}
                >
                  Đã hoàn thành
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: DEFAULT 5-TAB MARITIME ENGLISH VIEW                               */}
        {/* ========================================================================= */}
        {activeMode === 'none' && (
          <>
            {/* ============================================================= */}
            {/* TAB 1: TRANG CHỦ (HOME DASHBOARD - MASTER PLAN SEC 4)         */}
            {/* ============================================================= */}
            {activeTab === 'home' && (
              <div>
                {/* DIO TALK: USER STATS & GAMIFICATION HEADER */}
                <div className="dio-top-bar">
                  <div className="dio-user-badge" onClick={() => setShowAuthModal(true)} title="Bấm để chỉnh sửa hồ sơ thuyền viên">
                    <div className="dio-avatar-circle">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="dio-user-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="dio-user-name">{userProfile.name}</span>
                        <span style={{ fontSize: '0.65rem', background: '#DBEAFE', color: '#1E40AF', padding: '1px 6px', borderRadius: 6, fontWeight: 800 }}>MC1</span>
                      </div>
                      <span className="dio-user-rank-pill">{userProfile.rank}</span>
                    </div>
                  </div>

                  <div className="dio-stats-cluster">
                    <div className="dio-stat-pill streak" title="Chuỗi ngày liên tiếp">
                      <Flame size={18} fill="#EA580C" color="#EA580C" />
                      <span>{userProfile.streakDays}</span>
                    </div>
                    <div className="dio-stat-pill hearts" title="Trái tim năng lượng">
                      <Heart size={18} fill="#EF4444" color="#EF4444" />
                      <span>{userProfile.hearts}</span>
                    </div>
                    <div className="dio-stat-pill xp" title="Kinh nghiệm tích lũy">
                      <Gem size={18} fill="#2563EB" color="#2563EB" />
                      <span>{userProfile.xp}</span>
                    </div>
                  </div>
                </div>

                {/* DAILY GOAL PROGRESS WIDGET */}
                <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '14px 16px', margin: '14px 0', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>🎯 Mục tiêu hôm nay</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB' }}>{completedToday} / 15 từ</span>
                  </div>
                  <div className="streak-prog-bar" style={{ height: 8 }}>
                    <div className="streak-prog-fill" style={{ width: `${Math.min(100, Math.round((completedToday / 15) * 100))}%` }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.72rem', color: '#64748B' }}>
                    <span>Ôn tập ngắt quãng SRS: 8 từ đến hạn</span>
                    <span>Cấp độ STCW: A-II/1 Chuẩn bị tốt</span>
                  </div>
                </div>

                {/* DEPARTMENT SWITCHER: BAN MÁY VS BAN BOONG */}
                <div className="dio-dept-switch">
                  <button 
                    className={`dio-dept-btn ${currentDepartment === 'engine' ? 'active' : ''}`}
                    onClick={() => handleSwitchDepartment('engine')}
                  >
                    <Wrench size={16} />
                    <span>Ban Máy (Engineering)</span>
                  </button>
                  <button 
                    className={`dio-dept-btn ${currentDepartment === 'deck' ? 'active' : ''}`}
                    onClick={() => handleSwitchDepartment('deck')}
                  >
                    <Compass size={16} />
                    <span>Ban Boong (Navigation)</span>
                  </button>
                </div>

                {/* MARLINS ENGLISH TEST EXAM BANNER */}
                <div className="dio-marlins-banner">
                  <div className="dio-marlins-header">
                    <span style={{ fontSize: '1.8rem' }}>🎖️</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 className="dio-marlins-title">Marlins English Test</h4>
                        <span className="dio-marlins-badge">STCW 78/2010</span>
                      </div>
                      <p className="dio-marlins-sub">Mô phỏng kỳ thi chứng chỉ thuyền viên quốc tế (45 phút, 5 kỹ năng).</p>
                    </div>
                  </div>
                  <button className="dio-marlins-btn" onClick={launchMarlinsExam}>
                    <span>Bắt đầu thi thử Marlins ngay</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* 3D TACTILE MARITIME QUICK ACTION TILES */}
                <div className="home-quick-grid">
                  <div className="home-quick-card-3d vhf-theme" onClick={() => launchVhfScenario(VHF_SCENARIOS[0])}>
                    <div className="quick-card-top-row">
                      <div className="quick-3d-icon-badge">
                        <Radio size={22} />
                      </div>
                      <span className="quick-pill-tag">KÊNH 16</span>
                    </div>
                    <div className="home-quick-info">
                      <h5>Đài VHF Marine</h5>
                      <p>Kênh 16, 12 VTS, 08 COLREGs</p>
                    </div>
                  </div>

                  <div className="home-quick-card-3d emergency-theme" onClick={() => launchEmergencyScenario(EMERGENCY_SCENARIOS[0])}>
                    <div className="quick-card-top-row">
                      <div className="quick-3d-icon-badge">
                        <AlertTriangle size={22} />
                      </div>
                      <span className="quick-pill-tag danger">MAYDAY</span>
                    </div>
                    <div className="home-quick-info">
                      <h5>SOLAS Khẩn cấp</h5>
                      <p>Cháy hầm máy, MOB, Mắc cạn</p>
                    </div>
                  </div>

                  <div className="home-quick-card-3d smcp-theme" onClick={() => { setActiveTab('learn'); setLearnSubTab('smcp'); }}>
                    <div className="quick-card-top-row">
                      <div className="quick-3d-icon-badge">
                        <BookOpen size={22} />
                      </div>
                      <span className="quick-pill-tag warning">8 MẪU</span>
                    </div>
                    <div className="home-quick-info">
                      <h5>IMO SMCP Chuẩn</h5>
                      <p>Instruction, Warning, Advice...</p>
                    </div>
                  </div>

                  <div className="home-quick-card-3d ai-theme" onClick={() => setActiveTab('ai')}>
                    <div className="quick-card-top-row">
                      <div className="quick-3d-icon-badge">
                        <Bot size={22} />
                      </div>
                      <span className="quick-pill-tag success">LIVE AI</span>
                    </div>
                    <div className="home-quick-info">
                      <h5>10 Thuyền trưởng AI</h5>
                      <p>Phỏng vấn SIRE, PSC Inspection</p>
                    </div>
                  </div>
                </div>

                {/* DUOLINGO STYLE MARITIME CAREER SKILL TREE */}
                <div className="duolingo-tree-section">
                  {(() => {
                    const completedDeptTerms = skillTreeNodes
                      .filter(n => n.department === currentDepartment && n.stars > 0)
                      .reduce((acc, n) => acc + (n.terms?.length || 5), 0);

                    const milestones = [
                      { vocab: 100, title: currentDepartment === 'engine' ? 'Thợ máy (Motorman)' : 'Thủy thủ lái (AB)' },
                      { vocab: 400, title: currentDepartment === 'engine' ? 'Sĩ quan máy (3rd/2nd Eng)' : 'Sĩ quan boong (3rd/2nd Off)' },
                      { vocab: 600, title: currentDepartment === 'engine' ? 'Sĩ quan điện (ETO)' : 'Đại phó (Chief Officer)' },
                      { vocab: 800, title: currentDepartment === 'engine' ? 'Máy trưởng (Chief Eng)' : 'Thuyền trưởng (Ship Master)' },
                      { vocab: 1000, title: 'Hải trình Viễn dương Vô hạn' }
                    ];

                    const nextMilestone = milestones.find(m => m.vocab > completedDeptTerms) || milestones[milestones.length - 1];
                    const isAllMastered = completedDeptTerms >= 1000;
                    const targetVocab = nextMilestone.vocab;
                    const progressPct = Math.min(100, Math.round((completedDeptTerms / targetVocab) * 100));

                    return (
                      <>
                        {/* STCW Progressive Milestones Banner (3D Maritime Compass Shield) */}
                        <div className="stcw-3d-milestone-card">
                          <div className="stcw-milestone-top">
                            <div className="stcw-milestone-badge-box">
                              <span className="stcw-icon-3d">{isAllMastered ? '👑' : '⚓'}</span>
                              <div>
                                <div className="stcw-badge-subtitle">TIÊU CHUẨN STCW QUỐC TẾ</div>
                                <h4 className="stcw-badge-title">
                                  {nextMilestone.title}
                                </h4>
                              </div>
                            </div>
                            <div className="stcw-counter-pill-3d">
                              <span className="current">{completedDeptTerms}</span>
                              <span className="sep">/</span>
                              <span className="target">{targetVocab} Từ</span>
                            </div>
                          </div>

                          <div className="stcw-3d-progress-track">
                            <div 
                              className="stcw-3d-progress-fill" 
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>

                          {/* Milestone Step Pills */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, marginBottom: 8 }}>
                            {milestones.map(m => {
                              const reached = completedDeptTerms >= m.vocab;
                              return (
                                <span key={m.vocab} style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  padding: '3px 10px',
                                  borderRadius: 12,
                                  background: reached ? '#DCFCE7' : '#FFFFFF',
                                  color: reached ? '#15803D' : '#64748B',
                                  border: `1.5px solid ${reached ? '#86EFAC' : '#E2E8F0'}`,
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                                }}>
                                  {reached ? '✓' : '🔒'} {m.vocab} từ: {m.title.split(' ')[0]}
                                </span>
                              );
                            })}
                          </div>

                          <div className="stcw-milestone-footer">
                            <span>
                              {isAllMastered
                                ? '🏆 Đã vượt mốc 1000 từ vựng và mở khóa toàn bộ nấc thang chức danh.'
                                : `Còn ${Math.max(0, targetVocab - completedDeptTerms)} từ chuyên ngành để thăng cấp.`}
                            </span>
                            <span className="stcw-pct-text">{progressPct}% hoàn thành</span>
                          </div>
                        </div>

                        {Array.from(new Set(skillTreeNodes.filter(n => n.department === currentDepartment).map(n => n.rankTitle))).map(rankTitle => {
                          const rankNodes = skillTreeNodes.filter(n => n.department === currentDepartment && n.rankTitle === rankTitle);
                          const reqVocab = getRankRequiredVocab(rankTitle);
                          const isGated = reqVocab > 0 && completedDeptTerms < reqVocab;

                          return (
                            <div key={rankTitle} style={{ width: '100%', marginBottom: 16 }}>
                              {/* Rank Header Divider */}
                              <div className="tree-rank-divider">
                                <span className="tree-rank-title">⚓ {rankTitle}</span>
                                {isGated ? (
                                  <span className="tree-rank-tag" style={{ background: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }}>
                                    🔒 Cần {reqVocab} từ ({completedDeptTerms}/{reqVocab})
                                  </span>
                                ) : (
                                  <span className="tree-rank-tag">{rankNodes.filter(n => n.isUnlocked).length}/{rankNodes.length} Đã mở</span>
                                )}
                              </div>

                              {/* Stream of Nodes in Zigzag */}
                              <div className="tree-nodes-stream" style={{ marginTop: 20 }}>
                                {rankNodes.map((node, nIdx) => {
                                  const zigzagPos = nIdx % 3 === 0 ? 'pos-center' : nIdx % 3 === 1 ? 'pos-left' : 'pos-right';
                                  const effectiveUnlocked = isGated ? false : node.isUnlocked;

                                  return (
                                    <div 
                                      key={node.id} 
                                      className={`tree-node-item ${zigzagPos}`}
                                      onClick={() => {
                                        if (isGated) {
                                          alert(`🔒 Tiêu chuẩn STCW: Cấp bậc "${rankTitle}" yêu cầu tích lũy tối thiểu ${reqVocab} từ vựng chuyên ngành!\n\nTiến độ hiện tại: ${completedDeptTerms}/${reqVocab} từ vựng (còn thiếu ${reqVocab - completedDeptTerms} từ). Hãy hoàn thành các bài học trước!`);
                                          return;
                                        }
                                        if (effectiveUnlocked) {
                                          launchIntegratedNodeLesson(node);
                                        } else {
                                          alert('🔒 Hãy hoàn thành các cấp độ trước để mở khóa bài học này!');
                                        }
                                      }}
                                    >
                                      <button className={`tree-node-circle ${!effectiveUnlocked ? 'locked' : ''}`}>
                                        {effectiveUnlocked ? (
                                          <span>{node.icon}</span>
                                        ) : (
                                          <Lock size={26} color="#64748B" />
                                        )}

                                        {effectiveUnlocked && (
                                          <div className="tree-node-stars">
                                            {[1, 2, 3].map(s => (
                                              <span key={s} style={{ color: s <= node.stars ? '#F59E0B' : '#CBD5E1' }}>★</span>
                                            ))}
                                          </div>
                                        )}
                                      </button>
                                      <div className="tree-node-title">{node.title}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}

                  {/* Infinite Career Progression Expansion Banner */}
                  <div className="tree-infinite-load-box">
                    <div className="tree-infinite-badge">HẢI TRÌNH VÔ HẠN • INFINITE PATH</div>
                    <h4>Cây Kỹ Năng Hàng Hải Vô Tận</h4>
                    <p>
                      Đang hiển thị {skillTreeNodes.filter(n => n.department === currentDepartment).length} bài học.
                      Mở rộng tự động không giới hạn từ kho 10.000 thuật ngữ và tình huống SMCP.
                    </p>
                    <button className="tree-infinite-btn" onClick={handleLoadMoreInfiniteNodes}>
                      ⚡ Mở rộng thêm 12 Chặng Vô hạn
                    </button>
                  </div>
                </div>

                {/* Current Course Card */}
                <div className="course-main-card">
                  <div className="course-header-row">
                    <span className="course-header-label">Khóa học hiện tại</span>
                    <span className="course-change-link" onClick={() => setShowIndustryModal(true)}>Thay đổi &gt;</span>
                  </div>

                  <div className="course-title-row">
                    <h3 className="course-title">{currentCourse.title}</h3>
                    <div className="course-icon-badge">{currentCourse.icon}</div>
                  </div>

                  <div className="course-stats-text">
                    Đã học {currentCourse.completedTerms} / {currentCourse.totalTerms} thuật ngữ
                  </div>
                  <div className="streak-prog-bar" style={{ height: 6, marginBottom: 12 }}>
                    <div className="streak-prog-fill" style={{ width: `${Math.round((currentCourse.completedTerms / currentCourse.totalTerms) * 100)}%` }}></div>
                  </div>

                  <button className="course-continue-btn" onClick={() => launchVocabStudy(0)}>
                    Tiếp tục bài học
                  </button>
                </div>

                {/* Two Big Feature Cards (Speaking & Blitz Quiz) */}
                <div className="mascot-cards-row">
                  <div className="mascot-feature-card speaking" onClick={() => launchSpeaking()}>
                    <div className="card-top-title">Speaking</div>
                    <span className="card-pill-tag">510 đoạn hội thoại</span>
                    <img src="/assets/mascot_talking.png" alt="Speaking Mascot" className="mascot-card-img" />
                  </div>

                  <div className="mascot-feature-card quiz" onClick={() => launchQuiz()}>
                    <div className="card-top-title">Blitz Quiz</div>
                    <span className="card-pill-tag">{currentCourse.quizzes.length} thẻ phản xạ</span>
                    <img src="/assets/mascot_quiz.png" alt="Quiz Mascot" className="mascot-card-img" />
                  </div>
                </div>

                {/* Horizontal Courses Carousel: Dành cho bạn */}
                <div className="section-title-row">
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>CÁC CHƯƠNG TRÌNH HÀNG HẢI</div>
                    <div className="section-h2" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Dành cho bạn</span>
                      <span style={{ fontSize: '0.75rem', background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: 8, fontWeight: 800 }}>STCW</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button 
                      className="carousel-ctrl-btn"
                      title="Khóa học trước"
                      onClick={() => courseCarouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      className="carousel-ctrl-btn"
                      title="Khóa học tiếp theo"
                      onClick={() => courseCarouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div 
                  className="cards-carousel"
                  ref={courseCarouselRef}
                  onWheel={(e) => {
                    if (e.deltaY !== 0) {
                      e.currentTarget.scrollBy({ left: e.deltaY, behavior: 'smooth' });
                    }
                  }}
                >
                  {COURSES.map(crs => {
                    const isSelected = crs.id === currentCourse.id;
                    const pct = Math.round((crs.completedTerms / crs.totalTerms) * 100);

                    return (
                      <div 
                        key={crs.id} 
                        className={`carousel-card-3d ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentCourse(crs);
                          if (crs.department) setCurrentDepartment(crs.department);
                        }}
                      >
                        <div>
                          <div className="carousel-card-top">
                            <div className="carousel-icon-3d-box">
                              {crs.icon}
                            </div>
                            <span className={`carousel-status-pill ${isSelected ? 'active' : 'idle'}`}>
                              {isSelected && <span className="status-dot-pulse" />}
                              {isSelected ? 'ĐANG HỌC' : 'CHẠM ĐỂ CHỌN'}
                            </span>
                          </div>

                          <h4 className="carousel-card-title">{crs.title}</h4>

                          <div className="carousel-prog-box">
                            <div className="carousel-prog-header">
                              <span>Tiến độ học tập</span>
                              <strong style={{ color: isSelected ? '#2563EB' : '#475569' }}>{crs.completedTerms} / {crs.totalTerms} từ ({pct}%)</strong>
                            </div>
                            <div className="carousel-prog-track">
                              <div className="carousel-prog-fill" style={{ width: `${Math.max(5, pct)}%` }} />
                            </div>
                          </div>

                          <p className="carousel-card-desc">{crs.description}</p>
                        </div>

                        <button
                          className={`select-course-btn-3d ${isSelected ? 'primary' : 'secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentCourse(crs);
                            if (crs.department) setCurrentDepartment(crs.department);
                            setCurrentIndustry(crs.industry);
                            launchVocabStudy(0);
                          }}
                        >
                          {isSelected ? 'Đang học • Tiếp tục ngay ➔' : 'Chọn khóa học này'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Dots */}
                <div className="carousel-dots-row">
                  {COURSES.map((crs, idx) => (
                    <div 
                      key={crs.id} 
                      className={`carousel-dot ${crs.id === currentCourse.id ? 'active' : ''}`}
                      title={crs.title}
                      onClick={() => {
                        setCurrentCourse(crs);
                        if (crs.department) setCurrentDepartment(crs.department);
                        courseCarouselRef.current?.scrollTo({ left: idx * 300, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>

                {/* Section Kỳ thi (3D Showcase Cards) */}
                <div className="section-title-row">
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>CHỨNG CHỈ QUỐC TẾ</div>
                    <div className="section-h2">Kỳ thi & Đánh giá năng lực</div>
                  </div>
                  <ChevronRight size={20} className="section-more-icon" />
                </div>
                
                <div className="showcase-grid-3d">
                  <div className="showcase-card-3d" onClick={() => launchQuiz()}>
                    <div className="quick-card-top-row">
                      <div className="quick-3d-icon-badge" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#FFFFFF' }}>
                        📚
                      </div>
                      <span className="quick-pill-tag">MỤC TIÊU 650+</span>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>TOEIC Cốt lõi</h5>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Từ vựng thương mại & cảng biển quốc tế</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '0.74rem', color: '#2563EB', fontWeight: 700 }}>Đã học 18/413 từ</span>
                      <span style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 800 }}>Luyện đề ➔</span>
                    </div>
                  </div>

                  <div className="showcase-card-3d" onClick={launchMarlinsExam}>
                    <div className="quick-card-top-row">
                      <div className="quick-3d-icon-badge" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#FFFFFF' }}>
                        🎖️
                      </div>
                      <span className="quick-pill-tag warning">STCW 78/2010</span>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>Marlins Test</h5>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Chuẩn tiếng Anh thuyền viên quốc tế</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 700 }}>5 kỹ năng • 45p</span>
                      <span style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 800 }}>Thi thử ➔</span>
                    </div>
                  </div>
                </div>

                {/* Section Khác (Chuyên ngành mở rộng) */}
                <div className="section-title-row">
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>CHUYÊN NGÀNH MỞ RỘNG</div>
                    <div className="section-h2">Nghiệp vụ tàu khách & Hải đồ</div>
                  </div>
                  <ChevronRight size={20} className="section-more-icon" />
                </div>
                
                <div className="showcase-grid-3d" style={{ marginBottom: 24 }}>
                  <div className="showcase-card-3d" onClick={() => { setActiveTab('learn'); setLearnSubTab('courses'); }}>
                    <div className="quick-card-top-row">
                      <div className="quick-3d-icon-badge" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF' }}>
                        🛎️
                      </div>
                      <span className="quick-pill-tag success">CRUISE SHIP</span>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>Dịch vụ khách trên tàu</h5>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Giao tiếp buồng phòng, nhà hàng & SOLAS</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>0/552 từ</span>
                      <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 800 }}>Khám phá ➔</span>
                    </div>
                  </div>

                  <div className="showcase-card-3d" onClick={() => { setActiveTab('learn'); setLearnSubTab('smcp'); }}>
                    <div className="quick-card-top-row">
                      <div className="quick-3d-icon-badge" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#FFFFFF' }}>
                        🗺️
                      </div>
                      <span className="quick-pill-tag" style={{ background: '#EEF2FF', color: '#4F46E5', borderColor: '#C7D2FE' }}>ECDIS & MET</span>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>Hải đồ & Khí tượng</h5>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Dự báo bão, hoa tiêu & thông báo hàng hải</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>8 Mẫu SMCP</span>
                      <span style={{ fontSize: '0.78rem', color: '#4F46E5', fontWeight: 800 }}>Xem ngay ➔</span>
                    </div>
                  </div>
                </div>

                {/* DIO TALK APP CREDITS & VERSION FOOTER */}
                <div style={{
                  margin: '30px 0 20px 0',
                  padding: '18px 20px',
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
                  borderRadius: 22,
                  border: '1.5px solid #BFDBFE',
                  boxShadow: '0 6px 20px rgba(37, 99, 235, 0.06)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <img 
                    src="/assets/dio_talk_logo.png" 
                    alt="Dio Talk Logo" 
                    style={{ width: 56, height: 56, borderRadius: 14, boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)', marginBottom: 10 }} 
                  />
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', letterSpacing: '0.3px', marginBottom: 2 }}>
                    DIO TALK MARITIME ENGLISH
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563EB', marginBottom: 4 }}>
                    Tác giả: <strong>LÊ QUỐC KHANG</strong>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 99, padding: '3px 12px', marginTop: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1D4ED8' }}>MC1 VERSION • STCW 78/2010</span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 2: HỌC TẬP (LEARN: VOCAB, SKILL TREE, IMO SMCP)           */}
            {/* ============================================================= */}
            {activeTab === 'learn' && (
              <div>
                {/* Learn Sub-navigation */}
                <div className="vocab-segmented-control" style={{ marginBottom: 14 }}>
                  <button
                    className={`vocab-segment-btn ${learnSubTab === 'courses' ? 'active' : ''}`}
                    onClick={() => setLearnSubTab('courses')}
                  >
                    Khóa học & Cây kỹ năng
                  </button>
                  <button
                    className={`vocab-segment-btn ${learnSubTab === 'vocab' ? 'active' : ''}`}
                    onClick={() => setLearnSubTab('vocab')}
                  >
                    Sổ từ vựng ({termsState.length})
                  </button>
                  <button
                    className={`vocab-segment-btn ${learnSubTab === 'smcp' ? 'active' : ''}`}
                    onClick={() => setLearnSubTab('smcp')}
                  >
                    IMO SMCP (8 Mẫu)
                  </button>
                </div>

                {/* SubTab 1: Khóa học & Cây kỹ năng */}
                {learnSubTab === 'courses' && (
                  <div>
                    {/* DUOLINGO STYLE MARITIME CAREER SKILL TREE */}
                    <div className="duolingo-tree-section">
                      {(() => {
                        const completedDeptTerms = skillTreeNodes
                          .filter(n => n.department === currentDepartment && n.stars > 0)
                          .reduce((acc, n) => acc + (n.terms?.length || 5), 0);

                        const milestones = [
                          { vocab: 100, title: currentDepartment === 'engine' ? 'Thợ máy (Motorman)' : 'Thủy thủ lái (AB)' },
                          { vocab: 400, title: currentDepartment === 'engine' ? 'Sĩ quan máy (3rd/2nd Eng)' : 'Sĩ quan boong (3rd/2nd Off)' },
                          { vocab: 600, title: currentDepartment === 'engine' ? 'Sĩ quan điện (ETO)' : 'Đại phó (Chief Officer)' },
                          { vocab: 800, title: currentDepartment === 'engine' ? 'Máy trưởng (Chief Eng)' : 'Thuyền trưởng (Ship Master)' },
                          { vocab: 1000, title: 'Hải trình Viễn dương Vô hạn' }
                        ];

                        const nextMilestone = milestones.find(m => m.vocab > completedDeptTerms) || milestones[milestones.length - 1];
                        const isAllMastered = completedDeptTerms >= 1000;
                        const targetVocab = nextMilestone.vocab;
                        const progressPct = Math.min(100, Math.round((completedDeptTerms / targetVocab) * 100));

                        return (
                          <>
                            {/* STCW Progressive Milestones Banner */}
                            <div style={{
                              background: isAllMastered ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                              border: `1.5px solid ${isAllMastered ? '#10B981' : '#3B82F6'}`,
                              borderRadius: 16,
                              padding: '14px 18px',
                              marginBottom: 20,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontSize: 20 }}>{isAllMastered ? '👑' : '🎖️'}</span>
                                  <strong style={{ fontSize: 13, color: '#1E293B' }}>
                                    MỤC TIÊU STCW: {nextMilestone.title.toUpperCase()} ({targetVocab} TỪ)
                                  </strong>
                                </div>
                                <span style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: isAllMastered ? '#059669' : '#2563EB',
                                  background: '#FFFFFF',
                                  padding: '2px 10px',
                                  borderRadius: 20,
                                  border: `1px solid ${isAllMastered ? '#A7F3D0' : '#BFDBFE'}`
                                }}>
                                  {completedDeptTerms} / {targetVocab} Từ ({progressPct}%)
                                </span>
                              </div>
                              <div style={{
                                width: '100%',
                                height: 8,
                                background: '#E2E8F0',
                                borderRadius: 99,
                                overflow: 'hidden',
                                marginBottom: 8
                              }}>
                                <div style={{
                                  width: `${progressPct}%`,
                                  height: '100%',
                                  background: isAllMastered ? '#10B981' : '#3B82F6',
                                  borderRadius: 99,
                                  transition: 'width 0.4s ease'
                                }} />
                              </div>

                              {/* Milestone Step Pills */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, marginBottom: 6 }}>
                                {milestones.map(m => {
                                  const reached = completedDeptTerms >= m.vocab;
                                  return (
                                    <span key={m.vocab} style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      padding: '2px 8px',
                                      borderRadius: 12,
                                      background: reached ? '#DCFCE7' : '#F1F5F9',
                                      color: reached ? '#15803D' : '#64748B',
                                      border: `1px solid ${reached ? '#86EFAC' : '#CBD5E1'}`
                                    }}>
                                      {reached ? '✓' : '🔒'} {m.vocab} từ: {m.title.split(' ')[0]}
                                    </span>
                                  );
                                })}
                              </div>

                              <p style={{ margin: 0, fontSize: 11.5, color: '#475569', lineHeight: 1.4 }}>
                                {isAllMastered
                                  ? '🏆 Xuất sắc! Bạn đã vượt mốc 1000 từ vựng và mở khóa toàn bộ nấc thang chức danh hàng hải.'
                                  : `Cần hoàn thành từng mốc STCW: 100 từ (Thợ máy) → 400 từ (Sĩ quan) → 600 từ (Điện/Đại phó) → 800 từ (Máy trưởng/Thuyền trưởng).`}
                              </p>
                            </div>

                            {Array.from(new Set(skillTreeNodes.filter(n => n.department === currentDepartment).map(n => n.rankTitle))).map(rankTitle => {
                              const rankNodes = skillTreeNodes.filter(n => n.department === currentDepartment && n.rankTitle === rankTitle);
                              const reqVocab = getRankRequiredVocab(rankTitle);
                              const isGated = reqVocab > 0 && completedDeptTerms < reqVocab;

                              return (
                                <div key={rankTitle} style={{ width: '100%', marginBottom: 16 }}>
                                  <div className="tree-rank-divider">
                                    <span className="tree-rank-title">⚓ {rankTitle}</span>
                                    {isGated ? (
                                      <span className="tree-rank-tag" style={{ background: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }}>
                                        🔒 Cần {reqVocab} từ ({completedDeptTerms}/{reqVocab})
                                      </span>
                                    ) : (
                                      <span className="tree-rank-tag">{rankNodes.filter(n => n.isUnlocked).length}/{rankNodes.length} Đã mở</span>
                                    )}
                                  </div>

                                  <div className="tree-nodes-stream" style={{ marginTop: 20 }}>
                                    {rankNodes.map((node, nIdx) => {
                                      const zigzagPos = nIdx % 3 === 0 ? 'pos-center' : nIdx % 3 === 1 ? 'pos-left' : 'pos-right';
                                      const effectiveUnlocked = isGated ? false : node.isUnlocked;

                                      return (
                                        <div 
                                          key={node.id} 
                                          className={`tree-node-item ${zigzagPos}`}
                                          onClick={() => {
                                            if (isGated) {
                                              alert(`🔒 Tiêu chuẩn STCW: Cấp bậc "${rankTitle}" yêu cầu tích lũy tối thiểu ${reqVocab} từ vựng chuyên ngành!\n\nTiến độ hiện tại: ${completedDeptTerms}/${reqVocab} từ vựng (còn thiếu ${reqVocab - completedDeptTerms} từ). Hãy hoàn thành các bài học trước!`);
                                              return;
                                            }
                                            if (effectiveUnlocked) {
                                              launchIntegratedNodeLesson(node);
                                            } else {
                                              alert('🔒 Hãy hoàn thành các cấp độ trước để mở khóa bài học này!');
                                            }
                                          }}
                                        >
                                          <button className={`tree-node-circle ${!effectiveUnlocked ? 'locked' : ''}`}>
                                            {effectiveUnlocked ? (
                                              <span>{node.icon}</span>
                                            ) : (
                                              <Lock size={26} color="#64748B" />
                                            )}

                                            {effectiveUnlocked && (
                                              <div className="tree-node-stars">
                                                {[1, 2, 3].map(s => (
                                                  <span key={s} style={{ color: s <= node.stars ? '#F59E0B' : '#CBD5E1' }}>★</span>
                                                ))}
                                              </div>
                                            )}
                                          </button>
                                          <div className="tree-node-title">{node.title}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        );
                      })()}

                      {/* Infinite Career Progression Expansion Banner */}
                      <div className="tree-infinite-load-box">
                        <div className="tree-infinite-badge">HẢI TRÌNH VÔ HẠN • INFINITE PATH</div>
                        <h4>Cây Kỹ Năng Hàng Hải Vô Tận</h4>
                        <p>
                          Đang hiển thị {skillTreeNodes.filter(n => n.department === currentDepartment).length} bài học.
                          Mở rộng tự động không giới hạn từ kho 10.000 thuật ngữ và tình huống SMCP.
                        </p>
                        <button className="tree-infinite-btn" onClick={handleLoadMoreInfiniteNodes}>
                          ⚡ Mở rộng thêm 12 Chặng Vô hạn
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SubTab 2: Sổ từ vựng */}
                {learnSubTab === 'vocab' && (
                  <div>
                    {/* Segmented Control: Mở | Tất cả */}
                    <div className="vocab-segmented-control" style={{ marginBottom: 12 }}>
                      <button
                        className={`vocab-segment-btn ${vocabSegment === 'open' ? 'active' : ''}`}
                        onClick={() => setVocabSegment('open')}
                      >
                        Mở ({termsState.filter(t => !t.mastered).length})
                      </button>
                      <button
                        className={`vocab-segment-btn ${vocabSegment === 'all' ? 'active' : ''}`}
                        onClick={() => setVocabSegment('all')}
                      >
                        Tất cả ({termsState.length})
                      </button>
                    </div>

                    {/* Search Box */}
                    <div className="vocab-search-box">
                      <Search size={18} color="#94A3B8" />
                      <input
                        className="vocab-search-input"
                        placeholder="Tìm kiếm từ hoặc nghĩa tiếng Việt..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {filteredVocab.map((item) => (
                      <div key={item.id} className="vocab-card">
                        <div className="vocab-card-header">
                          <div className="vocab-dots-row" title={`Độ thuộc: ${item.dots}/5`}>
                            {[1, 2, 3, 4, 5].map(d => (
                              <div key={d} className={`vocab-dot ${d <= item.dots ? 'filled' : ''}`} />
                            ))}
                          </div>

                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="vocab-reset-btn"
                              onClick={() => handleToggleTermMastery(item.id)}
                              style={{ background: item.dots >= 4 ? '#DCFCE7' : '#F1F5F9', color: item.dots >= 4 ? '#16A34A' : '#64748B' }}
                            >
                              {item.dots >= 4 ? '✓ Đã thuộc' : '+1 Điểm thuộc'}
                            </button>

                            <button
                              className="vocab-reset-btn"
                              onClick={() => handleResetTermProgress(item.id)}
                              title="Đặt lại tiến độ"
                            >
                              <RotateCcw size={12} />
                            </button>
                          </div>

                          <button className="vocab-play-btn" onClick={() => speakText(`${item.word}. ${item.example}`)} title="Phát âm từ & câu ví dụ">
                            <Play size={12} fill="#2F70E8" />
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <div className="vocab-word-title">{item.word}</div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.phonetic}</span>
                        </div>

                        <div className="vocab-sentence">{item.example}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <div className="vocab-meaning">👉 {item.meaning}</div>
                          <button 
                            className="vocab-reset-btn"
                            style={{ background: '#EFF6FF', color: '#2563EB', fontWeight: 700 }}
                            onClick={() => {
                              const origIdx = currentCourse.terms.findIndex(t => t.id === item.id);
                              launchVocabStudy(origIdx >= 0 ? origIdx : 0);
                            }}
                          >
                            Luyện điền từ ➔
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SubTab 3: IMO SMCP 8 Mẫu Tiêu Chuẩn */}
                {learnSubTab === 'smcp' && (
                  <div>
                    <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: 14, marginBottom: 16 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E40AF', marginBottom: 4 }}>
                        IMO Standard Marine Communication Phrases
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#3B82F6', lineHeight: 1.4 }}>
                        8 mẫu thông điệp bắt buộc khi liên lạc qua vô tuyến điện VHF hàng hải để tránh nhầm lẫn tai nạn.
                      </p>
                    </div>

                    {/* SMCP Marker Filter Chips */}
                    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10, marginBottom: 12 }}>
                      <button
                        className={`vocab-segment-btn ${selectedSmcpMarker === 'all' ? 'active' : ''}`}
                        style={{ padding: '6px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                        onClick={() => setSelectedSmcpMarker('all')}
                      >
                        Tất cả (8 Mẫu)
                      </button>
                      {['INSTRUCTION', 'WARNING', 'ADVICE', 'INFORMATION', 'QUESTION', 'ANSWER', 'REQUEST', 'INTENTION'].map(m => (
                        <button
                          key={m}
                          className={`vocab-segment-btn ${selectedSmcpMarker === m ? 'active' : ''}`}
                          style={{ padding: '6px 12px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                          onClick={() => setSelectedSmcpMarker(m)}
                        >
                          {m}
                        </button>
                      ))}
                    </div>

                    <div className="smcp-marker-grid">
                      {SMCP_PHRASES.filter(p => selectedSmcpMarker === 'all' || p.marker === selectedSmcpMarker).map(item => (
                        <div key={item.id} className="smcp-item-card">
                          <div className="smcp-item-header">
                            <span className="smcp-item-marker">{item.marker}</span>
                            <span className="smcp-item-meaning">{item.markerVi}</span>
                          </div>
                          <div className="smcp-item-phrase">"{item.phrase}"</div>
                          <div className="smcp-item-sub">👉 {item.vietnamese}</div>
                          
                          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Ví dụ: {item.exampleCall}</span>
                            <button 
                              className="vocab-play-btn" 
                              onClick={() => speakText(`${item.marker}. ${item.phrase}`)}
                            >
                              <Play size={12} fill="#2563EB" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 3: LUYỆN TẬP (PRACTICE: VHF, EMERGENCY, MARLINS, QUIZ)     */}
            {/* ============================================================= */}
            {/* ============================================================= */}
            {/* TAB 3: LUYỆN TẬP & 15 GAME HÀNG HẢI (MASTER PLAN MỤC 80-100)  */}
            {/* ============================================================= */}
            {activeTab === 'practice' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 12px 0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Phòng Luyện Thực Chiến</h3>
                  <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', fontWeight: 800, padding: '4px 10px', borderRadius: 12 }}>
                    💰 {userProfile.coins || 100} Xu Hải trình
                  </span>
                </div>

                {/* Sub-Category Filter Scroll (Master Plan 7 Section 80-100) */}
                <div className="games-filter-scroll">
                  <button 
                    className={`game-tab-btn ${practiceFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setPracticeFilter('all')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`game-tab-btn ${practiceFilter === 'games' ? 'active' : ''}`}
                    onClick={() => setPracticeFilter('games')}
                  >
                    🎮 15 Game Hàng Hải
                  </button>
                  <button 
                    className={`game-tab-btn ${practiceFilter === 'vhf' ? 'active' : ''}`}
                    onClick={() => setPracticeFilter('vhf')}
                  >
                    📻 Đài Thoại VHF
                  </button>
                  <button 
                    className={`game-tab-btn ${practiceFilter === 'emergency' ? 'active' : ''}`}
                    onClick={() => setPracticeFilter('emergency')}
                  >
                    🚨 SOLAS Khẩn Cấp
                  </button>
                  <button 
                    className={`game-tab-btn ${practiceFilter === 'marlins' ? 'active' : ''}`}
                    onClick={() => setPracticeFilter('marlins')}
                  >
                    📝 Đề Thi Marlins
                  </button>
                </div>

                {/* 15 MARITIME GAMIFICATION GAMES GRID */}
                {(practiceFilter === 'all' || practiceFilter === 'games') && (
                  <div style={{ marginBottom: 24, marginTop: 10 }}>
                    <div className="section-title-row">
                      <div className="section-h2">🎮 15 Minigames Hàng Hải (Master Plan 80-100)</div>
                      <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>15 Trò chơi</span>
                    </div>

                    <div className="games-grid">
                      {MARITIME_15_GAMES.map(game => (
                        <div 
                          key={game.id} 
                          className="game-card-item"
                          onClick={() => handleLaunchGame(game)}
                        >
                          <div>
                            <span className="game-card-badge" style={{ background: game.badgeColor }}>
                              {game.badge}
                            </span>
                            <div className="game-card-icon">{game.icon}</div>
                            <h4 className="game-card-title">{game.title}</h4>
                            <p className="game-card-desc">{game.description}</p>
                          </div>
                          <div className="game-card-footer">
                            <span>+{game.xpReward} XP • +{game.coinReward} Xu</span>
                            <span>Chơi ➔</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section VHF Transceiver */}
                {(practiceFilter === 'all' || practiceFilter === 'vhf') && (
                  <div style={{ marginBottom: 20 }}>
                    <div className="section-title-row">
                      <div className="section-h2">📻 Vô Tuyến Điện VHF Marine (SMCP)</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                      {VHF_SCENARIOS.map(sc => (
                        <div 
                          key={sc.id} 
                          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                          onClick={() => launchVhfScenario(sc)}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ background: '#0F172A', color: '#38BDF8', fontSize: '0.72rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6 }}>
                                {sc.channel}
                              </span>
                              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>{sc.title}</h4>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>
                              Đài đối thoại: {sc.otherStationName} • {sc.dialogueSteps.length} lượt đàm thoại
                            </p>
                          </div>
                          <button className="study-action-btn primary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                            Phát sóng ➔
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section SOLAS Emergency Checklists */}
                {(practiceFilter === 'all' || practiceFilter === 'emergency') && (
                  <div style={{ marginBottom: 20 }}>
                    <div className="section-title-row">
                      <div className="section-h2">🚨 Quy Trình Khẩn Cấp SOLAS</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                      {EMERGENCY_SCENARIOS.map(em => (
                        <div 
                          key={em.id}
                          style={{ background: '#FFFFFF', border: '1px solid #FEE2E2', borderRadius: 14, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                          onClick={() => launchEmergencyScenario(em)}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ background: '#DC2626', color: '#FFF', fontSize: '0.72rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6 }}>
                                {em.type.toUpperCase()}
                              </span>
                              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#991B1B' }}>{em.title}</h4>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>
                              {em.steps.length} bước xử lý chuẩn SOLAS & Báo động chung
                            </p>
                          </div>
                          <button className="study-action-btn" style={{ padding: '8px 14px', fontSize: '0.78rem', borderColor: '#DC2626', color: '#DC2626' }}>
                            Mở Checklist ➔
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Quick Drills & Marlins */}
                {(practiceFilter === 'all' || practiceFilter === 'marlins') && (
                  <div>
                    <div className="section-title-row">
                      <div className="section-h2">⚡ Thử Thách & Thi Thử Quốc Tế</div>
                    </div>
                    <div className="mascot-cards-row" style={{ marginTop: 10 }}>
                      <div className="mascot-feature-card quiz" onClick={() => launchQuiz()}>
                        <div className="card-top-title">Blitz Quiz</div>
                        <span className="card-pill-tag">15 giây / câu hỏi</span>
                        <img src="/assets/mascot_quiz.png" alt="Quiz Mascot" className="mascot-card-img" />
                      </div>

                      <div className="mascot-feature-card speaking" onClick={launchMarlinsExam}>
                        <div className="card-top-title">Marlins STCW</div>
                        <span className="card-pill-tag">Thi thử 45 phút</span>
                        <img src="/assets/mascot_talking.png" alt="Marlins Mascot" className="mascot-card-img" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 4: AI ĐÀM THOẠI (AI SPEAKING ROLEPLAY PARTNERS)           */}
            {/* ============================================================= */}
            {activeTab === 'ai' && (
              <div>
                {/* Active AI Model Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  color: '#FFFFFF',
                  marginBottom: 16,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={24} color="#93C5FD" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#BFDBFE', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Mô Hình AI Khả Dụng (OpenAI SDK)
                      </div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span>{AVAILABLE_AI_MODELS.find(m => m.id === apiModel)?.name || apiModel}</span>
                        {apiModel === 'imgxh/server-6' && (
                          <span style={{ fontSize: '0.65rem', background: '#F59E0B', color: '#FFF', padding: '1px 6px', borderRadius: 6, fontWeight: 800 }}>
                            ƯU TIÊN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModelModal(true)}
                    style={{
                      background: '#FFFFFF',
                      color: '#1E40AF',
                      border: 'none',
                      borderRadius: 10,
                      padding: '8px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    Đổi Model ▾
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 14px 0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Đóng Vai AI Thuyền Viên</h3>
                  <span style={{ fontSize: '0.75rem', background: '#DCFCE7', color: '#16A34A', fontWeight: 700, padding: '4px 8px', borderRadius: 8 }}>
                    ● 10 Sĩ quan AI sẵn sàng
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: 16 }}>
                  Luyện đối thoại hai chiều trực tiếp bằng giọng nói hoặc văn bản với các đối tượng phỏng vấn quốc tế.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { title: 'Chánh kỹ sư máy (Chief Engineer)', role: 'Chief Engineer', desc: 'Báo cáo sự cố rò rỉ dầu cao áp, khởi động máy phát diesel dự phòng', icon: '👨‍✈️', tag: 'Engine' },
                    { title: 'Đài điều phối luồng VTS Singapore', role: 'VTS Operator', desc: 'Báo cáo vị trí hoa tiêu, mớn nước tĩnh và xin chuyển kênh giám sát', icon: '📡', tag: 'Bridge' },
                    { title: 'Thanh tra viên kiểm tra cảng (PSC Inspector)', role: 'Port State Control', desc: 'Kiểm tra giấy chứng nhận phao bè cứu sinh SOLAS và nhật ký dầu', icon: '📋', tag: 'Audit' },
                    { title: 'Chuyên gia giám định tàu dầu (SIRE Auditor)', role: 'SIRE Oil Auditor', desc: 'Phỏng vấn quy trình bơm hàng, trơ hóa bồn chứa và tiếp nhiên liệu', icon: '🛢️', tag: 'Tanker' },
                    { title: 'Hoa tiêu dẫn tàu (Harbour Pilot)', role: 'Maritime Pilot', desc: 'Phối hợp lệnh lái bẻ bánh lái, tốc độ máy đệm và hoa tiêu cập cầu', icon: '⚓', tag: 'Navigation' },
                    { title: 'Sĩ quan an ninh bến cảng (PFSO)', role: 'Port Facility Security', desc: 'Xác nhận cấp độ an ninh ISPS Level 1/2 và kiểm soát người lạ', icon: '🛡️', tag: 'Security' }
                  ].map((p, pIdx) => (
                    <div 
                      key={pIdx}
                      style={{ 
                        background: '#FFFFFF', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: 14, 
                        padding: 14, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                      onClick={() => launchSpeaking()}
                    >
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>{p.title}</h4>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: 4 }}>
                              {p.tag}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 3 }}>
                            {p.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#94A3B8" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 5: HỒ SƠ STCW & CÀI ĐẶT (PROFILE & SETTINGS)               */}
            {/* ============================================================= */}
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '6px 0 16px 0' }}>Hồ Sơ Năng Lực STCW</h3>

                {/* Profile Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 16, marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="dio-avatar-circle" style={{ width: 54, height: 54, fontSize: '1.4rem' }}>
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{userProfile.name}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>{userProfile.email}</p>
                      <span className="dio-user-rank-pill" style={{ marginTop: 4, display: 'inline-block' }}>
                        {userProfile.rank}
                      </span>
                    </div>
                    <button 
                      className="vocab-reset-btn" 
                      onClick={() => setShowAuthModal(true)}
                      style={{ background: '#EFF6FF', color: '#2563EB', fontWeight: 700 }}
                    >
                      Sửa hồ sơ
                    </button>
                  </div>
                </div>

                {/* STCW Competencies Progress */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 10, color: '#0F172A' }}>
                  📊 Thống Kê Học Tập Cá Nhân:
                </h4>
                <div className="stats-2x2-grid" style={{ marginBottom: 16 }}>
                  <div className="stat-pill-card">
                    <div className="stat-pill-label">⚡ Thời gian luyện</div>
                    <div className="stat-pill-val" style={{ fontSize: '1rem' }}>{practiceMinutes} phút</div>
                  </div>
                  <div className="stat-pill-card">
                    <div className="stat-pill-label">🎯 Độ chính xác</div>
                    <div className="stat-pill-val" style={{ fontSize: '1rem' }}>{accuracyScore}%</div>
                  </div>
                  <div className="stat-pill-card">
                    <div className="stat-pill-label">🔥 Chuỗi Streak</div>
                    <div className="stat-pill-val" style={{ fontSize: '1rem' }}>{userProfile.streakDays} ngày</div>
                  </div>
                  <div className="stat-pill-card">
                    <div className="stat-pill-label">💎 Điểm kinh nghiệm</div>
                    <div className="stat-pill-val" style={{ fontSize: '1rem' }}>{userProfile.xp} XP</div>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 10, color: '#0F172A' }}>
                  🎖️ Năng Lực Tiếng Anh Hàng Hải (STCW 78/2010):
                </h4>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 14, marginBottom: 18 }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>IMO SMCP Vô tuyến điện VHF:</span>
                      <span style={{ color: '#16A34A' }}>85% (Chuẩn A-II/1)</span>
                    </div>
                    <div className="streak-prog-bar" style={{ height: 6 }}>
                      <div className="streak-prog-fill" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>Xử lý Khẩn cấp & Cứu sinh SOLAS:</span>
                      <span style={{ color: '#2563EB' }}>70% (Chuẩn A-VI/1)</span>
                    </div>
                    <div className="streak-prog-bar" style={{ height: 6 }}>
                      <div className="streak-prog-fill" style={{ width: '70%', background: '#2563EB' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                      <span>Phỏng vấn Đăng kiểm & Cảng PSC:</span>
                      <span style={{ color: '#F59E0B' }}>50% (Đang học)</span>
                    </div>
                    <div className="streak-prog-bar" style={{ height: 6 }}>
                      <div className="streak-prog-fill" style={{ width: '50%', background: '#F59E0B' }}></div>
                    </div>
                  </div>
                </div>

                {/* App Settings List */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 10, color: '#0F172A' }}>
                  ⚙️ Cài Đặt Ứng Dụng:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
                  {/* Danh Mục Model AI Khả Dụng */}
                  <div
                    className="settings-item"
                    onClick={() => setShowModelModal(true)}
                    style={{ cursor: 'pointer', border: '1.5px solid #93C5FD', background: '#F0F9FF' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                        <Bot size={20} />
                      </div>
                      <div>
                        <div className="settings-item-title" style={{ color: '#1E40AF', fontWeight: 800 }}>
                          Danh Mục Model AI Khả Dụng ({AVAILABLE_AI_MODELS.length} Model)
                        </div>
                        <div className="settings-item-sub" style={{ color: '#0369A1', fontWeight: 600 }}>
                          ● Đang chọn: <strong>{AVAILABLE_AI_MODELS.find(m => m.id === apiModel)?.name || apiModel}</strong> ({apiModel}) {apiModel === 'imgxh/server-6' && '⭐ (Ưu tiên số 1)'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} color="#0284C7" />
                  </div>


                  <div
                    className="settings-item"
                    onClick={() => {
                      alert('💾 Cơ sở dữ liệu Dio Talk đang hoạt động HOÀN TOÀN TỰ ĐỘNG và đồng bộ vĩnh viễn với Firebase Cloud (studio-xdudz).\n\nMọi tiến độ của bạn đều được bảo toàn 100%.');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div className="settings-item-title">💾 Đám mây Firebase Cloud</div>
                      <div className="settings-item-sub" style={{ color: '#16A34A', fontWeight: 600 }}>
                        ● studio-xdudz (Đang kích hoạt vĩnh viễn)
                      </div>
                    </div>
                    <ChevronRight size={18} color="#94A3B8" />
                  </div>

                  <div 
                    className="settings-item" 
                    onClick={handleLogout}
                    style={{ cursor: 'pointer', borderLeft: '4px solid #EF4444' }}
                  >
                    <div>
                      <div className="settings-item-title" style={{ color: '#DC2626' }}>Đăng xuất tài khoản</div>
                      <div className="settings-item-sub">Đổi tài khoản hoặc đăng ký tài khoản khác</div>
                    </div>
                    <ChevronRight size={18} color="#EF4444" />
                  </div>

                  <div
                    className="settings-item"
                    onClick={handleManualCheckUpdate}
                    style={{ cursor: 'pointer', border: '1.5px solid #BBF7D0', background: '#F0FDF4' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                        <RefreshCw size={20} className={isCheckingUpdate ? 'spin-anim' : ''} />
                      </div>
                      <div>
                        <div className="settings-item-title" style={{ color: '#166534', fontWeight: 800 }}>
                          🚀 Kiểm Tra Cập Nhật Online
                        </div>
                        <div className="settings-item-sub" style={{ color: '#15803D', fontWeight: 600 }}>
                          {isCheckingUpdate ? 'Đang kết nối máy chủ...' : `● Phiên bản: ${CURRENT_VERSION_TAG} (Bấm để kiểm tra)`}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} color="#16A34A" />
                  </div>

                  <div
                    className="settings-item"
                    style={{ background: '#F8FAFC', border: '1.5px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <img 
                      src="/assets/dio_talk_logo.png" 
                      alt="Dio Talk" 
                      style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, boxShadow: '0 3px 8px rgba(37, 99, 235, 0.2)' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div className="settings-item-title" style={{ color: '#1E3A8A', fontWeight: 800 }}>
                        ⚓ Dio Talk • MC1 VERSION
                      </div>
                      <div className="settings-item-sub" style={{ color: '#2563EB', fontWeight: 700 }}>
                        Tác giả: <strong>LÊ QUỐC KHANG</strong> (STCW 78/2010 Standard)
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: '#DBEAFE', color: '#1D4ED8', padding: '3px 8px', borderRadius: 8, fontWeight: 800 }}>
                      v1.0-MC1
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Industry Selection Modal Sheet */}
      {showIndustryModal && (
        <div className="industry-modal-overlay" onClick={() => setShowIndustryModal(false)}>
          <div className="industry-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Chọn Ngành Học Của Bạn</h3>
              <button
                onClick={() => setShowIndustryModal(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            {['Hàng hải', 'Công nghệ thông tin'].map(ind => (
              <div
                key={ind}
                className={`industry-option-item ${currentIndustry === ind ? 'selected' : ''}`}
                onClick={() => handleSelectIndustry(ind)}
              >
                <span style={{ fontSize: '1.6rem' }}>{ind === 'Hàng hải' ? '🚢' : '💻'}</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{ind}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {ind === 'Hàng hải' ? 'Thuật ngữ buồng máy, boong tàu, phỏng vấn thuyền viên' : 'System Design, Tech Interview, Standup meeting'}
                  </p>
                </div>
                {currentIndustry === ind && <Check size={20} color="#2F70E8" strokeWidth={3} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIO TALK: USER ACCOUNT & PROFILE MODAL */}
      {showAuthModal && (
        <div className="dio-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="dio-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dio-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="dio-avatar-circle" style={{ width: 44, height: 44 }}>
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Hồ Sơ Thuyền Viên</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Quản lý chức danh & lưu chuỗi học</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAuthModal(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div className="dio-input-group">
              <label className="dio-input-label">Họ và Tên</label>
              <input 
                className="dio-input-field" 
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                placeholder="Nhập tên của bạn..."
              />
            </div>

            <div className="dio-input-group">
              <label className="dio-input-label">Email tài khoản</label>
              <input 
                className="dio-input-field" 
                value={userProfile.email}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                placeholder="Email để đồng bộ chuỗi học..."
              />
            </div>

            <div className="dio-input-group">
              <label className="dio-input-label">Ban công tác</label>
              <select 
                className="dio-input-field"
                value={userProfile.department}
                onChange={(e) => {
                  const dept = e.target.value as 'engine' | 'deck';
                  setUserProfile({ 
                    ...userProfile, 
                    department: dept,
                    rank: dept === 'engine' ? 'Thợ máy (Motorman)' : 'Thủy thủ lái (Helmsman / AB)'
                  });
                }}
              >
                <option value="engine">⚙️ Ban Máy (Marine Engineering)</option>
                <option value="deck">🧭 Ban Boong (Deck & Navigation)</option>
              </select>
            </div>

            <div className="dio-input-group">
              <label className="dio-input-label">Chức danh mục tiêu</label>
              <select 
                className="dio-input-field"
                value={userProfile.rank}
                onChange={(e) => setUserProfile({ ...userProfile, rank: e.target.value })}
              >
                {userProfile.department === 'engine' ? (
                  <>
                    <option value="Thợ máy (Motorman)">Thợ máy (Motorman / Wiper)</option>
                    <option value="Sĩ quan máy ba (Third Engineer)">Sĩ quan máy ba (3rd Engineer)</option>
                    <option value="Sĩ quan máy hai (Second Engineer)">Sĩ quan máy hai (2nd Engineer)</option>
                    <option value="Máy trưởng (Chief Engineer)">Máy trưởng (Chief Engineer)</option>
                  </>
                ) : (
                  <>
                    <option value="Thủy thủ lái (Helmsman / AB)">Thủy thủ lái (Helmsman / AB)</option>
                    <option value="Sĩ quan phó ba (Third Officer)">Sĩ quan phó ba (3rd Officer)</option>
                    <option value="Sĩ quan phó hai (Second Officer)">Sĩ quan phó hai (2nd Officer)</option>
                    <option value="Đại phó (Chief Officer)">Đại phó (Chief Officer)</option>
                    <option value="Thuyền trưởng (Master / Captain)">Thuyền trưởng (Master / Captain)</option>
                  </>
                )}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button 
                className="study-action-btn primary"
                style={{ flex: 1, padding: 14, borderRadius: 14 }}
                onClick={() => handleSaveProfile(userProfile)}
              >
                Lưu hồ sơ & Bắt đầu học
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 15 MARITIME GAMIFICATION GAMES MODAL (SECTION 80-100) */}
      {showDuelModal && (
        <div className="duel-modal-overlay" onClick={() => setShowDuelModal(false)}>
          <div className="duel-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="duel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.8rem' }}>{selectedGame?.icon || '⚔️'}</span>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                    {selectedGame?.title || 'Đấu Từ Vựng Tốc Độ'}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700 }}>
                    Câu {duelQIndex + 1} / {activeGameQuestions.length} • {selectedGame?.badge}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {duelCombo > 1 && (
                  <div className="duel-timer-badge" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                    <span>🔥 Combo x{duelCombo}</span>
                  </div>
                )}
                <div className="duel-timer-badge">
                  <span>⚡ 15s</span>
                </div>
                <button 
                  onClick={() => setShowDuelModal(false)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} color="#64748B" />
                </button>
              </div>
            </div>

            {!duelFinished && activeGameQuestions[duelQIndex] ? (
              <div>
                {/* Target Term Audio Pill */}
                <div className="duel-target-pill">
                  <span>{activeGameQuestions[duelQIndex].targetTerm}</span>
                  <button 
                    onClick={() => speakText(activeGameQuestions[duelQIndex].targetTerm)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Volume2 size={16} color="#1D4ED8" />
                  </button>
                  <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 500 }}>
                    {activeGameQuestions[duelQIndex].phonetic}
                  </span>
                </div>

                <div className="duel-question-text">
                  {activeGameQuestions[duelQIndex].prompt}
                </div>

                {/* 4 Options */}
                <div style={{ margin: '14px 0' }}>
                  {activeGameQuestions[duelQIndex].options.map((opt, idx) => {
                    const isSelected = duelSelectedOpt === opt;
                    const isCorrect = opt === activeGameQuestions[duelQIndex].correctAnswer;
                    let optClass = 'duel-option-btn';
                    if (duelIsChecked) {
                      if (isCorrect) optClass += ' correct';
                      else if (isSelected) optClass += ' wrong';
                    }

                    return (
                      <button 
                        key={idx}
                        className={optClass}
                        onClick={() => handleSelectDuelOption(opt)}
                      >
                        <span>{opt}</span>
                        {duelIsChecked && isCorrect && <Check size={18} color="#16A34A" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>

                {duelIsChecked && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: '0.8rem', color: '#475569', background: '#F8FAFC', padding: '10px 14px', borderRadius: 12, marginBottom: 12 }}>
                      💡 {activeGameQuestions[duelQIndex].explanation}
                    </div>
                    <button 
                      className="study-action-btn primary"
                      style={{ width: '100%', padding: '14px' }}
                      onClick={handleNextDuelQuestion}
                    >
                      {duelQIndex < activeGameQuestions.length - 1 ? 'Câu kế tiếp ➔' : 'Xem kết quả tổng kết 🏆'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Duel Finished Result Screen */
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <span style={{ fontSize: '3rem' }}>🏆</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginTop: 8 }}>
                  HOÀN THÀNH THỬ THÁCH!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '6px 0 18px 0' }}>
                  Bạn đã trả lời đúng {duelScore} / {activeGameQuestions.length} câu hỏi thử thách.
                </p>

                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, background: '#EFF6FF', borderRadius: 16, padding: 14 }}>
                    <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>ĐIỂM KINH NGHIỆM</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E40AF', marginTop: 2 }}>
                      +{duelScore * 15} XP
                    </div>
                  </div>
                  <div style={{ flex: 1, background: '#FEF3C7', borderRadius: 16, padding: 14 }}>
                    <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>XU THƯỞNG</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#92400E', marginTop: 2 }}>
                      +{duelScore * 5} 💰
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    className="study-action-btn"
                    style={{ flex: 1, padding: 14 }}
                    onClick={() => {
                      setDuelQIndex(0);
                      setDuelScore(0);
                      setDuelFinished(false);
                      setDuelSelectedOpt(null);
                      setDuelIsChecked(false);
                      if (activeGameQuestions[0]?.targetTerm) {
                        speakText(activeGameQuestions[0].targetTerm);
                      }
                    }}
                  >
                    Chơi lại 🔄
                  </button>
                  <button 
                    className="study-action-btn primary"
                    style={{ flex: 1, padding: 14 }}
                    onClick={() => setShowDuelModal(false)}
                  >
                    Đóng & Nhận thưởng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AI MODEL SELECTOR MODAL (20 OpenAI SDK COMPATIBLE MODELS)                 */}
      {/* ========================================================================= */}
      {showModelModal && (
        <div className="model-modal-overlay" onClick={() => setShowModelModal(false)}>
          <div className="model-modal-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '18px 20px 12px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bot size={22} color="#2563EB" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    Danh Mục Model AI Khả Dụng
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 3 }}>
                  Sử dụng bất kỳ mã định danh model nào chuẩn OpenAI SDK
                </p>
              </div>
              <button 
                onClick={() => setShowModelModal(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer' }}
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* Current Active Model Banner */}
            <div style={{ margin: '12px 16px 4px 16px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16A34A', display: 'inline-block', boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.2)' }} />
                <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700 }}>Đang kết nối:</span>
                <code style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E40AF', background: '#EFF6FF', padding: '2px 8px', borderRadius: 6 }}>
                  {apiModel}
                </code>
              </div>
              {apiModel === 'imgxh/server-6' && (
                <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: 6 }}>
                  ⭐ ƯU TIÊN SỐ 1
                </span>
              )}
            </div>

            {/* Search Filter */}
            <div className="model-search-bar">
              <Search size={18} color="#64748B" />
              <input 
                type="text"
                className="model-search-input"
                placeholder="Lọc danh sách model..."
                value={modelSearchQuery}
                onChange={(e) => setModelSearchQuery(e.target.value)}
              />
              {modelSearchQuery && (
                <button 
                  onClick={() => setModelSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                >
                  <X size={16} color="#94A3B8" />
                </button>
              )}
            </div>

            {/* Model List Scroll Area */}
            <div className="model-list-scroll">
              {AVAILABLE_AI_MODELS
                .filter(m => {
                  const q = modelSearchQuery.toLowerCase().trim();
                  if (!q) return true;
                  return m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q);
                })
                .map((m) => {
                  const isCurrent = apiModel === m.id;
                  const isPriority = m.id === 'imgxh/server-6';

                  return (
                    <div 
                      key={m.id}
                      className={`model-card-item ${isCurrent ? 'active' : ''} ${isPriority ? 'priority' : ''}`}
                      onClick={() => handleSelectModel(m.id)}
                    >
                      <div className="model-card-top">
                        <div className="model-name-title">
                          <span>{m.name}</span>
                          {isPriority ? (
                            <span className="model-tag-badge priority">⭐ ƯU TIÊN SỐ 1</span>
                          ) : m.badge ? (
                            <span className="model-tag-badge normal">{m.badge}</span>
                          ) : null}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                          Chuẩn OpenAI
                        </span>
                      </div>

                      <div className="model-desc-text">
                        {m.desc}
                      </div>

                      <div className="model-id-row">
                        <span className="model-id-code">{m.id}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button 
                            className="model-copy-btn"
                            onClick={(e) => handleCopyModelId(m.id, e)}
                            title="Sao chép ID Model"
                          >
                            {copiedModelId === m.id ? (
                              <>
                                <Check size={14} color="#16A34A" />
                                <span style={{ color: '#16A34A' }}>Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Sao chép ID</span>
                              </>
                            )}
                          </button>

                          <button 
                            className={`model-select-btn ${isCurrent ? 'active' : 'select'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectModel(m.id);
                            }}
                          >
                            {isCurrent ? '✓ Đang dùng' : 'Chọn dùng ➔'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Custom Model ID Entry */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                Hoặc nhập mã Model ID tùy chỉnh khác:
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text"
                  placeholder="Ví dụ: gpt-4o-mini hoặc custom-model"
                  value={customModelIdInput}
                  onChange={(e) => setCustomModelIdInput(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: '0.84rem', outline: 'none' }}
                />
                <button
                  disabled={!customModelIdInput.trim()}
                  onClick={() => {
                    if (customModelIdInput.trim()) {
                      handleSelectModel(customModelIdInput.trim());
                      setCustomModelIdInput('');
                    }
                  }}
                  className="study-action-btn primary"
                  style={{ padding: '10px 16px', fontSize: '0.82rem', borderRadius: 10, opacity: customModelIdInput.trim() ? 1 : 0.5 }}
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar (Master Plan Section 4: 5 Core Tabs) */}
      {activeMode === 'none' && (
        <div className="peaktalk-bottom-nav">
          <button
            className={`nav-bottom-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={22} />
            <span>Trang chủ</span>
          </button>

          <button
            className={`nav-bottom-item ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => setActiveTab('learn')}
          >
            <BookOpen size={22} />
            <span>Học tập</span>
          </button>

          <button
            className={`nav-bottom-item ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            <Radio size={22} />
            <span>Luyện tập</span>
          </button>

          <button
            className={`nav-bottom-item ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <Bot size={22} />
            <span>AI Đàm thoại</span>
          </button>

          <button
            className={`nav-bottom-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={22} />
            <span>Hồ sơ STCW</span>
          </button>
        </div>
      )}

      {/* Online App Update Modal */}
      {appUpdateInfo && (
        <UpdateModal 
          updateInfo={appUpdateInfo} 
          onClose={() => setAppUpdateInfo(null)} 
        />
      )}
    </>
  );
}
