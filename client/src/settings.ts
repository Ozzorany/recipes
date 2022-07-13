import red from "@mui/material/colors/red";
import createTheme from "@mui/material/styles/createTheme";

  const theme = createTheme({
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

export default theme;