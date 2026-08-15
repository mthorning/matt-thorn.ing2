'use client';

import { useState, useEffect } from 'react';

export type ColourScheme = 'light' | 'dark';
export function useColourScheme(): [
  ColourScheme,
  (sheme: ColourScheme) => void,
] {
  const [scheme, setScheme] = useState<ColourScheme>(
    typeof window !== 'undefined' &&
      window.matchMedia(`(prefers-color-scheme: dark)`).matches
      ? 'dark'
      : 'light'
  );

  useEffect(() => {
    const activeDark = window.matchMedia(`(prefers-color-scheme: dark)`);

    const updateScheme = (e: MediaQueryListEvent) =>
      setScheme(e.matches ? 'dark' : 'light');
    activeDark.addEventListener('change', updateScheme);

    return () => {
      activeDark.removeEventListener('change', updateScheme);
    };
  }, [setScheme]);

  return [scheme, setScheme];
}
