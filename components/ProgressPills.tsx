interface ProgressPillsProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressPills({ current, total, label }: ProgressPillsProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
      {label && <span className="text-gray-600">{label}</span>}
      <span className="font-medium text-gray-900">{current}</span>
      <span className="text-gray-500">/</span>
      <span className="text-gray-700">{total}</span>
    </div>
  );
}