import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subscription } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly http = inject(HttpClient);

  activate(plan: 'monthly' | 'yearly'): Observable<{ subscription: Subscription; subscriptionExpiresAt: string; paymentMethod: string }> {
    return this.http
      .post<{ success: boolean; data: { subscription: Subscription; subscriptionExpiresAt: string; paymentMethod: string } }>(
        `${environment.apiUrl}/subscription/activate`,
        { plan, paymentMethod: 'mock' }
      )
      .pipe(map((response) => response.data));
  }

  cancel(): Observable<{ subscription: Subscription }> {
    return this.http
      .post<{ success: boolean; data: { subscription: Subscription } }>(
        `${environment.apiUrl}/subscription/cancel`,
        {}
      )
      .pipe(map((response) => response.data));
  }

  getHistory(page = 1, limit = 20): Observable<{ subscriptions: Subscription[]; total: number; page: number; totalPages: number }> {
    return this.http
      .get<{ success: boolean; data: { subscriptions: Subscription[]; total: number; page: number; totalPages: number } }>(
        `${environment.apiUrl}/subscription/history?page=${page}&limit=${limit}`
      )
      .pipe(map((response) => response.data));
  }
}
