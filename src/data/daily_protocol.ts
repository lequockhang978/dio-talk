import { ALL_MARITIME_VOCABULARY, type MaritimeTermFull } from './vocabulary';
import { getLocalDateKey } from '../services/dateService';

export interface DailySessionQuestion {
  id: string;
  termId: string;
  targetWord: string;
  phonetic: string;
  meaningVi: string;
  sentenceBefore: string;
  sentenceAfter: string;
  vietnameseSentence: string;
  hint: string;
  questionType: 'cloze' | 'mcq' | 'definition' | 'context';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  isReview: boolean;
  isPreview?: boolean;
  isReinforcement?: boolean;
  tagLabel?: string;
  dayLearned: number;
}

export interface DailyStudySession {
  day: number;
  dateKey: string;
  newTermsCount: number;
  previewTermsCount: number;
  reviewTermsCount: number;
  totalQuestions: number; // 25 questions
  newTermIds: string[];
  previewTermIds: string[];
  reviewTermIds: string[];
  questions: DailySessionQuestion[];
}

export const LEITNER_INTERVALS: Record<number, number> = {
  1: 1,   // Box 1: 1 ngày (Học hôm nay, mai ôn ngay)
  2: 3,   // Box 2: 3 ngày
  3: 7,   // Box 3: 7 ngày (Bắt đầu ngấm vào trí nhớ dài hạn)
  4: 14,  // Box 4: 14 ngày (Đã thuộc vững)
  5: 30   // Box 5: 30 ngày (Mastered - rà soát phản xạ)
};

export interface TermMasteryRecord {
  termId: string;
  word: string;
  correctCount: number;
  wrongCount: number;
  masteryScore: number; // 0 - 100
  lastReviewed: string; // ISO string
  needsReview: boolean;

  // 5-Box Leitner Architecture
  box: 1 | 2 | 3 | 4 | 5;
  consecutiveCorrect: number;
  status: 'NEW' | 'LEARNING' | 'MASTERED';

  // Scientific Spaced Repetition (SM-2 + Ebbinghaus Curve)
  repetitions: number;      // Consecutive successful recall count
  intervalDays: number;     // Days until next review
  easeFactor: number;       // EF factor (default 2.5, min 1.3)
  nextReviewDate: string;   // ISO timestamp for scheduled recall
  lapseCount: number;       // Times forgotten after being learned
  retentionScore: number;   // Current estimated retention percentage (0 - 100%)
  lastQualityGrade?: number;// Quality grade (0 to 5)
}

export interface FluencyStatus {
  totalLearned: number;
  masteredCount: number;
  reviewingCount: number;
  dueTodayCount: number;     // Count of terms scheduled for review today
  fluencyRate: number;      // 0 - 100
  averageRetention: number; // Average memory retention %
  recommendation: 'consolidate' | 'learn_new';
  recommendationReason: string;
}

export interface AIEvaluationResult {
  isCorrect: boolean;
  score: number; // 0 - 100
  feedback: string;
  smartTip: string;
  mnemonic: string;
  smcpContext: string;
  qualityGrade?: number; // 0 (blackout) to 5 (perfect immediate recall)
}

const STORAGE_KEY_STUDY_HISTORY = 'dio_daily_study_protocol_history';
const STORAGE_KEY_MASTERY = 'dio_vocab_mastery_records';

/**
 * Calculate current retention rate based on Ebbinghaus forgetting curve:
 * R = e^(-elapsedDays / (intervalDays * 1.2))
 */
export function calculateRetentionScore(lastReviewedIso: string, intervalDays: number): number {
  if (!lastReviewedIso) return 100;
  const last = new Date(lastReviewedIso).getTime();
  const now = Date.now();
  const elapsedDays = Math.max(0, (now - last) / (1000 * 60 * 60 * 24));
  const effectiveStability = Math.max(1, intervalDays || 1);
  const retention = Math.exp(-elapsedDays / (effectiveStability * 1.5)) * 100;
  return Math.min(100, Math.max(10, Math.round(retention)));
}

/**
 * SM-2 Quality Grade:
 * 5: Perfect response, immediate recall (< 3s, 100% exact)
 * 4: Correct response after a hesitation or minor self-correction
 * 3: Correct response recalled with serious difficulty
 * 2: Incorrect response; where the correct one seemed easy to recall
 * 1: Incorrect response; the correct one remembered upon hint
 * 0: Complete blackout
 */
export type SRSQualityGrade = 0 | 1 | 2 | 3 | 4 | 5;

