import type { LessonNode, Term, QuizQuestion } from './courses';
import { EXPANDED_MARITIME_NODES } from './expanded_nodes';
import { ALL_MARITIME_VOCABULARY, type MaritimeTermFull } from './vocabulary';
import { getCuratedRatingTerms } from './curriculum_rating_terms';

// ============================================================================
// STCW MARITIME RANK TIERS SPECIFICATION
// ============================================================================
export interface STCWRankTier {
  id: string;
  department: 'engine' | 'deck';
  rankCategory: 'rating' | 'officer' | 'management';
  title: string;
  vietnameseTitle: string;
  stcwCode: string;
  badge: string;
  summary: string;
  requiredVocab?: number;
}

export const STCW_RANK_VOCAB_REQUIREMENTS: Record<string, number> = {
  // Ban Máy (Engine)
  'Lau máy & Thực tập (Wiper & Cadet)': 0,
  'Thợ máy (Motorman)': 100,
  'Thợ máy & Tra dầu (Motorman & Oiler)': 100,
  'Sĩ quan máy (3rd/2nd Engineer)': 400,
  'Sĩ quan máy ba (3rd Engineer)': 400,
  'Sĩ quan máy hai (2nd Engineer)': 500,
  'Sĩ quan điện khí (Electro-Technical Officer - ETO)': 600,
  'Máy trưởng (Chief Engineer)': 800,
  'Hải trình Viễn dương Vô hạn (Infinite Engine Mastery)': 1000,

  // Ban Boong (Deck)
  'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)': 0,
  'Thủy thủ lái (Helmsman / AB)': 100,
  'Thủy thủ lái & Thủy thủ trưởng (Able Seafarer & Bosun)': 100,
  'Sĩ quan phó ba/phó hai (3rd/2nd Officer)': 400,
  'Sĩ quan phó ba (3rd Officer - LSA & FFA)': 400,
  'Sĩ quan phó hai (2nd Officer - Navigation & Passage Planning)': 500,
  'Đại phó (Chief Officer - Cargo & Stability)': 600,
  'Đại phó / Thuyền trưởng (Chief Mate / Master)': 700,
  'Thuyền trưởng (Ship Master - Command & Vetting)': 800,
  'Chỉ huy Toàn cầu Vô hạn (Infinite Global Command)': 1000
};

export function getRankRequiredVocab(rankTitle: string): number {
  if (STCW_RANK_VOCAB_REQUIREMENTS[rankTitle] !== undefined) {
    return STCW_RANK_VOCAB_REQUIREMENTS[rankTitle];
  }
  if (rankTitle.includes('Wiper') || rankTitle.includes('Cadet') || rankTitle.includes('Ordinary Seaman')) return 0;
  if (rankTitle.includes('Motorman') || rankTitle.includes('Helmsman') || rankTitle.includes('Thủy thủ')) return 100;
  if (rankTitle.includes('3rd Engineer') || rankTitle.includes('2nd Engineer') || rankTitle.includes('Sĩ quan máy') || rankTitle.includes('phó ba') || rankTitle.includes('phó hai')) return 400;
  if (rankTitle.includes('ETO') || rankTitle.includes('Đại phó') || rankTitle.includes('Chief Officer')) return 600;
  if (rankTitle.includes('Chief Engineer') || rankTitle.includes('Máy trưởng') || rankTitle.includes('Master') || rankTitle.includes('Thuyền trưởng')) return 800;
  if (rankTitle.includes('Vô hạn') || rankTitle.includes('Infinite')) return 1000;
  return 0;
}

export const STCW_ENGINE_RANKS: STCWRankTier[] = [
  {
    id: 'eng-r1',
    department: 'engine',
    rankCategory: 'rating',
    title: 'Lau máy & Thực tập (Wiper & Cadet)',
    vietnameseTitle: 'Học viên buồng máy & Thợ lau máy',
    stcwCode: 'STCW III/4',
    badge: '🧰',
    summary: 'Nội quy an toàn PPE, dụng cụ cầm tay bàn nguội, lối thoát hiểm và vệ sinh buồng máy.'
  },
  {
    id: 'eng-r2',
    department: 'engine',
    rankCategory: 'rating',
    title: 'Thợ máy & Tra dầu (Motorman & Oiler)',
    vietnameseTitle: 'Thợ máy vận hành ca',
    stcwCode: 'STCW III/5',
    badge: '🔧',
    summary: 'Trực ca buồng máy, hệ thống bôi trơn, bơm hút khô la-gông và van đường ống.'
  },
  {
    id: 'eng-r3',
    department: 'engine',
    rankCategory: 'officer',
    title: 'Sĩ quan máy ba (3rd Engineer)',
    vietnameseTitle: 'Sĩ quan phụ trách nồi hơi & máy phụ',
    stcwCode: 'STCW III/1',
    badge: '⚙️',
    summary: 'Nồi hơi phụ, máy lọc ly tâm FO/LO, máy nén khí khởi động và hệ thống tạo nước ngọt FWG.'
  },
  {
    id: 'eng-r4',
    department: 'engine',
    rankCategory: 'officer',
    title: 'Sĩ quan máy hai (2nd Engineer)',
    vietnameseTitle: 'Đại phó máy phụ trách động cơ chính',
    stcwCode: 'STCW III/2',
    badge: '🔩',
    summary: 'Bảo dưỡng động cơ chính MAN B&W/WinGD, xúp-páp xả, cân chỉnh góc phun và turbocharger.'
  },
  {
    id: 'eng-r5',
    department: 'engine',
    rankCategory: 'officer',
    title: 'Sĩ quan điện khí (Electro-Technical Officer - ETO)',
    vietnameseTitle: 'Sĩ quan kỹ thuật điện & tự động hóa',
    stcwCode: 'STCW III/6',
    badge: '⚡',
    summary: 'Máy phát điện, bảng điện chính MSB, hệ thống tự động hóa UMS, cảm biến và rơ-le bảo vệ.'
  },
  {
    id: 'eng-r6',
    department: 'engine',
    rankCategory: 'management',
    title: 'Máy trưởng (Chief Engineer)',
    vietnameseTitle: 'Quản trị kỹ thuật tàu biển',
    stcwCode: 'STCW III/2 Management',
    badge: '⭐',
    summary: 'Bunkering nhiên liệu, nhật ký dầu ORB, kiểm tra PSC/SIRE 2.0, MARPOL và xử lý sự cố khẩn cấp.'
  },
  {
    id: 'eng-r7',
    department: 'engine',
    rankCategory: 'management',
    title: 'Hải trình Viễn dương Vô hạn (Infinite Engine Mastery)',
    vietnameseTitle: 'Chuyên gia cơ điện hàng hải quốc tế',
    stcwCode: 'STCW Unlimited',
    badge: '🚀',
    summary: 'Cấp độ vô tận tạo tự động từ kho dữ liệu 10.000 từ vựng và tình huống vận hành biển quốc tế.'
  }
];

