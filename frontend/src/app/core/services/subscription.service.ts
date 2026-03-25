import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subscription } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly http = inject(HttpClient);

  activate(fakeCardData: Record<string, string>): Observable<{ message: string; subscription: Subscription; subscriptionExpiresAt: string }> {
    return this.http.post<{ message: string; subscription: Subscription; subscriptionExpiresAt: string }>(
      `${environment.apiUrl}/subscription/activate`,
      fakeCardData
    );
  }

  getHistory(page = 1, limit = 20): Observable<{ subscriptions: Subscription[]; total: number; page: number; totalPages: number }> {
    return this.http.get<{ subscriptions: Subscription[]; total: number; page: number; totalPages: number }>(
      `${environment.apiUrl}/subscription/history?page=${page}&limit=${limit}`
    );
  }
}
