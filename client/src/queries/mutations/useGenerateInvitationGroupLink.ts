import { useMutation } from "@tanstack/react-query";
import { httpGenerateGroupInvitationLink } from "../../hooks/requests";

export const useGenerateInvitationGroupLink = () => {
  return useMutation({
    mutationFn: (groupId: string) => {
      return httpGenerateGroupInvitationLink(groupId);
    },
  });
};
