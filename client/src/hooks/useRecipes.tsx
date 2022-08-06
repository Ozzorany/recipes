import { useCallback, useState } from "react";
import { Recipe } from "../models/recipe.model";
import { httpDeleteRecipe, httpGetAllRecipes, httpSubmitRecipe } from "./requests";

export const useRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([])

    const getRecipes = useCallback(async () => {        
        const fetchedRecipes = await httpGetAllRecipes();
        setRecipes(fetchedRecipes);
    }, []);

    const deleteRecipe = useCallback(async (id: string) => {
        const response = await httpDeleteRecipe(id);
        const success = response.ok;

        if (success) {
            getRecipes();
        }

    }, [getRecipes]);

    const submitRecipe = useCallback(async (recipe: Recipe) => {
        const response = await httpSubmitRecipe(recipe);
        // TODO: Set success based on response.
        const success = response.ok;
    }, []);


    return {
        recipes,
        submitRecipe,
        deleteRecipe
    };
}

export default useRecipes;