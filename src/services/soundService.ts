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

  public async speak(text: string, lang = 'en-US', rate = 0.95): Promise<void> {
    if (!text || !text.trim()) return;
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
          category: 'ambient',
        });
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
      this.currentAudio.play().catch(() => {});
    } catch {}
  }
}

export const soundService = new SoundService();
