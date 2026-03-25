import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ScoresState } from './scores.reducer';

export const selectScoresState = createFeatureSelector<ScoresState>('scores');
export const selectScores = createSelector(selectScoresState, (state) => state.scores);
export const selectScoreCount = createSelector(selectScores, (scores) => scores.length);
export const selectScoresLoading = createSelector(selectScoresState, (state) => state.loading);
