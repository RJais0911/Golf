import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdminService } from '../../../core/services/admin.service';
import { loadDrawHistory, loadLatestDraw, runDraw } from '../../../store/draw/draw.actions';
import { selectDrawHistory, selectLatestDraw } from '../../../store/draw/draw.selectors';

@Component({
  selector: 'app-admin-draw',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './admin-draw.component.html',
  styleUrl: './admin-draw.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDrawComponent {
  private readonly store = inject(Store);
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly latestDraw$ = this.store.select(selectLatestDraw);
  readonly history$ = this.store.select(selectDrawHistory);
  latestWinnersCount = 0;

  constructor() {
    this.store.dispatch(loadLatestDraw());
    this.store.dispatch(loadDrawHistory({ page: 1, limit: 20 }));
    this.latestDraw$.subscribe((draw) => {
      const drawId = draw?._id || draw?.id;
      if (drawId) {
        this.adminService.getDrawWinners(drawId).subscribe({
          next: (response) => {
            this.latestWinnersCount = response.winners.length;
            this.cdr.markForCheck();
          }
        });
      }
    });
  }

  run(): void {
    if (window.confirm('Run a new draw now?')) {
      this.store.dispatch(runDraw());
    }
  }
}
