import { useMutation } from "@tanstack/react-query";
import { httpJoinGroup } from "../../hooks/requests";

export const useJoinGroup = () => {
  return useMutation({
    mutationFn: (token: string) => {
      return httpJoinGroup(token);
    },
  });
};