export function getMasteryRecords(): Record<string, TermMasteryRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MASTERY);
    if (raw) {
      const records: Record<string, TermMasteryRecord> = JSON.parse(raw);
      // Auto-compute dynamic retention score upon retrieval
      Object.values(records).forEach(r => {
        if (!r.intervalDays) r.intervalDays = 1;
        if (!r.easeFactor) r.easeFactor = 2.5;
        if (!r.repetitions) r.repetitions = r.correctCount > 0 ? 1 : 0;
        if (!r.lapseCount) r.lapseCount = r.wrongCount || 0;
        r.retentionScore = calculateRetentionScore(r.lastReviewed, r.intervalDays);
        if (r.nextReviewDate) {
          r.needsReview = new Date(r.nextReviewDate).getTime() <= Date.now() || r.masteryScore < 80;
        } else {
          r.needsReview = r.masteryScore < 80;
        }
      });
      return records;
    }
  } catch (e) {
    console.error(e);
  }
  return {};
}

/**
 * SuperMemo SM-2 Core Algorithm
 */
export function calculateSM2(
  prevReps: number,
  prevEF: number,
  prevInterval: number,
  grade: SRSQualityGrade
): { repetitions: number; easeFactor: number; intervalDays: number; nextReviewDate: string } {
  // EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  let newEF = prevEF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (newEF < 1.3) newEF = 1.3;
  if (newEF > 3.0) newEF = 3.0;

  let newReps = prevReps;
  let newInterval = prevInterval;

  if (grade >= 3) {
    // Correct recall
    if (newReps === 0) {
      newInterval = 1; // 1 day
    } else if (newReps === 1) {
      newInterval = 3; // 3 days
    } else if (newReps === 2) {
      newInterval = 6; // 6 days
    } else {
      newInterval = Math.round(prevInterval * newEF);
    }
    newReps += 1;
  } else {
    // Incorrect recall (lapse): reset repetitions back to 0, review tomorrow
    newReps = 0;
    newInterval = 1;
  }

  // Cap max interval at 180 days (half year)
  newInterval = Math.min(180, Math.max(1, newInterval));

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    repetitions: newReps,
    easeFactor: Math.round(newEF * 100) / 100,
    intervalDays: newInterval,
    nextReviewDate: nextDate.toISOString()
  };
}

export function saveMasteryRecord(
  termId: string,
  word: string,
  isCorrectOrGrade: boolean | SRSQualityGrade,
  explicitGrade?: SRSQualityGrade
): TermMasteryRecord {
  const records = getMasteryRecords();
  const current = records[termId] || {
    termId,
    word: word.toLowerCase(),
    correctCount: 0,
    wrongCount: 0,
    masteryScore: 0,
    lastReviewed: new Date().toISOString(),
    needsReview: true,
    repetitions: 0,
    intervalDays: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
    lapseCount: 0,
    retentionScore: 100,
    lastQualityGrade: 4
  };

  // Determine grade (0 - 5)
  let grade: SRSQualityGrade;
  if (explicitGrade !== undefined) {
    grade = explicitGrade;
  } else if (typeof isCorrectOrGrade === 'number') {
    grade = Math.max(0, Math.min(5, isCorrectOrGrade)) as SRSQualityGrade;
  } else {
    grade = isCorrectOrGrade ? 4 : 1;
  }

  if ((current as any).box === undefined) current.box = 1;
  if ((current as any).consecutiveCorrect === undefined) current.consecutiveCorrect = 0;
  if (!current.status) current.status = 'NEW';

  const sm2Result = calculateSM2(
    current.repetitions || 0,
    current.easeFactor || 2.5,
    current.intervalDays || 1,
    grade
  );

  current.repetitions = sm2Result.repetitions;
  current.easeFactor = sm2Result.easeFactor;
  current.lastQualityGrade = grade;

  if (grade >= 3) {
    // A. Nếu trả lời ĐÚNG (Pass): consecutive_correct += 1, thăng cấp box, next_review_date = Today + interval(box)
    current.correctCount += 1;
    current.consecutiveCorrect = (current.consecutiveCorrect || 0) + 1;
    current.box = Math.min(5, (current.box || 1) + 1) as 1 | 2 | 3 | 4 | 5;
    current.status = current.box >= 4 ? 'MASTERED' : 'LEARNING';
    current.intervalDays = LEITNER_INTERVALS[current.box] || sm2Result.intervalDays;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + current.intervalDays);
    current.nextReviewDate = nextDate.toISOString();

    const boost = grade === 5 ? 25 : grade === 4 ? 20 : 15;
    current.masteryScore = Math.min(100, current.masteryScore + boost);
  } else {
    // B. Nếu trả lời SAI (Fail) - Luật trừng phạt: box = 1, consecutive_correct = 0, next_review_date = Tomorrow
    current.wrongCount += 1;
    current.consecutiveCorrect = 0;
    current.box = 1;
    current.status = 'LEARNING';
    current.intervalDays = 1;
    current.lapseCount = (current.lapseCount || 0) + 1;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    current.nextReviewDate = nextDate.toISOString();

    current.masteryScore = Math.max(10, current.masteryScore - 25);
  }

  current.lastReviewed = new Date().toISOString();
  current.retentionScore = 100;
  current.needsReview = current.box < 4 || new Date(current.nextReviewDate).getTime() <= Date.now();
  records[termId] = current;

  try {
    localStorage.setItem(STORAGE_KEY_MASTERY, JSON.stringify(records));
  } catch (e) {
    console.error(e);
  }

  return current;
}

