import createTheme from "@mui/material/styles/createTheme";
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';



const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: "#3d74eb",
    },
    background: {
      default: "#282c34",
    },
  },
  typography: {
    fontFamily: 'Raleway, Arial',
    fontWeightLight: 400,
  },
});

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export { theme, cacheRtl };