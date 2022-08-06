//@ts-check
const firebase = require("../firebase/db");
const firestore = firebase.firestore();
const COLLECTION = "recipes";

async function fetchRecipes() {
  const recipesRef = firestore.collection(COLLECTION).get();
  return (await recipesRef).docs.map((doc) => doc.data());
}

async function updateRecipe(recipe) {
  const cityRef = firestore.collection(COLLECTION).doc(recipe.id);
  const res = await cityRef.update(recipe);

  return recipe;
}

async function createRecipe(recipe) {
  const ref = await firestore.collection(COLLECTION);
  const newId = ref.doc().id;
  ref.doc(newId).set(recipe);
  recipe.id = newId;
  return recipe;
}

async function deleteRecipe(recipeId) {
  const res = await firestore.collection(COLLECTION).doc(recipeId).delete();
  return true;
}

module.exports = {
  fetchRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
};