export function getFluencyStatus(): FluencyStatus {
  const records = getMasteryRecords();
  const history = getStudyHistory();
  const totalLearned = history.learnedTermIds.length;
  const now = Date.now();

  if (totalLearned === 0) {
    return {
      totalLearned: 0,
      masteredCount: 0,
      reviewingCount: 0,
      dueTodayCount: 0,
      fluencyRate: 100,
      averageRetention: 100,
      recommendation: 'learn_new',
      recommendationReason: 'Bạn chưa học từ nào. Hãy nạp 5 từ đầu tiên hôm nay!'
    };
  }

  let masteredCount = 0;
  let reviewingCount = 0;
  let dueTodayCount = 0;
  let totalRetentionSum = 0;

  history.learnedTermIds.forEach(id => {
    const rec = records[id];
    if (rec) {
      totalRetentionSum += rec.retentionScore || 80;
      const isDue = rec.nextReviewDate ? new Date(rec.nextReviewDate).getTime() <= now : rec.masteryScore < 80;
      if (isDue) {
        dueTodayCount++;
      }
      if (rec.masteryScore >= 80 && !isDue) {
        masteredCount++;
      } else {
        reviewingCount++;
      }
    } else {
      reviewingCount++;
      dueTodayCount++;
      totalRetentionSum += 50;
    }
  });

  const fluencyRate = Math.round((masteredCount / totalLearned) * 100);
  const averageRetention = Math.round(totalRetentionSum / totalLearned);

  // If user has due terms or low fluency, recommend consolidation
  const recommendation = (dueTodayCount >= 4 || (fluencyRate < 80 && reviewingCount >= 3)) ? 'consolidate' : 'learn_new';
  const recommendationReason = recommendation === 'consolidate'
    ? `Có ${dueTodayCount} từ đến hạn ôn theo đường cong quên Ebbinghaus (Tỷ lệ nhớ: ${averageRetention}%). Hãy ôn luyện để khắc sâu vĩnh viễn!`
    : `Độ bền trí nhớ đạt ${averageRetention}% (Nhuần nhuyễn: ${fluencyRate}%). Sẵn sàng bứt phá nạp thêm bài học mới!`;

  return {
    totalLearned,
    masteredCount,
    reviewingCount,
    dueTodayCount,
    fluencyRate,
    averageRetention,
    recommendation,
    recommendationReason
  };
}

/**
 * Levenshtein distance calculation for typo tolerance
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * AI Maritime Mnemonic & Evaluation Engine
 */
