import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile, Winner } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<{ user: UserProfile }> {
    return this.http
      .get<{ success: boolean; data: { user: UserProfile } }>(`${environment.apiUrl}/user/profile`)
      .pipe(map((response) => response.data));
  }

  updateProfile(changes: Partial<UserProfile>): Observable<{ user: UserProfile }> {
    return this.http
      .patch<{ success: boolean; data: { user: UserProfile } }>(`${environment.apiUrl}/user/profile`, changes)
      .pipe(map((response) => response.data));
  }

  getUserResults(page = 1, limit = 20): Observable<{ results: Winner[]; total: number; page: number; totalPages: number }> {
    return this.http
      .get<{ success: boolean; data: { results: Winner[]; total: number; page: number; totalPages: number } }>(
        `${environment.apiUrl}/user/results?page=${page}&limit=${limit}`
      )
      .pipe(map((response) => response.data));
  }
}
