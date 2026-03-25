import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectAccessToken = createSelector(selectAuthState, (state) => state.accessToken);
export const selectCurrentUser = createSelector(selectAuthState, (state) => state.user);
export const selectIsAuthenticated = createSelector(selectAccessToken, (token) => Boolean(token));
export const selectIsAdmin = createSelector(
  selectCurrentUser,
  (user) => user?.role === 'admin'
);
export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