export function evaluateWithAI(
  userInput: string,
  targetWord: string,
  meta?: { meaningVi?: string; exampleEn?: string; phonetic?: string }
): AIEvaluationResult {
  const cleanInput = userInput.trim().toLowerCase();
  const cleanTarget = targetWord.trim().toLowerCase();

  // Mnemonic generator
  const getMaritimeMnemonic = (word: string): string => {
    const w = word.toLowerCase();
    if (w.includes('bilge')) return '💡 AI Mnemonic: "Bilge" đọc tựa "Bơm rỉ", liên tưởng ngay đến đáy hầm máy nơi nước đọng và dầu rỉ cần bơm hút cạn.';
    if (w.includes('scavenge')) return '💡 AI Mnemonic: "Scavenge" nghĩa là quét sạch, trong động cơ diesel 2 kỳ là luồng gió quét sạch khí xả tống ra ngoài.';
    if (w.includes('manifold')) return '💡 AI Mnemonic: "Manifold" = Many + Fold (Nhiều nhánh gập lại), tức là ống góp chia ra nhiều van hút/xả.';
    if (w.includes('crank')) return '💡 AI Mnemonic: "Crankcase" = Trục khuỷu trong hộp kín, tâm điểm bôi trơn vung dầu chính của máy cái.';
    if (w.includes('purifier')) return '💡 AI Mnemonic: "Purifier" = Pure (Làm sạch thuần khiết), máy ly tâm tách nước và cặn bẩn khỏi dầu FO/LO.';
    if (w.includes('rudder')) return '💡 AI Mnemonic: "Rudder" (Bánh lái) - Cánh lái phía sau chong chóng điều hướng con tàu theo lệnh hoa tiêu.';
    if (w.includes('thruster')) return '💡 AI Mnemonic: "Bow Thruster" = Cú hích mũi tàu, chân vịt ngang ép tàu cập cầu không cần tàu lai.';
    if (w.includes('ballast')) return '💡 AI Mnemonic: "Ballast" = Nước dằn tàu, bơm vào hạ thấp trọng tâm giữ tàu cân bằng khi chạy không tải.';
    if (w.includes('anchor')) return '💡 AI Mnemonic: "Anchor" = Mỏ neo cắm đáy bùn, giữ tàu neo an toàn chờ hoa tiêu hoặc tránh bão.';
    if (w.includes('nozzle')) return '💡 AI Mnemonic: "Nozzle" (Vòi phun cao áp) - Phun sương dầu diesel vào buồng đốt áp suất cao.';
    return `💡 AI Mnemonic: Tách nhịp từ "${word}" [${meta?.phonetic || ''}] liên kết trực tiếp với thiết bị: "${meta?.meaningVi || 'Thuật ngữ hàng hải'}". Ghi nhớ hình ảnh thao tác thực tế buồng tàu.`;
  };

  const mnemonic = getMaritimeMnemonic(cleanTarget);
  const smcpContext = `Chuẩn IMO SMCP / STCW: Sĩ quan trực ca cần phát âm chuẩn và phản xạ tức thì thuật ngữ "${cleanTarget}" trong bảng phân công nhật ký hàng hải.`;

  if (cleanInput === cleanTarget) {
    return {
      isCorrect: true,
      score: 100,
      feedback: `🎯 Xuất sắc! Bạn đã ghi nhớ chính xác 100% thuật ngữ "${targetWord}".`,
      smartTip: 'Trí nhớ chủ động (Active Recall) đã được kích hoạt thành công.',
      mnemonic,
      smcpContext,
      qualityGrade: 5
    };
  }

  // Check typo distance
  const distance = levenshteinDistance(cleanInput, cleanTarget);
  if (distance <= 2 && cleanTarget.length >= 4) {
    return {
      isCorrect: false,
      score: 75,
      feedback: `⚡ Suýt đúng rồi! Bạn gõ "${userInput}" gần sát từ chuẩn "${targetWord}" (sai ${distance} ký tự).`,
      smartTip: `Hãy quan sát kỹ chính tả: "${targetWord}". Hãy gõ lại chính xác để tạo rãnh nhớ trong não bộ!`,
      mnemonic,
      smcpContext,
      qualityGrade: 2
    };
  }

  return {
    isCorrect: false,
    score: 30,
    feedback: `❌ Chưa chính xác. Bạn đã gõ "${userInput || 'trống'}", từ đúng là "${targetWord}".`,
    smartTip: `Định nghĩa: ${meta?.meaningVi || ''}. Hãy đọc to từ này 2 lần và gõ lại để lưu vào bộ nhớ dài hạn!`,
    mnemonic,
    smcpContext,
    qualityGrade: 1
  };
}

export function getStudyHistory(): { learnedTermIds: string[]; daysHistory: Record<string, string[]> } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDY_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return { learnedTermIds: [], daysHistory: {} };
}

export function saveStudyHistory(learnedTermIds: string[], dayKey: string, dayTerms: string[]) {
  try {
    const current = getStudyHistory();
    const uniqueLearned = Array.from(new Set([...current.learnedTermIds, ...learnedTermIds]));
    current.daysHistory[dayKey] = Array.from(new Set([
      ...(current.daysHistory[dayKey] || []),
      ...dayTerms
    ]));
    localStorage.setItem(STORAGE_KEY_STUDY_HISTORY, JSON.stringify({
      learnedTermIds: uniqueLearned,
      daysHistory: current.daysHistory
    }));
  } catch (e) {
    console.error(e);
  }
}

