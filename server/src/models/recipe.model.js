//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const COLLECTION = "recipes";

async function fetchRecipes() {
  const recipesRef = firestore.collection(COLLECTION).get();
  return (await recipesRef).docs.map((doc) => doc.data());
}

async function updateRecipe(recipe) {
  // const index = recipes.findIndex(currentRecipe => currentRecipe.id === recipe.id);
  //recipes[index] = recipe;
  return recipe;
}

async function createRecipe(recipe) {
  await firestore.collection(COLLECTION).doc().set(recipe);
  return recipe;
}

async function deleteRecipe(recipeId) {
  //const index = recipes.findIndex(currentRecipe => currentRecipe.id === recipeId);
  //recipes.splice(index, 1);
  return true;
}

module.exports = {
  fetchRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
};
