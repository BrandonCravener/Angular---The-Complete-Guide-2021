import { Action } from "@ngrx/store"
import { User } from "../user.model"

export const AUTO_LOGIN = '[Auth] Auto Login'
export const LOGIN_START = '[Auth] Login Start'
export const SIGNUP_START = '[Auth] Signup Start'
export const AUTH = '[Auth] LOGIN'
export const AUTH_FAIL = '[Auth] Login Fail'
export const CLEAR_ERROR = '[Auth] Clear Error'
export const LOGOUT = '[Auth] LOGOUT'


export class AutoLogin implements Action {
    readonly type: string = AUTO_LOGIN;

}

export class LoginStart implements Action {
    readonly type: string = LOGIN_START

    constructor(public credentials: { email: string, password: string }) { }
}

export class SignupStart implements Action {
    readonly type: string = SIGNUP_START;

    constructor(public credentials: { email: string, password: string }) { }
}

export class Auth implements Action {
    readonly type: string = AUTH

    constructor(public user: User, public redirect: boolean = true) { }
}

export class AuthFail implements Action {
    readonly type: string = AUTH_FAIL

    constructor(public payload: string) { }
}

export class ClearError implements Action {
    readonly type: string = CLEAR_ERROR
}

export class Logout implements Action {
    readonly type: string = LOGOUT
}

export type AuthActions = Auth | Logout | LoginStart | AuthFail | SignupStart | AutoLogin