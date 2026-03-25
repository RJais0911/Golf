import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const excludedEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh'];
  const shouldSkip = excludedEndpoints.some((endpoint) => req.url.includes(endpoint));

  if (shouldSkip) {
    return next(req);
  }

  const accessToken = authService.getAccessToken();
  if (!accessToken) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );
};
