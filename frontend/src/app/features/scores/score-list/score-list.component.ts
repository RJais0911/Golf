import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScoreService } from '../../../core/services/score.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { addScore, deleteScore, loadScores } from '../../../store/scores/scores.actions';
import { selectScoreCount, selectScores, selectScoresLoading } from '../../../store/scores/scores.selectors';
import { ScoreAddComponent } from '../score-add/score-add.component';

@Component({
  selector: 'app-score-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, LoaderComponent, ScoreAddComponent],
  templateUrl: './score-list.component.html',
  styleUrl: './score-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreListComponent {
  private readonly store = inject(Store);
  private readonly scoreService = inject(ScoreService);
  private readonly toast = inject(ToastService);

  readonly scores$ = this.store.select(selectScores);
  readonly scoreCount$ = this.store.select(selectScoreCount);
  readonly loading$ = this.store.select(selectScoresLoading);

  constructor() {
    this.store.dispatch(loadScores());
  }

  onAddScore(value: number): void {
    this.store.dispatch(addScore({ value }));
  }

  onDeleteScore(id: string): void {
    if (window.confirm('Delete this score?')) {
      this.store.dispatch(deleteScore({ id }));
    }
  }

  onEditScore(id: string, currentValue: number): void {
    const nextValue = window.prompt('Enter the updated score value (1-45)', String(currentValue));
    if (!nextValue) {
      return;
    }

    const parsedValue = Number(nextValue);
    if (!Number.isInteger(parsedValue) || parsedValue < 1 || parsedValue > 45) {
      this.toast.showError('Score must be a whole number from 1 to 45');
      return;
    }

    this.scoreService.updateScore(id, parsedValue).subscribe({
      next: () => {
        this.toast.showSuccess('Score updated');
        this.store.dispatch(loadScores());
      },
      error: (error) => {
        this.toast.showError(error.error?.message || 'Failed to update score');
      }
    });
  }
}
