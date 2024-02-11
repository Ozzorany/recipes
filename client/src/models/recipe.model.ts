export interface Recipe {
    id: string,
    description: string,
    method: string,
    ingredients: string[],
    tags: string[],
    image: string,
    creatorId: string
}