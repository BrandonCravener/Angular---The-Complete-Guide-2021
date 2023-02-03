import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { Logout } from './store/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logoutTimer: any;

  constructor(private store: Store<fromApp.AppState>) { }

  setLogoutTime(expDur: number) {
    this.logoutTimer = setTimeout(() => {
      this.store.dispatch(new Logout())
    }, expDur)
  }

  clearLogoutTime() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer)
      this.logoutTimer = null;
    }
  }

}
