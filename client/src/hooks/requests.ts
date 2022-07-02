async function httpGetAllRecipes() {
  const response = await fetch('http://localhost:8080/recipes');
  return await response.json();
}

export {
  httpGetAllRecipes,
};
