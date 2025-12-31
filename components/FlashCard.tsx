'use client';

import type { Card } from '@/lib/types';
import SpeakButton from './SpeakButton';

interface FlashCardProps {
  card: Card;
  side: 'front' | 'back';
  onFlip?: () => void;
}

export default function FlashCard({ card, side, onFlip }: FlashCardProps) {
  return (
    <div 
      className="relative w-full max-w-sm mx-auto perspective-1000" 
      style={{ minHeight: '400px' }}
    >
      <div 
        className={`
          relative w-full h-full bg-white rounded-2xl shadow-soft border border-gray-100 flex flex-col
          transition-all duration-500 transform
          ${side === 'back' ? 'ring-2 ring-brand-100' : ''}
        `}
      >
        {/* Content Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          
          {/* Main Text */}
          <div className="mb-6">
            <h2 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">
              {card.hanzi_trad}
            </h2>
            {(side === 'back') && (
               <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                  <span className="text-lg font-medium text-brand-600">{card.pinyin}</span>
                  <SpeakButton text={card.hanzi_trad} className="text-brand-600 hover:bg-brand-100" />
               </div>
            )}
            {(side === 'front') && (
               <div className="mt-2 opacity-50">
                  <SpeakButton text={card.hanzi_trad} />
               </div>
            )}
          </div>

          {/* Meaning (Back Only) */}
          {side === 'back' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <p className="text-2xl font-bold text-gray-700 mb-6 border-t border-gray-100 pt-6 w-full">
                {card.ja_meaning}
              </p>
              
              {/* Example Sentence */}
              <div className="bg-surface-50 p-4 rounded-xl text-left w-full">
                <p className="text-lg text-gray-800 mb-1">{card.example_trad}</p>
                <p className="text-sm text-gray-500 mb-1">{card.example_pinyin}</p>
                <p className="text-sm text-gray-600 italic">{card.example_ja}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Area */}
        {side === 'front' && onFlip && (
          <div className="p-6 border-t border-gray-50">
            <button
              onClick={onFlip}
              className="w-full py-4 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl transition-colors"
            >
              Show Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}