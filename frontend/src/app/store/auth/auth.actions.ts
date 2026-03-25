import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../../core/models/app.models';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: string; user: UserProfile }>()
);
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const signup = createAction(
  '[Auth] Signup',
  props<{ name: string; email: string; password: string }>()
);
export const signupSuccess = createAction('[Auth] Signup Success');
export const signupFailure = createAction('[Auth] Signup Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());

export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ accessToken: string }>()
);
export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure');

export const clearAuthError = createAction('[Auth] Clear Error');
export const syncAuthUser = createAction('[Auth] Sync User', props<{ user: UserProfile }>());
