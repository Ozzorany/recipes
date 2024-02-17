import { useMutation } from "@tanstack/react-query";
import { httpCreateNewGroup } from "../../hooks/requests";

export const useCreateNewGroup = () => {
  return useMutation({
    mutationFn: (groupName: string) => {
      return httpCreateNewGroup(groupName);
    },
  });
};
