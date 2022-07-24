import { Recipe } from "../models/recipe.model";

async function httpGetAllRecipes() {
  const response = await fetch('http://localhost:8080/recipes');
  return await response.json();
}

async function httpSubmitRecipe(recipe: Recipe) {
  try {
    return await fetch(`http://localhost:8080/recipes/create`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify(recipe)
      });
  } catch (err) {
    return { ok: false };
  }
}

async function httpDeleteRecipe(id: string) {
  try {
    return await fetch(`http://localhost:8080/recipes/${id}`,
      {
        method: 'delete',
      });
  } catch {
    return { ok: false };
  }
}

export {
  httpGetAllRecipes,
  httpSubmitRecipe,
  httpDeleteRecipe
};
