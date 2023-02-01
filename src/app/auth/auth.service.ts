import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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
  user = new BehaviorSubject<User>(null)
  apiKey = environment.fbKey
  private logoutTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<AuthRespData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(errRes => {
      return this.handleError(errRes)
    }), tap(resData => {
      this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
    }))
  }

  login(email: string, password: string) {
    return this.http.post<AuthRespData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
    }))
  }

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
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem("userData");
    if (this.logoutTimer) clearTimeout(this.logoutTimer)
  }

  autoLogout(expDur: number) {
    this.logoutTimer = setTimeout(() => {
      this.logout()
    }, expDur)
  }

  private handleAuth(email: string, uid: string, token: string, expiresIn: number) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000)

    const user = new User(email, uid, token, expDate)
    this.emitUser(user, expiresIn * 1000)

    localStorage.setItem('userData', JSON.stringify(user))
  }

  private handleError(errRes: HttpErrorResponse) {
    let errMsg = 'An problem occurred please try again later.'
    if (!errRes.error || !errRes.error.error) { return throwError(errMsg) }

    switch (errRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errMsg = 'Email already in use'
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errMsg = 'Invalid login credentials please try again'
        break

    }

    return throwError(errMsg)
  }

  private emitUser(user: User, expirationDuration: number) {
    this.user.next(user);
    this.autoLogout(expirationDuration);
  }
}
