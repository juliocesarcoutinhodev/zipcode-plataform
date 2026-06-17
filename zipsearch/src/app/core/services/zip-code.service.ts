import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZipCode } from '../models/zip-code.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ZipCodeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  findByCode(code: string): Observable<ZipCode> {
    const normalized = code.replace(/\D/g, '');
    return this.http.get<ZipCode>(`${this.baseUrl}/zip/${normalized}`);
  }
}
