import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');
export const selectUserProfile = createSelector(selectUserState, (state) => state.profile);
export const selectSubscriptionStatus = createSelector(
  selectUserProfile,
  (profile) => profile?.subscriptionStatus ?? 'inactive'
);
export const selectContributionPercentage = createSelector(
  selectUserProfile,
  (profile) => profile?.contributionPercentage ?? 10
);
export const selectUserLoading = createSelector(selectUserState, (state) => state.loading);
