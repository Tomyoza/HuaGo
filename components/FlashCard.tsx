'use client';

import type { Card } from '@/lib/types';
import SpeakButton from './SpeakButton';

interface FlashCardProps {
  card: Card;
  side: 'front' | 'back';
  onFlip?: () => void;
}

export default function FlashCard({ card, side, onFlip }: FlashCardProps) {
  if (side === 'front') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] flex flex-col justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-gray-900 mb-4">
            {card.hanzi_trad}
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl text-gray-700">{card.pinyin}</span>
            <SpeakButton text={card.hanzi_trad} />
          </div>
          <div className="text-xl text-gray-600">
            {card.ja_meaning}
          </div>
          {onFlip && (
            <button
              onClick={onFlip}
              className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              裏面を見る
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] space-y-6">
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">{card.hanzi_trad}</div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg text-gray-700">{card.pinyin}</span>
          <SpeakButton text={card.hanzi_trad} />
        </div>
        <div className="text-lg text-gray-600">{card.ja_meaning}</div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">例文</h4>
        <div className="space-y-2">
          <div className="text-xl">{card.example_trad}</div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">{card.example_pinyin}</span>
            <SpeakButton text={card.example_trad} className="text-sm" />
          </div>
          <div className="text-gray-600">{card.example_ja}</div>
        </div>
      </div>

      {card.reply_options && card.reply_options.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">よくある返答</h4>
          <div className="flex flex-wrap gap-2">
            {card.reply_options.map((reply, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {reply}
              </span>
            ))}
          </div>
        </div>
      )}

      {card.tw_note && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">台湾言い換えメモ</h4>
          <p className="text-gray-700 text-sm">{card.tw_note}</p>
        </div>
      )}
    </div>
  );
}