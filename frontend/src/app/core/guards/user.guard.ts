import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/auth/auth.selectors';

export const userGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([
    store.select(selectIsAuthenticated),
    store.select(selectCurrentUser)
  ]).pipe(
    take(1),
    map(([isAuthenticated, user]) => {
      if (!isAuthenticated) {
        void router.navigateByUrl('/auth/login');
        return false;
      }

      if (user?.role === 'admin') {
        void router.navigateByUrl('/admin');
        return false;
      }

      return true;
    })
  );
};
