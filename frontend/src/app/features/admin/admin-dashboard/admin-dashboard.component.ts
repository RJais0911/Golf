import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { AdminDashboardStats } from '../../../core/models/app.models';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, InrCurrencyPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  stats: AdminDashboardStats | null = null;

  constructor() {
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        this.stats = response.stats;
        this.cdr.markForCheck();
      }
    });
  }
}
