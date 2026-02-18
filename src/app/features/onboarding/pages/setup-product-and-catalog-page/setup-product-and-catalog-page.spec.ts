import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupProductAndCatalogPage } from './setup-product-and-catalog-page';

describe('SetupProductAndCatalogPage', () => {
  let component: SetupProductAndCatalogPage;
  let fixture: ComponentFixture<SetupProductAndCatalogPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupProductAndCatalogPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupProductAndCatalogPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
