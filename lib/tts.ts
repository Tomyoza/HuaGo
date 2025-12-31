// speechSynthesis の共通実装

let voicesReady = false;
let voicesReadyPromise: Promise<void> | null = null;

// voiceschanged イベントを待つ
function waitForVoices(): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve();
  }

  if (voicesReady) {
    return Promise.resolve();
  }

  if (voicesReadyPromise) {
    return voicesReadyPromise;
  }

  voicesReadyPromise = new Promise((resolve) => {
    const synth = window.speechSynthesis;
    
    // 既にvoicesが利用可能な場合
    if (synth.getVoices().length > 0) {
      voicesReady = true;
      resolve();
      return;
    }

    const handleVoicesChanged = () => {
      if (synth.getVoices().length > 0) {
        voicesReady = true;
        synth.onvoiceschanged = null;
        resolve();
      }
    };

    synth.onvoiceschanged = handleVoicesChanged;

    // タイムアウト（5秒）
    setTimeout(() => {
      if (!voicesReady) {
        voicesReady = true;
        synth.onvoiceschanged = null;
        resolve();
      }
    }, 5000);
  });

  return voicesReadyPromise;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const tts = {
  // サポートチェック
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  // 音声再生
  async speak(text: string, lang: string = 'zh-TW'): Promise<void> {
    if (!this.isSupported()) {
      console.warn('speechSynthesis is not supported');
      return;
    }

    // 既存の再生を停止
    this.stop();

    // voiceschanged を待つ
    await waitForVoices();

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0; // 固定速度

    currentUtterance = utterance;
    synth.speak(utterance);
  },

  // 音声停止
  stop(): void {
    if (!this.isSupported()) {
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();
    currentUtterance = null;
  },

  // 再生中かどうか
  isSpeaking(): boolean {
    if (!this.isSupported()) {
      return false;
    }

    const synth = window.speechSynthesis;
    return synth.speaking;
  },
};