export const STCW_DECK_RANKS: STCWRankTier[] = [
  {
    id: 'dck-r1',
    department: 'deck',
    rankCategory: 'rating',
    title: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)',
    vietnameseTitle: 'Thủy thủ sơ cấp & Học viên boong',
    stcwCode: 'STCW II/4',
    badge: '🧤',
    summary: 'An toàn lao động boong, gõ rỉ sơn vỏ tàu, bảo quản dây cáp và trang bị cứu sinh LSA.'
  },
  {
    id: 'dck-r2',
    department: 'deck',
    rankCategory: 'rating',
    title: 'Thủy thủ lái & Thủy thủ trưởng (Able Seafarer & Bosun)',
    vietnameseTitle: 'Thủy thủ lái chuyên nghiệp',
    stcwCode: 'STCW II/5',
    badge: '🧭',
    summary: 'Khẩu lệnh lái chuẩn SMCP, trực ca cảnh giới, làm dây cập/rời cầu và thả neo đậu tàu.'
  },
  {
    id: 'dck-r3',
    department: 'deck',
    rankCategory: 'officer',
    title: 'Sĩ quan phó ba (3rd Officer - LSA & FFA)',
    vietnameseTitle: 'Sĩ quan phụ trách an toàn & cứu hỏa',
    stcwCode: 'STCW II/1',
    badge: '🦺',
    summary: 'Thiết bị cứu hộ LSA, cứu hỏa FFA, pháo hiệu pyrotechnics, hải đồ và ca hành hải ban ngày.'
  },
  {
    id: 'dck-r4',
    department: 'deck',
    rankCategory: 'officer',
    title: 'Sĩ quan phó hai (2nd Officer - Navigation & Passage Planning)',
    vietnameseTitle: 'Sĩ quan hàng hải & hoa tiêu',
    stcwCode: 'STCW II/1',
    badge: '🗺️',
    summary: 'Lập kế hoạch hành trình Passage Plan, hải đồ điện tử ECDIS, Radar ARPA và quy tắc tránh va COLREGs.'
  },
  {
    id: 'dck-r5',
    department: 'deck',
    rankCategory: 'management',
    title: 'Đại phó (Chief Officer - Cargo & Stability)',
    vietnameseTitle: 'Sĩ quan boong trưởng & Làm hàng',
    stcwCode: 'STCW II/2',
    badge: '📦',
    summary: 'Tính toán ổn định mớn nước Trim/Stability, làm hàng container/rời/dầu và bơm nước dằn BWTS.'
  },
  {
    id: 'dck-r6',
    department: 'deck',
    rankCategory: 'management',
    title: 'Thuyền trưởng (Ship Master - Command & Vetting)',
    vietnameseTitle: 'Thuyền trưởng chỉ huy tối cao',
    stcwCode: 'STCW II/2 Master Mariner',
    badge: '👑',
    summary: 'Điều động luồng hẹp cùng hoa tiêu, xử lý tranh chấp hàng hải, kiểm tra PSC/RightShip và chỉ huy SAR.'
  },
  {
    id: 'dck-r7',
    department: 'deck',
    rankCategory: 'management',
    title: 'Chỉ huy Toàn cầu Vô hạn (Infinite Global Command)',
    vietnameseTitle: 'Thuyền trưởng viễn dương không giới hạn',
    stcwCode: 'STCW Unlimited Master',
    badge: '🌌',
    summary: 'Hành trình vượt đại dương vô tận liên tục được mở rộng từ 10.000 từ vựng và tình huống SMCP.'
  }
];

// ============================================================================
// ADDITIONAL CURATED STCW NODES (COMPLETING ALL 6 CORE RANKS FOR BOTH DEPTS)
// ============================================================================

