import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { firstValueFrom } from 'rxjs';
import { authReducer } from './store/auth/auth.reducer';
import { userReducer } from './store/user/user.reducer';
import { scoresReducer } from './store/scores/scores.reducer';
import { drawReducer } from './store/draw/draw.reducer';
import { charitiesReducer } from './store/charities/charities.reducer';
import { winnersReducer } from './store/winners/winners.reducer';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthEffects } from './store/auth/auth.effects';
import { UserEffects } from './store/user/user.effects';
import { ScoresEffects } from './store/scores/scores.effects';
import { DrawEffects } from './store/draw/draw.effects';
import { CharitiesEffects } from './store/charities/charities.effects';
import { WinnersEffects } from './store/winners/winners.effects';
import { environment } from '../environments/environment';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';
import { Store } from '@ngrx/store';
import { refreshTokenFailure, refreshTokenSuccess, syncAuthUser } from './store/auth/auth.actions';
import { loadProfileSuccess } from './store/user/user.actions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideStore({
      auth: authReducer,
      user: userReducer,
      scores: scoresReducer,
      draw: drawReducer,
      charities: charitiesReducer,
      winners: winnersReducer
    }),
    provideEffects(
      AuthEffects,
      UserEffects,
      ScoresEffects,
      DrawEffects,
      CharitiesEffects,
      WinnersEffects
    ),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      const userService = inject(UserService);
      const store = inject(Store);

      try {
        const refreshResponse = await firstValueFrom(authService.refreshToken());
        store.dispatch(refreshTokenSuccess({ accessToken: refreshResponse.accessToken }));

        const profileResponse = await firstValueFrom(userService.getProfile());
        store.dispatch(loadProfileSuccess({ user: profileResponse.user }));
        store.dispatch(syncAuthUser({ user: profileResponse.user }));
      } catch {
        authService.clearAccessToken();
        store.dispatch(refreshTokenFailure());
      }
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production
    })
  ]
};
