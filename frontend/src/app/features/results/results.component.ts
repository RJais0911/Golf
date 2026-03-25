import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { InrCurrencyPipe } from '../../shared/pipes/inr-currency.pipe';
import { loadLatestDraw } from '../../store/draw/draw.actions';
import { selectLatestDraw } from '../../store/draw/draw.selectors';
import { loadUserResults } from '../../store/winners/winners.actions';
import { selectUserResults } from '../../store/winners/winners.selectors';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TitleCasePipe, InrCurrencyPipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent {
  private readonly store = inject(Store);

  readonly latestDraw$ = this.store.select(selectLatestDraw);
  readonly results$ = this.store.select(selectUserResults);

  constructor() {
    this.store.dispatch(loadLatestDraw());
    this.store.dispatch(loadUserResults({ page: 1, limit: 20 }));
  }

  outcome(matchCount: number): string {
    if (matchCount === 5) {
      return 'Jackpot!';
    }
    if (matchCount === 4) {
      return 'Medium Win';
    }
    if (matchCount === 3) {
      return 'Small Win';
    }
    return 'No Win';
  }
}
