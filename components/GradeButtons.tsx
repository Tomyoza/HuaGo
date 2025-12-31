import type { Grade } from '@/lib/types';

interface GradeButtonsProps {
  onGrade: (grade: Grade) => void;
  disabled?: boolean;
}

export default function GradeButtons({ onGrade, disabled = false }: GradeButtonsProps) {
  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={() => onGrade('AGAIN')}
        disabled={disabled}
        className="flex-1 px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <div className="font-semibold">AGAIN</div>
        <div className="text-sm opacity-90">忘れた</div>
      </button>
      <button
        onClick={() => onGrade('HARD')}
        disabled={disabled}
        className="flex-1 px-6 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <div className="font-semibold">HARD</div>
        <div className="text-sm opacity-90">難しい</div>
      </button>
      <button
        onClick={() => onGrade('EASY')}
        disabled={disabled}
        className="flex-1 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <div className="font-semibold">EASY</div>
        <div className="text-sm opacity-90">簡単</div>
      </button>
    </div>
  );
}