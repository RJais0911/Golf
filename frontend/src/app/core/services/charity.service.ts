import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Charity } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class CharityService {
  private readonly http = inject(HttpClient);

  getCharities(): Observable<{ charities: Charity[] }> {
    return this.http.get<{ charities: Charity[] }>(`${environment.apiUrl}/charities`);
  }

  selectCharity(charityId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/charity/select`, { charityId });
  }

  createCharity(name: string, description: string): Observable<{ charity: Charity }> {
    return this.http.post<{ charity: Charity }>(`${environment.apiUrl}/admin/charities`, {
      name,
      description
    });
  }

  updateCharity(id: string, changes: Partial<Charity>): Observable<{ charity: Charity }> {
    return this.http.patch<{ charity: Charity }>(`${environment.apiUrl}/admin/charities/${id}`, changes);
  }

  deleteCharity(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/admin/charities/${id}`);
  }
}
