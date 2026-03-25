import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { loadLatestDraw } from '../../store/draw/draw.actions';
import { selectLatestDraw } from '../../store/draw/draw.selectors';
import { loadScores } from '../../store/scores/scores.actions';
import { selectScoreCount } from '../../store/scores/scores.selectors';
import { loadProfile } from '../../store/user/user.actions';
import { selectUserLoading, selectUserProfile } from '../../store/user/user.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TitleCasePipe, RouterLink, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly store = inject(Store);

  readonly profile$ = this.store.select(selectUserProfile);
  readonly latestDraw$ = this.store.select(selectLatestDraw);
  readonly scoreCount$ = this.store.select(selectScoreCount);
  readonly loading$ = this.store.select(selectUserLoading);

  constructor() {
    this.store.dispatch(loadProfile());
    this.store.dispatch(loadLatestDraw());
    this.store.dispatch(loadScores());
  }

  charityName(charity: unknown): string {
    if (!charity || typeof charity === 'string') {
      return 'No charity selected';
    }

    return (charity as { name?: string }).name || 'No charity selected';
  }
}
