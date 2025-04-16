export interface Group {
  id: string;
  managerId: string;
  name: string;
  users: string[];
}

export type RecipeGroupProps = Pick<Group, "id" | "name">;

export interface UserMnagementGroups {
  managedGroups: Group[];
  sharedGroups: Group[];
}
