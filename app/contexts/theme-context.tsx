import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "finance-tools-theme";

function getInitialPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedPreference = window.localStorage.getItem(STORAGE_KEY);

  return storedPreference === "light" || storedPreference === "dark"
    ? storedPreference
    : "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(getInitialPreference);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = preference;

    if (preference === "system") {
      root.removeAttribute("data-theme-manual");
    } else {
      root.dataset.themeManual = "true";
    }

    window.localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  const value = useMemo(() => ({ preference, setPreference }), [preference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }

  return context;
}
