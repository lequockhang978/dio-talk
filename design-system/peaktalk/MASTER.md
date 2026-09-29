# Design System Master File • PeakTalk (Dio Talk)

> **LOGIC:** Khi phát triển màn hình cụ thể, kiểm tra thư mục `pages/[page-name].md` trước.
> Nếu tồn tại file con, quy tắc của file đó sẽ ghi đè Master này.
> Nếu không, tuân thủ nghiêm ngặt các quy chuẩn dưới đây.

---

**Dự án:** PeakTalk / Dio Talk (Hệ Thống Luyện Phát Âm & Đàm Thoại Tiếng Anh Hàng Hải STCW/SMCP)  
**Chuẩn kỹ năng:** IMO SMCP & STCW 78/2010  
**Phong cách chủ đạo:** Deep Ocean Hydro-Glassmorphism & Tactical Duolingo 3D Tactile  
**Nền tảng:** Mobile App (Capacitor 8 Android) + Responsive Web (Vite + React 19)

---

## 1. Hệ Thống Màu Sắc (Color Tokens)

### Bảng màu đại dương & cứu nạn (Nautical Palette)

| Vai trò | Hex / Biến | CSS Variable | Độ tương phản | Ứng dụng |
|---|---|---|---|---|
| **Vực thẳm đáy biển (Nền sâu)** | `#050B14` | `--ocean-abyss-950` | N/A | Background chính toàn màn hình, Splash |
| **Bề mặt buồng lái (Surface/Card)** | `#0A1626` | `--ocean-abyss-900` | N/A | Card chính, Panel điều khiển, Bottom Sheet |
| **Card nổi / Glass Layer** | `#0F243D` | `--ocean-abyss-800` | N/A | Card cấp 2, Modal backdrop, Container |
| **Đường viền Radar/Border** | `rgba(34,211,238,0.2)` | `--border-highlight` | N/A | Border phát quang, radar sweep line |
| **Chữ chính (Primary Text)** | `#F8FAFC` | `--text-primary` | 16:1 | Tiêu đề, thuật ngữ SMCP, IPA transcript |
| **Chữ phụ (Secondary Text)** | `#94A3B8` | `--text-secondary` | 7.2:1 | Ý nghĩa tiếng Việt, hướng dẫn bài tập |
| **Bioluminescent Cyan (Primary CTA)** | `#22D3EE` / `#087E8B` | `--cyan-beam-400` / `500` | 8.5:1 | Nút nghe phát âm, nút hành động chính |
| **Rescue Coral (Khẩn cấp / SAR)** | `#FF7B54` / `#FB7185` | `--rescue-coral-500` | 5.1:1 | Kịch bản Mayday, Pan-Pan, Cảnh báo đỏ |
| **Beacon Gold (Hải đăng / Điểm thưởng)** | `#FFC857` / `#FDE047` | `--beacon-gold-500` | 9.2:1 | Streak lửa, XP, Huy hiệu hoa tiêu, Cảnh báo vàng |
| **Hull Emerald (Chính xác / An toàn)** | `#249F76` / `#34D399` | `--hull-emerald-500` | 6.8:1 | Trả lời đúng trắc nghiệm, Tín hiệu thông suốt |
| **Port Ruby (Mạn trái / Sai lệch)** | `#E95D62` / `#F87171` | `--port-ruby-500` | 5.5:1 | Phát âm sai, cảnh báo va chạm, mạn trái |

---

## 2. Kiểu Chữ (Typography Hierarchy)

