import { Routes } from '@angular/router';
import { ZipSearchComponent } from './zip-search.component';

export const routes: Routes = [
  { path: '', redirectTo: 'zipcode', pathMatch: 'full' },
  { path: 'zipcode', component: ZipSearchComponent },
  { path: '**', redirectTo: 'zipcode' },
];
