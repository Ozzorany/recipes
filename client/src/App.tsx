import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import NavigationBar from './components/NavigationBar';
import useRecipes from './hooks/useRecipes';
import AllRecepis from './pages/AllRecipes';
import CreateRecipe from './pages/CreateRecipe';
import MyRecepis from './pages/MyRecipes';
import { cacheRtl, theme } from './settings';



function App() {
  const navigate = useNavigate()
  const { submitRecipe } = useRecipes();

  const navigateToHome = () => {
    navigate('/all-recipes', { replace: true });
  };


  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <NavigationBar></NavigationBar>
          <Routes>
            <Route path="/" element={<Navigate to="/all-recipes" />} />
            <Route path='/all-recipes' element={<AllRecepis />} />
            <Route path='/my-recipes' element={<MyRecepis />} />
            <Route path='/create-recipe' element={<CreateRecipe submitRecipe={submitRecipe} />} />
          </Routes>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
