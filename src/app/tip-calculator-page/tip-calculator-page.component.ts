import { Component, inject, signal } from '@angular/core';
import {
  CurrencyPipe,
  NgClass,
  NgOptimizedImage,
  PercentPipe,
} from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const INTEGER_PATTERN = '^[0-9]*$';

@Component({
  selector: 'app-tip-calculator-page',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    NgClass,
    PercentPipe,
    CurrencyPipe,
  ],
  templateUrl: './tip-calculator-page.component.html',
  styleUrl: './tip-calculator-page.component.css',
})
export class TipCalculatorPageComponent {
  fb = inject(FormBuilder);
  tips = [0.05, 0.1, 0.15, 0.25, 0.5];

  selectedTip = signal<number | undefined>(undefined);

  tipPerPerson = signal<number>(0);
  totalPerPerson = signal<number>(0);

  calculatorForm = this.fb.group({
    bill: [undefined, [Validators.required, Validators.min(0)]],
    people: [
      undefined,
      [
        Validators.required,
        Validators.min(1),
        Validators.pattern(INTEGER_PATTERN),
      ],
    ],
    tip: [undefined, [Validators.min(0)]],
    customTip: [
      undefined,
      [Validators.min(0), Validators.pattern(INTEGER_PATTERN)],
    ],
  });

  constructor() {
    this.calculatorForm.statusChanges.pipe(takeUntilDestroyed()).subscribe({
      next: () => {
        if (this.calculatorForm.valid) {
          const bill = this.getField('bill')!.value;
          const people = this.getField('people')!.value;

          let tipPercent = this.getField('tip')?.value;
          if (!tipPercent) {
            tipPercent = this.getField('customTip')?.value / 100;

            if (!tipPercent) {
              tipPercent = 0;
            }
          }

          const tip = tipPercent * bill;

          this.tipPerPerson.set(tip / people);
          this.totalPerPerson.set(bill / people + this.tipPerPerson());
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getField(name: string) {
    return this.calculatorForm.get(name);
  }

  invalidTouchedOrDirtyField(name: string) {
    const field = this.getField(name);

    return field?.invalid && (field?.touched || field?.dirty);
  }

  onTipClick(tip: number) {
    this.resetCustomTip();

    this.selectedTip.set(tip);
    this.getField('tip')?.setValue(tip);
  }

  onCustomTipFocus() {
    this.resetTip();

    this.getField('tip')?.setValue(undefined);
  }

  resetCustomTip() {
    this.getField('customTip')?.setValue(undefined);
  }

  resetTip() {
    this.selectedTip.set(undefined);
  }

  reset() {
    this.calculatorForm.reset();

    this.selectedTip.set(undefined);
    this.tipPerPerson.set(0);
    this.totalPerPerson.set(0);
  }
}
