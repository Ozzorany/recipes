async function fetchRecipes(req, res) {
    const recipes = [
        {
            id: 1,
            description: 'חביתה',
            tags: ['איטלקי']
        }
    ];
    
    return recipes;
}

module.exports = {
    fetchRecipes,
};