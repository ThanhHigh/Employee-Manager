import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from '../services/employee.service';
import { KeycloakService } from '../auth/keycloak.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-container">
      <div *ngIf="loading" class="loading">Loading...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && !error && employee" class="employee-detail">
        <div class="header-actions">
          <h2>Employee Details</h2>
          <div class="actions">
            <button *ngIf="canEdit()" [routerLink]="['/employees', employee.id, 'edit']" class="btn btn-primary">
              Edit
            </button>
            <button routerLink="/employees" *ngIf="canViewList()" class="btn btn-secondary">Back to List</button>
            <button routerLink="/profile" *ngIf="!canViewList()" class="btn btn-secondary">Back to Profile</button>
          </div>
        </div>

        <div class="detail-card">
          <div class="detail-row">
            <span class="label">Name:</span>
            <span class="value">{{ employee.name }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">{{ employee.email }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Phone:</span>
            <span class="value">{{ employee.phone || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Department:</span>
            <span class="value">{{ employee.department || '-' }}</span>
          </div>
          <div class="detail-row" *ngIf="employee.createdAt">
            <span class="label">Created At:</span>
            <span class="value">{{ formatDate(employee.createdAt) }}</span>
          </div>
          <div class="detail-row" *ngIf="employee.updatedAt">
            <span class="label">Updated At:</span>
            <span class="value">{{ formatDate(employee.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 800px;
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

    .actions {
      display: flex;
      gap: 1rem;
    }

    .detail-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .detail-row {
      display: flex;
      padding: 1rem 0;
      border-bottom: 1px solid #dee2e6;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      width: 150px;
      color: #495057;
    }

    .value {
      flex: 1;
      color: #212529;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .loading, .error {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error {
      color: #dc3545;
    }
  `]
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private keycloakService: KeycloakService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(+id);
    }
  }

  loadEmployee(id: number) {
    console.log('[EmployeeDetailComponent] Starting to load employee with id:', id);
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        console.log('[EmployeeDetailComponent] Employee data received:', employee);
        this.employee = employee;
        this.loading = false;
        console.log('[EmployeeDetailComponent] Component state - employee:', this.employee, 'loading:', this.loading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[EmployeeDetailComponent] Error loading employee:', err);
        this.error = 'Failed to load employee';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  canEdit(): boolean {
    return this.keycloakService.isAdmin() || this.keycloakService.isStaff() || this.keycloakService.isManager();
  }

  canViewList(): boolean {
    return this.keycloakService.isAdmin() || this.keycloakService.isStaff() || this.keycloakService.isManager();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}

