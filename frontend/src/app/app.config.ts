import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
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
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production
    })
  ]
};
