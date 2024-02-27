import { useMutation } from "@tanstack/react-query";
import { httpDeleteGroup } from "../../hooks/requests";

export const useDeleteGroup = () => {
  return useMutation({
    mutationFn: ({ groupId }: { groupId: string }) => {
      return httpDeleteGroup(groupId);
    },
  });
};
