import './App.css';
import NavigationBar from './components/NavigationBar';
import { Route, Routes, useNavigate } from "react-router-dom";
import AllRecepis from './pages/AllRecipes';
import MyRecepis from './pages/MyRecipes';

function App() {
  const navigate = useNavigate()

  const navigateToHome = () => {
    navigate('/all-recipes', { replace: true });
  };

  return (
    <div className="App">
      <NavigationBar></NavigationBar>
      <header className="App-header">
      <Routes>
        <Route path='/all-recipes' element={<AllRecepis />} />
        <Route path='/my-recipes' element={<MyRecepis />} />
      </Routes>
      </header>
    </div>
  );
}

export default App;
