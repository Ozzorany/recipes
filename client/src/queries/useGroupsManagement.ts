import { useQuery } from "@tanstack/react-query";
import { httpGetUserManagementGroups } from "../hooks/requests";
import { UserMnagementGroups } from "../models/groups.model";

export const useGroupsManagement = () => {
  return useQuery<UserMnagementGroups>({
    queryKey: ["useGroupsManagement"],
    queryFn: async () => {
      return await httpGetUserManagementGroups();
    },
    staleTime: Infinity,
  });
};
