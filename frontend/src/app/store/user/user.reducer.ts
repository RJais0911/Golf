import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { UserProfile } from '../../core/models/app.models';

export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  profile: null,
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadProfile, UserActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadProfileSuccess, UserActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    profile: user,
    loading: false,
    error: null
  })),
  on(UserActions.loadProfileFailure, UserActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
