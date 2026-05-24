import type { Metadata } from 'next';
import { Merriweather, Inter } from 'next/font/google';
import './globals.css';
import { Sidebar, SIDEBAR_WIDTH } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ToastProvider } from '../components/ui/Toast';

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-serif',
});

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'VedaAI — AI Assessment Creator',
  description: 'Premium AI-Powered Assessment Generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${merriweather.variable} ${inter.variable} font-sans antialiased`}>
        <ToastProvider>
          <Sidebar />
          <div className={`flex flex-col min-h-screen md:ml-[240px] pb-16 md:pb-0`}>
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
