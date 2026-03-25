import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../../core/models/app.models';

export const loadProfile = createAction('[User] Load Profile');
export const loadProfileSuccess = createAction('[User] Load Profile Success', props<{ user: UserProfile }>());
export const loadProfileFailure = createAction('[User] Load Profile Failure', props<{ error: string }>());

export const updateProfile = createAction(
  '[User] Update Profile',
  props<{ changes: Partial<UserProfile> }>()
);
export const updateProfileSuccess = createAction(
  '[User] Update Profile Success',
  props<{ user: UserProfile }>()
);
export const updateProfileFailure = createAction('[User] Update Profile Failure', props<{ error: string }>());
