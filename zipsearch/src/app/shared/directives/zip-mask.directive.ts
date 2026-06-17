import { Directive, HostListener, inject, output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appZipMask]',
  standalone: true,
})
export class ZipMaskDirective {
  private readonly control = inject(NgControl);
  readonly formatted = output<string>();

  @HostListener('input')
  onInput(): void {
    const value = this.control.value?.toString() ?? '';
    const digits = value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 5) {
      formatted = digits.slice(0, 5) + '-' + digits.slice(5);
    }
    this.control.control?.setValue(formatted, { emitEvent: false });
    this.formatted.emit(formatted);
  }
}
