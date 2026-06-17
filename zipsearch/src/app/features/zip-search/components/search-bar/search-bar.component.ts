import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZipMaskDirective } from '../../../../shared/directives/zip-mask.directive';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, ZipMaskDirective],
  template: `
    <form (ngSubmit)="onSearch()" class="relative w-full max-w-xl mx-auto">
      <div
        class="relative flex items-center rounded-2xl bg-white/5 border backdrop-blur-xl transition-all duration-300"
        [class]="shake() ? 'animate-shake-x border-red-500/50' : 'border-white/10'"
        [class.has-focus]="focused()"
      >
        <input
          [(ngModel)]="query"
          name="cep"
          appZipMask
          (focus)="focused.set(true)"
          (blur)="focused.set(false)"
          type="text"
          inputmode="numeric"
          placeholder="Digite o CEP... ex: 01310-100"
          class="flex-1 bg-transparent px-5 py-4 text-lg text-slate-100 placeholder-slate-500 outline-none font-medium min-w-0"
          aria-label="Digite o CEP para consulta"
          aria-describedby="cep-error"
          autocomplete="off"
        />
        <button
          type="submit"
          [disabled]="loading()"
          class="mr-2 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-60 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          aria-label="Consultar CEP"
        >
          @if (loading()) {
            <svg class="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          } @else {
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
          }
        </button>
      </div>
      @if (errorMessage()) {
        <p id="cep-error" class="mt-2 text-sm text-red-400 font-medium px-1">
          {{ errorMessage() }}
        </p>
      }
    </form>
  `,
})
export class SearchBarComponent {
  readonly loading = input(false);
  readonly search = output<string>();
  readonly query = signal('');
  readonly focused = signal(false);
  readonly shake = signal(false);
  readonly errorMessage = signal('');

  onSearch(): void {
    const raw = this.query();
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 8) {
      this.shake.set(true);
      this.errorMessage.set('CEP inválido. Digite 8 dígitos numéricos.');
      setTimeout(() => this.shake.set(false), 300);
      return;
    }
    this.errorMessage.set('');
    this.search.emit(digits);
  }

  reset(): void {
    this.query.set('');
    this.errorMessage.set('');
  }
}
