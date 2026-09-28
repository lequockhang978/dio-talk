import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Copy,
  Moon,
  Sun
} from 'lucide-react';
import { COURSES, MARITIME_LESSON_NODES, MARITIME_10K_TERMS, generateInfiniteMaritimeNodes, getRankRequiredVocab, type Course, type Term, type LessonNode } from './data/courses';
import { MARLINS_EXAM_DATA } from './data/marlins';
import { SMCP_PHRASES } from './data/smcp';
import { VHF_SCENARIOS, type VHFScenario } from './data/vhf_scenarios';
import { EMERGENCY_SCENARIOS, type EmergencyScenario } from './data/emergency';
import { MARITIME_15_GAMES, SAMPLE_DUEL_QUESTIONS, getQuestionsForGame, type MaritimeGameDefinition, type DuelQuestion } from './data/maritime_games';
import { ALL_MARITIME_VOCABULARY } from './data/vocabulary';
import {
  generateDaily25Session,
  createSessionQuestion,
  saveStudyHistory,
  saveMasteryRecord,
  getStudyHistory,
  getMasteryRecords,
  getFluencyStatus,
  calculateRetentionScore,
  evaluateWithAI,
  type DailyStudySession,
  type AIEvaluationResult
} from './data/daily_protocol';
import { triggerConfetti } from './utils/confetti';
import {
  signInWithGoogleFirebase,
  saveProfileToCloud,
  saveUserFullProgressToCloud,
  loadUserFullProgressFromCloud,
  signOutFirebase,
  subscribeToAuthState,
  getCurrentUserId,
  syncUserToLeaderboard,
  fetchRealLeaderboard,
  subscribeToRealLeaderboard,
  syncPendingCloudProgress,
  type CloudLeaderboardUser
} from './services/firebase';
import {
  checkAppUpdate,
  CURRENT_VERSION_TAG,
  type AppUpdateInfo
} from './services/updateService';
import { UpdateModal } from './components/UpdateModal';
import { OnboardingScreen } from './components/OnboardingScreen';
import { soundService } from './services/soundService';
import { Sticker3D, type StickerName } from './components/Sticker3D';
import { getLocalDateKey, getYesterdayDateKey, getDaysDifference } from './services/dateService';
import { PET_SKINS, type PetSkin } from './data/petSkins';
import { PetCompanionWidget } from './components/PetCompanionWidget';
import { PetWardrobeModal } from './components/PetWardrobeModal';
import { PetShimejiPatrol } from './components/PetShimejiPatrol';

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

