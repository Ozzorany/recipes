import createCache from '@emotion/cache';
import createTheme from "@mui/material/styles/createTheme";
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';


const sunsetGlow = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FF6F61" }, // Coral red
    secondary: { main: "#FFC107" }, // Warm yellow
    background: { default: "#FFF3E0", paper: "#FFFFFF" }, // Soft beige
    text: { primary: "#4E342E", secondary: "#795548" }, // Brownish tones
  },
});


const darkNeon = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00E5FF" }, // Neon cyan
    secondary: { main: "#FF4081" }, // Hot pink
    background: { default: "#121212", paper: "#1E1E1E" }, // Dark grey
    text: { primary: "#E0E0E0", secondary: "#B0BEC5" }, // Soft white
  },
});

export const darkAurora = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00C2FF" }, // Bright Cyan
    secondary: { main: "#F50057" }, // Neon Pink
    background: { default: "#121212", paper: "#1E1E1E" }, // Deep Dark
    text: { primary: "#E0E0E0", secondary: "#B3B3B3" }, // Soft White/Grey
  },
});

export const neoTokyo = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FF3CAC" }, // Vibrant Magenta
    secondary: { main: "#38F9D7" }, // Neon Aqua
    background: { default: "#101820", paper: "#17202A" }, // Midnight Blue
    text: { primary: "#F8F8F8", secondary: "#A0A0A0" }, // Bright White
  },
});

export const pastelBreeze = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6D9DC5" }, // Soft Blue
    secondary: { main: "#F7A072" }, // Warm Coral
    background: { default: "#F4F9FF", paper: "#FFFFFF" }, // Gentle Whites
    text: { primary: "#333333", secondary: "#666666" }, // Dark Grey for contrast
  },
});

export const sunnyMorning = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FFBE0B" }, // Warm Yellow
    secondary: { main: "#FB5607" }, // Energetic Orange
    background: { default: "#FFF8E7", paper: "#FFFFFF" }, // Soft Cream & White
    text: { primary: "#333333", secondary: "#555555" }, // Dark Greys for readability
  },
});

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const themes = {
  darkNeon,
  sunsetGlow,
  neoTokyo,
  darkAurora,
  sunnyMorning,
  pastelBreeze
} as const ;

type ThemeName = keyof typeof themes; // 'darkNeon' | 'elegantLight' | 'sunsetGlow' | 'cyberpunk'


export { cacheRtl, themes };
export type { ThemeName };

