import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarLayout } from './side-bar-layout';

describe('SideBarLayout', () => {
  let component: SideBarLayout;
  let fixture: ComponentFixture<SideBarLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
