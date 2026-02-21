import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSearchComponent } from './input-search';

describe('InputSearchComponent', () => {
  let component: InputSearchComponent;
  let fixture: ComponentFixture<InputSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
