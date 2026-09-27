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
  dayLearned: number;
}

export interface DailyStudySession {
  day: number;
  dateKey: string;
  newTermsCount: number;
  reviewTermsCount: number;
  totalQuestions: number; // 25 questions
  newTermIds: string[];
  reviewTermIds: string[];
  questions: DailySessionQuestion[];
}

export interface TermMasteryRecord {
  termId: string;
  word: string;
  correctCount: number;
  wrongCount: number;
  masteryScore: number; // 0 - 100
  lastReviewed: string; // ISO string
  needsReview: boolean;

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

  const sm2Result = calculateSM2(
    current.repetitions || 0,
    current.easeFactor || 2.5,
    current.intervalDays || 1,
    grade
  );

  current.repetitions = sm2Result.repetitions;
  current.easeFactor = sm2Result.easeFactor;
  current.intervalDays = sm2Result.intervalDays;
  current.nextReviewDate = sm2Result.nextReviewDate;
  current.lastQualityGrade = grade;

  if (grade >= 3) {
    current.correctCount += 1;
    // Scale mastery score smoothly towards 100
    const boost = grade === 5 ? 25 : grade === 4 ? 20 : 15;
    current.masteryScore = Math.min(100, current.masteryScore + boost);
  } else {
    current.wrongCount += 1;
    current.lapseCount = (current.lapseCount || 0) + 1;
    // Drop score to require review
    current.masteryScore = Math.max(10, current.masteryScore - 25);
  }

