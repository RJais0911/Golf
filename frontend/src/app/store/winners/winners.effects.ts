import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { AdminService } from '../../core/services/admin.service';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import * as WinnersActions from './winners.actions';

@Injectable()
export class WinnersEffects {
  private readonly actions$ = inject(Actions);
  private readonly adminService = inject(AdminService);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);

  loadWinners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WinnersActions.loadWinners),
      mergeMap(({ page, limit }) =>
        this.adminService.getWinners(page, limit).pipe(
          map((response) =>
            WinnersActions.loadWinnersSuccess({
              winners: response.winners,
              total: response.total
            })
          ),
          catchError((error) =>
            of(WinnersActions.loadWinnersFailure({ error: error.error?.message || 'Failed to load winners' }))
          )
        )
      )
    )
  );

  loadUserResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WinnersActions.loadUserResults),
      mergeMap(({ page, limit }) =>
        this.userService.getUserResults(page, limit).pipe(
          map((response) =>
            WinnersActions.loadUserResultsSuccess({
              results: response.results,
              total: response.total
            })
          ),
          catchError((error) =>
            of(WinnersActions.loadUserResultsFailure({ error: error.error?.message || 'Failed to load results' }))
          )
        )
      )
    )
  );

  updateWinnerStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WinnersActions.updateWinnerStatus),
      mergeMap(({ id, status }) =>
        this.adminService.updateWinnerStatus(id, status).pipe(
          map((response) => WinnersActions.updateWinnerStatusSuccess({ winner: response.winner })),
          catchError((error) =>
            of(WinnersActions.updateWinnerStatusFailure({ error: error.error?.message || 'Failed to update winner' }))
          )
        )
      )
    )
  );

  updateWinnerStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WinnersActions.updateWinnerStatusSuccess),
        tap(() => this.toast.showSuccess('Winner marked as paid'))
      ),
    { dispatch: false }
  );

  failures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WinnersActions.loadWinnersFailure,
          WinnersActions.loadUserResultsFailure,
          WinnersActions.updateWinnerStatusFailure
        ),
        tap(({ error }) => this.toast.showError(error))
      ),
    { dispatch: false }
  );
}
