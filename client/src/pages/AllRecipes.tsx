import RecipeReviewCard from "../components/RecipeReviewCard";
import useRecipes from "../hooks/useRecipes";

function AllRecepis() {
  const recipes = useRecipes();

  return (
    <div className="d-flex justify-content-center">
      {
        recipes.map((recipe) => {
          return <div className="m-2" key={recipe.id}><RecipeReviewCard recipe={recipe}/></div>
        })
      }
    </div>
  );
}

export default AllRecepis;