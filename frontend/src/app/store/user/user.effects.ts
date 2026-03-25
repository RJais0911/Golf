import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as UserActions from './user.actions';
import { syncAuthUser } from '../auth/auth.actions';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadProfile),
      mergeMap(() =>
        this.userService.getProfile().pipe(
          map((response) => UserActions.loadProfileSuccess({ user: response.user })),
          catchError((error) =>
            of(UserActions.loadProfileFailure({ error: error.error?.message || 'Failed to load profile' }))
          )
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfile),
      mergeMap(({ changes }) =>
        this.userService.updateProfile(changes).pipe(
          map((response) => UserActions.updateProfileSuccess({ user: response.user })),
          catchError((error) =>
            of(UserActions.updateProfileFailure({ error: error.error?.message || 'Failed to update profile' }))
          )
        )
      )
    )
  );

  syncAuthUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadProfileSuccess, UserActions.updateProfileSuccess),
      map(({ user }) => syncAuthUser({ user }))
    )
  );

  failures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.loadProfileFailure, UserActions.updateProfileFailure),
        tap(({ error }) => this.toast.showError(error))
      ),
    { dispatch: false }
  );

  updateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.updateProfileSuccess),
        tap(() => this.toast.showSuccess('Profile updated'))
      ),
    { dispatch: false }
  );
}
