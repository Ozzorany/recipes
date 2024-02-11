import { useMutation } from "@tanstack/react-query";
import { httpCreateUser } from "../hooks/requests";
import { User } from "../models/user.model";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (user: User) => {
      return httpCreateUser(user);
    },
  });
};
