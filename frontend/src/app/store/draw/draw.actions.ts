import { createAction, props } from '@ngrx/store';
import { Draw } from '../../core/models/app.models';

export const loadLatestDraw = createAction('[Draw] Load Latest Draw');
export const loadLatestDrawSuccess = createAction('[Draw] Load Latest Draw Success', props<{ draw: Draw }>());
export const loadLatestDrawFailure = createAction('[Draw] Load Latest Draw Failure', props<{ error: string }>());

export const runDraw = createAction('[Draw] Run Draw');
export const runDrawSuccess = createAction(
  '[Draw] Run Draw Success',
  props<{ draw: Draw; winnersCount: number }>()
);
export const runDrawFailure = createAction('[Draw] Run Draw Failure', props<{ error: string }>());

export const loadDrawHistory = createAction('[Draw] Load Draw History', props<{ page: number; limit: number }>());
export const loadDrawHistorySuccess = createAction(
  '[Draw] Load Draw History Success',
  props<{ draws: Draw[]; total: number }>()
);
export const loadDrawHistoryFailure = createAction('[Draw] Load Draw History Failure', props<{ error: string }>());
