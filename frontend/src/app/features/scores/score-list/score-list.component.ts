import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
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
}
