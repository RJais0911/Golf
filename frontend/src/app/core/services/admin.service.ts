import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminDashboardStats,
  CharityContribution,
  UserProfile,
  Winner
} from '../models/app.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getUsers(page = 1, limit = 20): Observable<{ users: UserProfile[]; total: number; page: number; totalPages: number }> {
    return this.http.get<{ users: UserProfile[]; total: number; page: number; totalPages: number }>(
      `${environment.apiUrl}/admin/users?page=${page}&limit=${limit}`
    );
  }

  updateUser(id: string, changes: Partial<UserProfile>): Observable<{ user: UserProfile }> {
    return this.http.patch<{ user: UserProfile }>(`${environment.apiUrl}/admin/users/${id}`, changes);
  }

  getWinners(page = 1, limit = 20): Observable<{ winners: Winner[]; total: number; page: number; totalPages: number }> {
    return this.http.get<{ winners: Winner[]; total: number; page: number; totalPages: number }>(
      `${environment.apiUrl}/winners?page=${page}&limit=${limit}`
    );
  }

  updateWinnerStatus(id: string): Observable<{ winner: Winner }> {
    return this.http.patch<{ winner: Winner }>(`${environment.apiUrl}/admin/winners/${id}/status`, {
      status: 'paid'
    });
  }

  getContributions(page = 1, limit = 20): Observable<{ contributions: CharityContribution[]; total: number; page: number; totalPages: number }> {
    return this.http.get<{ contributions: CharityContribution[]; total: number; page: number; totalPages: number }>(
      `${environment.apiUrl}/admin/contributions?page=${page}&limit=${limit}`
    );
  }

  getDashboardStats(): Observable<{ stats: AdminDashboardStats }> {
    return this.http.get<{ stats: AdminDashboardStats }>(`${environment.apiUrl}/admin/dashboard`);
  }

  getDrawWinners(drawId: string): Observable<{ winners: Winner[] }> {
    return this.http.get<{ winners: Winner[] }>(`${environment.apiUrl}/winners/${drawId}`);
  }
}
