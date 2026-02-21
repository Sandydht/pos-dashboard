import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupOutletPage } from './setup-outlet-page';
import { GenerateUppercaseSlugPipe } from '../../../../shared/pipes/generate-uppercase-slug-pipe/generate-uppercase-slug-pipe';

describe('SetupOutletPage', () => {
  let component: SetupOutletPage;
  let fixture: ComponentFixture<SetupOutletPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupOutletPage],
      providers: [GenerateUppercaseSlugPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupOutletPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
