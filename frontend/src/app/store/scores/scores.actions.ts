import { createAction, props } from '@ngrx/store';
import { Score } from '../../core/models/app.models';

export const loadScores = createAction('[Scores] Load Scores');
export const loadScoresSuccess = createAction('[Scores] Load Scores Success', props<{ scores: Score[] }>());
export const loadScoresFailure = createAction('[Scores] Load Scores Failure', props<{ error: string }>());

export const addScore = createAction('[Scores] Add Score', props<{ value: number }>());
export const addScoreSuccess = createAction('[Scores] Add Score Success', props<{ score: Score }>());
export const addScoreFailure = createAction('[Scores] Add Score Failure', props<{ error: string }>());

export const deleteScore = createAction('[Scores] Delete Score', props<{ id: string }>());
export const deleteScoreSuccess = createAction('[Scores] Delete Score Success', props<{ id: string }>());
export const deleteScoreFailure = createAction('[Scores] Delete Score Failure', props<{ error: string }>());
