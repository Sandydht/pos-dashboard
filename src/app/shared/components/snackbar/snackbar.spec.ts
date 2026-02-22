import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarComponent } from './snackbar';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {
            snackbar: {
              visible: false,
              message: '',
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
