export interface NewSelectedGroceryItem {
  name: string;
  amount: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  checked: boolean;
}

export interface AddGroceryItemsParams {
  listId: string;
  items: GroceryItem[];
}

export interface CreateGroceryListParams {
  name: string;
}

export interface GroceryList {
  id: string;
  name: string;
  ownerId: string;
  items: GroceryItem[];
  sharedWith: string[];
}
