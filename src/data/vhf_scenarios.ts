// ============================================================================
// VHF MARITIME RADIO SIMULATOR SCENARIOS
// Standard VHF Communication on Channel 16, 12, 08, 68
// ============================================================================

export interface VHFExchange {
  speakerRole: 'station' | 'ship';
  speakerName: string;
  messageText: string;
  expectedKeywords: string[];
  vietnameseMeaning: string;
  audioVoice?: string;
}

export interface VHFScenario {
  id: string;
  channel: string;
  title: string;
  description: string;
  difficulty: 'A2' | 'B1' | 'B2';
  department: 'deck' | 'engine';
  otherStationName: string;
  stationType: 'VTS' | 'Pilot' | 'Ship' | 'Tug' | 'CoastGuard';
  scenarioContext: string;
  dialogueSteps: VHFExchange[];
}

export const VHF_SCENARIOS: VHFScenario[] = [
  {
    id: 'vhf-01',
    channel: 'CH 16 ➔ CH 12',
    title: 'Liên lạc Đài điều phối cảng VTS (Port Entry Clearance)',
    description: 'Báo cáo mớn nước, vị trí và xin phép tiến vào luồng hàng hải.',
    difficulty: 'B1',
    department: 'deck',
    otherStationName: 'Singapore VTS',
    stationType: 'VTS',
    scenarioContext: 'Tàu bạn đang cách phao luồng chính (Fairway Buoy) 3 hải lý. Bạn cần gọi Singapore VTS trên kênh 16 rồi chuyển kênh làm việc 12.',
    dialogueSteps: [
      {
        speakerRole: 'ship',
        speakerName: 'Ocean Pioneer (Your Ship)',
        messageText: 'Singapore VTS, Singapore VTS. This is Motor Vessel Ocean Pioneer, call sign 3EVF9, on Channel 16. Over.',
        expectedKeywords: ['Singapore VTS', 'Ocean Pioneer', 'Channel 16', 'Over'],
        vietnameseMeaning: 'Đài VTS Singapore, đây là tàu Ocean Pioneer, hô hiệu 3EVF9, trên kênh 16. Xin trả lời.'
      },
      {
        speakerRole: 'station',
        speakerName: 'Singapore VTS',
        messageText: 'Ocean Pioneer, this is Singapore VTS. Switch to Channel 12. Over.',
        expectedKeywords: ['Switch', 'Channel 12'],
        vietnameseMeaning: 'Tàu Ocean Pioneer, đây là VTS Singapore. Hãy chuyển sang kênh làm việc 12. Xin trả lời.'
      },
      {
        speakerRole: 'ship',
        speakerName: 'Ocean Pioneer (Your Ship)',
        messageText: 'Switching to Channel 12. Ocean Pioneer, out.',
        expectedKeywords: ['Switching', 'Channel 12', 'out'],
        vietnameseMeaning: 'Chuyển sang kênh 12. Tàu Ocean Pioneer hết.'
      },
      {
        speakerRole: 'station',
        speakerName: 'Singapore VTS (CH 12)',
        messageText: 'Ocean Pioneer, Singapore VTS on Channel 12. Report your present draft and estimated time of arrival at the fairway buoy. Over.',
        expectedKeywords: ['draft', 'ETA'],
        vietnameseMeaning: 'Ocean Pioneer, VTS trên kênh 12. Hãy báo cáo mớn nước hiện tại và giờ dự kiến đến phao luồng. Xin trả lời.'
      },
      {
        speakerRole: 'ship',
        speakerName: 'Ocean Pioneer (Your Ship)',
        messageText: 'Singapore VTS, my maximum draft is 9.5 meters. ETA fairway buoy is 1030 UTC. Over.',
        expectedKeywords: ['draft', '9.5', 'ETA', '1030', 'Over'],
        vietnameseMeaning: 'Đài VTS, mớn nước tối đa là 9.5m. Giờ đến phao luồng là 10h30 UTC. Xin trả lời.'
      },
      {
        speakerRole: 'station',
        speakerName: 'Singapore VTS',
        messageText: 'Understood Ocean Pioneer. You are clear to enter the fairway. Maintain speed 10 knots. Stand by on Channel 12. Out.',
        expectedKeywords: ['clear', 'enter'],
        vietnameseMeaning: 'Đã rõ Ocean Pioneer. Bạn được phép vào luồng. Giữ tốc độ 10 hải lý/giờ. Trực nghe trên kênh 12. Hết.'
      }
    ]
  },
  {
    id: 'vhf-02',
    channel: 'CH 08',
    title: 'Thỏa thuận tránh va đối đầu (Head-on Collision Avoidance)',
    description: 'Thỏa thuận đổi hướng tránh va mạn trái đối mạn trái theo COLREGs Rule 14.',
    difficulty: 'B1',
    department: 'deck',
    otherStationName: 'Pacific Ruby',
    stationType: 'Ship',
    scenarioContext: 'Trên radar phát hiện một tàu đi đối đầu (head-on) cự ly 4 hải lý, phương vị không đổi, nguy cơ va chạm cao.',
    dialogueSteps: [
      {
        speakerRole: 'ship',
        speakerName: 'Ocean Pioneer (Your Ship)',
        messageText: 'Motor Vessel Pacific Ruby on my bow, this is Ocean Pioneer on Channel 08. Do you read me? Over.',
        expectedKeywords: ['Pacific Ruby', 'Ocean Pioneer', 'Channel 08', 'read me'],
        vietnameseMeaning: 'Tàu Pacific Ruby ngay phía trước mũi, đây là tàu Ocean Pioneer trên kênh 08. Bạn có nghe rõ không? Xin trả lời.'
      },
      {
        speakerRole: 'station',
        speakerName: 'Pacific Ruby',
        messageText: 'Ocean Pioneer, this is Pacific Ruby reading you loud and clear. Go ahead. Over.',
        expectedKeywords: ['loud and clear', 'go ahead'],
        vietnameseMeaning: 'Ocean Pioneer, đây là Pacific Ruby nghe bạn to và rõ. Xin mời nói. Xin trả lời.'
      },
      {
        speakerRole: 'ship',
        speakerName: 'Ocean Pioneer (Your Ship)',
        messageText: 'Pacific Ruby, we are on reciprocal courses. I propose port-to-port passing. I am altering course to starboard now. Over.',
        expectedKeywords: ['port-to-port', 'altering course', 'starboard'],
        vietnameseMeaning: 'Pacific Ruby, chúng ta đang trên hướng đối đầu. Tôi đề xuất đi qua mạn trái đối mạn trái. Tôi đang đổi hướng sang mạn phải ngay bây giờ. Xin trả lời.'
      },
      {
        speakerRole: 'station',
        speakerName: 'Pacific Ruby',
        messageText: 'Agreed Ocean Pioneer. Port-to-port passing. I am also altering course to starboard to increase CPA. Have a safe voyage. Out.',
        expectedKeywords: ['Agreed', 'Port-to-port', 'starboard'],
        vietnameseMeaning: 'Đồng ý Ocean Pioneer. Đi qua mạn trái đối mạn trái. Tôi cũng đang đổi hướng sang phải để tăng cự ly tiếp cận. Chúc hành trình an toàn. Hết.'
      }
    ]
  },
  {
    id: 'vhf-03',
    channel: 'CH 16',
    title: 'Phát tín hiệu cứu nạn khẩn cấp MAYDAY (Distress Call)',
    description: 'Phát điện khẩn cấp khi buồng máy bị cháy lớn mất kiểm soát.',
    difficulty: 'B2',
    department: 'deck',
    otherStationName: 'Coast Guard RCC',
    stationType: 'CoastGuard',
    scenarioContext: 'Buồng máy bốc cháy dữ dội, hệ thống CO2 không dập tắt được, tàu mất hoàn toàn động lực và đang trôi dạt.',
    dialogueSteps: [
      {
        speakerRole: 'ship',
        speakerName: 'Ocean Pioneer (Your Ship)',
        messageText: 'MAYDAY, MAYDAY, MAYDAY. This is Ocean Pioneer, Ocean Pioneer, Ocean Pioneer, call sign 3EVF9, MMSI 574001234.',
        expectedKeywords: ['MAYDAY', 'Ocean Pioneer', 'call sign', 'MMSI'],
        vietnameseMeaning: 'MAYDAY (Cấp cứu)! Đây là tàu Ocean Pioneer, hô hiệu 3EVF9, MMSI 574001234.'
      },
      {
        speakerRole: 'ship',
        speakerName: 'Ocean Pioneer (Your Ship)',
        messageText: 'Position: Latitude 01 degree 15 minutes North, Longitude 103 degrees 45 minutes East. Severe fire in engine room. Total power failure. 22 persons on board. Require immediate fire fighting and rescue assistance. Over.',
        expectedKeywords: ['Position', 'fire', 'engine room', 'persons on board', 'assistance'],
        vietnameseMeaning: 'Vị trí: 01 độ 15 phút Bắc, 103 độ 45 phút Đông. Cháy dữ dội buồng máy. Mất điện toàn bộ. 22 người trên tàu. Yêu cầu cứu hỏa và cứu nạn ngay lập tức. Xin trả lời.'
      },
      {
        speakerRole: 'station',
        speakerName: 'Coast Guard RCC',
        messageText: 'Ocean Pioneer, this is Coast Guard Rescue Coordination Center. Received your Mayday. Helicopter and rescue cutter dispatched to your position. ETA 20 minutes. Prepare lifeboats. Over.',
        expectedKeywords: ['Received', 'Mayday', 'dispatched', 'lifeboats'],
        vietnameseMeaning: 'Ocean Pioneer, đây là Trung tâm Phối hợp Cứu nạn Duyên hải. Đã nhận Mayday của bạn. Trực thăng và tàu cứu nạn đã xuất kích đến vị trí của bạn. ETA 20 phút. Chuẩn bị xuồng cứu sinh. Xin trả lời.'
      }
    ]
  }
];
