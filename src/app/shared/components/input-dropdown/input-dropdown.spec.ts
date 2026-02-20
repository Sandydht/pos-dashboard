import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDropdownComponent } from './input-dropdown';

describe('InputDropdownComponent', () => {
  let component: InputDropdownComponent;
  let fixture: ComponentFixture<InputDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDropdownComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
