import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipCalculatorPageComponent } from './tip-calculator-page.component';

describe('TipCalculatorPageComponent', () => {
  let component: TipCalculatorPageComponent;
  let fixture: ComponentFixture<TipCalculatorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipCalculatorPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipCalculatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
