import {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
  useContext,
} from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { themes, ThemeName } from "../settings";

interface ThemeContextProps {
  themeName: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
  const storedTheme =
    (localStorage.getItem("theme") as ThemeName) || "pastelBreeze";
  const [themeName, setThemeName] = useState<ThemeName>(storedTheme);

  useEffect(() => {
    localStorage.setItem("theme", themeName);
  }, [themeName]);

  const theme = useMemo(() => themes[themeName], [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setTheme: setThemeName }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
