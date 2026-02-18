import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppBarLayout } from './app-bar-layout';

describe('AppBarLayout', () => {
  let component: AppBarLayout;
  let fixture: ComponentFixture<AppBarLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBarLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(AppBarLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
