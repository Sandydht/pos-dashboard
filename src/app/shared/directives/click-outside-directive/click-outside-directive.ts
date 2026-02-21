import { Directive, effect, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  clickOutside = output<void>();

  constructor() {
    effect((onCleanup) => {
      const listener = (event: PointerEvent) => {
        const target = event.target as HTMLElement;

        if (!this.elementRef.nativeElement.contains(target)) {
          this.clickOutside.emit();
        }
      };

      document.addEventListener('click', listener);

      onCleanup(() => {
        document.removeEventListener('click', listener);
      });
    });
  }
}
