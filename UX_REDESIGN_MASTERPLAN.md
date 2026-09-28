# PEAKTALK MARITIME (DIO TALK) - UX/UI REDESIGN MASTERPLAN
## TÀI LIỆU ĐẶC TẢ THIẾT KẾ TRẢI NGHIỆM NGƯỜI DÙNG & TỐI ƯU HÓA KIẾN TRÚC GIAO DIỆN TOÀN DIỆN
**Phiên bản:** 3.0-PRO-MAX  
**Dự án:** PeakTalk / DioTalk Maritime English Application  
**Mục tiêu:** Nâng cấp toàn diện UX/UI đạt tiêu chuẩn ứng dụng giáo dục AAA (Duolingo + Apple Design Award Tier), tối ưu hóa 100% micro-interactions, cơ học nút bấm 3D tactile physics, hệ thống chuyển động 120 FPS, và cấu trúc hóa lại toàn bộ 6.867 dòng của `App.tsx` & 5.744 dòng của `index.css`.

---

## MỤC LỤC CHI TIẾT
1. [Phần 1: Khảo sát Hiện trạng & UX Bottlenecks](#phần-1-khảo-sát-hiện-trạng--ux-bottlenecks)
   - 1.1 Phân tích mã nguồn Monolithic (App.tsx: 6.867 dòng)
   - 1.2 Phân tích hiện trạng StyleSheet (index.css: 5.744 dòng)
   - 1.3 Audit trải nghiệm người dùng (UX Deficiencies & Cognitive Overload)
   - 1.4 Thước đo mục tiêu sau Redesign (Metrics & KPI)
2. [Phần 2: Hệ Thống Ngôn Ngữ Thiết Kế PeakTalk 3.0 (Nautical Tactile Design System)](#phần-2-hệ-thống-ngôn-ngữ-thiết-kế-peaktalk-30)
   - 2.1 Bảng màu cốt lõi & Ngữ nghĩa (Oceanic Palette & Semantic Lighting)
   - 2.2 Hệ thống Typography Động (Fluid Typography & Tabular Figures)
   - 2.3 Hệ thống Elevation, Shadows & Hydro-Glassmorphism
   - 2.4 Token Haptic Feedback & Audio Context Acoustics
3. [Phần 3: Động Lực Học Nút Bấm & Cơ Học 3D Tactile Physics (Button Engineering)](#phần-3-động-lực-học-nút-bấm--cơ-học-3d-tactile-physics)
   - 3.1 Cấu trúc 3D Bevel Compression (Duolingo-Tier Tactical Button)
   - 3.2 Nút PTT (Push-To-Talk) VHF Công Nghệ Sóng Radio Siêu Thực
   - 3.3 Magnetic Action Buttons & Ripple Physics
   - 3.4 Bảng quy chuẩn trạng thái tương tác 8 cấp độ (Idle -> Focus)
4. [Phần 4: Hệ Thống Chuyển Động & Choreography Engine (120 FPS Motion Design)](#phần-4-hệ-thống-chuyển-động--choreography-engine)
   - 4.1 Bảng thông số Spring Physics (Stiffness, Damping, Mass)
   - 4.2 Shared Element Transitions & Route Navigation Morphing
   - 4.3 Stagger Sequences & List Item Orchestration
   - 4.4 Shimmer Skeletons, Micro-Looped Shaders & Particle Sparks
5. [Phần 5: Thiết Kế Chi Tiết Từng Màn Hình (Screen-By-Screen Blueprint)](#phần-5-thiết-kế-chi-tiết-từng-màn-hình)
   - 5.1 Màn hình Onboarding & STCW Department Selection
   - 5.2 Màn hình Home Dashboard (Daily 25 Ring, Streak Flame, Island Carousel)
   - 5.3 Màn hình Career Path / Skill Tree (Interactive SVG Nautical Route)
   - 5.4 Màn hình Vocab Hub & 3D Flashcards (Gyro Tilt & SRS Interface)
   - 5.5 Màn hình SMCP Hub (IMO Standard Marine Communication Phrases)
   - 5.6 Màn hình VHF Radio Simulator (PTT Hardware Rig, Noise Squelch, Waveform)
   - 5.7 Màn hình Emergency Simulation (MAYDAY / PAN PAN Strobe Alert)
   - 5.8 Màn hình Maritime 15 Minigames Suite (Tối ưu chuyển động toàn bộ 15 game)
   - 5.9 Màn hình Marlins Exam Prep (Thi thử hàng hải chuẩn quốc tế)
   - 5.10 Màn hình AI Sea Captain Mentor (3D Voice Orb & Multi-Server Sheet)
   - 5.11 Màn hình Profile, STCW Seaman Passport & Realtime Leaderboard
6. [Phần 6: Tái Cấu Trúc Kiến Trúc Mã Nguồn (Deconstructing Monolith App.tsx)](#phần-6-tái-cấu-trúc-kiến-trúc-mã-nguồn)
   - 6.1 Kiến trúc Module mục tiêu (`/src/screens`, `/src/components`, `/src/hooks`)
   - 6.2 State Management & Store Decomposition
   - 6.3 Danh sách 48 Components Độc lập kèm TypeScript Props
7. [Phần 7: Tái Thiết Toàn Diện File CSS (Modular CSS Architecture)](#phần-7-tái-thiết-toàn-diện-file-css)
   - 7.1 CSS Variables & Design Tokens Dictionary
   - 7.2 Micro-Interaction Keyframes Dictionary
8. [Phần 8: Kế Hoạch Thực Thi Từng Bước (Implementation Roadmap & Sprint Plan)](#phần-8-kế-hoạch-thực-thi-từng-bước)
   - 8.1 Giai đoạn 1: Chuẩn bị Base Tokens & Atomic Button Components
   - 8.2 Giai đoạn 2: Tách nhỏ App.tsx & Navigation Layout Frame
   - 8.3 Giai đoạn 3: Hiện đại hóa Home, Skill Tree & Vocab Hub
   - 8.4 Giai đoạn 4: Bộ giả lập VHF Radio & Tình huống khẩn cấp
   - 8.5 Giai đoạn 5: Minigames, Marlins & AI Captain Suite
   - 8.6 Giai đoạn 6: Leaderboard, Audio/Haptics & QA 60/120 FPS

---

# PHẦN 1: KHẢO SÁT HIỆN TRẠNG & UX BOTTLENECKS

### 1.1 Phân tích mã nguồn Monolithic (App.tsx: 6.867 dòng)
Hiện tại, `peaktalk-app/src/App.tsx` đang gánh chịu toàn bộ trách nhiệm của ứng dụng:
- **Routing & Tab Navigation:** Quản lý `activeTab` ('home' | 'learn' | 'practice' | 'ai' | 'profile'), sub-tabs và hàng chục modals/drawers lồng nhau.
- **State Bloat:** Hơn 85 hooks `useState` và hàng chục `useEffect` chạy chung trong cùng một component root. Bất kỳ một phím bấm, thay đổi giá trị input hay tick timer nào cũng kích hoạt re-render cây DOM khổng lồ gồm hàng ngàn nodes.
- **Lồng ghép logic nghiệp vụ:** Logic tính điểm STCW, SRS spaced repetition, gọi Firebase Firestore, gọi API AI OpenAI-compatible (`DEFAULT_API_URL`), kiểm tra cập nhật APK, xử lý Text-To-Speech và tổng hợp âm thanh Web Audio API đều nằm trộn lẫn với JSX.
- **Hệ quả UX:** 
  - Khung hình bị tụt (dropped frames) trên các thiết bị Android tầm trung khi mở danh sách từ vựng 10.000 từ.
  - Hiệu ứng chuyển cảnh trang không mượt mà do thiếu lifecycle unmount rõ ràng (không dùng được AnimatePresence mượt mà).

### 1.2 Phân tích hiện trạng StyleSheet (index.css: 5.744 dòng)
File `index.css` hiện đạt dung lượng hơn 125 KB với 5.744 dòng:
- Thiếu phân tầng CSS Variables có cấu trúc: Các biến màu như `--primary-blue`, `--primary-orange`, `--dt-navy`, `--dt-aqua` bị phân tán và sử dụng xen kẽ với mã màu hex cứng (`#087e8b`, `#ff7b54`, `#102a43`).
- Hiệu ứng nút bấm chỉ dùng `:active { transform: translateY(2px) }` đơn giản, chưa tạo được cảm giác đàn hồi vật lý cơ học thực thụ (tactile haptic-connected depth).
- Căn chỉnh responsive trên mobile: Thẻ `#root` bị giới hạn `max-width: 440px` ở desktop, nhưng khi sang màn hình di động tai thỏ / đục lỗ (notch/island) thì vùng an toàn `env(safe-area-inset-top)` và `env(safe-area-inset-bottom)` chưa được đồng bộ nhịp nhàng giữa Header và Bottom Tab Bar.

### 1.3 Audit trải nghiệm người dùng (UX Deficiencies & Cognitive Overload)
1. **Thiếu cảm giác xúc giác (Lack of Tactility):** Ứng dụng về Hàng hải và Huấn luyện đàm thoại VHF đòi hỏi cảm giác thao tác trên thiết bị buồng lái (Bridge equipment). Nút đàm thoại PTT hiện tại là nút bấm phẳng, thiếu phản hồi lực nén lò xo và chưa tái hiện được độ trễ phát sóng radio VHF thực tế.
2. **Quá tải thông tin trên Home Dashboard:** Người dùng vừa phải nhìn banner quảng cáo, thẻ streak, vòng tròn Daily 25, danh sách ngành nghề, bộ bài học, cây kỹ năng mà không có thứ bậc thị giác (visual hierarchy) rõ ràng.
3. **Cây kỹ năng (Skill Tree / Career Path):** Chưa có đường nối SVG uốn lượn sống động như dòng hải lưu (Ocean Currents); các nút bài học chưa có hiệu ứng hào quang phát sáng (Bioluminescent Pulse) khi sẵn sàng học, và hiệu ứng mặt nước gợn sóng khi hoàn thành bài.
4. **Màn hình AI Sea Captain:** Chưa có hiệu ứng trực quan hóa giọng nói (3D Voice Orb Visualizer). Giao diện chat hiện tại trông giống ứng dụng nhắn tin văn bản thông thường thay vì một người thuyền trưởng giàu kinh nghiệm đang trực tiếp hướng dẫn qua radio buồng lái.

### 1.4 Thước đo mục tiêu sau Redesign (Metrics & KPI)
| Chỉ số UX/Kỹ thuật | Hiện trạng | Mục tiêu Redesign 3.0 |
| :--- | :--- | :--- |
| Tốc độ khung hình (Frame Rate) | 35 - 50 FPS (lag khi cuộn từ vựng) | 60 - 120 FPS ổn định trên mọi thiết bị |
| Kích thước Component lớn nhất | 6.867 dòng (`App.tsx`) | < 350 dòng / 1 Component |
| Phản hồi xúc giác & âm thanh nút bấm | Đơn giản, độ trễ ~80ms | 3D Depth spring + Web Audio Click < 16ms |
| Mức độ hoàn thành bài học ngày (Retention) | Cơ bản | Tăng 45% nhờ Micro-gamification & 3D Badges |
| Cảm giác đắm chìm hàng hải (Nautical Immersion) | Trung bình (giao diện học từ phẳng) | Cực cao (VHF Hardware, Sonar, Radar Wave) |

---

# PHẦN 2: HỆ THỐNG NGÔN NGỮ THIẾT KẾ PEAKTALK 3.0
## (NAUTICAL TACTILE DESIGN SYSTEM)

### 2.1 Bảng màu cốt lõi & Ngữ nghĩa (Oceanic Palette & Semantic Lighting)
Giao diện áp dụng phong cách **Hydro-Glassmorphism kết hợp Tactile Skeuomorphic Elements** mang phong cách hàng hải hiện đại. Màu sắc lấy cảm hứng từ độ sâu của đại dương (Abyssal Navy), ánh sáng phao tiêu dẫn luồng (Beacon Gold), và màu sơn cứu sinh tiêu chuẩn IMO (Rescue Coral).

```css
:root {
  /* ==========================================================================
     1. DEEP OCEAN FOUNDATION TOKENS
     ========================================================================== */
  --ocean-abyss-950: #050b14;    /* Nền sâu vũ trụ biển cả / Deep background */
  --ocean-abyss-900: #0a1626;    /* Nền card chính / Surface level 1 */
  --ocean-abyss-800: #0f243d;    /* Nền card nâng cao / Surface level 2 */
  --ocean-abyss-700: #19385c;    /* Đường viền phân cách / Subtle border */
  --ocean-abyss-600: #254d7d;    /* Đường viền kích hoạt / Active border */

  /* ==========================================================================
     2. BIOLUMINESCENT ACCENTS (Điểm nhấn phát quang đại dương)
     ========================================================================== */
  --cyan-beam-400: #22d3ee;      /* Radar sweep / Tia quét radar */
  --cyan-beam-500: #06b6d4;      /* Màu chính hải trình / Primary Nautical */
  --cyan-beam-600: #0891b2;      /* Màu đổ bóng nút bấm cyan / Shadow depth */
  --cyan-beam-glow: rgba(6, 182, 212, 0.45);

  --rescue-coral-400: #fb7185;   /* Màu phao cứu sinh / STCW Alert */
  --rescue-coral-500: #f43f5e;   /* Cảnh báo cấp cứu / MAYDAY Action */
  --rescue-coral-600: #e11d48;   /* Đáy nút 3D Coral / Deep Coral Shadow */
  --rescue-coral-glow: rgba(244, 63, 94, 0.5);

  --beacon-gold-400: #fde047;    /* Ánh đèn hải đăng / XP & Coin Glow */
  --beacon-gold-500: #eab308;    /* Huy hiệu STCW / Stars */
  --beacon-gold-600: #ca8a04;    /* Đáy nút vàng 3D / Gold Shadow */

  --hull-emerald-400: #34d399;   /* Trả lời đúng / Correct Pronunciation */
  --hull-emerald-500: #10b981;   /* Đèn tín hiệu mạn phải (Starboard Light) */
  --hull-emerald-600: #059669;   /* Đáy nút xanh lục 3D */

  --port-ruby-500: #ef4444;      /* Đèn tín hiệu mạn trái (Port Light) / Sai */
  --port-ruby-600: #b91c1c;      /* Đáy nút đỏ 3D */

  /* ==========================================================================
     3. LIGHT MODE COUNTERPARTS (Chế độ ban ngày đi biển)
     ========================================================================== */
  --day-surface-0: #f0f7f9;      /* Bọt sóng biển trắng / Seafoam white */
  --day-surface-1: #ffffff;      /* Boong tàu trắng / Pure deck */
  --day-surface-2: #e2eef2;      /* Khung viền kim loại / Metallic hull */
  --day-text-main: #0c2135;      /* Chữ xanh đen đậm / Marine dark text */
  --day-text-sub: #486581;       /* Chữ phụ hải trình / Subtitle slate */
}
```

### 2.2 Hệ thống Typography Động (Fluid Typography & Tabular Figures)
Font chữ chủ đạo: **Plus Jakarta Sans** (cung cấp nét hình học hiện đại, góc bo thân thiện) kết hợp **JetBrains Mono** cho các thông số hải trình (tọa độ, kinh độ/vĩ độ, tần số VHF, đồng hồ đếm ngược Marlins):

```css
/* Typography Scale */
--text-display: clamp(1.75rem, 5vw, 2.25rem); /* Tiêu đề lớn Onboarding / Level Up */
--text-h1: clamp(1.35rem, 4vw, 1.65rem);      /* Tên học phần / Cấp bậc STCW */
--text-h2: clamp(1.15rem, 3.5vw, 1.35rem);    /* Tên bài học / Tiêu đề Card */
--text-body-lg: 1.05rem;                      /* Nội dung câu hỏi phát âm */
--text-body-md: 0.935rem;                     /* Nội dung định nghĩa thuật ngữ */
--text-caption: 0.8125rem;                    /* Nhãn phụ, badge, kinh nghiệm */
--text-mono: 'JetBrains Mono', monospace;     /* Kênh VHF: 156.800 MHz (CH 16) */
```

### 2.3 Hệ thống Elevation, Shadows & Hydro-Glassmorphism
Khác với đổ bóng thông thường bị mờ đục, hệ thống Hydro-Glassmorphism của PeakTalk 3.0 kết hợp phản xạ ánh sáng mặt nước và viền phản quang:

```css
/* Glassmorphism Classes */
.hydro-glass-panel {
  background: rgba(15, 36, 61, 0.72);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(34, 211, 238, 0.18);
  box-shadow: 
    0 8px 32px 0 rgba(2, 6, 23, 0.37),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.15);
}

.hydro-glass-card {
  background: linear-gradient(135deg, rgba(25, 56, 92, 0.6) 0%, rgba(10, 22, 38, 0.85) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
}
```

### 2.4 Token Haptic Feedback & Audio Context Acoustics
PeakTalk 3.0 tích hợp trực tiếp xung rung cảm biến vật lý (Tactile Engine) và hệ thống âm thanh tần số thấp/cao được tổng hợp trong `soundService.ts`:
- **Tick nhẹ (Soft Tap):** Rung 15ms khi chạm nút điều hướng.
- **Spring Lock (Nén lò xo):** Rung 25ms khi bấm giữ PTT hoặc thẻ bài học.
- **Thành công (Starboard Chime):** Rung kép [30ms, 40ms, 60ms] kèm hợp âm Pentatonic E5 -> G5 -> C6.
- **Cảnh báo (Mayday Pulse):** Rung liên hồi [70ms, 50ms, 70ms] kèm còi hiệu Morse cứu nạn.

---

# PHẦN 3: ĐỘNG LỰC HỌC NÚT BẤM & CƠ HỌC 3D TACTILE PHYSICS
## (BUTTON ENGINEERING SPECIFICATION)

### 3.1 Cấu trúc 3D Bevel Compression (Duolingo-Tier Tactical Button)
Nút bấm thông thường trên web chỉ thay đổi màu nền hoặc lùi 1-2px, mang lại cảm giác "nhạt nhòa". Nút bấm PeakTalk 3.0 được thiết kế với kiến trúc **4 lớp vật lý (4-Layer Physics Engine)**:
1. **Lớp Đế (Shadow Floor):** Nằm thấp nhất, tạo bóng đổ 4-6px dưới đáy theo màu sắc đậm hơn 20-30% so với mặt nút.
2. **Lớp Thân 3D (Extrusion Body):** Khối viền nổi tạo độ dày 4px đến 8px mô phỏng bề mặt cao su công nghiệp trên tàu biển.
3. **Lớp Mặt Nút (Face Cap):** Bề mặt tiếp xúc chính có gradient ánh sáng từ trên xuống.
4. **Lớp Phản Quang (Specular Highlight):** Đường gờ trên cùng dày 1px có độ sáng 40% để tạo độ bóng cao cấp.

```
       ┌───────────────────────────────┐  <--- Specular Highlight (1px trắng mờ)
       │         MẶT NÚT (Face)        │
   ┌───┴───────────────────────────────┴───┐
   │        THÂN NÚT 3D (Bevel Lip)        │  <--- Dày 4px - 6px khi nghỉ
   └───────────────────────────────────────┘
   ░░░░░░░░░░ BÓNG ĐẾ VẬT LÝ ░░░░░░░░░░░░░  <--- Shadow Floor (Bóng đổ lan tỏa)
```

#### Quy tắc biến thiên tọa độ khi nhấn (Kinetic Press Mechanics):
- **Trạng thái Nghỉ (Idle):** Mặt nút ở vị trí `translateY(0)`, thân nút dày `6px`, bóng đế dày `8px`.
- **Trạng thái Nhấn (Active/Pressed):**
  - Mặt nút lập tức dịch chuyển xuống `translateY(5px)`.
  - Thân nút co lại chỉ còn `1px` (mô phỏng nén lò xo hoàn toàn).
  - Bóng đế thu lại còn `2px`.
  - Âm thanh "Pop-Click" cơ học kích hoạt trong vòng `< 8ms`.
  - Phản hồi rung haptic rung nhẹ `18ms`.
- **Trạng thái Nhả (Release/Spring Return):** Nút nảy vượt vị trí ban đầu `-1px` rồi trở về `0px` theo hàm nảy lò xo `cubic-bezier(0.34, 1.56, 0.64, 1)`.

#### Mã CSS Đặc tả Nút bấm 3D Đa dụng (`.btn-3d`):
```css
/* ==========================================================================
   PEAKTALK 3D TACTILE BUTTON SYSTEM
   ========================================================================== */
.btn-3d {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.02em;
  padding: 14px 24px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 120ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, box-shadow;
  transform: translateY(0);
}

/* NÚT CYAN BIỂN CHÍNH (Primary Nautical Action) */
.btn-3d-cyan {
  background: linear-gradient(180deg, #22d3ee 0%, #0891b2 100%);
  color: #042137;
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.4) inset,   /* Specular rim */
    0 6px 0 #0e5b72,                           /* 3D Extrusion Lip */
    0 12px 20px rgba(8, 145, 178, 0.35);       /* Ambient Floor Glow */
}

.btn-3d-cyan:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 7px 0 #0e5b72,
    0 15px 24px rgba(8, 145, 178, 0.45);
}

.btn-3d-cyan:active,
.btn-3d-cyan.is-pressed {
  transform: translateY(5px);
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.2) inset,
    0 1px 0 #0e5b72,
    0 4px 8px rgba(8, 145, 178, 0.25);
  transition-duration: 40ms;
}

/* NÚT CORAL CỨU SINH / THỰC HIỆN / ĐÁP ÁN ĐÚNG (Rescue Coral) */
.btn-3d-coral {
  background: linear-gradient(180deg, #fb7185 0%, #e11d48 100%);
  color: #ffffff;
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.45) inset,
    0 6px 0 #9f1239,
    0 12px 20px rgba(225, 29, 72, 0.35);
}

.btn-3d-coral:active {
  transform: translateY(5px);
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.2) inset,
    0 1px 0 #9f1239,
    0 4px 8px rgba(225, 29, 72, 0.25);
  transition-duration: 40ms;
}

/* NÚT VÀNG HẢI ĐĂNG (Beacon Gold) */
.btn-3d-gold {
  background: linear-gradient(180deg, #fde047 0%, #ca8a04 100%);
  color: #422006;
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.5) inset,
    0 6px 0 #854d0e,
    0 12px 20px rgba(202, 138, 4, 0.35);
}

.btn-3d-gold:active {
  transform: translateY(5px);
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.2) inset,
    0 1px 0 #854d0e,
    0 4px 8px rgba(202, 138, 4, 0.25);
  transition-duration: 40ms;
}
```

### 3.2 Nút PTT (Push-To-Talk) VHF Công Nghệ Sóng Radio Siêu Thực
Nút phát sóng bộ đàm VHF là linh hồn của việc đào tạo đàm thoại hàng hải SMCP. Không thể dùng một icon Micro bình thường, mà phải thiết kế **khối cầm tay bộ đàm thực tế (Heavy-Duty Industrial Marine PTT)**:
- **Đường kính nút:** 88px, bo tròn hoàn hảo dạng phím ấn công nghiệp có gân chống trượt (Ridged Texture).
- **Trạng thái Lắng nghe (RX / Standby):**
  - Viền xanh dương phát quang nhấp nháy chu kỳ 3s như radar quét biển.
  - Chữ hiển thị: `HOLD TO TRANSMIT` (Nhấn giữ để phát sóng).
- **Trạng thái Phát sóng (TX / Transmitting):**
  - Khi ngón tay chạm xuống (`pointerdown`): Nút lún sâu 6px, đèn viền đổi ngay sang màu đỏ rực hổ phách (Emergency TX Amber).
  - Tần số âm thanh tiếng xì nhiễu vô tuyến (White Noise Squelch Burst) phát ra trong 60ms.
  - Vòng sóng âm thanh tròn (Sonar Wave Ripple) tỏa ra liên tục từ tâm nút theo bán kính 160px.
  - Hiển thị thanh đo âm lượng Mic thực tế (VU Meter) chạy theo thời gian thực.
- **Trạng thái Thả ra (`pointerup`):**
  - Phát tiếng bíp ngắt sóng radio chuẩn hải quân ("Roger Beep" 800Hz / 45ms).
  - Chấm dứt thu âm và đưa giọng nói vào bộ phân tích AI.

```
          ┌───────────────────────────┐
       ╱                                 ╲
     │           RADIO FREQUENCY           │
     │      156.800 MHz (VHF CH 16)        │
       ╲                                 ╱
          └─────────────┬─────────────┘
                        │
                ┌───────┴───────┐
             ╱     ((( 🔴 )))     ╲    <--- Đèn báo trạng thái TX Active
           │    P U S H - T O     │
           │    T A L K ( PTT )   │    <--- Nén lò xo 6px khi ngón tay giữ
             ╲     [ TRANSMIT ]  ╱
                └───────────────┘
```

### 3.3 Magnetic Action Buttons & Ripple Physics
Tất cả các thẻ bài học nhỏ, biểu tượng tùy chọn hoặc các nút phụ đều có hiệu ứng **Magnetic Cursor (trên Web) và Spring Damping Touch (trên Điện thoại)**:
- Ngay khi người dùng chạm vào phần tử, một điểm phản quang lan tỏa (Radial Glow Wave) xuất hiện chính xác tại tọa độ `(e.clientX, e.clientY)`.
- Khi trượt nhẹ ngón tay trên thẻ bài học, thẻ nghiêng 3D theo góc nghiêng ngón tay (3D Tilt Parallax: tối đa `rotateX(6deg) rotateY(6deg)`).

### 3.4 Bảng quy chuẩn trạng thái tương tác 8 cấp độ (Interaction States)
Mọi component tương tác đều phải tuân thủ 8 trạng thái không được bỏ sót:
1. **Idle (Nghỉ):** Bề mặt cân bằng, bóng đổ chuẩn, nhịp thở vi mô (micro-pulse) nếu là nút chính tiếp theo.
2. **Hover (Rê chuột - Desktop):** Nhấc cao 1.5px, tăng độ bóng sáng mặt sàn 20%.
3. **Focus-Visible (Bàn phím / Trợ năng):** Viền sáng neon `2px solid var(--cyan-beam-400)` cách mép nút 3px.
4. **Active (Đang nhấn):** Nén hết biên độ lò xo 5-6px, haptic rung, âm thanh click.
5. **Loading / Processing (Đang tải):** Mặt nút hiển thị thanh sóng quét radar mini (Radar bar loop), văn bản mờ 50%, vô hiệu hóa chạm kép.
6. **Success (Thành công):** Nút nở rộng nhẹ (Scale 1.04), chuyển gradient xanh lục mạn phải, bắn tia sáng quang học.
7. **Error / Rejected (Thất bại / Sai):** Rung lắc ngang theo trục X (`keyframes shakeX`) biên độ ±6px trong 280ms, chuyển viền đỏ cứu nạn.
8. **Disabled (Khóa cấp bậc):** Độ trong suốt 45%, biểu tượng ổ khóa kim loại 3D, loại bỏ hoàn toàn bóng đổ đế.

---

# PHẦN 4: HỆ THỐNG CHUYỂN ĐỘNG & CHOREOGRAPHY ENGINE
## (120 FPS MOTION DESIGN)

### 4.1 Bảng thông số Spring Physics (Stiffness, Damping, Mass)
Loại bỏ hoàn toàn các chuyển động tuyến tính nhàm chán (`linear` hay `ease-in-out` cổ điển). Mọi chuyển động giao diện trong PeakTalk 3.0 được hiệu chỉnh theo các thông số vật lý dao động của lò xo và lực cản chất lỏng:

| Loại Chuyển Động | Stiffness (Độ cứng) | Damping (Lực cản) | Mass (Khối lượng) | CSS Cubic-Bezier Tương đương | Ứng dụng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Spring Snappy** | 420 | 28 | 0.8 | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Nút bấm nảy, checkbox, badge nhận thưởng |
| **Spring Gentle** | 180 | 22 | 1.0 | `cubic-bezier(0.25, 1, 0.5, 1)` | Lật thẻ flashcard 3D, mở Drawer cài đặt |
| **Spring Deep Water**| 120 | 18 | 1.4 | `cubic-bezier(0.16, 1, 0.3, 1)` | Chuyển cảnh trang lớn, trượt lộ trình hải đồ |
| **Alert Jitter** | 600 | 15 | 0.5 | `cubic-bezier(0.36, 0.07, 0.19, 0.97)` | Rung cảnh báo sai ngữ pháp, chuông MAYDAY |

```css
/* Motion Tokens */
:root {
  --motion-spring-snappy: 220ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --motion-spring-gentle: 350ms cubic-bezier(0.25, 1, 0.5, 1);
  --motion-spring-fluid: 450ms cubic-bezier(0.16, 1, 0.3, 1);
  --motion-duration-micro: 120ms;
  --motion-duration-standard: 240ms;
  --motion-duration-macro: 400ms;
}
```

### 4.2 Shared Element Transitions & Route Navigation Morphing
Khi người dùng chọn một học phần trên Cây Kỹ Năng để bắt đầu bài học:
1. Nút tròn trên cây kỹ năng không biến mất đột ngột.
2. Vòng tròn của nút tự động mở rộng bán kính (Morphing Circular Mask) bao trọn màn hình, chuyển mượt mà thành nền của phòng học.
3. Tiêu đề và huy hiệu STCW trượt nhẹ từ vị trí bài học lên trên thanh Header với gia tốc `cubic-bezier(0.16, 1, 0.3, 1)`.
4. Không có màn hình trắng nhấp nháy (zero white flash).

### 4.3 Stagger Sequences & List Item Orchestration
Khi cuộn hoặc mở một danh mục 50 câu SMCP hoặc danh sách thuật ngữ:
- Các phần tử không hiện lên đồng loạt.
- Từng item xuất hiện so le với độ trễ (delay step) chính xác là `35ms`:
  ```css
  .stagger-item {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
    animation: staggerFadeUp 320ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  .stagger-item:nth-child(1) { animation-delay: 35ms; }
  .stagger-item:nth-child(2) { animation-delay: 70ms; }
  .stagger-item:nth-child(3) { animation-delay: 105ms; }
  .stagger-item:nth-child(4) { animation-delay: 140ms; }
  .stagger-item:nth-child(5) { animation-delay: 175ms; }
  .stagger-item:nth-child(n+6) { animation-delay: 210ms; }
  ```

### 4.4 Shimmer Skeletons, Micro-Looped Shaders & Particle Sparks
- **Shimmer Đại dương (Nautical Shimmer):** Hiệu ứng chờ tải dữ liệu không dùng màu xám xịt thông thường mà sử dụng dòng quét lấp lánh như ánh trăng phản chiếu trên mặt nước biển đêm (`linear-gradient(90deg, #0a1626 0%, #19385c 50%, #0a1626 100%)`).
- **Pháo hoa chiến thắng (Celebration Confetti):** Khi hoàn thành bài học Daily 25 hoặc thăng cấp Thuyền phó/Máy trưởng, hệ thống sẽ kích hoạt hạt pháo hoa mang hình dạng mỏ neo vàng, phao cứu sinh tròn, và ngôi sao kim cương lấp lánh rơi theo quỹ đạo vật lý có trọng lực và sức cản gió.

---

# PHẦN 5: THIẾT KẾ CHI TIẾT TỪNG MÀN HÌNH
## (SCREEN-BY-SCREEN BLUEPRINT)

### 5.1 Màn hình Onboarding & STCW Department Selection
#### Khảo sát & Thay đổi UX:
Màn hình ban đầu cần truyền cảm hứng mạnh mẽ về hành trình vươn ra biển lớn của thuyền viên Việt Nam:
1. **Lớp nền động (Dynamic Ocean Horizon):** Nền gradient biển sâu với các con sóng SVG chuyển động chậm ở đáy màn hình.
2. **Chọn Khoa Chuyên Môn (Deck vs Engine):**
   - **Khoa Boong (Deck Department):** Biểu tượng La bàn hàng hải 3D (Gyrocompass) phát sáng màu Cyan, đại diện cho Định hải, Luôn luân chuyển hàng hóa, Quy tắc tránh va Colregs, Đàm thoại VHF.
   - **Khoa Máy (Engine Department):** Biểu tượng Cụm piston tua-bin 3D (Marine Turbine) phát sáng màu Cam lửa, đại diện cho Nồi hơi, Máy chính, Hệ thống thủy lực, Nhiên liệu MGO/HFO.
   - Khi chọn một khoa, toàn bộ theme ánh sáng của ứng dụng đổi theo tông màu đặc trưng của khoa đó với hiệu ứng chuyển sắc mềm mại trong 400ms.
3. **Cơ chế Lưu trữ & Khởi động nhanh:** Chạm một chạm để lưu cấu hình, không ép buộc người dùng đăng nhập ngay từ đầu (Guest-first approach) để loại bỏ rào cản tiếp cận ban đầu.

---

### 5.2 Màn hình Home Dashboard
#### Bố cục phân tầng 4 khu vực vàng (Golden Layout):

```
┌────────────────────────────────────────────────────────┐
│ [Avatar Cấp bậc]  [🔥 Streak: 12]  [⭐ 1.450]  [🔔 Update]│ <--- Top Marine HUD Bar
├────────────────────────────────────────────────────────┤
│  🌊 HẢI TRÌNH HÔM NAY: MOTIVE BANNER                   │
│  "Gió cấp 4, biển lặng. Hãy hoàn thành 25 thuật ngữ!" │
├────────────────────────────────────────────────────────┤
│         ╭───────────────────────────────╮              │
│         │   VÒNG XOAY DAILY 25 CHALENGE │              │
│         │        [ 18 / 25 ĐÃ HỌC ]     │              │ <--- Interactive Radial Gauge
│         │     [ NÚT TIẾP TỤC HỌC 3D ]   │              │
│         ╰───────────────────────────────╯              │
├────────────────────────────────────────────────────────┤
│  🎯 KHOA ĐANG CHỌN: [ KHOA BOONG ▼ ]                  │
│  [ CAROUSEL KHÓA HỌC: SĨ QUAN TRỰC CA (OOW) ]         │ <--- Horizontal Snapping Cards
├────────────────────────────────────────────────────────┤
│  ⚡ TÁC VỤ NHANH:                                       │
│  [🎙️ Đàm thoại VHF]  [🚨 Cấp cứu]  [🎮 Đấu từ vựng]    │ <--- 3D Tactile Grid
└────────────────────────────────────────────────────────┘
```

#### Chi tiết tương tác các phần tử:
1. **Vòng tròn Radial Gauge (Daily 25 Challenge):**
   - Sử dụng SVG `stroke-dasharray` với hiệu ứng nước dâng lượn sóng (Liquid Wave Fill).
   - Khi hoàn thành từ mới, vạch tiến trình phát sáng chạy dọc theo chiều kim đồng hồ kèm âm thanh "ding" thánh thót.
2. **Streak Flame 3D:**
   - Ngọn lửa Streak không phải ảnh phẳng mà là icon SVG đa lớp có hiệu ứng bập bùng (flicker keyframe), số ngày giữ streak đổi màu từ Cam sang Vàng Kim khi vượt qua mốc 7 ngày.
3. **Thanh HUD Marine Bar:** Cố định trên cùng với hiệu ứng kính mờ (frosted glass), tích hợp vùng an toàn tránh che notch camera trên iPhone / Android.

---

### 5.3 Màn hình Career Path / Skill Tree (Interactive SVG Nautical Route)
#### Bước đột phá: Biến Cây kỹ năng thành Hải Đồ Hàng Hải (Nautical Nautical Chart)
Thay vì các nút xếp thẳng hàng dọc đơn điệu, cây kỹ năng PeakTalk 3.0 là một **Hải đồ dẫn luồng (Shipping Fairway Chart)** uốn lượn hình chữ S tự nhiên:

```
                  ⚓ [ CẢNG XUẤT PHÁT: THỰC TẬP SINH ]
                             │
                            ╱ (Dòng hải lưu phát sáng)
                           │
                 [ BÀI 1: LA BÀN & DỤNG CỤ ] (Đã xong: 3⭐)
                         ╲
                          │
                 [ BÀI 2: BUỒNG LÁI & HỆ THỐNG LÁI ] (Đang mở - Pulsing Ring)
                           │
                           ╱
                 [ 🔒 BÀI 3: TRÁNH VA TRÊN BIỂN COLREGS ] (Khóa)
```

#### Tính năng tương tác cao cấp trên Cây Kỹ Năng:
- **Đường hải lưu nối các đảo (SVG Dynamic Waves):** Đường nối giữa các bài học có các hạt photon ánh sáng chạy dọc theo dây dẫn chỉ hướng đi tiếp theo.
- **Nút bài học 3D (Island Node):**
  - **Node hoàn thành (Mastered):** Vỏ ngoài mạ vàng, đính 3 ngôi sao nổi 3D, khi chạm vào hiển thị bảng tóm tắt điểm số và nút ôn tập cấp tốc.
  - **Node hiện tại (Current Active):** Bao quanh bởi vòng radar xoay tròn 360 độ liên tục, có chú chim hải âu hoặc ngọn hải đăng nhỏ vẫy cánh mời gọi người học nhấn vào.
  - **Node khóa (Locked Tier):** Khối đá hoa cương xám mờ với ổ khóa kim loại STCW, chạm vào sẽ hiện popup thông báo: *"Cần đạt 150 XP và hoàn thành cấp bậc Thủy thủ để mở khóa."*
- **Tự động cuộn mượt (Auto-Scroll to Progress):** Khi vừa vào tab Học, hải đồ tự động lướt mượt mà đến đúng vị trí bài học đang dang dở của người học trong 600ms.

---

### 5.4 Màn hình Vocab Hub & 3D Flashcards (Gyro Tilt & SRS Interface)
Màn hình phục vụ học 10.000 thuật ngữ chuyên ngành hàng hải với thuật toán lặp lại ngắt quãng (Spaced Repetition System - SM2):
1. **Thẻ Flashcard Con Quay Hồi Chuyển (3D Gyroscope Tilt Card):**
   - Trên thiết bị di động hỗ trợ cảm biến nghiêng (`deviceorientation`), tấm thẻ hơi nghiêng theo góc cầm điện thoại của thuyền viên, phản chiếu vệt sáng kim loại sang trọng.
   - Thao tác lật thẻ: Chạm đúp (double-tap) hoặc vuốt nhẹ để thẻ xoay 180 độ theo trục Y (`transform: rotateY(180deg)`) với độ mượt 60 FPS không giật lag.
2. **Kiểm tra phát âm AI qua Sóng Âm (Waveform Speech Analyzer):**
   - Khi người học bấm nút thu âm phát âm từ tiếng Anh hàng hải (ví dụ: *"Propeller cavitation"*):
   - Đồ thị sóng âm thanh 3D hiển thị thời gian thực theo tần số giọng nói.
   - Hệ thống so sánh đối chiếu ngữ điệu với mẫu chuẩn của Sĩ quan Hàng hải bản ngữ, bôi xanh các âm vị (phonemes) phát âm chuẩn, bôi đỏ các âm vị bị nuốt hoặc phát âm sai trọng âm.
3. **Hệ thống nút đánh giá độ nhớ SRS 4 mức độ:**
   - `[ Quên ]` (Đỏ) - Xem lại sau 1 phút.
   - `[ Khó ]` (Cam) - Xem lại sau 10 phút.
   - `[ Nhớ ]` (Xanh biển) - Xem lại sau 1 ngày.
   - `[ Rất dễ ]` (Xanh lục) - Xem lại sau 4 ngày.
   - Cả 4 nút đều áp dụng cấu trúc 3D Bevel Button với màu sắc phân biệt rõ ràng.

---

### 5.5 Màn hình SMCP Hub (Standard Marine Communication Phrases)
Chuẩn hóa toàn bộ câu đàm thoại theo Công ước IMO SMCP:
1. **Phân loại Marker trực quan:** 8 thẻ đánh dấu thông điệp hàng hải quốc tế được thiết kế dạng bảng mạch điện tử buồng lái:
   - `INSTRUCTION` (Chỉ thị - Đỏ)
   - `ADVICE` (Khuyên cáo - Vàng)
   - `WARNING` (Cảnh báo - Cam)
   - `INFORMATION` (Thông tin - Xanh biển)
   - `QUESTION` (Câu hỏi - Tím)
   - `ANSWER` (Trả lời - Xanh lục)
   - `REQUEST` (Yêu cầu - Cyan)
   - `INTENTION` (Ý định - Hổ phách)
2. **Bộ lọc tìm kiếm tức thì (Instant Search with Debounce 150ms):**
   - Cho phép tìm nhanh mã câu bằng cả tiếng Anh và tiếng Việt.
   - Highlight từ khóa tìm kiếm bằng nền vàng phản quang.
3. **Trình phát Audio Đàm thoại chuẩn:** Có nút chỉnh tốc độ phát âm (0.75x cho người mới bắt đầu, 1.0x tốc độ chuẩn quốc tế, 1.25x luyện nghe khẩn cấp).

---

### 5.6 Màn hình VHF Radio Simulator (PTT Hardware Rig)
Đây là màn hình đột phá nhất về mặt thiết kế giao diện (Industrial Skeuomorphism):

```
┌────────────────────────────────────────────────────────┐
│ 📻 MARINE VHF TRANSCEIVER CLASS-A  [POWER: ON 🟢]     │
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │ FREQ: 156.800 MHz   CH: 16 [DISTRESS/CALLING]      │ │ <--- Backlit LCD Matrix Display
│ │ RX SIGNAL: ▃▅▇█ FULL    SQUELCH: LEVEL 3           │ │
│ │ TRANSCRIPT: "Vung Tau VTS, this is MV Golden Star" │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ [VOL KNOB]      [SQUELCH KNOB]      [CH 16 QUICK-BTN]  │ <--- Tactile Rotary Dials
├────────────────────────────────────────────────────────┤
│                                                        │
│               ╭────────────────────────╮               │
│               │     HOLD TO TRANSMIT   │               │
│               │       (((( 🔴 ))))      │               │ <--- Massive 3D PTT Button
│               │        P T T           │               │
│               ╰────────────────────────╯               │
│                                                        │
├────────────────────────────────────────────────────────┤
│ 🔊 LIVE RADIO STATIC NOISE: [BẬT / TẮT TIẾNG XÈ XÈ]    │
└────────────────────────────────────────────────────────┘
```

#### Trải nghiệm âm học & thị giác buồng lái:
- Màn hình LCD có lưới chấm ma trận hạt LED (Dot Matrix LCD), phát sáng xanh dạ quang (Amber / Green Backlight) với độ tương phản sắc nét.
- Nút xoay kênh (Rotary Channel Knob) có thể vuốt xoay kèm âm thanh khấc cơ học ("Crick-crick-crick") chân thực.
- Tích hợp tiếng ồn nền khí quyển biển khơi (Marine Atmospheric Noise Filter) tạo cảm giác như đang trực ca thực tế giữa biển đêm giông bão.

---

### 5.7 Màn hình Emergency Simulation (MAYDAY / PAN PAN Strobe Alert)
Dành riêng cho việc diễn tập các tình huống sinh tử theo SOLAS & STCW:
1. **Chế độ Báo động Đỏ (Red Alert Strobe Mode):**
   - Khi chọn tình huống khẩn cấp (Cháy hầm hàng, Thủng vỏ tàu tràn nước, Bỏ tàu, Cướp biển tiếp cận):
   - Toàn bộ giao diện viền màn hình chớp sáng màu đỏ cảnh báo chu kỳ 1.2s nhịp nhàng.
   - Âm thanh báo động hàng hải (General Emergency Alarm - 7 tiếng ngắn 1 tiếng dài) vang lên.
2. **Quy trình chuẩn hóa 4 bước cứu nạn:**
   - Bước 1: Nhận diện tính chất khẩn cấp (Phân biệt MAYDAY vs PAN-PAN vs SECURITE).
   - Bước 2: Phát điện báo qua VHF Kênh 16 theo mẫu chuẩn quốc tế.
   - Bước 3: Đọc tọa độ GPS và số lượng người trên tàu (POB - Persons on Board).
   - Bước 4: Kích hoạt EPIRB và phóng pháo hiệu cứu sinh (Pyrotechnics).

---

### 5.8 Màn hình Maritime 15 Minigames Suite
Bộ 15 trò chơi huấn luyện phản xạ hàng hải được làm lại toàn bộ giao diện:
1. **Hải Chiến Song Đấu (Maritime Duel):** Thanh máu (HP Bar) của hai chiến hạm hiển thị ở hai góc trên, mỗi câu trả lời đúng sẽ bắn một phát pháo hải quân sang tàu đối thủ với hiệu ứng nổ hạt lửa.
2. **Nối Thuật Ngữ Cấp Tốc (Fast Term Match):** Các bong bóng từ vựng nổi bồng bềnh trên mặt nước, chạm hai bong bóng tương ứng sẽ nổ bọt khí giòn tan.
3. **Giải Mã Mooc-xe (Morse Code Decryptor):** Bàn gõ điện tín đồng thau cổ điển, có đèn flash chớp sáng đồng bộ theo tín hiệu ngắn-dài (Dot & Dash).
4. **Nhận Diện Đèn & Dấu Hiệu Tàu Thuyền (Colregs Navigation Lights):** Mô phỏng 3D góc nhìn ban đêm từ đài chỉ huy buồng lái, người học phải phán đoán hướng đi của tàu đối diện qua tổ hợp đèn mạn đỏ/xanh/trắng.
5. **Cứu Hỏa Hầm Hàng & Khắc Phục Sự Cố (Engine Room Fire Drill):** Đồng hồ đo áp suất khí CO2 và bọt Foam dạng cơ học, thao tác nhanh để dập tắt đám cháy ảo.

---

### 5.9 Màn hình Marlins Exam Prep (Thi Thử Hàng Hải Chuẩn Quốc Tế)
1. **Mô phỏng 1:1 phần mềm thi chính thức:**
   - Bố cục chia hai cột: Cột trái là nội dung đề thi kèm đoạn hội thoại audio, cột phải là bảng 4 đáp án lựa chọn dạng phím bấm lớn.
2. **Bản đồ câu hỏi (Question Matrix Grid):**
   - Thanh trượt hiển thị 60 câu hỏi, câu nào đã làm chuyển màu xanh lục, câu nào đánh dấu cờ (Flag for Review) chuyển màu vàng cam, câu chưa làm màu xám.
3. **Đồng hồ đếm ngược áp lực cao (Countdown Ring):**
   - Vòng tròn thời gian 60 phút chuyển màu dần từ Xanh -> Vàng -> Đỏ khi thời gian thi còn dưới 5 phút, tạo cảm giác thi thật giúp rèn luyện bản lĩnh buồng thi.

---

### 5.10 Màn hình AI Sea Captain Mentor (Thuyền Trưởng Ảo 3D)
1. **Quả cầu Năng Lượng Đàm Thoại (3D Fluid Voice Orb):**
   - Thay vì avatar tĩnh, AI Thuyền Trưởng được đại diện bởi một khối cầu hạt chất lỏng 3D phát sáng.
   - Khi AI đang suy nghĩ: Quả cầu co lại và xoay tròn với tốc độ cao.
   - Khi AI đang nói: Các xung sóng âm thanh biến dạng bề mặt quả cầu theo đúng biên độ tần số giọng nói.
2. **Sheet Chọn Máy Chủ AI Thông Minh (Multi-Server Bottom Sheet):**
   - Danh sách 15+ models (Server 6 Ưu tiên số 1, Fast 3, DeepSeek, GLM,...) được thiết kế dạng thẻ Card thông số kỹ thuật (Latency, Speed, Accuracy Badge) giúp thuyền viên chuyển đổi linh hoạt khi mạng ngoài khơi chập chờn.

---

### 5.11 Màn hình Profile, STCW Seaman Passport & Realtime Leaderboard
1. **Hộ Chiếu Thuyền Viên Điện Tử (E-Seaman Passport):**
   - Tấm thẻ căn cước hàng hải kỹ thuật số với hiệu ứng phản quang lấp lánh (Holographic Card Effect) khi nghiêng điện thoại.
   - Hiển thị đầy đủ: Họ tên, Chức danh STCW (Captain / Chief Engineer / OOW), Số giờ trực ca ảo, Tỷ lệ phát âm chuẩn, Số hải lý kinh nghiệm (Nautical Miles XP).
2. **Bảng Xếp Hạng Giải Đấu Hải Trình (Maritime League Leaderboard):**
   - Chia 5 hạng đoàn: Hạng Thuyền Thúng -> Hạng Ca-nô -> Hạng Tàu Hàng -> Hạng Tàu Container -> Hạng Siêu Hạm Hạt Nhân.
   - Top 3 người dẫn đầu nhận được vương miện mỏ neo vàng, bạc, đồng đính đá quý 3D nổi bật.

---

# PHẦN 6: TÁI CẤU TRÚC KIẾN TRÚC MÃ NGUỒN
## (DECONSTRUCTING MONOLITH `App.tsx` - 6.867 DÒNG)

Để giải quyết triệt để vấn đề hiệu năng và đảm bảo trải nghiệm mượt mà, toàn bộ file `App.tsx` cần được xé nhỏ thành cấu trúc thư mục module hóa chuyên nghiệp theo chuẩn dự án React/Capacitor quy mô lớn:

```
src/
├── animations/                # Cấu hình Spring Physics & Keyframes
│   ├── springTokens.ts
│   └── pageTransitions.ts
├── components/
│   ├── common/                # Các UI Atoms dùng chung
│   │   ├── Button3D.tsx       # Nút bấm 3D Tactile đa dụng
│   │   ├── CardGlass.tsx      # Thẻ Hydro-Glassmorphism
│   │   ├── BadgeSTCW.tsx      # Huy hiệu cấp bậc hàng hải
│   │   ├── ModalSheet.tsx     # Bottom Sheet trượt mượt mà
│   │   ├── RadialProgress.tsx # Vòng tiến trình tròn SVG
│   │   └── TabBarBottom.tsx   # Thanh điều hướng đáy có haptics
│   ├── layout/                # Khung sườn ứng dụng
│   │   ├── AppHeader.tsx      # Header kèm chỉ số Streak, Tim, Cấp bậc
│   │   └── AppContainer.tsx   # Wrapper quản lý Safe Area và Theme
│   ├── features/              # Các UI Organisms theo tính năng
│   │   ├── home/
│   │   │   ├── DailyChallengeRing.tsx
│   │   │   ├── CourseCarousel.tsx
│   │   │   └── QuickTaskGrid.tsx
│   │   ├── skilltree/
│   │   │   ├── NauticalMapPath.tsx
│   │   │   ├── SkillNodeItem.tsx
│   │   │   └── NodeDetailModal.tsx
│   │   ├── vocab/
│   │   │   ├── Flashcard3D.tsx
│   │   │   ├── WaveformMic.tsx
│   │   │   └── SrsRatingButtons.tsx
│   │   ├── vhf/
│   │   │   ├── VhfChassis.tsx
│   │   │   ├── VhfLcdScreen.tsx
│   │   │   ├── PttHeavyButton.tsx
│   │   │   └── FrequencyKnob.tsx
│   │   ├── ai/
│   │   │   ├── VoiceOrb3D.tsx
│   │   │   ├── ChatBubbleStream.tsx
│   │   │   └── AiServerPickerSheet.tsx
│   │   └── profile/
│   │       ├── HolographicPassport.tsx
│   │       └── LeagueLeaderboardTable.tsx
│   └── minigames/             # Tách riêng 15 minigames thành từng file độc lập
│       ├── GameMaritimeDuel.tsx
│       ├── GameMorseDecoder.tsx
│       ├── GameColregsLights.tsx
│       └── ... (12 games còn lại)
├── context/                   # Quản lý State phân tán (Không dồn vào 1 file)
│   ├── AuthContext.tsx        # Firebase Auth & User Profile
│   ├── ProgressContext.tsx    # XP, Streak, Stars, Unlocked Nodes
│   ├── AudioHapticContext.tsx # Sound Engine & Vibration Control
│   └── ThemeDeptContext.tsx   # Khoa Boong/Máy & Dark/Light Mode
├── hooks/                     # Custom Hooks tối ưu re-render
│   ├── useVhfRadio.ts         # Hook điều khiển máy phát sóng bộ đàm
│   ├── useSpeechRecognition.ts# Hook nhận diện giọng nói
│   ├── useHaptics.ts          # Hook rung tactile đa cấp độ
│   └── useSrsEngine.ts        # Thuật toán Spaced Repetition
├── screens/                   # 5 Màn hình chính đại diện cho 5 Tabs
│   ├── HomeScreen.tsx
│   ├── LearnScreen.tsx
│   ├── PracticeScreen.tsx
│   ├── AiCaptainScreen.tsx
│   └── ProfileScreen.tsx
├── App.tsx                    # Chỉ còn < 150 dòng (Router & Context Providers)
└── index.css                  # Tách nhỏ thành tokens & components
```

### Đặc tả Chi tiết TypeScript Interface của `Button3D.tsx`:
```typescript
// src/components/common/Button3D.tsx
import React, { useState } from 'react';
import { soundService } from '../../services/soundService';

export interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'coral' | 'gold' | 'emerald' | 'ghost' | 'marine-dark';
  size?: 'sm' | 'md' | 'lg' | 'giant';
  depth?: number; // Độ dày 3D (pixel, mặc định 5px)
  hapticPattern?: 'light' | 'medium' | 'heavy' | 'success';
  soundType?: 'click' | 'pop' | 'milestone' | 'none';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  depth = 5,
  hapticPattern = 'light',
  soundType = 'click',
  leftIcon,
  rightIcon,
  isLoading,
  onClick,
  disabled,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = () => {
    if (disabled || isLoading) return;
    setIsPressed(true);

    // Xử lý âm thanh tức thời (< 8ms)
    if (soundType === 'click') soundService.playClick();
    
    // Kích hoạt phản hồi rung tactile
    if (hapticPattern === 'light') soundService.vibrate(15);
    else if (hapticPattern === 'medium') soundService.vibrate(30);
    else if (hapticPattern === 'heavy') soundService.vibrate([20, 10, 40]);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={onClick}
      className={`btn-3d btn-3d-${variant} btn-3d-size-${size} ${isPressed ? 'is-pressed' : ''} ${className}`}
      style={{
        '--btn-depth': `${depth}px`,
        '--btn-press-offset': `${depth - 1}px`
      } as React.CSSProperties}
    >
      {isLoading ? (
        <span className="btn-radar-spinner" />
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          <span className="btn-label">{children}</span>
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
```

---

# PHẦN 7: TÁI THIẾT TOÀN DIỆN FILE CSS
## (MODULAR CSS & KEYFRAME DICTIONARY)

Dưới đây là bộ mã nguồn CSS đặc tả toàn bộ các hiệu ứng chuyển động vi mô (Micro-interactions) phục vụ trực tiếp cho việc tái thiết kế:

```css
/* ==========================================================================
   PEAKTALK 3.0 ADVANCED KEYFRAME MOTION DICTIONARY
   ========================================================================== */

/* 1. HIỆU ỨNG TIA QUÉT RADAR HẢI THUYỀN (Marine Radar Sweep) */
@keyframes radarSweep {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 2. HIỆU ỨNG SÓNG ÂM SONAR LAN TỎA (Sonar Pulse Ripple) */
@keyframes sonarRipple {
  0% {
    transform: scale(0.85);
    opacity: 0.9;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

/* 3. HIỆU ỨNG CHỚP SÁNG CỨU NẠN MAYDAY (Emergency Strobe Alert) */
@keyframes maydayStrobe {
  0%, 100% {
    background-color: rgba(239, 68, 68, 0.08);
    box-shadow: inset 0 0 40px rgba(239, 68, 68, 0.25);
  }
  50% {
    background-color: rgba(239, 68, 68, 0.25);
    box-shadow: inset 0 0 80px rgba(239, 68, 68, 0.6);
  }
}

/* 4. HIỆU ỨNG RUNG LẮC CẢNH BÁO SAI NGỮ PHÁP (Tactile Error Shake) */
@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

/* 5. HIỆU ỨNG BẬP BÙNG NGỌN LỬA STREAK 3D (Streak Flame Flicker) */
@keyframes flameFlicker {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 10px rgba(251, 146, 60, 0.6));
  }
  30% {
    transform: scale(1.06) rotate(-2deg);
    filter: drop-shadow(0 0 16px rgba(249, 115, 22, 0.85));
  }
  70% {
    transform: scale(0.96) rotate(2deg);
    filter: drop-shadow(0 0 12px rgba(234, 88, 12, 0.7));
  }
}

/* 6. HIỆU ỨNG MẶT NƯỚC DÂNG VÒNG DAILY 25 (Liquid Gauge Rise) */
@keyframes liquidWave {
  0% { transform: translateX(-50%) rotate(0deg); }
  100% { transform: translateX(-50%) rotate(360deg); }
}

/* 7. HIỆU ỨNG THẺ PHẢN QUANG BẠC (Holographic Sheen) */
@keyframes holographicPass {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

# PHẦN 8: KẾ HOẠCH THỰC THI TỪNG BƯỚC
## (IMPLEMENTATION ROADMAP & SPRINT PLAN)

Để chuyển đổi toàn bộ dự án từ trạng thái hiện tại sang giao diện mới mà không gây gián đoạn hay phát sinh lỗi (zero regression), lộ trình được chia thành 6 Sprint rõ ràng:

### SPRINT 1: NỀN TẢNG THIẾT KẾ & BỘ ATOMS NÚT BẤM 3D (Ngày 1 - 3)
- Tạo mới file cấu hình token CSS chuẩn `src/styles/tokens.css` và `src/styles/buttons.css`.
- Xây dựng component nguyên tử `Button3D.tsx` với đầy đủ 4 biến thể (Cyan, Coral, Gold, Ghost).
- Nâng cấp `soundService.ts` với các nốt âm thanh phản hồi xúc giác cơ học (Web Audio synthesizer).
- Đảm bảo kiểm thử độ trễ phản hồi nút trên Android WebView đạt `< 16ms`.

### SPRINT 2: XÉ NHỎ MONOLITH `App.tsx` & KHUNG ROUTING ĐÁY (Ngày 4 - 7)
- Tạo thư mục `src/context/` và chuyển toàn bộ state người dùng (`UserProfile`, `Streak`, `Hearts`, `Coins`) sang `ProgressContext.tsx`.
- Chuyển `activeTab` thành bộ điều hướng chuẩn `TabBarBottom.tsx` với hiệu ứng trượt chỉ số nhung (Velvet Slide Indicator).
- Tạo 5 file màn hình đại diện trong `src/screens/` và chuyển logic tương ứng vào từng màn hình.
- Rút gọn file `App.tsx` từ 6.867 dòng xuống dưới 200 dòng.

### SPRINT 3: TÁI THIẾT KẾ TOÀN DIỆN HOME & HẢI ĐỒ SKILL TREE (Ngày 8 - 12)
- Thay thế danh sách dọc bài học bằng Hải đồ dẫn luồng SVG `NauticalMapPath.tsx` uốn lượn.
- Tích hợp vòng tròn Daily 25 nước dâng và hiệu ứng ngọn lửa 3D cho Streak.
- Thiết kế lại thẻ bài học Flashcard với con quay hồi chuyển 3D Gyroscope và máy đo sóng âm phát âm.

### SPRINT 4: CHẾ TẠO BỘ ĐÀM VHF & PHÒNG CẤP CỨU MAYDAY (Ngày 13 - 16)
- Xây dựng khung giao diện máy thu phát VHF Class-A công nghiệp với màn hình LCD xanh dạ quang.
- Lắp đặt nút phát sóng PTT Heavy-Duty với tiếng xì rè radio thực tế (Squelch Noise) và âm thanh Roger Beep.
- Thiết kế hiệu ứng chớp sáng đỏ buồng lái cho các tình huống cứu nạn khẩn cấp theo chuẩn SOLAS.

### SPRINT 5: TỐI ƯU HÓA 15 MINIGAMES & THUYỀN TRƯỞNG AI (Ngày 17 - 21)
- Tách 15 trò chơi trong `src/data/maritime_games.ts` thành các components độc lập trong `src/components/minigames/`.
- Thêm thanh máu hạm đội, hiệu ứng nổ pháo hải quân và đố vui Mooc-xe.
- Thay thế avatar AI tĩnh bằng quả cầu sóng âm 3D Fluid Voice Orb đa biến dạng.

### SPRINT 6: TỐI ƯU HIỆU NĂNG 120 FPS, CHỐNG TỤT KHUNG HÌNH & QA (Ngày 22 - 25)
- Áp dụng `React.memo`, `useMemo`, và ảo hóa danh sách (Virtual List) cho kho từ vựng 10.000 từ.
- Kiểm thử responsive trên các màn hình di động tai thỏ / Dynamic Island / máy tính bảng.
- Build kiểm thử APK release thông qua Capacitor Android để xác nhận độ mượt mà thực tế trên tay người dùng.

---
**Tài liệu này là kim chỉ nam tối thượng cho toàn bộ quá trình đại tu UX/UI của dự án PeakTalk Maritime.** Mọi dòng mã lệnh, hiệu ứng chuyển động và cấu trúc component trong tương lai đều phải tuân thủ nghiêm ngặt các quy chuẩn kỹ thuật và triết lý thẩm mỹ đã được xác lập trong bản thiết kế này.
