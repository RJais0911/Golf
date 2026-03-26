import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);
  readonly accessToken$ = this.tokenSubject.asObservable();

  login(email: string, password: string): Observable<{ accessToken: string; user: UserProfile }> {
    return this.http
      .post<{ success: boolean; data: { accessToken: string; user: UserProfile } }>(
        `${environment.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        map((response) => response.data),
        tap((response) => this.setAccessToken(response.accessToken))
      );
  }

  signup(name: string, email: string, password: string): Observable<{ message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(`${environment.apiUrl}/auth/signup`, {
        name,
        email,
        password
      })
      .pipe(map((response) => ({ message: response.message })));
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        map((response) => ({ message: response.message })),
        tap(() => this.clearAccessToken())
      );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ success: boolean; data: { accessToken: string } }>(
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        map((response) => response.data),
        tap((response) => this.setAccessToken(response.accessToken))
      );
  }

  setAccessToken(token: string | null): void {
    this.tokenSubject.next(token);
  }

  clearAccessToken(): void {
    this.tokenSubject.next(null);
  }

  getAccessToken(): string | null {
    return this.tokenSubject.value;
  }
}
