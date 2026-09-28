export interface Term {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  sentenceBefore: string;
  sentenceAfter: string;
  vietnameseSentence: string;
  hint: string;
  dots: number; // 0 to 5 for mastery level
  mastered: boolean;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  word: string;
  phonetic: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

export interface LessonNode {
  id: string;
  department: 'engine' | 'deck';
  rankCategory: 'rating' | 'officer' | 'management';
  rankTitle: string; // e.g. "Thợ máy (Motorman)", "Máy trưởng (Chief Engineer)"
  title: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
  stars: number; // 0 to 3
  terms: Term[];
  quizzes: QuizQuestion[];
  roleplay: {
    partnerRole: string;
    initialDialogue: string;
    systemPrompt: string;
  };
}

export interface Course {
  id: string;
  title: string;
  industry: string;
  department: 'engine' | 'deck';
  icon: string;
  description: string;
  totalTerms: number;
  completedTerms: number;
  systemPrompt: string;
  initialDialogue: string;
  partnerRole: string;
  terms: Term[];
  quizzes: QuizQuestion[];
}

// ============================================================================
// EXPORT MARITIME_LESSON_NODES - FULL MULTI-LEVEL CAREER TREE & INFINITE NODES
// ============================================================================
import { buildCompleteMaritimeTree, generateInfiniteMaritimeNodes, getRankRequiredVocab, STCW_RANK_VOCAB_REQUIREMENTS } from './infinite_skill_tree';
export { generateInfiniteMaritimeNodes, getRankRequiredVocab, STCW_RANK_VOCAB_REQUIREMENTS };

export const MARITIME_LESSON_NODES: LessonNode[] = buildCompleteMaritimeTree();

// ============================================================================
// COURSES MAPPING FOR BACKWARD COMPATIBILITY
// ============================================================================

export const COURSES: Course[] = [
  {
    id: 'maritime-motorman',
    title: 'Tiếng Anh Khai thác Máy (Marine Engineering)',
    industry: 'Ban Máy',
    department: 'engine',
    icon: '🔧',
    description: 'Từ Thợ máy (Wiper/Motorman) đến Sĩ quan máy và Máy trưởng (Chief Engineer).',
    totalTerms: 420,
    completedTerms: 0,
    partnerRole: 'Sĩ quan máy trưởng (Chief Engineer)',
    initialDialogue: 'Good morning motorman. We have high exhaust temperature on cylinder number 3. Did you inspect the fuel injector?',
    systemPrompt: 'You are the Chief Engineer on an ocean cargo vessel. Test and coach the motorman on engine room operations, maintenance, alarms, and safety procedures. Reply in 1-2 spoken English sentences. Then add on a new line: "[Feedback]: <nhận xét ngữ pháp và từ vựng chuyên ngành hàng hải bằng tiếng Việt>".',
    terms: MARITIME_LESSON_NODES.filter(n => n.department === 'engine').flatMap(n => n.terms),
    quizzes: MARITIME_LESSON_NODES.filter(n => n.department === 'engine').flatMap(n => n.quizzes)
  },
  {
    id: 'maritime-deck',
    title: 'Tiếng Anh Điều khiển Tàu (Deck & Navigation)',
    industry: 'Ban Boong',
    department: 'deck',
    icon: '🧭',
    description: 'Từ Thủy thủ lái (Helmsman/AB) đến Sĩ quan Boong, Đại phó và Thuyền trưởng (Master).',
    totalTerms: 380,
    completedTerms: 0,
    partnerRole: 'Thuyền trưởng (Ship Master)',
    initialDialogue: 'Officer of the watch, report our current position, CPA of the crossing vessel, and wind conditions.',
    systemPrompt: 'You are the Ship Master coaching deck officers and helmsman on navigation rules, helm orders, mooring, and port operations. Reply in 1-2 spoken English sentences and give concise Vietnamese feedback.',
    terms: MARITIME_LESSON_NODES.filter(n => n.department === 'deck').flatMap(n => n.terms),
    quizzes: MARITIME_LESSON_NODES.filter(n => n.department === 'deck').flatMap(n => n.quizzes)
  }
];

// ============================================================================
// ADAPTER: 10,000 MARITIME VOCABULARY CORPUS INTEGRATION
// ============================================================================
import { ALL_MARITIME_VOCABULARY } from './vocabulary';

export const MARITIME_10K_TERMS: Term[] = ALL_MARITIME_VOCABULARY.map(v => {
  const parts = v.exampleEn.split(new RegExp(`(${v.word})`, 'i'));
  const before = parts[0] || '';
  const after = parts.slice(2).join('') || '';
  return {
    id: v.id,
    word: v.word,
    phonetic: v.phonetic,
    meaning: v.meaningVi,
    example: v.exampleEn,
    sentenceBefore: before,
    sentenceAfter: after,
    vietnameseSentence: v.exampleVi,
    hint: v.collocations.slice(0, 2).join(', '),
    dots: 0,
    mastered: false
  };
});
