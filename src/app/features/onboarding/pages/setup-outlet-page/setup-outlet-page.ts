import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/input/input';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { StepHeaderComponent } from '../../components/step-header/step-header';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../../core/services/onboarding-service/onboarding-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Outlet } from '../../../outlet/models/outlet.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { indonesianPhoneNumberValidator } from '../../../../shared/validators/indonesian-phone-number.validator';
import { InputDropdownComponent } from '../../../../shared/components/input-dropdown/input-dropdown';
import { GenerateUppercaseSlugPipe } from '../../../../shared/pipes/generate-uppercase-slug-pipe/generate-uppercase-slug-pipe';
import { OptionService } from '../../../../core/services/option-service/option-service';
import { Country } from '../../../../shared/models/country.model';
import { InputDropdownOption } from '../../../../shared/models/input-dropdown-option.model';
import { PaginatedResult } from '../../../../shared/models/paginated-result.model';
import { Province } from '../../../../shared/models/province.model';
import { PaginationMeta } from '../../../../shared/models/pagination-meta.model';
import { PaginationQuery } from '../../../../shared/models/pagination-query.model';
import { SortOrder } from '../../../../shared/models/sort-order.model';
import { City } from '../../../../shared/models/city.model';
import * as SnackbarActions from '../../../../shared/components/snackbar/store/snackbar.actions';
import { Store } from '@ngrx/store';
import { getFormErrorMessage } from '../../../../shared/utils/form-error';
import { InputOpeningHoursComponent } from '../../../../shared/components/input-opening-hours/input-opening-hours';

