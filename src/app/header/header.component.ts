import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Logout } from '../auth/store/auth.actions';

import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  authenticated = false;
  private userSub: Subscription;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>) { }

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
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  logout() {
    this.store.dispatch(new Logout())
  }
}
