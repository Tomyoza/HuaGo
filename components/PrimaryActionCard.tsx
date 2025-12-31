'use client';

import Link from 'next/link';

interface PrimaryActionCardProps {
  title: string;
  description: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  color?: 'brand' | 'orange' | 'purple' | 'green'; // Add color themes
  onClick?: () => void;
}

export default function PrimaryActionCard({
  title,
  description,
  href,
  icon,
  disabled = false,
  color = 'brand',
  onClick
}: PrimaryActionCardProps) {
  
  // Color mapping
  const colorStyles = {
    brand: 'bg-white border-l-4 border-brand-500 text-brand-600',
    orange: 'bg-white border-l-4 border-orange-500 text-orange-600',
    purple: 'bg-white border-l-4 border-purple-500 text-purple-600',
    green: 'bg-white border-l-4 border-green-500 text-green-600',
  };

  const content = (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl bg-white p-5 shadow-sm border border-gray-100
        transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]
        ${disabled ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer'}
      `}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-full text-2xl shrink-0
            ${disabled ? 'bg-gray-100' : 'bg-gray-50'}
          `}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
            {!disabled && <span className="text-gray-300">→</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );

  if (disabled) {
    return <div>{content}</div>;
  }

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}