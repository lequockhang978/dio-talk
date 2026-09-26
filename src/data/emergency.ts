// ============================================================================
// EMERGENCY MARITIME TRAINING SCENARIOS (SECTION 16 MASTER PLAN)
// Compliant with SOLAS, MARPOL, ISM Code Emergency Checklists
// ============================================================================

export interface EmergencyChecklistStep {
  stepNumber: number;
  actionVi: string;
  radioCommandEn: string;
  phoneticAudioEn: string;
  criticalNote: string;
}

export interface EmergencyScenario {
  id: string;
  type: 'fire' | 'mob' | 'collision' | 'grounding' | 'flooding' | 'abandon' | 'medical' | 'pollution';
  title: string;
  icon: string;
  urgencyLevel: 'DISTRESS (MAYDAY)' | 'URGENCY (PAN PAN)' | 'SECURITY';
  overview: string;
  soundAlarmText: string;
  vesselDepartment: 'deck' | 'engine' | 'both';
  steps: EmergencyChecklistStep[];
}

export const EMERGENCY_SCENARIOS: EmergencyScenario[] = [
  {
    id: 'em-fire',
    type: 'fire',
    title: 'Cháy Buồng Máy (Engine Room Fire)',
    icon: '🔥',
    urgencyLevel: 'DISTRESS (MAYDAY)',
    overview: 'Dầu nhiên liệu rò rỉ phun vào ống xả nhiệt độ cao bốc cháy dữ dội ở sàn dưới buồng máy.',
    soundAlarmText: 'Continuous ringing of the general alarm bell and ship whistle for not less than 10 seconds.',
    vesselDepartment: 'both',
    steps: [
      {
        stepNumber: 1,
        actionVi: 'Báo động buồng lái & Rung chuông báo cháy toàn tàu',
        radioCommandEn: 'Fire in the engine room! Sound the general emergency alarm!',
        phoneticAudioEn: 'Fire in the engine room! Sound the general emergency alarm!',
        criticalNote: 'Nhấn nút báo động tại chỗ hoặc gọi điện buồng lái ngay lập tức trước khi dập lửa.'
      },
      {
        stepNumber: 2,
        actionVi: 'Dừng quạt thông gió & Đóng van chặn dầu nhanh (Quick-closing valves)',
        radioCommandEn: 'Stop all engine room ventilation fans and trip the quick-closing fuel valves!',
        phoneticAudioEn: 'Stop all engine room ventilation fans and trip the quick-closing fuel valves!',
        criticalNote: 'Cắt nguồn oxy và nguồn nhiên liệu tiếp tế cho đám cháy.'
      },
      {
        stepNumber: 3,
        actionVi: 'Điểm danh thuyền viên tại trạm tập trung trước khi xả CO2',
        radioCommandEn: 'All crew muster at the emergency station. Conduct roll call immediately.',
        phoneticAudioEn: 'All crew muster at the emergency station. Conduct roll call immediately.',
        criticalNote: 'Tuyệt đối không xả khí CO2 khi chưa xác nhận 100% người đã sơ tán khỏi buồng máy.'
      },
      {
        stepNumber: 4,
        actionVi: 'Bật còi báo động xả CO2 & Mở van chính hệ thống dập lửa CO2',
        radioCommandEn: 'Activate pre-discharge alarm siren. Release fixed CO2 smothering system now!',
        phoneticAudioEn: 'Activate pre-discharge alarm siren. Release fixed CO2 smothering system now!',
        criticalNote: 'Khí CO2 sẽ làm ngạt hoàn toàn không gian buồng máy để triệt tiêu oxy.'
      }
    ]
  },
  {
    id: 'em-mob',
    type: 'mob',
    title: 'Người Rơi Xuống Nước (Man Overboard - MOB)',
    icon: '🏊‍♂️',
    urgencyLevel: 'DISTRESS (MAYDAY)',
    overview: 'Thủy thủ đang làm việc trên boong bị sóng đánh rơi xuống biển mạn phải.',
    soundAlarmText: 'Three long blasts on the ship whistle and general alarm bell (Morse code "Oscar" - - -).',
    vesselDepartment: 'deck',
    steps: [
      {
        stepNumber: 1,
        actionVi: 'Ném phao tròn cứu sinh có đèn khói chỉ vị trí & Hô lớn',
        radioCommandEn: 'Man overboard starboard side! Throw the lifebuoy with smoke signal!',
        phoneticAudioEn: 'Man overboard starboard side! Throw the lifebuoy with smoke signal!',
        criticalNote: 'Phao tròn đánh dấu vị trí nạn nhân ngay lập tức cho người quan sát.'
      },
      {
        stepNumber: 2,
        actionVi: 'Bẻ hết lái về mạn người rơi (Williamson Turn) để tránh chân vịt chém',
        radioCommandEn: 'Hard-a-starboard! Wheel hard-a-starboard! Execute Williamson turn!',
        phoneticAudioEn: 'Hard-a-starboard! Wheel hard-a-starboard! Execute Williamson turn!',
        criticalNote: 'Bẻ lái cùng mạn người rơi sẽ đẩy đuôi tàu và chân vịt ra xa người bị nạn.'
      },
      {
        stepNumber: 3,
        actionVi: 'Nhấn nút đánh dấu MOB trên thiết bị GPS / ECDIS & Cử người cảnh giới',
        radioCommandEn: 'Press MOB button on GPS. Post lookouts with binoculars on the bridge wings.',
        phoneticAudioEn: 'Press MOB button on GPS. Post lookouts with binoculars on the bridge wings.',
        criticalNote: 'Không bao giờ được rời mắt khỏi người bị nạn hoặc cột khói phao cứu sinh.'
      },
      {
        stepNumber: 4,
        actionVi: 'Phát điện khẩn cấp PAN PAN / MAYDAY trên kênh VHF 16',
        radioCommandEn: 'PAN PAN, PAN PAN, PAN PAN. All stations, this is Ocean Pioneer. Person overboard in position.',
        phoneticAudioEn: 'PAN PAN, PAN PAN, PAN PAN. All stations, this is Ocean Pioneer. Person overboard in position.',
        criticalNote: 'Cảnh báo các tàu xung quanh cảnh giới và hỗ trợ tìm kiếm cứu nạn.'
      }
    ]
  },
  {
    id: 'em-grounding',
    type: 'grounding',
    title: 'Mắc Cạn Khẩn Cấp (Vessel Grounding)',
    icon: '⚓',
    urgencyLevel: 'URGENCY (PAN PAN)',
    overview: 'Tàu bị lệch luồng trong dòng chảy xiết và va vào dải cát ngầm ở tốc độ 12 hải lý.',
    soundAlarmText: 'General emergency alarm signal.',
    vesselDepartment: 'both',
    steps: [
      {
        stepNumber: 1,
        actionVi: 'Dừng máy chính ngay lập tức để tránh làm hỏng chân vịt và rách thân',
        radioCommandEn: 'Stop main engine immediately! Ring stop engine on telegraph!',
        phoneticAudioEn: 'Stop main engine immediately! Ring stop engine on telegraph!',
        criticalNote: 'Không cố cài số lùi (Astern) trước khi đo đạc đánh giá mức độ thủng đáy.'
      },
      {
        stepNumber: 2,
        actionVi: 'Đóng kín toàn bộ các cửa kín nước (Watertight doors) trên tàu',
        radioCommandEn: 'Close all watertight doors and fire doors throughout the vessel.',
        phoneticAudioEn: 'Close all watertight doors and fire doors throughout the vessel.',
        criticalNote: 'Khoanh vùng kín nước ngăn nguy cơ chìm dây chuyền nếu rách đáy đôi.'
      },
      {
        stepNumber: 3,
        actionVi: 'Đo mực nước tất cả các két la-gông, két dằn, đáy đôi (Sound all tanks)',
        radioCommandEn: 'Sound all double bottom tanks, bilges, and void spaces. Report water ingress.',
        phoneticAudioEn: 'Sound all double bottom tanks, bilges, and void spaces. Report water ingress.',
        criticalNote: 'Kiểm tra xem két nào có nước biển tràn vào do thủng vỏ.'
      },
      {
        stepNumber: 4,
        actionVi: 'Bật đèn và kéo dấu hiệu ngày tàu mắc cạn (3 đèn đỏ thẳng đứng / 3 quả cầu đen)',
        radioCommandEn: 'Exhibit aground lights: two all-round red lights and anchor lights.',
        phoneticAudioEn: 'Exhibit aground lights: two all-round red lights and anchor lights.',
        criticalNote: 'Báo hiệu theo quy tắc COLREGs Rule 30 để các tàu khác không đâm vào.'
      }
    ]
  },
  {
    id: 'em-pollution',
    type: 'pollution',
    title: 'Sự Cố Tràn Dầu Trên Boong (Oil Spill / SOPEP)',
    icon: '🛢️',
    urgencyLevel: 'URGENCY (PAN PAN)',
    overview: 'Bục ống nhận nhiên liệu bunker làm dầu FO tràn ra mặt boong và nguy cơ chảy xuống biển.',
    soundAlarmText: 'SOPEP Team Muster Signal.',
    vesselDepartment: 'both',
    steps: [
      {
        stepNumber: 1,
        actionVi: 'Ngừng bơm nhận dầu ngay lập tức & Ấn nút dừng khẩn cấp (Emergency Stop)',
        radioCommandEn: 'Stop bunkering pump immediately! Activate emergency shutdown on bunker manifold!',
        phoneticAudioEn: 'Stop bunkering pump immediately! Activate emergency shutdown on bunker manifold!',
        criticalNote: 'Chặn đứng dòng dầu tiếp tục tràn ra.'
      },
      {
        stepNumber: 2,
        actionVi: 'Kiểm tra bịt kín toàn bộ các lỗ thoát nước mặt boong (Scupper plugs)',
        radioCommandEn: 'Check all deck scupper plugs! Ensure no oil escapes overboard into the sea!',
        phoneticAudioEn: 'Check all deck scupper plugs! Ensure no oil escapes overboard into the sea!',
        criticalNote: 'Dầu tràn trên boong chưa bị phạt, nhưng để chảy 1 giọt xuống biển là vi phạm MARPOL.'
      },
      {
        stepNumber: 3,
        actionVi: 'Triển khai hộp chống tràn dầu SOPEP (Phao quây, bột thấm dầu, bơm màng khí)',
        radioCommandEn: 'Deploy SOPEP kit. Rig oil absorbent booms and sawdust around the oil slick.',
        phoneticAudioEn: 'Deploy SOPEP kit. Rig oil absorbent booms and sawdust around the oil slick.',
        criticalNote: 'Thu gom dầu vào thùng chứa chất thải nguy hại.'
      },
      {
        stepNumber: 4,
        actionVi: 'Báo cáo ngay cho Chính quyền Cảng vụ và Đài Duyên hải địa phương (POLREP)',
        radioCommandEn: 'Report oil spill incident to port authority and coastal state as per SOPEP manual.',
        phoneticAudioEn: 'Report oil spill incident to port authority and coastal state as per SOPEP manual.',
        criticalNote: 'Báo cáo trung thực kịp thời theo quy chuẩn Công ước MARPOL Phụ lục I.'
      }
    ]
  }
];
