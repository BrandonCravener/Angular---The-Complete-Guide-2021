import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES = '[Recipes] Set Recipes';
export const GET_RECIPES = '[Recipes] Get Recipes';
export const ADD_RECIPE = '[Recipes] Add Recipe';
export const UPDATE_RECIPE = '[Recipes] Update Recipe'
export const DELETE_RECIPE = '[Recipes] Delete Recipe'
export const STORE_RECIPES = '[Recipes] Store Recipes'

export class SetRecipes implements Action {
    readonly type: string = SET_RECIPES;

    constructor(public payload: Recipe[]) { }
}

export class GetRecipes implements Action {
    readonly type: string = GET_RECIPES
}

export class AddRecipe implements Action {
    readonly type: string = ADD_RECIPE

    constructor(public payload: Recipe) { }
}

export class UpdateRecipe implements Action {
    readonly type: string = UPDATE_RECIPE;

    constructor(public payload: { index: number, newRecipe: Recipe }) { }
}

export class DeleteRecipe implements Action {
    readonly type: string = DELETE_RECIPE;

    constructor(public payload: number) { }
}

export class StoreRecipes implements Action {
    readonly type: string = STORE_RECIPES;

}


export type RecipesActions = SetRecipes | GetRecipes | AddRecipe | UpdateRecipe | DeleteRecipe | StoreRecipes