import axios, { AxiosResponse } from "axios";
import { Recipe } from "../models/recipe.model";

async function httpGetAllRecipes() {
  const response = await fetch("http://localhost:8080/recipes");
  return await response.json();
}

async function httpSubmitRecipe(recipe: Recipe): Promise<any> {
  const response = await axios.post<Recipe>(
    "http://localhost:8080/recipes/create",
    recipe
  );

  return response;
}

async function httpDeleteRecipe(id: string) {
  try {
    return await fetch(`http://localhost:8080/recipes/${id}`, {
      method: "delete",
    });
  } catch {
    return { ok: false };
  }
}

export { httpGetAllRecipes, httpSubmitRecipe, httpDeleteRecipe };
