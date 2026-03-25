import { AuthState } from './auth/auth.reducer';
import { UserState } from './user/user.reducer';
import { ScoresState } from './scores/scores.reducer';
import { DrawState } from './draw/draw.reducer';
import { CharitiesState } from './charities/charities.reducer';
import { WinnersState } from './winners/winners.reducer';

export interface AppState {
  auth: AuthState;
  user: UserState;
  scores: ScoresState;
  draw: DrawState;
  charities: CharitiesState;
  winners: WinnersState;
}
