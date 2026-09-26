import type { LessonNode } from './courses';

export const EXPANDED_MARITIME_NODES: LessonNode[] = [
  // ==========================================================================
  // BAN MÁY (ENGINE) - CẤP 1: THỢ MÁY & HỌC VIÊN MÁY (WIPER / OILER / MOTORMAN)
  // ==========================================================================
  {
    id: 'eng-1-1',
    department: 'engine',
    rankCategory: 'rating',
    rankTitle: 'Thợ máy (Motorman)',
    title: 'Dụng cụ & Trang bị bảo hộ',
    icon: '🧰',
    description: 'Tên gọi các dụng cụ cơ khí buồng máy và đồ bảo hộ an toàn bắt buộc PPE.',
    isUnlocked: true,
    stars: 0,
    terms: [
      {
        id: 'e1-1',
        word: 'workshop',
        phonetic: '/ˈwɜːkʃɒp/',
        meaning: 'xưởng sửa chữa',
        example: 'After removal, the component was taken to the workshop for cleaning and inspection.',
        sentenceBefore: 'After removal, the component was taken to the',
        sentenceAfter: 'for cleaning and inspection.',
        vietnameseSentence: 'Sau khi tháo dỡ, bộ phận này được đưa về xưởng sửa chữa để vệ sinh và kiểm tra.',
        hint: 'Nơi gia công cơ khí trong buồng máy',
        dots: 0,
        mastered: false
      },
      {
        id: 'e1-2',
        word: 'spanner',
        phonetic: '/ˈspænə(r)/',
        meaning: 'cờ lê',
        example: 'Please hand me the adjustable spanner to tighten this pipe flange.',
        sentenceBefore: 'Please hand me the adjustable',
        sentenceAfter: 'to tighten this pipe flange.',
        vietnameseSentence: 'Vui lòng đưa tôi chiếc cờ lê mỏ lết để siết chặt mặt bích ống này.',
        hint: 'Dụng cụ siết ốc vít cơ khí',
        dots: 0,
        mastered: false
      },
      {
        id: 'e1-3',
        word: 'overalls',
        phonetic: '/ˈəʊvərɔːlz/',
        meaning: 'quần áo bảo hộ',
        example: 'Engine crew must wear boiler suit overalls and safety shoes inside the machinery space.',
        sentenceBefore: 'Engine crew must wear boiler suit',
        sentenceAfter: 'and safety shoes inside the machinery space.',
        vietnameseSentence: 'Thuyền viên buồng máy phải mặc quần áo bảo hộ liền thân và đi giày an toàn trong buồng máy.',
        hint: 'Bộ đồ bảo hộ lao động liền thân',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe1-1',
        prompt: 'Nơi đặt bàn nguội, máy tiện và dụng cụ sửa chữa buồng máy gọi là gì?',
        word: 'workshop',
        phonetic: '/ˈwɜːkʃɒp/',
        correctAnswer: 'workshop',
        options: ['workshop', 'wheelhouse', 'galley', 'forecastle'],
        explanation: 'Workshop là xưởng cơ khí kỹ thuật trong buồng máy.'
      }
    ],
    roleplay: {
      partnerRole: 'Sĩ quan máy hai (Second Engineer)',
      initialDialogue: 'Motorman, bring the torque spanner and clean rags down to the bottom platform now.',
      systemPrompt: 'You are the 2nd Engineer instructing the Motorman on engine room maintenance tasks.'
    }
  },
  {
    id: 'eng-1-2',
    department: 'engine',
    rankCategory: 'rating',
    rankTitle: 'Thợ máy (Motorman)',
    title: 'Nhiệm vụ trực ca & Kiểm tra',
    icon: '📋',
    description: 'Đo mức dầu két (sounding), áp suất đồng hồ và ghi chép nhật ký ca máy.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e2-1',
        word: 'sounding',
        phonetic: '/ˈsaʊndɪŋ/',
        meaning: 'đo mức chất lỏng (thước đo két)',
        example: 'Take the sounding of the fuel oil settling tank before starting the shift.',
        sentenceBefore: 'Take the',
        sentenceAfter: 'of the fuel oil settling tank before starting the shift.',
        vietnameseSentence: 'Hãy thả thước đo mức két lắng dầu nhiên liệu trước khi bắt đầu ca trực.',
        hint: 'Thao tác thả thước đo mức dầu/nước trong két',
        dots: 0,
        mastered: false
      },
      {
        id: 'e2-2',
        word: 'bilge',
        phonetic: '/bɪldʒ/',
        meaning: 'nước la-canh buồng máy',
        example: 'Check the bilge wells and ensure no oily water accumulation under the main engine bedplate.',
        sentenceBefore: 'Check the',
        sentenceAfter: 'wells and ensure no oily water accumulation under the main engine bedplate.',
        vietnameseSentence: 'Kiểm tra các hố la-canh và đảm bảo không có nước dầu đọng dưới bệ máy chính.',
        hint: 'Hố thu nước bẩn đáy tàu',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe2-1',
        prompt: 'Thao tác thả thước dây kiểm tra lượng dầu/nước trong két gọi là gì?',
        word: 'sounding',
        phonetic: '/ˈsaʊndɪŋ/',
        correctAnswer: 'sounding',
        options: ['sounding', 'skimming', 'stripping', 'draining'],
        explanation: 'Sounding là việc đo chiều sâu chất lỏng trong két.'
      }
    ],
    roleplay: {
      partnerRole: 'Sĩ quan máy ba (Third Engineer)',
      initialDialogue: 'Did you inspect the main engine lube oil filter differential pressure today?',
      systemPrompt: 'You are the 3rd Engineer questioning the motorman about engine watchkeeping readings.'
    }
  },
  {
    id: 'eng-1-3',
    department: 'engine',
    rankCategory: 'rating',
    rankTitle: 'Thợ máy (Motorman)',
    title: 'Bảo dưỡng Phin lọc & Bơm',
    icon: '⚙️',
    description: 'Vệ sinh phin lọc thô, lọc tinh nhiên liệu và thay thế gioăng đệm bích ống.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e3-1',
        word: 'strainer',
        phonetic: '/ˈstreɪnə(r)/',
        meaning: 'phin lọc thô',
        example: 'Clean the sea chest suction strainer to prevent cooling water pump cavitation.',
        sentenceBefore: 'Clean the sea chest suction',
        sentenceAfter: 'to prevent cooling water pump cavitation.',
        vietnameseSentence: 'Vệ sinh phin lọc thô họng hút la-vanh để tránh hiện tượng xâm thực bơm nước làm mát.',
        hint: 'Bộ lọc rác thô đường ống',
        dots: 0,
        mastered: false
      },
      {
        id: 'e3-2',
        word: 'gasket',
        phonetic: '/ˈɡæskɪt/',
        meaning: 'gioăng đệm làm kín',
        example: 'Always fit a new copper gasket when assembling the high pressure fuel injection pipe.',
        sentenceBefore: 'Always fit a new copper',
        sentenceAfter: 'when assembling the high pressure fuel injection pipe.',
        vietnameseSentence: 'Luôn lắp gioăng đệm đồng mới khi lắp ráp ống phun nhiên liệu cao áp.',
        hint: 'Đệm kín ngăn rò rỉ mặt bích',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe3-1',
        prompt: 'Vật liệu làm kín đặt giữa 2 mặt bích để chống rò rỉ gọi là gì?',
        word: 'gasket',
        phonetic: '/ˈɡæskɪt/',
        correctAnswer: 'gasket',
        options: ['gasket', 'nozzle', 'coupling', 'shim'],
        explanation: 'Gasket là gioăng đệm làm kín chất lỏng/khí.'
      }
    ],
    roleplay: {
      partnerRole: 'Thợ tiện buồng máy (Fitter)',
      initialDialogue: 'We need to overhaul the bilge pump impeller. Help me disconnect the suction valve.',
      systemPrompt: 'You are the Engine Fitter guiding the motorman on pump maintenance.'
    }
  },
  {
    id: 'eng-1-4',
    department: 'engine',
    rankCategory: 'rating',
    rankTitle: 'Thợ máy (Motorman)',
    title: 'Hệ thống Khí nén & Bình gió',
    icon: '💨',
    description: 'Vận hành máy nén khí, xả nước bình tích khí khởi động và van giảm áp.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e1-4-1',
        word: 'compressor',
        phonetic: '/kəmˈpres.ər/',
        meaning: 'máy nén khí',
        example: 'Start the main air compressor to charge the starting air bottles up to 30 bar.',
        sentenceBefore: 'Start the main air',
        sentenceAfter: 'to charge the starting air bottles up to 30 bar.',
        vietnameseSentence: 'Khởi động máy nén khí chính để nạp bình gió khởi động lên mức 30 bar.',
        hint: 'Thiết bị nén khí khởi động máy chính',
        dots: 0,
        mastered: false
      },
      {
        id: 'e1-4-2',
        word: 'drain',
        phonetic: '/dreɪn/',
        meaning: 'xả đọng / xả nước ngưng',
        example: 'Open the drain valve on the air receiver to remove moisture before maneuvering.',
        sentenceBefore: 'Open the',
        sentenceAfter: 'valve on the air receiver to remove moisture before maneuvering.',
        vietnameseSentence: 'Mở van xả đọng trên bình tích khí để xả hết hơi ẩm trước giờ điều động tàu.',
        hint: 'Van xả nước ngưng tụ đáy bình',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe1-4-1',
        prompt: 'Áp suất khí nạp tiêu chuẩn của bình gió khởi động máy chính thường là bao nhiêu?',
        word: '30 bar',
        phonetic: '/ˈθɜː.ti bɑːr/',
        correctAnswer: '30 bar',
        options: ['30 bar', '10 bar', '100 bar', '5 bar'],
        explanation: 'Starting air receiver thường được nén đến áp suất 30 bar.'
      }
    ],
    roleplay: {
      partnerRole: 'Sĩ quan máy ba (Third Engineer)',
      initialDialogue: 'Motorman, start air compressor number 1 and drain the moisture from both air bottles.',
      systemPrompt: 'You are the 3rd Engineer ordering air charging operations.'
    }
  },
  {
    id: 'eng-1-5',
    department: 'engine',
    rankCategory: 'rating',
    rankTitle: 'Thợ máy (Motorman)',
    title: 'Hệ thống Làm mát Nước biển & Nước ngọt',
    icon: '🌊',
    description: 'Kiểm tra van hút đáy biển (sea chest), kẽm chống ăn mòn và sinh hàn trung tâm.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e1-5-1',
        word: 'sea chest',
        phonetic: '/siː tʃest/',
        meaning: 'hộp van hút nước biển (la-vanh đáy/mạn)',
        example: 'Switch from high sea chest to low sea chest suction before entering shallow waters.',
        sentenceBefore: 'Switch from high sea chest to low',
        sentenceAfter: 'suction before entering shallow waters.',
        vietnameseSentence: 'Chuyển từ van hút biển cao sang van hút biển thấp trước khi vào vùng nước nông.',
        hint: 'Hộp lấy nước biển làm mát làm kín vỏ tàu',
        dots: 0,
        mastered: false
      },
      {
        id: 'e1-5-2',
        word: 'anode',
        phonetic: '/ˈæn.əʊd/',
        meaning: 'kẽm chống ăn mòn (anode hy sinh)',
        example: 'Inspect sacrificial zinc anodes inside the central cooler during drydock.',
        sentenceBefore: 'Inspect sacrificial zinc',
        sentenceAfter: 'inside the central cooler during drydock.',
        vietnameseSentence: 'Kiểm tra các thanh kẽm chống ăn mòn hy sinh trong sinh hàn trung tâm khi lên đà.',
        hint: 'Thanh kim loại bảo vệ vỏ máy chống ăn mòn điện hóa',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe1-5-1',
        prompt: 'Cửa hút nước biển chính trên vỏ tàu để cấp cho bơm làm mát gọi là gì?',
        word: 'sea chest',
        phonetic: '/siː tʃest/',
        correctAnswer: 'sea chest',
        options: ['sea chest', 'overboard valve', 'bilge well', 'sounding pipe'],
        explanation: 'Sea chest là hộp van thông biển lấy nước làm mát.'
      }
    ],
    roleplay: {
      partnerRole: 'Sĩ quan máy hai (Second Engineer)',
      initialDialogue: 'Check seawater pressure at main cooling pump discharge. Is it normal?',
      systemPrompt: 'You are the 2nd Engineer checking seawater cooling lines.'
    }
  },

  // ==========================================================================
  // BAN MÁY (ENGINE) - CẤP 2: SĨ QUAN MÁY BA & MÁY HAI (3RD & 2ND ENGINEER)
  // ==========================================================================
  {
    id: 'eng-2-1',
    department: 'engine',
    rankCategory: 'officer',
    rankTitle: 'Sĩ quan máy (3rd/2nd Engineer)',
    title: 'Máy phát điện & Trạm điện chính',
    icon: '⚡',
    description: 'Hòa đồng bộ máy đèn, điều tốc động cơ và xử lý sự cố mất điện toàn tàu (Blackout).',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e4-1',
        word: 'blackout',
        phonetic: '/ˈblækaʊt/',
        meaning: 'mất điện toàn tàu',
        example: 'In case of main switchboard blackout, the emergency generator must start automatically within 45 seconds.',
        sentenceBefore: 'In case of main switchboard',
        sentenceAfter: ', the emergency generator must start automatically within 45 seconds.',
        vietnameseSentence: 'Trong trường hợp mất điện toàn tàu, máy phát điện sự cố phải tự động khởi động trong vòng 45 giây.',
        hint: 'Mất hoàn toàn nguồn điện chính',
        dots: 0,
        mastered: false
      },
      {
        id: 'e4-2',
        word: 'synchronize',
        phonetic: '/ˈsɪŋkrənaɪz/',
        meaning: 'hòa đồng bộ máy phát',
        example: 'Observe the synchroscope carefully before closing the circuit breaker to synchronize diesel generator number 2.',
        sentenceBefore: 'Observe the synchroscope carefully before closing the circuit breaker to',
        sentenceAfter: 'diesel generator number 2.',
        vietnameseSentence: 'Quan sát kỹ đồng hồ hòa điện trước khi đóng áptômát để hòa đồng bộ máy phát số 2.',
        hint: 'Đưa tần số và pha về trùng nhau',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe4-1',
        prompt: 'Thiết bị nào tự động khởi động khi tàu bị Blackout?',
        word: 'emergency generator',
        phonetic: '/ɪˈmɜːdʒənsi ˈdʒenəreɪtə(r)/',
        correctAnswer: 'emergency generator',
        options: ['emergency generator', 'turbocharger', 'incinerator', 'purifier'],
        explanation: 'Emergency generator là máy phát điện sự cố độc lập trên boong.'
      }
    ],
    roleplay: {
      partnerRole: 'Máy hai (Second Engineer)',
      initialDialogue: 'Generator number 1 has high frequency fluctuation. Prepare to parallel generator number 2 immediately.',
      systemPrompt: 'You are the 2nd Engineer commanding power management and generator paralleling.'
    }
  },
  {
    id: 'eng-2-2',
    department: 'engine',
    rankCategory: 'officer',
    rankTitle: 'Sĩ quan máy (3rd/2nd Engineer)',
    title: 'Máy lọc dầu & Nồi hơi phụ',
    icon: '🔥',
    description: 'Vận hành máy ly tâm tách cặn nhiên liệu và điều khiển áp suất hơi nồi hơi.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e5-1',
        word: 'purifier',
        phonetic: '/ˈpjʊərɪfaɪə(r)/',
        meaning: 'máy lọc ly tâm',
        example: 'The heavy fuel oil purifier must operate at 98 degrees Celsius for optimal water separation.',
        sentenceBefore: 'The heavy fuel oil',
        sentenceAfter: 'must operate at 98 degrees Celsius for optimal water separation.',
        vietnameseSentence: 'Máy lọc dầu nặng HFO phải hoạt động ở 98 độ C để đạt hiệu quả tách nước tối ưu.',
        hint: 'Máy ly tâm lọc sạch dầu bẩn',
        dots: 0,
        mastered: false
      },
      {
        id: 'e5-2',
        word: 'blowdown',
        phonetic: '/ˈbləʊdaʊn/',
        meaning: 'xả đáy lò hơi',
        example: 'Execute boiler bottom blowdown daily to remove dissolved solids and prevent scaling.',
        sentenceBefore: 'Execute boiler bottom',
        sentenceAfter: 'daily to remove dissolved solids and prevent scaling.',
        vietnameseSentence: 'Thực hiện xả đáy lò hơi hàng ngày để loại bỏ cặn rắn hòa tan và chống đóng cáu cặn.',
        hint: 'Xả cặn đáy ống lò',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe5-1',
        prompt: 'Thao tác xả nước cặn dưới đáy lò hơi ra ngoài gọi là gì?',
        word: 'blowdown',
        phonetic: '/ˈbləʊdaʊn/',
        correctAnswer: 'blowdown',
        options: ['blowdown', 'soot blowing', 'scavenging', 'backwashing'],
        explanation: 'Boiler blowdown là xả cặn đáy lò hơi.'
      }
    ],
    roleplay: {
      partnerRole: 'Máy trưởng (Chief Engineer)',
      initialDialogue: 'Check the boiler water test results. Phosphate level is low. How much chemical should you add?',
      systemPrompt: 'You are Chief Engineer assessing boiler water chemistry.'
    }
  },
  {
    id: 'eng-2-3',
    department: 'engine',
    rankCategory: 'officer',
    rankTitle: 'Sĩ quan máy (3rd/2nd Engineer)',
    title: 'Hệ thống Làm mát Piston & Sơ-mi',
    icon: '🧊',
    description: 'Tuần hoàn nước ngọt làm mát áo xi lanh HT và dầu nhờn làm mát đỉnh piston.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e2-3-1',
        word: 'jacket cooling water',
        phonetic: '/ˈdʒæk.ɪt ˈkuː.lɪŋ ˈwɔː.tər/',
        meaning: 'nước làm mát áo xi lanh',
        example: 'Maintain jacket cooling water outlet temperature at approximately 85 degrees Celsius.',
        sentenceBefore: 'Maintain',
        sentenceAfter: 'outlet temperature at approximately 85 degrees Celsius.',
        vietnameseSentence: 'Duy trì nhiệt độ đầu ra của nước làm mát áo xi lanh ở khoảng 85 độ C.',
        hint: 'Hệ thống làm mát nhiệt độ cao HT',
        dots: 0,
        mastered: false
      },
      {
        id: 'e2-3-2',
        word: 'cavitation',
        phonetic: '/ˌkæv.ɪˈteɪ.ʃən/',
        meaning: 'hiện tượng xâm thực',
        example: 'Maintain sufficient suction head to prevent pump impeller cavitation.',
        sentenceBefore: 'Maintain sufficient suction head to prevent pump impeller',
        sentenceAfter: '.',
        vietnameseSentence: 'Duy trì cột áp hút đầy đủ để ngăn ngừa xâm thực cánh bơm.',
        hint: 'Bọt khí vỡ làm rỗ cánh bơm',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe2-3-1',
        prompt: 'Hiện tượng bọt khí vỡ gây ăn mòn rỗ bề mặt cánh bơm và cánh chân vịt là gì?',
        word: 'cavitation',
        phonetic: '/ˌkæv.ɪˈteɪ.ʃən/',
        correctAnswer: 'cavitation',
        options: ['cavitation', 'scuffing', 'flaking', 'surging'],
        explanation: 'Cavitation (xâm thực) là sự hình thành và sụp đổ bọt khí trong dòng chất lỏng.'
      }
    ],
    roleplay: {
      partnerRole: 'Máy hai (Second Engineer)',
      initialDialogue: 'High jacket water temperature alarm on cylinder 4. Inspect the thermostatic valve now.',
      systemPrompt: 'You are the 2nd Engineer troubleshooting engine cooling issues.'
    }
  },
  {
    id: 'eng-2-4',
    department: 'engine',
    rankCategory: 'officer',
    rankTitle: 'Sĩ quan máy (3rd/2nd Engineer)',
    title: 'Hệ thống Lạnh & Điều hòa HVAC',
    icon: '❄️',
    description: 'Vận hành máy nén môi chất lạnh R404A/R134a, van tiết lưu và tháp ngưng tụ.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e2-4-1',
        word: 'refrigerant',
        phonetic: '/rɪˈfrɪdʒ.ər.ənt/',
        meaning: 'môi chất lạnh (gas lạnh)',
        example: 'Check for refrigerant leaks around the compressor shaft seal using a halogen leak detector.',
        sentenceBefore: 'Check for',
        sentenceAfter: 'leaks around the compressor shaft seal using a halogen leak detector.',
        vietnameseSentence: 'Kiểm tra rò rỉ gas lạnh quanh phốt trục máy nén bằng máy dò khí halogen.',
        hint: 'Khí gas chạy máy làm lạnh',
        dots: 0,
        mastered: false
      },
      {
        id: 'e2-4-2',
        word: 'expansion valve',
        phonetic: '/ɪkˈspæn.ʃən vælv/',
        meaning: 'van tiết lưu nhiệt',
        example: 'Adjust the thermostatic expansion valve superheat setting to prevent liquid floodback.',
        sentenceBefore: 'Adjust the thermostatic',
        sentenceAfter: 'superheat setting to prevent liquid floodback.',
        vietnameseSentence: 'Điều chỉnh độ quá nhiệt của van tiết lưu nhiệt để ngăn ngừa lỏng về giã máy nén.',
        hint: 'Van giảm áp môi chất lỏng thành hơi',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe2-4-1',
        prompt: 'Van điều tiết lưu lượng và giảm áp gas lỏng vào giàn bay hơi kho lạnh gọi là gì?',
        word: 'expansion valve',
        phonetic: '/ɪkˈspæn.ʃən vælv/',
        correctAnswer: 'expansion valve',
        options: ['expansion valve', 'relief valve', 'quick-closing valve', 'check valve'],
        explanation: 'Thermostatic Expansion Valve (TXV) là van tiết lưu nhiệt.'
      }
    ],
    roleplay: {
      partnerRole: 'Máy hai (Second Engineer)',
      initialDialogue: 'The meat room temperature is rising to plus 2 degrees. Check the expansion valve and sight glass.',
      systemPrompt: 'You are the 2nd Engineer diagnosing reefer plant malfunctions.'
    }
  },

  // ==========================================================================
  // BAN MÁY (ENGINE) - CẤP 3: MÁY TRƯỞNG & ĐẠI DIỆN KỸ THUẬT (CHIEF ENGINEER)
  // ==========================================================================
  {
    id: 'eng-3-1',
    department: 'engine',
    rankCategory: 'management',
    rankTitle: 'Máy trưởng (Chief Engineer)',
    title: 'Kiểm soát Ô nhiễm & Thanh tra PSC',
    icon: '🏅',
    description: 'Nhật ký dầu ORB Part I, thiết bị 15ppm OWS và quy định khí thải MARPOL Annex VI.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e6-1',
        word: 'separator',
        phonetic: '/ˈsepəreɪtə(r)/',
        meaning: 'thiết bị phân ly dầu nước (OWS)',
        example: 'The oily water separator alarm was triggered because effluent exceeded 15 ppm oil content.',
        sentenceBefore: 'The oily water',
        sentenceAfter: 'alarm was triggered because effluent exceeded 15 ppm oil content.',
        vietnameseSentence: 'Báo động thiết bị phân ly dầu nước đã kích hoạt vì nước xả vượt quá hàm lượng dầu 15 ppm.',
        hint: 'Thiết bị OWS 15 ppm bắt buộc theo MARPOL',
        dots: 0,
        mastered: false
      },
      {
        id: 'e6-2',
        word: 'bunkering',
        phonetic: '/ˈbʌŋkərɪŋ/',
        meaning: 'tiếp nhận nhiên liệu',
        example: 'Before starting bunkering operations, both ship and terminal must sign the safety checklist.',
        sentenceBefore: 'Before starting',
        sentenceAfter: 'operations, both ship and terminal must sign the safety checklist.',
        vietnameseSentence: 'Trước khi bắt đầu hoạt động nhận nhiên liệu, cả tàu và cảng phải ký danh mục kiểm tra an toàn.',
        hint: 'Hoạt động bơm dầu nhiên liệu lên tàu',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe6-1',
        prompt: 'Giới hạn hàm lượng dầu tối đa cho phép trong nước la-canh xả ra biển theo MARPOL là bao nhiêu?',
        word: '15 ppm',
        phonetic: '/fɪfˈtiːn piː piː em/',
        correctAnswer: '15 ppm',
        options: ['15 ppm', '50 ppm', '100 ppm', '0 ppm'],
        explanation: 'Theo MARPOL Annex I, nước đáy tàu qua máy OWS không được vượt quá 15 ppm.'
      }
    ],
    roleplay: {
      partnerRole: 'Sĩ quan kiểm tra cảng biển (PSC Inspector)',
      initialDialogue: 'Good morning Chief Engineer. I would like to inspect your Oil Record Book Part 1 and test the 15 ppm bilge alarm 3-way valve.',
      systemPrompt: 'You are a Port State Control Officer inspecting ship marine environment compliance.'
    }
  },
  {
    id: 'eng-3-2',
    department: 'engine',
    rankCategory: 'management',
    rankTitle: 'Máy trưởng (Chief Engineer)',
    title: 'Đăng kiểm Tàu & Giám định Nồi hơi / Trục máy',
    icon: '📜',
    description: 'Quy trình kiểm tra định kỳ của tổ chức đăng kiểm Class (DNV, Lloyd, ClassNK, VR).',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'e3-2-1',
        word: 'deflection',
        phonetic: '/dɪˈflek.ʃən/',
        meaning: 'độ đảo võng trục khuỷu',
        example: 'Take crankshaft deflection measurements before closing the crankcase for Class surveyor inspection.',
        sentenceBefore: 'Take crankshaft',
        sentenceAfter: 'measurements before closing the crankcase for Class surveyor inspection.',
        vietnameseSentence: 'Đo độ võng trục khuỷu trước khi đóng cửa cacte để kiểm tra với đăng kiểm viên.',
        hint: 'Chỉ số đo độ thẳng trục cốt máy',
        dots: 0,
        mastered: false
      },
      {
        id: 'e3-2-2',
        word: 'surveyor',
        phonetic: '/səˈveɪ.ər/',
        meaning: 'đăng kiểm viên / giám định viên',
        example: 'The Class surveyor requested a function test of the quick-closing valves and fire dampers.',
        sentenceBefore: 'The Class',
        sentenceAfter: 'requested a function test of the quick-closing valves and fire dampers.',
        vietnameseSentence: 'Đăng kiểm viên yêu cầu thử chức năng của các van đóng nhanh và van chặn lửa.',
        hint: 'Chuyên gia đăng kiểm tàu',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qe3-2-1',
        prompt: 'Đăng kiểm viên của tổ chức phân cấp tàu biển tiếng Anh gọi là gì?',
        word: 'Class surveyor',
        phonetic: '/klɑːs səˈveɪ.ər/',
        correctAnswer: 'Class surveyor',
        options: ['Class surveyor', 'Port captain', 'Customs officer', 'Stevedore'],
        explanation: 'Class surveyor là đăng kiểm viên phân cấp tàu biển.'
      }
    ],
    roleplay: {
      partnerRole: 'Đăng kiểm viên (Class Surveyor)',
      initialDialogue: 'Chief Engineer, let us begin the annual machinery survey with the emergency fire pump operational test.',
      systemPrompt: 'You are a Lloyd Register Class Surveyor inspecting critical ship safety systems.'
    }
  },

  // ==========================================================================
  // BAN BOONG (DECK) - CẤP 1: THỦY THỦ LÁI & THỦY THỦ TRỰC CA (OS / AB / HELMSMAN)
  // ==========================================================================
  {
    id: 'dck-1-1',
    department: 'deck',
    rankCategory: 'rating',
    rankTitle: 'Thủy thủ lái (Helmsman / AB)',
    title: 'Khẩu lệnh lái tiêu chuẩn IMO',
    icon: '🧭',
    description: 'Khẩu lệnh bẻ lái bánh lái, giữ hướng la bàn và xác nhận mệnh lệnh buồng lái.',
    isUnlocked: true,
    stars: 0,
    terms: [
      {
        id: 'd1-1',
        word: 'midships',
        phonetic: '/ˈmɪdʃɪps/',
        meaning: 'về số 0 (lái về giữa)',
        example: 'When the Officer ordered midships, the helmsman immediately returned the rudder indicator to zero.',
        sentenceBefore: 'When the Officer ordered',
        sentenceAfter: ', the helmsman immediately returned the rudder indicator to zero.',
        vietnameseSentence: 'Khi Sĩ quan ra lệnh "lái về 0", thủy thủ lái lập tức đưa kim đồng hồ góc bẻ lái về vạch số không.',
        hint: 'Lệnh đưa bánh lái về vị trí chính giữa',
        dots: 0,
        mastered: false
      },
      {
        id: 'd1-2',
        word: 'steady',
        phonetic: '/ˈstedi/',
        meaning: 'giữ thẳng hướng',
        example: 'Steady as she goes! Keep heading one-eight-zero degrees.',
        sentenceBefore: 'Steady as she goes! Keep heading',
        sentenceAfter: 'degrees.',
        vietnameseSentence: 'Lái thẳng hướng! Giữ nguyên hướng một-tám-không độ.',
        hint: 'Khẩu lệnh giữ ổn định hướng mũi tàu',
        dots: 0,
        mastered: false
      },
      {
        id: 'd1-3',
        word: 'starboard',
        phonetic: '/ˈstɑːbəd/',
        meaning: 'mạn phải',
        example: 'Starboard ten! Alter course to avoid the fishing vessel ahead.',
        sentenceBefore: 'Starboard ten! Alter course to avoid the fishing vessel ahead.',
        sentenceAfter: '',
        vietnameseSentence: 'Hữu mười! Đổi hướng để tránh tàu cá phía trước mũi.',
        hint: 'Phía bên tay phải của con tàu',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qd1-1',
        prompt: 'Khẩu lệnh yêu cầu đưa bánh lái về đúng tâm 0 độ là gì?',
        word: 'midships',
        phonetic: '/ˈmɪdʃɪps/',
        correctAnswer: 'midships',
        options: ['midships', 'steady', 'hard-a-port', 'ease to five'],
        explanation: '"Midships" là khẩu lệnh IMO SMCP để đưa bánh lái về trung tâm.'
      }
    ],
    roleplay: {
      partnerRole: 'Sĩ quan hoa tiêu (Pilot)',
      initialDialogue: 'Port twenty! Watch your heading, we have strong flood current pushing on starboard quarter.',
      systemPrompt: 'You are a Maritime Pilot giving precise SMCP steering helm orders to the helmsman.'
    }
  },
  {
    id: 'dck-1-2',
    department: 'deck',
    rankCategory: 'rating',
    rankTitle: 'Thủy thủ lái (Helmsman / AB)',
    title: 'Thao tác Dây neo & Cập cầu',
    icon: '⚓',
    description: 'Làm dây mũi lái, thao tác tời neo windlass và an toàn vùng bẫy dây giật snap-back.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'd2-1',
        word: 'heaving',
        phonetic: '/ˈhiːvɪŋ/',
        meaning: 'ném dây ném (dây mồi)',
        example: 'Pass the heaving line to the shore linesmen to pull the heavy forward spring ashore.',
        sentenceBefore: 'Pass the',
        sentenceAfter: 'line to the shore linesmen to pull the heavy forward spring ashore.',
        vietnameseSentence: 'Ném dây mồi nhẹ cho công nhân bắt dây trên cầu cảng để kéo dây chéo mũi nặng lên bờ.',
        hint: 'Quả dọi ném dây mồi cập bến',
        dots: 0,
        mastered: false
      },
      {
        id: 'd2-2',
        word: 'windlass',
        phonetic: '/ˈwɪndləs/',
        meaning: 'tời neo mũi',
        example: 'Operate the anchor windlass brake to let go port anchor under the Chief Officer command.',
        sentenceBefore: 'Operate the anchor',
        sentenceAfter: 'brake to let go port anchor under the Chief Officer command.',
        vietnameseSentence: 'Thao tác phanh tời neo để thả neo mạn trái theo hiệu lệnh của Đại phó.',
        hint: 'Tời tời xích neo phía mũi tàu',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qd2-1',
        prompt: 'Dây mỏng có quả cầu nặng ở đầu để ném lên bờ trước khi kéo dây buộc tàu chính gọi là gì?',
        word: 'heaving line',
        phonetic: '/ˈhiːvɪŋ laɪn/',
        correctAnswer: 'heaving line',
        options: ['heaving line', 'spring line', 'breast line', 'tow line'],
        explanation: 'Heaving line là dây ném (dây mồi).'
      }
    ],
    roleplay: {
      partnerRole: 'Thủy thủ trưởng (Bosun)',
      initialDialogue: 'Stand clear of the snap-back zone! We are taking heave on the forward spring line now.',
      systemPrompt: 'You are the Bosun managing mooring deck safety during berthing operations.'
    }
  },
  {
    id: 'dck-1-3',
    department: 'deck',
    rankCategory: 'rating',
    rankTitle: 'Thủy thủ lái (Helmsman / AB)',
    title: 'Cảnh giới Buồng lái & Tín hiệu Đèn',
    icon: '👀',
    description: 'Thực hiện nhiệm vụ trực cảnh giới (Look-out) và nhận diện đèn mạn, đèn cột.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'd1-3-1',
        word: 'look-out',
        phonetic: '/ˈlʊk.aʊt/',
        meaning: 'người trực cảnh giới / cảnh giới',
        example: 'Maintain a sharp look-out by sight and hearing during restricted visibility.',
        sentenceBefore: 'Maintain a sharp',
        sentenceAfter: 'by sight and hearing during restricted visibility.',
        vietnameseSentence: 'Duy trì cảnh giới nghiêm ngặt bằng mắt nhìn và tai nghe trong điều kiện tầm nhìn xa bị hạn chế.',
        hint: 'Quy tắc trực ca quan sát trên buồng lái',
        dots: 0,
        mastered: false
      },
      {
        id: 'd1-3-2',
        word: 'sidelight',
        phonetic: '/ˈsaɪd.laɪt/',
        meaning: 'đèn mạn (xanh mạn phải, đỏ mạn trái)',
        example: 'A green sidelight indicates the starboard side of an approaching vessel.',
        sentenceBefore: 'A green',
        sentenceAfter: 'indicates the starboard side of an approaching vessel.',
        vietnameseSentence: 'Đèn mạn màu xanh lục chỉ báo mạn phải của con tàu đang đến gần.',
        hint: 'Đèn dẫn đường hai bên sườn tàu',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qd1-3-1',
        prompt: 'Đèn mạn trái của tàu thuyền theo COLREGs có màu gì?',
        word: 'Red',
        phonetic: '/red/',
        correctAnswer: 'Màu đỏ (Red)',
        options: ['Màu đỏ (Red)', 'Màu xanh lục (Green)', 'Màu trắng (White)', 'Màu vàng (Yellow)'],
        explanation: 'Port sidelight màu đỏ (112.5 độ), Starboard sidelight màu xanh lục (112.5 độ).'
      }
    ],
    roleplay: {
      partnerRole: 'Phó hai (Second Officer)',
      initialDialogue: 'Look-out, report what you see on the port bow right now.',
      systemPrompt: 'You are the 2nd Officer testing the AB on visual look-out reporting.'
    }
  },

  // ==========================================================================
  // BAN BOONG (DECK) - CẤP 2: SĨ QUAN PHÓ BA & PHÓ HAI (3RD & 2ND OFFICER)
  // ==========================================================================
  {
    id: 'dck-2-1',
    department: 'deck',
    rankCategory: 'officer',
    rankTitle: 'Sĩ quan phó ba/phó hai (3rd/2nd Officer)',
    title: 'Phòng ngừa va chạm COLREGs 72',
    icon: '🚢',
    description: 'Quy tắc tránh va, xác định tàu nhường đường (Give-way) và tính khoảng cách va chạm (CPA).',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'd3-1',
        word: 'give-way',
        phonetic: '/ˌɡɪv ˈweɪ/',
        meaning: 'tàu phải nhường đường',
        example: 'Under Rule 15 crossing situation, our vessel is the give-way vessel and must take early action to keep well clear.',
        sentenceBefore: 'Under Rule 15 crossing situation, our vessel is the',
        sentenceAfter: 'vessel and must take early action to keep well clear.',
        vietnameseSentence: 'Theo Quy tắc 15 hướng đi cắt nhau, tàu chúng ta là tàu phải nhường đường và phải hành động sớm để tránh xa.',
        hint: 'Tàu có nghĩa vụ tránh đường cho tàu khác',
        dots: 0,
        mastered: false
      },
      {
        id: 'd3-2',
        word: 'closest',
        phonetic: '/ˈkləʊsɪst/',
        meaning: 'khoảng cách tiếp cận gần nhất (CPA)',
        example: 'The ARPA indicates the closest point of approach with the container ship is only 0.3 nautical miles.',
        sentenceBefore: 'The ARPA indicates the',
        sentenceAfter: 'point of approach with the container ship is only 0.3 nautical miles.',
        vietnameseSentence: 'Radar ARPA chỉ ra điểm tiếp cận gần nhất (CPA) với tàu container chỉ còn 0.3 hải lý.',
        hint: 'Chữ C trong từ viết tắt CPA',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qd3-1',
        prompt: 'Thuật ngữ chỉ khoảng cách tiếp cận gần nhất giữa 2 tàu trên Radar ARPA là gì?',
        word: 'CPA',
        phonetic: '/siː piː eɪ/',
        correctAnswer: 'CPA',
        options: ['CPA', 'TCPA', 'ECDIS', 'VTS'],
        explanation: 'CPA là Closest Point of Approach (Khoảng cách tiếp cận gần nhất).'
      }
    ],
    roleplay: {
      partnerRole: 'Thuyền trưởng (Master)',
      initialDialogue: 'Officer of the watch, what is your assessment of target number 4 on the ARPA? What action are you taking?',
      systemPrompt: 'You are the Ship Captain testing the 3rd Officer on collision avoidance regulations COLREGs.'
    }
  },
  {
    id: 'dck-2-2',
    department: 'deck',
    rankCategory: 'officer',
    rankTitle: 'Sĩ quan phó ba/phó hai (3rd/2nd Officer)',
    title: 'Hải đồ điện tử ECDIS & Kế hoạch Hải trình',
    icon: '🗺️',
    description: 'Thiết lập safety contour, hành lang an toàn XTD và giám sát hải trình tự động.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'd2-2-1',
        word: 'waypoint',
        phonetic: '/ˈweɪ.pɔɪnt/',
        meaning: 'điểm chuyển hướng (Waypoint)',
        example: 'Altering course at waypoint 4 to follow the traffic separation scheme lane.',
        sentenceBefore: 'Altering course at',
        sentenceAfter: '4 to follow the traffic separation scheme lane.',
        vietnameseSentence: 'Đổi hướng tại điểm chuyển hướng số 4 để đi vào luồng phân luồng giao thông TSS.',
        hint: 'Điểm tọa độ bẻ lái trên hải đồ',
        dots: 0,
        mastered: false
      },
      {
        id: 'd2-2-2',
        word: 'safety contour',
        phonetic: '/ˈseɪf.ti ˈkɒn.tʊər/',
        meaning: 'đường đẳng sâu an toàn',
        example: 'Calculate and set the safety contour on ECDIS based on current dynamic draft and squat.',
        sentenceBefore: 'Calculate and set the',
        sentenceAfter: 'on ECDIS based on current dynamic draft and squat.',
        vietnameseSentence: 'Tính toán và cài đặt đường đẳng sâu an toàn trên ECDIS dựa vào mớn nước động và độ sụt đuôi.',
        hint: 'Vạch ranh giới độ sâu không được vi phạm trên hải đồ số',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qd2-2-1',
        prompt: 'Đường giới hạn độ sâu trên ECDIS để cảnh báo tàu có nguy cơ mắc cạn gọi là gì?',
        word: 'safety contour',
        phonetic: '/ˈseɪf.ti ˈkɒn.tʊər/',
        correctAnswer: 'safety contour',
        options: ['safety contour', 'cross track error', 'isolated danger mark', 'fairway line'],
        explanation: 'Safety contour đánh dấu ranh giới vùng nước an toàn cho phép mớn nước tàu đi qua.'
      }
    ],
    roleplay: {
      partnerRole: 'Đại phó (Chief Officer)',
      initialDialogue: '2nd Officer, verify the passage plan from Singapore to Rotterdam on both ECDIS units.',
      systemPrompt: 'You are the Chief Officer auditing the passage plan route.'
    }
  },

  // ==========================================================================
  // BAN BOONG (DECK) - CẤP 3: ĐẠI PHÓ & THUYỀN TRƯỞNG (CHIEF MATE & MASTER)
  // ==========================================================================
  {
    id: 'dck-3-1',
    department: 'deck',
    rankCategory: 'management',
    rankTitle: 'Đại phó / Thuyền trưởng (Chief Mate / Master)',
    title: 'Làm hàng & Ổn định tàu (Cargo & Stability)',
    icon: '📦',
    description: 'Tính toán mớn nước, chiều cao tâm nghiêng GM, chằng buộc hàng hóa và mở nắp hầm hàng.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'd3-1-1',
        word: 'lashing',
        phonetic: '/ˈlæʃ.ɪŋ/',
        meaning: 'chằng buộc hàng hóa',
        example: 'Inspect the container twistlocks and lashing bars before departing the container terminal.',
        sentenceBefore: 'Inspect the container twistlocks and',
        sentenceAfter: 'bars before departing the container terminal.',
        vietnameseSentence: 'Kiểm tra khóa gù twistlock và thanh giằng chằng buộc container trước khi rời cảng.',
        hint: 'Dây cáp và thanh sắt giữ cố định hàng hóa',
        dots: 0,
        mastered: false
      },
      {
        id: 'd3-1-2',
        word: 'trim',
        phonetic: '/trɪm/',
        meaning: 'hiệu số mớn nước mũi lái (độ chúi/chúi đuôi)',
        example: 'The vessel is trimmed one meter by the stern for optimal propeller immersion.',
        sentenceBefore: 'The vessel is',
        sentenceAfter: 'one meter by the stern for optimal propeller immersion.',
        vietnameseSentence: 'Tàu có độ chúi lái 1 mét để chân vịt ngập nước tối ưu.',
        hint: 'Chênh lệch độ sâu ngập nước giữa mũi và lái',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qd3-1-1',
        prompt: 'Sự chênh lệch giữa mớn nước lái và mớn nước mũi gọi là gì?',
        word: 'trim',
        phonetic: '/trɪm/',
        correctAnswer: 'trim',
        options: ['trim', 'list', 'heel', 'sagging'],
        explanation: 'Trim là hiệu số giữa mớn nước lái (aft draft) và mớn nước mũi (forward draft).'
      }
    ],
    roleplay: {
      partnerRole: 'Chuyên gia giám định hàng hóa (Cargo Surveyor)',
      initialDialogue: 'Chief Officer, let us review the draft survey calculation and container stowage plan.',
      systemPrompt: 'You are a Cargo Surveyor checking draft survey figures with Chief Mate.'
    }
  },
  {
    id: 'dck-3-2',
    department: 'deck',
    rankCategory: 'management',
    rankTitle: 'Đại phó / Thuyền trưởng (Chief Mate / Master)',
    title: 'Hoa tiêu & Vô tuyến cứu nạn GMDSS',
    icon: '👑',
    description: 'Trao đổi thẻ hoa tiêu (Pilot Card), liên lạc VTS cảng và phát tín hiệu khẩn cấp Mayday.',
    isUnlocked: false,
    stars: 0,
    terms: [
      {
        id: 'd4-1',
        word: 'mayday',
        phonetic: '/ˈmeɪdeɪ/',
        meaning: 'tín hiệu cấp cứu nguy hiểm tính mạng',
        example: 'Transmitting Mayday Mayday Mayday on VHF channel 16 due to uncontained cargo hold fire.',
        sentenceBefore: 'Transmitting',
        sentenceAfter: 'on VHF channel 16 due to uncontained cargo hold fire.',
        vietnameseSentence: 'Phát tín hiệu cấp cứu Mayday trên kênh VHF 16 do cháy hầm hàng không thể kiểm soát.',
        hint: 'Tín hiệu cấp cứu khẩn cấp cao nhất trên biển',
        dots: 0,
        mastered: false
      },
      {
        id: 'd4-2',
        word: 'boarding',
        phonetic: '/ˈbɔːdɪŋ/',
        meaning: 'lên tàu (hoa tiêu lên tàu)',
        example: 'Rig pilot ladder on port side, 1.5 meters above water, pilot boarding speed is 6 knots.',
        sentenceBefore: 'Rig pilot ladder on port side, 1.5 meters above water, pilot',
        sentenceAfter: 'speed is 6 knots.',
        vietnameseSentence: 'Bố trí thang hoa tiêu mạn trái, cao 1.5 mét so với mặt nước, tốc độ đón hoa tiêu lên tàu là 6 hải lý/giờ.',
        hint: 'Thao tác hoa tiêu trèo lên thang mạn',
        dots: 0,
        mastered: false
      }
    ],
    quizzes: [
      {
        id: 'qd4-1',
        prompt: 'Kênh VHF quốc tế tiêu chuẩn dùng cho gọi khẩn cấp và cứu nạn là kênh nào?',
        word: 'Channel 16',
        phonetic: '/ˈtʃænl sɪksˈtiːn/',
        correctAnswer: 'Channel 16',
        options: ['Channel 16', 'Channel 70', 'Channel 12', 'Channel 06'],
        explanation: 'Kênh 16 VHF (156.8 MHz) là kênh trực canh và cấp cứu quốc tế.'
      }
    ],
    roleplay: {
      partnerRole: 'Trạm điều phối giao thông cảng (VTS Center)',
      initialDialogue: 'Ocean Pioneer, this is Singapore VTS. Report your draft, height above water, and intended pilot boarding ground.',
      systemPrompt: 'You are Singapore Vessel Traffic Service (VTS) hailing the inbound vessel.'
    }
  }
];
