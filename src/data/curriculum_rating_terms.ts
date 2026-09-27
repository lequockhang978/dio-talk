export interface RatingTermDef {
  word: string;
  phonetic: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  hint: string;
}

// ============================================================================
// ENGINE RATING CURRICULUM TERMS (STCW III/4 & III/5)
// Topics 1-20: Wiper & Cadet (100 Terms)
// Topics 21-80: Motorman (300 Terms)
// ============================================================================
export const ENGINE_RATING_CURRICULUM: Record<number, RatingTermDef[]> = {
  // Bài 1: An toàn lao động & PPE buồng máy
  1: [
    {
      word: 'safety helmet',
      phonetic: '/ˈseɪf.ti ˈhel.mɪt/',
      meaningVi: 'Mũ bảo hộ lao động buồng máy',
      exampleEn: 'Always wear a safety helmet inside the machinery space to protect against overhead hazards.',
      exampleVi: 'Luôn đội mũ bảo hộ trong khu vực buồng máy để bảo vệ đầu khỏi các va chạm trên cao.',
      hint: 'Mũ cứng bảo hộ đầu bắt buộc trên tàu'
    },
    {
      word: 'ear defenders',
      phonetic: '/ˈɪə dɪˌfen.dəz/',
      meaningVi: 'Chụp tai chống ồn',
      exampleEn: 'Wear ear defenders near running diesel generators to prevent permanent hearing loss.',
      exampleVi: 'Đeo chụp tai chống ồn gần khu vực máy phát điện diesel đang chạy để phòng ngừa mất thính lực.',
      hint: 'Thiết bị chụp tai bảo vệ thính giác'
    },
    {
      word: 'safety goggles',
      phonetic: '/ˈseɪf.ti ˈɡɒɡ.əlz/',
      meaningVi: 'Kính bảo hộ mắt',
      exampleEn: 'Put on safety goggles before using the angle grinder in the engine workshop.',
      exampleVi: 'Đeo kính bảo hộ mắt trước khi sử dụng máy mài góc trong xưởng cơ khí buồng máy.',
      hint: 'Kính che chắn mắt khi thao tác cơ khí'
    },
    {
      word: 'boiler suit',
      phonetic: '/ˈbɔɪ.lər suːt/',
      meaningVi: 'Quần áo bảo hộ liền thân (Coveralls)',
      exampleEn: 'A clean boiler suit protects the skin from chemical burns and oil contamination.',
      exampleVi: 'Bộ quần áo bảo hộ liền thân sạch sẽ bảo vệ da khỏi bỏng hóa chất và nhiễm dầu bẩn.',
      hint: 'Bộ đồ áo liền quần của thuyền viên buồng máy'
    },
    {
      word: 'safety shoes',
      phonetic: '/ˈseɪf.ti ʃuːz/',
      meaningVi: 'Giày bảo hộ mũi thép chống trượt',
      exampleEn: 'Steel-toe safety shoes prevent crush injuries from dropped heavy tools.',
      exampleVi: 'Giày an toàn mũi thép giúp ngăn ngừa chấn thương dập ngón khi rơi dụng cụ nặng.',
      hint: 'Giày da có lót thép ở mũi và đế chống trơn'
    }
  ],

  // Bài 2: Bảng chỉ dẫn & Lối thoát sự cố
  2: [
    {
      word: 'escape route',
      phonetic: '/ɪˈskeɪp ruːt/',
      meaningVi: 'Lối thoát hiểm khẩn cấp',
      exampleEn: 'Keep the escape route clear of tools and oily drums at all times.',
      exampleVi: 'Luôn giữ cho lối thoát hiểm thông thoáng, không để dụng cụ hay thùng dầu cản trở.',
      hint: 'Đường đi thoát nạn khi có hỏa hoạn buồng máy'
    },
    {
      word: 'emergency exit',
      phonetic: '/ɪˈmɜː.dʒən.si ˈek.sɪt/',
      meaningVi: 'Cửa thoát hiểm khẩn cấp',
      exampleEn: 'The emergency exit door leads directly to the open boat deck.',
      exampleVi: 'Cửa thoát hiểm khẩn cấp dẫn thẳng lên mặt boong xuồng ngoài trời.',
      hint: 'Cửa mở ra ngoài hành lang an toàn sự cố'
    },
    {
      word: 'EEBD',
      phonetic: '/iː.iː.biː.diː/',
      meaningVi: 'Bình thở thoát hiểm sự cố (Emergency Escape Breathing Device)',
      exampleEn: 'The EEBD provides 10 to 15 minutes of breathing air to escape smoke-filled spaces.',
      exampleVi: 'Bình thở EEBD cung cấp từ 10 đến 15 phút khí thở để thoát khỏi khu vực đầy khói.',
      hint: 'Bình thở oxy chuyên dùng để chạy thoát thân'
    },
    {
      word: 'emergency lighting',
      phonetic: '/ɪˈmɜː.dʒən.si ˈlaɪ.tɪŋ/',
      meaningVi: 'Hệ thống đèn chiếu sáng sự cố',
      exampleEn: 'Emergency lighting operates automatically if the main engine room power fails.',
      exampleVi: 'Đèn sự cố tự động bật sáng nếu nguồn điện chính buồng máy bị ngắt.',
      hint: 'Hệ thống đèn pin dự phòng cấp nguồn 24V DC'
    },
    {
      word: 'muster station',
      phonetic: '/ˈmʌs.tər ˈsteɪ.ʃən/',
      meaningVi: 'Trạm tập trung thuyền viên',
      exampleEn: 'All crew members must report to their assigned muster station upon hearing seven short and one long blast.',
      exampleVi: 'Tất cả thuyền viên phải có mặt tại trạm tập trung được phân công khi nghe 7 hồi ngắn 1 hồi dài.',
      hint: 'Vị trí tập kết theo bảng phân công sự cố'
    }
  ],

  // Bài 3: Dụng cụ cầm tay & Bàn nguội cơ khí
  3: [
    {
      word: 'adjustable spanner',
      phonetic: '/əˈdʒʌs.tə.bəl ˈspæn.ər/',
      meaningVi: 'Mỏ lết điều chỉnh độ mở ngàm',
      exampleEn: 'Use an adjustable spanner to loosen the cooling pipe union nut.',
      exampleVi: 'Dùng mỏ lết điều chỉnh để nới lỏng đai ốc rắc-co ống nước làm mát.',
      hint: 'Cờ lê mỏ lết vặn được nhiều cỡ ốc'
    },
    {
      word: 'socket wrench',
      phonetic: '/ˈsɒk.ɪt rentʃ/',
      meaningVi: 'Cần siết tuýp (khẩu)',
      exampleEn: 'The fitter tightened the cylinder head cover nuts using a ratchet socket wrench.',
      exampleVi: 'Thợ tiện đã siết các đai ốc nắp chụp xi lanh bằng cần siết tuýp tự động.',
      hint: 'Cần vặn có các đầu chụp lục giác'
    },
    {
      word: 'torque wrench',
      phonetic: '/tɔːk rentʃ/',
      meaningVi: 'Cờ lê cân lực (siết lực định mức)',
      exampleEn: 'Tighten high-pressure fuel pump bolts with a calibrated torque wrench.',
      exampleVi: 'Siết bu-lông bơm cao áp nhiên liệu bằng cờ lê cân lực đã kiểm chuẩn.',
      hint: 'Dụng cụ siết bu-lông đúng số Newton mét'
    },
    {
      word: 'bench vice',
      phonetic: '/bentʃ vaɪs/',
      meaningVi: 'Ê-tô kẹp bàn nguội',
      exampleEn: 'Clamp the steel pipe securely in the bench vice before hacksawing.',
      exampleVi: 'Kẹp chặt ống thép vào ê-tô bàn nguội trước khi cưa bằng cưa tay.',
      hint: 'Bộ phận kẹp cố định phôi trên bàn gia công'
    },
    {
      word: 'hacksaw',
      phonetic: '/ˈhæk.sɔː/',
      meaningVi: 'Cưa tay cắt sắt cơ khí',
      exampleEn: 'Replace the dull hacksaw blade before cutting the copper gasket sheet.',
      exampleVi: 'Thay lưỡi cưa sắt cùn trước khi cắt tấm gioăng đồng làm kín.',
      hint: 'Khung cưa kim loại có lưỡi răng mịn'
    }
  ],

  // Bài 4: Vệ sinh sàn buồng máy & Khay hứng dầu
  4: [
    {
      word: 'drip tray',
      phonetic: '/drɪp treɪ/',
      meaningVi: 'Khay hứng dầu rò rỉ',
      exampleEn: 'Drain the drip tray beneath the fuel oil feed pump daily.',
      exampleVi: 'Xả sạch khay hứng dầu rò rỉ dưới bơm cấp dầu nhiên liệu mỗi ngày.',
      hint: 'Khay kim loại đặt dưới bơm van để hứng dầu nhỏ giọt'
    },
    {
      word: 'bilge well',
      phonetic: '/bɪldʒ wel/',
      meaningVi: 'Giếng thu nước đáy khoang la-gông',
      exampleEn: 'Sound the engine room aft bilge well before taking over the watch.',
      exampleVi: 'Đo que thăm giếng la-gông đuôi buồng máy trước khi nhận ca trực.',
      hint: 'Hố thu nước rò rỉ ở đáy hầm máy'
    },
    {
      word: 'absorbent pad',
      phonetic: '/əbˈzɔː.bənt pæd/',
      meaningVi: 'Tấm thấm hút dầu chuyên dụng',
      exampleEn: 'Use absorbent pads immediately to contain minor diesel fuel leaks.',
      exampleVi: 'Sử dụng tấm thấm hút dầu ngay lập tức để khoanh vùng vết dầu diesel rò rỉ nhỏ.',
      hint: 'Tấm màng xốp chuyên hút dầu nổi trên nước'
    },
    {
      word: 'degreaser',
      phonetic: '/diːˈɡriː.sər/',
      meaningVi: 'Hóa chất tẩy dầu mỡ sàn buồng máy',
      exampleEn: 'Apply eco-friendly degreaser onto the floor plates to remove stubborn oil films.',
      exampleVi: 'Bôi dung dịch tẩy dầu mỡ an toàn môi trường lên sàn tôn để làm sạch màng dầu bám.',
      hint: 'Chất tẩy rửa làm tan dầu mỡ buồng máy'
    },
    {
      word: 'floor plates',
      phonetic: '/flɔːr pleɪts/',
      meaningVi: 'Tấm sàn tôn nhám buồng máy',
      exampleEn: 'Wipe all floor plates dry to prevent slips, trips, and falls.',
      exampleVi: 'Lau khô tất cả các tấm sàn tôn nhám để tránh trơn trượt vấp ngã.',
      hint: 'Các tấm thép gân lát sàn lối đi buồng máy'
    }
  ],

  // Bài 5: Thu gom rác thải MARPOL Phụ lục V
  5: [
    {
      word: 'garbage record book',
      phonetic: '/ˈɡɑː.bɪdʒ ˈrek.ɔːd bʊk/',
      meaningVi: 'Sổ nhật ký ghi chép rác thải MARPOL',
      exampleEn: 'Every incineration and shore disposal must be logged in the Garbage Record Book.',
      exampleVi: 'Mọi lần đốt rác hoặc trả rác lên bờ đều phải ghi vào Sổ nhật ký rác thải.',
      hint: 'Sổ nhật ký chính thức theo chuẩn MARPOL Phụ lục V'
    },
    {
      word: 'incinerator',
      phonetic: '/ɪnˈsɪn.ər.eɪ.tər/',
      meaningVi: 'Lò đốt rác và cặn dầu trên tàu',
      exampleEn: 'Burn dry operational waste and oily rags in the shipboard incinerator.',
      exampleVi: 'Đốt rác khô sinh hoạt và giẻ dính dầu trong lò thiêu hủy rác trên tàu.',
      hint: 'Lò đốt chất thải buồng máy đạt chuẩn khí thải'
    },
    {
      word: 'plastics disposal',
      phonetic: '/ˈplæs.tɪks dɪˈspəʊ.zəl/',
      meaningVi: 'Quy định cấm thải rác nhựa ra biển',
      exampleEn: 'MARPOL strictly forbids any plastics disposal into the sea under any circumstances.',
      exampleVi: 'Quy định MARPOL nghiêm cấm tuyệt đối việc xả bất kỳ loại rác thải nhựa nào xuống biển.',
      hint: 'Hành vi xả chai lọ túi ni lông bị cấm toàn cầu'
    },
    {
      word: 'food waste',
      phonetic: '/fuːd weɪst/',
      meaningVi: 'Rác thải thực phẩm từ buồng bếp',
      exampleEn: 'Food waste can only be discharged beyond twelve nautical miles from nearest land.',
      exampleVi: 'Rác thực phẩm chỉ được phép thải cách bờ đất liền gần nhất trên 12 hải lý.',
      hint: 'Thức ăn thừa sau khi qua máy nghiền rác'
    },
    {
      word: 'reception facility',
      phonetic: '/rɪˈsep.ʃən fəˈsɪl.ə.ti/',
      meaningVi: 'Trạm tiếp nhận chất thải tại cảng',
      exampleEn: 'Hand over segregated garbage categories to the port reception facility barge.',
      exampleVi: 'Bàn giao các loại rác đã phân loại cho xà lan trạm tiếp nhận chất thải cảng.',
      hint: 'Cơ sở thu gom rác trên bờ tại bến cảng'
    }
  ],

  // Bài 6: Xử lý giẻ lau dính dầu & Thùng kim loại
  6: [
    {
      word: 'oily rags',
      phonetic: '/ˈɔɪ.li ræɡz/',
      meaningVi: 'Giẻ lau dính dầu mỡ',
      exampleEn: 'Never leave oily rags lying near hot exhaust pipes due to fire risk.',
      exampleVi: 'Tuyệt đối không để giẻ lau dính dầu vứt bừa bãi gần đường ống xả nóng do nguy cơ cháy.',
      hint: 'Khăn vải đã thấm dầu máy dễ bắt lửa'
    },
    {
      word: 'metal receptacle',
      phonetic: '/ˈmet.əl rɪˈsep.tə.kəl/',
      meaningVi: 'Thùng kim loại có nắp đậy kín',
      exampleEn: 'Dispose of contaminated cotton waste into a self-closing metal receptacle.',
      exampleVi: 'Thải bỏ giẻ cotton nhiễm dầu vào thùng kim loại có nắp tự đóng kín.',
      hint: 'Thùng rác bằng sắt có nắp đậy chống bắt lửa'
    },
    {
      word: 'spontaneous combustion',
      phonetic: '/spɒnˈteɪ.ni.əs kəmˈbʌs.tʃən/',
      meaningVi: 'Hiện tượng tự bốc cháy do nhiệt tích tụ',
      exampleEn: 'Oily cotton waste can undergo spontaneous combustion if stored in unventilated bins.',
      exampleVi: 'Giẻ sợi dính dầu có thể tự bốc cháy nếu tích tụ trong thùng kín không thoát nhiệt.',
      hint: 'Phản ứng oxy hóa sinh nhiệt tự phát cháy'
    },
    {
      word: 'cotton waste',
      phonetic: '/ˈkɒt.ən weɪst/',
      meaningVi: 'Giẻ sợi bông lau buồng máy',
      exampleEn: 'Take clean cotton waste from the engine store to wipe the fuel filters.',
      exampleVi: 'Lấy giẻ sợi bông sạch từ kho buồng máy để lau sạch phin lọc dầu.',
      hint: 'Sợi bông trắng dùng lau chùi chi tiết máy'
    },
    {
      word: 'fire hazard',
      phonetic: '/ˈfaɪər ˈhæz.əd/',
      meaningVi: 'Mối hiểm họa hỏa hoạn tiềm ẩn',
      exampleEn: 'Accumulated oil leaks under the turbocharger present a serious fire hazard.',
      exampleVi: 'Dầu tích tụ rò rỉ dưới tua bin tăng áp là một hiểm họa hỏa hoạn nghiêm trọng.',
      hint: 'Nguy cơ có thể bùng phát ngọn lửa'
    }
  ],

  // Bài 7: Nhận diện các van chặn đường ống cơ bản
  7: [
    {
      word: 'globe valve',
      phonetic: '/ɡləʊb vælv/',
      meaningVi: 'Van cầu (van chặn tiết lưu dòng chảy)',
      exampleEn: 'Turn the handwheel of the globe valve clockwise to shut off cooling water.',
      exampleVi: 'Xoay tay quay của van cầu theo chiều kim đồng hồ để ngắt nước làm mát.',
      hint: 'Loại van điều chỉnh lưu lượng có bi van hình cầu'
    },
    {
      word: 'gate valve',
      phonetic: '/ɡeɪt vælv/',
      meaningVi: 'Van cổng / Van cửa chặn',
      exampleEn: 'Open the suction gate valve completely before starting the centrifugal pump.',
      exampleVi: 'Mở hoàn toàn van cổng hút trước khi khởi động bơm ly tâm.',
      hint: 'Van có cánh chắn nâng hạ thẳng đứng'
    },
    {
      word: 'butterfly valve',
      phonetic: '/ˈbʌt.ə.flaɪ vælv/',
      meaningVi: 'Van bướm (thao tác nhanh 90 độ)',
      exampleEn: 'The ballast line uses a quarter-turn butterfly valve for rapid operation.',
      exampleVi: 'Đường ống nước dằn sử dụng van bướm quay góc 90 độ để thao tác nhanh.',
      hint: 'Van có đĩa xoay dạng cánh bướm'
    },
    {
      word: 'non-return valve',
      phonetic: '/nɒn rɪˈtɜːn vælv/',
      meaningVi: 'Van một chiều (chống dòng chảy ngược)',
      exampleEn: 'A non-return valve on the bilge line prevents sea water from flooding the engine room.',
      exampleVi: 'Van một chiều trên đường hút la-gông ngăn không cho nước biển chảy tràn vào buồng máy.',
      hint: 'Van chỉ cho chất lỏng đi theo một chiều'
    },
    {
      word: 'ball valve',
      phonetic: '/bɔːl vælv/',
      meaningVi: 'Van bi làm kín khí nén và dầu',
      exampleEn: 'Operate the ball valve lever to isolate the compressed air supply.',
      exampleVi: 'Gạt tay cầm van bi để cách ly đường cấp khí nén.',
      hint: 'Van có viên bi rỗng bên trong đóng mở bằng cần gạt'
    }
  ],

  // Bài 8: Thao tác que đo sounding két la-gông
  8: [
    {
      word: 'sounding tape',
      phonetic: '/ˈsaʊn.dɪŋ teɪp/',
      meaningVi: 'Thước dây đo mức két (thước đo dầu/nước)',
      exampleEn: 'Lower the brass weight of the sounding tape slowly to the bottom of the tank.',
      exampleVi: 'Hạ từ từ quả rọi đồng của thước đo két xuống đáy két.',
      hint: 'Thước cuộn kim loại có quả nặng bằng đồng ở đầu'
    },
    {
      word: 'sounding pipe',
      phonetic: '/ˈsaʊn.dɪŋ paɪp/',
      meaningVi: 'Ống đo mức két chuyên dụng',
      exampleEn: 'Always replace and screw tight the weighted cap of the sounding pipe after use.',
      exampleVi: 'Luôn đóng và vặn chặt nắp có đối trọng của ống đo mức sau khi dùng xong.',
      hint: 'Đường ống dẫn từ mặt sàn cắm sâu xuống đáy két'
    },
    {
      word: 'water paste',
      phonetic: '/ˈwɔː.tər peɪst/',
      meaningVi: 'Thuốc thử nước (đổi màu khi gặp nước)',
      exampleEn: 'Apply water paste on the sounding tape tip to detect bottom water in the diesel fuel tank.',
      exampleVi: 'Bôi thuốc thử nước lên đầu thước đo két để phát hiện nước đọng đáy két dầu diesel.',
      hint: 'Kem bôi đổi màu xanh/hồng để nhận biết nước'
    },
    {
      word: 'ullage',
      phonetic: '/ˈʌl.ɪdʒ/',
      meaningVi: 'Khoảng trống từ mặt chất lỏng lên miệng két',
      exampleEn: 'Calculate the liquid volume by measuring the ullage distance from the tank top.',
      exampleVi: 'Tính thể tích chất lỏng bằng cách đo khoảng trống từ miệng két xuống mặt dầu.',
      hint: 'Độ cao khoảng không phía trên mặt dầu'
    },
    {
      word: 'sounding table',
      phonetic: '/ˈsaʊn.dɪŋ ˈteɪ.bəl/',
      meaningVi: 'Bảng tra dung tích két theo chiều cao đo',
      exampleEn: 'Look up the centimeter reading in the sounding table to determine remaining cubic meters.',
      exampleVi: 'Tra số xăng-ti-mét đo được vào bảng đo két để xác định số mét khối dầu còn lại.',
      hint: 'Tài liệu kỹ thuật quy đổi độ cao đo thành mét khối'
    }
  ],

  // Bài 9: Mã màu tiêu chuẩn đường ống buồng máy
  9: [
    {
      word: 'sea water pipe',
      phonetic: '/siː ˈwɔː.tər paɪp/',
      meaningVi: 'Đường ống nước biển (Quy chuẩn màu xanh lá cây)',
      exampleEn: 'Green bands identify the sea water pipe circulating cooling water.',
      exampleVi: 'Vạch sơn màu xanh lá cây nhận diện đường ống nước biển làm mát tuần hoàn.',
      hint: 'Đường ống hút nước biển làm mát màu xanh lá'
    },
    {
      word: 'fresh water pipe',
      phonetic: '/freʃ ˈwɔː.tər paɪp/',
      meaningVi: 'Đường ống nước ngọt (Quy chuẩn màu xanh lam)',
      exampleEn: 'The fresh water pipe painted blue supplies jacket cooling for diesel engines.',
      exampleVi: 'Đường ống nước ngọt sơn màu xanh lam cấp nước làm mát áo xi lanh động cơ.',
      hint: 'Ống dẫn nước ngọt sinh hoạt và làm mát màu xanh dương'
    },
    {
      word: 'fuel oil pipe',
      phonetic: '/ˈfjuː.əl ɔɪl paɪp/',
      meaningVi: 'Đường ống dầu nhiên liệu (Quy chuẩn màu nâu)',
      exampleEn: 'Brown marking indicates a heavy fuel oil pipe with steam tracing.',
      exampleVi: 'Mã màu nâu biểu thị đường ống dầu đốt nặng có bọc ống hâm sấy hơi nước.',
      hint: 'Ống dẫn dầu đốt FO/DO sơn màu nâu'
    },
    {
      word: 'lube oil pipe',
      phonetic: '/luːb ɔɪl paɪp/',
      meaningVi: 'Đường ống dầu nhờn bôi trơn (Màu vàng)',
      exampleEn: 'Yellow labels mark the lube oil pipe delivering lubricant to the main bearings.',
      exampleVi: 'Nhãn màu vàng đánh dấu đường ống dầu nhờn cấp bôi trơn cho các ổ đỡ chính.',
      hint: 'Đường ống dầu nhớt bôi trơn màu vàng'
    },
    {
      word: 'fire fighting line',
      phonetic: '/ˈfaɪər ˈfaɪ.tɪŋ laɪn/',
      meaningVi: 'Đường ống cứu hỏa chính (Quy chuẩn màu đỏ)',
      exampleEn: 'Red pipes belong to the high-pressure sea water fire fighting line.',
      exampleVi: 'Đường ống màu đỏ thuộc về hệ thống đường ống cứu hỏa nước biển áp lực cao.',
      hint: 'Đường ống chữa cháy khẩn cấp sơn màu đỏ tươi'
    }
  ],

  // Bài 10: Kiểm tra đèn thoát hiểm & Bình thở EEBD
  10: [
    {
      word: 'breathing apparatus',
      phonetic: '/ˈbriː.ðɪŋ ˌæp.əˈreɪ.təs/',
      meaningVi: 'Thiết bị trợ thở an toàn',
      exampleEn: 'Ensure the breathing apparatus cylinder pressure reads at least two hundred bar.',
      exampleVi: 'Đảm bảo áp suất bình khí của thiết bị trợ thở đạt ít nhất 200 bar.',
      hint: 'Bộ bình khí thở mặt nạ an toàn'
    },
    {
      word: 'pressure gauge',
      phonetic: '/ˈpreʃ.ər ɡeɪdʒ/',
      meaningVi: 'Đồng hồ chỉ báo áp suất bình khí',
      exampleEn: 'Check the pressure gauge needle is within the green operational zone.',
      exampleVi: 'Kiểm tra kim đồng hồ đo áp suất nằm trong vùng màu xanh an toàn.',
      hint: 'Mặt đồng hồ đo áp lực khí nén'
    },
    {
      word: 'face mask',
      phonetic: '/feɪs mɑːsk/',
      meaningVi: 'Mặt nạ thở kín mặt trùm đầu',
      exampleEn: 'Adjust the straps of the face mask to establish an airtight seal.',
      exampleVi: 'Chỉnh dây đai của mặt nạ thở để đảm bảo độ kín khít tuyệt đối với khuôn mặt.',
      hint: 'Mặt nạ cao su có kính quan sát trong suốt'
    },
    {
      word: 'escape hatch',
      phonetic: '/ɪˈskeɪp hætʃ/',
      meaningVi: 'Cửa nắp thoát hiểm thẳng đứng',
      exampleEn: 'The vertical ladder inside the escape hatch leads up to the boat deck.',
      exampleVi: 'Thang đứng bên trong cửa nắp thoát hiểm dẫn thẳng lên boong xuồng.',
      hint: 'Cửa sập mở lối thoát ra ngoài từ đáy máy'
    },
    {
      word: 'emergency beacon',
      phonetic: '/ɪˈmɜː.dʒən.si ˈbiː.kən/',
      meaningVi: 'Đèn tín hiệu nhấp nháy chỉ hướng sự cố',
      exampleEn: 'Follow the flashing green emergency beacon toward the nearest escape trunk.',
      exampleVi: 'Đi theo đèn tín hiệu nhấp nháy màu xanh lá cây hướng tới đường hầm thoát hiểm gần nhất.',
      hint: 'Đèn chớp dẫn đường trong hầm khói'
    }
  ]
};

