interface FilterChip {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface FilterChipsProps {
  filters: FilterChip[];
  multiple?: boolean;
}

export default function FilterChips({ filters, multiple = false }: FilterChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter, idx) => (
        <button
          key={idx}
          onClick={filter.onClick}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter.active
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}