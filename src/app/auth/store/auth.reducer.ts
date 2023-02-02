import { Action } from "rxjs/internal/scheduler/Action";
import { User } from "../user.model";
import { AuthActions, Auth, AUTH, AuthFail, AUTH_FAIL, LOGIN_START, LOGOUT, SIGNUP_START, CLEAR_ERROR } from "./auth.actions";

export interface AuthState {
    user: User;
    authError: string;
    loading: boolean;
}


const initState = {
    user: null,
    authError: '',
    loading: false
}

export function authReducer(state: AuthState = initState, action: AuthActions) {
    switch (action.type) {
        case AUTH:
            let act = (action as Auth)

            return {
                ...state,
                authError: initState.authError,
                user: act.user,
                loading: false
            }
        case LOGOUT:
            return {
                ...state,
                user: initState.user,
                authError: initState.authError,
                loading: false
            }
        case LOGIN_START:
        case SIGNUP_START:
            return {
                ...state,
                user: initState.user,
                authError: initState.authError,
                loading: true
            }
        case AUTH_FAIL:
            return {
                ...state,
                user: initState.user,
                authError: (action as AuthFail).payload,
                loading: false
            }
        case CLEAR_ERROR:
            return {
                ...state,
                authError: null
            }


        default:
            return state
    }
}