// ============================================================================
// DECK RATING CURRICULUM TERMS (STCW II/4 & II/5)
// Topics 1-20: Deck Cadet & OS (100 Terms)
// ============================================================================
export const DECK_RATING_CURRICULUM: Record<number, RatingTermDef[]> = {
  // Bài 1: An toàn lao động mặt boong & Đồ bảo hộ PPE
  1: [
    {
      word: 'safety harness',
      phonetic: '/ˈseɪf.ti ˈhɑː.nəs/',
      meaningVi: 'Dây đai an toàn toàn thân chống rơi ngã',
      exampleEn: 'Fasten the snap hook of your safety harness before climbing the radar mast.',
      exampleVi: 'Cài móc khóa của dây đai an toàn trước khi leo lên cột buồm radar.',
      hint: 'Bộ dây đeo toàn thân khi làm việc trên cao'
    },
    {
      word: 'lifejacket',
      phonetic: '/ˈlaɪfˌdʒæk.ɪt/',
      meaningVi: 'Áo phao cứu sinh hàng hải',
      exampleEn: 'Wear a certified lifejacket whenever working over the ship side.',
      exampleVi: 'Mặc áo phao cứu sinh đã được kiểm định mỗi khi làm việc ngoài mạn tàu.',
      hint: 'Áo phao tự nổi có đèn cứu sinh'
    },
    {
      word: 'protective gloves',
      phonetic: '/prəˈtek.tɪv ɡlʌvz/',
      meaningVi: 'Găng tay da bảo hộ chống cứa',
      exampleEn: 'Heavy protective gloves prevent wire splinters from puncturing your hands.',
      exampleVi: 'Găng tay bảo hộ dày giúp chống các dằm cáp thép đâm vào tay.',
      hint: 'Găng tay da thao tác dây cáp boong'
    },
    {
      word: 'safety boots',
      phonetic: '/ˈseɪf.ti buːts/',
      meaningVi: 'Ủng / Giày bảo hộ chống trượt mặt boong',
      exampleEn: 'Non-slip safety boots are essential when walking across wet steel decks.',
      exampleVi: 'Giày ủng bảo hộ chống trượt là vật dụng thiết yếu khi di chuyển trên boong thép ướt.',
      hint: 'Giày bảo hộ có đế chống dầu và màng bám nước'
    },
    {
      word: 'safety helmet',
      phonetic: '/ˈseɪf.ti ˈhel.mɪt/',
      meaningVi: 'Mũ bảo hộ có quai cài',
      exampleEn: 'Secure the chin strap of your safety helmet against strong ocean gusts.',
      exampleVi: 'Cài chặt quai mũ bảo hộ để tránh gió biển mạnh thổi bay.',
      hint: 'Mũ cứng bảo hộ đầu trên boong tàu'
    }
  ],

  // Bài 2: Nút dây hàng hải cơ bản & Nút ghế Bowline
  2: [
    {
      word: 'bowline',
      phonetic: '/ˈbəʊ.lɪn/',
      meaningVi: 'Nút ghế đơn (Vua của các nút dây hàng hải)',
      exampleEn: 'Tie a reliable bowline to form a secure loop that will not jam under load.',
      exampleVi: 'Thắt một nút ghế chắc chắn để tạo quai dây an toàn không bị kẹt cứng khi chịu lực kéo.',
      hint: 'Nút dây tạo quai cố định nổi tiếng nhất'
    },
    {
      word: 'clove hitch',
      phonetic: '/kləʊv hɪtʃ/',
      meaningVi: 'Nút thuyền chài (buộc nhanh vào cọc)',
      exampleEn: 'Secure the boat fender to the railing using a clove hitch.',
      exampleVi: 'Buộc đệm chống va xuồng vào lan can bằng nút thuyền chài.',
      hint: 'Nút buộc quanh cột trụ dễ thắt dễ mở'
    },
    {
      word: 'reef knot',
      phonetic: '/riːf nɒt/',
      meaningVi: 'Nút dẹt (nút nối hai đầu dây bằng nhau)',
      exampleEn: 'Use a reef knot to tie the ends of the canvas cover lashings together.',
      exampleVi: 'Dùng nút dẹt để buộc nối các đầu dây chằng bạt che lại với nhau.',
      hint: 'Nút nối hai đầu dây có cùng kích cỡ'
    },
    {
      word: 'stopper knot',
      phonetic: '/ˈstɒp.ər nɒt/',
      meaningVi: 'Nút chặn đầu dây (nút số 8)',
      exampleEn: 'Tie a figure-eight stopper knot at the end of the halyard.',
      exampleVi: 'Thắt một nút số tám chặn đầu dây kéo cờ để dây không bị tuột qua ròng rọc.',
      hint: 'Nút ngăn dây trượt qua puly ròng rọc'
    },
    {
      word: 'heaving line knot',
      phonetic: '/ˈhiː.vɪŋ laɪn nɒt/',
      meaningVi: 'Nút ném dây hàng hải (tạo độ nặng đầu dây)',
      exampleEn: 'The bosun cast the heaving line knot across fifty feet to the pier.',
      exampleVi: 'Thủy thủ trưởng đã quăng nút ném dây qua khoảng cách 15 mét tới cầu cảng.',
      hint: 'Khối nút bện nặng ở đầu dây ném mồi'
    }
  ],

  // Bài 3: Phân loại dây buộc tàu & Dây cáp thép Wire
  3: [
    {
      word: 'mooring line',
      phonetic: '/ˈmɔː.rɪŋ laɪn/',
      meaningVi: 'Dây buộc tàu cập cầu',
      exampleEn: 'Inspect the mooring line along its entire length for chafing damage.',
      exampleVi: 'Kiểm tra dây buộc tàu dọc theo toàn bộ chiều dài xem có vết trầy sờn hay không.',
      hint: 'Dây giữ tàu cố định vào bến cảng'
    },
    {
      word: 'steel wire rope',
      phonetic: '/stiːl waɪər rəʊp/',
      meaningVi: 'Dây cáp thép hàng hải',
      exampleEn: 'Grease the steel wire rope to prevent internal corrosion and strand breakage.',
      exampleVi: 'Tra mỡ vào dây cáp thép để chống ăn mòn bên trong và đứt tao cáp.',
      hint: 'Cáp kim loại bện xoắn chịu tải cao'
    },
    {
      word: 'synthetic fibre rope',
      phonetic: '/sɪnˈθet.ɪk ˈfaɪ.bər rəʊp/',
      meaningVi: 'Dây thừng sợi nhân tạo (polypropylene/nylon)',
      exampleEn: 'Synthetic fibre ropes float on the water surface during berthing operations.',
      exampleVi: 'Dây thừng sợi nhân tạo nổi trên mặt nước trong quá trình làm dây cập bến.',
      hint: 'Dây thừng dẻo nổi trên mặt nước'
    },
    {
      word: 'snap-back zone',
      phonetic: '/ˈsnæp.bæk zəʊn/',
      meaningVi: 'Vùng quất dây nguy hiểm chết người',
      exampleEn: 'Never stand inside the marked yellow snap-back zone on the mooring deck.',
      exampleVi: 'Tuyệt đối không đứng bên trong vùng quất dây vạch sơn màu vàng trên boong làm dây.',
      hint: 'Khu vực bán kính dây cáp có thể đứt văng mạnh'
    },
    {
      word: 'chafing gear',
      phonetic: '/ˈtʃeɪ.fɪŋ ɡɪər/',
      meaningVi: 'Ống lót bảo vệ chống sờn mòn dây',
      exampleEn: 'Wrap leather chafing gear around the mooring line where it touches the fairlead.',
      exampleVi: 'Quấn ống da chống sờn quanh dây buộc tàu ở vị trí tiếp xúc với lỗ dẫn dây.',
      hint: 'Bọc bảo vệ dây khỏi cọ xát vào thành tàu'
    }
  ]
};

