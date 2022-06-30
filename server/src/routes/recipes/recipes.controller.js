const { fetchRecipes } = require('../../models/recipe.model');

async function httpGetAllRecipes(req, res) {
    res.status(200).json(await fetchRecipes());
}

module.exports = {
    httpGetAllRecipes,
};