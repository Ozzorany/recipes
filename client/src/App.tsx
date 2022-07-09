import './App.css';
import NavigationBar from './components/NavigationBar';
import { Route, Routes, useNavigate } from "react-router-dom";
import AllRecepis from './pages/AllRecipes';
import MyRecepis from './pages/MyRecipes';
import CreateRecipe from './pages/CreateRecipe';
import useRecipes from './hooks/useRecipes';

function App() {
  const navigate = useNavigate()
  const { recipes, submitRecipe } = useRecipes();

  const navigateToHome = () => {
    navigate('/all-recipes', { replace: true });
  };


  return (
    <div className="App">
      <NavigationBar></NavigationBar>
      <header className="App-header">
        <Routes>
          <Route path='/all-recipes' element={<AllRecepis recipes={recipes}/>} />
          <Route path='/my-recipes' element={<MyRecepis />} />
          <Route path='/create-recipe' element={<CreateRecipe submitRecipe={submitRecipe}/>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
