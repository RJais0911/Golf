import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Charity } from '../../../core/models/app.models';
import {
  createCharity,
  deleteCharity,
  loadCharities,
  updateCharity
} from '../../../store/charities/charities.actions';
import { selectCharities } from '../../../store/charities/charities.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-charities',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './admin-charities.component.html',
  styleUrl: './admin-charities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCharitiesComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly charities$ = this.store.select(selectCharities);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  constructor() {
    this.store.dispatch(loadCharities());
  }

  add(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, description } = this.form.getRawValue();
    this.store.dispatch(createCharity({ name, description }));
    this.form.reset({ name: '', description: '' });
  }

  edit(charity: Charity): void {
    const name = window.prompt('Edit charity name', charity.name) ?? charity.name;
    const description = window.prompt('Edit charity description', charity.description) ?? charity.description;
    this.store.dispatch(updateCharity({ id: charity._id, changes: { name, description } }));
  }

  remove(id: string): void {
    if (window.confirm('Delete this charity?')) {
      this.store.dispatch(deleteCharity({ id }));
    }
  }
}
