import { createAction, props } from '@ngrx/store';
import { Winner } from '../../core/models/app.models';

export const loadWinners = createAction('[Winners] Load Winners', props<{ page: number; limit: number }>());
export const loadWinnersSuccess = createAction(
  '[Winners] Load Winners Success',
  props<{ winners: Winner[]; total: number }>()
);
export const loadWinnersFailure = createAction('[Winners] Load Winners Failure', props<{ error: string }>());

export const loadUserResults = createAction(
  '[Winners] Load User Results',
  props<{ page: number; limit: number }>()
);
export const loadUserResultsSuccess = createAction(
  '[Winners] Load User Results Success',
  props<{ results: Winner[]; total: number }>()
);
export const loadUserResultsFailure = createAction('[Winners] Load User Results Failure', props<{ error: string }>());

export const updateWinnerStatus = createAction(
  '[Winners] Update Winner Status',
  props<{ id: string; status: 'approved' | 'rejected' | 'paid' }>()
);
export const updateWinnerStatusSuccess = createAction(
  '[Winners] Update Winner Status Success',
  props<{ winner: Winner }>()
);
export const updateWinnerStatusFailure = createAction(
  '[Winners] Update Winner Status Failure',
  props<{ error: string }>()
);
