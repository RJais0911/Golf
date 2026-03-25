import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { CharityService } from '../../core/services/charity.service';
import { ToastService } from '../../core/services/toast.service';
import { loadProfile } from '../user/user.actions';
import * as CharitiesActions from './charities.actions';

@Injectable()
export class CharitiesEffects {
  private readonly actions$ = inject(Actions);
  private readonly charityService = inject(CharityService);
  private readonly toast = inject(ToastService);

  loadCharities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharitiesActions.loadCharities),
      mergeMap(() =>
        this.charityService.getCharities().pipe(
          map((response) => CharitiesActions.loadCharitiesSuccess({ charities: response.charities })),
          catchError((error) =>
            of(CharitiesActions.loadCharitiesFailure({ error: error.error?.message || 'Failed to load charities' }))
          )
        )
      )
    )
  );

  selectCharity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharitiesActions.selectCharity),
      mergeMap(({ charityId }) =>
        this.charityService.selectCharity(charityId).pipe(
          map(() => CharitiesActions.selectCharitySuccess()),
          catchError((error) =>
            of(CharitiesActions.selectCharityFailure({ error: error.error?.message || 'Failed to select charity' }))
          )
        )
      )
    )
  );

  createCharity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharitiesActions.createCharity),
      mergeMap(({ name, description }) =>
        this.charityService.createCharity(name, description).pipe(
          map((response) => CharitiesActions.createCharitySuccess({ charity: response.charity })),
          catchError((error) =>
            of(CharitiesActions.createCharityFailure({ error: error.error?.message || 'Failed to create charity' }))
          )
        )
      )
    )
  );

  updateCharity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharitiesActions.updateCharity),
      mergeMap(({ id, changes }) =>
        this.charityService.updateCharity(id, changes).pipe(
          map((response) => CharitiesActions.updateCharitySuccess({ charity: response.charity })),
          catchError((error) =>
            of(CharitiesActions.updateCharityFailure({ error: error.error?.message || 'Failed to update charity' }))
          )
        )
      )
    )
  );

  deleteCharity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CharitiesActions.deleteCharity),
      mergeMap(({ id }) =>
        this.charityService.deleteCharity(id).pipe(
          map(() => CharitiesActions.deleteCharitySuccess({ id })),
          catchError((error) =>
            of(CharitiesActions.deleteCharityFailure({ error: error.error?.message || 'Failed to delete charity' }))
          )
        )
      )
    )
  );

  reloadAfterWrite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CharitiesActions.selectCharitySuccess,
        CharitiesActions.createCharitySuccess,
        CharitiesActions.updateCharitySuccess,
        CharitiesActions.deleteCharitySuccess
      ),
      mergeMap(() => [CharitiesActions.loadCharities(), loadProfile()])
    )
  );

  successToasts$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CharitiesActions.selectCharitySuccess,
          CharitiesActions.createCharitySuccess,
          CharitiesActions.updateCharitySuccess,
          CharitiesActions.deleteCharitySuccess
        ),
        tap((action) => {
          const messageMap: Record<string, string> = {
            '[Charities] Select Charity Success': 'Charity selected',
            '[Charities] Create Charity Success': 'Charity created',
            '[Charities] Update Charity Success': 'Charity updated',
            '[Charities] Delete Charity Success': 'Charity deleted'
          };
          this.toast.showSuccess(messageMap[action.type]);
        })
      ),
    { dispatch: false }
  );

  failures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CharitiesActions.loadCharitiesFailure,
          CharitiesActions.selectCharityFailure,
          CharitiesActions.createCharityFailure,
          CharitiesActions.updateCharityFailure,
          CharitiesActions.deleteCharityFailure
        ),
        tap(({ error }) => this.toast.showError(error))
      ),
    { dispatch: false }
  );
}
