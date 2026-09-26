export interface MaritimeGameDefinition {
  id: string;
  number: number;
  title: string;
  englishTitle: string;
  icon: string;
  badge: string;
  badgeColor: string;
  description: string;
  category: 'speed' | 'simulator' | 'emergency' | 'puzzle' | 'challenge';
  timeLimitSeconds: number;
  xpReward: number;
  coinReward: number;
  difficulty: 'Cơ bản' | 'Vận hành' | 'Chuyên sâu';
}

export const MARITIME_15_GAMES: MaritimeGameDefinition[] = [
  {
    id: 'game-1-duel',
    number: 1,
    title: 'Đấu Từ Vựng Tốc Độ',
    englishTitle: 'Maritime Vocabulary Duel',
    icon: '⚔️',
    badge: 'ĐỐI KHÁNG 15S',
    badgeColor: '#EF4444',
    description: 'Phản xạ chọn nghĩa tiếng Anh/tiếng Việt của thuật ngữ hàng hải trong 15 giây. Trả lời chuỗi combo liên hoàn!',
    category: 'speed',
    timeLimitSeconds: 15,
    xpReward: 35,
    coinReward: 10,
    difficulty: 'Cơ bản'
  },
  {
    id: 'game-2-vhf-radio',
    number: 2,
    title: 'Thử Thách Đài Vô Tuyến VHF',
    englishTitle: 'VHF Radio Challenge',
    icon: '📻',
    badge: 'SIMULATOR SMCP',
    badgeColor: '#3B82F6',
    description: 'Lắng nghe đài thoại VHF nhiễu sóng, phát hiện lỗi sai thủ tục và chọn câu đáp chuẩn IMO SMCP.',
    category: 'simulator',
    timeLimitSeconds: 25,
    xpReward: 50,
    coinReward: 15,
    difficulty: 'Vận hành'
  },
  {
    id: 'game-3-bridge-comm',
    number: 3,
    title: 'Khẩu Lệnh Lái Buồng Lái',
    englishTitle: 'Bridge Communication',
    icon: '🧭',
    badge: 'HELM ORDERS',
    badgeColor: '#10B981',
    description: 'Thực hiện chuỗi khẩu lệnh lái bánh lái (Port 10, Midships, Steady as she goes) và tay chuông máy Engine Telegraph.',
    category: 'simulator',
    timeLimitSeconds: 20,
    xpReward: 40,
    coinReward: 12,
    difficulty: 'Cơ bản'
  },
  {
    id: 'game-4-emergency-decision',
    number: 4,
    title: 'Quyết Định Khẩn Cấp',
    englishTitle: 'Emergency Decision',
    icon: '🚨',
    badge: 'SOLAS CRISIS',
    badgeColor: '#DC2626',
    description: 'Xử lý các sự cố sinh tử: Người rơi xuống biển (MOB), Cháy hầm hàng, Thủng vỏ tàu và Rời tàu (Abandon ship).',
    category: 'emergency',
    timeLimitSeconds: 30,
    xpReward: 60,
    coinReward: 20,
    difficulty: 'Chuyên sâu'
  },
  {
    id: 'game-5-engine-crisis',
    number: 5,
    title: 'Sự Cố Khẩn Cấp Buồng Máy',
    englishTitle: 'Engine Room Crisis',
    icon: '⚙️',
    badge: 'ENGINE ALARM',
    badgeColor: '#F59E0B',
    description: 'Chẩn đoán và xử lý báo động máy chính: Mất điện Blackout, Cháy khoang quét khí, Sụt áp dầu bôi trơn.',
    category: 'emergency',
    timeLimitSeconds: 25,
    xpReward: 55,
    coinReward: 18,
    difficulty: 'Chuyên sâu'
  },
  {
    id: 'game-6-word-builder',
    number: 6,
    title: 'Ghép Ký Tự Thuật Ngữ',
    englishTitle: 'Word Builder',
    icon: '🧩',
    badge: 'XẾP TỪ',
    badgeColor: '#8B5CF6',
    description: 'Sắp xếp các chữ cái xáo trộn thành từ vựng hàng hải chuẩn (ví dụ: B-E-D-P-L-A-T-E, E-C-D-I-S).',
    category: 'puzzle',
    timeLimitSeconds: 30,
    xpReward: 30,
    coinReward: 8,
    difficulty: 'Cơ bản'
  },
  {
    id: 'game-7-listen-catch',
    number: 7,
    title: 'Nghe & Bắt Thuật Ngữ',
    englishTitle: 'Listen & Catch',
    icon: '🎧',
    badge: 'AUDIO LISTENING',
    badgeColor: '#06B6D4',
    description: 'Nghe phát âm chuẩn giọng hàng hải quốc tế trên nền âm thanh buồng máy/gió biển và bắt chính xác từ vừa đọc.',
    category: 'speed',
    timeLimitSeconds: 20,
    xpReward: 40,
    coinReward: 12,
    difficulty: 'Vận hành'
  },
  {
    id: 'game-8-word-race',
    number: 8,
    title: 'Đua Gõ Chính Tả Hàng Hải',
    englishTitle: 'Spelling Word Race',
    icon: '🏎️',
    badge: 'ĐUA TỐC ĐỘ',
    badgeColor: '#EC4899',
    description: 'Gõ đúng chính tả thuật ngữ tiếng Anh theo gợi ý định nghĩa trước khi kim đồng hồ chạm vạch đích.',
    category: 'speed',
    timeLimitSeconds: 25,
    xpReward: 45,
    coinReward: 15,
    difficulty: 'Vận hành'
  },
  {
    id: 'game-9-matching-pairs',
    number: 9,
    title: 'Ghép Cặp Thuật Ngữ',
    englishTitle: 'Matching Pairs',
    icon: '🔗',
    badge: 'NỐI CẶP',
    badgeColor: '#14B8A6',
    description: 'Nối các thẻ thuật ngữ tiếng Anh với ý nghĩa tiếng Việt hoặc thiết bị hàng hải tương ứng.',
    category: 'puzzle',
    timeLimitSeconds: 40,
    xpReward: 40,
    coinReward: 12,
    difficulty: 'Cơ bản'
  },
  {
    id: 'game-10-memory',
    number: 10,
    title: 'Trí Nhớ Hàng Hải',
    englishTitle: 'Maritime Memory Flip',
    icon: '🃏',
    badge: 'LẬT THẺ TRÍ NHỚ',
    badgeColor: '#6366F1',
    description: 'Lật tìm các cặp thẻ bài tương đồng về hệ thống máy, thiết bị buồng lái và phao tiêu AtoN.',
    category: 'puzzle',
    timeLimitSeconds: 45,
    xpReward: 35,
    coinReward: 10,
    difficulty: 'Cơ bản'
  },
  {
    id: 'game-11-sentence-builder',
    number: 11,
    title: 'Xếp Câu Chuẩn IMO SMCP',
    englishTitle: 'Sentence Builder',
    icon: '📐',
    badge: 'CẤU TRÚC SMCP',
    badgeColor: '#0EA5E9',
    description: 'Sắp xếp các khối từ thành câu chuẩn 8 mẫu thông điệp: Instruction, Warning, Advice, Question...',
    category: 'simulator',
    timeLimitSeconds: 35,
    xpReward: 50,
    coinReward: 15,
    difficulty: 'Vận hành'
  },
  {
    id: 'game-12-escape-room',
    number: 12,
    title: 'Thoát Hiểm Buồng Máy',
    englishTitle: 'Maritime Escape Room',
    icon: '🚪',
    badge: 'GIẢI ĐỐ AN TOÀN',
    badgeColor: '#F97316',
    description: 'Giải mã mật mã van đường ống, kiểm tra áp suất bình tích khí và mở khóa cửa thoát hiểm khẩn cấp.',
    category: 'puzzle',
    timeLimitSeconds: 60,
    xpReward: 70,
    coinReward: 25,
    difficulty: 'Chuyên sâu'
  },
  {
    id: 'game-13-captain-decision',
    number: 13,
    title: 'Quyết Định Của Thuyền Trưởng',
    englishTitle: "Captain's Decision",
    icon: '👑',
    badge: 'MASTER COMMAND',
    badgeColor: '#7C3AED',
    description: 'Đối mặt các tình huống cân não: Đón hoa tiêu bão to, tranh chấp vận đơn hàng hóa, tiếp đón thanh tra PSC.',
    category: 'simulator',
    timeLimitSeconds: 45,
    xpReward: 65,
    coinReward: 22,
    difficulty: 'Chuyên sâu'
  },
  {
    id: 'game-14-daily-challenge',
    number: 14,
    title: 'Nhiệm Vụ Hàng Hải Hàng Ngày',
    englishTitle: 'Daily Maritime Challenge',
    icon: '🎯',
    badge: 'HÀNG NGÀY',
    badgeColor: '#22C55E',
    description: 'Bộ 3 thử thách ngẫu nhiên mỗi ngày giúp duy trì ngọn lửa chuỗi ngày Streak và nhân đôi XP.',
    category: 'challenge',
    timeLimitSeconds: 60,
    xpReward: 80,
    coinReward: 30,
    difficulty: 'Vận hành'
  },
  {
    id: 'game-15-weekly-league',
    number: 15,
    title: 'Giải Đấu Xếp Hạng Hàng Tuần',
    englishTitle: 'Weekly Seafarer League',
    icon: '🏆',
    badge: 'ĐUA TOP LEAGUE',
    badgeColor: '#EAB308',
    description: 'Thi đấu leo rank giữa các thuyền viên: Hạng Đồng, Bạc, Vàng, Kim Cương và Bậc Thầy Viễn Dương.',
    category: 'challenge',
    timeLimitSeconds: 90,
    xpReward: 100,
    coinReward: 50,
    difficulty: 'Chuyên sâu'
  }
];

