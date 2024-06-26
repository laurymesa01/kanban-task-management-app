import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      }
    ]
  }
];