export const ADDITIONAL_ENGINE_NODES: LessonNode[] = [
  // --- RANK 1: WIPER / CADET ---
  {
    id: 'eng-wiper-1',
    department: 'engine',
    rankCategory: 'rating',
    rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)',
    title: 'An toàn lao động & Lối thoát hiểm',
    icon: '🧯',
    description: 'Bảo hộ cá nhân PPE, quy tắc làm việc buồng máy và định vị lối thoát sự cố khẩn cấp (Emergency Escape Trunk).',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'ew-1',
        word: 'earmuffs',
        phonetic: '/ˈɪə.mʌfs/',
        meaning: 'chụp tai chống ồn',
        example: 'You must wear hearing protection earmuffs whenever entering the purifier room.',
        sentenceBefore: 'You must wear hearing protection',
        sentenceAfter: 'whenever entering the purifier room.',
        vietnameseSentence: 'Bạn phải đeo chụp tai chống ồn bảo vệ thính giác mỗi khi vào phòng máy lọc.',
        hint: 'Trang bị bảo hộ thính giác',
        dots: 0,
        mastered: false
      },
      {
        id: 'ew-2',
        word: 'escape trunk',
        phonetic: '/ɪˈskeɪp trʌŋk/',
        meaning: 'giếng thoát hiểm sự cố',
        example: 'Keep the emergency escape trunk door clear of any obstruction at all times.',
        sentenceBefore: 'Keep the emergency',
        sentenceAfter: 'door clear of any obstruction at all times.',
        vietnameseSentence: 'Luôn giữ cửa giếng thoát hiểm sự cố thông thoáng, không có bất kỳ vật cản nào.',
        hint: 'Lối thoát hiểm thẳng đứng buồng máy',
        dots: 0,
        mastered: false
      },
      {
        id: 'ew-3',
        word: 'cotton rags',
        phonetic: '/ˈkɒt.ən ræɡz/',
        meaning: 'giẻ lau cotton',
        example: 'Dispose of oily cotton rags into the dedicated closed metal bin to prevent spontaneous combustion.',
        sentenceBefore: 'Dispose of oily',
        sentenceAfter: 'into the dedicated closed metal bin to prevent spontaneous combustion.',
        vietnameseSentence: 'Vứt giẻ lau dính dầu vào thùng kim loại nắp kín chuyên dụng để tránh tự bốc cháy.',
        hint: 'Giẻ lau buồng máy dính dầu',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'q-ew-1',
        prompt: 'Giẻ lau dính dầu mỡ trong buồng máy bắt buộc phải được bỏ vào đâu theo quy định an toàn?',
        word: 'closed metal bin',
        phonetic: '/kləʊzd ˈmetl bɪn/',
        correctAnswer: 'closed metal bin',
        options: ['closed metal bin', 'engine bilge well', 'open deck plates', 'domestic waste bag'],
        explanation: 'Oily cotton rags phải chứa trong thùng kim loại nắp đậy kín (closed metal bin) để chống cháy tự phát.'
      }
    ],
    roleplay: {
      partnerRole: 'Thợ máy chính (Leading Motorman)',
      initialDialogue: 'Wiper, put on your safety goggles and ear protection. We need to degrease the lower deck plates.',
      systemPrompt: 'You are the Leading Motorman briefing a new Wiper on engine room housekeeping and PPE compliance.'
    }
  },

  // --- RANK 5: ELECTRO-TECHNICAL OFFICER (ETO) ---
  {
    id: 'eng-eto-1',
    department: 'engine',
    rankCategory: 'officer',
    rankTitle: 'Sĩ quan điện khí (Electro-Technical Officer - ETO)',
    title: 'Bảng điện chính MSB & Hòa đồng bộ',
    icon: '⚡',
    description: 'Vận hành bảng phân phối điện chính, đồng bộ tần số pha máy phát điện và ngắt mạch tự động ACB.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e-eto-1',
        word: 'switchboard',
        phonetic: '/ˈswɪtʃ.bɔːd/',
        meaning: 'bảng điện chính (MSB)',
        example: 'The main switchboard distributes 440V 60Hz 3-phase alternating current to all ship consumers.',
        sentenceBefore: 'The main',
        sentenceAfter: 'distributes 440V 60Hz 3-phase alternating current to all ship consumers.',
        vietnameseSentence: 'Bảng điện chính phân phối dòng điện xoay chiều 3 pha 440V 60Hz tới toàn bộ phụ tải trên tàu.',
        hint: 'Bảng phân phối điện trung tâm',
        dots: 0,
        mastered: false
      },
      {
        id: 'e-eto-2',
        word: 'synchronizing',
        phonetic: '/ˈsɪŋ.krə.naɪ.zɪŋ/',
        meaning: 'hòa đồng bộ máy phát',
        example: 'Observe the synchroscope carefully before closing the generator air circuit breaker for paralleling.',
        sentenceBefore: 'Observe the synchroscope carefully before closing the breaker for',
        sentenceAfter: 'generators on the board.',
        vietnameseSentence: 'Quan sát kỹ đồng hồ hòa đồng bộ trước khi đóng áp-tô-mát máy phát để chạy song song.',
        hint: 'Thao tác ghép nối máy phát điện',
        dots: 0,
        mastered: false
      },
      {
        id: 'e-eto-3',
        word: 'insulation resistance',
        phonetic: '/ˌɪn.sjəˈleɪ.ʃən rɪˈzɪs.təns/',
        meaning: 'điện trở cách điện (Megger test)',
        example: 'Use the 500V megger meter to verify motor stator insulation resistance before restarting.',
        sentenceBefore: 'Use the 500V megger meter to verify motor stator',
        sentenceAfter: 'before restarting.',
        vietnameseSentence: 'Sử dụng đồng hồ megômmét 500V để kiểm tra điện trở cách điện cuộn dây stato trước khi khởi động lại.',
        hint: 'Chỉ số đo độ cách điện của cuộn dây',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'q-eto-1',
        prompt: 'Thiết bị nào chỉ thị thời điểm kim đồng hồ chỉ đúng vị trí 12 giờ để đóng hòa máy phát điện?',
        word: 'synchroscope',
        phonetic: '/ˈsɪŋ.krə.skəʊp/',
        correctAnswer: 'synchroscope',
        options: ['synchroscope', 'tachometer', 'manometer', 'salinometer'],
        explanation: 'Synchroscope (đồng hồ hòa đồng bộ) quay chỉ thị góc lệch pha giữa máy phát và lưới điện.'
      }
    ],
    roleplay: {
      partnerRole: 'Sĩ quan điện (ETO)',
      initialDialogue: 'Engine officer, Generator 2 frequency is at 60.1Hz. Prepare to parallel and share kW load equally.',
      systemPrompt: 'You are the Electro-Technical Officer (ETO) guiding engine staff through MSB load sharing.'
    }
  },
  {
    id: 'eng-eto-2',
    department: 'engine',
    rankCategory: 'officer',
    rankTitle: 'Sĩ quan điện khí (Electro-Technical Officer - ETO)',
    title: 'Hệ thống Báo cháy & Cảm biến tự động UMS',
    icon: '🚨',
    description: 'Kiểm tra đầu dò báo khói ion hóa, cảm biến nhiệt buồng máy và chuông còi báo động tự động UMS.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e-eto-4',
        word: 'smoke detector',
        phonetic: '/sməʊk dɪˈtek.tər/',
        meaning: 'đầu báo khói quang học/ion hóa',
        example: 'Test every optical smoke detector along the purifiers and boiler casing quarterly.',
        sentenceBefore: 'Test every optical',
        sentenceAfter: 'along the purifiers and boiler casing quarterly.',
        vietnameseSentence: 'Kiểm tra định kỳ hàng quý từng đầu báo khói quang học dọc theo buồng máy lọc và vỏ nồi hơi.',
        hint: 'Cảm biến phát hiện khói cháy sớm',
        dots: 0,
        mastered: false
      },
      {
        id: 'e-eto-5',
        word: 'dead man alarm',
        phonetic: '/ded mæn əˈlɑːm/',
        meaning: 'hệ thống báo động an toàn người trực ca',
        example: 'The dead man alarm will sound on bridge if the duty engineer does not reset the timer within 27 minutes.',
        sentenceBefore: 'The engine room',
        sentenceAfter: 'will alert the bridge if no motion is detected within the set interval.',
        vietnameseSentence: 'Hệ thống báo động an toàn người trực ca sẽ báo lên buồng lái nếu không có tín hiệu xác nhận trong khoảng thời gian cài đặt.',
        hint: 'Báo động an toàn khi trực ca một mình',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'q-eto-2',
        prompt: 'Hệ thống an toàn tự động phát tín hiệu lên buồng lái khi sĩ quan trực máy bị ngất hoặc không bấm nút xác nhận gọi là gì?',
        word: 'dead man alarm',
        phonetic: '/ded mæn əˈlɑːm/',
        correctAnswer: 'dead man alarm / BNWAS engine',
        options: ['dead man alarm / BNWAS engine', 'fire patrol horn', 'general emergency siren', 'rudder angle alarm'],
        explanation: 'Dead man alarm bảo vệ tính mạng sĩ quan trực ca khi làm việc một mình trong buồng máy.'
      }
    ],
    roleplay: {
      partnerRole: 'Sĩ quan điện (ETO)',
      initialDialogue: 'We are carrying out the weekly test of the engine room fire detection loop zone 3. Acknowledge the buzzer on panel.',
      systemPrompt: 'You are the ETO conducting routine safety alarm testing.'
    }
  }
];

