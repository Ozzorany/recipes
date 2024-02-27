import { useMutation } from "@tanstack/react-query";
import { httpCreateNewGroup } from "../../hooks/requests";

export const useCreateNewGroup = () => {
  return useMutation({
    mutationFn: ({ groupName, groupId }: { groupName: string; groupId: string }) => {
      return httpCreateNewGroup(groupName, groupId);
    },
  });
};
