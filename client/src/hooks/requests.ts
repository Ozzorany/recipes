import axios from "axios";
import { Recipe } from "../models/recipe.model";
import { User } from "../models/user.model";

const serverUrl = process.env.REACT_APP_SERVER;

async function httpGetAllRecipes(userId: string): Promise<any> {  
  return axios.get(`${serverUrl}/recipes/all/${userId}`); 
}

async function httpGetRecipesById(recipeId: string): Promise<any> {  
  return axios.get(`${serverUrl}/recipes/${recipeId}`); 
}

async function httpSubmitRecipe(recipe: Recipe): Promise<any> {
  const response = await axios.post<Recipe>(
    `${serverUrl}/recipes/create`,
    recipe
  );

  return response;
}

async function httpUpdateRecipe(recipe: Recipe): Promise<any> {
  const response = await axios.post<Recipe>(
    `${serverUrl}/recipes/update`,
    recipe
  );

  return response;
}

async function httpUploadImage(file: any): Promise<any> {
  const  bodyFormData = new FormData();
  bodyFormData.append('image', file); 

  const response = await axios.post<any>(
    `${serverUrl}/recipes/upload-image`,
    bodyFormData, 
    {
      headers: {
        'Content-Type': file.type
      }
    }
  );

  return response;
}

async function httpDeleteRecipe(id: string) {
  const response = await axios.delete<string>(`${serverUrl}/recipes`, {
    data: { id: id },
  });

  return response;
}

async function httpCreateUser(user: User): Promise<any> {
  const response = await axios.post<User>(
    `${serverUrl}/users/create`,
    user
  );

  return response;
}

async function httpGetUserById(userId: string): Promise<any> {  
  return axios.get(`${serverUrl}/users/${userId}`); 
}


export {
  httpGetAllRecipes,
  httpSubmitRecipe,
  httpDeleteRecipe,
  httpUploadImage,
  httpUpdateRecipe,
  httpGetRecipesById,
  httpCreateUser,
  httpGetUserById
};

