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
      {recipes.map((recipe: any) => {
        return <div>{recipe.description}</div>;
      })}
    </div>
  );
}

export default MyRecepis;
