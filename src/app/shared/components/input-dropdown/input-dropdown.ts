import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputDropdownOption } from '../../models/input-dropdown-option.model';
import { ClickOutsideDirective } from '../../directives/click-outside-directive/click-outside-directive';
import { debounceTime, filter, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputSearchComponent } from '../input-search/input-search';

@Component({
  selector: 'app-input-dropdown',
  imports: [CommonModule, ClickOutsideDirective, InputSearchComponent],
  templateUrl: './input-dropdown.html',
  styleUrl: './input-dropdown.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDropdownComponent),
      multi: true,
    },
  ],
})
export class InputDropdownComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  id = input<string>('input-component');
  label = input<string>('Label');
  required = input<boolean>(false);
  placeholder = input<string>('Input...');
  disabled = input<boolean>(false);
  error = input<string>('');
  options = input<InputDropdownOption[]>([]);
  searchPlaceholder = input<string>('');
  enableSearch = input<boolean>(false);

  valueChange = output<string>();

  internalValue = signal<InputDropdownOption | null>(null);
  disabledSignal = signal(false);
  isOpenDropdown = signal<boolean>(false);

  @ViewChild('sentinel') sentinel?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLDivElement>;

  observer?: IntersectionObserver;
  loadMore = output<void>();
  hasMore = input<boolean>(false);
  isLoadingMore = input<boolean>(false);
  loadMoreSubject = new Subject<void>();

  searchSubject = new Subject<string>();
  searchKeyword = signal<string>('');
  search = output<string>();

  constructor() {
    effect(() => {
      if (this.isOpenDropdown()) {
        setTimeout(() => {
          this.initObserver();
        });
      }
    });

    effect(() => {
      if (!this.isLoadingMore() && this.isOpenDropdown()) {
        setTimeout(() => {
          this.initObserver();
        });
      }
    });

    this.setupLoadMoreListener();
    this.setupSearchListener();
  }

  ngAfterViewInit(): void {
    this.initObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupLoadMoreListener(): void {
    this.loadMoreSubject
      .pipe(
        debounceTime(300),
        filter(() => this.hasMore()),
        filter(() => !this.isLoadingMore()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.loadMore.emit();
      });
  }

  setupSearchListener(): void {
    this.searchSubject
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((keyword) => {
        this.searchKeyword.set(keyword);
        this.search.emit(keyword);
      });
  }

  initObserver() {
    if (!this.scrollContainer || !this.sentinel) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && this.hasMore() && !this.isLoadingMore()) {
          this.loadMoreSubject.next();
        }
      },
      {
        root: this.scrollContainer.nativeElement,
        threshold: 0.1,
      },
    );

    if (this.sentinel) {
      this.observer.observe(this.sentinel.nativeElement);
    }
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    const found = this.options().find((o) => o.id === value);
    if (found) {
      this.internalValue.set(found);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSignal.set(isDisabled);
  }

  toggleDropdown(): void {
    this.isOpenDropdown.update((value) => !value);
  }

  closeDropdown(): void {
    this.isOpenDropdown.set(false);
    this.onTouched();

    if (this.enableSearch()) {
      this.searchKeyword.set('');
      this.searchSubject.next(''); // trigger parent reset
    }
  }

  handleSelectItem(value: string): void {
    const option = this.options().find((o) => o.id === value) || null;
    this.internalValue.set(option);
    this.valueChange.emit(value);
    this.onChange(value);
    this.closeDropdown();
  }

  handleSearch(keyword: string): void {
    this.searchSubject.next(keyword);
  }

  buttonClasses = computed(() => {
    const baseStyle =
      'w-full h-auto max-h-[34px] px-4 py-2 rounded-lg text-left text-[12px] leading-[16px] outline-none border overflow-hidden flex items-center justify-between gap-2';
    const normalStyle =
      'cursor-pointer text-black border-[var(--color-tertiary-500)] focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)]';
    const placeholderStyle =
      'text-[#9E9E9E] cursor-pointer border-[var(--color-tertiary-500)] focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info)]';
    const disabledStyle =
      'bg-[var(--state-disabled-bg)] cursor-not-allowed opacity-[var(--state-disabled-opacity)]';
    const errorStyle =
      'cursor-pointer border-[var(--color-error)] focus:border-[var(--color-error-dark)] focus:ring-2 focus:ring-[var(--color-error-light)]';

    if (this.isDisabled()) return `${baseStyle} ${disabledStyle}`;
    if (this.error()) return `${baseStyle} ${errorStyle}`;
    if (this.placeholder() && !this.internalValue()) return `${baseStyle} ${placeholderStyle}`;

    return `${baseStyle} ${normalStyle}`;
  });

  iconClasses = computed(() => {
    const baseStyle =
      'w-full h-full aspect-square min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] transition-all';
    const openDropdownStyle = 'rotate-180';

    if (this.isOpenDropdown()) return `${baseStyle} ${openDropdownStyle}`;

    return `${baseStyle}`;
  });

  isDisabled = computed(() => this.disabled() || this.disabledSignal());

  selectedInternalValue = computed(() => {
    if (this.internalValue()) return this.internalValue()!.label;
    if (!this.internalValue()) return this.placeholder();
    return this.placeholder();
  });
}
