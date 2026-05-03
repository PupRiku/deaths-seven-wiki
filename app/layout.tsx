import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/ui/Sidebar';

export const metadata: Metadata = {
  title: "Death's Seven — DM Wiki",
  description: "Campaign bible and session tools for Death's Seven",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="wiki-layout">
          <Sidebar />
          <main className="wiki-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
