'use client';

import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react'; // If you don't have lucide-react, use emoji or standard icons

interface SessionCompleteProps {
  title?: string;
  subtitle?: string;
  onRestart?: () => void;
  homeHref?: string;
}

export default function SessionComplete({
  title = "Session Complete!",
  subtitle = "You've finished all your cards for now.",
  onRestart,
  homeHref = "/"
}: SessionCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-6 text-center animate-in fade-in duration-500">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{title}</h2>
      <p className="text-lg text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed">
        {subtitle}
      </p>
      
      <div className="w-full max-w-xs space-y-3">
        <Link 
          href={homeHref}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-center font-bold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-700 active:scale-95"
        >
          <span>Back to Home</span>
        </Link>
        
        {onRestart && (
          <button 
            onClick={onRestart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border-2 border-gray-200 py-4 text-center font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
          >
            <span>Review Again</span>
          </button>
        )}
      </div>
    </div>
  );
}