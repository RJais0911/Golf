import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Charity } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class CharityService {
  private readonly http = inject(HttpClient);

  getCharities(): Observable<{ charities: Charity[] }> {
    return this.http
      .get<{ success: boolean; data: { charities: Charity[] } }>(`${environment.apiUrl}/charities`)
      .pipe(map((response) => response.data));
  }

  selectCharity(charityId: string): Observable<{ message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(`${environment.apiUrl}/charity/select`, { charityId })
      .pipe(map((response) => ({ message: response.message })));
  }

  createCharity(name: string, description: string): Observable<{ charity: Charity }> {
    return this.http
      .post<{ success: boolean; data: { charity: Charity } }>(`${environment.apiUrl}/admin/charities`, {
        name,
        description
      })
      .pipe(map((response) => response.data));
  }

  updateCharity(id: string, changes: Partial<Charity>): Observable<{ charity: Charity }> {
    return this.http
      .patch<{ success: boolean; data: { charity: Charity } }>(`${environment.apiUrl}/admin/charities/${id}`, changes)
      .pipe(map((response) => response.data));
  }

  deleteCharity(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ success: boolean; message: string }>(`${environment.apiUrl}/admin/charities/${id}`)
      .pipe(map((response) => ({ message: response.message })));
  }
}
