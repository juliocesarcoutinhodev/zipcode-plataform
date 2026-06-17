import { Component, input, output } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ZipCode } from '../../../../core/models/zip-code.model';
import { ApiError } from '../../../../core/models/api-error.model';
import { CopyButtonComponent } from '../copy-button/copy-button.component';

@Component({
  selector: 'app-result-card',
  standalone: true,
  imports: [ClipboardModule, CopyButtonComponent],
  template: `
    @switch (state()) {
      @case ('loading') {
        <div class="w-full max-w-xl mx-auto animate-fade-slide-in">
          <div class="rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl p-8 space-y-6">
            <div class="flex items-center gap-3 text-slate-400">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span class="text-lg font-medium">Consultando CEP<span class="animate-pulse">...</span></span>
            </div>
            <div class="space-y-4">
              @for (i of [1,2,3,4]; track i) {
                <div class="h-4 rounded-full bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-shimmer bg-[length:200%_100%]" style="width: {{ 60 + i * 10 }}%"></div>
              }
            </div>
          </div>
        </div>
      }
      @case ('error') {
        <div class="w-full max-w-xl mx-auto animate-fade-slide-in">
          @if (error()?.status === 404) {
            <div class="rounded-2xl bg-red-500/5 border border-red-500/20 backdrop-blur-xl p-8 text-center">
              <div class="text-5xl mb-4">😔</div>
              <h2 class="text-xl font-bold text-red-400 mb-2">CEP não encontrado</h2>
              <p class="text-slate-400 mb-6">O CEP informado não existe ou não foi encontrado na base de dados.</p>
              <button (click)="retry.emit()" class="px-6 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all font-medium">
                Tentar novamente
              </button>
            </div>
          } @else if (error()?.status === 503) {
            <div class="rounded-2xl bg-orange-500/5 border border-orange-500/20 backdrop-blur-xl p-8 text-center">
              <div class="text-5xl mb-4">🔧</div>
              <h2 class="text-xl font-bold text-orange-400 mb-2">Serviço temporariamente indisponível</h2>
              <p class="text-slate-400 mb-6">Tente novamente em alguns instantes.</p>
              <button (click)="retry.emit()" class="px-6 py-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 transition-all font-medium">
                Tentar novamente
              </button>
            </div>
          }
        </div>
      }
      @case ('result') {
        <div #resultCard class="w-full max-w-xl mx-auto animate-fade-slide-in">
          <div class="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8 space-y-6">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">{{ data()!.code }}</h2>
                <p class="text-lg text-slate-400 mt-1">{{ data()!.city }} · {{ data()!.state }}</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                ✓ CEP encontrado
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div class="flex items-center gap-3">
                  <span class="text-lg">🏠</span>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider">Logradouro</p>
                    <p class="text-sm font-medium text-slate-200">{{ data()!.street || '-' }}</p>
                  </div>
                </div>
                <app-copy-button [value]="data()!.street || ''" label="Copiar" />
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div class="flex items-center gap-3">
                  <span class="text-lg">🏘️</span>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider">Bairro</p>
                    <p class="text-sm font-medium text-slate-200">{{ data()!.district || '-' }}</p>
                  </div>
                </div>
                <app-copy-button [value]="data()!.district || ''" label="Copiar" />
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div class="flex items-center gap-3">
                  <span class="text-lg">🏙️</span>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider">Cidade</p>
                    <p class="text-sm font-medium text-slate-200">{{ data()!.city }}</p>
                  </div>
                </div>
                <app-copy-button [value]="data()!.city" label="Copiar" />
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div class="flex items-center gap-3">
                  <span class="text-lg">🗺️</span>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider">Estado</p>
                    <p class="text-sm font-medium text-slate-200">{{ data()!.state }}</p>
                  </div>
                </div>
                <app-copy-button [value]="data()!.state" label="Copiar" />
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div class="flex items-center gap-3">
                  <span class="text-lg">🔢</span>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider">Município</p>
                    <p class="text-sm font-medium text-slate-200">{{ data()!.municipality }}</p>
                  </div>
                </div>
                <app-copy-button [value]="data()!.municipality.toString()" label="Copiar" />
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div class="flex items-center gap-3">
                  <span class="text-lg">🕐</span>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider">Atualizado</p>
                    <p class="text-sm font-medium text-slate-200">{{ formatDate(data()!.updated) }}</p>
                  </div>
                </div>
                <app-copy-button [value]="formatDate(data()!.updated)" label="Copiar" />
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                [cdkCopyToClipboard]="copyAllText()"
                class="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-medium transition-all duration-200 shadow-lg shadow-indigo-500/25"
              >
                📋 Copiar tudo
              </button>
              <button
                (click)="newSearch.emit()"
                class="flex-1 px-5 py-3 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all font-medium"
              >
                Nova busca
              </button>
            </div>

            <p class="text-center text-xs text-slate-600">📋 Compartilhe este resultado</p>
          </div>

          <!--
          <div class="mt-6 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 border border-white/5 backdrop-blur-xl p-6 text-center">
            <h3 class="text-lg font-semibold text-slate-200 mb-2">Precisa de acesso programático?</h3>
            <p class="text-sm text-slate-400 mb-4">Integre nossa API em seus sistemas. Planos a partir de R$ 0/mês.</p>
            <button
              disabled
              class="px-6 py-2.5 rounded-xl bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed font-medium"
              title="Em breve"
            >
              Ver planos
            </button>
          </div>
          -->
        </div>
      }
    }
  `,
})
export class ResultCardComponent {
  readonly state = input.required<'idle' | 'loading' | 'error' | 'result'>();
  readonly data = input<ZipCode | null>(null);
  readonly error = input<ApiError | null>(null);
  readonly retry = output<void>();
  readonly newSearch = output<void>();

  formatDate(iso: string): string {
    if (!iso) return '-';
    const date = new Date(iso);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  copyAllText(): string {
    const z = this.data()!;
    return [
      `CEP: ${z.code}`,
      `Logradouro: ${z.street || '-'}`,
      `Bairro: ${z.district || '-'}`,
      `Cidade: ${z.city}`,
      `Estado: ${z.state}`,
      `Município: ${z.municipality}`,
      `Atualizado em: ${this.formatDate(z.updated)}`,
    ].join('\n');
  }
}
