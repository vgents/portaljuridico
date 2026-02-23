import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  darkMode: 'portal_juridico_dark_mode',
  readingFontSizeDelta: 'portal_juridico_reading_font_size_delta'
};

const MIN_DELTA = -8;
const MAX_DELTA = 8;
const STEP = 2;

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [darkMode, setDarkModeState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.darkMode);
    return stored === 'true';
  });
  const [readingFontSizeDelta, setReadingFontSizeDeltaState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.readingFontSizeDelta);
    const n = parseInt(stored, 10);
    return Number.isNaN(n) ? 0 : Math.max(MIN_DELTA, Math.min(MAX_DELTA, n));
  });

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', darkMode);
    localStorage.setItem(STORAGE_KEYS.darkMode, String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--reading-font-size-delta', `${readingFontSizeDelta}px`);
    localStorage.setItem(STORAGE_KEYS.readingFontSizeDelta, String(readingFontSizeDelta));
  }, [readingFontSizeDelta]);

  const toggleDarkMode = useCallback(() => {
    setDarkModeState((prev) => !prev);
  }, []);

  const increaseReadingFontSize = useCallback(() => {
    setReadingFontSizeDeltaState((prev) => Math.min(MAX_DELTA, prev + STEP));
  }, []);

  const decreaseReadingFontSize = useCallback(() => {
    setReadingFontSizeDeltaState((prev) => Math.max(MIN_DELTA, prev - STEP));
  }, []);

  const value = {
    darkMode,
    toggleDarkMode,
    readingFontSizeDelta,
    increaseReadingFontSize,
    decreaseReadingFontSize,
    canIncreaseFontSize: readingFontSizeDelta < MAX_DELTA,
    canDecreaseFontSize: readingFontSizeDelta > MIN_DELTA
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return ctx;
}
