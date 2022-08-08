import axios, { AxiosResponse } from "axios";
import { Recipe } from "../models/recipe.model";

async function httpGetAllRecipes() {
  const response = await fetch("http://localhost:8080/recipes");
  return await response.json();
}

async function httpSubmitRecipe(recipe: Recipe): Promise<any> {
  const response = await axios.post<Recipe>(
    "http://localhost:8080/recipes/create",
    recipe
  );

  return response;
}

async function httpUploadImage(file: any): Promise<any> {
  const  bodyFormData = new FormData();
  bodyFormData.append('image', file); 

  const response = await axios.post<any>(
    "http://localhost:8080/recipes/upload-image",
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
  try {
    return await fetch(`http://localhost:8080/recipes/${id}`, {
      method: "delete",
    });
  } catch {
    return { ok: false };
  }
}

export { httpGetAllRecipes, httpSubmitRecipe, httpDeleteRecipe, httpUploadImage };
