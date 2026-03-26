import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Draw } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class DrawService {
  private readonly http = inject(HttpClient);

  runDraw(): Observable<{ message: string; draw: Draw; winnersCount: number }> {
    return this.http
      .post<{ success: boolean; message: string; data: { draw: Draw; winnersCount: number } }>(
        `${environment.apiUrl}/draw/run`,
        {}
      )
      .pipe(map((response) => ({ message: response.message, ...response.data })));
  }

  getLatestDraw(): Observable<{ draw: Draw }> {
    return this.http
      .get<{ success: boolean; data: { draw: Draw } }>(`${environment.apiUrl}/draw/latest`)
      .pipe(map((response) => response.data));
  }

  getDrawHistory(page = 1, limit = 20): Observable<{ draws: Draw[]; total: number; page: number; totalPages: number }> {
    return this.http
      .get<{ success: boolean; data: { draws: Draw[]; total: number; page: number; totalPages: number } }>(
        `${environment.apiUrl}/draw/history?page=${page}&limit=${limit}`
      )
      .pipe(map((response) => response.data));
  }
}
