export interface AllRecipesFiltersProps {
    value: string;
    setValue: (value: string) => void;
    filterTags: string[];
    setFilterTags: (tags: string[]) => void;
}