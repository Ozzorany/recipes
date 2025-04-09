import { useMutation } from "@tanstack/react-query";
import { httpGenerateGroceryInvitationLink } from "../../hooks/requests";

export const useGenerateGroceryInvitationLink = () => {
  return useMutation({
    mutationFn: (listId: string) => {
      return httpGenerateGroceryInvitationLink(listId);
    },
  });
}; 