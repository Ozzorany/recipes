const { fetchRecipes, updateRecipe, deleteRecipe, createRecipe } = require('../../models/recipe.model');

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

module.exports = {
    httpGetAllRecipes,
    httpUpdateRecipe,
    httpDeleteRecipe,
    httpCreateRecipe
};