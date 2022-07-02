let recipes =
    [
        {
            id: '1',
            description: 'חביתה',
            tags: ['איטלקי'],
            method: 'לקחת 2 ביצים, לערבב בקערה עם מלח ופלפל שחור. לשים במחבת- להפוך לאחר דקה בערך ולהוציא'
        },
        {
            id: '2',
            description: 'פנקייק',
            tags: ['אמריקאי'],
            method: 'לשים את הבלילה על המחבת ולהוציא'
        },
        {
            id: '3',
            description: 'פנקייק',
            tags: ['אמריקאי'],
            method: 'לשים את הבלילה על המחבת ולהוציא'
        },
        {
            id: '4',
            description: 'פנקייק',
            tags: ['אמריקאי'],
            method: 'לשים את הבלילה על המחבת ולהוציא'
        },
        {
            id: '5',
            description: 'פנקייק',
            tags: ['אמריקאי'],
            method: 'לשים את הבלילה על המחבת ולהוציא'
        },
        {
            id: '6',
            description: 'פנקייק',
            tags: ['אמריקאי'],
            method: 'לשים את הבלילה על המחבת ולהוציא'
        },
        {
            id: '7',
            description: 'פנקייק',
            tags: ['אמריקאי'],
            method: 'לשים את הבלילה על המחבת ולהוציא'
        },
        {
            id: '8',
            description: 'פנקייק',
            tags: ['אמריקאי'],
            method: 'לשים את הבלילה על המחבת ולהוציא'
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