export const ADDITIONAL_DECK_NODES: LessonNode[] = [
  // --- RANK 1: DECK CADET / OS ---
  {
    id: 'dck-os-1',
    department: 'deck',
    rankCategory: 'rating',
    rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)',
    title: 'Gõ rỉ, Sơn tàu & Bảo quản vỏ tàu',
    icon: '🎨',
    description: 'Sử dụng súng gõ rỉ khí nén, chổi sắt, quét sơn lót epoxy và tuân thủ an toàn mạn tàu.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'dos-1',
        word: 'chipping hammer',
        phonetic: '/ˈtʃɪp.ɪŋ ˈhæm.ər/',
        meaning: 'búa gõ rỉ',
        example: 'Use the pneumatic chipping hammer to remove heavy scale rust before priming the forecastle deck.',
        sentenceBefore: 'Use the pneumatic',
        sentenceAfter: 'to remove heavy scale rust before priming the forecastle deck.',
        vietnameseSentence: 'Dùng búa gõ rỉ khí nén để bóc lớp rỉ sét dày trước khi sơn lót mặt boong mũi.',
        hint: 'Dụng cụ đập bong rỉ thép boong',
        dots: 0,
        mastered: false
      },
      {
        id: 'dos-2',
        word: 'safety harness',
        phonetic: '/ˈseɪf.ti ˈhɑː.nəs/',
        meaning: 'dây đai an toàn toàn thân',
        example: 'You must secure your full body safety harness and lifeline whenever working aloft or over the side.',
        sentenceBefore: 'You must secure your full body',
        sentenceAfter: 'and lifeline whenever working aloft or over the side.',
        vietnameseSentence: 'Bạn phải móc dây đai an toàn toàn thân và dây cứu sinh mỗi khi làm việc trên cao hoặc ngoài mạn.',
        hint: 'Dây đai chống ngã trên cao',
        dots: 0,
        mastered: false
      },
      {
        id: 'dos-3',
        word: 'primer',
        phonetic: '/ˈpraɪ.mər/',
        meaning: 'sơn lót chống rỉ',
        example: 'Apply two coats of zinc epoxy primer on the bare steel surface immediately after needle scaling.',
        sentenceBefore: 'Apply two coats of zinc epoxy',
        sentenceAfter: 'on the bare steel surface immediately after needle scaling.',
        vietnameseSentence: 'Quét hai lớp sơn lót kẽm epoxy lên bề mặt thép trần ngay sau khi đánh rỉ kim.',
        hint: 'Lớp sơn bảo vệ đầu tiên chống ăn mòn',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'q-dos-1',
        prompt: 'Khi làm việc trên cao (working aloft) hoặc ngoài mạn tàu (over the side), trang bị bắt buộc chống rơi ngã là gì?',
        word: 'safety harness',
        phonetic: '/ˈseɪf.ti ˈhɑː.nəs/',
        correctAnswer: 'safety harness and lifeline',
        options: ['safety harness and lifeline', 'cotton gloves only', 'sunglasses', 'heavy boots only'],
        explanation: 'Working aloft hoặc overboard luôn bắt buộc phải đeo Safety Harness và có người cảnh giới.'
      }
    ],
    roleplay: {
      partnerRole: 'Thủy thủ trưởng (Bosun)',
      initialDialogue: 'Cadet, put on your safety harness and hard hat. We have permit to work aloft to paint mast radar platform.',
      systemPrompt: 'You are the Bosun giving safety instructions to a deck cadet.'
    }
  },

  // --- RANK 5: CHIEF OFFICER (ĐẠI PHÓ) ---
  {
    id: 'dck-co-1',
    department: 'deck',
    rankCategory: 'management',
    rankTitle: 'Đại phó (Chief Officer - Cargo & Stability)',
    title: 'Tính toán Ổn định Mớn nước & Hiệu số mớn Trim',
    icon: '⚖️',
    description: 'Đo mớn nước Draft Survey, tính toán chiều cao tâm nghiêng GM, uốn võng thân tàu (Sagging/Hogging).',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'dco-1',
        word: 'metacentric height',
        phonetic: '/ˌmet.əˈsen.trɪk haɪt/',
        meaning: 'chiều cao tâm nghiêng (GM)',
        example: 'The final departure condition shows a positive metacentric height GM of 1.45 meters.',
        sentenceBefore: 'The final departure condition shows a positive',
        sentenceAfter: 'GM of 1.45 meters.',
        vietnameseSentence: 'Trạng thái rời cảng cuối cùng cho thấy chiều cao tâm nghiêng GM dương 1.45 mét.',
        hint: 'Đại lượng đánh giá độ ổn định ban đầu của tàu',
        dots: 0,
        mastered: false
      },
      {
        id: 'dco-2',
        word: 'draft survey',
        phonetic: '/drɑːft ˈsɜː.veɪ/',
        meaning: 'giám định mớn nước xác định khối lượng hàng',
        example: 'The surveyor and Chief Officer take draft survey readings at forward, midships, and aft marks.',
        sentenceBefore: 'The surveyor and Chief Officer take',
        sentenceAfter: 'readings at forward, midships, and aft marks.',
        vietnameseSentence: 'Giám định viên và Đại phó cùng đọc các dấu đo mớn nước tại mũi, giữa tàu và lái.',
        hint: 'Phương pháp đo mớn nước tính lượng hàng',
        dots: 0,
        mastered: false
      },
      {
        id: 'dco-3',
        word: 'ballasting',
        phonetic: '/ˈbæl.ə.stɪŋ/',
        meaning: 'bơm nước dằn tàu',
        example: 'Commence ballasting double bottom tanks numbers 2 and 3 to keep the propeller fully immersed.',
        sentenceBefore: 'Commence',
        sentenceAfter: 'double bottom tanks numbers 2 and 3 to keep the propeller fully immersed.',
        vietnameseSentence: 'Bắt đầu bơm nước dằn vào các két đáy đôi số 2 và số 3 để giữ chân vịt luôn chìm ngập hoàn toàn.',
        hint: 'Thao tác bơm nước dằn điều chỉnh mớn nước',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'q-dco-1',
        prompt: 'What critical danger occurs if a ship has a negative metacentric height (Negative GM)?',
        word: 'Negative GM',
        phonetic: '/ˈneɡ.ə.tɪv dʒiː em/',
        correctAnswer: 'Tàu mất ổn định và có nguy cơ lật úp (Capsize)',
        options: [
          'Tàu mất ổn định và có nguy cơ lật úp (Capsize)',
          'Tàu tăng tốc độ hành trình',
          'Chân vịt quay êm hơn',
          'Giảm tiêu hao nhiên liệu máy chính'
        ],
        explanation: 'GM âm khiến tàu mất mô-men hồi phục, dễ bị nghiêng vĩnh viễn hoặc lật chìm khi có ngoại lực.'
      }
    ],
    roleplay: {
      partnerRole: 'Giám định viên cảng (Port Surveyor)',
      initialDialogue: 'Chief Officer, let us record the forward draft marks on both port and starboard sides before deballasting.',
      systemPrompt: 'You are a Port Draft Surveyor collaborating with the Chief Officer.'
    }
  }
];

// ============================================================================
// DYNAMIC PROCEDURAL GENERATOR FOR "INFINITE" MARITIME CAREER PROGRESSION
// ============================================================================

const MARITIME_DOMAIN_TOPICS = {
  engine: [
    { title: 'Hệ thống Nhiên liệu Cao áp & Common Rail', icon: '🛢️', role: 'Sĩ quan máy hai (Second Engineer)' },
    { title: 'Tự động hóa Tua-bin Tăng áp & Khí quét', icon: '🌪️', role: 'Chuyên gia Turbocharger' },
    { title: 'Vận hành Lọc Ly tâm Dầu Tự làm sạch', icon: '⚙️', role: 'Sĩ quan máy ba (Third Engineer)' },
    { title: 'Giám sát Nồi hơi Khí xả & Ống truyền nhiệt', icon: '🔥', role: 'Máy phó phụ trách Nồi hơi' },
    { title: 'Cân bằng Tải Máy phát & Rơ-le Chống quá dòng', icon: '⚡', role: 'Sĩ quan điện (ETO)' },
    { title: 'Ứng phó Sự cố Mất điện Đột ngột Blackout', icon: '🚨', role: 'Máy trưởng (Chief Engineer)' },
    { title: 'Hệ thống Tuần hoàn Dầu Bôi trơn Bạc trục', icon: '💧', role: 'Kỹ sư Giám sát Máy chính' },
    { title: 'Kiểm soát Khí thải MARPOL Phụ lục VI & Scrubber', icon: '🌿', role: 'Thanh tra Đăng kiểm Class' },
    { title: 'Quy trình Nhận Dầu Bunkering Quốc tế', icon: '⛽', role: 'Đại diện Trạm Cấp dầu Cảng' },
    { title: 'Bảo dưỡng Van Xúp-páp Xả Thủy lực Điều khiển', icon: '🔩', role: 'Kỹ sư Hãng MAN B&W' }
  ],
  deck: [
    { title: 'Điều động Tàu Luồng hẹp & Hải lưu phức tạp', icon: '🧭', role: 'Hoa tiêu Hàng hải (Senior Pilot)' },
    { title: 'Hải đồ Điện tử ECDIS & Quản lý Sai số GPS', icon: '🗺️', role: 'Sĩ quan phó hai (Navigation Officer)' },
    { title: 'Tránh va Biển sương mù & Radar ARPA Guard Ring', icon: '📡', role: 'Sĩ quan trực ca (OOW)' },
    { title: 'Thao tác Dây Cáp Neo Chống đứt Snap-back', icon: '⚓', role: 'Thủy thủ trưởng (Bosun)' },
    { title: 'Vận hành Hệ thống Xử lý Nước dằn BWTS', icon: '🌊', role: 'Đại phó (Chief Officer)' },
    { title: 'Quy trình Nhập cảnh Cảng PSC & Hải quan', icon: '📋', role: 'Sĩ quan PSC Inspector' },
    { title: 'Khẩn cấp Cứu nạn Tìm kiếm SAR & Trực ca GMDSS', icon: '🆘', role: 'Trung tâm Phối hợp Cứu nạn MRCC' },
    { title: 'Chằng buộc Hàng nặng Project Cargo & Container', icon: '📦', role: 'Đại diện Cảng vụ Xếp dỡ' },
    { title: 'Thời tiết Bão Biển & Đường tránh Tâm áp thấp', icon: '⛈️', role: 'Chuyên gia Dự báo Thời tiết' },
    { title: 'Phỏng vấn Thẩm định Tàu Vetting SIRE 2.0 / RightShip', icon: '👑', role: 'Thanh tra Dầu khí OCIMF SIRE' }
  ]
};

