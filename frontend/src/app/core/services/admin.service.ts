import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  AdminDashboardStats,
  CharityContribution,
  Subscription,
  UserProfile,
  Winner
} from '../models/app.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getUsers(page = 1, limit = 20): Observable<{ users: UserProfile[]; total: number; page: number; totalPages: number }> {
    return this.http
      .get<{ success: boolean; data: { users: UserProfile[]; total: number; page: number; totalPages: number } }>(
        `${environment.apiUrl}/admin/users?page=${page}&limit=${limit}`
      )
      .pipe(map((response) => response.data));
  }

  updateUser(id: string, changes: Partial<UserProfile>): Observable<{ user: UserProfile }> {
    return this.http
      .patch<{ success: boolean; data: { user: UserProfile } }>(`${environment.apiUrl}/admin/users/${id}`, changes)
      .pipe(map((response) => response.data));
  }

  getSubscriptions(page = 1, limit = 20): Observable<{ subscriptions: Subscription[]; total: number; page: number; totalPages: number }> {
    return this.http
      .get<{ success: boolean; data: { subscriptions: Subscription[]; total: number; page: number; totalPages: number } }>(
        `${environment.apiUrl}/admin/subscriptions?page=${page}&limit=${limit}`
      )
      .pipe(map((response) => response.data));
  }

  getWinners(page = 1, limit = 20): Observable<{ winners: Winner[]; total: number; page: number; totalPages: number }> {
    return this.http
      .get<{ success: boolean; data: { winners: Winner[]; total: number; page: number; totalPages: number } }>(
        `${environment.apiUrl}/winners?page=${page}&limit=${limit}`
      )
      .pipe(map((response) => response.data));
  }

  updateWinnerStatus(id: string, status: 'approved' | 'rejected' | 'paid'): Observable<{ winner: Winner }> {
    return this.http
      .patch<{ success: boolean; data: { winner: Winner } }>(`${environment.apiUrl}/admin/winners/${id}/status`, {
        status
      })
      .pipe(map((response) => response.data));
  }

  getContributions(page = 1, limit = 20): Observable<{ contributions: CharityContribution[]; total: number; page: number; totalPages: number }> {
    return this.http
      .get<{ success: boolean; data: { contributions: CharityContribution[]; total: number; page: number; totalPages: number } }>(
        `${environment.apiUrl}/admin/contributions?page=${page}&limit=${limit}`
      )
      .pipe(map((response) => response.data));
  }

  getDashboardStats(): Observable<{ stats: AdminDashboardStats }> {
    return this.http
      .get<{ success: boolean; data: { stats: AdminDashboardStats } }>(`${environment.apiUrl}/admin/dashboard`)
      .pipe(map((response) => response.data));
  }

  getDrawWinners(drawId: string): Observable<{ winners: Winner[] }> {
    return this.http
      .get<{ success: boolean; data: { winners: Winner[] } }>(`${environment.apiUrl}/winners/${drawId}`)
      .pipe(map((response) => response.data));
  }
}
