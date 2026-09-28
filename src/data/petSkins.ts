export interface PetSkin {
  id: string;
  name: string;
  roleTitle: string;
  price: number; // in 💎 Gems (XP)
  description: string;
  badge: string;
  quote: string;
  themeColor: string;
  hatType: 'beret' | 'hard-hat' | 'officer-cap' | 'captain-cap' | 'pirate-hat' | 'chef-toque' | 'doctor-mirror' | 'diver-helmet' | 'admiral-bicorn';
  outfitType: 'sailor' | 'boiler-suit' | 'white-shirt' | 'captain-coat' | 'cyber-armor' | 'chef-apron' | 'doctor-coat' | 'diving-suit' | 'admiral-uniform';
  accessory: 'none' | 'wrench' | 'sunglasses' | 'binoculars' | 'laser-eye' | 'ladle' | 'stethoscope' | 'flashlight' | 'ceremonial-sword';
}

export const PET_SKINS: PetSkin[] = [
  {
    id: 'cadet',
    name: 'Thủy Thủ Tập Sự',
    roleTitle: 'Deck Cadet',
    price: 0,
    description: 'Bộ đồng phục thủy thủ nhập môn với mũ beret và khăn choàng sọc xanh biển truyền thống.',
    badge: 'MẶC ĐỊNH',
    quote: 'Chào thuyền viên! Mình là Dio, bạn đồng hành trên mọi hải trình!',
    themeColor: '#0284C7',
    hatType: 'beret',
    outfitType: 'sailor',
    accessory: 'none'
  },
  {
    id: 'stoker',
    name: 'Thợ Máy Buồng Lửa',
    roleTitle: 'Engine Stoker',
    price: 500,
    description: 'Bộ đồ yếm thợ máy chống dầu mỡ buồng động cơ, kính bảo hộ hàn xì và cờ-lê mỏ lết.',
    badge: 'HOT BUỒNG MÁY',
    quote: 'Áp suất nồi hơi và nhiệt độ khí xả hôm nay đều chuẩn chỉ, bạn học bài tiếp đi!',
    themeColor: '#EA580C',
    hatType: 'hard-hat',
    outfitType: 'boiler-suit',
    accessory: 'wrench'
  },
  {
    id: 'chef',
    name: 'Bếp Trưởng Hải Trình',
    roleTitle: 'Chief Galley Cook',
    price: 750,
    description: 'Mũ Toque 5 sao kiêu hãnh, tạp dề bếp sạch bóng và muôi vàng nêm nếm vạn dặm sóng gió.',
    badge: 'ĐẦU BẾP TÀU',
    quote: 'Năng lượng học tập đã đầy ắp, thưởng thức trọn vẹn từng từ vựng nhé bạn ơi!',
    themeColor: '#10B981',
    hatType: 'chef-toque',
    outfitType: 'chef-apron',
    accessory: 'ladle'
  },
  {
    id: 'officer',
    name: 'Sĩ Quan Boong Bạch Kim',
    roleTitle: 'Navigation Officer',
    price: 1000,
    description: 'Quân phục sĩ quan trắng tinh khôi, cầu vai vàng 3 sọc và kính phi công thời thượng.',
    badge: 'THANH LỊCH',
    quote: 'Góc bẻ lái 10 độ mạn phải, radar quang đãng, tiến độ học tập xuất sắc!',
    themeColor: '#2563EB',
    hatType: 'officer-cap',
    outfitType: 'white-shirt',
    accessory: 'sunglasses'
  },
  {
    id: 'doctor',
    name: 'Bác Sĩ Hàng Hải',
    roleTitle: 'Ship Medical Officer',
    price: 1400,
    description: 'Áo blouse trắng tinh tươm, gương phản xạ trán y tế và hộp cứu thương sẵn sàng trực chiến.',
    badge: 'CỨU THƯƠNG',
    quote: 'Nhịp tim ổn định, trí nhớ cực tốt! Giữ vững phong độ học tập mỗi ngày nhé!',
    themeColor: '#06B6D4',
    hatType: 'doctor-mirror',
    outfitType: 'doctor-coat',
    accessory: 'stethoscope'
  },
  {
    id: 'captain',
    name: 'Thuyền Trưởng Hải Dương',
    roleTitle: 'Fleet Ship Master',
    price: 1800,
    description: 'Áo bành tô đại cán viền vàng kim, mũ thuyền trưởng quyền uy và ống nhòm viễn dương.',
    badge: 'QUYỀN UY',
    quote: 'Ta tuyên bố: Hải trình hôm nay gió thuận buồm xuôi, thuyền viên hãy tự tin!',
    themeColor: '#D97706',
    hatType: 'captain-cap',
    outfitType: 'captain-coat',
    accessory: 'binoculars'
  },
  {
    id: 'diver',
    name: 'Thợ Lặn Biển Sâu',
    roleTitle: 'Deep Sea Explorer',
    price: 2100,
    description: 'Mũ đồng thau cổ điển chịu áp suất cao, bình dưỡng khí và đèn pin soi rạn san hô.',
    badge: 'VỰC THẲM',
    quote: 'Lặn sâu xuống rãnh Mariana kiến thức để mò tìm những viên ngọc từ vựng quý giá nhất!',
    themeColor: '#0D9488',
    hatType: 'diver-helmet',
    outfitType: 'diving-suit',
    accessory: 'flashlight'
  },
  {
    id: 'cyber_pirate',
    name: 'Hải Tặc Không Gian Cyber',
    roleTitle: 'Cyber Pirate Captain',
    price: 2500,
    description: 'Skin huyền thoại đắt giá: Bịt mắt laser neon, giáp hologram bóng đêm vũ trụ.',
    badge: 'LEGENDARY',
    quote: 'Vượt mọi sóng gió đại dương ảo, không có từ vựng hàng hải nào làm khó được chúng ta!',
    themeColor: '#9333EA',
    hatType: 'pirate-hat',
    outfitType: 'cyber-armor',
    accessory: 'laser-eye'
  },
  {
    id: 'admiral',
    name: 'Đô Đốc Hải Quân',
    roleTitle: 'Supreme Fleet Admiral',
    price: 3200,
    description: 'Skin quý tộc tối cao: Mũ Bicorn đính lông vũ, cầu vai tua vàng hoàng gia và thanh kiếm danh dự.',
    badge: 'TỐI CAO',
    quote: 'Mệnh lệnh của Đô Đốc: Toàn hạm đội giương buồm thẳng tiến, làm chủ mọi hải trình quốc tế!',
    themeColor: '#DC2626',
    hatType: 'admiral-bicorn',
    outfitType: 'admiral-uniform',
    accessory: 'ceremonial-sword'
  }
];
