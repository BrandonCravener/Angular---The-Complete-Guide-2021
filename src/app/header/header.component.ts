import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logout } from '../auth/store/auth.actions';
import { GetRecipes, StoreRecipes } from '../recipes/store/recipe.action';

import * as fromApp from '../store/app.reducer'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  authenticated = false;
  private userSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(
      map(userState => userState.user)
    ).subscribe(user => {
      this.authenticated = !!user
    })
  }

  onSaveData() {
    this.store.dispatch(new StoreRecipes())
  }

  onFetchData() {
    this.store.dispatch(new GetRecipes())
  }

  logout() {
    this.store.dispatch(new Logout())
  }
}
