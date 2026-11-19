'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      disabled={!mounted}
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Change theme'}
      title={mounted ? `Switch to ${isDark ? 'light' : 'dark'} mode` : 'Change theme'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-wait dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {mounted && isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
