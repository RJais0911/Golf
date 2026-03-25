import { createReducer, on } from '@ngrx/store';
import * as WinnersActions from './winners.actions';
import { Winner } from '../../core/models/app.models';

export interface WinnersState {
  winners: Winner[];
  userResults: Winner[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const initialWinnersState: WinnersState = {
  winners: [],
  userResults: [],
  loading: false,
  error: null,
  total: 0
};

export const winnersReducer = createReducer(
  initialWinnersState,
  on(WinnersActions.loadWinners, WinnersActions.loadUserResults, WinnersActions.updateWinnerStatus, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(WinnersActions.loadWinnersSuccess, (state, { winners, total }) => ({
    ...state,
    winners,
    total,
    loading: false
  })),
  on(WinnersActions.loadUserResultsSuccess, (state, { results, total }) => ({
    ...state,
    userResults: results,
    total,
    loading: false
  })),
  on(WinnersActions.updateWinnerStatusSuccess, (state, { winner }) => ({
    ...state,
    winners: state.winners.map((item) => (item._id === winner._id ? winner : item)),
    loading: false
  })),
  on(
    WinnersActions.loadWinnersFailure,
    WinnersActions.loadUserResultsFailure,
    WinnersActions.updateWinnerStatusFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
