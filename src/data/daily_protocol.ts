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
  lastReviewed: string;
  needsReview: boolean;
}

export interface FluencyStatus {
  totalLearned: number;
  masteredCount: number;
  reviewingCount: number;
  fluencyRate: number; // 0 - 100
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
}

const STORAGE_KEY_STUDY_HISTORY = 'dio_daily_study_protocol_history';
const STORAGE_KEY_MASTERY = 'dio_vocab_mastery_records';

export function getMasteryRecords(): Record<string, TermMasteryRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MASTERY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {};
}

export function saveMasteryRecord(termId: string, word: string, isCorrect: boolean): TermMasteryRecord {
  const records = getMasteryRecords();
  const current = records[termId] || {
    termId,
    word: word.toLowerCase(),
    correctCount: 0,
    wrongCount: 0,
    masteryScore: 0,
    lastReviewed: new Date().toISOString(),
    needsReview: true
  };

  if (isCorrect) {
    current.correctCount += 1;
    // Increase score towards 100
    current.masteryScore = Math.min(100, current.masteryScore + 25);
  } else {
    current.wrongCount += 1;
    // Drop score to require more drills
    current.masteryScore = Math.max(0, current.masteryScore - 20);
  }

  current.lastReviewed = new Date().toISOString();
  current.needsReview = current.masteryScore < 80;
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

  if (totalLearned === 0) {
    return {
      totalLearned: 0,
      masteredCount: 0,
      reviewingCount: 0,
      fluencyRate: 100,
      recommendation: 'learn_new',
      recommendationReason: 'Bạn chưa học từ nào. Hãy nạp 5 từ đầu tiên hôm nay!'
    };
  }

  let masteredCount = 0;
  let reviewingCount = 0;

  history.learnedTermIds.forEach(id => {
    const rec = records[id];
    if (rec && rec.masteryScore >= 80) {
      masteredCount++;
    } else {
      reviewingCount++;
    }
  });

  const fluencyRate = Math.round((masteredCount / totalLearned) * 100);

  // If user has more than 3 words that are not mastered (< 80% fluency rate)
  // then do NOT force new words; advise fluency consolidation!
  const recommendation = (fluencyRate < 80 && reviewingCount >= 3) ? 'consolidate' : 'learn_new';
  const recommendationReason = recommendation === 'consolidate'
    ? `Độ nhuần nhuyễn hiện tại là ${fluencyRate}%. Bạn còn ${reviewingCount} từ chưa thuộc làu. Hệ thống đề xuất hôm nay LUYỆN NHUẦN NHUYỄN để nhớ sâu vĩnh viễn trước khi nạp thêm từ mới!`
    : `Độ nhuần nhuyễn đạt ${fluencyRate}% rất cao! Sẵn sàng nạp thêm 4-5 từ vựng kỹ thuật mới hôm nay.`;

  return {
    totalLearned,
    masteredCount,
    reviewingCount,
    fluencyRate,
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
      smcpContext
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
      smcpContext
    };
  }

  return {
    isCorrect: false,
    score: 30,
    feedback: `❌ Chưa chính xác. Bạn đã gõ "${userInput || 'trống'}", từ đúng là "${targetWord}".`,
    smartTip: `Định nghĩa: ${meta?.meaningVi || ''}. Hãy đọc to từ này 2 lần và gõ lại để lưu vào bộ nhớ dài hạn!`,
    mnemonic,
    smcpContext
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
  mode: 'auto' | 'fluency_drill' | 'new_words' = 'auto'
): DailyStudySession {
  const history = getStudyHistory();
  const mastery = getMasteryRecords();
  const fluency = getFluencyStatus();
  const todayKey = getLocalDateKey();
  const currentDayNumber = Object.keys(history.daysHistory).length + 1;

  // Filter pool matching department
  const deptVocab = ALL_MARITIME_VOCABULARY.filter(v => v.department === department || v.department === 'safety' || v.department === 'crew');

  const isConsolidating = mode === 'fluency_drill' || (mode === 'auto' && fluency.recommendation === 'consolidate');

  let actualNewVocab: MaritimeTermFull[] = [];
  let newTermIds: string[] = [];

  if (!isConsolidating) {
    // Identify new terms not yet learned
    const unlearnedVocab = deptVocab.filter(v => !history.learnedTermIds.includes(v.id));
    const newVocabPool = unlearnedVocab.slice(0, targetNewCount);
    actualNewVocab = newVocabPool.length > 0 ? newVocabPool : deptVocab.slice(0, targetNewCount);
    newTermIds = actualNewVocab.map(v => v.id);
  }

  // Identify review terms from previous days, prioritizing those needing review / lower score
  const learnedVocabPool = deptVocab.filter(v => history.learnedTermIds.includes(v.id) && !newTermIds.includes(v.id));
  const sortedReviewPool = [...learnedVocabPool].sort((a, b) => {
    const scoreA = mastery[a.id]?.masteryScore ?? 50;
    const scoreB = mastery[b.id]?.masteryScore ?? 50;
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
    (v: MaritimeTermFull) => `Điền từ vựng chuẩn trong ngữ cảnh kỹ thuật: "${v.meaningVi}"`,
    (v: MaritimeTermFull) => `Thuật ngữ nào thể hiện thao tác: "${v.vietnameseContext || v.meaningVi}"?`,
    (v: MaritimeTermFull) => `Chọn từ tiếng Anh phù hợp cho câu khẩu lệnh: "${v.exampleVi}"`,
    (v: MaritimeTermFull) => `Tìm thuật ngữ đồng nghĩa hoặc cùng hệ thống với: "${v.collocations?.[0] || v.meaningVi}"`,
    (v: MaritimeTermFull) => `Thuật ngữ an toàn buồng tàu đối chiếu với: "${v.meaningVi}"`
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

    // Generate 3 plausible distractors from deptVocab
    const otherOptions = deptVocab
      .filter(o => o.word.toLowerCase() !== v.word.toLowerCase())
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(o => o.word.toLowerCase());

    const options = [v.word.toLowerCase(), ...otherOptions].sort(() => 0.5 - Math.random());

    const qTypeIndex = qIdx % 4;
    const qTypes: Array<'cloze' | 'mcq' | 'definition' | 'context'> = ['cloze', 'mcq', 'definition', 'context'];
    const chosenType = qTypes[qTypeIndex];

    const promptGenerator = VARIANT_PROMPTS[qIdx % VARIANT_PROMPTS.length];
    const promptText = promptGenerator(v);

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
