import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'C:\\Users\\DINO LEE\\Desktop\\canhanhoa\\promo_screenshots';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dismissModals(page) {
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => 
      b.textContent?.includes('Để sau') || 
      b.textContent?.includes('Đóng') || 
      b.querySelector('svg.lucide-x')
    );
    if (closeBtn) closeBtn.click();
  });
  await sleep(400);
}

async function run() {
  console.log('🚀 Starting Ultimate Promotional Capture for Dio Talk...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security'
    ],
    defaultViewport: {
      width: 412,
      height: 915,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    }
  });

  const page = await browser.newPage();

  // 1. Onboarding Screen
  console.log('📸 01. Onboarding Screen...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_Onboarding_STCW.png') });

  // 2. Auth Screen (Google Sign-In & Department Selection)
  console.log('📸 02. Google Auth Screen...');
  await page.evaluate(() => {
    localStorage.setItem('dio_has_seen_onboarding', 'true');
    localStorage.removeItem('dio_auth_bypass');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_DangNhap_Google_STCW.png') });

  // Setup Seafarer Profile & Authenticated Mode
  await page.evaluate(() => {
    localStorage.setItem('dio_has_seen_onboarding', 'true');
    localStorage.setItem('dio_auth_bypass', 'true');
    const profile = {
      name: 'Lê Quốc Khang',
      rank: 'Đại phó (Chief Officer / Chief Mate)',
      rankTitle: 'Sĩ quan Boong Hàng hải STCW',
      department: 'deck',
      email: 'quockhang.mariner@diotalk.vn',
      streakDays: 14,
      hearts: 5,
      xp: 3850,
      coins: 890
    };
    localStorage.setItem('dio_user_profile', JSON.stringify(profile));
    localStorage.setItem('dio_dept', 'deck');
    localStorage.setItem('dio_practice_minutes', '45');
    localStorage.setItem('dio_accuracy_score', '98');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(1500);
  await dismissModals(page);

  // 3. Home Dashboard & Daily 25-Min Protocol
  console.log('📸 03. Home Dashboard & Daily 25-Min Protocol...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_TrangChu_GiaoThuc25Phut.png') });

  // 4. Maritime Skill Tree
  console.log('📸 04. Maritime Skill Tree...');
  await page.evaluate(() => window.scrollBy({ top: 620, behavior: 'instant' }));
  await sleep(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_CayKyNang_VoHan.png') });

  // 5. Learn Tab (Courses & Cấp bậc Thuyền viên)
  console.log('📸 05. Learn Tab (Courses & STCW Nodes)...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.evaluate(() => {
    const items = document.querySelectorAll('.peaktalk-bottom-nav .nav-bottom-item');
    if (items[1]) items[1].click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_HocTap_KhoTuVung10K.png') });

  // 6. IMO SMCP Standard Maritime Phrases
  console.log('📸 06. IMO SMCP Standard Phrases...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const smcpBtn = btns.find(b => b.textContent?.includes('SMCP') || b.textContent?.includes('Mẫu câu'));
    if (smcpBtn) smcpBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_MauCau_ChuanSMCP.png') });

  // 7. Practice Tab (15 Minigames List)
  console.log('📸 07. Practice Tab (15 Minigames)...');
  await page.evaluate(() => {
    const items = document.querySelectorAll('.peaktalk-bottom-nav .nav-bottom-item');
    if (items[2]) items[2].click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_DauTruong_15Minigame.png') });

  // 8. Minigame Duel Interactive Modal (15s Speed Challenge)
  console.log('📸 08. Minigame Duel Modal (15s Challenge)...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div, button'));
    const gamePlayBtn = cards.find(el => el.textContent?.includes('Chơi') || el.textContent?.includes('Đấu Từ Vựng'));
    if (gamePlayBtn) gamePlayBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_Minigame_DauTruong15s.png') });

  // Close Duel Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button svg.lucide-x')?.parentElement || document.querySelector('button[aria-label="Đóng"]');
    if (closeBtn) closeBtn.click();
  });
  await sleep(600);

  // 9. VHF Radio Marine Simulator with PTT (Click quick card from Home)
  console.log('📸 09. VHF Marine Simulator with PTT...');
  await page.evaluate(() => {
    const items = document.querySelectorAll('.peaktalk-bottom-nav .nav-bottom-item');
    if (items[0]) items[0].click(); // Back to Home
  });
  await sleep(800);
  await page.evaluate(() => {
    const vhfCard = document.querySelector('.home-quick-card-3d.vhf-theme') || 
                    Array.from(document.querySelectorAll('div')).find(d => d.textContent?.includes('Đài VHF Marine'));
    if (vhfCard) vhfCard.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_MoPhong_DaiVHF_PTT.png') });

  // Exit VHF Simulator back to home
  await page.evaluate(() => {
    const exitBtn = document.querySelector('.vhf-top-controls .study-header-btn, .study-header-btn');
    if (exitBtn) exitBtn.click();
  });
  await sleep(700);

  // 10. Emergency SAR & SOLAS Simulator
  console.log('📸 10. Emergency SAR & SOLAS Simulator...');
  await page.evaluate(() => {
    const solasCard = document.querySelector('.home-quick-card-3d.solas-theme') || 
                      Array.from(document.querySelectorAll('div')).find(d => d.textContent?.includes('SOLAS Khẩn cấp'));
    if (solasCard) solasCard.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_KhanCap_SAR_SOLAS.png') });

  // Exit SOLAS Simulator back to home
  await page.evaluate(() => {
    const exitBtn = document.querySelector('.emergency-screen .study-header-btn, .study-header-btn');
    if (exitBtn) exitBtn.click();
  });
  await sleep(700);

  // 11. AI Maritime Assistant Tab (20 Models)
  console.log('📸 11. AI Maritime Assistant Tab (20 AI Models)...');
  await page.evaluate(() => {
    const items = document.querySelectorAll('.peaktalk-bottom-nav .nav-bottom-item');
    if (items[3]) items[3].click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_TroLyAI_20Model.png') });

  // 12. Seafarer STCW Profile & National Leaderboard
  console.log('📸 12. Seafarer STCW Profile & National Leaderboard...');
  await page.evaluate(() => {
    const items = document.querySelectorAll('.peaktalk-bottom-nav .nav-bottom-item');
    if (items[4]) items[4].click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12_HoSo_ThuyenVien_STCW.png') });

  console.log('✨ All 12 Promotional Screenshots Captured Successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
