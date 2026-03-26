import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { DrawService } from '../../core/services/draw.service';
import { ToastService } from '../../core/services/toast.service';
import * as DrawActions from './draw.actions';

@Injectable()
export class DrawEffects {
  private readonly actions$ = inject(Actions);
  private readonly drawService = inject(DrawService);
  private readonly toast = inject(ToastService);

  loadLatestDraw$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DrawActions.loadLatestDraw),
      mergeMap(() =>
        this.drawService.getLatestDraw().pipe(
          map((response) => DrawActions.loadLatestDrawSuccess({ draw: response.draw })),
          catchError((error) =>
            of(DrawActions.loadLatestDrawFailure({ error: error.error?.message || 'Failed to load draw' }))
          )
        )
      )
    )
  );

  runDraw$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DrawActions.runDraw),
      mergeMap(() =>
        this.drawService.runDraw().pipe(
          map((response) =>
            DrawActions.runDrawSuccess({
              draw: response.draw,
              winnersCount: response.winnersCount
            })
          ),
          catchError((error) =>
            of(DrawActions.runDrawFailure({ error: error.error?.message || 'Failed to run draw' }))
          )
        )
      )
    )
  );

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DrawActions.loadDrawHistory),
      mergeMap(({ page, limit }) =>
        this.drawService.getDrawHistory(page, limit).pipe(
          map((response) =>
            DrawActions.loadDrawHistorySuccess({
              draws: response.draws,
              total: response.total
            })
          ),
          catchError((error) =>
            of(DrawActions.loadDrawHistoryFailure({ error: error.error?.message || 'Failed to load draw history' }))
          )
        )
      )
    )
  );

  runDrawSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DrawActions.runDrawSuccess),
        mergeMap(({ winnersCount }) => {
          this.toast.showSuccess(`Draw completed with ${winnersCount} winner(s)`);

          return [
            DrawActions.loadLatestDraw(),
            DrawActions.loadDrawHistory({ page: 1, limit: 20 })
          ];
        })
      )
  );

  failures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          DrawActions.loadLatestDrawFailure,
          DrawActions.runDrawFailure,
          DrawActions.loadDrawHistoryFailure
        ),
        tap(({ error }) => this.toast.showError(error))
      ),
    { dispatch: false }
  );
}
