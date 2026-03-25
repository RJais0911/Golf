import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { UserProfile } from '../../core/models/app.models';

export interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  accessToken: null,
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, AuthActions.signup, AuthActions.logout, AuthActions.refreshToken, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { accessToken, user }) => ({
    ...state,
    accessToken,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.signupSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),
  on(AuthActions.logoutSuccess, AuthActions.refreshTokenFailure, (state) => ({
    ...state,
    accessToken: null,
    user: null,
    loading: false,
    error: null
  })),
  on(AuthActions.refreshTokenSuccess, (state, { accessToken }) => ({
    ...state,
    accessToken,
    loading: false
  })),
  on(AuthActions.syncAuthUser, (state, { user }) => ({
    ...state,
    user
  })),
  on(
    AuthActions.loginFailure,
    AuthActions.signupFailure,
    AuthActions.logoutFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  ),
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null
  }))
);
