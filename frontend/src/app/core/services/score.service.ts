import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Score } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly http = inject(HttpClient);

  getScores(): Observable<{ scores: Score[]; count: number }> {
    return this.http
      .get<{ success: boolean; data: { scores: Score[]; count: number } }>(`${environment.apiUrl}/scores`)
      .pipe(map((response) => response.data));
  }

  addScore(value: number): Observable<{ message: string; score: Score }> {
    return this.http
      .post<{ success: boolean; message: string; data: { score: Score } }>(`${environment.apiUrl}/scores`, { value })
      .pipe(map((response) => ({ message: response.message, score: response.data.score })));
  }

  updateScore(id: string, value: number): Observable<{ message: string; score: Score }> {
    return this.http
      .patch<{ success: boolean; message: string; data: { score: Score } }>(`${environment.apiUrl}/scores/${id}`, { value })
      .pipe(map((response) => ({ message: response.message, score: response.data.score })));
  }

  deleteScore(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ success: boolean; message: string }>(`${environment.apiUrl}/scores/${id}`)
      .pipe(map((response) => ({ message: response.message })));
  }
}
