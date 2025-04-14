import { useMutation } from "@tanstack/react-query";
import { httpGenerateRecipeAssistant } from "../../hooks/requests";

export const useGenerateRecipeAssistantMutation = () => {
  return useMutation({
    mutationFn: (input: string) => {
      return httpGenerateRecipeAssistant(input);
    },
  });
};
