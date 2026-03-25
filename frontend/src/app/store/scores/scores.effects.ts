import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ScoreService } from '../../core/services/score.service';
import { ToastService } from '../../core/services/toast.service';
import * as ScoresActions from './scores.actions';

@Injectable()
export class ScoresEffects {
  private readonly actions$ = inject(Actions);
  private readonly scoreService = inject(ScoreService);
  private readonly toast = inject(ToastService);

  loadScores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScoresActions.loadScores),
      mergeMap(() =>
        this.scoreService.getScores().pipe(
          map((response) => ScoresActions.loadScoresSuccess({ scores: response.scores })),
          catchError((error) =>
            of(ScoresActions.loadScoresFailure({ error: error.error?.message || 'Failed to load scores' }))
          )
        )
      )
    )
  );

  addScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScoresActions.addScore),
      mergeMap(({ value }) =>
        this.scoreService.addScore(value).pipe(
          map((response) => ScoresActions.addScoreSuccess({ score: response.score })),
          catchError((error) =>
            of(ScoresActions.addScoreFailure({ error: error.error?.message || 'Failed to add score' }))
          )
        )
      )
    )
  );

  addScoreSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScoresActions.addScoreSuccess, ScoresActions.deleteScoreSuccess),
      map(() => ScoresActions.loadScores())
    )
  );

  addScoreToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ScoresActions.addScoreSuccess),
        tap(() => this.toast.showSuccess('Score saved'))
      ),
    { dispatch: false }
  );

  deleteScore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScoresActions.deleteScore),
      mergeMap(({ id }) =>
        this.scoreService.deleteScore(id).pipe(
          map(() => ScoresActions.deleteScoreSuccess({ id })),
          catchError((error) =>
            of(ScoresActions.deleteScoreFailure({ error: error.error?.message || 'Failed to delete score' }))
          )
        )
      )
    )
  );

  failures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ScoresActions.loadScoresFailure,
          ScoresActions.addScoreFailure,
          ScoresActions.deleteScoreFailure
        ),
        tap(({ error }) => this.toast.showError(error))
      ),
    { dispatch: false }
  );
}
