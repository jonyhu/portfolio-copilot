import { MacroViews } from '@/types/portfolio';

const MACRO_VIEWS_STORAGE_KEY = 'macro_views';

export function saveMacroViews(macroViews: MacroViews): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MACRO_VIEWS_STORAGE_KEY, JSON.stringify(macroViews));
    }
  } catch (error) {
    console.error('Failed to save macro views to localStorage:', error);
  }
}

export function loadMacroViews(): MacroViews | null {
  try {
    if (typeof window !== 'undefined') {
      const savedMacroViews = localStorage.getItem(MACRO_VIEWS_STORAGE_KEY);
      if (savedMacroViews) {
        return JSON.parse(savedMacroViews);
      }
    }
  } catch (error) {
    console.error('Failed to load macro views from localStorage:', error);
  }
  return null;
}

export function createDefaultMacroViews(): MacroViews {
  return {
    economicGrowth: '',
    interestRates: '',
    governmentPolicy: '',
    geopolitics: '',
    industrySpecific: '',
  };
}

export function getOrCreateMacroViews(): MacroViews {
  const savedMacroViews = loadMacroViews();
  if (savedMacroViews) {
    return savedMacroViews;
  }
  
  const defaultMacroViews = createDefaultMacroViews();
  saveMacroViews(defaultMacroViews);
  return defaultMacroViews;
}

export function clearMacroViews(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MACRO_VIEWS_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear macro views from localStorage:', error);
  }
} 