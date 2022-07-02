import { useCallback, useEffect, useState } from "react"
import { httpGetAllRecipes } from "./requests";

export const useRecipes = () => {
    const [recipes, setRecipes] = useState<any[]>([])

    const getRecipes = useCallback(async () => {
        const fetchedRecipes = await httpGetAllRecipes();
        setRecipes(fetchedRecipes);
    }, []);

    useEffect(() => {
        getRecipes();
    }, [getRecipes]);


    return recipes;
}

export default useRecipes;