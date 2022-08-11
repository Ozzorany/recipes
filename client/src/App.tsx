import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useCallback, useEffect, useRef } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import { useAppDispatch } from "./hooks/storeHooks";
import AllRecepis from "./pages/AllRecipes";
import CreateRecipe from "./pages/CreateRecipe";
import MyRecepis from "./pages/MyRecipes";
import { cacheRtl, theme } from "./settings";
import { fetchRecipes } from "./state/recipesSlice";

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = useRef(true);

  const initApp = useCallback(async () => {
    await dispatch(fetchRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      initApp();
    }
  }, [initApp]);

  const navigateToHome = () => {
    navigate("/all-recipes", { replace: true });
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <NavigationBar></NavigationBar>
          <Routes>
            <Route path="/" element={<Navigate to="/all-recipes" />} />
            <Route path="/all-recipes" element={<AllRecepis />} />
            <Route path="/my-recipes" element={<MyRecepis />} />
            <Route
              key="create-recipe"
              path="/create-recipe"
              element={<CreateRecipe/>}
            />
            <Route
              key="edit-recipe"
              path="/edit-recipe"
              element={<CreateRecipe/>}
            />
          </Routes>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
