import { Recipe } from "../../models/recipe.model";

export const sortRecipes = (recipes: Recipe[]) => {
    return recipes.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          if (dateA !== dateB) return dateB - dateA; 
        } else if (a.createdAt) {
          return -1; 
        } else if (b.createdAt) {
          return 1; 
        }      
        return a.description.localeCompare(b.description);
      });
}