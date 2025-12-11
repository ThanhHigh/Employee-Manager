import { Component } from '@angular/core';
import Keycloak from 'keycloak-js';
import { EmployeeListComponent } from './pages/employee-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeListComponent],
  template: `
    <div style="background:#eee; padding:10px; display:flex; justify-content:space-between;">
      <h1>HR System</h1>
      <button (click)="logout()">Logout</button>
    </div>
    <app-employee-list></app-employee-list>
  `
})
export class AppComponent {
  constructor(private keycloak: Keycloak) {}
  logout() { this.keycloak.logout(); }
}