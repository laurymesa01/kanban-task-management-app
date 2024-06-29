import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'board/:name',
        loadComponent: () => import('./components/board/board.component').then(m => m.BoardComponent),
      }
    ]
  }
];
