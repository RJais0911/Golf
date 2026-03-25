import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  readonly toast$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.toastSubject.next({ type: 'success', message });
  }

  showError(message: string): void {
    this.toastSubject.next({ type: 'error', message });
  }

  showInfo(message: string): void {
    this.toastSubject.next({ type: 'info', message });
  }

  clear(): void {
    this.toastSubject.next(null);
  }
}
