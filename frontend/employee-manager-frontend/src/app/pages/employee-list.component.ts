import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px;">
      <h2>Employee Directory</h2>
      <div style="margin-bottom: 20px;">
        <input [(ngModel)]="newEmployee.name" placeholder="Name">
        <input [(ngModel)]="newEmployee.department" placeholder="Department">
        <input [(ngModel)]="newEmployee.email" placeholder="Email">
        <button (click)="addEmployee()">Add</button>
      </div>
      <ul>
        <li *ngFor="let emp of employees">
          <b>{{ emp.name }}</b> - {{ emp.department }}
          <button (click)="deleteEmployee(emp.id)" style="margin-left:10px; color:red;">X</button>
        </li>
      </ul>
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  newEmployee = { name: '', department: '', email: '' };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() { this.loadEmployees(); }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => this.employees = data);
  }

  addEmployee() {
    this.employeeService.createEmployee(this.newEmployee).subscribe(() => {
      this.loadEmployees();
      this.newEmployee = { name: '', department: '', email: '' };
    });
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(() => this.loadEmployees());
  }
}