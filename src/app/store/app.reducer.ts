import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'
import * as fromAuth from '../auth/store/auth.reducer'
import * as fromRecipes from '../recipes/store/recipe.reducer'
import { ActionReducerMap } from '@ngrx/store'

export interface AppState {
    shoppingList: fromShoppingList.IngredientState
    auth: fromAuth.AuthState
    recipes: fromRecipes.RecipeState
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipes.recipeReducer
}