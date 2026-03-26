import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { subscriptionGuard } from './core/guards/subscription.guard';
import { userGuard } from './core/guards/user.guard';
import { LandingComponent } from './features/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [guestGuard] },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.default)
  },
  {
    path: 'dashboard',
    canActivate: [userGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.default)
  },
  {
    path: 'scores',
    canActivate: [userGuard, subscriptionGuard],
    loadChildren: () => import('./features/scores/scores.routes').then((m) => m.default)
  },
  {
    path: 'charity',
    canActivate: [userGuard],
    loadChildren: () => import('./features/charity/charity.routes').then((m) => m.default)
  },
  {
    path: 'subscription',
    canActivate: [userGuard],
    loadChildren: () => import('./features/subscription/subscription.routes').then((m) => m.default)
  },
  {
    path: 'results',
    canActivate: [userGuard],
    loadChildren: () => import('./features/results/results.routes').then((m) => m.default)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.default)
  },
  { path: '**', redirectTo: '/dashboard' }
];
