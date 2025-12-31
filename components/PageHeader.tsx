'use client';

import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
}

export default function PageHeader({ title, showBack = false, backHref = '/' }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center">
        {showBack && (
          <Link href={backHref} className="mr-3 text-gray-600 hover:text-gray-900">
            ←
          </Link>
        )}
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
    </header>
  );
}