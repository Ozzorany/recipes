export interface Recipe {
    id: string,
    description: string,
    method: string,
    ingredients: string[],
    tags: string[],
    image: string,
    creatorId: string,
    sharedGroups: string[],
    isDeleted: boolean,
    likes: string[],
    createdAt?: Date,
    lastUpdatedAt?: Date
}

export interface SiteRecipe {
    title: string,
    method: string,
    ingredients: string[],

}