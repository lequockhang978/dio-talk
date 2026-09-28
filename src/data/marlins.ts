// ============================================================================
// MARLINS ENGLISH TEST FOR SEAFARERS & STCW MARITIME EXAM SIMULATOR
// Standard 50 Questions - Timed 45 Minutes - 5 Categories
// ============================================================================

export interface MarlinsQuestion {
  id: string;
  category: 'listening' | 'grammar' | 'vocabulary' | 'numbers' | 'reading';
  categoryTitle: string;
  prompt: string;
  audioText?: string;
  imageIcon?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  maritimeContext: string;
}

export const MARLINS_EXAM_DATA: MarlinsQuestion[] = [
  // --------------------------------------------------------------------------
  // 1. LISTENING & SMCP SPOKEN DIRECTIVES
  // --------------------------------------------------------------------------
  {
    id: 'mar-01',
    category: 'listening',
    categoryTitle: 'Nghe hiểu câu lệnh Hàng hải (Listening)',
    prompt: 'Nghe thông báo qua loa VHF và chọn hành động đúng của thuyền viên:',
    audioText: 'Attention all crew. Fire in the engine room lower platform. All fire party members muster at the fire station immediately.',
    options: [
      'Tập trung tại trạm cứu hỏa ngay lập tức',
      'Chuẩn bị thả xuồng cứu sinh mạn phải',
      'Đóng van thông biển và dừng máy chính',
      'Xuống buồng máy dập lửa một mình'
    ],
    correctIndex: 0,
    explanation: 'Câu lệnh "muster at the fire station immediately" có nghĩa là đội chữa cháy phải tập trung ngay lập tức tại trạm cứu hỏa.',
    maritimeContext: 'SOLAS Fire Drill & Emergency Response'
  },
  {
    id: 'mar-02',
    category: 'listening',
    categoryTitle: 'Nghe hiểu câu lệnh Hàng hải (Listening)',
    prompt: 'Hoa tiêu ra lệnh bẻ lái trên buồng lái. Lệnh này có nghĩa là gì?',
    audioText: 'Helmsman, midships and steady as she goes on zero-nine-five degrees.',
    options: [
      'Bẻ hết lái sang mạn phải 95 độ',
      'Về lái số 0 (chính giữa) và giữ nguyên hướng la bàn 095 độ',
      'Dừng máy và chờ tàu kéo hỗ trợ',
      'Bẻ hết lái sang mạn trái 15 độ'
    ],
    correctIndex: 1,
    explanation: '"Midships" là đưa bánh lái về chính giữa (0 độ). "Steady as she goes on 095" là giữ nguyên hướng tàu chạy ổn định ở 095 độ.',
    maritimeContext: 'IMO SMCP Standard Wheel Orders'
  },
  {
    id: 'mar-03',
    category: 'listening',
    categoryTitle: 'Nghe hiểu câu lệnh Hàng hải (Listening)',
    prompt: 'Máy trưởng thông báo cho thợ máy trực ca. Ý của Máy trưởng là gì?',
    audioText: 'Check the scavenge space temperature on cylinder number four and drain the air cooler condensate.',
    options: [
      'Kiểm tra nhiệt độ khoang gió quét xi lanh số 4 và xả nước đọng sinh hàn gió',
      'Tăng tốc độ máy nén khí và bơm dầu bôi trơn',
      'Thay phin lọc dầu nhiên liệu máy phụ',
      'Khởi động bơm la gông buồng máy'
    ],
    correctIndex: 0,
    explanation: '"Scavenge space" là khoang gió quét, "air cooler condensate" là nước ngưng tụ trong bình làm mát gió nạp.',
    maritimeContext: 'Engine Room Watchkeeping Routine'
  },
  {
    id: 'mar-04',
    category: 'listening',
    categoryTitle: 'Nghe hiểu câu lệnh Hàng hải (Listening)',
    prompt: 'Đài VTS thông báo cho tàu bạn. Bạn cần làm gì?',
    audioText: 'Motor Vessel Ocean Pioneer, this is Singapore VTS. Increase speed to 12 knots and give way to the outbound tanker on your port bow.',
    options: [
      'Dừng tàu và thả neo khẩn cấp',
      'Tăng tốc lên 12 hải lý/giờ và nhường đường cho tàu dầu đi ra ở phía mũi trái',
      'Chuyển kênh VHF sang kênh 16 ngay lập tức',
      'Vượt tàu dầu phía trước bên mạn phải'
    ],
    correctIndex: 1,
    explanation: '"Increase speed to 12 knots" = tăng tốc độ lên 12 knots. "Give way" = nhường đường cho tàu dầu đi ra.',
    maritimeContext: 'Port VTS Communications & COLREGs'
  },

  // --------------------------------------------------------------------------
  // 2. GRAMMAR & TECHNICAL VOCABULARY
  // --------------------------------------------------------------------------
  {
    id: 'mar-05',
    category: 'grammar',
    categoryTitle: 'Ngữ pháp & Cấu trúc kỹ thuật hàng hải',
    prompt: 'Chọn giới từ chính xác điền vào chỗ trống: "The Chief Officer is responsible _____ cargo operations on deck."',
    options: ['for', 'at', 'with', 'in'],
    correctIndex: 0,
    explanation: 'Cấu trúc "responsible for" có nghĩa là chịu trách nhiệm về việc gì đó.',
    maritimeContext: 'Shipboard Management Responsibilities'
  },
  {
    id: 'mar-06',
    category: 'grammar',
    categoryTitle: 'Ngữ pháp & Cấu trúc kỹ thuật hàng hải',
    prompt: 'Chọn dạng đúng của động từ: "Before entering the enclosed space, the atmosphere must be _____ by a calibrated gas detector."',
    options: ['testing', 'tested', 'test', 'tests'],
    correctIndex: 1,
    explanation: 'Cấu trúc bị động: must be + V3/ed (must be tested = phải được kiểm tra).',
    maritimeContext: 'ISM Safety & Enclosed Space Entry'
  },
  {
    id: 'mar-07',
    category: 'grammar',
    categoryTitle: 'Ngữ pháp & Cấu trúc kỹ thuật hàng hải',
    prompt: 'Điền từ thích hợp: "Oil rags _____ be thrown into normal garbage bins because of spontaneous combustion risk."',
    options: ['must not', 'can', 'should', 'might'],
    correctIndex: 0,
    explanation: '"must not" = tuyệt đối không được (quy chuẩn an toàn cấm vứt giẻ lau dính dầu vào thùng rác thường do nguy cơ tự bốc cháy).',
    maritimeContext: 'MARPOL Annex V & Fire Prevention'
  },
  {
    id: 'mar-08',
    category: 'grammar',
    categoryTitle: 'Ngữ pháp & Cấu trúc kỹ thuật hàng hải',
    prompt: 'Chọn thì đúng: "The emergency generator starts automatically when main switchboard power _____."',
    options: ['fails', 'will fail', 'failed', 'failing'],
    correctIndex: 0,
    explanation: 'Câu điều kiện loại 0 diễn tả sự thật kỹ thuật hiển nhiên: dùng hiện tại đơn (fails).',
    maritimeContext: 'SOLAS Electrical Automation & Blackout Recovery'
  },

  // --------------------------------------------------------------------------
  // 3. MARITIME VOCABULARY & SMCP PHRASES
  // --------------------------------------------------------------------------
  {
    id: 'mar-09',
    category: 'vocabulary',
    categoryTitle: 'Từ vựng & Cụm từ chuẩn hóa IMO SMCP',
    prompt: 'Trong đàm thoại IMO SMCP, khi bạn không nghe rõ và muốn đối phương nhắc lại, bạn phải nói từ nào?',
    options: ['Repeat again please', 'Say again', 'What did you say', 'Pardon me'],
    correctIndex: 1,
    explanation: 'Theo chuẩn IMO SMCP, bắt buộc dùng thông điệp chuẩn "Say again" thay vì dùng "Repeat" (từ repeat chỉ dùng riêng cho pháo hiệu/vũ khí).',
    maritimeContext: 'IMO SMCP Message Markers'
  },
  {
    id: 'mar-10',
    category: 'vocabulary',
    categoryTitle: 'Từ vựng & Cụm từ chuẩn hóa IMO SMCP',
    prompt: 'Thiết bị nào dùng để ngăn ngừa xả dầu la-gông vượt quá 15 ppm ra biển?',
    options: [
      'Sewage Treatment Plant (STP)',
      'Oily Water Separator (OWS)',
      'Fresh Water Generator (FWG)',
      'Inert Gas Generator (IGG)'
    ],
    correctIndex: 1,
    explanation: 'Oily Water Separator (OWS - Thiết bị phân ly dầu nước 15 ppm) là thiết bị bắt buộc theo Phụ lục I MARPOL.',
    maritimeContext: 'MARPOL Annex I Environmental Protection'
  },
  {
    id: 'mar-11',
    category: 'vocabulary',
    categoryTitle: 'Từ vựng & Cụm từ chuẩn hóa IMO SMCP',
    prompt: 'Thuật ngữ "CPA" trong radar hàng hải là viết tắt của cụm từ nào?',
    options: [
      'Closest Point of Approach',
      'Central Port Area',
      'Constant Propulsion Angle',
      'Collision Protection Alarm'
    ],
    correctIndex: 0,
    explanation: 'CPA = Closest Point of Approach (Khoảng cách tiếp cận gần nhất giữa hai tàu, dùng để xác định nguy cơ đâm va).',
    maritimeContext: 'COLREGs & Bridge ARPA Navigation'
  },
  {
    id: 'mar-12',
    category: 'vocabulary',
    categoryTitle: 'Từ vựng & Cụm từ chuẩn hóa IMO SMCP',
    prompt: 'Phụ tùng làm kín giữa hai mặt bích ống dẫn dầu gọi là gì?',
    options: ['Gasket', 'Piston ring', 'Feeler gauge', 'Cotter pin'],
    correctIndex: 0,
    explanation: 'Gasket là gioăng (đệm làm kín) đặt giữa hai mặt bích (flanges) để chống rò rỉ chất lỏng hoặc khí.',
    maritimeContext: 'Marine Engineering Piping & Valves'
  },

  // --------------------------------------------------------------------------
  // 4. TIME, NUMBERS & MEASUREMENTS
  // --------------------------------------------------------------------------
  {
    id: 'mar-13',
    category: 'numbers',
    categoryTitle: 'Thời gian, Tọa độ & Đơn vị đo hàng hải',
    prompt: 'Theo chuẩn đọc số IMO SMCP, số "3" và số "9" được phát âm chuẩn vô tuyến như thế nào?',
    options: [
      '"Three" và "Nine"',
      '"Tree" và "Niner"',
      '"Trois" và "Neuf"',
      '"Trio" và "Nona"'
    ],
    correctIndex: 1,
    explanation: 'Quy chuẩn NATO/IMO SMCP quy định: Số 3 đọc là "TREE", số 9 đọc là "NINER" để tránh nhầm lẫn qua sóng vô tuyến bị nhiễu.',
    maritimeContext: 'IMO SMCP Phonetic Alphabet and Numbers'
  },
  {
    id: 'mar-14',
    category: 'numbers',
    categoryTitle: 'Thời gian, Tọa độ & Đơn vị đo hàng hải',
    prompt: 'Báo cáo mớn nước: "Forward draft is 8.5 meters, aft draft is 9.2 meters." Tàu đang ở trạng thái nào?',
    options: [
      'Trim by the head (chúi mũi)',
      'Trim by the stern (chúi lái)',
      'Even keel (mớn nước cân bằng)',
      'Listing to starboard (nghiêng mạn phải)'
    ],
    correctIndex: 1,
    explanation: 'Mớn nước lái (9.2m) lớn hơn mớn nước mũi (8.5m) nên tàu ở trạng thái "Trim by the stern" (chúi lái).',
    maritimeContext: 'Ship Stability, Trim & Hydrostatics'
  },
  {
    id: 'mar-15',
    category: 'numbers',
    categoryTitle: 'Thời gian, Tọa độ & Đơn vị đo hàng hải',
    prompt: 'Hàm lượng oxy an toàn tối thiểu bắt buộc để thuyền viên vào không gian kín buồng máy là bao nhiêu?',
    options: ['16.0% theo thể tích', '18.5% theo thể tích', '20.9% theo thể tích', '25.0% theo thể tích'],
    correctIndex: 2,
    explanation: '20.9% oxy là nồng độ oxy tiêu chuẩn trong không khí sạch tự nhiên, bắt buộc phải đạt trước khi cấp giấy phép vào không gian kín.',
    maritimeContext: 'Enclosed Space Safe Entry Criteria'
  },

  // --------------------------------------------------------------------------
  // 5. READING SIGNS & MARITIME REGULATIONS
  // --------------------------------------------------------------------------
  {
    id: 'mar-16',
    category: 'reading',
    categoryTitle: 'Đọc hiểu Biển báo & Ký hiệu An toàn IMO',
    prompt: 'Biển báo màu xanh lá cây có hình người chạy về phía cầu thang màu trắng biểu thị điều gì?',
    options: [
      'Lối thoát hiểm khẩn cấp (Emergency Escape Route)',
      'Trạm tập trung cứu sinh (Muster Station)',
      'Trạm dập lửa khí CO2 (CO2 Release Station)',
      'Khu vực hút thuốc được phép (Smoking Area)'
    ],
    correctIndex: 0,
    explanation: 'Ký hiệu đồ họa IMO màu xanh lá cây hình người chạy là biển chỉ dẫn lối thoát hiểm khẩn cấp (Emergency Escape Route/EEBD).',
    maritimeContext: 'IMO Graphical Safety Signs & SOLAS'
  },
  {
    id: 'mar-17',
    category: 'reading',
    categoryTitle: 'Đọc hiểu Biển báo & Ký hiệu An toàn IMO',
    prompt: 'Ký hiệu "SWL 5T" in trên móc cần cẩu buồng máy có ý nghĩa gì?',
    options: [
      'Safe Working Load: Tải trọng làm việc an toàn tối đa 5 tấn',
      'Ship Weight Limit: Giới hạn trọng lượng tàu 5 tấn',
      'Standard Winch Length: Chiều dài cáp tời 5 mét',
      'Steel Wire Limit: Sức chịu lực đứt cáp 5 tấn'
    ],
    correctIndex: 0,
    explanation: 'SWL = Safe Working Load (Tải trọng làm việc an toàn), nghiêm cấm cẩu hàng vượt quá tải trọng ghi trên thiết bị.',
    maritimeContext: 'Lifting Appliances & Safe Working Practices'
  },
  {
    id: 'mar-18',
    category: 'reading',
    categoryTitle: 'Đọc hiểu Biển báo & Ký hiệu An toàn IMO',
    prompt: 'Nhãn dán hình thoi màu trắng viền đỏ có biểu tượng "đầu lâu xương chéo" trên bao bì hàng hóa biểu thị hàng nguy hiểm nhóm nào?',
    options: [
      'Chất nổ (Class 1)',
      'Chất độc hại (Class 6.1 Toxic Substances)',
      'Khí dễ cháy (Class 2.1)',
      'Chất ăn mòn (Class 8)'
    ],
    correctIndex: 1,
    explanation: 'Theo Bộ luật IMDG Code, biểu tượng đầu lâu xương chéo biểu thị Hàng hóa chất độc hại (Class 6.1 Toxic Substances).',
    maritimeContext: 'IMDG Code Dangerous Goods Placards'
  },
  {
    id: 'mar-19',
    category: 'listening',
    categoryTitle: 'Nghe hiểu câu lệnh Hàng hải (Listening)',
    prompt: 'Hoa tiêu trao đổi với Thuyền trưởng khi tiếp cận luồng. Ý của Hoa tiêu là gì?',
    audioText: 'Captain, prepare the starboard anchor with one shackle on deck. We will let go starboard anchor if current exceeds three knots.',
    options: [
      'Chuẩn bị neo mạn phải với 1 đường lăm trên mặt boong, sẵn sàng xông neo nếu dòng chảy vượt quá 3 hải lý/giờ',
      'Kéo hết neo mạn trái lên và tăng tốc máy chính lên 3 hải lý/giờ',
      'Thả xuồng cứu sinh mạn phải để kiểm tra độ sâu',
      'Cắt dây kéo của tàu lai bên mạn phải'
    ],
    correctIndex: 0,
    explanation: '"One shackle on deck" = 1 đường lăm (đoạn xích 27.5m) trên mặt boong. "Let go anchor" = thả neo/xông neo.',
    maritimeContext: 'Master / Pilot Information Exchange'
  },
  {
    id: 'mar-20',
    category: 'listening',
    categoryTitle: 'Nghe hiểu câu lệnh Hàng hải (Listening)',
    prompt: 'Sĩ quan trực ca phát lệnh diễn tập sự cố buồng lái. Lệnh này yêu cầu điều gì?',
    audioText: 'All deck officers and engineers, switch steering control to local emergency steering in the steering gear room immediately.',
    options: [
      'Chuyển điều khiển lái sang chế độ lái sự cố tại buồng máy lái ngay lập tức',
      'Dừng máy lái số 1 và khởi động máy nén khí sự cố',
      'Bẻ hết lái sang trái để tránh luồng tàu',
      'Kiểm tra mức dầu thủy lực trong két la-gông'
    ],
    correctIndex: 0,
    explanation: '"Local emergency steering in steering gear room" = hệ thống lái sự cố cục bộ tại buồng máy lái.',
    maritimeContext: 'SOLAS Emergency Steering Drill'
  },
  {
    id: 'mar-21',
    category: 'grammar',
    categoryTitle: 'Ngữ pháp & Cấu trúc kỹ thuật hàng hải',
    prompt: 'Điền dạng đúng của động từ: "The Chief Engineer insisted on _____ the bunker delivery note before signing."',
    options: ['checking', 'check', 'checked', 'to check'],
    correctIndex: 0,
    explanation: 'Giới từ "on" đi kèm V-ing: insist on + V-ing (insisted on checking = kiên quyết kiểm tra).',
    maritimeContext: 'MARPOL Bunkering Procedures & BDN Verification'
  },
  {
    id: 'mar-22',
    category: 'grammar',
    categoryTitle: 'Ngữ pháp & Cấu trúc kỹ thuật hàng hải',
    prompt: 'Chọn từ chính xác: "No hot work shall be carried out _____ a hot work permit has been issued and signed by the Master."',
    options: ['unless', 'because', 'although', 'in order that'],
    correctIndex: 0,
    explanation: '"Unless" = trừ khi (Nghiêm cấm làm công việc phát sinh nhiệt trừ khi đã có giấy phép làm việc nóng được Thuyền trưởng ký).',
    maritimeContext: 'ISM Safety Management & Hot Work Permits'
  },
  {
    id: 'mar-23',
    category: 'vocabulary',
    categoryTitle: 'Từ vựng & Cụm từ chuẩn hóa IMO SMCP',
    prompt: 'Đường ranh giới an toàn được cài đặt trên hải đồ điện tử ECDIS để cảnh báo nguy cơ mắc cạn gọi là gì?',
    options: ['Safety Contour', 'Safety Horizon', 'Clearing Bearing', 'Transit Line'],
    correctIndex: 0,
    explanation: 'Safety Contour (Đường đẳng sâu an toàn) trên ECDIS được tính theo mớn nước tĩnh + UKC - chiều cao thủy triều.',
    maritimeContext: 'ECDIS Safe Passage Planning'
  },
  {
    id: 'mar-24',
    category: 'vocabulary',
    categoryTitle: 'Từ vựng & Cụm từ chuẩn hóa IMO SMCP',
    prompt: 'Thao tác xả đáy nồi hơi định kỳ để loại bỏ cặn bùn tích tụ gọi là gì?',
    options: ['Boiler bottom blowdown', 'Boiler soot blowing', 'Boiler water dosing', 'Boiler flameout'],
    correctIndex: 0,
    explanation: 'Bottom blowdown là thao tác xả đáy nồi hơi để xả cặn lắng và duy trì nồng độ hóa chất xử lý nước.',
    maritimeContext: 'Marine Auxiliary Boiler Operations'
  },
  {
    id: 'mar-25',
    category: 'vocabulary',
    categoryTitle: 'Từ vựng & Cụm từ chuẩn hóa IMO SMCP',
    prompt: 'Đĩa tròn điều chỉnh tỉ trọng nước/dầu lắp trong máy lọc ly tâm (Purifier) gọi là gì?',
    options: ['Gravity disc', 'Paring disc', 'Bowl spindle', 'Blind disc'],
    correctIndex: 0,
    explanation: 'Gravity disc (Đĩa tỉ trọng) xác định vị trí mặt phân cách dầu-nước trong đĩa quay máy lọc ly tâm.',
    maritimeContext: 'Fuel Oil Purifier Separation Maintenance'
  },
  {
    id: 'mar-26',
    category: 'numbers',
    categoryTitle: 'Thời gian, Tọa độ & Đơn vị đo hàng hải',
    prompt: 'Theo quy định SOLAS, nhiệt độ chớp cháy (Flash Point) tối thiểu của dầu đốt được phép sử dụng trên tàu biển là bao nhiêu?',
    options: ['60°C (140°F)', '45°C (113°F)', '30°C (86°F)', '100°C (212°F)'],
    correctIndex: 0,
    explanation: 'SOLAS quy định không được phép sử dụng bất kỳ loại dầu đốt nào có nhiệt độ chớp cháy nhỏ hơn 60°C cho tàu biển thông thường.',
    maritimeContext: 'SOLAS Fire Safety Regulations for Fuel Oil'
  },
  {
    id: 'mar-27',
    category: 'numbers',
    categoryTitle: 'Thời gian, Tọa độ & Đơn vị đo hàng hải',
    prompt: 'Tọa độ GPS "10° 45.2\' N, 106° 48.5\' E" được đọc chuẩn vô tuyến IMO SMCP như thế nào?',
    options: [
      'One-zero degrees four-five decimal two minutes North, one-zero-six degrees four-eight decimal five minutes East',
      'Ten degrees forty-five point two North, one hundred six East',
      'Ten four five North, one zero six East',
      'Latitude ten, Longitude one hundred six'
    ],
    correctIndex: 0,
    explanation: 'IMO SMCP quy định từng chữ số tọa độ phải được đọc riêng lẻ kèm từ "degrees", "decimal", "minutes" và hướng Bắc/Nam/Đông/Tây.',
    maritimeContext: 'IMO SMCP Reporting Positions'
  },
  {
    id: 'mar-28',
    category: 'reading',
    categoryTitle: 'Đọc hiểu Biển báo & Ký hiệu An toàn IMO',
    prompt: 'Ban ngày, một tàu treo dấu hiệu hình trụ tròn màu đen (Black Cylinder) ở nơi dễ nhìn thấy nhất. Tàu này là loại tàu gì theo COLREGs?',
    options: [
      'Tàu bị hạn chế bởi mớn nước (Vessel Constrained by her Draught - Rule 28)',
      'Tàu đang thả neo (Vessel at anchor)',
      'Tàu mất khả năng điều động (Vessel Not Under Command)',
      'Tàu mắc cạn (Vessel aground)'
    ],
    correctIndex: 0,
    explanation: 'Theo Quy tắc 28 COLREGs, tàu bị hạn chế bởi mớn nước ban ngày phải treo một dấu hiệu hình trụ (cylinder).',
    maritimeContext: 'COLREGs Rule 28 Day Shapes & Navigation Lights'
  },
  {
    id: 'mar-29',
    category: 'reading',
    categoryTitle: 'Đọc hiểu Biển báo & Ký hiệu An toàn IMO',
    prompt: 'Thiết bị EEBD (Emergency Escape Breathing Device) trên tàu có thời gian cung cấp dưỡng khí tối thiểu là bao nhiêu phút?',
    options: ['10 phút', '30 phút', '60 phút', '3 phút'],
    correctIndex: 0,
    explanation: 'EEBD theo SOLAS phải cung cấp đủ không khí thở tối thiểu 10 phút để thuyền viên thoát ra khỏi khu vực nguy hiểm buồng máy.',
    maritimeContext: 'SOLAS Fire Safety Systems Code (FSS Code)'
  },
  {
    id: 'mar-30',
    category: 'reading',
    categoryTitle: 'Đọc hiểu Biển báo & Ký hiệu An toàn IMO',
    prompt: 'Theo Phụ lục V MARPOL, rác thải nhựa (plastics) được phép xả xuống biển trong điều kiện nào?',
    options: [
      'Tuyệt đối không được phép xả trong bất kỳ trường hợp nào',
      'Được xả khi tàu cách bờ trên 12 hải lý',
      'Được xả khi rác nhựa đã được nghiền mịn dưới 25mm',
      'Được xả ngoài khu vực đặc biệt (Outside Special Areas)'
    ],
    correctIndex: 0,
    explanation: 'MARPOL Annex V nghiêm cấm tuyệt đối việc xả mọi loại rác thải bằng nhựa xuống biển ở mọi nơi, mọi thời điểm.',
    maritimeContext: 'MARPOL Annex V Prevention of Pollution by Garbage'
  }
];
