import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription } from '../../../core/models/app.models';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { loadProfile } from '../../../store/user/user.actions';
import { selectUserProfile } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TitleCasePipe, InrCurrencyPipe],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeComponent {
  private readonly store = inject(Store);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly toast = inject(ToastService);

  readonly profile$ = this.store.select(selectUserProfile);
  history: Subscription[] = [];
  loading = false;

  readonly planCards = [
    { plan: 'monthly' as const, title: 'Monthly', amount: 1000, note: 'Assessment demo payment' },
    { plan: 'yearly' as const, title: 'Yearly', amount: 10800, note: 'Assessment demo payment with yearly discount' }
  ];

  constructor() {
    this.store.dispatch(loadProfile());
    this.fetchHistory();
  }

  fetchHistory(): void {
    this.subscriptionService.getHistory().subscribe({
      next: (response) => {
        this.history = response.subscriptions;
      }
    });
  }

  activate(plan: 'monthly' | 'yearly'): void {
    this.loading = true;
    this.subscriptionService.activate(plan).subscribe({
      next: () => {
        this.loading = false;
        this.toast.showSuccess('Test subscription activated');
        this.store.dispatch(loadProfile());
        this.fetchHistory();
      },
      error: (error) => {
        this.loading = false;
        this.toast.showError(error.error?.message || 'Failed to activate test subscription');
      }
    });
  }

  cancelSubscription(): void {
    if (!window.confirm('Cancel the current subscription?')) {
      return;
    }

    this.loading = true;
    this.subscriptionService.cancel().subscribe({
      next: () => {
        this.loading = false;
        this.toast.showSuccess('Subscription cancelled');
        this.store.dispatch(loadProfile());
        this.fetchHistory();
      },
      error: (error) => {
        this.loading = false;
        this.toast.showError(error.error?.message || 'Failed to cancel subscription');
      }
    });
  }
}
