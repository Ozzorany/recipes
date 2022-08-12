import { useEffect } from "react";
import { useAppSelector } from "../hooks/storeHooks";
import { selectRecipes } from "../state/recipesSlice";

function MyRecepis() {
  const recipes = useAppSelector((state) => selectRecipes(state));

  useEffect(() => {
    console.log(recipes);
  }, [recipes]);
  
  return (
    <div>
    </div>
  );
}

export default MyRecepis;
