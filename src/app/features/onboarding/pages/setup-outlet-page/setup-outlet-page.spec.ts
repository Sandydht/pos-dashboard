import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupOutletPage } from './setup-outlet-page';

describe('SetupOutletPage', () => {
  let component: SetupOutletPage;
  let fixture: ComponentFixture<SetupOutletPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupOutletPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupOutletPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
