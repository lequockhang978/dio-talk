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

  public async speak(text: string, lang = 'en-US', rate = 0.95, onEnd?: () => void): Promise<void> {
    if (!text || !text.trim()) {
      onEnd?.();
      return;
    }
    const cleanText = text.trim();

    // 1. If running inside Android APK (Native), use OS Text-to-Speech engine
    if (this.isNative) {
      try {
        await TextToSpeech.stop();
        await TextToSpeech.speak({
          text: cleanText,
          lang,
          rate,
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

    // 2. Web / Desktop fallback (Identical to Web Test)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = lang;
        utterance.rate = rate;
        
        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0])) || voices[0];
        if (matchedVoice) utterance.voice = matchedVoice;

        utterance.onend = () => {
          onEnd?.();
        };
        utterance.onerror = () => {
          onEnd?.();
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        console.warn('[SoundService] Web speech synthesis failed', e);
      }
    }

    // 3. Last-resort HTML5 audio fallback
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(cleanText.slice(0, 180))}`;
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.playbackRate = rate;
      this.currentAudio.onended = () => {
        onEnd?.();
      };
      this.currentAudio.onerror = () => {
        onEnd?.();
      };
      this.currentAudio.play().catch(() => {
        onEnd?.();
      });
    } catch {
      onEnd?.();
    }
  }
}

export const soundService = new SoundService();
