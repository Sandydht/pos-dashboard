import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';

import { SideBarLayout } from './side-bar-layout';

describe('SideBarLayout', () => {
  let component: SideBarLayout;
  let fixture: ComponentFixture<SideBarLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarLayout],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {
            sidebar: {
              isOpen: false,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