// Global one-time reset for all users: clean stale streak and vocab counts
const GLOBAL_RESET_KEY = 'dio_reset_all_vocab_streak_v1';
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem(GLOBAL_RESET_KEY) !== 'done') {
      localStorage.setItem(GLOBAL_RESET_KEY, 'done');
      const raw = localStorage.getItem('dio_user_profile');
      if (raw) {
        const p = JSON.parse(raw);
        p.streakDays = 0;
        localStorage.setItem('dio_user_profile', JSON.stringify(p));
      }
      localStorage.setItem('dio_completed_today', '0');
      localStorage.removeItem('dio_vocab_mastery_records');
      localStorage.removeItem('dio_daily_study_protocol_history');
      localStorage.removeItem('dio_cached_leaderboard');
      localStorage.removeItem('dio_maritime_stars_nodes');
      localStorage.removeItem('dio_lesson_sessions');
    }
  } catch (_) { }
}

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
        if (parsed.xp === 850 || parsed.xp === 350) {
          parsed.xp = 0;
        }
        if (!parsed.coins) parsed.coins = 100;

        // Cơ chế mất Streak khi bỏ lỡ ngày (Streak Break on missed days)
        const todayKey = getLocalDateKey();
        const yesterdayKey = getYesterdayDateKey();
        const lastStreakDate = localStorage.getItem('dio_last_streak_date');

        if (parsed.streakDays > 0) {
          if (!lastStreakDate) {
            // Khởi tạo mốc nối liền hôm qua cho phiên làm việc hiện tại
            localStorage.setItem('dio_last_streak_date', yesterdayKey);
          } else {
            const diffDays = getDaysDifference(lastStreakDate, todayKey);
            if (diffDays > 1) {
              // Bỏ lỡ ít nhất 1 ngày mà không đạt 25 câu -> MẤT STREAK, RESET VỀ 0!
              parsed.streakDays = 0;
              localStorage.setItem('dio_streak_broken_flag', 'true');
            }
          }
        }
        localStorage.setItem('dio_user_profile', JSON.stringify(parsed));
        return parsed;
      } catch (e) { }
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

  // Onboarding Intro Guard
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('dio_has_seen_onboarding') === 'true';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authenticatedUid, setAuthenticatedUid] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutFirebase();
    } catch (e) { }
    localStorage.removeItem('dio_user_profile');
    localStorage.removeItem('dio_completed_today');
    localStorage.removeItem('dio_practice_minutes');
    localStorage.removeItem('dio_accuracy_score');
    setIsLoggedIn(false);
    setAuthenticatedUid(null);
  };

  const [currentDepartment, setCurrentDepartment] = useState<'engine' | 'deck'>(() => {
    return (localStorage.getItem('dio_dept') as 'engine' | 'deck') || 'engine';
  });
  const [selectedNode, setSelectedNode] = useState<LessonNode | null>(null);
  const [leaderboardMetric, setLeaderboardMetric] = useState<'streak' | 'vocab'>('streak');

  // Pet Mascot & Skin Wardrobe State
  const [activePetSkinId, setActivePetSkinId] = useState<string>(() => {
    return localStorage.getItem('dio_pet_skin') || 'cadet';
  });
  const [unlockedPetSkinIds, setUnlockedPetSkinIds] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('dio_pet_unlocked_skins');
      return s ? JSON.parse(s) : ['cadet'];
    } catch {
      return ['cadet'];
    }
  });
  const [showPetWardrobe, setShowPetWardrobe] = useState(false);

  const activePetSkin = useMemo(() => {
    return PET_SKINS.find(s => s.id === activePetSkinId) || PET_SKINS[0];
  }, [activePetSkinId]);

  const handleEquipPetSkin = (skinId: string) => {
    setActivePetSkinId(skinId);
    localStorage.setItem('dio_pet_skin', skinId);
    const skin = PET_SKINS.find(s => s.id === skinId);
    setCustomAlert({
      title: 'Đổi Trang Phục Thành Công! ✨',
      message: `Dio hiện đang mặc skin "${skin?.name || skinId}". Hãy tiếp tục học để tích lũy thêm đá quý!`,
      icon: 'info'
    });
  };

  const handleBuyPetSkin = (skin: PetSkin) => {
    if (userProfile.xp < skin.price) {
      setCustomAlert({
        title: 'Chưa Đủ Đá Quý 💎',
        message: `Bạn cần ${skin.price} 💎 để mở khóa skin này. Hiện tại bạn có ${userProfile.xp} 💎. Hãy làm bài tập để nhận thêm nhé!`,
        icon: 'warning'
      });
      return;
    }

    const nextGems = userProfile.xp - skin.price;
    const nextUnlocked = Array.from(new Set([...unlockedPetSkinIds, skin.id]));

    setUserProfile(prev => {
      const updated = { ...prev, xp: nextGems };
      const uid = getCurrentUserId();
      if (uid) saveProfileToCloud(uid, updated);
      return updated;
    });

    setUnlockedPetSkinIds(nextUnlocked);
    setActivePetSkinId(skin.id);
    localStorage.setItem('dio_pet_skin', skin.id);
    localStorage.setItem('dio_pet_unlocked_skins', JSON.stringify(nextUnlocked));

    setCustomAlert({
      title: 'Mở Khóa Skin Mới Thành Công! 🎉',
      message: `Chúc mừng bạn đã sở hữu skin "${skin.name}"! Dio đã lập tức thay trang phục mới cho bạn!`,
      icon: 'info'
    });
  };

  // Intelligent STCW Career Progression Resolver
  const applyTreeProgression = useCallback((nodes: LessonNode[], userRank?: string): LessonNode[] => {
    const result = nodes.map(n => ({ ...n }));

    // 1. Ensure first node of each department is always unlocked
    const firstSeenDept = new Set<string>();
    for (let i = 0; i < result.length; i++) {
      if (!firstSeenDept.has(result[i].department)) {
        result[i].isUnlocked = true;
        firstSeenDept.add(result[i].department);
      }
    }

    // 2. Chain progression: if node i is completed (stars > 0), node i+1 in same department MUST be unlocked
    for (let i = 0; i < result.length; i++) {
      if (result[i].stars > 0) {
        const nextIdx = result.findIndex((n, idx) => idx > i && n.department === result[i].department);
        if (nextIdx !== -1) {
          result[nextIdx].isUnlocked = true;
        }
      }
    }

    // 3. User rank alignment: unlock first node of user's own STCW rank tier
    if (userRank) {
      const cleanRank = userRank.toLowerCase();
      const rankFirstNode = result.find(n =>
        n.rankTitle.toLowerCase().includes(cleanRank) || cleanRank.includes(n.rankTitle.toLowerCase())
      );
      if (rankFirstNode) {
        const idx = result.findIndex(n => n.id === rankFirstNode.id);
        if (idx !== -1) {
          result[idx].isUnlocked = true;
        }
      }
    }

    return result;
  }, []);

  // Career Path Lesson Nodes with LocalStorage Persistence & Infinite Extension
  const [skillTreeNodes, setSkillTreeNodes] = useState<LessonNode[]>(() => {
    try {
      const savedUnlocked = localStorage.getItem('dio_maritime_unlocked_nodes');
      const savedStars = localStorage.getItem('dio_maritime_stars_nodes');
      const unlockedMap = savedUnlocked ? JSON.parse(savedUnlocked) : {};
      const starsMap = savedStars ? JSON.parse(savedStars) : {};

      const mapped = MARITIME_LESSON_NODES.map((node) => {
        const isUnlocked = unlockedMap[node.id] !== undefined ? unlockedMap[node.id] : node.isUnlocked;
        const stars = starsMap[node.id] !== undefined ? starsMap[node.id] : node.stars;
        return { ...node, isUnlocked, stars };
      });

      // Chain unlocked progression: if node 1, 2, 3 have stars, node 4 must be unlocked
      const result = mapped.map(n => ({ ...n }));
      for (let i = 0; i < result.length; i++) {
        if (result[i].stars > 0) {
          const nextIdx = result.findIndex((n, idx) => idx > i && n.department === result[i].department);
          if (nextIdx !== -1) {
            result[nextIdx].isUnlocked = true;
          }
        }
      }
      return result;
    } catch {
      return MARITIME_LESSON_NODES;
    }
  });

  useEffect(() => {
    setSkillTreeNodes(prev => applyTreeProgression(prev, userProfile.rank));
  }, [userProfile.rank, applyTreeProgression]);

  // Per-Node In-Progress Session (Auto-resumes at current word on reopen)
  const [lessonSessions, setLessonSessions] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('dio_lesson_sessions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveNodeSession = useCallback((nodeId: string, index: number) => {
    if (!nodeId) return;
    setLessonSessions(prev => {
      const updated = { ...prev, [nodeId]: index };
      try {
        localStorage.setItem('dio_lesson_sessions', JSON.stringify(updated));
      } catch { }
      if (authenticatedUid) {
        saveUserFullProgressToCloud(authenticatedUid, { lessonSessions: updated });
      }
      return updated;
    });
  }, [authenticatedUid]);

  const clearNodeSession = useCallback((nodeId: string) => {
    if (!nodeId) return;
    setLessonSessions(prev => {
      const updated = { ...prev };
      delete updated[nodeId];
      try {
        localStorage.setItem('dio_lesson_sessions', JSON.stringify(updated));
      } catch { }
      if (authenticatedUid) {
        saveUserFullProgressToCloud(authenticatedUid, { lessonSessions: updated });
      }
      return updated;
    });
  }, [authenticatedUid]);

  const handleUnlockAndCompleteNode = (nodeId: string) => {
    clearNodeSession(nodeId);
    setSkillTreeNodes(prev => {
      const currentIdx = prev.findIndex(n => n.id === nodeId);
      if (currentIdx === -1) return prev;
      const targetDept = prev[currentIdx].department;

      // Find next node in same department
      const nextNodeIdx = prev.findIndex((n, idx) => idx > currentIdx && n.department === targetDept);

      const rawUpdated = prev.map((n, idx) => {
        if (idx === currentIdx) {
          return { ...n, isUnlocked: true, stars: Math.max(n.stars, 3) };
        }
        if (idx === nextNodeIdx) {
          return { ...n, isUnlocked: true };
        }
        return n;
      });

      const updated = applyTreeProgression(rawUpdated, userProfile.rank);

      // Save to localStorage & Cloud
      const unlockedIds: string[] = [];
      const starsMap: Record<string, number> = {};
      updated.forEach(n => {
        if (n.isUnlocked) unlockedIds.push(n.id);
        if (n.stars > 0) starsMap[n.id] = n.stars;
      });

      try {
        const unlockedMap: Record<string, boolean> = {};
        unlockedIds.forEach(id => { unlockedMap[id] = true; });
        localStorage.setItem('dio_maritime_unlocked_nodes', JSON.stringify(unlockedMap));
        localStorage.setItem('dio_maritime_stars_nodes', JSON.stringify(starsMap));
      } catch (e) {
        console.error(e);
      }

      if (authenticatedUid) {
        saveUserFullProgressToCloud(authenticatedUid, {
          unlockedNodeIds: unlockedIds,
          starsMap,
          streakDays: userProfile.streakDays,
          xp: userProfile.xp,
          department: userProfile.department
        });
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
    setCustomAlert({
      title: 'Mở Rộng Hải Trình STCW',
      message: `Đã mở rộng thêm 12 Chặng Vô hạn cho Ban ${currentDepartment === 'engine' ? 'Máy' : 'Boong'}!`,
      icon: 'crown'
    });
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

  // Daily Completed Games State (resets automatically each new day)
  const [completedGames, setCompletedGames] = useState<string[]>(() => {
    try {
      const todayKey = getLocalDateKey();
      const savedDate = localStorage.getItem('dio_games_completed_date');
      if (savedDate !== todayKey) {
        localStorage.setItem('dio_games_completed_date', todayKey);
        localStorage.setItem('dio_games_completed_ids', JSON.stringify([]));
        return [];
      }
      const raw = localStorage.getItem('dio_games_completed_ids');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // SRS Rating Handler (Section 155: AGAIN, HARD, GOOD, EASY)
  const handleSRSRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    const currentTerm = currentCourse.terms[vocabIndex];
    if (!currentTerm) return;

    let deltaDots = 1;
    let srsGrade: 0 | 2 | 4 | 5 = 4;
    if (rating === 'again') {
      deltaDots = 0;
      srsGrade = 0;
    } else if (rating === 'hard') {
      deltaDots = 1;
      srsGrade = 2;
    } else if (rating === 'good') {
      deltaDots = 2;
      srsGrade = 4;
    } else if (rating === 'easy') {
      deltaDots = 3;
      srsGrade = 5;
    }

    saveMasteryRecord(currentTerm.id, currentTerm.word, srsGrade >= 3, srsGrade);

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
  };

  const handleSelectDuelOption = (option: string) => {
    if (duelIsChecked) return;
    setDuelSelectedOpt(option);
    setDuelIsChecked(true);
    const curQ = activeGameQuestions[duelQIndex];
    if (!curQ) return;
    const isCorrect = option === curQ.correctAnswer;

    // Pronounce the correct term AFTER user has submitted their answer to prevent spoiling
    if (curQ.targetTerm) {
      speakText(curQ.targetTerm);
    }

    if (isCorrect) {
      setDuelScore(prev => prev + 1);
      setDuelCombo(prev => prev + 1);
      setCompletedToday(prev => prev + 1);
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
    } else {
      setDuelFinished(true);
      triggerConfetti(3000);
      soundService.playCelebrationFanfare();
      if (selectedGame) {
        setCompletedGames(prev => {
          if (!prev.includes(selectedGame.id)) {
            const nextList = [...prev, selectedGame.id];
            try {
              localStorage.setItem('dio_games_completed_ids', JSON.stringify(nextList));
            } catch (e) {
              console.error(e);
            }
            return nextList;
          }
          return prev;
        });
      }
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

    const uid = getCurrentUserId();
    if (!uid) return;
    saveUserFullProgressToCloud(uid, {
      ...newProfile,
      completedToday,
      streakDays: newProfile.streakDays,
      xp: newProfile.xp,
      hearts: newProfile.hearts
    });
  };

  const handleSwitchDepartment = (dept: 'engine' | 'deck') => {
    setCurrentDepartment(dept);
    localStorage.setItem('dio_dept', dept);
    const matched = COURSES.find(c => c.department === dept) || COURSES[0];
    setCurrentCourse(matched);
  };

  // Learning Progress & Stats (Persistent - Clean 0-state for new users, resets daily)
  const [completedToday, setCompletedToday] = useState(() => {
    try {
      const todayKey = getLocalDateKey();
      const savedDate = localStorage.getItem('dio_streak_date');
      if (savedDate !== todayKey) {
        localStorage.setItem('dio_streak_date', todayKey);
        localStorage.setItem('dio_completed_today', '0');
        return 0;
      }
      const s = localStorage.getItem('dio_completed_today');
      return s ? parseInt(s, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Progressive Streak 25-Question Milestone & Celebration States
  const [milestoneToast, setMilestoneToast] = useState<{ level: number; title: string; subtitle: string; sticker: StickerName } | null>(null);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const lockedNoticeTimerRef = useRef<any>(null);

  const showLockedNotice = (msg: string) => {
    if (lockedNoticeTimerRef.current) clearTimeout(lockedNoticeTimerRef.current);
    setLockedNotice(msg);
    lockedNoticeTimerRef.current = setTimeout(() => {
      setLockedNotice(null);
    }, 2800);
  };

  // Progressive Streak 25-Question Milestones & Daily Sync Effect
  useEffect(() => {
    try {
      localStorage.setItem('dio_completed_today', String(completedToday));
    } catch { }

    const todayKey = getLocalDateKey();
    const lastMilestoneKey = `dio_milestone_${todayKey}`;
    const celebratedKey = `dio_celebrated_${todayKey}`;

    // Rollback accidental preview claim if user hasn't actually finished 25 questions
    if (completedToday < 25 && localStorage.getItem(`dio_streak_awarded_${todayKey}`) === 'true') {
      localStorage.removeItem(`dio_streak_awarded_${todayKey}`);
      localStorage.removeItem(`dio_celebrated_${todayKey}`);
      setUserProfile(prev => {
        const fixed = { ...prev, streakDays: Math.max(0, prev.streakDays - 1) };
        const uid = getCurrentUserId();
        if (uid) saveProfileToCloud(uid, fixed);
        return fixed;
      });
    }

    // Milestone thresholds:
    // Level 1: 5 questions (Bronze)
    // Level 2: 10 questions (Silver)
    // Level 3: 15 questions (Gold)
    // Level 4: 20 questions (Diamond)
    // Level 5: 25 questions (Grand Duolingo Celebration!)
    let currentLvl = 0;
    if (completedToday >= 25) currentLvl = 5;
    else if (completedToday >= 20) currentLvl = 4;
    else if (completedToday >= 15) currentLvl = 3;
    else if (completedToday >= 10) currentLvl = 2;
    else if (completedToday >= 5) currentLvl = 1;

    const lastTriggeredLvl = parseInt(localStorage.getItem(lastMilestoneKey) || '0', 10);

    if (currentLvl > lastTriggeredLvl) {
      localStorage.setItem(lastMilestoneKey, String(currentLvl));

      if (currentLvl === 5) {
        // Trigger Grand Streak Celebration if not yet celebrated today
        if (localStorage.getItem(celebratedKey) !== 'true') {
          soundService.playCelebrationFanfare();
          setShowStreakCelebration(true);
        }
      } else {
        // Progressive Milestone Toasts 1 -> 4
        soundService.playMilestone(currentLvl);
        const configs: Record<number, { title: string; subtitle: string; sticker: StickerName }> = {
          1: { title: 'Khởi động 5/25 câu', subtitle: '+10 XP • Giữ vững đà học tập!', sticker: 'bronze-medal' },
          2: { title: 'Tăng tốc 10/25 câu', subtitle: '+15 XP • Chuỗi phản xạ xuất sắc!', sticker: 'silver-lightning' },
          3: { title: 'Bứt phá 15/25 câu', subtitle: '+20 XP • Vượt hơn 60% chặng đường!', sticker: 'gold-star' },
          4: { title: 'Đỉnh cao 20/25 câu', subtitle: '+25 XP • Còn 5 câu nữa là chạm đỉnh!', sticker: 'diamond' },
        };
        const cfg = configs[currentLvl];
        if (cfg) {
          setMilestoneToast({ level: currentLvl, ...cfg });
          setUserProfile(prev => ({
            ...prev,
            xp: prev.xp + (currentLvl * 5 + 5),
            coins: (prev.coins || 100) + 2
          }));
          setTimeout(() => {
            setMilestoneToast(null);
          }, 3600);
        }
      }
    }
  }, [completedToday]);

  const handleClaimStreakCelebration = () => {
    if (completedToday < 25) {
      setShowStreakCelebration(false);
      return;
    }

    const todayKey = getLocalDateKey();
    localStorage.setItem(`dio_celebrated_${todayKey}`, 'true');

    const awardedKey = `dio_streak_awarded_${todayKey}`;
    if (localStorage.getItem(awardedKey) !== 'true') {
      localStorage.setItem(awardedKey, 'true');
      localStorage.setItem('dio_last_streak_date', todayKey);
      localStorage.removeItem('dio_streak_broken_flag');
      setUserProfile(prev => {
        const nextStreak = prev.streakDays + 1;
        const updated = {
          ...prev,
          streakDays: nextStreak,
          xp: prev.xp + 100,
          coins: (prev.coins || 100) + 25
        };
        const uid = getCurrentUserId();
        if (uid) saveProfileToCloud(uid, updated);
        return updated;
      });
    }

    setShowStreakCelebration(false);
  };
  const [customAlert, setCustomAlert] = useState<{ title: string; message: string; icon?: string } | null>(null);
  const [customConfirm, setCustomConfirm] = useState<{
    title: string;
    message: string;
    icon?: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  } | null>(null);
  const [activeSpeakingOfficer, setActiveSpeakingOfficer] = useState<{
    title: string;
    role: string;
    desc?: string;
    initialDialogue: string;
    systemPrompt: string;
    tag?: string;
    icon?: string;
  } | null>(null);
  const speakingSystemPromptRef = useRef<string>('');
  const speechRecognitionRef = useRef<any>(null);
  const vocabRecognitionRef = useRef<any>(null);

  // Global browser alert override and streak loss detector
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (msg: any) => {
      setCustomAlert({
        title: 'Thông Báo Hệ Thống',
        message: String(msg ?? ''),
        icon: 'info'
      });
    };

    if (localStorage.getItem('dio_streak_broken_flag') === 'true') {
      localStorage.removeItem('dio_streak_broken_flag');
      setTimeout(() => {
        setCustomAlert({
          title: 'Ngọn Lửa Streak Đã Tắt! 🕯️',
          message: 'Bạn đã bỏ lỡ bài học ngày hôm qua nên chuỗi ngày đã bị reset về 0. Hãy hoàn thành 25 câu hôm nay để thắp lại ngọn lửa mới!',
          icon: 'warning'
        });
      }, 600);
    }

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const [practiceMinutes, setPracticeMinutes] = useState(() => {
    const s = localStorage.getItem('dio_practice_minutes');
    return s ? parseInt(s, 10) : 0;
  });
  const [accuracyScore, setAccuracyScore] = useState(() => {
    const s = localStorage.getItem('dio_accuracy_score');
    return s ? parseInt(s, 10) : 0;
  });

  // Dynamic calculation to ensure realistic practice minutes and accuracy from real user activities
  const calculatedMinutes = useMemo(() => {
    const fromXp = Math.round((userProfile.xp || 0) / 45);
    const fromNodes = skillTreeNodes.filter(n => n.stars > 0).length * 4;
    const est = Math.max(fromXp, fromNodes, completedToday > 0 ? Math.ceil(completedToday / 2) : 0);
    return Math.max(practiceMinutes, est, 1);
  }, [practiceMinutes, userProfile.xp, skillTreeNodes, completedToday]);

  const calculatedAccuracy = useMemo(() => {
    try {
      const records = getMasteryRecords();
      const allRecords = Object.values(records);
      if (allRecords.length > 0) {
        const totalCorrect = allRecords.reduce((acc, r) => acc + (r.correctCount || 0), 0);
        const totalWrong = allRecords.reduce((acc, r) => acc + (r.wrongCount || 0), 0);
        if (totalCorrect + totalWrong > 0) {
          const score = Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100);
          return Math.max(75, Math.min(100, score));
        }
      }
    } catch (_) { }

    if (accuracyScore > 0) return accuracyScore;
    const completedCount = skillTreeNodes.filter(n => n.stars > 0).length;
    if (completedCount > 0 || (userProfile.xp || 0) > 100) return 92;
    return 85;
  }, [accuracyScore, skillTreeNodes, userProfile.xp]);

  // Active study timer - tracks active minutes while app is running
  useEffect(() => {
    const timer = setInterval(() => {
      setPracticeMinutes(prev => {
        const next = prev + 1;
        try { localStorage.setItem('dio_practice_minutes', String(next)); } catch { }
        return next;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dio_practice_minutes', String(calculatedMinutes));
      localStorage.setItem('dio_accuracy_score', String(calculatedAccuracy));
    } catch { }
  }, [calculatedMinutes, calculatedAccuracy]);

  const [termsState, setTermsState] = useState<Term[]>(() => currentCourse.terms);

  // Full Two-Way Cloud Sync & Restore (Preserves data across app uninstalls & new devices)
  const restoreProgressFromCloud = useCallback(async (uid: string) => {
    try {
      const cloud = await loadUserFullProgressFromCloud(uid);
      if (!cloud) return;

      // 1. Restore Profile
      setUserProfile(prev => {
        const streak = Math.max(cloud.streakDays, prev.streakDays);
        const xp = Math.max(cloud.xp, prev.xp);
        const updated: UserProfile = {
          name: cloud.name || prev.name,
          email: cloud.email || prev.email,
          department: cloud.department || prev.department,
          rank: cloud.rank || prev.rank,
          streakDays: streak,
          hearts: cloud.hearts ?? prev.hearts,
          xp: xp,
          coins: Math.max(cloud.coins ?? 100, prev.coins ?? 100)
        };
        try {
          localStorage.setItem('dio_user_profile', JSON.stringify(updated));
          localStorage.setItem('dio_dept', updated.department);
        } catch { }
        return updated;
      });

      if (cloud.department) {
        setCurrentDepartment(cloud.department);
      }

      // 2. Restore Lesson Tree Nodes & Stars
      setSkillTreeNodes(prev => {
        const unlockedSet = new Set(cloud.unlockedNodeIds || []);
        const starsMap = cloud.starsMap || {};
        const recoveredVocab = cloud.masteredWords?.length || 0;

        const rawUpdated = prev.map((node, nIdx) => {
          const autoUnlock = recoveredVocab > 0 && nIdx <= Math.ceil(recoveredVocab / 4);
          const isUnlocked = unlockedSet.has(node.id) || autoUnlock || node.isUnlocked;
          const stars = starsMap[node.id] !== undefined
            ? Math.max(starsMap[node.id], node.stars)
            : (autoUnlock && nIdx < Math.ceil(recoveredVocab / 4) ? 3 : node.stars);
          return { ...node, isUnlocked, stars };
        });

        const updated = applyTreeProgression(rawUpdated, cloud.rank || userProfile.rank);

        try {
          const saveUnlocked: Record<string, boolean> = {};
          const saveStars: Record<string, number> = {};
          updated.forEach(n => {
            if (n.isUnlocked) saveUnlocked[n.id] = true;
            if (n.stars > 0) saveStars[n.id] = n.stars;
          });
          localStorage.setItem('dio_maritime_unlocked_nodes', JSON.stringify(saveUnlocked));
          localStorage.setItem('dio_maritime_stars_nodes', JSON.stringify(saveStars));
        } catch { }

        return updated;
      });

      // 3. Restore Completed Today
      if (cloud.completedToday) {
        setCompletedToday(prev => Math.max(prev, cloud.completedToday || 0));
        try {
          localStorage.setItem('dio_completed_today', String(cloud.completedToday));
        } catch { }
      }

      // 4. Restore Mastered Words
      if (cloud.masteredWords && cloud.masteredWords.length > 0) {
        const mSet = new Set(cloud.masteredWords);
        setTermsState(prev => prev.map(t => mSet.has(t.word) ? { ...t, mastered: true, dots: Math.max(t.dots, 5) } : t));
      }

      // 5. Restore Lesson Sessions (per-node in-progress word index)
      if (cloud.lessonSessions && typeof cloud.lessonSessions === 'object') {
        setLessonSessions(prev => {
          const merged = { ...prev, ...cloud.lessonSessions };
          try {
            localStorage.setItem('dio_lesson_sessions', JSON.stringify(merged));
          } catch { }
          return merged;
        });
      }
    } catch (e) {
      console.warn('Failed to restore progress from cloud:', e);
    }
  }, []);

  // Listen to Auth State and Auto-Restore All Cloud Data on App Launch / Reinstall
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setAuthenticatedUid(user?.uid ?? null);
      setIsLoggedIn(Boolean(user));
      if (user?.uid) {
        restoreProgressFromCloud(user.uid);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [restoreProgressFromCloud]);

  // OFFLINE & SEA VOYAGE RESILIENCE ENGINE
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setMilestoneToast({
        level: 4,
        title: 'Đã kết nối lại Internet 📶',
        subtitle: 'Tự động đồng bộ toàn bộ tiến độ lên Cloud',
        sticker: 'diamond'
      });
      setTimeout(() => setMilestoneToast(null), 3500);
      if (authenticatedUid) {
        syncPendingCloudProgress(authenticatedUid);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setMilestoneToast({
        level: 2,
        title: 'Chế độ Hải trình Ngoại tuyến ⚓',
        subtitle: 'Tàu mất mạng: Toàn bộ bài học & từ vựng vẫn lưu an toàn trên máy',
        sticker: 'silver-lightning'
      });
      setTimeout(() => setMilestoneToast(null), 4000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [authenticatedUid]);

  // Google Sign-In with Automatic Full Cloud Restore
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const gUser = await signInWithGoogleFirebase();
      setAuthenticatedUid(gUser.uid);
      setIsLoggedIn(true);
      await restoreProgressFromCloud(gUser.uid);
    } catch (err: any) {
      console.warn('Google Sign-In failed:', err);
      let msg = 'Đăng nhập không thành công.';
      if (err?.code === 'auth/unauthorized-domain') {
        msg = 'Tên miền IP (127.0.0.1) chưa được thêm vào Firebase. Vui lòng mở trang web bằng địa chỉ: http://localhost:5173/';
      } else if (err?.code === 'auth/popup-blocked') {
        msg = 'Trình duyệt đang chặn popup đăng nhập Google. Vui lòng bật "Cho phép popup" trên thanh địa chỉ.';
      } else if (err?.code === 'auth/popup-closed-by-user') {
        msg = 'Cửa sổ đăng nhập Google đã bị đóng.';
      } else if (err?.message) {
        msg = `Lỗi: ${err.message}`;
      }
      setCustomAlert({
        title: 'Đăng Nhập Google',
        message: msg,
        icon: 'info'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Active Modes: 'none' | 'speaking' | 'quiz' | 'vocab-study' | 'daily-protocol' | 'marlins' | 'vhf' | 'emergency'
  const [activeMode, setActiveMode] = useState<'none' | 'speaking' | 'quiz' | 'vocab-study' | 'daily-protocol' | 'marlins' | 'vhf' | 'emergency'>('none');
  const [dailySession, setDailySession] = useState<DailyStudySession | null>(null);
  const [dailyQIdx, setDailyQIdx] = useState(0);
  const [dailyInput, setDailyInput] = useState('');
  const [dailySelectedOpt, setDailySelectedOpt] = useState<string | null>(null);
  const [dailyIsChecked, setDailyIsChecked] = useState(false);
  const [dailyScore, setDailyScore] = useState(0);
  const [dailyFinished, setDailyFinished] = useState(false);

  // Active Lesson Timers Reference (Cancels ALL background speech when user exits lesson)
  const activeTimersRef = useRef<number[]>([]);

  const registerTimeout = (fn: () => void, delayMs: number): number => {
    const id = window.setTimeout(() => {
      activeTimersRef.current = activeTimersRef.current.filter(t => t !== id);
      fn();
    }, delayMs);
    activeTimersRef.current.push(id);
    return id;
  };

  const clearAllActiveTimers = () => {
    activeTimersRef.current.forEach(id => clearTimeout(id));
    activeTimersRef.current = [];
  };

  // =========================================================================
  // 🏆 REAL-TIME MARITIME LEADERBOARD (FIREBASE CLOUD FIRESTORE)
  // =========================================================================
  const [leaderboardUsers, setLeaderboardUsers] = useState<CloudLeaderboardUser[]>(() => {
    try {
      const cached = localStorage.getItem('dio_cached_leaderboard');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.filter((u: any) => !u.uid?.startsWith('officer_'));
        }
      }
    } catch (_) { }
    return [];
  });
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState<boolean>(false);
  const [leaderboardSyncNotice, setLeaderboardSyncNotice] = useState<string>('🟢 Sẵn sàng đồng bộ Firebase Cloud');

  const totalMasteredVocab = useMemo(() => {
    // 1. Words from completed nodes (stars > 0)
    const completedNodes = skillTreeNodes.filter(n => n.department === currentDepartment && n.stars > 0);
    const wordsFromCompletedNodes = completedNodes.flatMap(n => (n.terms || []).map(t => t.word.toLowerCase()));

    // 2. Words from termsState where mastered is true
    const wordsFromMasteredTerms = termsState.filter(t => t.mastered).map(t => t.word.toLowerCase());

    // 3. Words recorded in daily study history
    let wordsFromHistory: string[] = [];
    try {
      const history = getStudyHistory();
      wordsFromHistory = history.learnedTermIds || [];
    } catch (_) { }

    // 4. Words from mastery records
    let wordsFromRecords: string[] = [];
    try {
      const records = getMasteryRecords();
      wordsFromRecords = Object.values(records)
        .filter(r => r.masteryScore >= 50 || r.correctCount > 0)
        .map(r => r.word.toLowerCase());
    } catch (_) { }

    const allLearnedWords = new Set([
      ...wordsFromCompletedNodes,
      ...wordsFromMasteredTerms,
      ...wordsFromHistory,
      ...wordsFromRecords
    ]);

    // Each completed node contributes its actual term count (5 terms each)
    const nodeCalculatedCount = completedNodes.reduce((acc, n) => acc + (n.terms?.length || 5), 0);

    return Math.max(allLearnedWords.size, nodeCalculatedCount);
  }, [skillTreeNodes, currentDepartment, termsState]);

  const syncAndLoadLeaderboard = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLeaderboardLoading(true);
    try {
      if (!authenticatedUid) return;
      const currentUserEntry: CloudLeaderboardUser = {
        uid: authenticatedUid,
        name: userProfile.name || 'Thuyền viên',
        rank: userProfile.rank || 'Sĩ quan',
        ship: 'M/V Ocean Pioneer',
        avatar: userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'K',
        avatarBg: '#2563EB',
        streak: userProfile.streakDays || 1,
        vocab: totalMasteredVocab,
        xp: userProfile.xp || 100,
        email: userProfile.email || '',
        department: userProfile.department || currentDepartment,
        isCurrentUser: true
      };

      // 1. Sync current real user to Firestore Cloud
      await syncUserToLeaderboard(currentUserEntry);

      // 2. Fetch all real users from Firestore Cloud
      const realUsers = await fetchRealLeaderboard();
      setLeaderboardUsers(realUsers);
      setLeaderboardSyncNotice(`🟢 Đã đồng bộ lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    } catch (e: any) {
      console.warn('Leaderboard sync error:', e);
      const reason = e?.code === 'permission-denied'
        ? 'Firebase chặn quyền đọc/ghi. Cần publish Firestore Rules.'
        : 'Không thể kết nối Firebase Cloud.';
      setLeaderboardSyncNotice(`🔴 ${reason}`);
    } finally {
      if (showLoading) setIsLeaderboardLoading(false);
    }
  }, [authenticatedUid, userProfile, totalMasteredVocab, currentDepartment]);

  // Auto-sync whenever user is authenticated or profile tab is focused
  useEffect(() => {
    if (authenticatedUid || activeTab === 'profile') {
      syncAndLoadLeaderboard(false);
    }
  }, [authenticatedUid, activeTab, syncAndLoadLeaderboard]);

  // Real-time listener for Firestore Leaderboard collection updates
  useEffect(() => {
    const unsubscribe = subscribeToRealLeaderboard((updated) => {
      setLeaderboardUsers(updated);
      setLeaderboardSyncNotice(`🟢 Cập nhật trực tiếp: ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [authenticatedUid, userProfile, totalMasteredVocab, currentDepartment]);

  const handleExitActiveMode = () => {
    clearAllActiveTimers();
    if (activeAudioTimerRef.current) clearTimeout(activeAudioTimerRef.current);
    setActiveAudioKey(null);
    soundService.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch { }
    }
    setActiveMode('none');
    setActiveSpeakingOfficer(null);
    setSelectedVhf(null);
    setSelectedEmergency(null);
    setSelectedGame(null);
    setDailySession(null);
    setVhfIsTransmitting(false);
  };

  useEffect(() => {
    if (activeMode === 'none') {
      clearAllActiveTimers();
      if (activeAudioTimerRef.current) clearTimeout(activeAudioTimerRef.current);
      setActiveAudioKey(null);
      soundService.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch { }
      }
    }
  }, [activeMode]);

  // Global Interactive Material Touch / Click Ripple Effect
  useEffect(() => {
    const handleGlobalTouchRipple = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        'button, .nav-bottom-item, .study-action-btn, .study-action-btn-3d, .vocab-play-btn, .game-tab-btn, .vocab-segment-btn, .flashcard-nav-btn-3d, .vocab-reset-btn'
      ) as HTMLElement;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height) * 1.6;
      const radius = diameter / 2;

      circle.style.width = `${diameter}px`;
      circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.className = 'touch-ink-ripple';

      const computedPos = window.getComputedStyle(target).position;
      if (computedPos === 'static') {
        target.style.position = 'relative';
      }
      target.style.overflow = 'hidden';

      const existing = target.querySelectorAll('.touch-ink-ripple');
      existing.forEach(r => r.remove());

      target.appendChild(circle);
      setTimeout(() => {
        circle.remove();
      }, 550);
    };

    window.addEventListener('pointerdown', handleGlobalTouchRipple);
    return () => window.removeEventListener('pointerdown', handleGlobalTouchRipple);
  }, []);

  // Launch VHF Simulator Scenario (Section 13 Master Plan)
  const launchVhfScenario = (sc: VHFScenario) => {
    clearAllActiveTimers();
    soundService.stop();
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
      registerTimeout(() => {
        setVhfIsTransmitting(false);
        setVhfFeedback('✅ Đã phát tín hiệu vô tuyến rõ ràng (Read-back verified)!');
        registerTimeout(() => {
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
    // 1. Identify upcoming lesson terms from next node on career skill tree (Advance Preview)
    let upcomingTerms: any[] = [];
    let pastLearnedTerms: any[] = [];

    const sameDeptNodes = skillTreeNodes.filter(n => n.department === currentDepartment);
    let targetNode = selectedNode;
    if (!targetNode) {
      targetNode = sameDeptNodes.find(n => n.isUnlocked && n.stars === 0) || sameDeptNodes[0];
    }
    if (targetNode) {
      const currentIndex = sameDeptNodes.findIndex(n => n.id === targetNode!.id);
      if (currentIndex !== -1 && currentIndex + 1 < sameDeptNodes.length) {
        upcomingTerms = sameDeptNodes[currentIndex + 1].terms || [];
      }

      // Collect all past learned terms from previous career nodes
      const pastNodes = sameDeptNodes.filter(
        (n, idx) => (currentIndex !== -1 && idx < currentIndex) || n.stars > 0
      );
      pastLearnedTerms = pastNodes
        .filter(n => n.id !== targetNode!.id)
        .flatMap(n => n.terms || []);
    }

    // Also include any terms already mastered or practiced in termsState
    const masteredInTermsState = termsState
      .filter(t => t.mastered || t.dots > 0)
      .filter(t => !(currentCourse?.terms || []).some(ct => ct.word.toLowerCase() === t.word.toLowerCase()));

    const combinedPast = [...pastLearnedTerms, ...masteredInTermsState];

    const session = generateDaily25Session(
      currentDepartment,
      5,
      mode,
      currentCourse?.terms,
      upcomingTerms,
      combinedPast
    );
    setDailySession(session);
    setDailyQIdx(0);
    setDailyInput('');
    setDailySelectedOpt(null);
    setDailyIsChecked(false);
    setDailyScore(0);
    setDailyFinished(false);
    setDailyAiResult(null);
    setActiveMode('daily-protocol');
  };

  const handleCheckDailyAnswer = (selectedOrInput?: string) => {
    if (!dailySession || dailyIsChecked) return;
    const curQ = dailySession.questions[dailyQIdx];
    if (!curQ) return;

    let isCorrect = false;
    let evalQualityGrade: number | undefined;
    if (curQ.questionType === 'cloze') {
      const cleanInput = (selectedOrInput || dailyInput).trim();
      const aiEval = evaluateWithAI(cleanInput, curQ.correctAnswer, {
        meaningVi: curQ.meaningVi,
        phonetic: curQ.phonetic
      });
      setDailyAiResult(aiEval);
      isCorrect = aiEval.isCorrect;
      evalQualityGrade = aiEval.qualityGrade;
    } else {
      isCorrect = selectedOrInput?.toLowerCase() === curQ.correctAnswer.toLowerCase();
      evalQualityGrade = isCorrect ? 4 : 1;
      setDailySelectedOpt(selectedOrInput || null);
    }

    setDailyIsChecked(true);
    saveMasteryRecord(curQ.termId, curQ.targetWord, isCorrect, evalQualityGrade as any);

    if (isCorrect) {
      const completedSentence = `${curQ.sentenceBefore} ${curQ.targetWord} ${curQ.sentenceAfter}`.replace(/\s+/g, ' ').trim();
      saveStudyHistory([curQ.termId], dailySession.dateKey, [curQ.termId]);
      setDailyScore(prev => prev + 1);
      setCompletedToday(prev => prev + 1);
      setUserProfile(prev => ({
        ...prev,
        xp: prev.xp + 15,
        coins: (prev.coins || 100) + 2
      }));
      speakText(completedSentence);
    } else {
      // Dynamic in-session weighting: when user answers wrongly, re-insert this term into future questions of the 25 quota
      setDailySession(prev => {
        if (!prev) return prev;
        const remaining = prev.questions.length - 1 - dailyQIdx;
        if (remaining <= 1) return prev;

        const offset = Math.min(3, remaining);
        const targetIdx = dailyQIdx + offset;
        const updated = [...prev.questions];

        const reinforcedQ = createSessionQuestion(
          {
            id: curQ.termId,
            word: curQ.targetWord,
            phonetic: curQ.phonetic,
            partOfSpeech: 'phrase',
            systemCategory: 'Dynamic Reinforcement',
            cefrLevel: 'B1',
            stcwCode: 'STCW A-II/1',
            meaningVi: curQ.meaningVi,
            vietnameseContext: curQ.hint,
            exampleEn: `${curQ.sentenceBefore} ${curQ.targetWord} ${curQ.sentenceAfter}`,
            exampleVi: curQ.vietnameseSentence,
            department: currentDepartment,
            collocations: [curQ.targetWord]
          },
          targetIdx,
          'reinforcement',
          ALL_MARITIME_VOCABULARY,
          prev.day,
          'cloze'
        );

        updated[targetIdx] = reinforcedQ;
        return {
          ...prev,
          questions: updated
        };
      });
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
    } else {
      setDailyFinished(true);
      triggerConfetti(3500);
      soundService.playCelebrationFanfare();
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
      saveMasteryRecord(term.id, term.word, true, (evalResult.qualityGrade ?? 4) as any);
      setUserProfile(prev => ({
        ...prev,
        xp: prev.xp + 15,
        coins: (prev.coins || 100) + 3
      }));
      setCompletedToday(prev => prev + 1);
      speakText(term.word);
      if (selectedNode) {
        const nextTarget = Math.min(currentCourse.terms.length - 1, vocabIndex + 1);
        saveNodeSession(selectedNode.id, nextTarget);
      }
    } else {
      saveMasteryRecord(term.id, term.word, false, (evalResult.qualityGrade ?? 1) as any);
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
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);
  const activeAudioTimerRef = useRef<any>(null);

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
  const [nightMode, setNightMode] = useState<boolean>(() => localStorage.getItem('dio_night_bridge_mode') === 'true');
  const [apiModel, setApiModel] = useState<string>(() => {
    const saved = localStorage.getItem('peaktalk_apimodel');
    if (!saved || saved === 'imgxh/roleplay') return DEFAULT_MODEL; // Ưu tiên server-6
    return saved;
  });

  const toggleNightMode = () => {
    setNightMode(prev => {
      const next = !prev;
      localStorage.setItem('dio_night_bridge_mode', String(next));
      soundService.vibrate(30);
      return next;
    });
  };

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
          const dismissed = sessionStorage.getItem('dio_dismissed_update_version');
          if (dismissed !== res.updateInfo.version) {
            setAppUpdateInfo(res.updateInfo);
          }
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
        setCustomAlert({
          title: 'Cập Nhật Ứng Dụng',
          message: `Bạn đang sử dụng phiên bản mới nhất (${CURRENT_VERSION_TAG})!\nKhông có bản cập nhật nào.`,
          icon: 'security-shield'
        });
      }
    } catch (e: any) {
      setCustomAlert({
        title: 'Kiểm Tra Cập Nhật',
        message: `Không thể kết nối máy chủ cập nhật: ${e?.message || 'Lỗi mạng hoặc ngoại tuyến'}`,
        icon: 'info'
      });
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

    // Đồng bộ số lần lặp lại từ Mastery Records (hệ thống 10 chấm trên toàn bộ khóa học & chức danh)
    const records = getMasteryRecords();
    const merged = Array.from(mergedMap.values()).map(t => {
      const rec = records[t.id];
      if (rec) {
        const reps = Math.min(10, Math.max(t.dots || 0, (rec.correctCount || 0) + (rec.wrongCount || 0), rec.repetitions || 0));
        return { ...t, dots: reps, mastered: reps >= 10 };
      }
      return t;
    });

    setTermsState(merged);
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
  const launchSpeaking = (officerOrCourse?: any) => {
    setActiveMode('speaking');
    let initialMsg = currentCourse.initialDialogue;
    let prompt = currentCourse.systemPrompt;

    if (officerOrCourse && officerOrCourse.initialDialogue) {
      setActiveSpeakingOfficer(officerOrCourse);
      initialMsg = officerOrCourse.initialDialogue;
      prompt = officerOrCourse.systemPrompt;
      speakingSystemPromptRef.current = prompt;
    } else if (officerOrCourse && officerOrCourse.terms) {
      setActiveSpeakingOfficer(null);
      setCurrentCourse(officerOrCourse);
      initialMsg = officerOrCourse.initialDialogue;
      prompt = officerOrCourse.systemPrompt;
      speakingSystemPromptRef.current = prompt;
    } else {
      setActiveSpeakingOfficer(null);
      speakingSystemPromptRef.current = currentCourse.systemPrompt;
    }

    setSpeakingMessages([
      { role: 'assistant', text: initialMsg }
    ]);
    speakText(initialMsg);
  };

  const handleSendSpeakingMessage = async (voiceInput?: string) => {
    const textToSend = voiceInput || inputText;
    if (!textToSend.trim()) return;

    const cleanInput = textToSend.trim().toLowerCase();
    const words = cleanInput.split(/\s+/).filter(Boolean);

    // INTELLIGENT MARITIME RELEVANCY & ACTIVE VOCABULARY SCORING
    // Check if input is empty, repetitive spam, or actual maritime response
    const isSpam = words.length > 3 && new Set(words).size === 1; // e.g. "hello hello hello..."

    // Domain keywords check (marine, engineering, navigation, safety, alarms, valves, pressure...)
    const MARITIME_KEYWORDS = [
      'alarm', 'alarms', 'leak', 'fuel', 'generator', 'engine', 'pressure', 'temperature', 'valve', 'pump',
      'bilge', 'oil', 'scavenge', 'manifold', 'cylinder', 'exhaust', 'bearing', 'cooler', 'filter', 'purifier',
      'rudder', 'bridge', 'captain', 'chief', 'officer', 'motorman', 'vts', 'port', 'starboard', 'bow', 'stern',
      'anchor', 'berth', 'course', 'speed', 'knots', 'degrees', 'heading', 'compass', 'radar', 'ecdis', 'vhf',
      'channel', 'mayday', 'pan pan', 'securite', 'draft', 'ballast', 'fire', 'emergency', 'stop', 'start',
      'check', 'inspect', 'checked', 'inspected', 'isolated', 'shut', 'closed', 'opened', 'cleared', 'reported',
      'sir', 'understood', 'roger', 'acknowledge', 'standby', 'affirmative', 'negative'
    ];

    let matchedKeywordCount = 0;
    words.forEach(w => {
      if (MARITIME_KEYWORDS.some(kw => w.includes(kw) || kw.includes(w))) {
        matchedKeywordCount++;
      }
    });

    let calculatedScore: number;
    if (isSpam) {
      calculatedScore = 15; // Penalize repetitive words
    } else if (matchedKeywordCount > 0) {
      // High score for maritime contextually relevant responses
      calculatedScore = Math.min(100, 50 + matchedKeywordCount * 15 + Math.min(25, words.length * 5));
    } else if (words.length <= 2) {
      calculatedScore = 30; // Very brief without technical term
    } else {
      calculatedScore = Math.min(75, Math.max(35, words.length * 8));
    }

    const nextMessages = [...speakingMessages, { role: 'user' as const, text: textToSend, score: calculatedScore }];
    setSpeakingMessages(nextMessages);
    setInputText('');
    setAiLoading(true);

    // Update real stats
    setCompletedToday(prev => prev + 1);
    setPracticeMinutes(prev => prev + 1);
    setAccuracyScore(prev => Math.round((prev + calculatedScore) / 2));

    const activePrompt = speakingSystemPromptRef.current || activeSpeakingOfficer?.systemPrompt || currentCourse.systemPrompt;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout limit

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: apiModel,
          messages: [
            { role: 'system', content: activePrompt },
            ...nextMessages.map(m => ({ role: m.role, content: m.text }))
          ]
        })
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Máy chủ AI phản hồi lỗi HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent || !rawContent.trim()) {
        throw new Error('Nội dung phản hồi từ AI trống');
      }

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
      clearTimeout(timeoutId);
      console.warn('[AI Speaking] API Request failed, switching to contextual maritime engine:', err);

      // Smart Context-Aware Maritime Response Engine
      const partner = activeSpeakingOfficer?.role || currentCourse.partnerRole || 'Sĩ quan';
      let contextualReply = '';
      let contextualFeedback = '';

      if (isSpam) {
        contextualReply = `Negative, motorman! Repeat your message clearly using standard maritime terminology. Do not repeat words on the comms line.`;
        contextualFeedback = `⚠️ Cảnh báo: Sử dụng thuật ngữ IMO SMCP chuẩn, tránh lặp từ vô nghĩa ("${textToSend}").`;
      } else if (cleanInput.includes('alarm') || cleanInput.includes('leak')) {
        contextualReply = `Acknowledge alarms. Isolate the high-pressure fuel line immediately and switch to the auxiliary fuel booster pump. Report the pressure reading.`;
        contextualFeedback = `🎯 Phản xạ tốt! Đã nhận diện đúng tình huống cảnh báo (${matchedKeywordCount} từ chuyên ngành). Tiếp tục báo cáo thông số áp suất.`;
      } else if (cleanInput.includes('check') || cleanInput.includes('inspect') || cleanInput.includes('stop')) {
        contextualReply = `Good initiative. Make sure you wear protective gear and tag out the breaker before inspection. Stand by for my visual check.`;
        contextualFeedback = `👍 Chuẩn quy trình an toàn STCW: Luôn gắn biển cảnh báo (tag out) và trang bị BHLĐ trước khi thao tác.`;
      } else if (matchedKeywordCount > 0) {
        contextualReply = `Understood. Proceed with standard troubleshooting as logged. Keep the watch alert and report any parameter drift.`;
        contextualFeedback = `✅ Thuật ngữ phù hợp. Cần bổ sung thêm số liệu cụ thể (nhiệt độ, áp suất) để báo cáo chuyên nghiệp hơn.`;
      } else {
        contextualReply = `Copy that. Please specify the equipment tag and current operating values according to the engine log.`;
        contextualFeedback = `💡 Gợi ý phản xạ: Hãy sử dụng các từ khóa hành động: "I have checked...", "Fuel valve is isolated", "Pressure is normal".`;
      }

      const isNetworkIssue = err?.name === 'AbortError' || err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError');
      const networkNotice = isNetworkIssue ? ' [Ngoại tuyến / Mạng lag]' : '';

      setSpeakingMessages([...nextMessages, {
        role: 'assistant',
        text: contextualReply,
        feedback: `⚓ [${partner}${networkNotice}]: ${contextualFeedback}`
      }]);
      speakText(contextualReply);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSpeechRecognition = async () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setCustomAlert({
        title: 'Microphone chưa khả dụng',
        message: 'Trình duyệt / WebView hiện tại chưa kích hoạt sẵn Google Speech Engine. Bạn có thể nhập tin nhắn trực tiếp vào ô chat bên dưới để trò chuyện nhé!',
        icon: 'mic'
      });
      return;
    }

    if (isRecording) {
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch { }
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      speechRecognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      let recognizedSpeech = '';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (e: any) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            recognizedSpeech += e.results[i][0].transcript;
          } else {
            interim += e.results[i][0].transcript;
          }
        }
        const currentSpoken = (recognizedSpeech || interim).trim();
        if (currentSpoken) {
          setInputText(currentSpoken);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
        const errType = err?.error;
        // Ignore aborted or no-speech without showing popup
        if (errType === 'no-speech' || errType === 'aborted') {
          return;
        }
        let errMsg = 'Không thể thu âm giọng nói.';
        if (errType === 'not-allowed') {
          errMsg = 'Quyền Micro bị từ chối. Vui lòng cho phép quyền truy cập Micro trên trình duyệt/thiết bị.';
        } else if (errType === 'network') {
          errMsg = 'Lỗi kết nối dịch vụ nhận diện giọng nói (cần có Internet). Bạn có thể gõ câu trả lời vào ô nhắn tin.';
        } else if (errType === 'audio-capture') {
          errMsg = 'Không tìm thấy hoặc không thể mở thiết bị thu âm Microphone.';
        }
        setCustomAlert({
          title: 'Trạng thái Micro',
          message: errMsg,
          icon: 'mic'
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
        const finalWord = recognizedSpeech.trim() || inputText.trim();
        if (finalWord) {
          handleSendSpeakingMessage(finalWord);
        }
      };

      recognition.start();
    } catch (e: any) {
      console.warn('Cannot start recognition:', e);
      setIsRecording(false);
      setCustomAlert({
        title: 'Lỗi khởi động Micro',
        message: `Không thể khởi động micro: ${e?.message || 'Lỗi thiết bị'}. Bạn có thể nhập tin nhắn trực tiếp bằng bàn phím.`,
        icon: 'mic'
      });
    }
  };

  // --- BLITZ QUIZ ENGINE ---
  const launchQuiz = () => {
    setActiveMode('quiz');
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setQuizScore(0);
    setQuizFinished(false);

    // Shuffle options for all quizzes in current course
    setCurrentCourse(prev => ({
      ...prev,
      quizzes: (prev.quizzes || []).map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }))
    }));
  };

  const handleSelectQuizOption = (opt: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(opt);
    setIsAnswerChecked(true);

    const activeQ = currentCourse.quizzes[quizIndex];
    if (!activeQ) return;
    const isCorrect = opt === activeQ.correctAnswer;

    // Pronounce the correct word AFTER user has made their choice
    if (activeQ.word) {
      speakText(activeQ.word);
    }

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
    const shuffledQuizzes = (node.quizzes || []).map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));

    setCurrentCourse(prev => ({
      ...prev,
      terms: node.terms,
      quizzes: shuffledQuizzes
    }));
    setTermsState(node.terms);
    setActiveMode('vocab-study');
    setVocabStudyType('flashcard');
    setIsCardFlipped(false);

    // Auto-resume session if user previously studied part of this node
    const savedIndex = lessonSessions[node.id];
    const startIndex = (typeof savedIndex === 'number' && savedIndex > 0 && savedIndex < node.terms.length)
      ? savedIndex
      : 0;

    setVocabIndex(startIndex);
    setVocabInput('');
    setVocabStatus('idle');
    setShowHint(false);
    setIsVietnameseOpen(true);
    setFlashcardStep('flip');
    setFlashcardRecallInput('');
    setFlashcardAiResult(null);

    const term = node.terms[startIndex] || node.terms[0];
    if (term && !isMuted) {
      speakText(`${term.sentenceBefore} ${term.word} ${term.sentenceAfter}`);
    }

    if (startIndex > 0) {
      setMilestoneToast({
        level: 1,
        title: `Tiếp tục: Thuật ngữ ${startIndex + 1}/${node.terms.length}`,
        subtitle: `Tự động vào từ bạn đang học dở`,
        sticker: 'gold-star'
      });
      setTimeout(() => setMilestoneToast(null), 3000);
    }
  };

  const handlePrevVocab = () => {
    if (vocabIndex > 0) {
      const prevIdx = vocabIndex - 1;
      setVocabIndex(prevIdx);
      if (selectedNode) {
        saveNodeSession(selectedNode.id, prevIdx);
      }
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
      saveMasteryRecord(currentTerm.id, currentTerm.word, true, 4);
      if (!isMuted) {
        speakText(currentTerm.word);
      }
      if (selectedNode) {
        const nextTarget = Math.min(currentCourse.terms.length - 1, vocabIndex + 1);
        saveNodeSession(selectedNode.id, nextTarget);
      }
    } else {
      setVocabStatus('wrong');
      saveMasteryRecord(currentTerm.id, currentTerm.word, false, 1);
    }
  };

  const handleNextVocab = () => {
    if (vocabIndex < currentCourse.terms.length - 1) {
      const nextIdx = vocabIndex + 1;
      setVocabIndex(nextIdx);
      if (selectedNode) {
        saveNodeSession(selectedNode.id, nextIdx);
      }
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
      if (selectedNode) {
        clearNodeSession(selectedNode.id);
      }
      // Seamlessly progress into Stage 2: 25-Question Interleaved Repetition Protocol!
      launchDaily25Protocol('auto');
    }
  };

  const toggleVocabSpeechRecognition = async () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setCustomAlert({
        title: 'Microphone chưa hỗ trợ',
        message: 'Trình duyệt hiện tại chưa hỗ trợ Web Speech API. Bạn có thể nhập từ vựng bằng bàn phím.',
        icon: 'info'
      });
      return;
    }

    if (vocabRecording) {
      if (vocabRecognitionRef.current) {
        try { vocabRecognitionRef.current.stop(); } catch { }
      }
      setVocabRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      vocabRecognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setVocabRecording(true);
      };

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
    } catch (_) {
      setVocabRecording(false);
    }
  };

  const handleToggleTermMastery = (termId: string) => {
    setTermsState(prev => prev.map(t => {
      if (t.id === termId) {
        const nextDots = Math.min(10, (t.dots || 0) + 1);
        saveMasteryRecord(t.id, t.word, true, 4);
        return { ...t, dots: nextDots, mastered: nextDots >= 10 };
      }
      return t;
    }));
  };

  const handleResetTermProgress = (termId: string) => {
    setTermsState(prev => prev.map(t => t.id === termId ? { ...t, dots: 0, mastered: false } : t));
    try {
      const records = getMasteryRecords();
      delete records[termId];
      localStorage.setItem('dio_vocab_mastery_records', JSON.stringify(records));
    } catch (_) { }
  };

  const speakText = (text: string, audioKey?: string) => {
    if (!text || isMuted) return;
    const key = audioKey || text;

    // Toggle stop if tapping on the already active audio button
    if (activeAudioKey === key) {
      soundService.stop();
      if (activeAudioTimerRef.current) clearTimeout(activeAudioTimerRef.current);
      setActiveAudioKey(null);
      return;
    }

    if (activeAudioTimerRef.current) clearTimeout(activeAudioTimerRef.current);
    setActiveAudioKey(key);

    soundService.speak(text, 'en-US', 0.95, () => {
      setActiveAudioKey(prev => prev === key ? null : prev);
    });

    const fallbackDuration = Math.max(1600, Math.min(12000, text.length * 90));
    activeAudioTimerRef.current = setTimeout(() => {
      setActiveAudioKey(prev => prev === key ? null : prev);
    }, fallbackDuration);
  };

  const filteredVocab = termsState.filter(v => {
    const matchesSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    if (vocabSegment === 'open') {
      return matchesSearch && !v.mastered;
    }
    return matchesSearch;
  });

  // ONBOARDING INTRO GUARD: Hiển thị 1 lần duy nhất cho người dùng mới
  if (!hasSeenOnboarding) {
    return (
      <OnboardingScreen
        onFinish={({ department, rank, dailyGoal }) => {
          localStorage.setItem('dio_dept', department);
          localStorage.setItem('dio_daily_goal', String(dailyGoal));
          setCurrentDepartment(department);
          setUserProfile(profile => {
            const next = { ...profile, department, rank };
            localStorage.setItem('dio_user_profile', JSON.stringify(next));
            return next;
          });
          localStorage.setItem('dio_has_seen_onboarding', 'true');
          setHasSeenOnboarding(true);
        }}
      />
    );
  }

  // MANDATORY AUTH GUARD: Phải đăng ký / đăng nhập tài khoản mới được vào học
  if (!isLoggedIn && localStorage.getItem('dio_auth_bypass') !== 'true') {
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

          <div style={{
            background: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: 16,
            padding: '12px 14px',
            marginBottom: 18,
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1D4ED8' }}>
              🔒 Yêu cầu đăng nhập tài khoản Google
            </span>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
              Hồ sơ thuyền viên, bảng xếp hạng và chứng chỉ STCW được lưu trữ đồng bộ trên tài khoản Google của bạn.
            </p>
          </div>

          {/* CHỌN BAN CHUYÊN MÔN HÀNG HẢI */}
          <label className="dio-input-label" style={{ textAlign: 'left', marginBottom: 6, display: 'block' }}>
            Ban chuyên môn hàng hải:
          </label>
          <div className="dio-dept-radio-grid">
            <div
              className={`dio-dept-radio-card ${currentDepartment === 'engine' ? 'selected' : ''}`}
              onClick={() => handleSwitchDepartment('engine')}
            >
              <span style={{ fontSize: '1.6rem' }}>⚙️</span>
              <div className="dio-dept-radio-title">Ban Máy</div>
              <div className="dio-dept-radio-sub">Engineering</div>
            </div>

            <div
              className={`dio-dept-radio-card ${currentDepartment === 'deck' ? 'selected' : ''}`}
              onClick={() => handleSwitchDepartment('deck')}
            >
              <span style={{ fontSize: '1.6rem' }}>🧭</span>
              <div className="dio-dept-radio-title">Ban Boong</div>
              <div className="dio-dept-radio-sub">Navigation</div>
            </div>
          </div>

          {/* 🌟 NÚT ĐĂNG NHẬP GOOGLE BẮT BUỘC */}
          <button
            type="button"
            className="dio-google-btn-hero"
            onClick={() => handleGoogleSignIn()}
            disabled={isGoogleLoading}
            id="google-hero-signin-btn"
            style={{ marginTop: 8, padding: '16px 20px', fontSize: '1.02rem', width: '100%' }}
          >
            <GoogleIcon />
            <span>{isGoogleLoading ? 'Đang kết nối Google...' : 'Đăng nhập bằng tài khoản Google'}</span>
          </button>

          <div style={{ marginTop: 24, fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center' }}>
            Dio Talk Maritime English © 2026 • Chuẩn IMO STCW
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`peaktalk-content ${activeMode !== 'none' ? 'fullscreen-lesson' : ''} ${nightMode ? 'night-bridge-mode' : ''}`}>
        {/* ========================================================================= */}
        {/* MODE 1: ACTIVE SPEAKING SESSION                                          */}
        {/* ========================================================================= */}
        {activeMode === 'speaking' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, flex: 1 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'white', borderRadius: 20, marginBottom: 14, boxShadow: 'var(--shadow-card)' }}>
              <button
                onClick={handleExitActiveMode}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer' }}
              >
                <ArrowLeft size={18} color="#475569" />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>{activeSpeakingOfficer?.title || currentCourse.title}</h4>
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
                  ● Đang luyện với {activeSpeakingOfficer?.role || currentCourse.partnerRole}
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
                onClick={handleExitActiveMode}
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

                      {isAnswerChecked && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                          <div className="quiz-word-highlight">
                            <span>{currentCourse.quizzes[quizIndex].word}</span>
                            <button
                              onClick={() => speakText(currentCourse.quizzes[quizIndex].word)}
                              style={{ background: '#EBF5FF', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              title="Nghe phát âm chuẩn"
                            >
                              <Volume2 size={16} color="#2F70E8" />
                            </button>
                          </div>
                          <div className="quiz-phonetic">
                            {currentCourse.quizzes[quizIndex].phonetic}
                          </div>
                        </div>
                      )}

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
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#C2410C', marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span>+1 Ngày</span>
                      <Sticker3D name="flame" size={20} />
                    </div>
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
                onClick={handleExitActiveMode}
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
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '5px 12px', borderRadius: 10, letterSpacing: '0.5px', border: '1px solid #BFDBFE' }}>
                                  MẶT TRƯỚC • THUẬT NGỮ HÀNG HẢI
                                </span>
                                {(() => {
                                  const term = currentCourse.terms[vocabIndex];
                                  if (!term) return null;
                                  const rec = getMasteryRecords()[term.id];
                                  const ret = rec ? calculateRetentionScore(rec.lastReviewed, rec.intervalDays || 1) : 100;
                                  const badgeColor = ret >= 80 ? '#16A34A' : ret >= 50 ? '#D97706' : '#DC2626';
                                  const badgeBg = ret >= 80 ? '#F0FDF4' : ret >= 50 ? '#FFFBEB' : '#FEF2F2';
                                  return (
                                    <span
                                      title={`Độ bền trí nhớ Ebbinghaus: ${ret}%. Khoảng cách ôn tiếp theo: ${rec?.intervalDays || 1} ngày`}
                                      style={{ fontSize: '0.72rem', fontWeight: 800, color: badgeColor, background: badgeBg, padding: '5px 8px', borderRadius: 10, border: `1px solid ${badgeColor}33`, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                                    >
                                      🧠 {ret}% trí nhớ
                                    </span>
                                  );
                                })()}
                              </div>
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
                        placeholder="Gõ từ vựng..."
                        value={flashcardRecallInput}
                        onChange={(e) => setFlashcardRecallInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCheckFlashcardRecall();
                        }}
                      />
                      <button
                        className="study-action-btn-3d primary"
                        style={{ padding: '0 12px', borderRadius: 14, flexShrink: 0, height: 46, whiteSpace: 'nowrap', minWidth: 92, boxSizing: 'border-box' }}
                        onClick={handleCheckFlashcardRecall}
                      >
                        <Bot size={16} />
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
                    {/* 10 Dots Indicator */}
                    <div className="blank-dots-row" title={`Độ lặp lại: ${currentCourse.terms[vocabIndex]?.dots || 0}/10 lần`}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                        <div
                          key={d}
                          className={`blank-dot ${d <= (currentCourse.terms[vocabIndex]?.dots || 0) ? 'filled' : ''}`}
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
                  setCustomConfirm({
                    title: 'Tạm Dừng Phiên Học?',
                    message: 'Bạn có muốn tạm dừng phiên học giao thức 25 câu hôm nay không? Điểm số và các câu bạn vừa hoàn thành đã được hệ thống lưu lại an toàn.',
                    icon: 'hourglass',
                    confirmText: 'Tạm dừng',
                    cancelText: 'Học tiếp',
                    isDestructive: true,
                    onConfirm: () => {
                      setActiveMode('none');
                      window.speechSynthesis.cancel();
                    }
                  });
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
                  {dailySession.newTermsCount} từ bài này • {dailySession.previewTermsCount || 0} từ bài tới • {dailySession.reviewTermsCount} từ ôn tập
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
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className={`daily-q-type-badge ${dailySession.questions[dailyQIdx].isReinforcement ? 'reinforcement' :
                        dailySession.questions[dailyQIdx].isPreview ? 'preview' :
                          dailySession.questions[dailyQIdx].isReview ? 'review' : 'new'
                      }`}>
                      {dailySession.questions[dailyQIdx].tagLabel || (
                        dailySession.questions[dailyQIdx].isReinforcement ? '⚡ CỦNG CỐ TỪ VỪA LÀM SAI' :
                          dailySession.questions[dailyQIdx].isPreview ? '🔭 TỪ BÀI TIẾP THEO (KHÁM PHÁ TRƯỚC)' :
                            dailySession.questions[dailyQIdx].isReview ? '🔄 TỪ ĐÃ HỌC (ÔN TẬP SM-2)' : '⭐ TỪ BÀI HIỆN TẠI (GHI NHỚ)'
                      )}
                    </span>
                    {(() => {
                      const q = dailySession.questions[dailyQIdx];
                      const rec = getMasteryRecords()[q.termId];
                      if (!rec) return null;
                      const ret = calculateRetentionScore(rec.lastReviewed, rec.intervalDays || 1);
                      return (
                        <span
                          title={`Khoảng cách ôn tiếp: ${rec.intervalDays || 1} ngày`}
                          style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '4px 8px', borderRadius: 8 }}
                        >
                          🧠 {ret}% nhớ
                        </span>
                      );
                    })()}
                  </div>
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

                    {((dailySession.questions[dailyQIdx].questionType === 'cloze' && (dailyAiResult ? dailyAiResult.isCorrect : dailyInput.trim().toLowerCase() === dailySession.questions[dailyQIdx].correctAnswer.toLowerCase())) || dailySelectedOpt?.toLowerCase() === dailySession.questions[dailyQIdx].correctAnswer.toLowerCase()) && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #BFDBFE' }}>
                        <button
                          type="button"
                          onClick={() => speakText(`${dailySession.questions[dailyQIdx].sentenceBefore} ${dailySession.questions[dailyQIdx].targetWord} ${dailySession.questions[dailyQIdx].sentenceAfter}`.replace(/\s+/g, ' ').trim())}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', padding: 0, color: '#0369A1', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          <Volume2 size={16} /> Nghe lại toàn câu
                        </button>
                        <div style={{ marginTop: 8, color: '#075985', fontSize: '0.96rem', fontWeight: 700, lineHeight: 1.55 }}>
                          {`${dailySession.questions[dailyQIdx].sentenceBefore} ${dailySession.questions[dailyQIdx].targetWord} ${dailySession.questions[dailyQIdx].sentenceAfter}`.replace(/\s+/g, ' ').trim()}
                        </div>
                        <div style={{ marginTop: 4, color: '#475569', fontSize: '0.86rem', lineHeight: 1.45 }}>
                          {dailySession.questions[dailyQIdx].vietnameseSentence || dailySession.questions[dailyQIdx].meaningVi}
                        </div>
                      </div>
                    )}

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
                <div style={{ marginBottom: 14 }}>
                  <Sticker3D name="medal" size={68} />
                </div>
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
                  setCustomConfirm({
                    title: 'Thoát Bài Thi Marlins?',
                    message: 'Bạn có chắc muốn thoát bài thi Marlins? Kết quả bài làm hiện tại sẽ không được lưu.',
                    icon: 'warning',
                    confirmText: 'Thoát bài thi',
                    cancelText: 'Làm tiếp',
                    isDestructive: true,
                    onConfirm: () => {
                      setActiveMode('none');
                      window.speechSynthesis.cancel();
                    }
                  });
                }}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer' }}
                title="Thoát bài thi"
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
                  <div style={{ marginBottom: 12 }}>
                    <Sticker3D name={(marlinsScore / MARLINS_EXAM_DATA.length) >= 0.7 ? 'trophy' : 'anchor'} size={68} />
                  </div>
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
                onClick={handleExitActiveMode}
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

            {/* VHF Ultra-Realistic 3D Marine Radio Hardware */}
            <div className="vhf-marine-deck-3d">
              {/* Radio Top Screw Screws & Antenna Mount */}
              <div className="vhf-top-bracket-3d">
                <div className="vhf-hardware-screw" />
                <div className="vhf-antenna-stub">
                  <div className="vhf-antenna-tip" />
                  <div className="vhf-antenna-coil" />
                </div>
                <div className="vhf-hardware-screw" />
              </div>

              {/* Main Marine Radio Chassis */}
              <div className="vhf-hardware-bezel">
                {/* Brand & Model Emboss */}
                <div className="vhf-chassis-brand">
                  <div className="vhf-brand-left">
                    <span className="brand-title">ICOM-MARINE • IC-M330G</span>
                    <span className="brand-class">CLASS D DSC • IMO SMCP TRANSCEIVER</span>
                  </div>
                  <div className="vhf-vol-squelch-row">
                    <div className="vhf-mini-knob">
                      <div className="knob-cap" />
                      <span>VOL</span>
                    </div>
                    <div className="vhf-mini-knob">
                      <div className="knob-cap" style={{ transform: 'rotate(45deg)' }} />
                      <span>SQL</span>
                    </div>
                  </div>
                </div>

                {/* Tactical Dot-Matrix Backlit LCD Screen */}
                <div className="vhf-screen-lcd">
                  <div className="vhf-lcd-glass-glare" />
                  <div className="vhf-lcd-top-status">
                    <div className="vhf-channel-badge-3d">
                      <span className="ch-label">CH</span>
                      <span className="ch-num">{selectedVhf.channel.replace('CH', '').trim()}</span>
                    </div>
                    <div className="vhf-lcd-mid-telemetry">
                      <span className={`vhf-tx-rx-indicator ${vhfIsTransmitting ? 'tx' : 'rx'}`}>
                        {vhfIsTransmitting ? '● TX TRANSMIT (HIGH)' : '● RX RECEIVING (25W)'}
                      </span>
                      <span className="vhf-signal-bars">
                        SIGNAL: <strong style={{ color: '#6EE7B7' }}>█████ MAX</strong>
                      </span>
                    </div>
                    <div className="vhf-lcd-mode-tag">INTL DUAL-WATCH</div>
                  </div>

                  {/* Scenario Station Name Header */}
                  <div className="vhf-scenario-badge">
                    <Sticker3D name="radio" size={16} />
                    <span>{selectedVhf.title}</span>
                  </div>

                  {/* Radio Transcript Messages Log */}
                  <div className="vhf-transcript-box">
                    {selectedVhf.dialogueSteps.slice(0, vhfStepIdx + 1).map((msg, i) => (
                      <div
                        key={i}
                        className={`vhf-msg-bubble ${msg.speakerRole === 'ship' ? 'me' : 'station'}`}
                      >
                        <div className="vhf-msg-speaker">
                          <Sticker3D name={msg.speakerRole === 'ship' ? 'anchor' : 'vts-radar'} size={15} />
                          <span>{msg.speakerRole === 'ship' ? 'THIS IS M/V OCEAN PIONEER' : selectedVhf.otherStationName.toUpperCase()}</span>
                        </div>
                        <div className="vhf-msg-text">
                          "{msg.messageText}"
                        </div>
                        <div className="vhf-msg-trans">
                          👉 {msg.vietnameseMeaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heavy Duty Die-cast Speaker Grille & Status LED */}
                <div className="vhf-sub-panel">
                  <div className="vhf-speaker-grille">
                    <div className="vhf-grille-line" />
                    <div className="vhf-grille-line" />
                    <div className="vhf-grille-line" />
                    <div className="vhf-grille-line" />
                  </div>
                  <div className="vhf-distress-cap">
                    <span className="distress-title">DISTRESS</span>
                    <div className="distress-btn-safety">LIFT COVER</div>
                  </div>
                </div>

                {/* Tactile PTT (Push-To-Talk) Handheld Mic Module */}
                <div className="vhf-ptt-container">
                  <div className="vhf-prompt-banner">
                    <div className="vhf-status-pill">
                      {vhfFeedback ? (
                        <span>{vhfFeedback}</span>
                      ) : vhfStepIdx >= selectedVhf.dialogueSteps.length - 1 ? (
                        <span style={{ color: '#4ADE80', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Check size={16} /> Thông thoại tình huống hoàn tất!
                        </span>
                      ) : selectedVhf.dialogueSteps[vhfStepIdx + 1]?.speakerRole === 'ship' ? (
                        <span style={{ color: '#FDE047', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Sticker3D name="mic" size={15} /> Đến lượt tàu bạn trả lời. Nhấn giữ PTT!
                        </span>
                      ) : (
                        <span style={{ color: '#93C5FD', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Sticker3D name="radio" size={15} /> Đang lắng nghe phản hồi vô tuyến...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3D Round PTT Button with Realistic Bezel, Glow & Ring */}
                  <div className="vhf-ptt-housing-3d">
                    <button
                      className={`vhf-ptt-button ${vhfIsTransmitting ? 'active' : ''}`}
                      onClick={handleVhfPttToggle}
                      disabled={vhfStepIdx >= selectedVhf.dialogueSteps.length - 1}
                      title="Nhấn để phát sóng hoặc ngắt mic"
                    >
                      <div className="vhf-ptt-inner-core">
                        <div className="vhf-ptt-mic-wave">
                          <Radio size={32} />
                        </div>
                        <span className="vhf-ptt-label">
                          {vhfIsTransmitting ? 'TRANSMITTING...' : 'PRESS PTT'}
                        </span>
                        <span className="vhf-ptt-sublabel">
                          {vhfIsTransmitting ? 'RELEASE TO OVER' : 'HOLD TO TALK'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* SMCP Guidance Box */}
              <div style={{ padding: '0 16px', marginTop: 14 }}>
                <div className="vhf-smcp-guidance-3d">
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38BDF8', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Sticker3D name="bulb" size={18} />
                    <span>QUY CHUẨN ĐÀI THOẠI HÀNG HẢI (IMO SMCP):</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                    Luôn kết thúc câu thoại bằng từ <strong>"OVER"</strong> khi chờ phản hồi từ trạm khác, hoặc <strong>"OUT"</strong> khi kết thúc liên lạc. Không bao giờ nói <em>"Over and Out"</em> cùng lúc!
                  </div>
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
                onClick={handleExitActiveMode}
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

            <div style={{ padding: '16px 14px 40px 14px' }}>
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
                <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sticker3D name="mic" size={16} />
                  <span>Mức độ khẩn cấp (Urgency Level):</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', color: '#FEF08A', lineHeight: 1.5, fontWeight: 800 }}>
                  {selectedEmergency.urgencyLevel}
                </div>
              </div>

              {/* Step by step SOLAS Action Checklist */}
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sticker3D name="psc-clipboard" size={18} />
                <span>Quy trình thao tác khẩn cấp (SOLAS Mandatory Steps):</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedEmergency.steps.map((st) => {
                  const isSpeaking = activeAudioKey === `emergency-${st.stepNumber}`;
                  return (
                    <div
                      key={st.stepNumber}
                      className="emergency-step-item-card"
                    >
                      <div className="emergency-step-num-badge">
                        {st.stepNumber}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', flex: 1, minWidth: 0, lineHeight: 1.4 }}>
                            {st.radioCommandEn}
                          </div>
                          <button
                            className={`vocab-play-btn emergency ${isSpeaking ? 'playing' : ''}`}
                            onClick={() => speakText(st.radioCommandEn, `emergency-${st.stepNumber}`)}
                            title={isSpeaking ? "Dừng nghe" : "Nghe khẩu lệnh chuẩn SOLAS"}
                          >
                            {isSpeaking ? (
                              <span className="audio-wave-anim">
                                <span className="bar bar-1"></span>
                                <span className="bar bar-2"></span>
                                <span className="bar bar-3"></span>
                              </span>
                            ) : (
                              <Play size={14} fill="#DC2626" />
                            )}
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
                  );
                })}
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
                    <div
                      className={`dio-stat-pill streak ${completedToday > 0 ? 'lit' : 'unlit'}`}
                      title={completedToday > 0 ? `Chuỗi ${userProfile.streakDays} ngày • Đã giữ lửa hôm nay (${completedToday}/25 câu)!` : `Chuỗi ${userProfile.streakDays} ngày • Chưa học hôm nay (Lửa đang le lói)`}
                      onClick={() => setShowStreakModal(true)}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <div className="streak-pill-flame">
                        <Sticker3D name="flame" size={20} />
                      </div>
                      <span>{userProfile.streakDays}</span>
                    </div>
                    <div className="dio-stat-pill hearts" title="Trái tim năng lượng" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sticker3D name="heart" size={20} />
                      <span>{userProfile.hearts}</span>
                    </div>
                    <div
                      className="dio-stat-pill xp"
                      title="Kinh nghiệm & Đá quý tích lũy (Bấm để đổi Skin cho Pet Dio)"
                      onClick={() => setShowPetWardrobe(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                      <Sticker3D name="gem" size={20} />
                      <span>{userProfile.xp}</span>
                    </div>

                    {/* NIGHT BRIDGE MODE TOGGLE BUTTON */}
                    <button
                      onClick={toggleNightMode}
                      className="dio-stat-pill theme-toggle"
                      style={{
                        background: nightMode ? '#1E293B' : '#EFF6FF',
                        border: nightMode ? '1px solid #334155' : '1px solid #BFDBFE',
                        color: nightMode ? '#FBBF24' : '#2563EB',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 14
                      }}
                      title={nightMode ? 'Chuyển sang Chế độ Ban ngày' : 'Bật Chế độ Ban đêm (Night Bridge Mode)'}
                    >
                      {nightMode ? <Sun size={17} /> : <Moon size={17} />}
                    </button>
                  </div>
                </div>

                {/* DIO PET MASCOT COMPANION WIDGET */}
                <PetCompanionWidget
                  skin={activePetSkin}
                  currentGems={userProfile.xp}
                  onOpenWardrobe={() => setShowPetWardrobe(true)}
                />

                {/* Offline Sea-Voyage Mode Banner */}
                {!isOnline && (
                  <div style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: 14,
                    padding: '8px 14px',
                    margin: '10px 0 4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#334155'
                  }}>
                    <Sticker3D name="ship" size={16} />
                    <span>Hải trình Ngoại tuyến: Bài học & tiến độ tự lưu vào máy</span>
                  </div>
                )}

                {/* DAILY GOAL PROGRESS WIDGET (PROGRESSIVE 25 QUESTIONS) */}
                <div
                  style={{ background: '#FFFFFF', borderRadius: 16, padding: '14px 16px', margin: '14px 0', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', cursor: 'pointer' }}
                  onClick={() => setShowStreakModal(true)}
                  title="Nhấn để xem thang bậc Streak 25 câu"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sticker3D name="target" size={22} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>Mục tiêu hôm nay</span>
                      {completedToday >= 25 ? (
                        <span style={{ fontSize: '0.68rem', background: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: 99, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Sticker3D name="flame" size={14} /> ĐÃ BÙNG NỔ
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.68rem', background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                          {completedToday >= 20 ? 'Mức 4' : completedToday >= 15 ? 'Mức 3' : completedToday >= 10 ? 'Mức 2' : completedToday >= 5 ? 'Mức 1' : 'Khởi đầu'}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: completedToday >= 25 ? '#16A34A' : '#2563EB' }}>
                      {completedToday} / 25 câu
                    </span>
                  </div>
                  <div className="streak-prog-bar" style={{ height: 9, borderRadius: 6, background: '#F1F5F9' }}>
                    <div
                      className="streak-prog-fill"
                      style={{
                        width: `${Math.min(100, Math.round((completedToday / 25) * 100))}%`,
                        background: completedToday >= 25
                          ? 'linear-gradient(90deg, #EA580C, #F59E0B)'
                          : completedToday >= 15
                            ? 'linear-gradient(90deg, #2563EB, #06B6D4)'
                            : '#2563EB',
                        transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    ></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.72rem', color: '#64748B' }}>
                    <span>{completedToday >= 25 ? '🔥 Đã giữ vững Streak ngày!' : `Còn ${Math.max(0, 25 - completedToday)} câu nữa để đạt Streak`}</span>
                    <span style={{ color: '#2563EB', fontWeight: 700 }}>Chi tiết bậc thang ❯</span>
                  </div>
                </div>

                {/* EBBINGHAUS MEMORY RETENTION RADAR WIDGET */}
                {(() => {
                  const fluency = getFluencyStatus();
                  return (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        borderRadius: 18,
                        padding: '16px',
                        margin: '14px 0',
                        color: 'white',
                        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: '1rem' }}>🧠</span>
                            <span style={{ fontSize: '0.86rem', fontWeight: 800, letterSpacing: '0.3px', color: '#F8FAFC' }}>
                              RADAR TRÍ NHỚ EBBINGHAUS
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            Đo lường độ bền trí nhớ dài hạn thời gian thực
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: fluency.averageRetention >= 80 ? '#4ADE80' : fluency.averageRetention >= 60 ? '#FBBF24' : '#F87171' }}>
                            {fluency.averageRetention}%
                          </span>
                          <div style={{ fontSize: '0.66rem', color: '#CBD5E1', fontWeight: 700 }}>Độ lưu giữ</div>
                        </div>
                      </div>

                      {/* Retention Gauge Bar */}
                      <div style={{ height: 8, borderRadius: 99, background: 'rgba(255, 255, 255, 0.12)', overflow: 'hidden', marginBottom: 12 }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${fluency.averageRetention}%`,
                            background: fluency.averageRetention >= 80
                              ? 'linear-gradient(90deg, #10B981, #34D399)'
                              : fluency.averageRetention >= 60
                                ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                                : 'linear-gradient(90deg, #EF4444, #F87171)',
                            borderRadius: 99,
                            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                          }}
                        />
                      </div>

                      {/* 3 Metric Pills */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: '8px 10px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38BDF8' }}>{fluency.totalLearned}</div>
                          <div style={{ fontSize: '0.64rem', color: '#94A3B8' }}>Đã nạp</div>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: '8px 10px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#4ADE80' }}>{fluency.masteredCount}</div>
                          <div style={{ fontSize: '0.64rem', color: '#94A3B8' }}>Thuộc làu</div>
                        </div>

                        <div style={{ background: fluency.dueTodayCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: '8px 10px', textAlign: 'center', border: fluency.dueTodayCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: fluency.dueTodayCount > 0 ? '#F87171' : '#E2E8F0' }}>
                            {fluency.dueTodayCount}
                          </div>
                          <div style={{ fontSize: '0.64rem', color: fluency.dueTodayCount > 0 ? '#FCA5A5' : '#94A3B8', fontWeight: fluency.dueTodayCount > 0 ? 700 : 400 }}>
                            {fluency.dueTodayCount > 0 ? '⚠️ Cần ôn ngay' : 'Đến hạn hôm nay'}
                          </div>
                        </div>
                      </div>

                      {/* Action Prompt */}
                      {fluency.dueTodayCount > 0 && (
                        <button
                          onClick={() => launchDaily25Protocol()}
                          style={{
                            width: '100%',
                            marginTop: 12,
                            padding: '10px 14px',
                            background: 'linear-gradient(90deg, #2563EB, #1D4ED8)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
                          }}
                        >
                          <span>⚡ Khởi động phiên giải cứu {fluency.dueTodayCount} từ đến hạn</span>
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* DEPARTMENT SWITCHER: BAN MÁY VS BAN BOONG */}
                <div className="dio-dept-switch">
                  <button
                    className={`dio-dept-btn ${currentDepartment === 'engine' ? 'active' : ''}`}
                    onClick={() => handleSwitchDepartment('engine')}
                    onPointerDown={() => soundService.playPop()}
                  >
                    <Wrench size={16} />
                    <span>Ban Máy (Engineering)</span>
                  </button>
                  <button
                    className={`dio-dept-btn ${currentDepartment === 'deck' ? 'active' : ''}`}
                    onClick={() => handleSwitchDepartment('deck')}
                    onPointerDown={() => soundService.playPop()}
                  >
                    <Compass size={16} />
                    <span>Ban Boong (Navigation)</span>
                  </button>
                </div>

                {/* TODAY'S VOYAGE: Dynamic progression following skill tree */}
                {(() => {
                  const deptNodes = skillTreeNodes.filter(n => n.department === currentDepartment);
                  const activeNodeIdx = deptNodes.findIndex(n => n.isUnlocked && n.stars < 3);
                  const voyageNode = (activeNodeIdx !== -1 ? deptNodes[activeNodeIdx] : deptNodes[deptNodes.length - 1]) || skillTreeNodes[0];
                  const voyageIdx = activeNodeIdx !== -1 ? activeNodeIdx : Math.max(0, deptNodes.length - 1);
                  const isAllDeptCompleted = activeNodeIdx === -1 && deptNodes.length > 0 && deptNodes.every(n => n.stars >= 3);

                  return (
                    <section className="dio-voyage" aria-labelledby="today-voyage-title">
                      <div className="dio-voyage-kicker">
                        <span>HẢI TRÌNH HÔM NAY</span>
                        <span className="dio-voyage-xp">+{isAllDeptCompleted ? '100' : '20'} XP</span>
                      </div>
                      <div className="dio-voyage-heading">
                        <div className="dio-voyage-orb">
                          <Sticker3D emoji={voyageNode.icon || '⚓'} size={34} />
                        </div>
                        <div>
                          <p>CHẶNG {String(voyageIdx + 1).padStart(2, '0')} · {currentDepartment === 'engine' ? 'ENGINE ROOM' : 'BRIDGE WATCH'}</p>
                          <h2 id="today-voyage-title">{voyageNode.title}</h2>
                          <span>
                            {voyageNode.stars > 0 ? `Đã đạt ${voyageNode.stars}/3 sao · Ôn tập` : `${voyageNode.terms?.length || 8} từ mới · STCW ${voyageNode.rankTitle}`}
                          </span>
                        </div>
                      </div>
                      <div className="dio-voyage-route" aria-label="Tiến trình bài học">
                        {voyageIdx > 0 && (
                          <>
                            <span className="is-done" title="Bài trước đã hoàn thành">✓</span>
                            <i />
                          </>
                        )}
                        <span className="is-current" title={`Bài hiện tại: ${voyageNode.title}`}>{voyageIdx + 1}</span>
                        <i />
                        <span>{voyageIdx + 2}</span>
                        <i />
                        <span>★</span>
                      </div>
                      <button
                        className="dio-voyage-start"
                        onClick={() => launchIntegratedNodeLesson(voyageNode)}
                        onPointerDown={() => soundService.playClick()}
                      >
                        VÀO HẢI TRÌNH (BÀI {voyageIdx + 1}) <ChevronRight size={20} />
                      </button>
                    </section>
                  );
                })()}

                <section className="dio-tool-dock" aria-label="Công cụ huấn luyện">
                  <button
                    className="dio-tool-item"
                    onClick={() => launchVhfScenario(VHF_SCENARIOS[0])}
                    onPointerDown={() => soundService.playPop()}
                  >
                    <Sticker3D name="radio" size={27} /><span>VHF<br />Radio</span>
                  </button>
                  <button
                    className="dio-tool-item danger"
                    onClick={() => launchEmergencyScenario(EMERGENCY_SCENARIOS[0])}
                    onPointerDown={() => soundService.playPop()}
                  >
                    <Sticker3D name="siren" size={27} /><span>Khẩn<br />cấp</span>
                  </button>
                  <button
                    className="dio-tool-item"
                    onClick={() => { setActiveTab('learn'); setLearnSubTab('smcp'); }}
                    onPointerDown={() => soundService.playPop()}
                  >
                    <Sticker3D name="psc-clipboard" size={27} /><span>Mẫu<br />SMCP</span>
                  </button>
                  <button
                    className="dio-tool-item"
                    onClick={() => setActiveTab('ai')}
                    onPointerDown={() => soundService.playPop()}
                  >
                    <Sticker3D name="chief-engineer" size={27} /><span>AI<br />Luyện nói</span>
                  </button>
                </section>

                <button
                  className="dio-exam-strip"
                  onClick={launchMarlinsExam}
                  onPointerDown={() => soundService.playClick()}
                >
                  <Sticker3D name="bronze-medal" size={30} />
                  <span><b>Marlins English Test</b><small>Thi thử STCW · 45 phút</small></span>
                  <ChevronRight size={20} />
                </button>

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
                              <span className="stcw-icon-3d">
                                <Sticker3D name={isAllMastered ? 'crown' : 'anchor'} size={26} />
                              </span>
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
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}>
                                  {reached ? '✓' : <Sticker3D name="lock" size={12} />}
                                  <span>{m.vocab} từ: {m.title.split(' ')[0]}</span>
                                </span>
                              );
                            })}
                          </div>

                          <div className="stcw-milestone-footer">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              {isAllMastered && <Sticker3D name="trophy" size={14} />}
                              <span>
                                {isAllMastered
                                  ? 'Đã vượt mốc 1000 từ vựng và mở khóa toàn bộ nấc thang chức danh.'
                                  : `Còn ${Math.max(0, targetVocab - completedDeptTerms)} từ chuyên ngành để thăng cấp.`}
                              </span>
                            </span>
                            <span className="stcw-pct-text">{progressPct}% hoàn thành</span>
                          </div>
                        </div>

                        {Array.from(new Set(skillTreeNodes.filter(n => n.department === currentDepartment).map(n => n.rankTitle))).map(rankTitle => {
                          const rankNodes = skillTreeNodes.filter(n => n.department === currentDepartment && n.rankTitle === rankTitle);
                          const reqVocab = getRankRequiredVocab(rankTitle);
                          const userRank = userProfile.rank || '';
                          const isUserRankOrLower = userRank && (
                            rankTitle.toLowerCase().includes(userRank.toLowerCase()) ||
                            userRank.toLowerCase().includes(rankTitle.toLowerCase()) ||
                            (userRank.includes('Motorman') && rankTitle.includes('Wiper')) ||
                            (userRank.includes('Thợ máy') && rankTitle.includes('Lau máy')) ||
                            (userRank.includes('Thủy thủ') && rankTitle.includes('Học viên'))
                          );
                          const isGated = !isUserRankOrLower && reqVocab > 0 && completedDeptTerms < reqVocab;

                          return (
                            <div key={rankTitle} style={{ width: '100%', marginBottom: 16 }}>
                              {/* Rank Header Divider */}
                              <div className="tree-rank-divider">
                                <span className="tree-rank-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                  <Sticker3D name="anchor" size={18} />
                                  <span>{rankTitle}</span>
                                </span>
                                {isGated ? (
                                  <span className="tree-rank-tag" style={{ background: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <Sticker3D name="lock" size={12} />
                                    <span>Cần {reqVocab} từ ({completedDeptTerms}/{reqVocab})</span>
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
                                  const isNextActive = effectiveUnlocked && node.stars === 0 && (!rankNodes[nIdx - 1] || rankNodes[nIdx - 1].stars > 0);

                                  return (
                                    <div
                                      key={node.id}
                                      className={`tree-node-item ${zigzagPos}`}
                                      onClick={() => {
                                        if (isGated) {
                                          showLockedNotice(`🔒 Cần ${completedDeptTerms}/${reqVocab} từ để mở khóa cấp bậc ${rankTitle}!`);
                                          return;
                                        }
                                        if (effectiveUnlocked) {
                                          launchIntegratedNodeLesson(node);
                                        } else {
                                          showLockedNotice('🔒 Hãy hoàn thành bài học trước để mở khóa!');
                                        }
                                      }}
                                    >
                                      {isNextActive && (
                                        <div className="duo-active-bubble">
                                          <span>BẮT ĐẦU</span>
                                          <div className="duo-bubble-arrow" />
                                        </div>
                                      )}
                                      <button
                                        className={`tree-node-circle ${!effectiveUnlocked ? 'locked' : ''}`}
                                        onPointerDown={() => {
                                          if (effectiveUnlocked && !isGated) {
                                            soundService.playPop();
                                          } else {
                                            soundService.playWrong();
                                          }
                                        }}
                                      >
                                        {effectiveUnlocked ? (
                                          <Sticker3D emoji={node.icon} size={30} />
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
                      <div className="quick-3d-icon-badge" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}>
                        <Sticker3D name="document" size={26} />
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
                      <div className="quick-3d-icon-badge" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                        <Sticker3D name="medal" size={26} />
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
                      <div className="quick-3d-icon-badge" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                        <Sticker3D name="bell" size={26} />
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
                      <div className="quick-3d-icon-badge" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}>
                        <Sticker3D name="compass" size={26} />
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
                                  <Sticker3D name={isAllMastered ? 'crown' : 'medal'} size={24} />
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
                                      padding: '3px 10px',
                                      borderRadius: 12,
                                      background: reached ? '#DCFCE7' : '#F1F5F9',
                                      color: reached ? '#15803D' : '#64748B',
                                      border: `1px solid ${reached ? '#86EFAC' : '#CBD5E1'}`,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}>
                                      {reached ? '✓' : <Sticker3D name="lock" size={12} />}
                                      <span>{m.vocab} từ: {m.title.split(' ')[0]}</span>
                                    </span>
                                  );
                                })}
                              </div>

                              <p style={{ margin: 0, fontSize: 11.5, color: '#475569', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 5 }}>
                                {isAllMastered && <Sticker3D name="trophy" size={15} />}
                                <span>
                                  {isAllMastered
                                    ? 'Xuất sắc! Bạn đã vượt mốc 1000 từ vựng và mở khóa toàn bộ nấc thang chức danh hàng hải.'
                                    : `Cần hoàn thành từng mốc STCW: 100 từ (Thợ máy) → 400 từ (Sĩ quan) → 600 từ (Điện/Đại phó) → 800 từ (Máy trưởng/Thuyền trưởng).`}
                                </span>
                              </p>
                            </div>

                            {Array.from(new Set(skillTreeNodes.filter(n => n.department === currentDepartment).map(n => n.rankTitle))).map(rankTitle => {
                              const rankNodes = skillTreeNodes.filter(n => n.department === currentDepartment && n.rankTitle === rankTitle);
                              const reqVocab = getRankRequiredVocab(rankTitle);
                              const userRank = userProfile.rank || '';
                              const isUserRankOrLower = userRank && (
                                rankTitle.toLowerCase().includes(userRank.toLowerCase()) ||
                                userRank.toLowerCase().includes(rankTitle.toLowerCase()) ||
                                (userRank.includes('Motorman') && rankTitle.includes('Wiper')) ||
                                (userRank.includes('Thợ máy') && rankTitle.includes('Lau máy')) ||
                                (userRank.includes('Thủy thủ') && rankTitle.includes('Học viên'))
                              );
                              const isGated = !isUserRankOrLower && reqVocab > 0 && completedDeptTerms < reqVocab;

                              return (
                                <div key={rankTitle} style={{ width: '100%', marginBottom: 16 }}>
                                  <div className="tree-rank-divider">
                                    <span className="tree-rank-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                      <Sticker3D name="anchor" size={18} />
                                      <span>{rankTitle}</span>
                                    </span>
                                    {isGated ? (
                                      <span className="tree-rank-tag" style={{ background: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        <Sticker3D name="lock" size={12} />
                                        <span>Cần {reqVocab} từ ({completedDeptTerms}/{reqVocab})</span>
                                      </span>
                                    ) : (
                                      <span className="tree-rank-tag">{rankNodes.filter(n => n.isUnlocked).length}/{rankNodes.length} Đã mở</span>
                                    )}
                                  </div>

                                  <div className="tree-nodes-stream" style={{ marginTop: 20 }}>
                                    {rankNodes.map((node, nIdx) => {
                                      const zigzagPos = nIdx % 3 === 0 ? 'pos-center' : nIdx % 3 === 1 ? 'pos-left' : 'pos-right';
                                      const effectiveUnlocked = isGated ? false : node.isUnlocked;
                                      const isNextActive = effectiveUnlocked && node.stars === 0 && (!rankNodes[nIdx - 1] || rankNodes[nIdx - 1].stars > 0);

                                      return (
                                        <div
                                          key={node.id}
                                          className={`tree-node-item ${zigzagPos}`}
                                          onClick={() => {
                                            if (isGated) {
                                              showLockedNotice(`🔒 Cần ${completedDeptTerms}/${reqVocab} từ để mở khóa cấp bậc ${rankTitle}!`);
                                              return;
                                            }
                                            if (effectiveUnlocked) {
                                              launchIntegratedNodeLesson(node);
                                            } else {
                                              showLockedNotice('🔒 Hãy hoàn thành bài học trước để mở khóa!');
                                            }
                                          }}
                                        >
                                          {isNextActive && (
                                         <div className="duo-active-bubble">
                                           <span>BẮT ĐẦU</span>
                                           <div className="duo-bubble-arrow" />
                                         </div>
                                       )}
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

                    {filteredVocab.map((item) => {
                      const isLearned = (item.dots || 0) > 0;
                      const isMaxed = (item.dots || 0) >= 10;
                      return (
                        <div key={item.id} className="vocab-card">
                          <div className="vocab-card-header">
                            <div className="vocab-dots-row" title={`Số lần lặp lại: ${item.dots || 0}/10 lần`}>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => (
                                <div
                                  key={d}
                                  className={`vocab-dot ${d <= (item.dots || 0) ? (isMaxed ? 'maxed' : 'filled') : ''}`}
                                />
                              ))}
                              <span className={`vocab-dots-count ${isMaxed ? 'maxed' : isLearned ? 'learned' : ''}`}>
                                {item.dots || 0}/10
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="vocab-reset-btn"
                                onClick={() => handleToggleTermMastery(item.id)}
                                style={{
                                  background: isMaxed ? '#DCFCE7' : isLearned ? '#FEF2F2' : '#F1F5F9',
                                  color: isMaxed ? '#16A34A' : isLearned ? '#DC2626' : '#64748B',
                                  fontWeight: 700
                                }}
                              >
                                {isMaxed ? '✓ Đã thuộc (10/10)' : `+1 Lần học (${item.dots || 0}/10)`}
                              </button>

                              <button
                                className="vocab-reset-btn"
                                onClick={() => handleResetTermProgress(item.id)}
                                title="Đặt lại tiến độ từ này về 0"
                              >
                                <RotateCcw size={12} />
                              </button>
                            </div>

                            {(() => {
                              const isSpeaking = activeAudioKey === `vocab-${item.id}`;
                              return (
                                <button
                                  className={`vocab-play-btn ${isSpeaking ? 'playing' : ''}`}
                                  onClick={() => speakText(`${item.word}. ${item.example}`, `vocab-${item.id}`)}
                                  title={isSpeaking ? "Dừng nghe" : "Phát âm từ & câu ví dụ"}
                                >
                                  {isSpeaking ? (
                                    <span className="audio-wave-anim">
                                      <span className="bar bar-1"></span>
                                      <span className="bar bar-2"></span>
                                      <span className="bar bar-3"></span>
                                    </span>
                                  ) : (
                                    <Play size={14} fill="#2563EB" />
                                  )}
                                </button>
                              );
                            })()}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <div className={`vocab-word-title ${isLearned ? 'learned' : ''}`}>
                              {item.word}
                            </div>
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
                    );
                  })}
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
                        style={{ padding: '6px 14px', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                        onClick={() => setSelectedSmcpMarker('all')}
                      >
                        Tất cả (8 Mẫu)
                      </button>
                      {['INSTRUCTION', 'WARNING', 'ADVICE', 'INFORMATION', 'QUESTION', 'ANSWER', 'REQUEST', 'INTENTION'].map(m => (
                        <button
                          key={m}
                          className={`vocab-segment-btn ${selectedSmcpMarker === m ? 'active' : ''}`}
                          style={{ padding: '6px 14px', fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                          onClick={() => setSelectedSmcpMarker(m)}
                        >
                          {m}
                        </button>
                      ))}
                    </div>

                    <div className="smcp-marker-grid">
                      {SMCP_PHRASES.filter(p => selectedSmcpMarker === 'all' || p.marker === selectedSmcpMarker).map(item => {
                        const isSpeaking = activeAudioKey === `smcp-${item.id}`;
                        return (
                          <div key={item.id} className="smcp-item-card">
                            <div className="smcp-item-header">
                              <span className="smcp-item-marker">{item.marker}</span>
                              <span className="smcp-item-meaning">{item.markerVi}</span>
                            </div>
                            <div className="smcp-item-phrase">"{item.phrase}"</div>
                            <div className="smcp-item-sub">👉 {item.vietnamese}</div>

                            <div className="smcp-item-footer">
                              <span className="smcp-item-example">
                                {isSpeaking ? '🔊 Đang phát âm đài thoại...' : '📻 Chuẩn đàm thoại VHF'}
                              </span>
                              <button
                                className={`vocab-play-btn ${isSpeaking ? 'playing' : ''}`}
                                onClick={() => speakText(`${item.marker}. ${item.phrase}`, `smcp-${item.id}`)}
                                title={isSpeaking ? "Dừng nghe" : "Nghe mẫu đàm thoại"}
                              >
                                {isSpeaking ? (
                                  <span className="audio-wave-anim">
                                    <span className="bar bar-1"></span>
                                    <span className="bar bar-2"></span>
                                    <span className="bar bar-3"></span>
                                  </span>
                                ) : (
                                  <Play size={14} fill="#2563EB" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                  <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', fontWeight: 800, padding: '4px 10px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Sticker3D name="coin" size={16} />
                    <span>{userProfile.coins || 100} Xu Hải trình</span>
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
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Sticker3D name="gamepad" size={16} />
                    <span>15 Game Hàng Hải</span>
                  </button>
                  <button
                    className={`game-tab-btn ${practiceFilter === 'vhf' ? 'active' : ''}`}
                    onClick={() => setPracticeFilter('vhf')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Sticker3D name="radio" size={16} />
                    <span>Đài Thoại VHF</span>
                  </button>
                  <button
                    className={`game-tab-btn ${practiceFilter === 'emergency' ? 'active' : ''}`}
                    onClick={() => setPracticeFilter('emergency')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Sticker3D name="siren" size={16} />
                    <span>SOLAS Khẩn Cấp</span>
                  </button>
                  <button
                    className={`game-tab-btn ${practiceFilter === 'marlins' ? 'active' : ''}`}
                    onClick={() => setPracticeFilter('marlins')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Sticker3D name="document" size={16} />
                    <span>Đề Thi Marlins</span>
                  </button>
                </div>

                {/* 15 MARITIME GAMIFICATION GAMES GRID */}
                {(practiceFilter === 'all' || practiceFilter === 'games') && (
                  <div style={{ marginBottom: 24, marginTop: 10 }}>
                    <div className="section-title-row">
                      <div className="section-h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sticker3D name="gamepad" size={22} />
                        <span>15 Minigames Hàng Hải (Master Plan 80-100)</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>15 Trò chơi</span>
                    </div>

                    <div className="games-grid">
                      {MARITIME_15_GAMES.map(game => {
                        const isDoneToday = completedGames.includes(game.id);
                        return (
                          <div
                            key={game.id}
                            className={`game-card-item ${isDoneToday ? 'completed' : ''}`}
                            onClick={() => handleLaunchGame(game)}
                            style={{ position: 'relative', border: isDoneToday ? '1.5px solid #86EFAC' : undefined }}
                          >
                            {isDoneToday && (
                              <div style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: '#DCFCE7',
                                color: '#15803D',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3
                              }}>
                                ✓ HOÀN TẤT
                              </div>
                            )}
                            <div>
                              <span className="game-card-badge" style={{ background: game.badgeColor }}>
                                {game.badge}
                              </span>
                              <div className="game-card-icon" style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                                <Sticker3D emoji={game.icon} size={44} />
                              </div>
                              <h4 className="game-card-title">{game.title}</h4>
                              <p className="game-card-desc">{game.description}</p>
                            </div>
                            <div className="game-card-footer">
                              <span>+{game.xpReward} XP • +{game.coinReward} Xu</span>
                              <span style={{ color: isDoneToday ? '#16A34A' : '#2563EB', fontWeight: 700 }}>
                                {isDoneToday ? 'Luyện lại ➔' : 'Chơi ➔'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section VHF Transceiver */}
                {(practiceFilter === 'all' || practiceFilter === 'vhf') && (
                  <div style={{ marginBottom: 20 }}>
                    <div className="section-title-row">
                      <div className="section-h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sticker3D name="radio" size={22} />
                        <span>Vô Tuyến Điện VHF Marine (SMCP)</span>
                      </div>
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
                      <div className="section-h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sticker3D name="siren" size={22} />
                        <span>Quy Trình Khẩn Cấp SOLAS</span>
                      </div>
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
                      <div className="section-h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sticker3D name="lightning" size={22} />
                        <span>Thử Thách & Thi Thử Quốc Tế</span>
                      </div>
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
                    {
                      title: 'Chánh kỹ sư máy (Chief Engineer)',
                      role: 'Chief Engineer',
                      desc: 'Báo cáo sự cố rò rỉ dầu cao áp, khởi động máy phát diesel dự phòng',
                      icon: '👨‍✈️',
                      tag: 'Engine',
                      initialDialogue: 'Motorman, this is the Chief Engineer. We have a severe fuel leak at generator number two and exhaust gas deviation. Report your findings and corrective actions.',
                      systemPrompt: 'You are the Chief Engineer on an ocean vessel. Challenge the motorman on engine room operations, alarms, machinery maintenance, and STCW safety. Speak concise maritime English and provide Vietnamese feedback in format: "[Feedback]: <nhận xét>".'
                    },
                    {
                      title: 'Đài điều phối luồng VTS Singapore',
                      role: 'VTS Operator',
                      desc: 'Báo cáo vị trí hoa tiêu, mớn nước tĩnh và xin chuyển kênh giám sát',
                      icon: '📡',
                      tag: 'Bridge',
                      initialDialogue: 'Vessel Ocean Pioneer, this is Singapore VTS on VHF Channel 12. Report your present position, maximum draft, pilot boarding ground, and intentions. Over.',
                      systemPrompt: 'You are the Singapore Vessel Traffic Service (VTS) operator. Communicate in strict IMO SMCP maritime VHF English. Prompt for position, draft, traffic, and intentions. Give concise English and Vietnamese feedback.'
                    },
                    {
                      title: 'Thanh tra viên kiểm tra cảng (PSC Inspector)',
                      role: 'Port State Control',
                      desc: 'Kiểm tra giấy chứng nhận phao bè cứu sinh SOLAS và nhật ký dầu',
                      icon: '📋',
                      tag: 'Audit',
                      initialDialogue: 'Good morning Officer. I am the Port State Control Inspector. Please present your Oil Record Book Part 1, muster list, and life-saving appliance certificates.',
                      systemPrompt: 'You are an international PSC Inspector checking ship compliance under Tokyo/Paris MOU. Ask questions on MARPOL, lifeboats, fire safety, and certificates in professional maritime English. Give Vietnamese feedback.'
                    },
                    {
                      title: 'Chuyên gia giám định tàu dầu (SIRE Auditor)',
                      role: 'SIRE Oil Auditor',
                      desc: 'Phỏng vấn quy trình bơm hàng, trơ hóa bồn chứa và tiếp nhiên liệu',
                      icon: '🛢️',
                      tag: 'Tanker',
                      initialDialogue: 'Chief Officer, explain your enclosed space entry permit procedures, manifold watch, and inert gas system positive pressure control.',
                      systemPrompt: 'You are an OCIMF SIRE Oil Auditor inspecting an oil/chemical tanker. Ask realistic vetting questions about cargo operations, inert gas, pumproom safety, and manifold checks. Speak clear technical English and give Vietnamese feedback.'
                    },
                    {
                      title: 'Hoa tiêu dẫn tàu (Harbour Pilot)',
                      role: 'Maritime Pilot',
                      desc: 'Phối hợp lệnh lái bẻ bánh lái, tốc độ máy đệm và hoa tiêu cập cầu',
                      icon: '⚓',
                      tag: 'Navigation',
                      initialDialogue: 'Master and Helmsman, good morning. Steer course two seven zero, engine dead slow ahead, and prepare forward spring lines for berthing. Over.',
                      systemPrompt: 'You are a Maritime Pilot conning an ocean ship into port. Issue authentic helm orders, engine orders, and docking instructions in standard maritime English. Give Vietnamese feedback.'
                    },
                    {
                      title: 'Sĩ quan an ninh bến cảng (PFSO)',
                      role: 'Port Facility Security',
                      desc: 'Xác nhận cấp độ an ninh ISPS Level 1/2 và kiểm soát người lạ',
                      icon: '🛡️',
                      tag: 'Security',
                      initialDialogue: 'Gangway watch, this is the Port Facility Security Officer. What is your current ISPS security level and how do you verify visitor identification and baggage?',
                      systemPrompt: 'You are the Port Facility Security Officer (PFSO) assessing ship security under the ISPS Code. Quiz the watchstander on visitor checks, restricted area access, and security levels. Give Vietnamese feedback.'
                    },
                    {
                      title: 'Thuyền trưởng tàu mẹ (Shipmaster / Captain)',
                      role: 'Captain',
                      desc: 'Giao ban hàng hải, xử lý tình huống tránh va và thời tiết biển động cấp 8',
                      icon: '👨‍✈️',
                      tag: 'Command',
                      initialDialogue: 'Officer of the watch, the barometer is falling sharply and a crossing vessel on our starboard bow is at CPA zero decimal two miles. What are your immediate actions under COLREGs?',
                      systemPrompt: 'You are the Captain on an ocean voyage. Test the crew on COLREGs collision avoidance, bad weather seamanship, and bridge watch handover. Converse in precise maritime English and provide Vietnamese feedback.'
                    },
                    {
                      title: 'Đại diện chủ hàng & P&I (P&I Cargo Surveyor)',
                      role: 'P&I Cargo Surveyor',
                      desc: 'Giám định độ kín nắp hầm hàng, thông gió và kiểm tra hư hỏng hàng hóa',
                      icon: '📦',
                      tag: 'Cargo',
                      initialDialogue: 'Chief Mate, we are conducting the ultrasonic tightness test on cargo hatch covers number one and three. Have the bilge wells, non-return valves, and rubber packings been inspected?',
                      systemPrompt: 'You are a P&I Cargo Surveyor inspecting cargo hold integrity, dunnage, ventilation, and damage prevention. Challenge the ship officers on cargo safety and provide Vietnamese feedback.'
                    },
                    {
                      title: 'Trung tâm Phối hợp Cứu nạn MRCC (MRCC Coordinator)',
                      role: 'MRCC SAR Controller',
                      desc: 'Điều phối cứu nạn hàng hải SAR, kích hoạt phát tín hiệu cấp cứu Mayday',
                      icon: '🆘',
                      tag: 'SAR',
                      initialDialogue: 'Pan-Pan, Pan-Pan, Pan-Pan. All stations in Sea Area A3, this is Maritime Rescue Coordination Center. We have an unconfirmed EPIRB distress signal at latitude 10-15 North, longitude 107-20 East. Can your vessel assist?',
                      systemPrompt: 'You are an MRCC SAR Controller coordinating search and rescue under IAMSAR. Communicate in strict IMO SMCP maritime distress procedures. Provide Vietnamese feedback.'
                    },
                    {
                      title: 'Thợ lặn khảo sát thân tàu ngầm (Underwater Hull Surveyor)',
                      role: 'Hull Diver & Surveyor',
                      desc: 'Khảo sát chân vịt, bánh lái, kẽm chống ăn mòn và sinh vật bám vỏ tàu',
                      icon: '🤿',
                      tag: 'Drydock',
                      initialDialogue: 'Bridge and Engine Room, this is dive team leader on VHF Channel 08. We are preparing to inspect the rudder horn, propeller blades, and sea chest strainers. Confirm engines and thrusters are isolated and tagged out.',
                      systemPrompt: 'You are an Underwater Hull Surveyor inspecting ship bottom, zinc anodes, propeller, and sea suction chests. Test the crew on Lockout/Tagout (LOTO) and diving safety procedures. Provide Vietnamese feedback.'
                    }
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
                      onClick={() => launchSpeaking(p)}
                    >
                      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Sticker3D emoji={p.icon} size={46} />
                        </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 12px 0' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>Hồ Sơ Thuyền Viên STCW</h3>
                  <button
                    className="vocab-reset-btn"
                    onClick={() => setShowAuthModal(true)}
                    style={{ background: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.75rem', padding: '5px 12px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                  >
                    <Sticker3D name="pencil" size={14} />
                    <span>Sửa hồ sơ</span>
                  </button>
                </div>

                {/* Streamlined Profile & Stats Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '14px 16px', marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="dio-avatar-circle" style={{ width: 48, height: 48, fontSize: '1.25rem', flexShrink: 0 }}>
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userProfile.name}
                        </h4>
                        <span className="dio-user-rank-pill" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          {userProfile.rank}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {userProfile.email}
                      </p>
                    </div>
                  </div>

                  {/* Compact 4-col Quick Metric Strip */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                    <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '6px 4px' }}>
                      <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                        <Sticker3D name="lightning" size={13} /> Luyện
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{calculatedMinutes}m</div>
                    </div>
                    <div style={{ background: '#F0FDF4', borderRadius: 10, padding: '6px 4px' }}>
                      <div style={{ fontSize: '0.66rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                        <Sticker3D name="target" size={13} /> Chuẩn
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D', marginTop: 2 }}>{calculatedAccuracy}%</div>
                    </div>
                    <div style={{ background: '#FFF7ED', borderRadius: 10, padding: '6px 4px' }}>
                      <div style={{ fontSize: '0.66rem', color: '#EA580C', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                        <Sticker3D name="flame" size={13} /> Streak
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#C2410C', marginTop: 2 }}>{userProfile.streakDays}d</div>
                    </div>
                    <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '6px 4px' }}>
                      <div style={{ fontSize: '0.66rem', color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                        <Sticker3D name="gem" size={13} /> Điểm XP
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1D4ED8', marginTop: 2 }}>{userProfile.xp}</div>
                    </div>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 10, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Sticker3D name="medal" size={20} />
                  <span>Năng Lực Tiếng Anh Hàng Hải (STCW 78/2010):</span>
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

                {/* ============================================================= */}
                {/* 🏆 BẢNG VÀNG THUYỀN VIÊN TOÀN CẦU (TOP CHUỖI & TỪ VỰNG)       */}
                {/* ============================================================= */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: '16px 14px', marginBottom: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sticker3D name="trophy" size={24} />
                      <div>
                        <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                          Bảng Vàng Thuyền Viên Hàng Hải
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          Chuẩn STCW & IMO • Dữ liệu thật Firebase
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => syncAndLoadLeaderboard(true)}
                        disabled={isLeaderboardLoading}
                        title="Đồng bộ trực tiếp dữ liệu từ Firebase Cloud"
                        style={{
                          background: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          borderRadius: 8,
                          padding: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#1D4ED8',
                          cursor: isLeaderboardLoading ? 'wait' : 'pointer'
                        }}
                      >
                        <RefreshCw size={12} className={isLeaderboardLoading ? 'spin' : ''} />
                        <span>{isLeaderboardLoading ? 'Đang tải...' : 'Làm mới'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Toggle Metric Pills */}
                  <div style={{ display: 'flex', gap: 6, background: '#F1F5F9', padding: 4, borderRadius: 12, marginBottom: 14 }}>
                    <button
                      onClick={() => setLeaderboardMetric('streak')}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: 9,
                        border: 'none',
                        background: leaderboardMetric === 'streak' ? '#FFFFFF' : 'transparent',
                        color: leaderboardMetric === 'streak' ? '#EA580C' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: leaderboardMetric === 'streak' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Sticker3D name="flame" size={16} />
                      <span>Top Chuỗi Ngày (Streak)</span>
                    </button>
                    <button
                      onClick={() => setLeaderboardMetric('vocab')}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: 9,
                        border: 'none',
                        background: leaderboardMetric === 'vocab' ? '#FFFFFF' : 'transparent',
                        color: leaderboardMetric === 'vocab' ? '#2563EB' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: leaderboardMetric === 'vocab' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Sticker3D name="document" size={16} />
                      <span>Top Từ Vựng Đã Học</span>
                    </button>
                  </div>

                  {/* Top Users List from Real Firebase Cloud Firestore */}
                  {(() => {
                    const sorted = [...leaderboardUsers].sort((a, b) => {
                      if (leaderboardMetric === 'streak') {
                        return (b.streak || 0) - (a.streak || 0);
                      }
                      return (b.vocab || 0) - (a.vocab || 0);
                    });

                    return (
                      <div>
                        {/* Live Sync Status Banner */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0 4px 10px',
                          fontSize: '0.68rem',
                          color: '#64748B',
                          borderBottom: '1px solid #F1F5F9',
                          marginBottom: 10
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }} />
                            <span>{leaderboardSyncNotice}</span>
                          </span>
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>
                            {sorted.length} Thuyền viên hoạt động
                          </span>
                        </div>

                        {sorted.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: '0.8rem' }}>
                            <RefreshCw size={18} className="spin" style={{ margin: '0 auto 8px', display: 'block', color: '#2563EB' }} />
                            Đang kết nối cơ sở dữ liệu Firebase Cloud (studio-xdudz)...
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {sorted.map((item, idx) => {
                              const pos = idx + 1;
                              const isTop1 = pos === 1;
                              const isTop2 = pos === 2;
                              const isTop3 = pos === 3;

                              return (
                                <div
                                  key={item.uid || item.name}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 12px',
                                    borderRadius: 14,
                                    background: item.isCurrentUser
                                      ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
                                      : isTop1
                                        ? '#FFFBEB'
                                        : isTop2
                                          ? '#F8FAFC'
                                          : '#FFFFFF',
                                    border: item.isCurrentUser
                                      ? '1.5px solid #3B82F6'
                                      : isTop1
                                        ? '1px solid #FCD34D'
                                        : '1px solid #F1F5F9',
                                    boxShadow: item.isCurrentUser ? '0 3px 8px rgba(37, 99, 235, 0.15)' : 'none',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {/* Position badge */}
                                    <div style={{
                                      width: 26,
                                      height: 26,
                                      borderRadius: 8,
                                      background: isTop1 ? '#F59E0B' : isTop2 ? '#94A3B8' : isTop3 ? '#B45309' : '#E2E8F0',
                                      color: isTop1 || isTop2 || isTop3 ? '#FFFFFF' : '#475569',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 900,
                                      fontSize: '0.78rem',
                                      flexShrink: 0
                                    }}>
                                      {pos}
                                    </div>

                                    {/* Avatar */}
                                    <div style={{
                                      width: 38,
                                      height: 38,
                                      borderRadius: 12,
                                      background: item.avatarBg || '#2563EB',
                                      color: '#FFFFFF',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 800,
                                      fontSize: '0.95rem',
                                      flexShrink: 0,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                      overflow: 'hidden'
                                    }}>
                                      {item.avatar && (item.avatar.startsWith('http://') || item.avatar.startsWith('https://') || item.avatar.startsWith('data:')) ? (
                                        <img
                                          src={item.avatar}
                                          alt={item.name}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                          onError={(e) => {
                                            (e.currentTarget as HTMLElement).style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        item.avatar && item.avatar.length <= 3 ? item.avatar : item.name.charAt(0).toUpperCase()
                                      )}
                                    </div>

                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: item.isCurrentUser ? '#1D4ED8' : '#0F172A' }}>
                                          {item.name}
                                        </span>
                                        {item.isCurrentUser && (
                                          <span style={{ fontSize: '0.62rem', background: '#2563EB', color: '#FFF', fontWeight: 800, padding: '1px 6px', borderRadius: 6 }}>
                                            BẠN
                                          </span>
                                        )}
                                      </div>
                                      <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: 1 }}>
                                        {item.rank} • {item.ship}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Metric Value Display */}
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    {leaderboardMetric === 'streak' ? (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                                        <Sticker3D name="flame" size={18} />
                                        <div>
                                          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#EA580C' }}>
                                            {item.streak || 1} ngày
                                          </div>
                                          <div style={{ fontSize: '0.65rem', color: '#64748B' }}>
                                            {item.vocab || 0} từ thuộc
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                                        <Sticker3D name="document" size={18} />
                                        <div>
                                          <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#2563EB' }}>
                                            {item.vocab || 0} từ
                                          </div>
                                          <div style={{ fontSize: '0.65rem', color: '#EA580C', fontWeight: 700 }}>
                                            🔥 {item.streak || 1} ngày
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* App Settings List */}
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: 10, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Sticker3D name="gear" size={20} />
                  <span>Cài Đặt Ứng Dụng</span>
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
                        <Sticker3D name="bot" size={24} />
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
                      setCustomAlert({
                        title: 'Đám Mây Firebase Cloud',
                        message: 'Cơ sở dữ liệu Dio Talk đang hoạt động HOÀN TOÀN TỰ ĐỘNG và đồng bộ vĩnh viễn với Firebase Cloud (studio-xdudz).\n\nMọi tiến độ của bạn đều được bảo toàn 100%.',
                        icon: 'cloud'
                      });
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div className="settings-item-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sticker3D name="cloud" size={20} />
                        <span>Đám mây Firebase Cloud</span>
                      </div>
                      <div className="settings-item-sub" style={{ color: '#16A34A', fontWeight: 600, paddingLeft: 28 }}>
                        ● studio-xdudz (Đang kích hoạt vĩnh viễn)
                      </div>
                    </div>
                    <ChevronRight size={18} color="#94A3B8" />
                  </div>

                  <div
                    className="settings-item"
                    onClick={() => setHasSeenOnboarding(false)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div className="settings-item-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sticker3D name="sparkles" size={20} />
                        <span>Hướng dẫn & Giới thiệu tính năng</span>
                      </div>
                      <div className="settings-item-sub" style={{ paddingLeft: 28 }}>Xem lại Onboarding chuẩn IMO & STCW</div>
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
                        <div className="settings-item-title" style={{ color: '#166534', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Sticker3D name="rocket" size={18} />
                          <span>Kiểm Tra Cập Nhật Online</span>
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
                      <div className="settings-item-title" style={{ color: '#1E3A8A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Sticker3D name="anchor" size={16} />
                        <span>Dio Talk • MC1 VERSION</span>
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
                <Sticker3D name={ind === 'Hàng hải' ? 'ship' : 'bot'} size={32} />
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
                <Sticker3D emoji={selectedGame?.icon || '⚔️'} size={36} />
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
                  <div className="duel-timer-badge" style={{ background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Sticker3D name="flame" size={14} />
                    <span>Combo x{duelCombo}</span>
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
                {/* Target Term Audio Pill - Reveal ONLY after user selects an answer to prevent spoiling */}
                {duelIsChecked ? (
                  <div className="duel-target-pill" style={{ animation: 'fadeIn 0.3s ease' }}>
                    <span>{activeGameQuestions[duelQIndex].targetTerm}</span>
                    <button
                      onClick={() => speakText(activeGameQuestions[duelQIndex].targetTerm)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 size={16} color="#1D4ED8" />
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 500 }}>
                      {activeGameQuestions[duelQIndex].phonetic}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '10px 0 14px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0284C7',
                      background: '#E0F2FE',
                      padding: '4px 12px',
                      borderRadius: 16
                    }}>
                      🎯 Thử thách kiến thức • Chọn đáp án đúng
                    </span>
                  </div>
                )}

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
                <div style={{ marginBottom: 10 }}>
                  <Sticker3D name="trophy" size={68} />
                </div>
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
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#92400E', marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span>+{duelScore * 5}</span>
                      <Sticker3D name="coin" size={20} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="study-action-btn"
                    style={{ flex: 1, padding: 14 }}
                    onClick={() => {
                      if (selectedGame) {
                        const newQ = getQuestionsForGame(selectedGame.id);
                        setActiveGameQuestions(newQ);
                      }
                      setDuelQIndex(0);
                      setDuelScore(0);
                      setDuelFinished(false);
                      setDuelSelectedOpt(null);
                      setDuelIsChecked(false);
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

      {/* DIO SCREEN PET SHIMEJI PATROL (Tuần tra đáy màn hình & nhắc bài học) */}
      {activeMode === 'none' && !showPetWardrobe && (
        <PetShimejiPatrol
          skin={activePetSkin}
          currentGems={userProfile.xp}
          onStudyClick={() => {
            setActiveTab('learn');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onWardrobeClick={() => setShowPetWardrobe(true)}
        />
      )}

      {/* Bottom Navigation Bar (Master Plan Section 4: 5 Core Tabs) */}
      {activeMode === 'none' && (
        <div className="peaktalk-bottom-nav">
          <button
            className={`nav-bottom-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            onPointerDown={() => soundService.playClick()}
          >
            <Home size={22} />
            <span>Trang chủ</span>
          </button>

          <button
            className={`nav-bottom-item ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => setActiveTab('learn')}
            onPointerDown={() => soundService.playClick()}
          >
            <BookOpen size={22} />
            <span>Học tập</span>
          </button>

          <button
            className={`nav-bottom-item ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
            onPointerDown={() => soundService.playClick()}
          >
            <Radio size={22} />
            <span>Luyện tập</span>
          </button>

          <button
            className={`nav-bottom-item ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
            onPointerDown={() => soundService.playClick()}
          >
            <Bot size={22} />
            <span>AI Đàm thoại</span>
          </button>

          <button
            className={`nav-bottom-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            onPointerDown={() => soundService.playClick()}
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
          onClose={() => {
            if (appUpdateInfo) {
              sessionStorage.setItem('dio_dismissed_update_version', appUpdateInfo.version);
            }
            setAppUpdateInfo(null);
          }}
        />
      )}

      {/* 1. FLOATING PROGRESSIVE MILESTONE TOAST (LEVEL 1 -> 4) */}
      {milestoneToast && (
        <div
          className={`streak-milestone-toast lvl-${milestoneToast.level}`}
          onClick={() => {
            setMilestoneToast(null);
            setShowStreakModal(true);
          }}
        >
          <div className="milestone-icon-badge" style={{ background: 'transparent' }}>
            <Sticker3D name={milestoneToast.sticker} size={28} />
          </div>
          <div className="milestone-info">
            <span className="milestone-title">{milestoneToast.title}</span>
            <span className="milestone-sub">{milestoneToast.subtitle}</span>
          </div>
        </div>
      )}

      {/* FLOATING IN-APP LOCKED/RESTRICTED LEVEL NOTICE */}
      {lockedNotice && (
        <div className="dio-locked-toast" onClick={() => setLockedNotice(null)} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
          <Sticker3D name="lock" size={22} />
          <span>{lockedNotice}</span>
        </div>
      )}

      {/* 2. GRAND STREAK CELEBRATION MODAL (25 QUESTIONS DUOLINGO STYLE) */}
      {showStreakCelebration && (
        <div className="streak-celebration-backdrop" onClick={(e) => {
          if (e.target === e.currentTarget) handleClaimStreakCelebration();
        }}>
          {/* Confetti & Star Shower Explosion */}
          <div className="streak-confetti-container">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="streak-confetti-piece" />
            ))}
          </div>

          <div className="streak-celebration-dialog">
            {/* Sunburst background aura */}
            <div className="streak-sunburst-bg" />

            {/* Raging Hero Flame 3D */}
            <div className="streak-flame-hero-wrap">
              <div className="streak-flame-halo" />
              <div className="streak-flame-emblem">
                <Sticker3D name="flame" size={62} />
                <div className="streak-count-badge">
                  <span>25/25 CÂU</span>
                </div>
              </div>
            </div>

            <div className="streak-celebration-title">CHÚC MỪNG BẠN! 🔥</div>
            <div className="streak-celebration-desc">
              Bạn đã hoàn thành xuất sắc mục tiêu <strong>25 câu hỏi</strong> hôm nay! Ngọn lửa Streak của bạn tiếp tục bùng cháy rực rỡ!
            </div>

            {/* Reward Chips (All 3D Stickers) */}
            <div className="streak-rewards-grid">
              <div className="streak-reward-chip">
                <Sticker3D name="gem" size={30} />
                <span className="streak-reward-val">+100</span>
                <span className="streak-reward-lbl">XP Tích Lũy</span>
              </div>
              <div className="streak-reward-chip">
                <Sticker3D name="coin" size={30} />
                <span className="streak-reward-val">+25</span>
                <span className="streak-reward-lbl">Xu Thưởng</span>
              </div>
              <div className="streak-reward-chip">
                <Sticker3D name="flame" size={30} />
                <span className="streak-reward-val">+{userProfile.streakDays + 1}</span>
                <span className="streak-reward-lbl">Ngày Streak</span>
              </div>
            </div>

            {/* 3D Tactile Claim Button */}
            <button
              className="streak-claim-btn"
              onClick={handleClaimStreakCelebration}
            >
              <span>TIẾP TỤC HỌC TẬP</span>
              <span>❯</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. STREAK PROGRESS & MILESTONE LADDER MODAL (ALL 3D STICKERS) */}
      {showStreakModal && (
        <div
          className="streak-celebration-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowStreakModal(false);
          }}
        >
          <div className="streak-celebration-dialog" style={{ textAlign: 'left', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className={`streak-modal-flame-box ${completedToday >= 25 ? 'lit' : 'unlit'}`}>
                  <Sticker3D name="flame" size={30} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>Chuỗi Ngày Streak</h3>
                  {completedToday >= 25 ? (
                    <span style={{ fontSize: '0.8rem', color: '#EA580C', fontWeight: 800 }}>{userProfile.streakDays} ngày liên tiếp • Đã giữ lửa 🔥</span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 800 }}>{userProfile.streakDays} ngày liên tiếp • Lửa đang le lói 🕯️</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                style={{ background: '#F1F5F9', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#475569" />
              </button>
            </div>

            {/* Duolingo 7-Day Streak Week Row */}
            <div className="duo-streak-week-row">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, idx) => {
                const todayIdx = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun
                const isPastDayInStreak = idx < todayIdx && (todayIdx - idx) < userProfile.streakDays;
                const isTodayLit = idx === todayIdx && completedToday >= 25;
                const isTodayPending = idx === todayIdx && completedToday < 25;
                const isLit = isPastDayInStreak || isTodayLit;
                return (
                  <div key={day} className={`duo-streak-day-item ${isLit ? 'lit' : isTodayPending ? 'pending' : ''}`}>
                    <span className="day-name">{day}</span>
                    <div className="day-circle">
                      {isLit ? (
                        <Sticker3D name="flame" size={20} />
                      ) : isTodayPending ? (
                        <div className="day-pending-flame" title="Chưa giữ lửa hôm nay">
                          <Sticker3D name="flame" size={17} />
                        </div>
                      ) : (
                        <div className="day-dot" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Today's Goal Progress */}
            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 16, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Tiến độ hôm nay</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: completedToday >= 25 ? '#16A34A' : '#2563EB' }}>
                  {completedToday} / 25 câu
                </span>
              </div>
              <div className="streak-prog-bar" style={{ height: 8, borderRadius: 4, background: '#E2E8F0' }}>
                <div
                  className="streak-prog-fill"
                  style={{
                    width: `${Math.min(100, Math.round((completedToday / 25) * 100))}%`,
                    background: completedToday >= 25 ? 'linear-gradient(90deg, #EA580C, #F59E0B)' : '#2563EB'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: 6 }}>
                {completedToday >= 25
                  ? '🎉 Bạn đã đạt trọn vẹn 25 câu hôm nay và giữ vững ngọn lửa Streak!'
                  : `Hoàn thành thêm ${25 - completedToday} câu để kích hoạt ngọn lửa Streak bùng cháy!`}
              </div>
            </div>

            {/* 5-Step Milestone Ladder */}
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Các mốc phần thưởng ngày:
            </div>

            {/* Step 0: Start */}
            <div className="streak-ladder-step done">
              <div className="streak-ladder-icon">
                <Sticker3D name="start" size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Bắt đầu ngày mới</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Mở app và làm quen bài học</div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A' }}>✓ Khởi đầu</span>
            </div>

            {/* Step 1: 5 Qs */}
            <div
              className={`streak-ladder-step ${completedToday >= 5 ? 'done' : completedToday >= 0 ? 'active' : ''}`}
              onClick={() => {
                soundService.playMilestone(1);
                setMilestoneToast({ level: 1, title: 'Khởi động 5/25 câu', subtitle: '+10 XP • Giữ vững đà học tập!', sticker: 'bronze-medal' });
                setTimeout(() => setMilestoneToast(null), 3500);
              }}
              style={{ cursor: 'pointer' }}
              title="Nhấn để thử hiệu ứng mốc 5 câu"
            >
              <div className="streak-ladder-icon">
                <Sticker3D name="bronze-medal" size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Mốc 5 câu: Tia lửa khởi động</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Thưởng +10 XP • Nhịp học tập ổn định (Chạm để thử)</div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: completedToday >= 5 ? '#16A34A' : '#2563EB' }}>
                {completedToday >= 5 ? '✓ Đạt' : `${Math.min(5, completedToday)}/5 ❯`}
              </span>
            </div>

            {/* Step 2: 10 Qs */}
            <div
              className={`streak-ladder-step ${completedToday >= 10 ? 'done' : completedToday >= 5 ? 'active' : ''}`}
              onClick={() => {
                soundService.playMilestone(2);
                setMilestoneToast({ level: 2, title: 'Tăng tốc 10/25 câu', subtitle: '+15 XP • Chuỗi phản xạ xuất sắc!', sticker: 'silver-lightning' });
                setTimeout(() => setMilestoneToast(null), 3500);
              }}
              style={{ cursor: 'pointer' }}
              title="Nhấn để thử hiệu ứng mốc 10 câu"
            >
              <div className="streak-ladder-icon">
                <Sticker3D name="silver-lightning" size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Mốc 10 câu: Tăng tốc phản xạ</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Thưởng +15 XP • Rèn luyện liên tục (Chạm để thử)</div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: completedToday >= 10 ? '#16A34A' : '#2563EB' }}>
                {completedToday >= 10 ? '✓ Đạt' : `${Math.min(10, completedToday)}/10 ❯`}
              </span>
            </div>

            {/* Step 3: 15 Qs */}
            <div
              className={`streak-ladder-step ${completedToday >= 15 ? 'done' : completedToday >= 10 ? 'active' : ''}`}
              onClick={() => {
                soundService.playMilestone(3);
                setMilestoneToast({ level: 3, title: 'Bứt phá 15/25 câu', subtitle: '+20 XP • Vượt hơn 60% chặng đường!', sticker: 'gold-star' });
                setTimeout(() => setMilestoneToast(null), 3500);
              }}
              style={{ cursor: 'pointer' }}
              title="Nhấn để thử hiệu ứng mốc 15 câu"
            >
              <div className="streak-ladder-icon">
                <Sticker3D name="gold-star" size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Mốc 15 câu: Đột phá hải trình</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Thưởng +20 XP • Vượt hơn 60% chặng đường (Chạm để thử)</div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: completedToday >= 15 ? '#16A34A' : '#2563EB' }}>
                {completedToday >= 15 ? '✓ Đạt' : `${Math.min(15, completedToday)}/15 ❯`}
              </span>
            </div>

            {/* Step 4: 20 Qs */}
            <div
              className={`streak-ladder-step ${completedToday >= 20 ? 'done' : completedToday >= 15 ? 'active' : ''}`}
              onClick={() => {
                soundService.playMilestone(4);
                setMilestoneToast({ level: 4, title: 'Đỉnh cao 20/25 câu', subtitle: '+25 XP • Còn 5 câu nữa là chạm đỉnh!', sticker: 'diamond' });
                setTimeout(() => setMilestoneToast(null), 3500);
              }}
              style={{ cursor: 'pointer' }}
              title="Nhấn để thử hiệu ứng mốc 20 câu"
            >
              <div className="streak-ladder-icon">
                <Sticker3D name="diamond" size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Mốc 20 câu: Lửa lam huyền thoại</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Thưởng +25 XP • Chuẩn bị chạm đỉnh! (Chạm để thử)</div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: completedToday >= 20 ? '#16A34A' : '#2563EB' }}>
                {completedToday >= 20 ? '✓ Đạt' : `${Math.min(20, completedToday)}/20 ❯`}
              </span>
            </div>

            {/* Step 5: 25 Qs */}
            <div
              className={`streak-ladder-step ${completedToday >= 25 ? 'done' : completedToday >= 20 ? 'active' : ''}`}
              onClick={() => {
                soundService.playCelebrationFanfare();
                setShowStreakCelebration(true);
              }}
              style={{ cursor: 'pointer' }}
              title="Nhấn để xem ngay hiệu ứng Đại thắng 25 câu"
            >
              <div className="streak-ladder-icon">
                <Sticker3D name="crown" size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Mốc 25 câu: Đại Thắng Chuỗi Streak</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                  <span>Thưởng</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 700, color: '#2563EB' }}>
                    <Sticker3D name="gem" size={14} /> +100 XP
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 700, color: '#D97706' }}>
                    <Sticker3D name="coin" size={14} /> +25 Xu
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 700, color: '#EA580C' }}>
                    <Sticker3D name="flame" size={14} /> +1 Streak
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EA580C' }}>
                {completedToday >= 25 ? '✓ ĐÃ ĐẠT 🔥' : 'Xem thử ❯'}
              </span>
            </div>

            {/* Always visible preview button for Grand Celebration with 3D party popper */}
            <button
              onClick={() => {
                soundService.playCelebrationFanfare();
                setShowStreakCelebration(true);
              }}
              onPointerDown={() => soundService.playClick()}
              className="streak-claim-btn"
              style={{ width: '100%', marginTop: 16, padding: '13px 18px', fontSize: '0.92rem', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Sticker3D name="party-popper" size={24} />
              <span>XEM THỬ HIỆU ỨNG BÙNG NỔ 25 CÂU</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. PET WARDROBE & SKIN SHOP MODAL */}
      {showPetWardrobe && (
        <PetWardrobeModal
          currentGems={userProfile.xp}
          activeSkinId={activePetSkinId}
          unlockedSkinIds={unlockedPetSkinIds}
          onClose={() => setShowPetWardrobe(false)}
          onEquipSkin={handleEquipPetSkin}
          onBuySkin={handleBuyPetSkin}
        />
      )}

      {/* ========================================================================= */}
      {/* DIO TALK CUSTOM MODAL ALERT (Replaces native browser alert)              */}
      {/* ========================================================================= */}
      {customAlert && (
        <div
          className="model-modal-overlay"
          onClick={() => setCustomAlert(null)}
          style={{ zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '24px 20px 20px 20px',
              maxWidth: 360,
              width: '100%',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.25)',
              border: '1.5px solid #E2E8F0',
              textAlign: 'center',
              animation: 'popIn 0.22s ease-out'
            }}
          >
            <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #BFDBFE' }}>
                <Sticker3D name={(customAlert.icon as any) || 'info'} size={32} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              {customAlert.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.55, whiteSpace: 'pre-line', marginBottom: 20, fontWeight: 500 }}>
              {customAlert.message}
            </p>
            <button
              onClick={() => setCustomAlert(null)}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              Đồng Ý
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIO TALK CUSTOM CONFIRM MODAL (Replaces unreadable WebView window.confirm) */}
      {/* ========================================================================= */}
      {customConfirm && (
        <div
          className="model-modal-overlay"
          onClick={() => setCustomConfirm(null)}
          style={{ zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '24px 20px 20px 20px',
              maxWidth: 360,
              width: '100%',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.25)',
              border: '1.5px solid #E2E8F0',
              textAlign: 'center',
              animation: 'popIn 0.22s ease-out'
            }}
          >
            <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: customConfirm.isDestructive ? '#FEE2E2' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: customConfirm.isDestructive ? '2px solid #FECACA' : '2px solid #BFDBFE' }}>
                <Clock size={29} strokeWidth={2.4} aria-hidden="true" />
              </div>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              {customConfirm.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.55, whiteSpace: 'pre-line', marginBottom: 20, fontWeight: 500 }}>
              {customConfirm.message}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setCustomConfirm(null)}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: '#F1F5F9',
                  color: '#475569',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer'
                }}
              >
                {customConfirm.cancelText || 'Tiếp tục'}
              </button>
              <button
                onClick={() => {
                  const action = customConfirm.onConfirm;
                  setCustomConfirm(null);
                  action();
                }}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: customConfirm.isDestructive ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: customConfirm.isDestructive ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
              >
                {customConfirm.confirmText || 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
