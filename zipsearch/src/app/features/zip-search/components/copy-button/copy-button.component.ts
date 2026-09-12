import { Component, input, signal } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-copy-button',
  standalone: true,
  imports: [ClipboardModule],
  template: `
    <button
      [cdkCopyToClipboard]="value()"
      (cdkCopyToClipboardCopied)="onCopied()"
      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
      [class]="copied()
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-300'"
      [attr.aria-label]="copied() ? 'Copiado para a área de transferência' : 'Copiar ' + label()"
    >
      @if (copied()) {
        <svg class="w-3.5 h-3.5 animate-check-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
        <span>Copiado!</span>
      } @else {
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/>
        </svg>
        <span>{{ label() }}</span>
      }
    </button>
  `,
})
export class CopyButtonComponent {
  readonly value = input.required<string>();
  readonly label = input('Copiar');
  readonly copied = signal(false);

  onCopied(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
