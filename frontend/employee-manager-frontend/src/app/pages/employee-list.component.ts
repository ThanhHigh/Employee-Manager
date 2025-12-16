import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService, Employee } from '../services/employee.service';
import { KeycloakService } from '../auth/keycloak.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="employee-list-container">
      <div class="header-actions">
      <h2>Employee Directory</h2>
        <button *ngIf="canCreate()" routerLink="/employees/new" class="btn btn-primary">
          Add New Employee
        </button>
      </div>

      <div *ngIf="loading" class="loading">Loading...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <table *ngIf="!loading && !error" class="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let emp of employees">
            <td>{{ emp.name }}</td>
            <td>{{ emp.email }}</td>
            <td>{{ emp.phone || '-' }}</td>
            <td>{{ emp.department || '-' }}</td>
            <td>
              <button routerLink="/employees/{{ emp.id }}" class="btn btn-sm btn-info">View</button>
              <button *ngIf="canEdit()" routerLink="/employees/{{ emp.id }}" class="btn btn-sm btn-warning">Edit</button>
              <button *ngIf="canDelete()" (click)="deleteEmployee(emp.id!)" class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && !error && employees.length === 0" class="empty-state">
        No employees found.
      </div>
    </div>
  `,
  styles: [`
    .employee-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .header-actions h2 {
      margin: 0;
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .employee-table th,
    .employee-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .employee-table th {
      background: #f8f9fa;
      font-weight: 600;
    }

    .employee-table tr:hover {
      background: #f8f9fa;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }

    .btn-info {
      background: #17a2b8;
      color: white;
    }

    .btn-warning {
      background: #ffc107;
      color: #212529;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .loading, .error, .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error {
      color: #dc3545;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.error = null;
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employees';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => {
          this.error = 'Failed to delete employee';
          console.error(err);
        }
      });
    }
  }

  canCreate(): boolean {
    return this.keycloakService.isAdmin() || this.keycloakService.isStaff();
  }

  canEdit(): boolean {
    return this.keycloakService.isAdmin() || this.keycloakService.isStaff();
  }

  canDelete(): boolean {
    return this.keycloakService.isAdmin();
  }
}