'use client';

import Link from 'next/link';

interface PrimaryActionCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  disabled?: boolean;
}

export default function PrimaryActionCard({
  title,
  description,
  href,
  icon,
  disabled = false
}: PrimaryActionCardProps) {
  const content = (
    <div className={`bg-white rounded-lg shadow p-6 ${disabled ? 'opacity-50' : 'hover:shadow-lg transition-shadow'}`}>
      <div className="flex items-start gap-4">
        {icon && <span className="text-3xl">{icon}</span>}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );

  if (disabled) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}