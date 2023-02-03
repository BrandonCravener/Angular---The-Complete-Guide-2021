import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Effect, ofType, Actions } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import { AUTH, Auth, AuthFail, AutoLogin, AUTO_LOGIN, LoginStart, LOGIN_START, LOGOUT, SignupStart, SIGNUP_START } from "./auth.actions";

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

const handleAuth = (expiresIn: number, email: string, localId: string, idToken: string) => {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(email, localId, idToken, expDate)

    localStorage.setItem('userData', JSON.stringify(user))

    return new Auth(user)
}

const handleErr = (errRes: HttpErrorResponse) => {
    let errMsg = 'An problem occurred please try again later.'
    if (!errRes.error || !errRes.error.error) { return of(new AuthFail(errMsg)) }

    switch (errRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errMsg = 'Email already in use'
            break;
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
            errMsg = 'Invalid login credentials please try again'
            break

    }
    return of(new AuthFail(errMsg))
}


@Injectable()
export class AuthEffects {

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(SIGNUP_START),
        switchMap((signupAction: SignupStart) => {
            return this.http.post<AuthRespData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fbKey}`, {
                email: signupAction.credentials.email,
                password: signupAction.credentials.password,
                returnSecureToken: true
            }).pipe(
                tap(resData => {
                    this.authService.setLogoutTime(+resData.expiresIn * 1000)
                }),
                map((resData: AuthRespData) => {
                    return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                }),
                catchError(errRes => {
                    return handleErr(errRes)
                })
            )
        })
    )

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(LOGIN_START),
        switchMap((authData: LoginStart) => {
            return this.http.post<AuthRespData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fbKey}`, {
                email: authData.credentials.email,
                password: authData.credentials.password,
                returnSecureToken: true
            }).pipe(
                tap(resData => {
                    this.authService.setLogoutTime(+resData.expiresIn * 1000)
                }),
                map((resData: AuthRespData) => {
                    return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
                }),
                catchError(errRes => {
                    return handleErr(errRes)
                })
            )
        })
    )

    @Effect({
        dispatch: false
    })
    authRedirect = this.actions$.pipe(ofType(AUTH), tap(authAction => {
        const act = (authAction as Auth)
        if (act.redirect) this.router.navigate(['/'])
    }));


    @Effect()
    authAutoLogin = this.actions$.pipe(
        ofType(AUTO_LOGIN),
        map(() => {
            const uD: UserData = JSON.parse(localStorage.getItem("userData"))

            if (!uD) return {
                type: 'VOID'
            }

            const tokenExpDate = new Date(uD._tokenExpDate)
            const loadedUser = new User(uD.email, uD.id, uD._token, tokenExpDate)

            if (loadedUser.token) {
                const expDur = tokenExpDate.getTime() - new Date().getTime()
                this.authService.setLogoutTime(expDur)
                return new Auth(loadedUser, false)
            }
            return {
                type: 'VOID'
            }
        })
    )

    @Effect({
        dispatch: false
    })
    authLogout = this.actions$.pipe(ofType(LOGOUT), tap(() => {
        this.authService.clearLogoutTime();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth'])
    }))

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }


}