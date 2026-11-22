import { Geist, Geist_Mono } from 'next/font/google';
import AppShell from '@/components/shared/AppShell';
import ThemeProvider from '@/components/shared/ThemeProvider';
import ToastProvider from '@/components/shared/ToastProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: 'MentorLagbe | Find Your Perfect Tutor',
    template: '%s | MentorLagbe',
  },
  description:
    'Connect with qualified tutors and discover the right tuition opportunities with MentorLagbe.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ToastProvider />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
