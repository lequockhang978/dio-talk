// ============================================================================
// IMO SMCP - STANDARD MARINE COMMUNICATION PHRASES DATASET
// Compliant with IMO Resolution A.918(22)
// ============================================================================

export interface SMCPPhrase {
  id: string;
  marker: 'INSTRUCTION' | 'ADVICE' | 'WARNING' | 'INFORMATION' | 'QUESTION' | 'ANSWER' | 'REQUEST' | 'INTENTION';
  markerVi: string;
  phrase: string;
  vietnamese: string;
  category: 'external' | 'onboard' | 'safety' | 'cargo';
  categoryTitle: string;
  context: string;
  exampleCall: string;
}

export const SMCP_MESSAGE_MARKERS = [
  { code: 'INSTRUCTION', nameVi: 'Chỉ thị bắt buộc', color: '#DC2626', desc: 'Lệnh điều động bắt buộc phải thi hành (VTS/Cảng)' },
  { code: 'ADVICE', nameVi: 'Khuyến cáo hàng hải', color: '#EA580C', desc: 'Lời khuyên điều động an toàn' },
  { code: 'WARNING', nameVi: 'Cảnh báo nguy hiểm', color: '#EAB308', desc: 'Cảnh báo chướng ngại, thời tiết, nguy cơ đâm va' },
  { code: 'INFORMATION', nameVi: 'Thông tin hàng hải', color: '#2563EB', desc: 'Thông báo sự kiện hoặc dữ liệu hải hành' },
  { code: 'QUESTION', nameVi: 'Câu hỏi yêu cầu', color: '#7C3AED', desc: 'Yêu cầu cung cấp thông tin' },
  { code: 'ANSWER', nameVi: 'Câu trả lời', color: '#059669', desc: 'Phản hồi lại câu hỏi trước đó' },
  { code: 'REQUEST', nameVi: 'Đề nghị hỗ trợ', color: '#0284C7', desc: 'Đề nghị dịch vụ (tàu lai, hoa tiêu, cứu hộ)' },
  { code: 'INTENTION', nameVi: 'Dự định điều động', color: '#0D9488', desc: 'Thông báo hành động dự kiến thực hiện' }
] as const;

