import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { UserProfile } from '../../../core/models/app.models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent {
  private readonly adminService = inject(AdminService);

  users: UserProfile[] = [];

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (response) => {
        this.users = response.users;
      }
    });
  }

  toggleUser(user: UserProfile): void {
    this.adminService.updateUser(user._id || user.id || '', { isActive: !user.isActive }).subscribe({
      next: () => this.loadUsers()
    });
  }

  charityName(charity: unknown): string {
    if (!charity || typeof charity === 'string') {
      return '-';
    }

    return (charity as { name?: string }).name || '-';
  }
}
