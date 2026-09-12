import { Component, signal, computed, inject, viewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { ZipCodeService } from '../../core/services/zip-code.service';
import { ZipCode } from '../../core/models/zip-code.model';
import { ApiError } from '../../core/models/api-error.model';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-zip-search',
  standalone: true,
  imports: [SearchBarComponent, ResultCardComponent],
  template: `
    <div class="relative min-h-screen overflow-hidden">
      <div class="fixed inset-0 -z-10">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-float"></div>
        <div class="absolute top-[30%] right-[-5%] w-[35%] h-[35%] rounded-full bg-indigo-600/15 blur-[100px] animate-float" style="animation-delay: -5s"></div>
        <div class="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-cyan-600/10 blur-[100px] animate-float" style="animation-delay: -10s"></div>
      </div>

      <div class="relative z-10 px-4 py-8 md:py-16">
        <header class="text-center mb-10 md:mb-14">
          @if (!environment.production) {
            <div id="ad-slot-top" class="mx-auto mb-8 max-w-[728px] h-[90px] rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center">
              <span class="text-xs text-slate-600">Espaço publicitário</span>
            </div>
          }

          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 mb-6">
            🚀 Powered by CNPJá
          </div>

          <h1 class="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            BuscaCEP
          </h1>
          <p class="text-lg md:text-xl text-slate-400 font-medium">
            Consulte qualquer CEP do Brasil em segundos
          </p>
        </header>

        <app-search-bar
          [loading]="loading()"
          (search)="onSearch($event)"
        />

        <div class="mt-8 md:mt-10">
          <app-result-card
            [state]="state()"
            [data]="result()"
            [error]="error()"
            (retry)="onSearch(lastQuery())"
            (newSearch)="onNewSearch()"
          />
        </div>

        <footer class="text-center mt-16 pb-8">
          <p class="text-sm text-slate-500">
            Desenvolvido por
            <a
              href="https://www.github.com/juliocesarcoutinhodev"
              target="_blank"
              rel="noopener noreferrer"
              class="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Julio Cesar Coutinho
            </a>
          </p>
          <div class="flex items-center justify-center gap-4 mt-2">
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              API Docs
            </a>
          </div>
          <p class="text-xs text-slate-700 mt-2">© 2026 BuscaCEP</p>
        </footer>
      </div>
    </div>
  `,
})
export class ZipSearchComponent implements OnInit {
  private readonly service = inject(ZipCodeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly environment = environment;

  protected readonly searchBar = viewChild(SearchBarComponent);
  protected readonly lastQuery = signal('');
  protected readonly result = signal<ZipCode | null>(null);
  protected readonly error = signal<ApiError | null>(null);
  protected readonly loading = signal(false);

  protected readonly state = computed(() => {
    if (this.loading()) return 'loading' as const;
    if (this.error()) return 'error' as const;
    if (this.result()) return 'result' as const;
    return 'idle' as const;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const cep = params['cep'];
      if (cep && /^\d{8}$/.test(cep)) {
        this.onSearch(cep);
      }
    });
  }

  onSearch(code: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.lastQuery.set(code);

    this.router.navigate([], { queryParams: { cep: code }, queryParamsHandling: 'merge' });

    this.service.findByCode(code).pipe(
      catchError((err: unknown) => {
        const httpErr = err as { error?: ApiError };
        if (httpErr.error?.status) {
          this.error.set(httpErr.error);
        } else {
          this.error.set({
            status: 503,
            error: 'Serviço indisponível',
            message: 'Não foi possível consultar o serviço externo no momento. Tente novamente em instantes.',
            timestamp: new Date().toISOString(),
            path: `/api/v1/zip/${code}`,
          });
        }
          return throwError(() => err as never);
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe((data: ZipCode) => {
      this.result.set(data);
    });
  }

  onNewSearch(): void {
    this.result.set(null);
    this.error.set(null);
    this.router.navigate([], { queryParams: {}, queryParamsHandling: '' });
    this.searchBar()?.reset();
    this.searchBar()?.query.set('');
  }
}
