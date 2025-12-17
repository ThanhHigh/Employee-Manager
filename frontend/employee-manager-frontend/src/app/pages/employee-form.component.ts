import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService, CreateEmployeeDTO, UpdateEmployeeDTO } from '../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>{{ isEditMode ? 'Edit Employee' : 'Create New Employee' }}</h2>
      
      <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name *</label>
          <input 
            id="name" 
            type="text" 
            formControlName="name" 
            class="form-control"
            [class.is-invalid]="employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched">
          <div *ngIf="employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched" class="invalid-feedback">
            <div *ngIf="employeeForm.get('name')?.errors?.['required']">Name is required</div>
            <div *ngIf="employeeForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</div>
            <div *ngIf="employeeForm.get('name')?.errors?.['maxlength']">Name must not exceed 100 characters</div>
          </div>
          <div *ngIf="fieldErrors['name']" class="invalid-feedback">
            <div *ngFor="let error of fieldErrors['name']">{{ error }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email" 
            class="form-control"
            [class.is-invalid]="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched">
          <div *ngIf="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched" class="invalid-feedback">
            <div *ngIf="employeeForm.get('email')?.errors?.['required']">Email is required</div>
            <div *ngIf="employeeForm.get('email')?.errors?.['email']">Email must be valid</div>
            <div *ngIf="employeeForm.get('email')?.errors?.['maxlength']">Email must not exceed 255 characters</div>
          </div>
          <div *ngIf="fieldErrors['email']" class="invalid-feedback">
            <div *ngFor="let error of fieldErrors['email']">{{ error }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input 
            id="phone" 
            type="text" 
            formControlName="phone" 
            class="form-control"
            [class.is-invalid]="employeeForm.get('phone')?.invalid && employeeForm.get('phone')?.touched">
          <div *ngIf="employeeForm.get('phone')?.invalid && employeeForm.get('phone')?.touched" class="invalid-feedback">
            <div *ngIf="employeeForm.get('phone')?.errors?.['pattern']">
              Phone must contain only numbers, spaces, hyphens, parentheses, or plus sign
            </div>
            <div *ngIf="employeeForm.get('phone')?.errors?.['maxlength']">
              Phone must not exceed 20 characters
            </div>
          </div>
          <div *ngIf="fieldErrors['phone']" class="invalid-feedback">
            <div *ngFor="let error of fieldErrors['phone']">{{ error }}</div>
          </div>
        </div>

        <div class="form-group">
          <label for="department">Department</label>
          <select 
            id="department" 
            formControlName="department" 
            class="form-control"
            [class.is-invalid]="employeeForm.get('department')?.invalid && employeeForm.get('department')?.touched">
            <option value="">-- Select Department --</option>
            <option *ngFor="let dept of departments" [value]="dept">{{ dept }}</option>
          </select>
          <div *ngIf="employeeForm.get('department')?.invalid && employeeForm.get('department')?.touched" class="invalid-feedback">
            <div *ngIf="employeeForm.get('department')?.errors?.['maxlength']">
              Department must not exceed 100 characters
            </div>
          </div>
          <div *ngIf="fieldErrors['department']" class="invalid-feedback">
            <div *ngFor="let error of fieldErrors['department']">{{ error }}</div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="employeeForm.invalid || loading" class="btn btn-primary">
            {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
          <button type="button" (click)="cancel()" class="btn btn-secondary">Cancel</button>
        </div>

        <div *ngIf="error" class="error-message">{{ error }}</div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control select {
      cursor: pointer;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .error-message {
      color: #dc3545;
      margin-top: 1rem;
      padding: 0.5rem;
      background: #f8d7da;
      border-radius: 4px;
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  loading = false;
  error: string | null = null;
  fieldErrors: { [key: string]: string[] } = {};

  // Danh sách các phòng ban - có thể mở rộng sau bằng cách lấy từ API
  departments: string[] = [
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Service',
    'Research & Development',
    'Legal',
    'Administration'
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Pattern cho phone: chỉ cho phép số, khoảng trắng, dấu gạch ngang, dấu ngoặc đơn, dấu +
    const phonePattern = /^[0-9+\-\s()]*$/;
    
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [Validators.maxLength(20), Validators.pattern(phonePattern)]],
      department: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee();
    }
  }

  loadEmployee() {
    if (this.employeeId) {
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (employee) => {
          this.employeeForm.patchValue({
            name: employee.name,
            email: employee.email,
            phone: employee.phone || '',
            department: employee.department || ''
          });
        },
        error: (err) => {
          this.error = 'Failed to load employee';
          console.error(err);
        }
      });
    }
  }

  onSubmit() {
    // Đánh dấu tất cả các field là đã touched để hiển thị lỗi
    if (this.employeeForm.invalid) {
      Object.keys(this.employeeForm.controls).forEach(key => {
        this.employeeForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;
    this.fieldErrors = {}; // Reset field errors

    const formValue = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {
      const updateDto: UpdateEmployeeDTO = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone || undefined,
        department: formValue.department || undefined
      };
      this.employeeService.updateEmployee(this.employeeId, updateDto).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err);
          this.loading = false;
        }
      });
    } else {
      const createDto: CreateEmployeeDTO = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone || undefined,
        department: formValue.department || undefined
      };
      this.employeeService.createEmployee(createDto).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err);
          this.loading = false;
        }
      });
    }
  }

  /**
   * Xử lý lỗi từ backend và hiển thị theo từng field
   */
  private handleError(err: HttpErrorResponse) {
    this.fieldErrors = {};
    
    if (err.status === 400 && err.error?.validationErrors) {
      // Lỗi validation từ backend - hiển thị theo từng field
      this.fieldErrors = err.error.validationErrors;
      this.error = 'Please fix the validation errors below';
    } else if (err.status === 400 && err.error?.message) {
      // Lỗi business logic (ví dụ: email đã tồn tại)
      this.error = err.error.message;
    } else if (err.status === 403) {
      this.error = 'Access denied: Only admin users can create employees';
    } else if (err.status === 409) {
      // Conflict - email đã tồn tại
      this.error = err.error?.message || 'Email already exists';
      this.fieldErrors['email'] = ['Email already exists'];
    } else {
      this.error = err.error?.message || 'An error occurred. Please try again.';
    }
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}