@Component({
  selector: 'app-setup-outlet-page',
  imports: [
    CommonModule,
    InputComponent,
    TextareaComponent,
    ButtonComponent,
    StepHeaderComponent,
    ReactiveFormsModule,
    InputDropdownComponent,
    InputOpeningHoursComponent,
  ],
  providers: [GenerateUppercaseSlugPipe],
  templateUrl: './setup-outlet-page.html',
  styleUrl: './setup-outlet-page.css',
})
export class SetupOutletPage implements OnInit {
  private readonly router = inject(Router);
  private readonly onboardingService = inject(OnboardingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly generateUppercaseSlug = inject(GenerateUppercaseSlugPipe);
  private readonly optionService = inject(OptionService);
  private readonly store = inject(Store);

  setupOutletForm = this.formBuilder.nonNullable.group({
    outletCode: [{ value: '', disabled: true }, [Validators.required]],
    outletName: ['', [Validators.required]],
    outletPhoneNumber: ['', [Validators.required, indonesianPhoneNumberValidator]],
    outletEmail: ['', [Validators.required, Validators.email]],
    outletCountry: ['', [Validators.required]],
    outletProvince: [{ value: '', disabled: true }, [Validators.required]],
    outletCity: [{ value: '', disabled: true }, [Validators.required]],
    outletPostalCode: ['', [Validators.required]],
    outletAddress: ['', [Validators.required]],
    outletOpeningHours: this.formBuilder.nonNullable.group({
      monday: this.createDaySchedule(),
      tuesday: this.createDaySchedule(),
      wednesday: this.createDaySchedule(),
      thursday: this.createDaySchedule(),
      friday: this.createDaySchedule(),
      saturday: this.createDaySchedule(),
      sunday: this.createDaySchedule(),
    }),
  });

  fetchGetOutletDetailLoading = signal<boolean>(false);
  submitSetupOutletLoading = signal<boolean>(false);
  fetchCountriesOptionLoading = signal<boolean>(false);
  fetchProvincesOptionLoading = signal<boolean>(false);
  fetchCitiesOptionLoading = signal<boolean>(false);

  countries = signal<Country[]>([]);

  searchProvince = signal<string>('');
  paginationMetaProvinces = signal<PaginationMeta>({
    page: 1,
    size: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  paginatedProvinces = signal<PaginatedResult<Province>>({
    data: [],
    meta: {
      page: 1,
      size: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    query: {
      sortBy: '',
      sortOrder: 'asc',
    },
  });

  searchCity = signal<string>('');
  paginationMetaCities = signal<PaginationMeta>({
    page: 1,
    size: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  paginatedCities = signal<PaginatedResult<City>>({
    data: [],
    meta: {
      page: 1,
      size: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    query: {
      sortBy: '',
      sortOrder: 'asc',
    },
  });

  constructor() {
    this.listenToOutletNameChanges();
    this.listenToOutletCountryChanges();
    this.listenToOutletProvinceChanges();
  }

  ngOnInit(): void {
    this.fetchGetOutletDetail();
    this.fetchCountriesOption();
  }

  get outletCodeError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletCode, {
      required: 'Code is required',
    });
  }

  get outletNameError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletCode, {
      required: 'Name is required',
    });
  }

  get outletEmailError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletCode, {
      required: 'Email is required',
      email: 'Email is invalid',
    });
  }

  get outletPhoneNumberError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletPhoneNumber, {
      required: 'Phone Number is required',
      isIndonesianPhoneNumber: 'Phone Number must be a valid Indonesian number (08xxx or +62xxx)',
    });
  }

  get outletCountryError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletPhoneNumber, {
      required: 'Country is required',
    });
  }

  get outletProvinceError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletPhoneNumber, {
      required: 'Province is required',
    });
  }

  get outletCityError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletPhoneNumber, {
      required: 'City is required',
    });
  }

  get outletPostalCodeError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletPhoneNumber, {
      required: 'Postal Code is required',
    });
  }

  get outletAddressError(): string {
    return getFormErrorMessage(this.setupOutletForm.controls.outletPhoneNumber, {
      required: 'Address is required',
    });
  }

  listenToOutletNameChanges(): void {
    this.setupOutletForm.controls.outletName.valueChanges.subscribe((value) => {
      const code = this.generateUppercaseSlug.transform(value);

      this.setupOutletForm.controls.outletCode.setValue(code, {
        emitEvent: false,
      });
    });
  }

  listenToOutletCountryChanges(): void {
    this.setupOutletForm.controls.outletCountry.valueChanges.subscribe((value) => {
      if (!value) {
        this.setupOutletForm.controls.outletProvince.disable();
        this.setupOutletForm.controls.outletProvince.reset();
        return;
      }

      this.paginationMetaProvinces.set({
        page: 1,
        size: 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });

      this.fetchProvinceOption(value);
      this.setupOutletForm.controls.outletProvince.enable();
    });
  }

  listenToOutletProvinceChanges(): void {
    this.setupOutletForm.controls.outletProvince.valueChanges.subscribe((value) => {
      if (!value) {
        this.setupOutletForm.controls.outletCity.disable();
        this.setupOutletForm.controls.outletCity.reset();
        return;
      }

      this.paginationMetaCities.set({
        page: 1,
        size: 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });

      this.fetchCitiesOption(value);
      this.setupOutletForm.controls.outletCity.enable();
    });
  }

  private createDaySchedule() {
    return this.formBuilder.nonNullable.group({
      open: ['08:00', Validators.required],
      close: ['17:00', Validators.required],
      isClosed: [false],
    });
  }

  fetchGetOutletDetail(): void {
    this.fetchGetOutletDetailLoading.set(true);
    this.onboardingService
      .getOutletDetail()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Outlet) => {
          if (response.id) {
            this.setupOutletForm.controls.outletCode.setValue(response.code);
            this.setupOutletForm.controls.outletName.setValue(response.name);
            this.setupOutletForm.controls.outletPhoneNumber.setValue(response.phoneNumber);
            this.setupOutletForm.controls.outletEmail.setValue(response.email);
            this.setupOutletForm.controls.outletCountry.setValue(response.countryId);
            this.setupOutletForm.controls.outletProvince.setValue(response.provinceId);
            this.setupOutletForm.controls.outletCity.setValue(response.cityId);
            this.setupOutletForm.controls.outletPostalCode.setValue(response.postalCode);
            this.setupOutletForm.controls.outletAddress.setValue(response.address);

            if (response.openingHours?.monday) {
              this.setupOutletForm.controls.outletOpeningHours.controls.monday.patchValue(
                response.openingHours.monday,
              );
            }
          }

          this.fetchGetOutletDetailLoading.set(false);
        },
        error: (err) => {
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
          this.fetchGetOutletDetailLoading.set(false);
        },
      });
  }

  fetchCountriesOption(): void {
    this.fetchCountriesOptionLoading.set(true);
    this.optionService
      .getCountriesOption()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Country[]) => {
          this.countries.set(response);
          this.fetchCountriesOptionLoading.set(false);
        },
        error: (err) => {
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
          this.fetchCountriesOptionLoading.set(false);
        },
      });
  }

  fetchProvinceOption(countryId: string): void {
    if (!countryId) return;

    this.fetchProvincesOptionLoading.set(true);
    this.optionService
      .getProvincesOption(countryId, this.provincesOptionQuery())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: PaginatedResult<Province>) => {
          this.paginatedProvinces.update((prev) => ({
            ...prev,
            data:
              this.paginationMetaProvinces().page === 1
                ? response.data
                : [...prev.data, ...response.data],
            meta: response.meta,
          }));

          this.paginationMetaProvinces.set(response.meta);
          this.fetchProvincesOptionLoading.set(false);
        },
        error: (err) => {
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
          this.fetchProvincesOptionLoading.set(false);
        },
      });
  }

  loadMoreProvincesOption(): void {
    if (!this.paginationMetaProvinces().hasNextPage) return;

    this.paginationMetaProvinces.update((meta) => ({
      ...meta,
      page: meta.page + 1,
    }));

    const countryId = this.setupOutletForm.controls.outletCountry.value;
    this.fetchProvinceOption(countryId);
  }

  handleProvinceSearch(keyword: string): void {
    this.paginationMetaProvinces.set({
      ...this.paginationMetaProvinces(),
      page: 1,
    });

    this.searchProvince.set(keyword);

    const countryId = this.setupOutletForm.controls.outletCountry.value;
    this.fetchProvinceOption(countryId);
  }

  fetchCitiesOption(provinceId: string): void {
    if (!provinceId) return;

    this.fetchCitiesOptionLoading.set(true);
    this.optionService
      .getCitiesOption(provinceId, this.citiesOptionQuery())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: PaginatedResult<City>) => {
          this.paginatedCities.update((prev) => ({
            ...prev,
            data:
              this.paginationMetaCities().page === 1
                ? response.data
                : [...prev.data, ...response.data],
            meta: response.meta,
          }));

          this.paginationMetaCities.set(response.meta);
          this.fetchCitiesOptionLoading.set(false);
        },
        error: (err) => {
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
          this.fetchCitiesOptionLoading.set(false);
        },
      });
  }

  loadMoreCitiesOption(): void {
    if (!this.paginationMetaCities().hasNextPage) return;

    this.paginationMetaCities.update((meta) => ({
      ...meta,
      page: meta.page + 1,
    }));

    const provinceId = this.setupOutletForm.controls.outletProvince.value;
    this.fetchCitiesOption(provinceId);
  }

  handleCitySearch(keyword: string): void {
    this.paginationMetaCities.set({
      ...this.paginationMetaCities(),
      page: 1,
    });

    this.searchCity.set(keyword);

    const provinceId = this.setupOutletForm.controls.outletProvince.value;
    this.fetchCitiesOption(provinceId);
  }

  goToSetupStorePage(): void {
    this.router.navigate(['/onboarding', 'setup-store']);
  }

  onSubmit(): void {
    if (this.setupOutletForm.invalid) {
      this.setupOutletForm.markAllAsTouched();
      return;
    }

    this.submitSetupOutletLoading.set(true);
    console.log(this.setupOutletForm.value);
    this.submitSetupOutletLoading.set(false);
  }

  countriesOption = computed<InputDropdownOption[]>(() => {
    if (this.countries().length === 0) return [];

    return this.countries().map((country) => ({
      id: country.id,
      label: country.name,
    }));
  });

  provincesOption = computed<InputDropdownOption[]>(() => {
    if (this.paginatedProvinces().data.length === 0) return [];

    return this.paginatedProvinces().data.map((province: Province) => ({
      id: province.id,
      label: province.name,
    }));
  });

  provincesOptionQuery = computed<PaginationQuery>(() => ({
    page: this.paginationMetaProvinces().page,
    size: this.paginationMetaProvinces().size,
    sortBy: 'name',
    sortOrder: 'asc' as SortOrder,
    search: this.searchProvince(),
  }));

  citiesOption = computed<InputDropdownOption[]>(() => {
    if (this.paginatedCities().data.length === 0) return [];

    return this.paginatedCities().data.map((city: City) => ({
      id: city.id,
      label: city.name,
    }));
  });

  citiesOptionQuery = computed<PaginationQuery>(() => ({
    page: this.paginationMetaCities().page,
    size: this.paginationMetaCities().size,
    sortBy: 'name',
    sortOrder: 'asc' as SortOrder,
    search: this.searchCity(),
  }));
}
