import type { Metadata } from 'next';
import './globals.css';
import SeedInitializer from '@/components/SeedInitializer';
import Navigation from '@/components/Navigation';

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
      <body>
        <SeedInitializer />
        <Navigation />
        {children}
      </body>
    </html>
  );
}

