import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import { GET_RECIPES, SetRecipes, STORE_RECIPES } from "./recipe.action";

import * as fromApp from '../../store/app.reducer'


@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(GET_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>('https://angular-the-complete-guide-21-default-rtdb.firebaseio.com/recipes.json')
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return new SetRecipes(recipes)
        })
    )

    @Effect({
        dispatch: false
    })
    storeRecipes = this.actions$.pipe(
        ofType(STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([_action, recipesState]) => {
            return this.http.put('https://angular-the-complete-guide-21-default-rtdb.firebaseio.com/recipes.json',
                recipesState.recipes
            )
        })
    )

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) { }
}