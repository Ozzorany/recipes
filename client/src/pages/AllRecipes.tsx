import RecipeReviewCard from "../components/RecipeReviewCard";
import useRecipes from "../hooks/useRecipes";
import styles from './AllRecipes.module.css'; // Import css modules stylesheet as styles

function AllRecepis() {
  const recipes = useRecipes();

  return (
    <div className={styles.container}>
      {
        recipes.map((recipe) => {
          return <div className={styles.card} key={recipe.id}><RecipeReviewCard recipe={recipe} /></div>
        })
      }
    </div>
  );
}

export default AllRecepis;