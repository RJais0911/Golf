import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminSubscriptionSummary } from '../../../core/models/app.models';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, InrCurrencyPipe],
  templateUrl: './admin-subscriptions.component.html',
  styleUrl: './admin-subscriptions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSubscriptionsComponent {
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  subscriptions: AdminSubscriptionSummary[] = [];

  constructor() {
    this.adminService.getSubscriptions().subscribe({
      next: (response) => {
        this.subscriptions = response.subscriptions;
        this.cdr.markForCheck();
      }
    });
  }
}
