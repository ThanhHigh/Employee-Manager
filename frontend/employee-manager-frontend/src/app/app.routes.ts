import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'employees',
        loadComponent: () => import('./pages/employee-list.component').then(m => m.EmployeeListComponent),
        canActivate: [roleGuard(['hr_admin', 'hr_manager', 'hr_staff'])]
      },
      {
        path: 'employees/new',
        loadComponent: () => import('./pages/employee-form.component').then(m => m.EmployeeFormComponent),
        canActivate: [roleGuard(['hr_admin', 'hr_manager', 'hr_staff'])]
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('./pages/employee-detail.component').then(m => m.EmployeeDetailComponent),
        canActivate: [authGuard]
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () => import('./pages/employee-form.component').then(m => m.EmployeeFormComponent),
        canActivate: [roleGuard(['hr_admin', 'hr_manager'])]
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  }
];
