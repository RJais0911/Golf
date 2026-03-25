import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { subscriptionGuard } from './core/guards/subscription.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.default)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.default)
  },
  {
    path: 'scores',
    canActivate: [authGuard, subscriptionGuard],
    loadChildren: () => import('./features/scores/scores.routes').then((m) => m.default)
  },
  {
    path: 'charity',
    canActivate: [authGuard],
    loadChildren: () => import('./features/charity/charity.routes').then((m) => m.default)
  },
  {
    path: 'subscription',
    canActivate: [authGuard],
    loadChildren: () => import('./features/subscription/subscription.routes').then((m) => m.default)
  },
  {
    path: 'results',
    canActivate: [authGuard],
    loadChildren: () => import('./features/results/results.routes').then((m) => m.default)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.default)
  },
  { path: '**', redirectTo: '/dashboard' }
];
