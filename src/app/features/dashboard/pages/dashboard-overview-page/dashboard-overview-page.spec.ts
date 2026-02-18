import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOverviewPage } from './dashboard-overview-page';

describe('DashboardOverviewPage', () => {
  let component: DashboardOverviewPage;
  let fixture: ComponentFixture<DashboardOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOverviewPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardOverviewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
