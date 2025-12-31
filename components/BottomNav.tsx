'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Using simple emoji icons for now, but Heroicons/Lucide would be better
const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/review', label: 'Review', icon: '📚' },
  { href: '/learn', label: 'Learn', icon: '✨' },
  { href: '/conversation', label: 'Speak', icon: '💬' },
  { href: '/insights', label: 'Stats', icon: 'bar_chart' }, // Changed icon to string for demo
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-white/20 shadow-soft rounded-2xl pointer-events-auto">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-50 text-brand-600 scale-105 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                  {item.icon === 'bar_chart' ? '📊' : item.icon} 
                </span>
                <span className={`text-[10px] font-medium mt-1 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}