/**
 * 25-Question Daily Interleaved Protocol:
 * - New intake: 4-5 new terms.
 * - Prior review: terms from previous days (Spaced Repetition).
 * - Total pool: 7-9 terms total active for today.
 * - Total questions generated: EXACTLY 25 varied questions.
 *   - Type 1: Cloze fill-in-the-blank (Context sentence on ship)
 *   - Type 2: Multiple choice English -> Vietnamese
 *   - Type 3: Multiple choice Vietnamese -> English
 *   - Type 4: Emergency / SMCP contextual application
 */
/**
 * Helper to build a varied, pedagogically structured question for a maritime term.
 */
export function createSessionQuestion(
  v: MaritimeTermFull,
  qIdx: number,
  category: 'new' | 'preview' | 'review' | 'reinforcement',
  allPool: MaritimeTermFull[],
  currentDayNumber: number,
  forcedType?: 'cloze' | 'mcq' | 'definition' | 'context'
): DailySessionQuestion {
  const safeRegex = new RegExp(`(${v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
  const parts = v.exampleEn.split(safeRegex);
  const before = parts[0] || 'Observe and report the';
  const after = parts.slice(2).join('') || 'in accordance with STCW maritime regulations.';

  // Plausible distractors from same maritime pool
  const otherOptions = allPool
    .filter(o => o.word.toLowerCase() !== v.word.toLowerCase())
    .map(o => o.word.toLowerCase())
    .filter((word, idx, self) => self.indexOf(word) === idx)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const options = [v.word.toLowerCase(), ...otherOptions].sort(() => 0.5 - Math.random());

  const qTypes: Array<'cloze' | 'mcq' | 'definition' | 'context'> = ['cloze', 'mcq', 'definition', 'context'];
  const chosenType = forcedType || qTypes[qIdx % qTypes.length];

  let prompt = 'Điền từ vựng chuẩn trong ngữ cảnh kỹ thuật:';
  if (chosenType === 'definition') {
    prompt = 'Chọn thuật ngữ tiếng Anh tương ứng với định nghĩa:';
  } else if (chosenType === 'context') {
    prompt = 'Khẩu lệnh & thuật ngữ hàng hải chuẩn IMO / STCW:';
  } else if (chosenType === 'mcq') {
    prompt = 'Chọn thuật ngữ chính xác trong tình huống thao tác:';
  } else {
    prompt = 'Điền từ khóa vào chỗ trống trong câu thực hành:';
  }

  let tagLabel = '⭐ TỪ BÀI HIỆN TẠI (GHI NHỚ)';
  if (category === 'preview') {
    tagLabel = '🔭 TỪ BÀI TIẾP THEO (KHÁM PHÁ TRƯỚC)';
  } else if (category === 'review') {
    tagLabel = '🔄 TỪ ĐÃ HỌC (ÔN TẬP SM-2)';
  } else if (category === 'reinforcement') {
    tagLabel = '⚡ CỦNG CỐ TỪ VỪA LÀM SAI';
  }

  return {
    id: `daily-q-${currentDayNumber}-${qIdx + 1}-${Math.floor(Math.random() * 10000)}`,
    termId: v.id,
    targetWord: v.word.toLowerCase(),
    phonetic: v.phonetic,
    meaningVi: v.meaningVi,
    sentenceBefore: before,
    sentenceAfter: after,
    vietnameseSentence: v.exampleVi,
    hint: v.collocations?.slice(0, 2).join(', ') || v.vietnameseContext || v.meaningVi,
    questionType: chosenType,
    prompt: prompt,
    options: options,
    correctAnswer: v.word.toLowerCase(),
    explanation: `${v.word} (${v.phonetic}): ${v.meaningVi}. Ví dụ: "${v.exampleEn}" - ${v.exampleVi}`,
    isReview: category === 'review',
    isPreview: category === 'preview',
    isReinforcement: category === 'reinforcement',
    tagLabel: tagLabel,
    dayLearned: currentDayNumber
  };
}

export function getLeitnerBox(record?: TermMasteryRecord): 1 | 2 | 3 | 4 | 5 {
  if (!record) return 1;
  if (record.box >= 1 && record.box <= 5) return record.box;

  // ponytail: compatibility for SM-2 records saved before the 5-box schema.
  if (record.intervalDays <= 1) return 1;
  if (record.intervalDays <= 3) return 2;
  if (record.intervalDays <= 7) return 3;
  if (record.intervalDays <= 14) return 4;
  return 5;
}

/**
 * 25-Question Daily Interleaved Protocol with 4-Bucket Leitner Architecture:
 * When repository expands (15 to 50+ terms), quota is strictly partitioned into 3 groups:
 * 1. Nhóm 1 (Từ mới hôm nay & xem trước): 5 từ -> 12 câu (~2.4 lần/từ). Ghi nhớ ban đầu.
 * 2. Nhóm 2 (Từ hôm qua & từ hay sai - Hộp 1 & 2): 3–5 từ -> 8 câu (~2 lần/từ). Chống quên ngắn hạn.
 * 3. Nhóm 3 (Rà soát ngẫu nhiên kho cũ - Hộp 3 & 4): 5 từ -> 5 câu (mỗi từ đúng 1 câu). Kiểm tra dài hạn.
 * Total: ~13–15 active terms, EXACTLY 25 questions.
 */
export function generateDaily25Session(
  department: 'engine' | 'deck',
  targetNewCount = 5,
  mode: 'auto' | 'fluency_drill' | 'new_words' = 'auto',
  currentLessonTerms?: any[],
  _upcomingLessonTerms?: any[],
  pastLearnedTerms?: any[]
): DailyStudySession {
  const history = getStudyHistory();
  const mastery = getMasteryRecords();
  const fluency = getFluencyStatus();
  const todayKey = getLocalDateKey();
  const currentDayNumber = Object.keys(history.daysHistory).length + 1;
  const now = Date.now();

  // Full departmental pool
  const deptVocab = ALL_MARITIME_VOCABULARY.filter(
    v => v.department === department || v.department === 'safety' || v.department === 'crew'
  );

  const isConsolidating = mode === 'fluency_drill' || (mode === 'auto' && fluency.recommendation === 'consolidate');

  // 1. Nhóm 1: Từ mới hôm nay (Current Lesson)
  let actualNewVocab: MaritimeTermFull[] = [];
  if (currentLessonTerms && currentLessonTerms.length > 0) {
    actualNewVocab = currentLessonTerms.slice(0, targetNewCount).map((t: any, idx: number) => ({
      id: t.id || `term-current-${idx}`,
      word: t.word,
      phonetic: t.phonetic || '',
      partOfSpeech: 'phrase' as const,
      systemCategory: 'Daily Lesson',
      cefrLevel: 'B1' as const,
      stcwCode: 'STCW A-II/1',
      meaningVi: t.meaningVi || t.meaning || '',
      vietnameseContext: t.vietnameseContext || t.vietnameseSentence || '',
      exampleEn: t.example || `${t.sentenceBefore || ''} ${t.word} ${t.sentenceAfter || ''}`.trim(),
      exampleVi: t.vietnameseSentence || '',
      department: department,
      collocations: [t.word]
    }));
  } else if (!isConsolidating) {
    const unlearnedVocab = deptVocab.filter(v => !history.learnedTermIds.includes(v.id));
    actualNewVocab = (unlearnedVocab.length > 0 ? unlearnedVocab : deptVocab).slice(0, targetNewCount);
  }

  const newTermIds = actualNewVocab.map(v => v.id);
  const newWordSet = new Set<string>(actualNewVocab.map(v => v.word.toLowerCase()));

  // Fixed Quota chỉ có 5 từ mới hôm nay; từ xem trước không được chen vào 25 câu.
  const actualPreviewVocab: MaritimeTermFull[] = [];

  const previewTermIds = actualPreviewVocab.map(v => v.id);
  const previewWordSet = new Set<string>(actualPreviewVocab.map(v => v.word.toLowerCase()));

  // 3. Phân loại Kho từ cũ vào các Hộp Leitner (Buckets)
  // Thu thập toàn bộ từ đã học từ các bài trước, mastery records và lịch sử
  const learnedKeys = new Set<string>();
  history.learnedTermIds.forEach(id => learnedKeys.add(id.toLowerCase()));
  Object.values(mastery).forEach(rec => {
    if (rec.word) learnedKeys.add(rec.word.toLowerCase());
    if (rec.termId) learnedKeys.add(rec.termId.toLowerCase());
  });

  const explicitPast: MaritimeTermFull[] = (pastLearnedTerms || []).map((t: any, idx: number) => ({
    id: t.id || `term-past-${idx}`,
    word: t.word,
    phonetic: t.phonetic || '',
    partOfSpeech: 'phrase' as const,
    systemCategory: 'Learned Review',
    cefrLevel: 'B1' as const,
    stcwCode: 'STCW A-II/1',
    meaningVi: t.meaningVi || t.meaning || '',
    vietnameseContext: t.vietnameseContext || t.vietnameseSentence || '',
    exampleEn: t.example || `${t.sentenceBefore || ''} ${t.word} ${t.sentenceAfter || ''}`.trim(),
    exampleVi: t.vietnameseSentence || '',
    department: department,
    collocations: [t.word]
  }));

  const deptLearned = deptVocab.filter(v =>
    learnedKeys.has(v.id.toLowerCase()) || learnedKeys.has(v.word.toLowerCase())
  );

  const combinedLearnedMap = new Map<string, MaritimeTermFull>();
  [...explicitPast, ...deptLearned].forEach(v => {
    const key = v.word.toLowerCase();
    if (!newWordSet.has(key) && !previewWordSet.has(key)) {
      if (!combinedLearnedMap.has(key)) {
        combinedLearnedMap.set(key, v);
      }
    }
  });

  const learnedVocabPool = Array.from(combinedLearnedMap.values());

  // Nhóm 2: chỉ từ ĐẾN HẠN, Box < 5; tối đa 4 từ.
  const shortTermCandidates = learnedVocabPool.filter(v => {
    const rec = mastery[v.id];
    const box = getLeitnerBox(rec);
    const dueTime = rec?.nextReviewDate ? new Date(rec.nextReviewDate).getTime() : 0;
    return box < 5 && dueTime <= now;
  });

  const sortedShortTerm = [...shortTermCandidates].sort((a, b) => {
    const recA = mastery[a.id];
    const recB = mastery[b.id];
    const dueA = recA?.nextReviewDate ? new Date(recA.nextReviewDate).getTime() : false;
    const dueB = recB?.nextReviewDate ? new Date(recB.nextReviewDate).getTime() : false;
    if (dueA && !dueB) return -1;
    if (!dueA && dueB) return 1;
    const lapsesA = recA?.lapseCount || 0;
    const lapsesB = recB?.lapseCount || 0;
    if (lapsesA !== lapsesB) return lapsesB - lapsesA;
    return (recA?.retentionScore || 50) - (recB?.retentionScore || 50);
  });

  const selectedShortTermVocab = sortedShortTerm.slice(0, 4);
  const shortTermIds = selectedShortTermVocab.map(v => v.id);

  // Nhóm 3: đúng 1 câu/từ, chỉ Box 4–5, chọn ngẫu nhiên.
  const selectedLongTermVocab = learnedVocabPool
    .filter(v => !shortTermIds.includes(v.id) && getLeitnerBox(mastery[v.id]) >= 4)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
  const longTermIds = selectedLongTermVocab.map(v => v.id);

  // Fallback if brand new user
  if (actualNewVocab.length === 0 && selectedShortTermVocab.length === 0 && selectedLongTermVocab.length === 0) {
    actualNewVocab = deptVocab.slice(0, targetNewCount);
  }

  const allActivePool = [
    ...actualNewVocab,
    ...actualPreviewVocab,
    ...selectedShortTermVocab,
    ...selectedLongTermVocab,
    ...deptVocab
  ];
  const TOTAL_QUESTIONS = 25;

  // 4. Phân bổ hạn ngạch câu hỏi (12 / 8 / 5 Quota Distribution)
  let qGroup1Target = 12; // Nhóm 1: Từ mới hôm nay & xem trước
  let qGroup2Target = 8;  // Nhóm 2: Từ hôm qua & từ hay sai (Hộp 1 & 2)
  let qGroup3Target = 5;  // Nhóm 3: Rà soát ngẫu nhiên kho cũ (Hộp 3 & 4, 1 câu/từ)

  // Điều tiết khi kho từ cũ còn ít (Người mới bắt đầu).
  if (selectedLongTermVocab.length < 5) {
    const deficit = 5 - selectedLongTermVocab.length;
    qGroup3Target = selectedLongTermVocab.length;
    qGroup1Target += deficit;
  }
  // Nhóm 2 tối đa 2 lượt/từ; phần thiếu chuyển về nhóm 1.
  const maxShortTermQuestions = selectedShortTermVocab.length * 2;
  if (qGroup2Target > maxShortTermQuestions) {
    qGroup1Target += qGroup2Target - maxShortTermQuestions;
    qGroup2Target = maxShortTermQuestions;
  }

  // 5. Sinh câu hỏi cho từng nhóm
  // --- Nhóm 1: Từ mới hôm nay (qGroup1Target câu)
  const group1Questions: DailySessionQuestion[] = [];
  const g1Pool = [...actualNewVocab, ...actualPreviewVocab];
  if (g1Pool.length > 0) {
    for (let i = 0; i < qGroup1Target; i++) {
      const v = g1Pool[i % g1Pool.length];
      const isPrev = previewTermIds.includes(v.id);
      const q = createSessionQuestion(
        v,
        i,
        isPrev ? 'preview' : 'new',
        allActivePool,
        currentDayNumber
      );
      if (!isPrev) {
        q.tagLabel = '⭐ TỪ MỚI HÔM NAY (12 CÂU GHI NHỚ)';
      }
      group1Questions.push(q);
    }
  }

  // --- Nhóm 2: Từ hôm qua & từ hay sai (qGroup2Target câu, ~2 lần/từ)
  const group2Questions: DailySessionQuestion[] = [];
  if (selectedShortTermVocab.length > 0 && qGroup2Target > 0) {
    for (let i = 0; i < qGroup2Target; i++) {
      const v = selectedShortTermVocab[i % selectedShortTermVocab.length];
      const q = createSessionQuestion(v, i, 'review', allActivePool, currentDayNumber);
      q.tagLabel = '🔄 CHỐNG QUÊN NGẮN HẠN (HỘP 1 & 2)';
      group2Questions.push(q);
    }
  }

  // --- Nhóm 3: Rà soát ngẫu nhiên kho cũ (qGroup3Target câu, đúng 1 câu/từ)
  const group3Questions: DailySessionQuestion[] = [];
  if (selectedLongTermVocab.length > 0 && qGroup3Target > 0) {
    for (let i = 0; i < qGroup3Target && i < selectedLongTermVocab.length; i++) {
      const v = selectedLongTermVocab[i];
      const q = createSessionQuestion(v, i, 'review', allActivePool, currentDayNumber, 'mcq');
      q.tagLabel = '🧭 RÀ SOÁT KHO CŨ (HỘP 3 & 4 DÀI HẠN)';
      group3Questions.push(q);
    }
  }

  // 6. Xen kẽ thông minh (Interleaving)
  const interleaved: DailySessionQuestion[] = [];
  let g1Idx = 0;
  let g2Idx = 0;
  let g3Idx = 0;

  // Pattern: G1 (mới) -> G2 (ngắn hạn) -> G1 (mới) -> G3 (dài hạn) -> G1 -> G2...
  while (interleaved.length < TOTAL_QUESTIONS) {
    if (g1Idx < group1Questions.length && interleaved.length < TOTAL_QUESTIONS) {
      interleaved.push(group1Questions[g1Idx++]);
    }
    if (g2Idx < group2Questions.length && interleaved.length < TOTAL_QUESTIONS) {
      interleaved.push(group2Questions[g2Idx++]);
    }
    if (g1Idx < group1Questions.length && interleaved.length < TOTAL_QUESTIONS) {
      interleaved.push(group1Questions[g1Idx++]);
    }
    if (g3Idx < group3Questions.length && interleaved.length < TOTAL_QUESTIONS) {
      interleaved.push(group3Questions[g3Idx++]);
    }
    if (g1Idx >= group1Questions.length && g2Idx >= group2Questions.length && g3Idx >= group3Questions.length) {
      break;
    }
  }

  // Đảm bảo đủ 25 câu
  while (interleaved.length < TOTAL_QUESTIONS) {
    const fallback = actualNewVocab[interleaved.length % actualNewVocab.length] || deptVocab[0];
    interleaved.push(createSessionQuestion(fallback, interleaved.length, 'new', allActivePool, currentDayNumber));
  }

  // 7. Khử trùng lặp với khoảng cách an toàn (gap >= 2 theo đặc tả)
  for (let i = 1; i < interleaved.length; i++) {
    const hasCollision =
      interleaved[i].targetWord === interleaved[i - 1]?.targetWord ||
      (i >= 2 && interleaved[i].targetWord === interleaved[i - 2]?.targetWord);

    if (hasCollision) {
      const swapIdx = interleaved.findIndex(
        (q, idx) =>
          idx > i &&
          q.targetWord !== interleaved[i - 1]?.targetWord &&
          q.targetWord !== interleaved[i - 2]?.targetWord
      );
      if (swapIdx !== -1) {
        const temp = interleaved[i];
        interleaved[i] = interleaved[swapIdx];
        interleaved[swapIdx] = temp;
      }
    }
  }

  return {
    day: currentDayNumber,
    dateKey: todayKey,
    newTermsCount: actualNewVocab.length,
    previewTermsCount: actualPreviewVocab.length,
    reviewTermsCount: selectedShortTermVocab.length + selectedLongTermVocab.length,
    totalQuestions: TOTAL_QUESTIONS,
    newTermIds: newTermIds,
    previewTermIds: previewTermIds,
    reviewTermIds: [...shortTermIds, ...longTermIds],
    questions: interleaved
  };
}