// Interactive Duel Question Database
export interface DuelQuestion {
  id: string;
  prompt: string;
  targetTerm: string;
  phonetic: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

export const SAMPLE_DUEL_QUESTIONS: DuelQuestion[] = [
  {
    id: 'dq-1',
    prompt: 'Khẩu lệnh "Hard-a-port" có nghĩa là gì?',
    targetTerm: 'Hard-a-port',
    phonetic: '/ˌhɑːd.əˈpɔːt/',
    correctAnswer: 'Lái hết sang mạn trái',
    options: ['Lái hết sang mạn trái', 'Lái hết sang mạn phải', 'Bánh lái về giữa', 'Giữ nguyên hướng mũi tàu'],
    explanation: 'Hard-a-port là khẩu lệnh bẻ hết góc lái sang mạn trái (khoảng 35 độ).'
  }
];

export const GAME_SPECIFIC_QUESTIONS: Record<string, DuelQuestion[]> = {
  'game-1-duel': [
    {
      id: 'g1-1',
      prompt: 'Thuật ngữ "Under-Keel Clearance (UKC)" có ý nghĩa gì?',
      targetTerm: 'Under-Keel Clearance',
      phonetic: '/ˈʌn.də kiːl ˈklɪə.rəns/',
      correctAnswer: 'Khoảng hở an toàn từ đáy tàu đến đáy biển',
      options: ['Khoảng hở an toàn từ đáy tàu đến đáy biển', 'Chiều cao tĩnh không của cột buồm', 'Mạn khô tối thiểu của tàu', 'Chiều sâu mớn nước tĩnh'],
      explanation: 'Under-Keel Clearance (UKC) là độ sâu an toàn tối thiểu tính từ mặt đáy sống tàu đến đáy biển.'
    },
    {
      id: 'g1-2',
      prompt: 'Trọng tải toàn phần của tàu chở hàng được gọi là:',
      targetTerm: 'Deadweight Tonnage',
      phonetic: '/ˈded.weɪt ˈtʌn.ɪdʒ/',
      correctAnswer: 'Deadweight Tonnage (DWT)',
      options: ['Deadweight Tonnage (DWT)', 'Gross Tonnage (GT)', 'Net Tonnage (NT)', 'Lightship Weight'],
      explanation: 'DWT là tổng tải trọng tối đa tàu có thể chở (hàng, nhiên liệu, nước ngọt, thuyền viên).'
    },
    {
      id: 'g1-3',
      prompt: 'Lực kéo tối đa của tàu lai dắt hỗ trợ cập cầu được đo bằng:',
      targetTerm: 'Bollard Pull',
      phonetic: '/ˈbɒl.əd pʊl/',
      correctAnswer: 'Bollard Pull (tấn)',
      options: ['Bollard Pull (tấn)', 'Horsepower (HP)', 'Shaft Torque', 'Displacement (tấn)'],
      explanation: 'Bollard Pull là lực kéo tĩnh liên tục lớn nhất mà tàu lai tạo ra khi thử nghiệm buộc bít.'
    },
    {
      id: 'g1-4',
      prompt: 'Chân vịt mũi giúp đẩy ngang hỗ trợ tàu cập cầu gọi là:',
      targetTerm: 'Bow Thruster',
      phonetic: '/baʊ ˈθrʌs.tər/',
      correctAnswer: 'Bow Thruster',
      options: ['Bow Thruster', 'Main Propeller', 'Rudder Blade', 'Stern Anchor'],
      explanation: 'Bow Thruster là động cơ chân vịt nằm ngang ở khoang mũi giúp xoay mũi tàu linh hoạt.'
    },
    {
      id: 'g1-5',
      prompt: 'Thước đo mớn nước được khắc/sơn ở mũi, lái và giữa tàu gọi là:',
      targetTerm: 'Draft Marks',
      phonetic: '/drɑːft mɑːks/',
      correctAnswer: 'Draft Marks',
      options: ['Draft Marks', 'Plimsoll Line', 'Freeboard Mark', 'Load Line'],
      explanation: 'Draft marks là các chữ số đo chiều sâu chìm của tàu trong nước (hệ mét hoặc feet).'
    }
  ],
  'game-2-vhf-radio': [
    {
      id: 'g2-1',
      prompt: 'Khi muốn đài đối diện nhắc lại toàn bộ tin nhắn VHF, mẫu chuẩn IMO SMCP là:',
      targetTerm: 'Say again',
      phonetic: '/seɪ əˈɡen/',
      correctAnswer: 'Say again',
      options: ['Say again', 'Repeat please', 'What did you say', 'Speak louder'],
      explanation: 'Trong quy chuẩn IMO SMCP, tuyệt đối dùng "Say again", không dùng "Repeat" (vì Repeat dùng cho hiệu chỉnh pháo binh).'
    },
    {
      id: 'g2-2',
      prompt: 'Kênh VHF Marine quốc tế trực canh 24/24 về cấp cứu và an toàn sinh mạng:',
      targetTerm: 'Channel 16',
      phonetic: '/ˈtʃæn.əl sɪksˈtiːn/',
      correctAnswer: 'VHF Kênh 16 (156.8 MHz)',
      options: ['VHF Kênh 16 (156.8 MHz)', 'VHF Kênh 12', 'VHF Kênh 06', 'VHF Kênh 70'],
      explanation: 'Kênh 16 là kênh thoại quốc tế bắt buộc phải trực canh liên tục theo Công ước SOLAS.'
    },
    {
      id: 'g2-3',
      prompt: 'Từ khóa mở đầu bản tin cảnh báo thời tiết xấu, chướng ngại vật trôi dạt trên VHF:',
      targetTerm: 'Securite',
      phonetic: '/seɪˈkjʊə.rɪ.teɪ/',
      correctAnswer: 'Sécurité Sécurité Sécurité',
      options: ['Sécurité Sécurité Sécurité', 'Mayday Mayday Mayday', 'Pan-Pan Pan-Pan', 'Urgent Urgent'],
      explanation: 'Sécurité được phát 3 lần để cảnh báo an toàn hàng hải hoặc thông báo khí tượng nguy hiểm.'
    },
    {
      id: 'g2-4',
      prompt: 'Quy chuẩn kết thúc lượt nói và chuyển quyền phát sóng cho đài đối tác:',
      targetTerm: 'Over',
      phonetic: '/ˈəʊ.vər/',
      correctAnswer: 'Over',
      options: ['Over', 'Out', 'Over and Out', 'Finished'],
      explanation: 'Dùng "Over" khi chờ câu trả lời. Chỉ dùng "Out" khi chấm dứt hoàn toàn liên lạc.'
    },
    {
      id: 'g2-5',
      prompt: 'Sau khi nghe mệnh lệnh từ VTS/Cảng, câu trả lời xác nhận tuân thủ chuẩn SMCP là:',
      targetTerm: 'Understood. I will comply',
      phonetic: '/ˌʌn.dəˈstʊd aɪ wɪl kəmˈplaɪ/',
      correctAnswer: 'Understood. I will comply',
      options: ['Understood. I will comply', 'OK I do it', 'Roger that friend', 'Yes Sir copy'],
      explanation: '"Understood. I will comply" là câu đối đáp tiêu chuẩn thể hiện đã hiểu rõ và sẽ thực hiện ngay.'
    }
  ],
  'game-3-bridge-comm': [
    {
      id: 'g3-1',
      prompt: 'Khẩu lệnh lái buồng lái "Midships" yêu cầu Thủy thủ lái làm gì?',
      targetTerm: 'Midships',
      phonetic: '/ˈmɪd.ʃɪps/',
      correctAnswer: 'Đưa góc bánh lái về vị trí 0 độ (giữa tàu)',
      options: ['Đưa góc bánh lái về vị trí 0 độ (giữa tàu)', 'Bẻ lái hết sang mạn trái', 'Bẻ lái hết sang mạn phải', 'Giữ nguyên tốc độ máy'],
      explanation: '"Midships" nghĩa là đặt góc lệch bánh lái về vị trí số 0 thẳng hàng với ky tàu.'
    },
    {
      id: 'g3-2',
      prompt: 'Khi nghe khẩu lệnh "Steady as she goes", thao tác của Thủy thủ lái là:',
      targetTerm: 'Steady as she goes',
      phonetic: '/ˈsted.i əz ʃiː ɡəʊz/',
      correctAnswer: 'Giữ ổn định hướng mũi tàu ngay tại thời điểm nhận lệnh',
      options: ['Giữ ổn định hướng mũi tàu ngay tại thời điểm nhận lệnh', 'Bẻ lái gấp về mạn phải', 'Tăng tốc độ máy chính', 'Thả trôi tự do'],
      explanation: 'Lập tức đọc to hướng la bàn hiện tại và giữ mũi tàu chạy ổn định theo đúng hướng đó.'
    },
    {
      id: 'g3-3',
      prompt: 'Khẩu lệnh "Hard-a-starboard" có nghĩa là:',
      targetTerm: 'Hard-a-starboard',
      phonetic: '/ˌhɑːd.əˈstɑː.bəd/',
      correctAnswer: 'Bẻ hết góc bánh lái sang mạn phải (khoảng 35°)',
      options: ['Bẻ hết góc bánh lái sang mạn phải (khoảng 35°)', 'Bẻ lái sang mạn trái 10 độ', 'Lái giữa bánh lái', 'Giảm góc lái sang phải'],
      explanation: 'Hard-a-starboard là bẻ hết biên độ góc quay bánh lái sang mạn phải.'
    },
    {
      id: 'g3-4',
      prompt: 'Lệnh tay chuông máy "Dead Slow Ahead" trên cần truyền lệnh có nghĩa:',
      targetTerm: 'Dead Slow Ahead',
      phonetic: '/ded sləʊ əˈhed/',
      correctAnswer: 'Máy tiến thật chậm',
      options: ['Máy tiến thật chậm', 'Máy tiến chậm', 'Máy tiến nửa tốc độ', 'Máy tiến hết tốc độ'],
      explanation: 'Dead Slow Ahead là cấp tốc độ thấp nhất của tay chuông truyền lệnh buồng lái xuống máy.'
    },
    {
      id: 'g3-5',
      prompt: 'Khẩu lệnh "Ease the rudder to 5" nghĩa là:',
      targetTerm: 'Ease the rudder',
      phonetic: '/iːz ðə ˈrʌd.ər/',
      correctAnswer: 'Giảm bớt góc bánh lái về còn 5 độ',
      options: ['Giảm bớt góc bánh lái về còn 5 độ', 'Tăng góc lái lên 5 độ nữa', 'Trả lái về 0 độ', 'Khóa cố định bánh lái'],
      explanation: '"Ease" nghĩa là giảm dần độ bẻ lái để tàu không bị lượn quán tính quá mức.'
    }
  ],
  'game-4-emergency-decision': [
    {
      id: 'g4-1',
      prompt: 'Tín hiệu báo động sự cố người rơi xuống biển (MOB) theo chuẩn SOLAS:',
      targetTerm: 'Man Overboard Signal',
      phonetic: '/mæn ˈəʊ.və.bɔːd/',
      correctAnswer: 'Ba hồi còi dài liên tục (— — —)',
      options: ['Ba hồi còi dài liên tục (— — —)', 'Bảy ngắn một dài (••••••• —)', 'Một hồi còi dài liên tục', 'Chuông reo liên hồi'],
      explanation: 'Tín hiệu MOB quốc tế là 3 hồi còi dài phát trên còi tàu và hệ thống báo động chung.'
    },
    {
      id: 'g4-2',
      prompt: 'Hành động phản xạ đầu tiên khi thấy người ngã xuống biển mạn phải (Starboard):',
      targetTerm: 'Throw Lifebuoy',
      phonetic: '/θrəʊ ˈlaɪf.bɔɪ/',
      correctAnswer: 'Ném phao tròn cứu sinh có đèn/khói và bẻ hết lái sang mạn phải',
      options: ['Ném phao tròn cứu sinh có đèn/khói và bẻ hết lái sang mạn phải', 'Bẻ hết lái sang mạn trái', 'Lùi máy khẩn cấp ngay', 'Gọi điện thoại cho gia đình'],
      explanation: 'Bẻ lái cùng bên người rơi để đuôi tàu và chân vịt văng ra xa, tránh hút chém nạn nhân.'
    },
    {
      id: 'g4-3',
      prompt: 'Tín hiệu báo động toàn thể thuyền viên tập trung rời tàu (Abandon Ship):',
      targetTerm: 'General Emergency Alarm',
      phonetic: '/əˈbæn.dən ʃɪp/',
      correctAnswer: 'Bảy tiếng ngắn kèm một tiếng dài (••••••• —)',
      options: ['Bảy tiếng ngắn kèm một tiếng dài (••••••• —)', 'Ba tiếng dài liên tục', 'Hai tiếng dài ngắt quãng', 'Còi hụ liên tục 1 phút'],
      explanation: 'Bảy hồi ngắn một hồi dài là báo động tập trung sự cố khẩn cấp / rời tàu quốc tế.'
    },
    {
      id: 'g4-4',
      prompt: 'Thiết bị tự nổi phát tín hiệu cấp cứu vệ tinh 406 MHz khi tàu chìm hoàn toàn:',
      targetTerm: 'EPIRB',
      phonetic: '/ˈiː.pɜːb/',
      correctAnswer: 'Phao vô tuyến chỉ vị trí sự cố EPIRB',
      options: ['Phao vô tuyến chỉ vị trí sự cố EPIRB', 'Bộ phát đáp Radar SART', 'Máy bộ đàm VHF hai chiều', 'Bộ kích nổ pháo hiệu'],
      explanation: 'EPIRB tự nhả bằng ngàm thủy tĩnh (Hydrostatic Release) ở độ sâu 2-4m và phát tín hiệu cứu nạn vệ tinh.'
    },
    {
      id: 'g4-5',
      prompt: 'Bộ phản xạ Radar SART hiển thị hình ảnh gì trên màn hình Radar cứu nạn?',
      targetTerm: 'SART Response',
      phonetic: '/sɑːt rɪˈspɒns/',
      correctAnswer: 'Một hàng gồm 12 chấm sáng (hoặc vòng cung) kéo dài',
      options: ['Một hàng gồm 12 chấm sáng (hoặc vòng cung) kéo dài', 'Một hình tam giác nhấp nháy đỏ', 'Hai vệt sáng chữ thập', 'Một vòng tròn bao quanh tâm'],
      explanation: 'SART phát tín hiệu tạo thành chuỗi 12 chấm sáng chỉ rõ hướng và khoảng cách vị trí nạn nhân.'
    }
  ],
  'game-5-engine-crisis': [
    {
      id: 'g5-1',
      prompt: 'Khi buồng máy bị mất điện hoàn toàn (Blackout), thao tác cấp bách đầu tiên là:',
      targetTerm: 'Blackout Recovery',
      phonetic: '/ˈblæk.aʊt rɪˈkʌv.ər.i/',
      correctAnswer: 'Khởi động máy phát khẩn cấp và cấp điện cho bảng điện sự cố',
      options: ['Khởi động máy phát khẩn cấp và cấp điện cho bảng điện sự cố', 'Bơm thêm dầu đốt vào máy chính', 'Mở toàn bộ cửa thông gió buồng máy', 'Khởi động máy lọc dầu ly tâm'],
      explanation: 'Cần duy trì nguồn điện khẩn cấp cho hệ thống máy lái, chiếu sáng sự cố và bơm cứu hỏa.'
    },
    {
      id: 'g5-2',
      prompt: 'Sự cố "Scavenge Fire" (cháy khoang quét khí) trong động cơ 2 kỳ cần xử lý:',
      targetTerm: 'Scavenge Fire Procedure',
      phonetic: '/ˈskæv.ɪndʒ faɪər/',
      correctAnswer: 'Giảm tải máy chính, cắt nhiên liệu xylanh cháy, xả khí CO2/hơi nước dập lửa',
      options: ['Giảm tải máy chính, cắt nhiên liệu xylanh cháy, xả khí CO2/hơi nước dập lửa', 'Tăng hết tốc độ để thổi tắt ngọn lửa', 'Mở nắp cửa khoang quét ra dập bằng bình bột', 'Dừng nước làm mát máy'],
      explanation: 'Tuyệt đối không mở cửa khoang quét khi đang nóng vì không khí tràn vào sẽ gây nổ bùng dữ dội.'
    },
    {
      id: 'g5-3',
      prompt: 'Khi chuông báo động sương dầu cacte (Oil Mist Detector High) kêu vang:',
      targetTerm: 'Crankcase Explosion Risk',
      phonetic: '/ɔɪl mɪst dɪˈtek.tər/',
      correctAnswer: 'Giảm tải máy ngay, không mở cửa cacte ít nhất 20-30 phút',
      options: ['Giảm tải máy ngay, không mở cửa cacte ít nhất 20-30 phút', 'Mở ngay cửa cacte ra quạt gió', 'Đổ nước lạnh vào trục khuỷu', 'Tăng áp lực bơm dầu bôi trơn'],
      explanation: 'Sương dầu gặp điểm nóng có thể nổ cacte nếu mở cửa buồng cacte cho oxy lọt vào.'
    },
    {
      id: 'g5-4',
      prompt: 'Khi áp suất dầu nhờn bôi trơn máy chính (LO Pressure) giảm dưới giới hạn an toàn:',
      targetTerm: 'Low Lube Oil Pressure',
      phonetic: '/ləʊ luːb ɔɪl ˈpreʃ.ər/',
      correctAnswer: 'Hệ thống tự động kích hoạt giảm tải hoặc dừng máy khẩn cấp (Auto Slowdown/Shutdown)',
      options: ['Hệ thống tự động kích hoạt giảm tải hoặc dừng máy khẩn cấp (Auto Slowdown/Shutdown)', 'Máy chính tự động tăng tốc độ', 'Hệ thống xả khí nén ra ngoài', 'Bật máy sưởi dầu nhờn'],
      explanation: 'Thiếu dầu nhờn sẽ gây bó kẹt bạc trục và phá hủy toàn bộ trục khuỷu máy chính trong tích tắc.'
    },
    {
      id: 'g5-5',
      prompt: 'Bộ tách dầu nước la-canh (OWS) chỉ cho phép thải nước ra biển khi hàm lượng dầu:',
      targetTerm: '15 ppm Bilge Alarm',
      phonetic: '/fɪfˈtiːn piː piː em/',
      correctAnswer: 'Dưới 15 ppm (Parts Per Million) theo MARPOL Annex I',
      options: ['Dưới 15 ppm (Parts Per Million) theo MARPOL Annex I', 'Dưới 50 ppm', 'Dưới 100 ppm', 'Dưới 5 ppm'],
      explanation: 'Thiết bị OWS bắt buộc có đồng hồ đo dầu 15ppm và van hồi lưu tự động ngắt xả khi vượt chuẩn.'
    }
  ],
  'game-6-word-builder': [
    {
      id: 'g6-1',
      prompt: 'Thuật ngữ ghép từ "C-R-A-N-K-S-H-A-F-T" là chi tiết cơ khí gì?',
      targetTerm: 'Crankshaft',
      phonetic: '/ˈkræŋk.ʃɑːft/',
      correctAnswer: 'Trục khuỷu động cơ đốt trong',
      options: ['Trục khuỷu động cơ đốt trong', 'Trục chân vịt tàu', 'Trục cam dẫn động van', 'Thanh truyền piston'],
      explanation: 'Crankshaft biến chuyển động tịnh tiến của piston thành chuyển động quay tròn tạo công suất.'
    },
    {
      id: 'g6-2',
      prompt: 'Thuật ngữ "T-U-R-B-O-C-H-A-R-G-E-R" chỉ trang bị máy nào?',
      targetTerm: 'Turbocharger',
      phonetic: '/ˈtɜː.bəʊˌtʃɑː.dʒər/',
      correctAnswer: 'Tua-bin tăng áp khí xả',
      options: ['Tua-bin tăng áp khí xả', 'Bơm cao áp nhiên liệu', 'Máy sinh hàn khí quét', 'Bộ sấy dầu đốt'],
      explanation: 'Turbocharger tận dụng năng lượng dòng khí xả để nén không khí nạp vào buồng đốt.'
    },
    {
      id: 'g6-3',
      prompt: 'Từ vựng "E-C-D-I-S" trên buồng lái là viết tắt của:',
      targetTerm: 'ECDIS',
      phonetic: '/ˈek.dɪs/',
      correctAnswer: 'Hệ thống Hải đồ điện tử và Thông tin hàng hải',
      options: ['Hệ thống Hải đồ điện tử và Thông tin hàng hải', 'Hệ thống nhận dạng tự động tàu', 'Hệ thống hoa tiêu định vị vệ tinh', 'Hệ thống cảnh báo va chạm tự động'],
      explanation: 'Electronic Chart Display and Information System - Thiết bị hải đồ dẫn đường bắt buộc theo IMO.'
    },
    {
      id: 'g6-4',
      prompt: 'Thiết bị cứu sinh "E-E-B-D" trong buồng máy nghĩa là:',
      targetTerm: 'EEBD',
      phonetic: '/iː.iː.biːˈdiː/',
      correctAnswer: 'Thiết bị trợ thở thoát hiểm khẩn cấp (Emergency Escape Breathing Device)',
      options: ['Thiết bị trợ thở thoát hiểm khẩn cấp (Emergency Escape Breathing Device)', 'Bình chữa cháy bọt tự động', 'Mặt nạ phòng độc khói lạnh', 'Bộ đàm cứu hộ khẩn cấp'],
      explanation: 'EEBD dùng cung cấp khí thở tối thiểu 10 phút để người trong buồng máy thoát ra ngoài.'
    },
    {
      id: 'g6-5',
      prompt: 'Từ vựng "B-E-D-P-L-A-T-E" chỉ bộ phận nào của động cơ diesel tàu thủy?',
      targetTerm: 'Bedplate',
      phonetic: '/ˈbed.pleɪt/',
      correctAnswer: 'Bệ máy / Tấm đế đỡ trục khuỷu',
      options: ['Bệ máy / Tấm đế đỡ trục khuỷu', 'Nắp xilanh buồng đốt', 'Áo nước làm mát xilanh', 'Thanh chống rung động cơ'],
      explanation: 'Bedplate là kết cấu thép đúc chịu toàn bộ tải trọng tĩnh và động của động cơ chính.'
    }
  ],
  'game-7-listen-catch': [
    {
      id: 'g7-1',
      prompt: 'Nghe phát âm chuẩn: /ˌdʒaɪ.rəʊ ˈkʌm.pəs/ - Đây là thiết bị hàng hải nào?',
      targetTerm: 'Gyrocompass',
      phonetic: '/ˌdʒaɪ.rəʊ ˈkʌm.pəs/',
      correctAnswer: 'La bàn con quay (Gyrocompass)',
      options: ['La bàn con quay (Gyrocompass)', 'La bàn từ tính (Magnetic compass)', 'Hệ thống lái tự động (Autopilot)', 'Máy đo sâu hồi âm (Echo sounder)'],
      explanation: 'Gyrocompass chỉ hướng bắc thực độc lập với từ trường trái đất nhờ con quay hồi chuyển.'
    },
    {
      id: 'g7-2',
      prompt: 'Nghe phát âm: /ˈkæp.stən/ - Thiết bị trên boong dùng để làm gì?',
      targetTerm: 'Capstan',
      phonetic: '/ˈkæp.stən/',
      correctAnswer: 'Tời đứng kéo dây buộc tàu',
      options: ['Tời đứng kéo dây buộc tàu', 'Tời kéo xích neo mạn', 'Cần cẩu bốc dỡ hàng', 'Ống dẫn xích neo'],
      explanation: 'Capstan là tời có trục quay thẳng đứng dùng để kéo dây khi tàu ra vào cầu bến.'
    },
    {
      id: 'g7-3',
      prompt: 'Nghe phát âm: /ˈpɪs.tən krɒs.hed/ trong động cơ 2 kỳ là:',
      targetTerm: 'Crosshead',
      phonetic: '/ˈkrɒs.hed/',
      correctAnswer: 'Con trượt / Đầu chữ thập (Crosshead)',
      options: ['Con trượt / Đầu chữ thập (Crosshead)', 'Trục cam xúp-páp', 'Bánh đà động cơ', 'Vòi phun nhiên liệu'],
      explanation: 'Crosshead chịu lực ngang của thanh truyền, giúp cần piston chỉ chuyển động tịnh tiến thẳng đứng.'
    },
    {
      id: 'g7-4',
      prompt: 'Nghe phát âm: /ˈbɪldʒ ˌwɔː.tər ˌsep.ər.eɪ.tər/ dùng cho hệ thống nào?',
      targetTerm: 'Oily Water Separator',
      phonetic: '/ˈbɪldʒ ˌwɔː.tər ˌsep.ər.eɪ.tər/',
      correctAnswer: 'Máy phân ly nước lẫn dầu đáy tàu (OWS)',
      options: ['Máy phân ly nước lẫn dầu đáy tàu (OWS)', 'Hệ thống khử muối nước biển', 'Lò hơi phụ đốt dầu', 'Bơm nước dằn ballast'],
      explanation: 'Hệ thống lọc tách dầu ra khỏi nước la-canh buồng máy trước khi xả ra môi trường biển.'
    },
    {
      id: 'g7-5',
      prompt: 'Nghe phát âm: /ˈmʊə.rɪŋ laɪnz/ - Thuyền viên sử dụng khi nào?',
      targetTerm: 'Mooring lines',
      phonetic: '/ˈmʊə.rɪŋ laɪnz/',
      correctAnswer: 'Dây buộc tàu cập cầu bến',
      options: ['Dây buộc tàu cập cầu bến', 'Dây kéo tàu khẩn cấp', 'Dây kéo phao cứu sinh', 'Dây chằng buộc container'],
      explanation: 'Mooring lines gồm dây dọc mũi/lái, dây ngang và dây chéo giữ tàu cố định tại bến cảng.'
    }
  ],
  'game-8-word-race': [
    {
      id: 'g8-1',
      prompt: 'Chính tả chuẩn xác của từ "Trụ bít buộc dây trên boong tàu":',
      targetTerm: 'Bollard',
      phonetic: '/ˈbɒl.əd/',
      correctAnswer: 'Bollard',
      options: ['Bollard', 'Bollart', 'Ballard', 'Bolerd'],
      explanation: 'Bollard là trụ thép đúc hình chữ U đôi hoặc trụ đơn gắn chặt vào boong tàu để buộc dây.'
    },
    {
      id: 'g8-2',
      prompt: 'Chính tả chuẩn của "Bơm hút khô la-canh đáy tàu":',
      targetTerm: 'Bilge pump',
      phonetic: '/bɪldʒ pʌmp/',
      correctAnswer: 'Bilge pump',
      options: ['Bilge pump', 'Bieldge pump', 'Bilj pump', 'Bylge pump'],
      explanation: 'Bilge pump là bơm hút cặn nước dồn về các giếng la-canh khoang đáy.'
    },
    {
      id: 'g8-3',
      prompt: 'Chính tả chuẩn của thuật ngữ "Góc nghiêng ngang của tàu do sóng gió tạm thời":',
      targetTerm: 'Heel',
      phonetic: '/hiːl/',
      correctAnswer: 'Heel',
      options: ['Heel', 'List', 'Trim', 'Draft'],
      explanation: 'Heel là góc nghiêng động tạm thời do ngoại lực; còn List là nghiêng tĩnh do xếp hàng lệch.'
    },
    {
      id: 'g8-4',
      prompt: 'Chính tả chuẩn của "Hệ số mạn khô tự do trên mực nước":',
      targetTerm: 'Freeboard',
      phonetic: '/ˈfriː.bɔːd/',
      correctAnswer: 'Freeboard',
      options: ['Freeboard', 'Freebord', 'Freboard', 'Freebaord'],
      explanation: 'Freeboard là khoảng cách đo từ mép boong trên cùng xuống đến đường mớn nước hiện tại.'
    },
    {
      id: 'g8-5',
      prompt: 'Chính tả chuẩn của "Máy tời kéo neo mạn mũi":',
      targetTerm: 'Windlass',
      phonetic: '/ˈwɪnd.ləs/',
      correctAnswer: 'Windlass',
      options: ['Windlass', 'Windlas', 'Windles', 'Winlass'],
      explanation: 'Windlass là máy tời có bánh sao (cable lifter) ăn khớp với xích neo để thả và kéo neo.'
    }
  ],
  'game-9-matching-pairs': [
    {
      id: 'g9-1',
      prompt: 'Ghép cặp thuật ngữ: "Fairlead" tương ứng với trang bị boong nào?',
      targetTerm: 'Fairlead',
      phonetic: '/ˈfeə.liːd/',
      correctAnswer: 'Con lăn / Lỗ dẫn hướng dây buộc tàu',
      options: ['Con lăn / Lỗ dẫn hướng dây buộc tàu', 'Trụ bít buộc dây', 'Ống dẫn xích neo', 'Thang mạn hoa tiêu'],
      explanation: 'Fairlead giúp dẫn hướng dây buộc tàu trơn tru, giảm ma sát và chống sờn rách mép boong.'
    },
    {
      id: 'g9-2',
      prompt: 'Ghép cặp: "Purifier" trong buồng máy tương ứng với chức năng:',
      targetTerm: 'Purifier',
      phonetic: '/ˈpjʊə.rɪ.faɪ.ər/',
      correctAnswer: 'Máy lọc ly tâm tách cặn bẩn và nước ra khỏi nhiên liệu/dầu nhờn',
      options: ['Máy lọc ly tâm tách cặn bẩn và nước ra khỏi nhiên liệu/dầu nhờn', 'Bơm nước ngọt sinh hoạt', 'Máy nén khí khởi động', 'Bình ngưng tụ hơi nước'],
      explanation: 'Purifier quay với tốc độ cực cao (hàng ngàn vòng/phút) tạo lực ly tâm tách nước và tạp chất nặng.'
    },
    {
      id: 'g9-3',
      prompt: 'Ghép cặp: "Rudder stock" tương ứng với bộ phận nào?',
      targetTerm: 'Rudder stock',
      phonetic: '/ˈrʌd.ər stɒk/',
      correctAnswer: 'Trục lái kết nối máy lái với tấm bánh lái',
      options: ['Trục lái kết nối máy lái với tấm bánh lái', 'Trục chân vịt chính', 'Ty van mở ống xả', 'Cần piston động cơ'],
      explanation: 'Rudder stock là trục thép đặc truyền lực xoay mô-men từ buồng máy lái xuống bánh lái ngoài vỏ tàu.'
    },
    {
      id: 'g9-4',
      prompt: 'Ghép cặp: "Flywheel" gắn ở đuôi trục khuỷu có nhiệm vụ:',
      targetTerm: 'Flywheel',
      phonetic: '/ˈflaɪ.wiːl/',
      correctAnswer: 'Bánh đà tích lũy động năng giúp máy quay êm đều',
      options: ['Bánh đà tích lũy động năng giúp máy quay êm đều', 'Bơm dầu cao áp', 'Tăng áp khí nạp', 'Đóng mở van nạp khí'],
      explanation: 'Bánh đà tích năng lượng ở kỳ sinh công và trả lại năng lượng để duy trì các kỳ không sinh công.'
    },
    {
      id: 'g9-5',
      prompt: 'Ghép cặp: "Anode" (kẽm chống ăn mòn) được gắn vào vỏ tàu để:',
      targetTerm: 'Sacrificial Anode',
      phonetic: '/ˈsæk.rɪ.fɪʃ.əl ˈæn.əʊd/',
      correctAnswer: 'Hy sinh bị ăn mòn điện hóa trước để bảo vệ vỏ tàu thép',
      options: ['Hy sinh bị ăn mòn điện hóa trước để bảo vệ vỏ tàu thép', 'Làm đẹp thân vỏ tàu', 'Tăng độ bám của sơn đáy', 'Giảm sức cản sóng nước'],
      explanation: 'Kẽm có thế điện hóa âm hơn sắt nên sẽ bị ăn mòn trước, bảo vệ vỏ thép và chân vịt.'
    }
  ],
  'game-10-memory': [
    {
      id: 'g10-1',
      prompt: 'Phao chướng ngại vật phía Bắc (North Cardinal Mark) có hình nón đỉnh nhận diện:',
      targetTerm: 'North Cardinal Mark',
      phonetic: '/nɔːθ ˈkɑː.dɪ.nəl mɑːk/',
      correctAnswer: 'Hai hình nón màu đen đều chỉ đỉnh lên trên (▲ ▲)',
      options: ['Hai hình nón màu đen đều chỉ đỉnh lên trên (▲ ▲)', 'Hai hình nón đều chỉ đỉnh xuống dưới (▼ ▼)', 'Hai đáy nón úp vào nhau (▲ trên ▼ dưới)', 'Hai đỉnh nón chạm vào nhau (▼ trên ▲ dưới)'],
      explanation: 'Phao Bắc có hai hình nón chỉ lên; tàu phải đi về phía Bắc của phao để an toàn.'
    },
    {
      id: 'g10-2',
      prompt: 'Phao chướng ngại vật phía Nam (South Cardinal Mark) có hình nón đỉnh nhận diện:',
      targetTerm: 'South Cardinal Mark',
      phonetic: '/saʊθ ˈkɑː.dɪ.nəl mɑːk/',
      correctAnswer: 'Hai hình nón màu đen đều chỉ đỉnh xuống dưới (▼ ▼)',
      options: ['Hai hình nón màu đen đều chỉ đỉnh xuống dưới (▼ ▼)', 'Hai hình nón đều chỉ lên trên (▲ ▲)', 'Hai đỉnh nón chạm vào nhau', 'Hai đáy nón úp vào nhau'],
      explanation: 'Phao Nam có hai hình nón chỉ xuống dưới (South points Down).'
    },
    {
      id: 'g10-3',
      prompt: 'Phao luồng an toàn (Safe Water Mark) có màu sơn đặc trưng là:',
      targetTerm: 'Safe Water Mark',
      phonetic: '/seɪf ˈwɔː.tər mɑːk/',
      correctAnswer: 'Các sọc thẳng đứng màu đỏ và trắng (Red & White vertical stripes)',
      options: ['Các sọc thẳng đứng màu đỏ và trắng (Red & White vertical stripes)', 'Màu vàng toàn bộ', 'Sọc ngang đen và đỏ', 'Màu xanh lục toàn bộ'],
      explanation: 'Phao luồng an toàn chỉ vùng nước sâu an toàn bốn phía xung quanh phao (ví dụ phao phễu hoa tiêu).'
    },
    {
      id: 'g10-4',
      prompt: 'Theo COLREGs, đèn hành trình mạn phải (Starboard Light) của tàu có màu gì?',
      targetTerm: 'Starboard Light',
      phonetic: '/ˈstɑː.bəd laɪt/',
      correctAnswer: 'Màu xanh lục (Green), góc quét 112.5 độ',
      options: ['Màu xanh lục (Green), góc quét 112.5 độ', 'Màu đỏ (Red), góc quét 112.5 độ', 'Màu trắng (White), góc quét 225 độ', 'Màu vàng (Yellow), góc quét 135 độ'],
      explanation: 'Đèn mạn phải luôn là màu xanh lục (Green), mạn trái là màu đỏ (Red).'
    },
    {
      id: 'g10-5',
      prompt: 'Theo COLREGs Quy tắc 15 (Crossing situation), khi hai tàu máy cắt hướng nhau:',
      targetTerm: 'Give-way vessel',
      phonetic: '/ɡɪv weɪ ˈves.əl/',
      correctAnswer: 'Tàu thấy tàu kia bên mạn phải của mình phải nhường đường',
      options: ['Tàu thấy tàu kia bên mạn phải của mình phải nhường đường', 'Tàu lớn hơn luôn được quyền ưu tiên đi thẳng', 'Tàu chạy nhanh hơn phải nhường đường', 'Hai tàu cùng bẻ lái sang trái'],
      explanation: 'Tàu có tàu khác bên mạn phải là tàu nhường đường (Give-way), phải tránh cắt mũi tàu kia.'
    }
  ],
  'game-11-sentence-builder': [
    {
      id: 'g11-1',
      prompt: 'Mẫu thông điệp IMO SMCP dùng để đưa ra mệnh lệnh mang tính bắt buộc tuân thủ:',
      targetTerm: 'INSTRUCTION',
      phonetic: '/ɪnˈstrʌk.ʃən/',
      correctAnswer: 'INSTRUCTION',
      options: ['INSTRUCTION', 'ADVICE', 'INFORMATION', 'WARNING'],
      explanation: 'INSTRUCTION là mẫu bắt buộc theo luật (ví dụ: "INSTRUCTION: Do not cross fairway").'
    },
    {
      id: 'g11-2',
      prompt: 'Mẫu thông điệp IMO SMCP dùng để đưa ra lời khuyên hàng hải không mang tính bắt buộc:',
      targetTerm: 'ADVICE',
      phonetic: '/ədˈvaɪs/',
      correctAnswer: 'ADVICE',
      options: ['ADVICE', 'INSTRUCTION', 'INTENTION', 'REQUEST'],
      explanation: 'ADVICE thể hiện khuyến cáo chuyên môn của VTS/Hoa tiêu (ví dụ: "ADVICE: Alter course to 120").'
    },
    {
      id: 'g11-3',
      prompt: 'Mẫu thông điệp IMO SMCP thông báo hành động dự định mà tàu mình sắp thực hiện:',
      targetTerm: 'INTENTION',
      phonetic: '/ɪnˈten.ʃən/',
      correctAnswer: 'INTENTION',
      options: ['INTENTION', 'QUESTION', 'ANSWER', 'ADVICE'],
      explanation: 'INTENTION giúp các tàu xung quanh biết trước hướng điều động (ví dụ: "INTENTION: I will overtake on your starboard side").'
    },
    {
      id: 'g11-4',
      prompt: 'Mẫu thông điệp IMO SMCP thông báo nguy cơ nguy hiểm hàng hải sắp diễn ra:',
      targetTerm: 'WARNING',
      phonetic: '/ˈwɔː.nɪŋ/',
      correctAnswer: 'WARNING',
      options: ['WARNING', 'ADVICE', 'INFORMATION', 'REQUEST'],
      explanation: 'WARNING thông báo mối đe dọa trực tiếp (ví dụ: "WARNING: Dredger in channel ahead").'
    },
    {
      id: 'g11-5',
      prompt: 'Mẫu thông điệp IMO SMCP khi thuyền trưởng cần xin hỗ trợ tàu lai cập cầu:',
      targetTerm: 'REQUEST',
      phonetic: '/rɪˈkwest/',
      correctAnswer: 'REQUEST',
      options: ['REQUEST', 'QUESTION', 'INSTRUCTION', 'WARNING'],
      explanation: 'REQUEST dùng khi yêu cầu dịch vụ hoặc trợ giúp (ví dụ: "REQUEST: I require 2 tugs").'
    }
  ],
  'game-12-escape-room': [
    {
      id: 'g12-1',
      prompt: 'Hệ thống van ngắt dầu nhanh (Quick-closing valves) buồng máy được giật đóng từ đâu?',
      targetTerm: 'Quick-Closing Valve',
      phonetic: '/kwɪk ˈkləʊ.zɪŋ vælv/',
      correctAnswer: 'Từ hộp điều khiển khẩn cấp đặt bên ngoài buồng máy',
      options: ['Từ hộp điều khiển khẩn cấp đặt bên ngoài buồng máy', 'Từ ngay chân két dầu bên dưới buồng máy', 'Từ máy nén khí đáy tàu', 'Từ buồng hoa tiêu mũi tàu'],
      explanation: 'Van ngắt nhanh được kích hoạt bằng khí nén hoặc dây cáp từ vị trí an toàn ngoài buồng máy.'
    },
    {
      id: 'g12-2',
      prompt: 'Trước khi kích hoạt xả khí CO2 dập cháy toàn bộ buồng máy, bắt buộc phải:',
      targetTerm: 'CO2 Total Flooding Protocol',
      phonetic: '/siː əʊ tuː ˈflʌd.ɪŋ/',
      correctAnswer: 'Điểm danh đủ người, dừng thông gió và đóng kín tất cả cửa chặn lửa (Fire dampers)',
      options: ['Điểm danh đủ người, dừng thông gió và đóng kín tất cả cửa chặn lửa (Fire dampers)', 'Mở toang tất cả các cửa lấy gió làm mát', 'Khởi động máy phát điện phụ', 'Bơm nước đầy hầm buồng máy'],
      explanation: 'CO2 làm ngạt tức khắc; nếu còn người bên trong hoặc hở gió thì khí CO2 sẽ vô tác dụng và gây chết người.'
    },
    {
      id: 'g12-3',
      prompt: 'Lối thoát hiểm khẩn cấp buồng máy (Emergency Escape Trunk) phải có kết cấu:',
      targetTerm: 'Escape Trunk',
      phonetic: '/ɪˈskeɪp trʌŋk/',
      correctAnswer: 'Cách nhiệt chống cháy A-60 và dẫn thẳng lên boong lộ thiên',
      options: ['Cách nhiệt chống cháy A-60 và dẫn thẳng lên boong lộ thiên', 'Bằng gỗ chịu nhiệt', 'Dẫn vào hầm hàng số 1', 'Dẫn thông sang buồng máy lái phụ'],
      explanation: 'Thang thoát hiểm có lồng bọc chống cháy A-60 và có cửa đóng kín tự khóa ngăn khói độc.'
    },
    {
      id: 'g12-4',
      prompt: 'Bơm cứu hỏa sự cố (Emergency Fire Pump) theo quy chuẩn SOLAS nằm ở:',
      targetTerm: 'Emergency Fire Pump',
      phonetic: '/ɪˈmɜː.dʒən.si ˈfaɪər pʌmp/',
      correctAnswer: 'Bên ngoài không gian buồng máy chính (thường ở buồng máy lái hoặc khoang mũi)',
      options: ['Bên ngoài không gian buồng máy chính (thường ở buồng máy lái hoặc khoang mũi)', 'Ngay cạnh máy chính trong buồng máy', 'Trên nóc ống khói tàu', 'Bên trong buồng làm việc của Máy trưởng'],
      explanation: 'Bơm cứu hỏa khẩn cấp phải có nguồn dẫn động độc lập và nằm ngoài buồng máy để hoạt động khi buồng máy cháy.'
    },
    {
      id: 'g12-5',
      prompt: 'Hệ thống Hyper-Mist buồng máy dập lửa tại các vùng nguy hiểm cục bộ bằng:',
      targetTerm: 'Hyper-Mist System',
      phonetic: '/ˈhaɪ.pər mɪst/',
      correctAnswer: 'Màn sương nước ngọt áp lực siêu cao (dập lửa không cần sơ tán người)',
      options: ['Màn sương nước ngọt áp lực siêu cao (dập lửa không cần sơ tán người)', 'Bột hóa chất khô gây cay mắt', 'Khí ga lạnh hóa lỏng', 'Cát khô áp lực cao'],
      explanation: 'Nước sương mịn hấp thụ nhiệt cực nhanh và đẩy oxy cục bộ quanh đám cháy mà không gây ngạt người.'
    }
  ],
  'game-13-captain-decision': [
    {
      id: 'g13-1',
      prompt: 'Khi đón hoa tiêu trong gió bão lớn mạn trái, quyết định của Thuyền trưởng là:',
      targetTerm: 'Make a Lee',
      phonetic: '/meɪk ə liː/',
      correctAnswer: 'Đổi hướng tàu tạo vùng nước khuất gió (Lee side) an toàn ở mạn đón hoa tiêu',
      options: ['Đổi hướng tàu tạo vùng nước khuất gió (Lee side) an toàn ở mạn đón hoa tiêu', 'Giữ nguyên tốc độ tối đa chạy thẳng', 'Thả neo giữa luồng bão', 'Yêu cầu hoa tiêu tự trèo trong sóng lớn'],
      explanation: '"Make a lee" là thao tác kinh điển dùng thân tàu che chắn sóng gió cho xuồng hoa tiêu áp mạn an toàn.'
    },
    {
      id: 'g13-2',
      prompt: 'Thanh tra PSC phát hiện thiết bị cứu sinh hỏng nặng không thể đi biển. Biện pháp của PSC:',
      targetTerm: 'Port State Control Detention',
      phonetic: '/dɪˈten.ʃən/',
      correctAnswer: 'Lưu giữ tàu (Detention) cấm rời cảng cho đến khi khắc phục triệt để',
      options: ['Lưu giữ tàu (Detention) cấm rời cảng cho đến khi khắc phục triệt để', 'Phạt tiền và cho phép tàu chạy ngay', 'Tịch thu toàn bộ tàu', 'Bỏ qua không lập biên bản'],
      explanation: 'Khiếm khuyết loại 30 (Detention) sẽ bị lưu giữ tàu và thông báo trên cơ sở dữ liệu Tokyo/Paris MOU.'
    },
    {
      id: 'g13-3',
      prompt: 'Khi bao bì hàng hóa bị rách nát trước khi cẩu lên tàu, Thuyền trưởng phải:',
      targetTerm: 'Claused Bill of Lading',
      phonetic: '/klɔːzd bɪl əv ˈleɪ.dɪŋ/',
      correctAnswer: 'Ghi chú bảo lưu hư hỏng lên Vận đơn (Claused / Dirty Bill of Lading)',
      options: ['Ghi chú bảo lưu hư hỏng lên Vận đơn (Claused / Dirty Bill of Lading)', 'Ký vận đơn sạch (Clean B/L) không bảo lưu', 'Từ chối vận chuyển và hủy chuyến', 'Tự xuất tiền bồi thường cho chủ hàng'],
      explanation: 'Ký B/L bảo lưu rõ ràng bảo vệ chủ tàu khỏi các khiếu nại bảo hiểm oan sai tại cảng dỡ hàng.'
    },
    {
      id: 'g13-4',
      prompt: 'Tài liệu bắt buộc chứng nhận số lượng và chức danh thuyền viên tối thiểu trên tàu:',
      targetTerm: 'Minimum Safe Manning',
      phonetic: '/ˈmɪn.ɪ.məm seɪf ˈmæn.ɪŋ/',
      correctAnswer: 'Giấy chứng nhận định biên an toàn tối thiểu (Minimum Safe Manning Document)',
      options: ['Giấy chứng nhận định biên an toàn tối thiểu (Minimum Safe Manning Document)', 'Sổ danh bạ thuyền viên', 'Bằng thuyền trưởng quốc tế', 'Bản kê khai hải quan tàu'],
      explanation: 'Nếu thiếu dù chỉ 1 chức danh so với Giấy chứng nhận định biên an toàn, tàu sẽ bị cấm rời cảng.'
    },
    {
      id: 'g13-5',
      prompt: 'Khi tàu chạy vào vùng thời tiết bão nhiệt đới (Tropical Cyclone) ở Bán cầu Bắc:',
      targetTerm: 'Dangerous Semi-Circle',
      phonetic: '/ˈdeɪn.dʒər.əs ˈsem.iˌsɜː.kəl/',
      correctAnswer: 'Nửa bán nguyệt bên phải tâm bão là vùng nguy hiểm nhất (Dangerous semicircle)',
      options: ['Nửa bán nguyệt bên phải tâm bão là vùng nguy hiểm nhất (Dangerous semicircle)', 'Nửa bán nguyệt bên trái tâm bão là vùng nguy hiểm nhất', 'Tâm mắt bão là nơi an toàn nhất', 'Phía sau đuôi bão luôn nguy hiểm nhất'],
      explanation: 'Ở Bán cầu Bắc, nửa bên phải có gió bão cộng hưởng với hướng di chuyển đẩy tàu thẳng vào tâm bão.'
    }
  ],
  'game-14-daily-challenge': [
    {
      id: 'g14-1',
      prompt: 'Két dằn nước biển (Ballast Tank) trên tàu hàng có công dụng cơ bản nhất là:',
      targetTerm: 'Ballast Tank Function',
      phonetic: '/ˈbæl.əst tæŋk/',
      correctAnswer: 'Điều chỉnh mớn nước, độ chúi và giữ cân bằng ổn định khi tàu không chở hàng',
      options: ['Điều chỉnh mớn nước, độ chúi và giữ cân bằng ổn định khi tàu không chở hàng', 'Chứa nước ngọt ăn uống cho thuyền viên', 'Dự trữ nhiên liệu dầu nặng', 'Làm mát trực tiếp thân tàu'],
      explanation: 'Khi dỡ hết hàng, tàu phải bơm nước dằn để chìm chân vịt và đảm bảo chiều cao tâm nghiêng GM an toàn.'
    },
    {
      id: 'g14-2',
      prompt: 'Hệ thống khí trơ (Inert Gas System - IGS) trên tàu dầu duy trì nồng độ Oxy ở mức:',
      targetTerm: 'Inert Gas Oxygen Limit',
      phonetic: '/ˈɪn.ɜːt ɡæs ˈɒk.sɪ.dʒən/',
      correctAnswer: 'Dưới 8% theo thể tích (thường khống chế dưới 5%)',
      options: ['Dưới 8% theo thể tích (thường khống chế dưới 5%)', 'Dưới 21%', 'Bằng 0% tuyệt đối', 'Dưới 15%'],
      explanation: 'Hỗn hợp hơi dầu chỉ bốc cháy khi nồng độ oxy từ 11% trở lên; duy trì dưới 8% triệt tiêu nguy cơ nổ bồn.'
    },
    {
      id: 'g14-3',
      prompt: 'Thiết bị đo góc nghiêng ngang của tàu trong sóng gió đặt tại buồng lái là:',
      targetTerm: 'Inclinometer',
      phonetic: '/ˌɪn.klɪˈnɒm.ɪ.tər/',
      correctAnswer: 'Đồng hồ đo độ nghiêng (Inclinometer)',
      options: ['Đồng hồ đo độ nghiêng (Inclinometer)', 'Máy đo gió (Anemometer)', 'Máy đo áp suất khí quyển (Barometer)', 'Máy đo độ sâu (Echo sounder)'],
      explanation: 'Inclinometer có kim trọng lực chỉ rõ góc nghiêng mạn trái/mạn phải tối đa trong hành trình.'
    },
    {
      id: 'g14-4',
      prompt: 'Thử nghiệm hệ thống máy lái khẩn cấp buồng máy (Emergency Steering) theo SOLAS:',
      targetTerm: 'Emergency Steering Drill',
      phonetic: '/ɪˈmɜː.dʒən.si ˈstɪə.rɪŋ/',
      correctAnswer: 'Bắt buộc thực tập định kỳ ít nhất 3 tháng một lần',
      options: ['Bắt buộc thực tập định kỳ ít nhất 3 tháng một lần', 'Mỗi năm một lần', 'Chỉ thực tập khi có sự cố hỏng hóc', '5 năm một lần khi lên đốc'],
      explanation: 'SOLAS quy định thực tập máy lái khẩn cấp buồng máy tối thiểu 3 tháng một lần cho toàn bộ thuyền viên boong/máy.'
    },
    {
      id: 'g14-5',
      prompt: 'Mớn nước mũi tàu sâu hơn mớn nước lái tàu thì tàu ở trạng thái:',
      targetTerm: 'Trim by the head',
      phonetic: '/trɪm baɪ ðə hed/',
      correctAnswer: 'Tàu bị chúi mũi (Trim by the head)',
      options: ['Tàu bị chúi mũi (Trim by the head)', 'Tàu bị chúi lái (Trim by the stern)', 'Tàu cân bằng mớn nước (Even keel)', 'Tàu bị nghiêng ngang (List)'],
      explanation: 'Trim by head làm giảm hiệu quả bẻ lái và khiến mũi tàu dễ bị sóng đánh trùm lên boong.'
    }
  ],
  'game-15-weekly-league': [
    {
      id: 'g15-1',
      prompt: 'Chiều cao tâm nghiêng ban đầu (GM - Metacentric Height) của tàu mang giá trị âm (-) biểu thị:',
      targetTerm: 'Negative GM',
      phonetic: '/ˈneɡ.ə.tɪv dʒiː em/',
      correctAnswer: 'Tàu ở trạng thái ổn định không bền (cực kỳ nguy hiểm, nguy cơ lật úp)',
      options: ['Tàu ở trạng thái ổn định không bền (cực kỳ nguy hiểm, nguy cơ lật úp)', 'Tàu ở trạng thái cân bằng bền vững nhất', 'Tàu đang chạy êm ái nhẹ nhàng', 'Tàu không bị sóng lắc'],
      explanation: 'GM âm nghĩa là trọng tâm G nằm trên tâm nghiêng M, tàu sẽ tự nghiêng và lật úp khi gặp ngoại lực nhỏ.'
    },
    {
      id: 'g15-2',
      prompt: 'Hiện tượng "Cavitation" (Xâm thực chân vịt) gây ra những tác hại nghiêm trọng nào?',
      targetTerm: 'Propeller Cavitation',
      phonetic: '/ˌkæv.ɪˈteɪ.ʃən/',
      correctAnswer: 'Gây rỗ mòn phá hủy bề mặt cánh chân vịt, rung lắc mạnh và tụt hiệu suất',
      options: ['Gây rỗ mòn phá hủy bề mặt cánh chân vịt, rung lắc mạnh và tụt hiệu suất', 'Làm tàu tăng tốc độ đột biến', 'Làm sạch rong rêu bám đáy', 'Tăng độ bền của kim loại cánh'],
      explanation: 'Áp suất giảm cục bộ tạo bọt khí chân không; khi vỡ ra sẽ tạo xung lực cực mạnh khoét rỗ kim loại.'
    },
    {
      id: 'g15-3',
      prompt: 'Chương trình kiểm tra giám định tàu dầu quốc tế khắt khe hàng đầu viết tắt là SIRE:',
      targetTerm: 'SIRE Programme',
      phonetic: '/saɪər ˈprəʊ.ɡræm/',
      correctAnswer: 'Ship Inspection Report Programme (do OCIMF ban hành)',
      options: ['Ship Inspection Report Programme (do OCIMF ban hành)', 'Safety International Radar Equipment', 'Standard IMO Radio Exam', 'Seafarer International Rank Evaluation'],
      explanation: 'SIRE là tiêu chuẩn đánh giá rủi ro an toàn tàu chở dầu của Diễn đàn Hàng hải Quốc tế các Công ty Dầu mỏ (OCIMF).'
    },
    {
      id: 'g15-4',
      prompt: 'Trục cam (Camshaft) của động cơ diesel 4 kỳ quay với tốc độ như thế nào so với trục khuỷu?',
      targetTerm: 'Camshaft Speed 4-Stroke',
      phonetic: '/ˈkæm.ʃɑːft spiːd/',
      correctAnswer: 'Quay bằng 1/2 tốc độ quay của trục khuỷu (1:2)',
      options: ['Quay bằng 1/2 tốc độ quay của trục khuỷu (1:2)', 'Quay cùng tốc độ với trục khuỷu (1:1)', 'Quay gấp đôi tốc độ trục khuỷu (2:1)', 'Quay độc lập không theo tỷ lệ'],
      explanation: 'Động cơ 4 kỳ hoàn thành 1 chu trình sau 2 vòng quay trục khuỷu, do đó trục cam chỉ quay 1 vòng.'
    },
    {
      id: 'g15-5',
      prompt: 'Công ước MARPOL Phụ lục VI (Annex VI) quy định nghiêm ngặt về vấn đề bảo vệ môi trường nào?',
      targetTerm: 'MARPOL Annex VI',
      phonetic: '/ˈmɑː.pɒl ˈæn.eks sɪks/',
      correctAnswer: 'Ngăn ngừa ô nhiễm không khí do khí xả tàu thủy (SOx, NOx, ODS)',
      options: ['Ngăn ngừa ô nhiễm không khí do khí xả tàu thủy (SOx, NOx, ODS)', 'Ngăn ngừa ô nhiễm rác thải sinh hoạt (Garbage)', 'Ngăn ngừa ô nhiễm nước thải (Sewage)', 'Ngăn ngừa ô nhiễm hóa chất độc hại'],
      explanation: 'Phụ lục VI quy định giới hạn hàm lượng lưu huỳnh trong nhiên liệu (0.50% toàn cầu và 0.10% trong vùng ECA).'
    }
  ]
};

export const getQuestionsForGame = (gameId: string): DuelQuestion[] => {
  if (GAME_SPECIFIC_QUESTIONS[gameId] && GAME_SPECIFIC_QUESTIONS[gameId].length > 0) {
    return GAME_SPECIFIC_QUESTIONS[gameId];
  }
  return GAME_SPECIFIC_QUESTIONS['game-1-duel'] || SAMPLE_DUEL_QUESTIONS;
};

