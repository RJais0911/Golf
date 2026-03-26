import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminWinnersComponent } from './admin-winners/admin-winners.component';
import { AdminCharitiesComponent } from './admin-charities/admin-charities.component';
import { AdminDrawComponent } from './admin-draw/admin-draw.component';
import { AdminContributionsComponent } from './admin-contributions/admin-contributions.component';
import { AdminSubscriptionsComponent } from './admin-subscriptions/admin-subscriptions.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: AdminUsersComponent },
  { path: 'subscriptions', component: AdminSubscriptionsComponent },
  { path: 'winners', component: AdminWinnersComponent },
  { path: 'charities', component: AdminCharitiesComponent },
  { path: 'draw', component: AdminDrawComponent },
  { path: 'contributions', component: AdminContributionsComponent }
];

export default routes;
