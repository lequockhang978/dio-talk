// ============================================================================
// MARITIME VOCABULARY CORPUS SCHEMA (10,000 TERMS ARCHITECTURE)
// ============================================================================

export interface MaritimeTermFull {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'n' | 'v' | 'adj' | 'phrase';
  department: 'engine' | 'deck' | 'safety' | 'cargo' | 'crew';
  systemCategory: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  stcwCode: string;
  meaningVi: string;
  vietnameseContext: string;
  collocations: string[];
  exampleEn: string;
  exampleVi: string;
  audioUrl?: string;
}
