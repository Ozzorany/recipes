export interface User {
    id: string,
    displayName: string,
    email: string,
    logo: string,
    managedGroups: string[],
    sharedGroups: string[],
    favoriteRecipes: string[]
}

export enum USER_FEATURES {
    RECIPE_FROM_SITE_TOGGLE = "recipe_from_site_toggle"
}