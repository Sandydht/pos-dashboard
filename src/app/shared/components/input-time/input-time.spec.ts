import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTimeComponent } from './input-time';

describe('InputTimeComponent', () => {
  let component: InputTimeComponent;
  let fixture: ComponentFixture<InputTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTimeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTimeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
