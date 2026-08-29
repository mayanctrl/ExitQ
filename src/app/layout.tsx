import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExitQ — Smart Exit. Secure Campus.',
  description:
    'A timetable-aware campus exit management platform. Centralized exit authorization engine with QR verification, timetable intelligence, and audit trails.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-[#f7f7f5] suppressHydrationWarning">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('exitq_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-[#588157]/20 selection:text-[#344e41]">
        {children}
      </body>
    </html>
  );
}
