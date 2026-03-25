import { createAction, props } from '@ngrx/store';
import { Charity } from '../../core/models/app.models';

export const loadCharities = createAction('[Charities] Load Charities');
export const loadCharitiesSuccess = createAction(
  '[Charities] Load Charities Success',
  props<{ charities: Charity[] }>()
);
export const loadCharitiesFailure = createAction('[Charities] Load Charities Failure', props<{ error: string }>());

export const selectCharity = createAction('[Charities] Select Charity', props<{ charityId: string }>());
export const selectCharitySuccess = createAction('[Charities] Select Charity Success');
export const selectCharityFailure = createAction('[Charities] Select Charity Failure', props<{ error: string }>());

export const createCharity = createAction(
  '[Charities] Create Charity',
  props<{ name: string; description: string }>()
);
export const createCharitySuccess = createAction(
  '[Charities] Create Charity Success',
  props<{ charity: Charity }>()
);
export const createCharityFailure = createAction('[Charities] Create Charity Failure', props<{ error: string }>());

export const updateCharity = createAction(
  '[Charities] Update Charity',
  props<{ id: string; changes: Partial<Charity> }>()
);
export const updateCharitySuccess = createAction(
  '[Charities] Update Charity Success',
  props<{ charity: Charity }>()
);
export const updateCharityFailure = createAction('[Charities] Update Charity Failure', props<{ error: string }>());

export const deleteCharity = createAction('[Charities] Delete Charity', props<{ id: string }>());
export const deleteCharitySuccess = createAction('[Charities] Delete Charity Success', props<{ id: string }>());
export const deleteCharityFailure = createAction('[Charities] Delete Charity Failure', props<{ error: string }>());
