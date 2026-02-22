import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupStorePage } from './setup-store-page';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

describe('SetupStorePage', () => {
  let component: SetupStorePage;
  let fixture: ComponentFixture<SetupStorePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupStorePage],
      providers: [provideRouter([]), provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupStorePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
