import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { loadCharities, selectCharity } from '../../../store/charities/charities.actions';
import { selectCharities, selectCharitiesLoading } from '../../../store/charities/charities.selectors';
import { loadProfile, updateProfile } from '../../../store/user/user.actions';
import { selectContributionPercentage, selectUserProfile } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-charity-select',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, LoaderComponent],
  templateUrl: './charity-select.component.html',
  styleUrl: './charity-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharitySelectComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly charities$ = this.store.select(selectCharities);
  readonly loading$ = this.store.select(selectCharitiesLoading);
  readonly profile$ = this.store.select(selectUserProfile);
  readonly contributionPercentage$ = this.store.select(selectContributionPercentage);

  readonly form = this.fb.nonNullable.group({
    contributionPercentage: [10, [Validators.required, Validators.min(10), Validators.max(100)]]
  });

  constructor() {
    this.store.dispatch(loadCharities());
    this.store.dispatch(loadProfile());
    this.contributionPercentage$.subscribe((value) => {
      this.form.patchValue({ contributionPercentage: value }, { emitEvent: false });
    });
  }

  selectedCharityId(charity: unknown): string | null {
    if (!charity) {
      return null;
    }
    return typeof charity === 'string' ? charity : (charity as { _id?: string })._id || null;
  }

  onSelectCharity(charityId: string): void {
    this.store.dispatch(selectCharity({ charityId }));
  }

  onSaveContribution(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.dispatch(updateProfile({ changes: this.form.getRawValue() }));
  }
}