/**
 * Procedurally generates an infinite sequence of progressive Lesson Nodes
 * chunked from vocabulary terms and realistic maritime scenarios.
 */
export function generateInfiniteMaritimeNodes(
  department: 'engine' | 'deck',
  startIndex: number = 0,
  count: number = 20
): LessonNode[] {
  const vocabPool = ALL_MARITIME_VOCABULARY.filter(v => v.department === department);
  const topics = MARITIME_DOMAIN_TOPICS[department];
  const nodes: LessonNode[] = [];

  const rankTitle = department === 'engine' 
    ? 'Hải trình Viễn dương Vô hạn (Infinite Engine Mastery)'
    : 'Chỉ huy Toàn cầu Vô hạn (Infinite Global Command)';

  for (let i = 0; i < count; i++) {
    const globalIdx = startIndex + i;
    const stageNum = globalIdx + 1;
    const topic = topics[globalIdx % topics.length];
    const nodeId = `${department}-inf-${stageNum}`;

    // Select 3 vocabulary terms for this node
    const termSlice: Term[] = [];
    const quizzes: QuizQuestion[] = [];

    for (let t = 0; t < 3; t++) {
      const termIdx = (globalIdx * 3 + t) % vocabPool.length;
      const v: MaritimeTermFull = vocabPool[termIdx];
      const uniqueTermId = `${nodeId}-t${t + 1}`;

      const parts = v.exampleEn.split(new RegExp(`(${v.word})`, 'i'));
      const before = parts[0] || 'Observe and inspect the';
      const after = parts.slice(2).join('') || 'according to standard operating procedures.';

      termSlice.push({
        id: uniqueTermId,
        word: v.word.toLowerCase(),
        phonetic: v.phonetic,
        meaning: v.meaningVi,
        example: v.exampleEn,
        sentenceBefore: before,
        sentenceAfter: after,
        vietnameseSentence: v.exampleVi,
        hint: v.collocations.slice(0, 2).join(', ') || v.vietnameseContext,
        dots: 0,
        mastered: false
      });

      // Build quiz question for term
      if (t < 2) {
        // Collect 3 distractors
        const otherTerms = vocabPool
          .filter(o => o.word.toLowerCase() !== v.word.toLowerCase())
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(o => o.word.toLowerCase());

        const options = [v.word.toLowerCase(), ...otherTerms].sort(() => 0.5 - Math.random());

        quizzes.push({
          id: `q-${uniqueTermId}`,
          prompt: `Thuật ngữ nào mang ý nghĩa: "${v.meaningVi}" (${v.vietnameseContext})?`,
          word: v.word.toLowerCase(),
          phonetic: v.phonetic,
          correctAnswer: v.word.toLowerCase(),
          options: options,
          explanation: `${v.word} (${v.phonetic}): ${v.meaningVi}. Ví dụ: ${v.exampleEn}`
        });
      }
    }

    nodes.push({
      id: nodeId,
      department: department,
      rankCategory: 'management',
      rankTitle: rankTitle,
      title: `Chặng ${stageNum}: ${topic.title}`,
      icon: topic.icon,
      description: `Cấp độ viễn dương chuyên sâu: Luyện từ vựng kỹ thuật, phản xạ trắc nghiệm và đàm thoại SMCP cùng ${topic.role}.`,
      isUnlocked: false,
      stars: 0,
      terms: termSlice,
      quizzes: quizzes,
      roleplay: {
        partnerRole: topic.role,
        initialDialogue: `Officer, this is ${topic.role}. Report status on ${termSlice[0].word} and proceed with the operation.`,
        systemPrompt: `You are ${topic.role} aboard an ocean vessel. Challenge the user on technical maritime communication regarding ${topic.title}. Answer concisely in professional English and provide Vietnamese feedback.`
      }
    });
  }

  return nodes;
}

// ============================================================================
// STCW RATING 400-VOCABULARY CURRICULUM GENERATOR (WIPER & MOTORMAN / OS & AB)
// Generates exactly 80 nodes x 5 terms = 400 terms required before Officer Rank
// ============================================================================

