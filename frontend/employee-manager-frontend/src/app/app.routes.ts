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
        canActivate: [roleGuard(['role-admin', 'role-staff'])]
      },
      {
        path: 'employees/new',
        loadComponent: () => import('./pages/employee-form.component').then(m => m.EmployeeFormComponent),
        canActivate: [roleGuard(['role-admin', 'role-staff'])] // Chỉ admin và staff mới được tạo nhân viên mới
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('./pages/employee-detail.component').then(m => m.EmployeeDetailComponent),
        canActivate: [authGuard]
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () => import('./pages/employee-form.component').then(m => m.EmployeeFormComponent),
        canActivate: [roleGuard(['role-admin', 'role-staff'])]
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
