import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

class SoundService {
  private isNative: boolean;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    // Warm up web speech synthesis if in browser
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      } catch {}
    }
  }

  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  public vibrate(pattern: number | number[] = 50) {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }

  /**
   * Âm thanh click cơ học tức thì (< 8ms) chuẩn Duolingo 3D Button
   */
  public playClick() {
    const ctx = this.getAudioContext();
    this.vibrate(12);
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  /**
   * Âm thanh Pop bong bóng nảy (khi chạm node bài học, sticker)
   */
  public playPop() {
    const ctx = this.getAudioContext();
    this.vibrate(16);
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  /**
   * Âm thanh chuông trả lời đúng chuẩn Duolingo (Major Chime C5 -> E5 -> G5)
   */
  public playCorrect() {
    const ctx = this.getAudioContext();
    this.vibrate([25, 20, 50]);
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + idx * 0.07;
        const dur = 0.22;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + dur);
      });
    } catch {}
  }

  /**
   * Âm thanh báo sai nhẹ nhàng (F#3 -> D3 Descending Thud)
   */
  public playWrong() {
    const ctx = this.getAudioContext();
    this.vibrate([60, 40, 60]);
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  /**
   * Âm thanh bíp ngắt sóng radio VHF hải quân (Roger Beep 1050Hz)
   */
  public playRogerBeep() {
    const ctx = this.getAudioContext();
    this.vibrate(35);
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1050, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  /**
   * Tiếng rè xì tĩnh điện sóng radio khi mở PTT (Squelch Noise Burst)
   */
  public playRadioSquelch() {
    const ctx = this.getAudioContext();
    this.vibrate(25);
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 2.5;

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
    } catch {}
  }

  public playMilestone(level: number) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.vibrate([40, 30, 60]);

    // Progressive scale notes depending on milestone level (1 to 4)
    // Level 1 (5 items): C5 -> E5
    // Level 2 (10 items): C5 -> E5 -> G5
    // Level 3 (15 items): C5 -> G5 -> C6
    // Level 4 (20 items): C5 -> E5 -> G5 -> C6 -> E6
    const noteMaps: Record<number, number[]> = {
      1: [523.25, 659.25],
      2: [523.25, 659.25, 783.99],
      3: [523.25, 659.25, 783.99, 1046.50],
      4: [523.25, 659.25, 783.99, 1046.50, 1318.51]
    };
    const freqs = noteMaps[level] || noteMaps[1];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.09;
      const duration = 0.22;

      osc.type = level >= 3 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  public playCelebrationFanfare() {
    const ctx = this.getAudioContext();
    this.vibrate([100, 50, 150, 50, 250]);
    if (!ctx) return;

    // Duolingo-style celebratory fanfare chord sequence
    const notes = [
      { f: 523.25, t: 0.00, d: 0.15 }, // C5
      { f: 659.25, t: 0.12, d: 0.15 }, // E5
      { f: 783.99, t: 0.24, d: 0.18 }, // G5
      { f: 1046.50, t: 0.40, d: 0.45 }, // C6 (sustained root)
      { f: 1318.51, t: 0.42, d: 0.45 }, // E6 (harmony)
      { f: 1567.98, t: 0.44, d: 0.50 }  // G6 (high sparkle)
    ];

    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + d);
    });
  }

  public async stop() {
    if (this.isNative) {
      try {
        await TextToSpeech.stop();
      } catch {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
    }
  }

  /**
   * Âm thanh xào rè vô tuyến VHF (VHF Radio Squelch Burst)
   * Tái tạo chính xác dải tần vô tuyến hàng hải 300Hz - 3400Hz bằng Web Audio API
   */
  public playVhfSquelch(duration = 0.09) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Lọc dải tần vô tuyến hàng hải VHF
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1750;
      filter.Q.value = 1.4;

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch {}
  }


  private isSlowMode = typeof window !== 'undefined' && localStorage.getItem('dio_slow_speech') === 'true';

  public getIsSlowMode(): boolean {
    return this.isSlowMode;
  }

  public setSlowMode(enabled: boolean): void {
    this.isSlowMode = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dio_slow_speech', String(enabled));
    }
  }

  public toggleSlowMode(): boolean {
    this.setSlowMode(!this.isSlowMode);
    return this.isSlowMode;
  }

  public getEffectiveRate(customRate?: number): number {
    if (typeof customRate === 'number' && customRate > 0) return customRate;
    return this.isSlowMode ? 0.68 : 0.82;
  }

  /**
   * Phát đàm thoại mô phỏng VHF chuẩn: Squelch -> Đọc tin -> Roger Beep
   */
  public async speakVhf(text: string, lang = 'en-US', onEnd?: () => void, rate?: number): Promise<void> {
    this.playVhfSquelch(0.08);
    const effectiveRate = this.getEffectiveRate(rate);
    setTimeout(async () => {
      await this.speak(text, lang, effectiveRate, () => {
        this.playRogerBeep();
        onEnd?.();
      });
    }, 90);
  }

  /**
   * Phát âm chậm chuyên dụng (0.68x) để học viên nghe rõ ngữ âm hàng hải
   */
  public async speakSlow(text: string, lang = 'en-US', onEnd?: () => void): Promise<void> {
    return this.speak(text, lang, 0.68, onEnd);
  }

  public async speak(text: string, lang = 'en-US', rate?: number, onEnd?: () => void): Promise<void> {
    if (!text || !text.trim()) {
      onEnd?.();
      return;
    }
    const cleanText = text.trim();
    const effectiveRate = this.getEffectiveRate(rate);

    // 1. If running inside Android APK (Native), use OS Text-to-Speech engine
    if (this.isNative) {
      try {
        await TextToSpeech.stop();
        await TextToSpeech.speak({
          text: cleanText,
          lang,
          rate: effectiveRate,
          pitch: 1.0,
          volume: 1.0,
          category: 'playback',
        });
        onEnd?.();
        return;
      } catch (err) {
        console.warn('[SoundService] Native TTS failed, falling back to Web API', err);
      }
    }

    // 2. Web / Desktop fallback (Web Speech API)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = lang;
        utterance.rate = Math.max(0.45, Math.min(1.5, effectiveRate));

        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0])) || voices[0];
        if (matchedVoice) utterance.voice = matchedVoice;

        let ended = false;
        const complete = () => {
          if (!ended) {
            ended = true;
            onEnd?.();
          }
        };

        utterance.onend = complete;
        utterance.onerror = () => {
          if (!ended) {
            ended = true;
            this.playFallbackAudio(cleanText, effectiveRate, onEnd);
          }
        };

        // Small tick prevents Chrome async cancel race condition
        setTimeout(() => {
          try {
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
            window.speechSynthesis.speak(utterance);
          } catch {
            this.playFallbackAudio(cleanText, effectiveRate, onEnd);
          }
        }, 15);
        return;
      } catch (e) {
        console.warn('[SoundService] Web speech synthesis failed, using fallback', e);
      }
    }

    // 3. Fallback: Google TTS Audio
    this.playFallbackAudio(cleanText, effectiveRate, onEnd);
  }

  private playFallbackAudio(cleanText: string, effectiveRate: number, onEnd?: () => void) {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(cleanText.slice(0, 180))}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      audio.playbackRate = effectiveRate;

      let called = false;
      const done = () => {
        if (!called) {
          called = true;
          onEnd?.();
        }
      };

      audio.onended = done;
      audio.onerror = done;
      setTimeout(done, 4000);

      audio.play().catch(() => done());
    } catch {
      onEnd?.();
    }
  }
}

export const soundService = new SoundService();
