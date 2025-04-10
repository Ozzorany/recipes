import { useQuery } from "@tanstack/react-query";
import { httpGetUserGroceryLists } from "../hooks/requests";
import { GroceryList } from "../models/grocery.model";


export const useGroceryLists = () => {
  return useQuery<GroceryList[]>({
    queryKey: ["groceryLists"],
    queryFn: httpGetUserGroceryLists,
  });
}; 