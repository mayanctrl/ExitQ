import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExitQ — Smart Exit. Secure Campus.',
  description:
    'A timetable-aware campus exit management platform. Centralized exit authorization engine with QR verification, timetable intelligence, and audit trails.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-[#f7f7f5]">
      <body className="min-h-full flex flex-col antialiased selection:bg-[#588157]/20 selection:text-[#344e41]">
        {children}
      </body>
    </html>
  );
}
