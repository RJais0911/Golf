import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Score } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly http = inject(HttpClient);

  getScores(): Observable<{ scores: Score[]; count: number }> {
    return this.http.get<{ scores: Score[]; count: number }>(`${environment.apiUrl}/scores`);
  }

  addScore(value: number): Observable<{ message: string; score: Score }> {
    return this.http.post<{ message: string; score: Score }>(`${environment.apiUrl}/scores`, { value });
  }

  deleteScore(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/scores/${id}`);
  }
}
