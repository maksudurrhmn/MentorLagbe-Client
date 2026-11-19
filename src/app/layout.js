import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ThemeProvider from '@/components/shared/ThemeProvider';
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
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
