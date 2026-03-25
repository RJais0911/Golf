import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WinnersState } from './winners.reducer';

export const selectWinnersState = createFeatureSelector<WinnersState>('winners');
export const selectWinners = createSelector(selectWinnersState, (state) => state.winners);
export const selectUserResults = createSelector(selectWinnersState, (state) => state.userResults);
export const selectWinnersLoading = createSelector(selectWinnersState, (state) => state.loading);
export const selectWinnersTotal = createSelector(selectWinnersState, (state) => state.total);
