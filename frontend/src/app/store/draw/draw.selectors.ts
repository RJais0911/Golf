import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DrawState } from './draw.reducer';

export const selectDrawState = createFeatureSelector<DrawState>('draw');
export const selectLatestDraw = createSelector(selectDrawState, (state) => state.latestDraw);
export const selectDrawHistory = createSelector(selectDrawState, (state) => state.history);
export const selectDrawLoading = createSelector(selectDrawState, (state) => state.loading);
