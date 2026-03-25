import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CharitiesState } from './charities.reducer';

export const selectCharitiesState = createFeatureSelector<CharitiesState>('charities');
export const selectCharities = createSelector(selectCharitiesState, (state) => state.charities);
export const selectCharitiesLoading = createSelector(selectCharitiesState, (state) => state.loading);
