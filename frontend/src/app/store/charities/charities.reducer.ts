import { createReducer, on } from '@ngrx/store';
import * as CharitiesActions from './charities.actions';
import { Charity } from '../../core/models/app.models';

export interface CharitiesState {
  charities: Charity[];
  loading: boolean;
  error: string | null;
}

export const initialCharitiesState: CharitiesState = {
  charities: [],
  loading: false,
  error: null
};

export const charitiesReducer = createReducer(
  initialCharitiesState,
  on(
    CharitiesActions.loadCharities,
    CharitiesActions.selectCharity,
    CharitiesActions.createCharity,
    CharitiesActions.updateCharity,
    CharitiesActions.deleteCharity,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),
  on(CharitiesActions.loadCharitiesSuccess, (state, { charities }) => ({
    ...state,
    charities,
    loading: false
  })),
  on(
    CharitiesActions.selectCharitySuccess,
    CharitiesActions.createCharitySuccess,
    CharitiesActions.updateCharitySuccess,
    CharitiesActions.deleteCharitySuccess,
    (state) => ({
      ...state,
      loading: false
    })
  ),
  on(
    CharitiesActions.loadCharitiesFailure,
    CharitiesActions.selectCharityFailure,
    CharitiesActions.createCharityFailure,
    CharitiesActions.updateCharityFailure,
    CharitiesActions.deleteCharityFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
