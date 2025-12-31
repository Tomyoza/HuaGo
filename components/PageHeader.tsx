'use client';

import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  action?: React.ReactNode; // Allow adding an action button on the right
}

export default function PageHeader({ title, showBack = false, backHref = '/', action }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface-50/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link 
              href={backHref} 
              className="p-2 -ml-2 rounded-full hover:bg-black/5 text-gray-600 transition-colors"
            >
              <span className="text-xl leading-none">←</span>
            </Link>
          )}
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}