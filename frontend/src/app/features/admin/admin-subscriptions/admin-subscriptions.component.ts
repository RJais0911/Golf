import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Subscription } from '../../../core/models/app.models';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TitleCasePipe, InrCurrencyPipe],
  templateUrl: './admin-subscriptions.component.html',
  styleUrl: './admin-subscriptions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSubscriptionsComponent {
  private readonly adminService = inject(AdminService);

  subscriptions: Subscription[] = [];

  constructor() {
    this.adminService.getSubscriptions().subscribe({
      next: (response) => {
        this.subscriptions = response.subscriptions;
      }
    });
  }
}
