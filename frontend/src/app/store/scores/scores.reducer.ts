import { createReducer, on } from '@ngrx/store';
import * as ScoresActions from './scores.actions';
import { Score } from '../../core/models/app.models';

export interface ScoresState {
  scores: Score[];
  loading: boolean;
  error: string | null;
}

export const initialScoresState: ScoresState = {
  scores: [],
  loading: false,
  error: null
};

export const scoresReducer = createReducer(
  initialScoresState,
  on(ScoresActions.loadScores, ScoresActions.addScore, ScoresActions.deleteScore, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ScoresActions.loadScoresSuccess, (state, { scores }) => ({
    ...state,
    scores,
    loading: false
  })),
  on(ScoresActions.addScoreSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(ScoresActions.deleteScoreSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(
    ScoresActions.loadScoresFailure,
    ScoresActions.addScoreFailure,
    ScoresActions.deleteScoreFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
