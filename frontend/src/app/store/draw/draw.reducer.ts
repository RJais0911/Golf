import { createReducer, on } from '@ngrx/store';
import * as DrawActions from './draw.actions';
import { Draw } from '../../core/models/app.models';

export interface DrawState {
  latestDraw: Draw | null;
  history: Draw[];
  loading: boolean;
  error: string | null;
}

export const initialDrawState: DrawState = {
  latestDraw: null,
  history: [],
  loading: false,
  error: null
};

export const drawReducer = createReducer(
  initialDrawState,
  on(DrawActions.loadLatestDraw, DrawActions.runDraw, DrawActions.loadDrawHistory, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(DrawActions.loadLatestDrawSuccess, (state, { draw }) => ({
    ...state,
    latestDraw: draw,
    loading: false
  })),
  on(DrawActions.runDrawSuccess, (state, { draw }) => ({
    ...state,
    latestDraw: draw,
    loading: false
  })),
  on(DrawActions.loadDrawHistorySuccess, (state, { draws }) => ({
    ...state,
    history: draws,
    loading: false
  })),
  on(
    DrawActions.loadLatestDrawFailure,
    DrawActions.runDrawFailure,
    DrawActions.loadDrawHistoryFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
