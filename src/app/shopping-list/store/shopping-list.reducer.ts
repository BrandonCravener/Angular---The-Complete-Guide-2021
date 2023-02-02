import { Ingredient } from "../../shared/ingredient.model";
import { AddIngredient, AddIngredients, ADD_INGREDIENT, ADD_INGREDIENTS, DeleteIngredient, DELETE_INGREDIENT, ShoppingListActions, StartEdit, START_EDIT, STOP_EDIT, UpdateIngredient, UPDATE_INGREDIENT } from "./shopping-list.actions";


export interface IngredientState {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIdx: number
}

const initState: IngredientState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ],
    editedIngredient: null,
    editedIngredientIdx: -1
}

export function shoppingListReducer(state: IngredientState = initState, action: ShoppingListActions) {
    switch (action.type) {
        case ADD_INGREDIENT:
            return { ...state, ingredients: [...state.ingredients, (action as AddIngredient).payload] };
        case ADD_INGREDIENTS:
            return { ...state, ingredients: [...state.ingredients, ...(action as AddIngredients).payload] }
        case UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIngredientIdx]
            const updatedIngredient = {
                ...ingredient,
                ...(action as UpdateIngredient).payload
            }
            const updatedIngredients = [...state.ingredients]
            updatedIngredients[state.editedIngredientIdx] = updatedIngredient

            return { ...state, ingredients: updatedIngredients, editedIngredientIdx: -1, editedIngredient: null }
        case DELETE_INGREDIENT:
            return {
                ...state, ingredients: state.ingredients.filter((ig, igIndex) => {
                    return igIndex != state.editedIngredientIdx
                }),
                editedIngredientIdx: -1,
                editedIngredient: null
            }
        case START_EDIT:
            return {
                ...state,
                editedIngredientIdx: (action as StartEdit).payload,
                editedIngredient: { ...state.ingredients[(action as StartEdit).payload] }
            }
        case STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIdx: -1
            }

        default:
            return state
    }
}