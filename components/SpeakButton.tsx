'use client';

import { useState, useEffect } from 'react';
import { tts } from '@/lib/tts';

interface SpeakButtonProps {
  text: string;
  lang?: string; // 'zh-TW' など
  className?: string;
}

export default function SpeakButton({ text, lang = 'zh-TW', className = '' }: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // 再生状態を監視
    const interval = setInterval(() => {
      setIsSpeaking(tts.isSpeaking());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleSpeak = async () => {
    if (!tts.isSupported()) {
      alert('音声合成はこのブラウザでサポートされていません');
      return;
    }

    // 既に再生中の場合は停止
    if (isSpeaking) {
      tts.stop();
      setIsSpeaking(false);
      return;
    }

    // 音声再生
    await tts.speak(text, lang);
    setIsSpeaking(true);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 ${className}`}
      aria-label={isSpeaking ? '停止' : '再生'}
      disabled={!tts.isSupported()}
    >
      {isSpeaking ? '⏸️' : '🔊'}
    </button>
  );
}

