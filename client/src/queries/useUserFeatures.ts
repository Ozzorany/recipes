import { useQuery } from "@tanstack/react-query";
import { httpUserFeatures } from "../hooks/requests";
import { Recipe } from "../models/recipe.model";
import { QUERY_KEYS } from "../constants";
import { USER_FEATURES } from "../models/user.model";

export const useUserFeatures = () => {
  return useQuery<USER_FEATURES[]>({
    queryKey: [QUERY_KEYS.USER_FEATURES],
    queryFn: async () => {
      return await httpUserFeatures();
    },
    staleTime: Infinity 
  });
};
