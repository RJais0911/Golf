import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../../store/auth/auth.actions';
import { selectCurrentUser, selectIsAdmin, selectIsAuthenticated } from '../../../store/auth/auth.selectors';
import { selectSubscriptionStatus } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly store = inject(Store);

  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);
  readonly isAdmin$ = this.store.select(selectIsAdmin);
  readonly user$ = this.store.select(selectCurrentUser);
  readonly subscriptionStatus$ = this.store.select(selectSubscriptionStatus);

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