export function generateRating400Curriculum(department: 'engine' | 'deck'): LessonNode[] {
  const nodes: LessonNode[] = [];

  const engineTopics = [
    // --- 20 Nodes for Wiper / Cadet (100 Terms) ---
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'An toàn lao động & PPE buồng máy', icon: '🧰', role: 'Thợ máy chính (Leading Motorman)' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Bảng chỉ dẫn & Lối thoát sự cố', icon: '🚪', role: 'Sĩ quan an toàn (Safety Officer)' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Dụng cụ cầm tay & Bàn nguội cơ khí', icon: '🔨', role: 'Thợ tiện (Fitter)' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Vệ sinh sàn buồng máy & Khay hứng dầu', icon: '🧹', role: 'Thợ máy ca (Duty Motorman)' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Thu gom rác thải MARPOL Phụ lục V', icon: '♻️', role: 'Sĩ quan máy ba (3rd Engineer)' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Xử lý giẻ lau dính dầu & Thùng kim loại', icon: '🧯', role: 'Thợ máy chính' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Nhận diện các van chặn đường ống cơ bản', icon: '🚰', role: 'Sĩ quan máy hai (2nd Engineer)' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Thao tác que đo sounding két la-gông', icon: '📏', role: 'Thợ máy ca' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Mã màu tiêu chuẩn đường ống buồng máy', icon: '🎨', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Kiểm tra đèn thoát hiểm & Bình thở EEBD', icon: '🔦', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Châm dầu bôi trơn máy nén & Bơm phụ', icon: '🛢️', role: 'Thợ máy ca' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Vệ sinh lưới lọc hút nước biển thô', icon: '🌊', role: 'Thợ tiện' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'An toàn khí nén vệ sinh & Súng thổi bụi', icon: '💨', role: 'Thợ máy chính' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Chuẩn bị dụng cụ bảo dưỡng ngăn ngừa PMS', icon: '📦', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Kiểm tra rò rỉ mặt bích & Thay gioăng đệm', icon: '🔩', role: 'Thợ tiện' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Báo cáo thông số bất thường cho ca trực', icon: '📋', role: 'Sĩ quan máy trực ca' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Quy tắc an toàn trước khi vào khoang tối', icon: '💡', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Kính bảo hộ & Chụp tai chống ồn buồng máy', icon: '🥽', role: 'Thợ máy chính' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Giày mũi thép & Quần áo bảo hộ liền thân', icon: '🥾', role: 'Thợ máy ca' },
    { rankTitle: 'Lau máy & Thực tập (Wiper & Cadet)', title: 'Tổng kết nghiệp vụ Lau máy STCW III/4', icon: '🎓', role: 'Máy trưởng (Chief Engineer)' },

    // --- 60 Nodes for Motorman (300 Terms) ---
    { rankTitle: 'Thợ máy (Motorman)', title: 'Lộ trình kiểm tra định kỳ ca trực (Watch rounds)', icon: '🚶', role: 'Sĩ quan máy trực ca' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Ghi chép nhật ký buồng máy & Đo nhiệt độ', icon: '📝', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Hệ thống van đường ống & Van một chiều', icon: '🔧', role: 'Thợ tiện' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Hệ thống bôi trơn máy chính & Két tuần hoàn', icon: '🛢️', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Vệ sinh và đảo phin lọc dầu nhờn tự rửa', icon: '⚙️', role: 'Thợ máy chính' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Bơm hút khô la-gông buồng máy & Két lắng', icon: '💧', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Vận hành máy tách nước dầu 15 ppm (OWS)', icon: '🌿', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Máy nén khí chính & Xả nước đọng bình gió', icon: '💨', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Duy trì áp suất gió khởi động 30 bar', icon: '⏱️', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Vận hành nồi hơi phụ & Ống thủy đo nước', icon: '🔥', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Xử lý hóa chất nước lò & Thổi muội ống khói', icon: '🧪', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Máy lọc ly tâm dầu HFO & Đĩa phân ly', icon: '🌪️', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Quy trình xả cặn tự động máy lọc dầu FO', icon: '⚙️', role: 'Thợ máy chính' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Máy lọc dầu bôi trơn LO & Ổn định nhiệt độ', icon: '🌡️', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Bơm chuyển dầu nhiên liệu FO Transfer Pump', icon: '⛽', role: 'Thợ máy ca' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Bơm tuần hoàn nước làm mát ngọt máy chính', icon: '🔄', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Bơm nước biển làm mát & Van hút đáy Sea Chest', icon: '🌊', role: 'Thợ tiện' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Vệ sinh sinh hàn gió tăng áp & Bộ trao đổi nhiệt', icon: '❄️', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Kiểm tra mức dầu bôi trơn bạc trục chân vịt', icon: '⚓', role: 'Thợ máy chính' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Máy chưng cất nước ngọt chân không (FWG)', icon: '🚰', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Cảm biến độ mặn Salinometer & Van xả tự động', icon: '🚨', role: 'Sĩ quan điện (ETO)' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Trạm xử lý nước thải sinh hoạt STP vi sinh', icon: '🚽', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Hệ thống kho lạnh thực phẩm & Máy nén Freon', icon: '🧊', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Kiểm tra mức dầu cacte máy phát điện phụ', icon: '🔋', role: 'Thợ máy ca' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Quy trình nhận dầu Bunkering & Cột mẫu nhỏ giọt', icon: '🚢', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Đóng van xả mạn Scupper Plugs & Cờ đỏ Bravo', icon: '🚩', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Đo que thăm két nhiên liệu Sounding Tape', icon: '📏', role: 'Thợ máy ca' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Tra bảng thể tích két dầu Ullage Table', icon: '📊', role: 'Sĩ quan máy ba' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Bảo dưỡng van một chiều & Phớt bơm cơ khí', icon: '🔩', role: 'Thợ tiện' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Thay cánh bơm ly tâm Impeller & Bạc lót', icon: '⚙️', role: 'Thợ tiện' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Cân chỉnh đồng trục khớp nối bơm động cơ', icon: '📐', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Kiểm tra bộ điều tốc máy phát điện Governor', icon: '⚡', role: 'Sĩ quan điện (ETO)' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Hệ thống dầu thủy lực tời neo và cẩu hàng', icon: '🏗️', role: 'Thợ máy chính' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Vệ sinh khoang quét khí máy chính Scavenge Box', icon: '🧹', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Đo khe hở miệng xéc-măng pít-tông Feeler Gauge', icon: '🔬', role: 'Thợ tiện' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Giám sát độ lệch nhiệt độ khí xả các xi-lanh', icon: '📈', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Phát hiện tiếng gõ máy & Bất thường kim phun', icon: '👂', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Quy trình chuẩn bị máy trước giờ điều động Standby', icon: '🔔', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Thao tác chuông truyền lệnh máy Engine Telegraph', icon: '🎛️', role: 'Sĩ quan máy trực ca' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Bàn giao ca trực buồng máy theo chuẩn STCW', icon: '🤝', role: 'Sĩ quan máy trực ca' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Kiểm tra van an toàn nắp xi-lanh Relief Valve', icon: '🛡️', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Hệ thống bôi trơn sơ-mi xi-lanh Alpha Lubricator', icon: '💧', role: 'Sĩ quan máy hai' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Đo độ chênh áp qua phin lọc dầu đốt Duplex', icon: '⏱️', role: 'Thợ máy ca' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Vận hành máy phát điện sự cố Emergency Generator', icon: '🚨', role: 'Sĩ quan điện (ETO)' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Kiểm tra bình ắc-quy khởi động sự cố 24V DC', icon: '🔋', role: 'Sĩ quan điện (ETO)' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Xả khí đọng đường ống dầu cao áp High Pressure', icon: '💨', role: 'Thợ máy chính' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Đo điện trở cách điện Megger motor quạt gió', icon: '⚡', role: 'Sĩ quan điện (ETO)' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Kiểm tra đầu dò khói quang học buồng máy', icon: '🚨', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Báo động an toàn người trực ca Dead Man Alarm', icon: '🔔', role: 'Sĩ quan điện (ETO)' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Quy trình khóa van cách ly năng lượng LOTO', icon: '🔒', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Giấy phép làm việc có phát sinh nhiệt Hot Work', icon: '🔥', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Giấy phép vào không gian kín Enclosed Space', icon: '🚪', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Đo nồng độ oxy 21% trước khi vào két ballast', icon: '💨', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Trang bị bình thở SCBA & Dây cứu sinh Lifeline', icon: '🦺', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Diễn tập ứng phó cháy buồng máy Engine Fire', icon: '🧯', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Diễn tập sự cố mất điện toàn tàu Blackout Drill', icon: '⚡', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Sử dụng bình bọt chữa cháy di động Foam Applicator', icon: '🧴', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Nhật ký dầu nhớt ORB Phần 1 mục trực ca', icon: '📖', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Kiểm tra sẵn sàng đón đoàn thanh tra PSC buồng máy', icon: '📋', role: 'Máy trưởng' },
    { rankTitle: 'Thợ máy (Motorman)', title: 'Đạt chuẩn sát hạch Thợ máy STCW III/5 (400 Từ)', icon: '⭐', role: 'Hội đồng Giám khảo STCW' }
  ];

  const deckTopics = [
    // --- 20 Nodes for Deck Cadet / OS (100 Terms) ---
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'An toàn lao động mặt boong & Đồ bảo hộ PPE', icon: '🧤', role: 'Thủy thủ trưởng (Bosun)' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Nút dây hàng hải cơ bản & Nút ghế Bowline', icon: '🪢', role: 'Thủy thủ lái chính' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Phân loại dây buộc tàu & Dây cáp thép Wire', icon: '⚓', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Gõ rỉ khí nén Chipping Hammer & Chổi sắt', icon: '🔨', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Sơn lót chống rỉ Epoxy Primer & Lớp sơn phủ', icon: '🎨', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'An toàn làm việc trên cao Working Aloft', icon: '🧗', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'An toàn làm việc ngoài mạn Over the Side', icon: '🦺', role: 'Đại phó (Chief Officer)' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Dây cứu sinh Lifeline & Dây đai an toàn Harness', icon: '🪢', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Kiểm tra phao tròn cứu sinh Lifebuoy mạn tàu', icon: '🛟', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Áo phao cứu sinh Lifejacket & Đèn chỉ báo', icon: '🦺', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Bộ quần áo chống ngâm nước Immersion Suit', icon: '🧥', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Vệ sinh hầm hàng Hold Cleaning sau dỡ than', icon: '🧹', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Đóng mở nắp hầm hàng Hatch Cover an toàn', icon: '🚢', role: 'Đại phó' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Kiểm tra lỗ thoát nước mặt boong Scuppers', icon: '💧', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Thu gom rác thải boong tàu Garbage Record', icon: '♻️', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Trực ca cảnh giới ban ngày trên đài quan sát', icon: '👀', role: 'Sĩ quan trực ca (OOW)' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Đèn hành trình mạn trái đỏ & mạn phải xanh', icon: '🔴', role: 'Sĩ quan phó hai' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Báo cáo tàu thuyền lạ bằng phương vị tương đối', icon: '🧭', role: 'Sĩ quan trực ca' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Chuông báo sương mù & Còi hú thời tiết xấu', icon: '📢', role: 'Sĩ quan trực ca' },
    { rankTitle: 'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)', title: 'Tổng kết nghiệp vụ Thủy thủ sơ cấp STCW II/4', icon: '🎓', role: 'Thuyền trưởng (Master)' },

    // --- 60 Nodes for Helmsman / AB (300 Terms) ---
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khẩu lệnh lái mạn trái: Port 5, Port 10, Port 20', icon: '⬅️', role: 'Sĩ quan trực ca' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khẩu lệnh lái mạn phải: Starboard 5, 10, 20', icon: '➡️', role: 'Sĩ quan trực ca' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khẩu lệnh bẻ hết lái: Hard-a-port & Hard-a-starboard', icon: '🔄', role: 'Hoa tiêu hàng hải' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khẩu lệnh bánh lái về giữa Midships', icon: '⚖️', role: 'Sĩ quan trực ca' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khẩu lệnh giữ hướng: Steady as she goes & Meet her', icon: '🎯', role: 'Hoa tiêu hàng hải' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Chuyển đổi lái tự động Autopilot sang lái tay Manual', icon: '🕹️', role: 'Sĩ quan phó hai' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Thao tác lái sự cố tại buồng lái đuôi Emergency Steering', icon: '🚨', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Trực ca cảnh giới ban đêm Lookout Night Watch', icon: '🌙', role: 'Sĩ quan trực ca' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Nhận dạng đèn hành trình các loại tàu COLREGs', icon: '💡', role: 'Sĩ quan phó hai' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Dấu hiệu ban ngày Day Shapes: Quả cầu, Nón ngược', icon: '⚫', role: 'Sĩ quan phó hai' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Thao tác tời neo Windlass & Kéo mỏ neo', icon: '⚓', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khẩu lệnh thả neo: Let go the anchor', icon: '⚓', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khẩu lệnh kéo neo: Heave up anchor & Anchor aweigh', icon: '⚙️', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đếm số đốt đường xích neo Shackles in water', icon: '⛓️', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Thao tác dây ném Heaving Line tiếp cận cầu cảng', icon: '🪢', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đưa dây đầu Head line & Dây đuôi Stern line', icon: '🚢', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Dây kéo xéo Spring line & Dây ép mạn Breast line', icon: '📐', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khẩu lệnh làm dây: Make fast, Heave away, Slack away', icon: '🗣️', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Vùng quất dây nguy hiểm Snap-back Zone', icon: '⚠️', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Lắp đặt đĩa chắn chuột Rat Guards trên dây buộc', icon: '🐀', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Lắp ráp thang hoa tiêu Pilot Ladder theo chuẩn SOLAS', icon: '🪜', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Thang kết hợp Combination Ladder khi mớn nước cao', icon: '🪜', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Dây vịn hoa tiêu Manropes & Phao cứu sinh có đèn', icon: '🛟', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đón hoa tiêu lên tàu Pilot Boarding Speed 6 knots', icon: '🚤', role: 'Thuyền trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Thao tác dây kéo tàu lai Tug Line & Tời cáp mũi', icon: '🚜', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Chằng buộc hàng hóa trên boong Cargo Lashing', icon: '⛓️', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Khóa gù container Twistlocks & Thanh chằng Lashing Bar', icon: '📦', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Vận hành tời boong Mooring Winch & Tang cuốn Tension', icon: '🎛️', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đo mớn nước tàu Draft Marks mũi, lái và giữa tàu', icon: '📏', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đo que thăm két nước dằn Sounding Ballast Tanks', icon: '💧', role: 'Sĩ quan phó hai' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đóng kín cửa kín nước Watertight Doors trước khi ra khơi', icon: '🚪', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Kiểm tra trạm xuồng cứu sinh Lifeboat Station', icon: '⛵', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Hạ xuồng cứu hộ khẩn cấp Rescue Boat Drill', icon: '🚤', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Pháo hiệu cứu sinh Pyrotechnics & Pháo dù Rocket Flare', icon: '🚀', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Tín hiệu khói cam cứu nạn Buoyant Smoke Signal', icon: '🟠', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Thiết bị phát đáp tìm kiếm cứu nạn Radar SART', icon: '📡', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Phao vô tuyến vệ tinh khẩn cấp EPIRB 406 MHz', icon: '🛰️', role: 'Sĩ quan phó ba' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Diễn tập người rơi xuống biển Man Overboard Drill', icon: '🏊', role: 'Thuyền trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Điều động quay tàu cứu người Williamson Turn', icon: '🔄', role: 'Sĩ quan phó hai' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Còi báo động chung General Emergency Alarm 7 ngắn 1 dài', icon: '🚨', role: 'Thuyền trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Mệnh lệnh tập trung Muster Station theo bảng phân công', icon: '📋', role: 'Sĩ quan an toàn' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đo nồng độ khí hầm hàng Gas Detection trước khi vào', icon: '💨', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Giấy phép vào không gian hầm hàng Enclosed Space', icon: '📝', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Thông gió hầm hàng Hold Ventilation chống đọng sương', icon: '🌪️', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Kê lót chèn hàng Dunnage & Gỗ chèn chống trượt', icon: '🪵', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Bơm nước dằn Ballasting & Xả nước dằn Deballasting', icon: '🌊', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Hệ thống khử trùng nước dằn tàu BWTS Treatment', icon: '🔬', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Bảo quản cẩu hàng boong tàu Deck Crane & Dây cáp', icon: '🏗️', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Trực ca an ninh cảng biển ISPS Gangway Watch', icon: '🛂', role: 'Sĩ quan an ninh (SSO)' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Kiểm tra thẻ khách lên xuống tàu Visitor ID Check', icon: '🪪', role: 'Thủy thủ trực ca' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Cảnh giới chống cướp biển Anti-Piracy Watch', icon: '🛡️', role: 'Sĩ quan an ninh' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Lắp đặt rào thép gai Razor Wire mạn tàu', icon: '⛓️', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Vận hành vòi rồng nước áp lực cao Water Cannon', icon: '💦', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đo hướng gió & Tốc độ gió Anemometer trên buồng lái', icon: '🌬️', role: 'Sĩ quan phó hai' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Cấp gió bão Beaufort Scale & Trạng thái mặt biển', icon: '🌊', role: 'Sĩ quan trực ca' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Chằng buộc chằng chống bão Heavy Weather Lashing', icon: '⛈️', role: 'Thủy thủ trưởng' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Bàn giao ca trực buồng lái Handover Nav Watch', icon: '🤝', role: 'Sĩ quan trực ca' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Ghi nhật ký hành trình boong Deck Logbook Entry', icon: '📖', role: 'Sĩ quan phó hai' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Kiểm tra sẵn sàng đón đoàn thanh tra PSC boong tàu', icon: '📋', role: 'Đại phó' },
    { rankTitle: 'Thủy thủ lái (Helmsman / AB)', title: 'Đạt chuẩn sát hạch Thủy thủ lái STCW II/5 (400 Từ)', icon: '⭐', role: 'Hội đồng Giám khảo STCW' }
  ];

  const topics = department === 'engine' ? engineTopics : deckTopics;

  topics.forEach((tInfo, idx) => {
    const stageNum = idx + 1;
    const nodeId = `${department}-rating-${stageNum}`;
    const termSlice: Term[] = [];
    const quizzes: QuizQuestion[] = [];

    // Fetch 5 specialized terms curated exactly for this topic
    const curatedTerms = getCuratedRatingTerms(department, stageNum, tInfo.title);

    for (let t = 0; t < curatedTerms.length; t++) {
      const v = curatedTerms[t];
      const uniqueTermId = `${nodeId}-t${t + 1}`;

      const parts = v.exampleEn.split(new RegExp(`(${v.word})`, 'i'));
      const before = parts[0] || 'Inspect and operate the';
      const after = parts.slice(2).join('') || 'in accordance with STCW standard procedures.';

      termSlice.push({
        id: uniqueTermId,
        word: v.word.toLowerCase(),
        phonetic: v.phonetic,
        meaning: v.meaningVi,
        example: v.exampleEn,
        sentenceBefore: before,
        sentenceAfter: after,
        vietnameseSentence: v.exampleVi,
        hint: v.hint,
        dots: 0,
        mastered: false
      });

      if (t < 2) {
        const otherOptions = curatedTerms
          .filter(o => o.word.toLowerCase() !== v.word.toLowerCase())
          .map(o => o.word.toLowerCase());

        const options = [v.word.toLowerCase(), ...otherOptions.slice(0, 3)].sort(() => 0.5 - Math.random());

        quizzes.push({
          id: `q-${uniqueTermId}`,
          prompt: `Thuật ngữ nào mang ý nghĩa: "${v.meaningVi}"?`,
          word: v.word.toLowerCase(),
          phonetic: v.phonetic,
          correctAnswer: v.word.toLowerCase(),
          options: options,
          explanation: `${v.word} (${v.phonetic}): ${v.meaningVi}. Ví dụ: ${v.exampleEn}`
        });
      }
    }

    nodes.push({
      id: nodeId,
      department: department,
      rankCategory: 'rating',
      rankTitle: tInfo.rankTitle,
      title: `Bài ${stageNum}: ${tInfo.title}`,
      icon: tInfo.icon,
      description: `Thuật ngữ nghiệp vụ Thủy thủ / Thợ máy STCW (Bài ${stageNum}/80): Học 5 từ vựng, luyện quiz và đối thoại cùng ${tInfo.role}.`,
      isUnlocked: idx === 0, // only first node unlocked initially
      stars: 0,
      terms: termSlice,
      quizzes: quizzes,
      roleplay: {
        partnerRole: tInfo.role,
        initialDialogue: `Rating seafarer, report the status of ${termSlice[0].word} and proceed with the assignment.`,
        systemPrompt: `You are ${tInfo.role} instructing a seafarer on ${tInfo.title}. Speak concise maritime English and give Vietnamese feedback.`
      }
    });
  });

  return nodes;
}

