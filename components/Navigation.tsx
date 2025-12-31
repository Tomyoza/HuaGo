'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Today' },
    { href: '/review', label: '復習' },
    { href: '/focus', label: 'Focus' },
    { href: '/learn', label: '新規' },
    { href: '/conversation', label: '会話' },
    { href: '/quiz', label: 'クイズ' },
    { href: '/insights', label: 'インサイト' },
    { href: '/test', label: '測定' },
    { href: '/settings', label: '設定' },
  ];

  return (
    <nav className="bg-gray-100 p-2 mb-4">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1 rounded text-sm ${
              pathname === item.href
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-200'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

