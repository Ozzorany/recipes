export interface AllRecipesFiltersProps {
  value: string;
  setValue: (value: string) => void;
  filterTags: string[];
  setFilterTags: (tags: string[]) => void;
  ownershipFilter: "all" | "owned" | "not-owned";
  setOwnershipFilter: (filter: "all" | "owned" | "not-owned") => void;
}
