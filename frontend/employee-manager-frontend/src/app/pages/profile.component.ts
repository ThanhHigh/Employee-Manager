import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, Employee } from '../services/employee.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h2>My Profile</h2>

      <div *ngIf="loading" class="loading">Loading...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && !error && employee" class="profile-card">
        <div class="profile-row">
          <span class="label">Name:</span>
          <span class="value">{{ employee.name }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Email:</span>
          <span class="value">{{ employee.email }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Phone:</span>
          <span class="value">{{ employee.phone || '-' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">Department:</span>
          <span class="value">{{ employee.department || '-' }}</span>
        </div>
        <div class="profile-row" *ngIf="employee.createdAt">
          <span class="label">Created At:</span>
          <span class="value">{{ formatDate(employee.createdAt) }}</span>
        </div>
        <div class="profile-row" *ngIf="employee.updatedAt">
          <span class="label">Updated At:</span>
          <span class="value">{{ formatDate(employee.updatedAt) }}</span>
        </div>
      </div>

      <div *ngIf="!loading && !error && !employee" class="empty-state">
        No profile found. Please contact your administrator.
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-container h2 {
      margin-bottom: 1.5rem;
    }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .profile-row {
      display: flex;
      padding: 1rem 0;
      border-bottom: 1px solid #dee2e6;
    }

    .profile-row:last-child {
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
export class ProfileComponent implements OnInit {
  employee: Employee | null = null;
  loading = false;
  error: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.error = null;
    this.employeeService.getOwnProfile().subscribe({
      next: (employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.loading = false;
        console.error(err);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}


