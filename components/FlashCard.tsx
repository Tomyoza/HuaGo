'use client';

import type { Card } from '@/lib/types';
import SpeakButton from './SpeakButton';

interface FlashCardProps {
  card: Card;
  side: 'front' | 'back';
  onFlip?: () => void;
}

export default function FlashCard({ card, side, onFlip }: FlashCardProps) {
  if (!card) return null;

  return (
    <div 
      className="relative w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden mx-auto transition-all duration-300"
      onClick={side === 'front' ? onFlip : undefined}
    >
      {/* Content Container - Scrollable if content is too long */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center justify-center text-center">
        
        {/* Main Character */}
        <div className="flex-shrink-0 mb-6">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-3 tracking-tight">
            {card.hanzi_trad}
          </h2>
          
          {/* Front: Audio Hint / Back: Full Details */}
          {side === 'back' && (
             <div className="inline-flex items-center gap-2 bg-brand-50 px-4 py-1.5 rounded-full">
                <span className="text-xl font-medium text-brand-700">{card.pinyin}</span>
                <SpeakButton text={card.hanzi_trad} className="text-brand-600 hover:bg-brand-100 p-1" />
             </div>
          )}
          {side === 'front' && (
             <div className="mt-2 opacity-30 hover:opacity-100 transition-opacity">
                <SpeakButton text={card.hanzi_trad} />
             </div>
          )}
        </div>

        {/* Meaning Section (Back Only) */}
        {side === 'back' && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-t border-gray-100 pt-6">
               <p className="text-2xl font-bold text-gray-800 leading-snug">
                 {card.ja_meaning}
               </p>
            </div>
            
            {/* Example Box */}
            <div className="bg-gray-50 p-4 rounded-2xl text-left w-full space-y-2">
              <p className="text-lg text-gray-900 leading-relaxed font-medium">{card.example_trad}</p>
              <p className="text-sm text-gray-500 font-mono">{card.example_pinyin}</p>
              <p className="text-sm text-gray-600 italic border-t border-gray-200 pt-2 mt-2">{card.example_ja}</p>
            </div>
            
             {/* Tags */}
             <div className="flex flex-wrap gap-2 justify-center pt-2">
                {card.tags.map((tag, i) => (
                  tag.scene && <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md">#{tag.scene}</span>
                ))}
             </div>
          </div>
        )}
        
        {/* Front: Tap hint */}
        {side === 'front' && (
           <p className="absolute bottom-6 text-sm text-gray-400 font-medium animate-pulse">
             Tap card to flip
           </p>
        )}
      </div>
    </div>
  );
}