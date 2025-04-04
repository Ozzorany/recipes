import axios from "axios";
import { ChatBotRecipePayload, Recipe } from "../models/recipe.model";
import { User } from "../models/user.model";
import { auth } from "../utils/firebase.utils";
import { UserMnagementGroups } from "../models/groups.model";

const serverUrl = process.env.REACT_APP_SERVER;

async function httpGetHealthCheck(): Promise<any> {
  return axios.get(`${serverUrl}/health`, {
    headers: {
      uid: auth.currentUser?.uid || "",
    },
  });
}

async function httpGetAllRecipes(): Promise<Recipe[]> {
  const response = await axios.get(`${serverUrl}/recipes`, {
    headers: {
      uid: auth.currentUser?.uid || "",
    },
  });

  return response?.data
}

async function httpGetRecipesById(recipeId: string): Promise<Recipe> {
  const response = await axios.get(`${serverUrl}/recipes/${recipeId}`, {
    headers: {
      uid: auth.currentUser?.uid || "",
    },
  });

  return response?.data?.data
}

async function httpSubmitRecipe(recipe: Recipe): Promise<string> {
  const response = await axios.post<Recipe>(
    `${serverUrl}/recipes/create`,
    recipe
  );

  return response?.data?.id;
}

async function httpUpdateRecipe(recipe: Recipe): Promise<any> {
  const response = await axios.post<Recipe>(
    `${serverUrl}/recipes/update`,
    recipe
  );

  return response;
}

async function httpUploadImage(file: any): Promise<any> {
  const bodyFormData = new FormData();
  bodyFormData.append("image", file);

  const response = await axios.post<any>(
    `${serverUrl}/recipes/upload-image`,
    bodyFormData,
    {
      headers: {
        "Content-Type": file.type,
      },
    }
  );

  return response;
}

async function httpDeleteRecipe(recipeId: string) {
  const response = await axios.post<string>(`${serverUrl}/recipes/delete`, {
    recipeId,
  });

  return response;
}

async function httpCreateUser(user: User): Promise<any> {
  const response = await axios.post<User>(`${serverUrl}/users/create`, user);

  return response;
}

async function httpGetUserById(userId: string): Promise<any> {
  return axios.get(`${serverUrl}/users/details/${userId}`);
}

async function httpGetUserLevel(): Promise<any> {
  return axios.get(`${serverUrl}/users/level`, {
    headers: {
      uid: auth.currentUser?.uid || "",
    },
  });
}

async function httpVlidateUser(token: string): Promise<any> {
  return axios.get(`${serverUrl}/api/auth`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function httpGetUserGroups(): Promise<any> {
  return axios.get(`${serverUrl}/groups`, {
    headers: {
      uid: auth.currentUser?.uid || "",
    },
  });
}

async function httpGenerateGroupInvitationLink(groupId: string): Promise<any> {
  return axios.post(
    `${serverUrl}/groups/generate-invitation`,
    { groupId },
    {
      headers: {
        uid: auth.currentUser?.uid || "",
      },
    }
  );
}

async function httpGetUserManagementGroups(): Promise<UserMnagementGroups> {
  const response = await axios.get(`${serverUrl}/groups/management`, {
    headers: {
      uid: auth.currentUser?.uid || "",
    },
  });

  return response?.data
}

async function httpUpdateFavoriteRecipes(recipeId: string): Promise<any> {
  const response = await axios.post<string>(
    `${serverUrl}/users/favorite-recipes`,
    { recipeId },
    {
      headers: {
        uid: auth.currentUser?.uid || "",
      },
    }
  );

  return response;
}

async function httpJoinGroup(token: string): Promise<any> {
  const response = await axios.post<string>(
    `${serverUrl}/groups/join`,
    { token },
    {
      headers: {
        uid: auth.currentUser?.uid || "",
      },
    }
  );

  return response;
}

async function httpCreateNewGroup(name: string, groupId: string): Promise<any> {
  return axios.put(
    `${serverUrl}/groups/create`,
    { name, groupId },
    {
      headers: {
        uid: auth.currentUser?.uid || "",
      },
    }
  );
}

async function httpDeleteGroup(groupId: string): Promise<any> {
  const response = await axios.post<string>(
    `${serverUrl}/groups/delete-group`,
    { groupId },
    {
      headers: {
        uid: auth.currentUser?.uid || "",
      },
    }
  );

  return response;
}

async function httpUpdateRecipeLikes(recipeId: string): Promise<any> {
  const response = await axios.post<string>(
    `${serverUrl}/recipes/update/likes`,
    { recipeId },
    {
      headers: {
        uid: auth.currentUser?.uid || "",
      },
    }
  );

  return response;
}


async function httpGetRecipeFromSite(url: string) {
  const response = await axios.post<string>(`${serverUrl}/recipes/extract-recipe`, {
    url,
  });

  return response?.data;
}

async function httpUserFeatures(): Promise<any> {
  const response = await axios.get(`${serverUrl}/users/features`, {
      headers: {
        uid: auth.currentUser?.uid || "",
      },
    }
  );

  return response?.data;
}


async function httpRecipeChatbotResponse(message: string, recipe: ChatBotRecipePayload): Promise<any> {
  const response = await axios.post(`${serverUrl}/recipes/recipe-chatbot-response`, {
      recipe, message
    },
    
  );

  return response?.data;
}

async function httpVoiceAssistantResponse(currentStep: string, allSteps: string[], question: string, recipe: Recipe): Promise<any> {
  const response = await axios.post(`${serverUrl}/recipes/recipe-assistant-response`, {
      recipe, currentStep, allSteps, question
    }
  );

  return response.data;
}

async function httpRecipeSteps(method: string,): Promise<any> {
  const response = await axios.post(`${serverUrl}/recipes/recipe-steps`, {
    method
    },
  );

  return response?.data;
}



export {
  httpGetHealthCheck,
  httpGetAllRecipes,
  httpSubmitRecipe,
  httpDeleteRecipe,
  httpUploadImage,
  httpUpdateRecipe,
  httpGetRecipesById,
  httpCreateUser,
  httpGetUserById,
  httpVlidateUser,
  httpGetUserGroups,
  httpUpdateFavoriteRecipes,
  httpGetUserManagementGroups,
  httpJoinGroup,
  httpGenerateGroupInvitationLink,
  httpCreateNewGroup,
  httpDeleteGroup,
  httpGetUserLevel,
  httpUpdateRecipeLikes,
  httpGetRecipeFromSite,
  httpUserFeatures,
  httpRecipeChatbotResponse,
  httpVoiceAssistantResponse,
  httpRecipeSteps
};