export const SMCP_PHRASES: SMCPPhrase[] = [
  // --- INSTRUCTION ---
  {
    id: 'smcp-01',
    marker: 'INSTRUCTION',
    markerVi: 'Chỉ thị bắt buộc',
    phrase: 'Do not cross the fairway. Give way to the container vessel.',
    vietnamese: 'Không được cắt ngang luồng. Nhường đường cho tàu container.',
    category: 'external',
    categoryTitle: 'Điều động luồng cảng (VTS)',
    context: 'Đài VTS yêu cầu tàu dừng hành trình cắt luồng khi có tàu lớn đang lưu thông.',
    exampleCall: 'INSTRUCTION. Do not cross the fairway. Maintain current position.'
  },
  {
    id: 'smcp-02',
    marker: 'INSTRUCTION',
    markerVi: 'Chỉ thị bắt buộc',
    phrase: 'Alter course to starboard to zero-eight-zero degrees.',
    vietnamese: 'Đổi hướng sang mạn phải đến 080 độ.',
    category: 'external',
    categoryTitle: 'Chỉ dẫn hướng đi',
    context: 'Hoa tiêu hoặc kiểm soát luồng chỉ định hướng đi an toàn.',
    exampleCall: 'INSTRUCTION. Alter course to starboard to zero-eight-zero degrees immediately.'
  },

  // --- WARNING ---
  {
    id: 'smcp-03',
    marker: 'WARNING',
    markerVi: 'Cảnh báo nguy hiểm',
    phrase: 'You are running into danger. Shallow water ahead of you.',
    vietnamese: 'Bạn đang tiến vào khu vực nguy hiểm. Vùng nước nông ngay phía trước bạn.',
    category: 'safety',
    categoryTitle: 'Cảnh báo an toàn',
    context: 'Cảnh báo tàu đang tiến gần dải đá ngầm hoặc bãi cạn nguy hiểm.',
    exampleCall: 'WARNING. You are running into danger. Shallow water ahead of you. Alter course to port.'
  },
  {
    id: 'smcp-04',
    marker: 'WARNING',
    markerVi: 'Cảnh báo nguy hiểm',
    phrase: 'Risk of collision with vessel on your port bow.',
    vietnamese: 'Có nguy cơ đâm va với tàu bên mạn trái phía mũi.',
    category: 'safety',
    categoryTitle: 'Phòng ngừa va chạm',
    context: 'Cảnh báo mục tiêu radar có khoảng cách tiếp cận gần nhất CPA bằng 0.',
    exampleCall: 'WARNING. Risk of collision with vessel on your port bow. CPA is zero cables.'
  },

  // --- INFORMATION ---
  {
    id: 'smcp-05',
    marker: 'INFORMATION',
    markerVi: 'Thông tin hàng hải',
    phrase: 'Pilot boat is approaching your port side. Rig pilot ladder on port side one meter above water.',
    vietnamese: 'Tàu hoa tiêu đang tiếp cận mạn trái. Chuẩn bị thang hoa tiêu mạn trái cao 1 mét so với mặt nước.',
    category: 'external',
    categoryTitle: 'Đón hoa tiêu',
    context: 'Trao đổi thông tin giữa tàu hoa tiêu và tàu trước khi cập đón.',
    exampleCall: 'INFORMATION. Pilot boat is en route. Rig pilot ladder on port side one meter above water.'
  },
  {
    id: 'smcp-06',
    marker: 'INFORMATION',
    markerVi: 'Thông tin hàng hải',
    phrase: 'Visibility is reduced by fog to less than zero point five nautical miles.',
    vietnamese: 'Tầm nhìn xa bị hạn chế do sương mù xuống dưới 0.5 hải lý.',
    category: 'safety',
    categoryTitle: 'Khí tượng hàng hải',
    context: 'Báo cáo điều kiện tầm nhìn xa hạn chế cho buồng lái và các tàu lân cận.',
    exampleCall: 'INFORMATION. Visibility is reduced by heavy fog. Sound fog signals.'
  },

  // --- QUESTION & ANSWER ---
  {
    id: 'smcp-07',
    marker: 'QUESTION',
    markerVi: 'Câu hỏi yêu cầu',
    phrase: 'What is your present maximum draft?',
    vietnamese: 'Mớn nước tối đa hiện tại của tàu bạn là bao nhiêu?',
    category: 'external',
    categoryTitle: 'Thông số tàu',
    context: 'Đài cảng hoặc hoa tiêu hỏi mớn nước để xếp luồng vào cảng an toàn.',
    exampleCall: 'QUESTION. What is your present maximum draft?'
  },
  {
    id: 'smcp-08',
    marker: 'ANSWER',
    markerVi: 'Câu trả lời',
    phrase: 'My present maximum draft is nine point eight meters.',
    vietnamese: 'Mớn nước tối đa hiện tại của tôi là 9.8 mét.',
    category: 'external',
    categoryTitle: 'Thông số tàu',
    context: 'Báo cáo mớn nước thực tế cho cơ quan chức năng.',
    exampleCall: 'ANSWER. My present maximum draft is nine point eight meters.'
  },

  // --- INTENTION ---
  {
    id: 'smcp-09',
    marker: 'INTENTION',
    markerVi: 'Dự định điều động',
    phrase: 'I intend to pass you port-to-port.',
    vietnamese: 'Tôi dự định sẽ đi qua mạn trái đối mạn trái với tàu bạn.',
    category: 'external',
    categoryTitle: 'Đàm thoại tránh va',
    context: 'Xác nhận phương án tránh va giữa 2 tàu đi đối đầu trên luồng.',
    exampleCall: 'INTENTION. I intend to pass you port-to-port. Keep your course.'
  },
  {
    id: 'smcp-10',
    marker: 'INTENTION',
    markerVi: 'Dự định điều động',
    phrase: 'I will reduce engine speed to slow ahead.',
    vietnamese: 'Tôi sẽ giảm tốc độ máy xuống mức tiến chậm (slow ahead).',
    category: 'onboard',
    categoryTitle: 'Liên lạc máy - boong',
    context: 'Buồng lái thông báo kế hoạch giảm máy cho buồng máy.',
    exampleCall: 'INTENTION. I will reduce engine speed to slow ahead due to dense fog.'
  },

  // --- REQUEST ---
  {
    id: 'smcp-11',
    marker: 'REQUEST',
    markerVi: 'Đề nghị hỗ trợ',
    phrase: 'I require two tugs for berthing.',
    vietnamese: 'Tôi yêu cầu 2 tàu lai hỗ trợ cập cầu.',
    category: 'external',
    categoryTitle: 'Dịch vụ cảng',
    context: 'Tàu liên lạc đài điều phối yêu cầu tàu kéo trước khi vào vũng quay trở.',
    exampleCall: 'REQUEST. I require two harbor tugs with bollard pull forty tons.'
  },
  {
    id: 'smcp-12',
    marker: 'REQUEST',
    markerVi: 'Đề nghị hỗ trợ',
    phrase: 'I require medical assistance. One crew member has sustained a severe burn injury.',
    vietnamese: 'Tôi yêu cầu trợ giúp y tế khẩn cấp. Một thuyền viên bị bỏng nặng.',
    category: 'safety',
    categoryTitle: 'Cấp cứu y tế',
    context: 'Liên lạc đài bờ TMAS xin tư vấn y tế từ xa khi có tai nạn buồng máy.',
    exampleCall: 'PAN PAN. REQUEST. I require medical evacuation assistance immediately.'
  }
];
