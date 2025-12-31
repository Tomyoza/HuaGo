import type { Metadata } from 'next';
import './globals.css';
import SeedInitializer from '@/components/SeedInitializer';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'HuaGo - 台湾華語学習アプリ',
  description: 'SRS中心の台湾華語（繁體中文）学習アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">
        <SeedInitializer />
        <main className="pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

