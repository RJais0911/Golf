import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';
import { loadProfile } from '../../../store/user/user.actions';
import { selectUserProfile } from '../../../store/user/user.selectors';
import { Subscription } from '../../../core/models/app.models';

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TitleCasePipe, ReactiveFormsModule, InrCurrencyPipe],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly toast = inject(ToastService);

  readonly profile$ = this.store.select(selectUserProfile);
  history: Subscription[] = [];
  loading = false;

  readonly form = this.fb.nonNullable.group({
    cardNumber: ['', [Validators.required]],
    cardHolder: ['', [Validators.required]],
    expiry: ['', [Validators.required]],
    cvv: ['', [Validators.required]]
  });

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

  activate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.subscriptionService.activate(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.toast.showSuccess('Subscription activated');
        this.store.dispatch(loadProfile());
        this.fetchHistory();
        this.form.reset({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
      },
      error: (error) => {
        this.loading = false;
        this.toast.showError(error.error?.message || 'Failed to activate subscription');
      }
    });
  }
}
