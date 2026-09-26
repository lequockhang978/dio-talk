import type { MaritimeTermFull } from './types';
import { ENGINE_VOCABULARY_BATCH1 } from './engine_batch1';
import { DECK_VOCABULARY_BATCH1 } from './deck_batch1';
import { MASTER_VOCAB_BANK } from './master_vocab_bank';

export * from './types';
export * from './engine_batch1';
export * from './deck_batch1';
export * from './master_vocab_bank';

// Unified 10,000 Vocabulary Store Index
export const ALL_MARITIME_VOCABULARY: MaritimeTermFull[] = [
  ...ENGINE_VOCABULARY_BATCH1,
  ...DECK_VOCABULARY_BATCH1,
  ...MASTER_VOCAB_BANK
];

// Helper to filter by department
export function getTermsByDepartment(dept: 'engine' | 'deck' | 'all'): MaritimeTermFull[] {
  if (dept === 'all') return ALL_MARITIME_VOCABULARY;
  return ALL_MARITIME_VOCABULARY.filter(t => t.department === dept);
}

// Helper to search vocabulary
export function searchMaritimeVocabulary(query: string, dept: 'engine' | 'deck' | 'all' = 'all'): MaritimeTermFull[] {
  const cleanQ = query.trim().toLowerCase();
  const pool = getTermsByDepartment(dept);
  if (!cleanQ) return pool;
  return pool.filter(t => 
    t.word.toLowerCase().includes(cleanQ) || 
    t.meaningVi.toLowerCase().includes(cleanQ) ||
    t.systemCategory.toLowerCase().includes(cleanQ)
  );
}