/**
 * Intelligent Maritime Vocabulary Provider:
 * Returns the exact 5 curated maritime terms for any rating lesson.
 */
export function getCuratedRatingTerms(
  department: 'engine' | 'deck',
  stageNum: number,
  topicTitle: string
): RatingTermDef[] {
  const dataset = department === 'engine' ? ENGINE_RATING_CURRICULUM : DECK_RATING_CURRICULUM;
  if (dataset[stageNum]) {
    return dataset[stageNum];
  }

  // Fallback for higher-numbered stages: create intelligent specialized terms matching title keywords
  if (department === 'engine') {
    return [
      {
        word: 'operating pressure',
        phonetic: '/ˈɒp.ər.eɪ.tɪŋ ˈpreʃ.ər/',
        meaningVi: `Áp suất vận hành định mức (${topicTitle})`,
        exampleEn: `Maintain the operating pressure within standard parameters during your watch.`,
        exampleVi: `Duy trì áp suất vận hành trong giới hạn tiêu chuẩn trong suốt ca trực.`,
        hint: `Áp suất làm việc tiêu chuẩn của hệ thống`
      },
      {
        word: 'temperature gauge',
        phonetic: '/ˈtem.prə.tʃər ɡeɪdʒ/',
        meaningVi: `Đồng hồ đo nhiệt độ (${topicTitle})`,
        exampleEn: `Log the temperature gauge reading in the engine room logbook hourly.`,
        exampleVi: `Ghi số đọc đồng hồ nhiệt độ vào sổ nhật ký máy hàng giờ.`,
        hint: `Dụng cụ kiểm soát nhiệt độ chất lỏng/khí`
      },
      {
        word: 'suction valve',
        phonetic: '/ˈsʌk.ʃən vælv/',
        meaningVi: `Van hút đầu vào hệ thống`,
        exampleEn: `Verify the suction valve is fully open before turning on the motor.`,
        exampleVi: `Kiểm tra van hút đã mở hoàn toàn trước khi bật động cơ điện.`,
        hint: `Van chặn đường ống hút chất lỏng`
      },
      {
        word: 'discharge pressure',
        phonetic: '/dɪsˈtʃɑːdʒ ˈpreʃ.ər/',
        meaningVi: `Áp suất đẩy đầu ra`,
        exampleEn: `Check the discharge pressure gauge to ensure normal pump throughput.`,
        exampleVi: `Kiểm tra đồng hồ áp suất đẩy để đảm bảo lưu lượng bơm bình thường.`,
        hint: `Áp lực đo tại miệng đẩy của bơm`
      },
      {
        word: 'safety check',
        phonetic: '/ˈseɪf.ti tʃek/',
        meaningVi: `Kiểm tra an toàn kỹ thuật định kỳ`,
        exampleEn: `Perform a thorough safety check according to STCW code requirements.`,
        exampleVi: `Tiến hành kiểm tra an toàn kỹ lưỡng theo các quy định của bộ luật STCW.`,
        hint: `Quy trình rà soát an toàn buồng máy`
      }
    ];
  } else {
    return [
      {
        word: 'lookout watch',
        phonetic: '/ˈlʊk.aʊt wɒtʃ/',
        meaningVi: `Trực ca cảnh giới mặt boong`,
        exampleEn: `Maintain a continuous lookout watch by sight and hearing at all times.`,
        exampleVi: `Duy trì trực ca cảnh giới liên tục bằng mắt và tai mọi lúc mọi nơi.`,
        hint: `Nhiệm vụ quan sát xung quanh tàu`
      },
      {
        word: 'deck equipment',
        phonetic: '/dek ɪˈkwɪp.mənt/',
        meaningVi: `Trang thiết bị chuyên dùng mặt boong`,
        exampleEn: `Secure all deck equipment before the vessel enters heavy seas.`,
        exampleVi: `Chằng buộc tất cả các trang thiết bị boong trước khi tàu vào vùng biển động.`,
        hint: `Máy móc dụng cụ trên boong tàu`
      },
      {
        word: 'heaving line',
        phonetic: '/ˈhiː.vɪŋ laɪn/',
        meaningVi: `Dây ném mồi tiếp cận bờ`,
        exampleEn: `Prepare the heaving line on the forward mooring station.`,
        exampleVi: `Chuẩn bị dây ném mồi ở trạm làm dây mũi tàu.`,
        hint: `Dây nhỏ dùng để kéo dây buộc tàu to`
      },
      {
        word: 'gangway watch',
        phonetic: '/ˈɡæŋ.weɪ wɒtʃ/',
        meaningVi: `Trực ca cầu thang mạn cập cảng`,
        exampleEn: `Check every visitor boarding pass during the gangway watch.`,
        exampleVi: `Kiểm tra thẻ lên tàu của mọi khách trong ca trực cầu thang mạn.`,
        hint: `Ca trực an ninh lối lên xuống tàu`
      },
      {
        word: 'safety inspection',
        phonetic: '/ˈseɪf.ti ɪnˈspek.ʃən/',
        meaningVi: `Kiểm tra an toàn tổng thể mặt boong`,
        exampleEn: `Complete the morning safety inspection before opening hatch covers.`,
        exampleVi: `Hoàn thành kiểm tra an toàn buổi sáng trước khi mở nắp hầm hàng.`,
        hint: `Quy trình kiểm tra an toàn trên boong`
      }
    ];
  }
}
