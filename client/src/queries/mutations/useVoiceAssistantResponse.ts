import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { httpVoiceAssistantResponse } from "../../hooks/requests";
import { RecipeResponsePayload } from "../../models/recipe.model";

export const useVoiceAssistantResponse = (
  options?: UseMutationOptions<void, Error, any>
) => {
  return useMutation({
    mutationFn: ({
      currentStep,
      allSteps,
      question,
      recipe,
    }: {
      currentStep: string;
      allSteps: string[];
      question: string;
      recipe: RecipeResponsePayload;
    }) => {
      return httpVoiceAssistantResponse(
        currentStep,
        allSteps,
        question,
        recipe
      );
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
  });
};
