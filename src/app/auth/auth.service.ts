import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as fromApp from '../store/app.reducer';
import { Auth, Logout } from './store/auth.actions';
import { User } from './user.model';

export interface AuthRespData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registed?: boolean;
}

interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // user = new BehaviorSubject<User>(null)
  apiKey = environment.fbKey
  private logoutTimer: any;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }

  autoLogin() {
    const uD: UserData = JSON.parse(localStorage.getItem("userData"))
    if (!uD) return

    const tokenExpDate = new Date(uD._tokenExpDate)
    const loadedUser = new User(uD.email, uD.id, uD._token, tokenExpDate)

    if (loadedUser.token) {
      const expDur = tokenExpDate.getTime() - new Date().getTime()

      this.emitUser(loadedUser, expDur)
    }
  }

  logout() {
    this.store.dispatch(new Logout())

    localStorage.removeItem("userData");
    if (this.logoutTimer) clearTimeout(this.logoutTimer)
  }

  autoLogout(expDur: number) {
    this.logoutTimer = setTimeout(() => {
      this.logout()
    }, expDur)
  }

  private emitUser(user: User, expirationDuration: number) {
    this.store.dispatch(new Auth(user))

    this.autoLogout(expirationDuration);
  }
}
