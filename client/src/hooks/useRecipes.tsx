import { useCallback, useEffect, useState } from "react";
import { Recipe } from "../models/recipe.model";
import { httpGetAllRecipes, httpSubmitRecipe } from "./requests";

export const useRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([])

    const getRecipes = useCallback(async () => {
        const fetchedRecipes = await httpGetAllRecipes();
        setRecipes(fetchedRecipes);
    }, []);


    useEffect(() => {
        getRecipes();
    }, [getRecipes]);

    const submitRecipe = useCallback(async (recipe: Recipe) => {
        const response = await httpSubmitRecipe(recipe);
        // TODO: Set success based on response.
        const success = response.ok;
    }, []);


    return {
        recipes,
        submitRecipe
    };
}

export default useRecipes;