  current.lastReviewed = new Date().toISOString();
  current.retentionScore = 100; // Freshly reviewed now
  current.needsReview = current.masteryScore < 80 || new Date(current.nextReviewDate).getTime() <= Date.now();
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
    current.daysHistory[dayKey] = dayTerms;
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
export function generateDaily25Session(
  department: 'engine' | 'deck',
  targetNewCount = 5,
  mode: 'auto' | 'fluency_drill' | 'new_words' = 'auto',
  currentLessonTerms?: any[]
): DailyStudySession {
  const history = getStudyHistory();
  const mastery = getMasteryRecords();
  const fluency = getFluencyStatus();
  const todayKey = getLocalDateKey();
  const currentDayNumber = Object.keys(history.daysHistory).length + 1;
  const now = Date.now();

  // Filter pool matching department
  const deptVocab = ALL_MARITIME_VOCABULARY.filter(v => v.department === department || v.department === 'safety' || v.department === 'crew');

  const isConsolidating = mode === 'fluency_drill' || (mode === 'auto' && fluency.recommendation === 'consolidate');

  let actualNewVocab: MaritimeTermFull[] = [];
  let newTermIds: string[] = [];

  if (currentLessonTerms && currentLessonTerms.length > 0) {
    actualNewVocab = currentLessonTerms.map((t: any, idx: number) => ({
      id: t.id || `term-${idx}`,
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
    newTermIds = actualNewVocab.map(v => v.id);
  } else if (!isConsolidating) {
    // Identify new terms not yet learned
    const unlearnedVocab = deptVocab.filter(v => !history.learnedTermIds.includes(v.id));
    const newVocabPool = unlearnedVocab.slice(0, targetNewCount);
    actualNewVocab = newVocabPool.length > 0 ? newVocabPool : deptVocab.slice(0, targetNewCount);
    newTermIds = actualNewVocab.map(v => v.id);
  }

  // Identify review terms from previous days, prioritizing Ebbinghaus due dates & lowest retention rate
  const learnedVocabPool = deptVocab.filter(v => history.learnedTermIds.includes(v.id) && !newTermIds.includes(v.id));
  const sortedReviewPool = [...learnedVocabPool].sort((a, b) => {
    const recA = mastery[a.id];
    const recB = mastery[b.id];

    // Priority 1: Due date passed
    const dueTimeA = recA?.nextReviewDate ? new Date(recA.nextReviewDate).getTime() : 0;
    const dueTimeB = recB?.nextReviewDate ? new Date(recB.nextReviewDate).getTime() : 0;
    const isDueA = dueTimeA <= now;
    const isDueB = dueTimeB <= now;

    if (isDueA && !isDueB) return -1;
    if (!isDueA && isDueB) return 1;

    // Priority 2: Lowest retention score (Ebbinghaus decay)
    const retA = recA?.retentionScore ?? 50;
    const retB = recB?.retentionScore ?? 50;
    if (retA !== retB) return retA - retB;

    // Priority 3: Lowest mastery score
    const scoreA = recA?.masteryScore ?? 50;
    const scoreB = recB?.masteryScore ?? 50;
    return scoreA - scoreB;
  });

  // If consolidating, take up to 8 terms needing reinforcement
  const reviewLimit = isConsolidating ? 8 : 5;
  const selectedReviewVocab = sortedReviewPool.slice(0, reviewLimit);
  const reviewTermIds = selectedReviewVocab.map(v => v.id);

  // If both empty (brand new user in consolidate mode), fallback to new vocab
  if (actualNewVocab.length === 0 && selectedReviewVocab.length === 0) {
    actualNewVocab = deptVocab.slice(0, targetNewCount);
    newTermIds = actualNewVocab.map(v => v.id);
  }

  // Active terms for today's 25 questions
  const activeVocabList: MaritimeTermFull[] = [...actualNewVocab, ...selectedReviewVocab];

  const questions: DailySessionQuestion[] = [];
  const TOTAL_QUESTIONS = 25;

  // Question templates for variety
  const VARIANT_PROMPTS = [
    () => `Điền từ vựng chuẩn trong ngữ cảnh kỹ thuật:`,
    () => `Chọn thuật ngữ tiếng Anh tương ứng:`,
    () => `Khẩu lệnh và thuật ngữ hàng hải chuẩn IMO:`,
    () => `Tìm thuật ngữ chính xác trong tình huống thao tác:`,
    () => `Thuật ngữ chuyên ngành đối chiếu:`
  ];

  for (let qIdx = 0; qIdx < TOTAL_QUESTIONS; qIdx++) {
    // Interleave new terms and review terms across the 25 questions
    // e.g. 60% new terms, 40% review terms (or proportional)
    const isReview = reviewTermIds.length > 0 && (qIdx % 2 === 1 || qIdx > 15);
    const candidatePool = (isReview && selectedReviewVocab.length > 0) ? selectedReviewVocab : actualNewVocab;
    const v = candidatePool[qIdx % candidatePool.length] || activeVocabList[qIdx % activeVocabList.length];

    const parts = v.exampleEn.split(new RegExp(`(${v.word})`, 'i'));
    const before = parts[0] || 'Observe and report the';
    const after = parts.slice(2).join('') || 'in accordance with STCW maritime regulations.';

    // Generate 3 plausible distractors from activeVocabList and deptVocab
    const distractorPool = [...activeVocabList, ...deptVocab];
    const otherOptions = distractorPool
      .filter(o => o.word.toLowerCase() !== v.word.toLowerCase())
      .map(o => o.word.toLowerCase())
      .filter((word, idx, self) => self.indexOf(word) === idx)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [v.word.toLowerCase(), ...otherOptions].sort(() => 0.5 - Math.random());

    const qTypeIndex = qIdx % 4;
    const qTypes: Array<'cloze' | 'mcq' | 'definition' | 'context'> = ['cloze', 'mcq', 'definition', 'context'];
    const chosenType = qTypes[qTypeIndex];

    const promptGenerator = VARIANT_PROMPTS[qIdx % VARIANT_PROMPTS.length];
    const promptText = promptGenerator();

    questions.push({
      id: `daily-q-${currentDayNumber}-${qIdx + 1}`,
      termId: v.id,
      targetWord: v.word.toLowerCase(),
      phonetic: v.phonetic,
      meaningVi: v.meaningVi,
      sentenceBefore: before,
      sentenceAfter: after,
      vietnameseSentence: v.exampleVi,
      hint: v.collocations?.slice(0, 2).join(', ') || v.vietnameseContext,
      questionType: chosenType,
      prompt: promptText,
      options: options,
      correctAnswer: v.word.toLowerCase(),
      explanation: `${v.word} (${v.phonetic}): ${v.meaningVi}. Ví dụ: "${v.exampleEn}" - ${v.exampleVi}`,
      isReview: isReview,
      dayLearned: currentDayNumber
    });
  }

  // Shuffle questions slightly so new terms and review terms are dynamically interwoven
  const shuffledQuestions = questions.sort(() => 0.5 - Math.random());

  return {
    day: currentDayNumber,
    dateKey: todayKey,
    newTermsCount: actualNewVocab.length,
    reviewTermsCount: selectedReviewVocab.length,
    totalQuestions: TOTAL_QUESTIONS,
    newTermIds: newTermIds,
    reviewTermIds: reviewTermIds,
    questions: shuffledQuestions
  };
}
