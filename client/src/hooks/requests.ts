import axios, { AxiosResponse } from "axios";
import { Recipe } from "../models/recipe.model";
import * as React from 'react';

const d = process.env.REACT_APP_ENVIRONMENT;
const serverUrl = process.env.REACT_APP_LOCAL_SERVER;

async function httpGetAllRecipes() {  
  const response = await fetch(`${serverUrl}/recipes`);
  return await response.json();
}

async function httpSubmitRecipe(recipe: Recipe): Promise<any> {
  const response = await axios.post<Recipe>(
    `${serverUrl}/recipes/create`,
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
  try {
    return await fetch(`${serverUrl}recipes/${id}`, {
      method: "delete",
    });
  } catch {
    return { ok: false };
  }
}

export { httpGetAllRecipes, httpSubmitRecipe, httpDeleteRecipe, httpUploadImage };
