import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { CharityContribution } from '../../../core/models/app.models';
import { InrCurrencyPipe } from '../../../shared/pipes/inr-currency.pipe';

@Component({
  selector: 'app-admin-contributions',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, InrCurrencyPipe],
  templateUrl: './admin-contributions.component.html',
  styleUrl: './admin-contributions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminContributionsComponent {
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  contributions: CharityContribution[] = [];

  constructor() {
    this.adminService.getContributions().subscribe({
      next: (response) => {
        this.contributions = response.contributions;
        this.cdr.markForCheck();
      }
    });
  }
}
