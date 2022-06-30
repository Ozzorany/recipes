let recipes =
    [
        {
            id: '1',
            description: 'חביתה',
            tags: ['איטלקי']
        },
        {
            id: '2',
            description: 'פנקייק',
            tags: ['אמריקאי']
        },
    ]

async function fetchRecipes() {
    return recipes;
}

async function updateRecipe(recipe) {
    const index = recipes.findIndex(currentRecipe => currentRecipe.id === recipe.id);
    recipes[index] = recipe;
    return recipe;
}

async function deleteRecipe(recipeId) {
    const index = recipes.findIndex(currentRecipe => currentRecipe.id === recipeId);
    recipes.splice(index, 1);
    return true;
}

module.exports = {
    fetchRecipes,
    updateRecipe,
    deleteRecipe
};