// ============================================================================
// ASSEMBLE FULL MARITIME CAREER PROGRESSION NODES (BASE + STCW EXPANSIONS + 400 RATING + INFINITE)
// ============================================================================

export function buildCompleteMaritimeTree(): LessonNode[] {
  // Generate 400 terms (80 nodes x 5 terms) for Rating tiers
  const ratingEngineNodes = generateRating400Curriculum('engine');
  const ratingDeckNodes = generateRating400Curriculum('deck');

  // Infinite sequence for unlimited ocean voyages
  const initialInfiniteEngine = generateInfiniteMaritimeNodes('engine', 0, 20);
  const initialInfiniteDeck = generateInfiniteMaritimeNodes('deck', 0, 20);

  const rawAll: LessonNode[] = [
    ...ratingEngineNodes,
    ...ratingDeckNodes,
    ...EXPANDED_MARITIME_NODES.filter(n => n.rankCategory !== 'rating'),
    ...ADDITIONAL_ENGINE_NODES.filter(n => n.rankCategory !== 'rating'),
    ...ADDITIONAL_DECK_NODES.filter(n => n.rankCategory !== 'rating'),
    ...initialInfiniteEngine,
    ...initialInfiniteDeck
  ];

  // Reorder nodes cleanly by Department and Rank progression
  const rankOrderEngine = [
    'Lau máy & Thực tập (Wiper & Cadet)',
    'Thợ máy (Motorman)',
    'Thợ máy & Tra dầu (Motorman & Oiler)',
    'Sĩ quan máy (3rd/2nd Engineer)',
    'Sĩ quan máy ba (3rd Engineer)',
    'Sĩ quan máy hai (2nd Engineer)',
    'Sĩ quan điện khí (Electro-Technical Officer - ETO)',
    'Máy trưởng (Chief Engineer)',
    'Hải trình Viễn dương Vô hạn (Infinite Engine Mastery)'
  ];

  const rankOrderDeck = [
    'Học viên & Thủy thủ OS (Cadet & Ordinary Seaman)',
    'Thủy thủ lái (Helmsman / AB)',
    'Thủy thủ lái & Thủy thủ trưởng (Able Seafarer & Bosun)',
    'Sĩ quan phó ba/phó hai (3rd/2nd Officer)',
    'Sĩ quan phó ba (3rd Officer - LSA & FFA)',
    'Sĩ quan phó hai (2nd Officer - Navigation & Passage Planning)',
    'Đại phó (Chief Officer - Cargo & Stability)',
    'Đại phó / Thuyền trưởng (Chief Mate / Master)',
    'Thuyền trưởng (Ship Master - Command & Vetting)',
    'Chỉ huy Toàn cầu Vô hạn (Infinite Global Command)'
  ];

  const engineNodes = rawAll.filter(n => n.department === 'engine').sort((a, b) => {
    const idxA = rankOrderEngine.indexOf(a.rankTitle);
    const idxB = rankOrderEngine.indexOf(b.rankTitle);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });

  const deckNodes = rawAll.filter(n => n.department === 'deck').sort((a, b) => {
    const idxA = rankOrderDeck.indexOf(a.rankTitle);
    const idxB = rankOrderDeck.indexOf(b.rankTitle);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });

  // Unlock first node of each department by default
  const sortedAll = [...engineNodes, ...deckNodes];
  return sortedAll.map((node, index, arr) => {
    const isFirstInDept = arr.findIndex(n => n.department === node.department) === index;
    return {
      ...node,
      isUnlocked: isFirstInDept,
      stars: 0
    };
  });
}
