import { Recipe } from "../recipe.model";
import { AddRecipe, ADD_RECIPE, DeleteRecipe, DELETE_RECIPE, RecipesActions, SetRecipes, SET_RECIPES, UpdateRecipe, UPDATE_RECIPE } from "./recipe.action";

export interface RecipeState {
    recipes: Recipe[];
}
const initState: RecipeState = {
    recipes: []
}


export function recipeReducer(state = initState, action: RecipesActions) {
    switch (action.type) {
        case SET_RECIPES:
            const act1 = (action as SetRecipes)
            return {
                ...state,
                recipes: [...act1.payload]
            }

        case ADD_RECIPE:
            const act2 = (action as AddRecipe)
            return {
                ...state,
                recipes: [...state.recipes, act2.payload]
            }
        case UPDATE_RECIPE:
            const updatedRecipe = { ...state.recipes[(action as UpdateRecipe).payload.index], ...(action as UpdateRecipe).payload.newRecipe }
            const updatedList = [...state.recipes]
            updatedList[(action as UpdateRecipe).payload.index] = updatedRecipe

            return {
                ...state,
                recipes: updatedList
            }
        case DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index != (action as DeleteRecipe).payload
                })
            }
        default:
            return state
    }
}