* **Font giao diện (UI & Headings):** `Plus Jakarta Sans`, sans-serif (Trọng số: 600, 700, 800)
* **Font nội dung (Body):** `Plus Jakarta Sans`, sans-serif (Trọng số: 400, 500)
* **Font kỹ thuật (VHF Coordinates, Call Signs, SMCP Code):** `JetBrains Mono`, monospace (Trọng số: 500, 700)

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
```

| Cấp độ | Size / Line-height | Weight | Token áp dụng |
|---|---|---|---|
| **Display 1 (Khẩn cấp / Điểm số)** | 32px / 40px | 800 | H1, Streak Counter, Emergency Banner |
| **Heading 2 (Tên bài / Kịch bản)** | 22px / 28px | 700 | H2, Modal Title, Section Header |
| **Heading 3 (Thuật ngữ tiếng Anh)** | 18px / 24px | 700 | Tên từ vựng, Call sign, Câu đối thoại |
| **Body Standard (Giải nghĩa tiếng Việt)** | 15px / 22px | 500 | Diễn giải ngữ nghĩa, hướng dẫn |
| **Monospace / Radar (VHF / GPS)** | 13px / 18px | 600 | Tọa độ, kênh VHF CH16, mã hiệu tàu |
| **Caption / Meta** | 12px / 16px | 600 | Badge phân cấp sĩ quan, thời gian |

---

## 3. Quy Chuẩn Tương Tác & Nút 3D Duolingo (Tactile Tokens)

Các nút bấm trong bài học sử dụng cơ chế phản hồi vật lý 3D xúc giác (Duolingo Tactile Feedback):

```css
/* Tactile 3D Action Button */
.btn-tactile-cyan {
  background: var(--cyan-beam-500);
  box-shadow: 0 var(--duo-depth-md) 0 var(--cyan-beam-dark);
  border-radius: var(--radius-sm);
  color: #ffffff;
  min-height: 48px; /* Chuẩn Touch Target Android */
  padding: 12px 20px;
  font-weight: 700;
  transition: transform var(--motion-press), box-shadow var(--motion-press);
}

.btn-tactile-cyan:active {
  transform: translateY(var(--duo-press-md));
  box-shadow: 0 1px 0 var(--cyan-beam-dark);
}
```

---

## 4. Quy Chuẩn UX & Mobile Accessibility (UI/UX Pro Max Rules)

1. **Touch Target Size:**
   - Tất cả nút tương tác, icon bấm, switch có kích thước chạm tối thiểu **48x48 dp** trên Android và **44x44 pt** trên iOS.
   - Khoảng cách giữa các phần tử có thể bấm tối thiểu **8px** (`gap: 8px`).

2. **Xúc Giác Phản Hồi (Haptic Feedback):**
   - Kích hoạt rung nhẹ (`navigator.vibrate(10)` hoặc `@capacitor/haptics`) khi:
     - Nhấn giữ PTT (Push-To-Talk) vô tuyến VHF.
     - Trả lời đúng / sai trong 15 Minigames.
     - Hoàn thành bài học nhận XP / Trophy.

3. **Ngừa Rách Nhãn & Xuống Hàng Thông Minh (Resilient Layout):**
   - Chip phân cấp (Sĩ quan boong, Máy tàu, Hoa tiêu) không được cắt ngang từ (`white-space: nowrap; text-overflow: ellipsis` hoặc tự xuống dòng dạng flex-wrap).
   - Tuyệt đối không dùng emoji trần trụi làm biểu tượng điều hướng; luôn đi kèm SVG từ thư viện Lucide (`lucide-react`).

4. **Tối Ưu OLED & Tránh Chớp Sáng:**
   - `theme-color` và `background_color` trong `index.html` và `manifest.json` đồng bộ `#0A1626` / `#050B14`, loại bỏ chớp trắng khi khởi động app trên Android.
   - Hỗ trợ `prefers-reduced-motion` bằng cách hạ thời gian animation về 0s hoặc tắt keyframe radar sweep đối với người dùng nhạy cảm chuyển động.

---

## 5. Checklist Bàn Giao Thiết Kế

- [ ] Biểu tượng 100% là SVG vector Lucide (`lucide-react`), không dùng emoji thay icon chức năng.
- [ ] Con trỏ `cursor: pointer` trên mọi phần tử bấm được trên web / desktop.
- [ ] Độ tương phản màu chữ chính đạt chuẩn WCAG AAA (>7:1) trên nền Abyss Navy.
- [ ] Vùng chạm an toàn (`env(safe-area-inset-top)` & `env(safe-area-inset-bottom)`) áp dụng cho tai thỏ và thanh điều hướng Android.
- [ ] Tất cả nút bấm học tập có trạng thái `active` dập nổi xúc giác và âm thanh feedback.
