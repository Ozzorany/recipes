import { useCallback, useState } from "react";
import { Recipe } from "../models/recipe.model";
import { httpDeleteRecipe, httpGetAllRecipes, httpSubmitRecipe } from "./requests";

export const useRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([])

    const deleteRecipe = useCallback(async (id: string) => {
        await httpDeleteRecipe(id);

    }, []);

    const submitRecipe = useCallback(async (recipe: Recipe) => {
        const response: Recipe = (await httpSubmitRecipe(recipe)).data;
        
        return response;        
    }, []);


    return {
        recipes,
        submitRecipe,
        deleteRecipe
    };
}

export default useRecipes;