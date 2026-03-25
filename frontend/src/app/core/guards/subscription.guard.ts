import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectSubscriptionStatus } from '../../store/user/user.selectors';

export const subscriptionGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectSubscriptionStatus).pipe(
    take(1),
    map((status) => {
      if (status !== 'active') {
        void router.navigateByUrl('/subscription');
        return false;
      }
      return true;
    })
  );
};
