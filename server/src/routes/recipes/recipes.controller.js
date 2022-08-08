//@ts-check
const {
  fetchRecipes,
  updateRecipe,
  deleteRecipe,
  createRecipe,
  uploadImage,
} = require("../../models/recipe.model");

async function httpGetAllRecipes(req, res) {
  res.status(200).json(await fetchRecipes());
}

async function httpUpdateRecipe(req, res) {
  res.status(200).json(await updateRecipe(req.body));
}

async function httpCreateRecipe(req, res) {
  res.status(200).json(await createRecipe(req.body));
}

async function httpDeleteRecipe(req, res) {
  res.status(200).json(await deleteRecipe(req.params.id));
}

async function httpUploadImage(req, res) {
  const response = await uploadImage(req.file);

  if (response) {
    res.status(200).json({ downloadUrl: response });
  }
}

module.exports = {
  httpGetAllRecipes,
  httpUpdateRecipe,
  httpDeleteRecipe,
  httpCreateRecipe,
  httpUploadImage,
};
