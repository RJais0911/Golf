import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-score-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './score-add.component.html',
  styleUrl: './score-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreAddComponent {
  private readonly fb = new FormBuilder();

  @Input() disabled = false;
  @Output() add = new EventEmitter<number>();

  readonly form = this.fb.nonNullable.group({
    value: [1, [Validators.required, Validators.min(1), Validators.max(45), Validators.pattern(/^\d+$/)]]
  });

  submit(): void {
    if (this.form.invalid || this.disabled) {
      this.form.markAllAsTouched();
      return;
    }

    this.add.emit(Number(this.form.getRawValue().value));
    this.form.reset({ value: 1 });
  }
}
