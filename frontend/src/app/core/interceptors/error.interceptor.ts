import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import { logout } from '../../store/auth/auth.actions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefreshCall = req.url.includes('/auth/refresh');
      const isLogoutCall = req.url.includes('/auth/logout');
      if (error.status === 401 && !isRefreshCall && !isLogoutCall) {
        return authService.refreshToken().pipe(
          switchMap(({ accessToken }) =>
            next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${accessToken}`
                }
              })
            )
          ),
          catchError((refreshError) => {
            authService.clearAccessToken();
            store.dispatch(logout());
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
