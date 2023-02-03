import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Recipe } from './recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import { GetRecipes, SET_RECIPES } from './store/recipe.action';
import { Actions, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';
import { Auth } from '../auth/store/auth.actions';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes
      }),
      switchMap(recipes => {
        if (recipes.length == 0) {
          this.store.dispatch(new GetRecipes())
          return this.actions$.pipe(
            ofType(SET_RECIPES),
            take(1)
          )
        }
        return of(recipes)
      })
    )


  }
}
