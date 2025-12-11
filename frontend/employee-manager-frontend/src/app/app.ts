import { Component, signal } from '@angular/core';
import { EmployeeListComponent } from './pages/employee-list.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeListComponent, HttpClientModule],
  template: `
    <div style="background:#eee; padding:10px; display:flex; justify-content:space-between;">
      <h1>HR System</h1>
      <button (click)="logout?.()">Logout</button>
    </div>
    <app-employee-list></app-employee-list>
  `,
  styleUrls: ['./app.css']
})
export class App {
  // keep a title signal in case templates use it later
  protected readonly title = signal('employee-manager-frontend');

  // Keycloak may not be available at this layer; call if present
  logout?(): void {}
}
