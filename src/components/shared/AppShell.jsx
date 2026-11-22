'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

function AppShellContent({ children }) {
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function AppShell({ children }) {
  return (
    <Suspense fallback={children}>
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  );
}
