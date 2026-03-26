import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { loadWinners, updateWinnerStatus } from '../../../store/winners/winners.actions';
import { selectWinners } from '../../../store/winners/winners.selectors';

@Component({
  selector: 'app-admin-winners',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TitleCasePipe, InrCurrencyPipe],
  templateUrl: './admin-winners.component.html',
  styleUrl: './admin-winners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminWinnersComponent {
  private readonly store = inject(Store);

  readonly winners$ = this.store.select(selectWinners);

  constructor() {
    this.store.dispatch(loadWinners({ page: 1, limit: 20 }));
  }

  updateStatus(id: string, status: 'approved' | 'rejected' | 'paid'): void {
    if (window.confirm(`Mark this winner as ${status}?`)) {
      this.store.dispatch(updateWinnerStatus({ id, status }));
    }
  }
}
