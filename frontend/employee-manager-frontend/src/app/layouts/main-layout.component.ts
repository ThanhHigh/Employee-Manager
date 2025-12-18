import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '../auth/keycloak.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-container">
      <header class="header">
        <div class="header-content">
          <h1>HR System</h1>
          <div class="header-actions">
            <span class="user-info">
              Roles: {{ roles.join(', ') }}
            </span>
            <button (click)="logout()" class="logout-btn">Logout</button>
          </div>
        </div>
      </header>
      <nav class="navbar" *ngIf="showNavbar()">
        <a routerLink="/profile" routerLinkActive="active">My Profile</a>
        <a routerLink="/employees" routerLinkActive="active" *ngIf="canViewEmployees()">Employees</a>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: #eee;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      font-size: 0.9rem;
      color: #666;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .navbar {
      background: #f8f9fa;
      padding: 0.5rem 2rem;
      border-bottom: 1px solid #dee2e6;
    }

    .navbar a {
      display: inline-block;
      padding: 0.5rem 1rem;
      margin-right: 1rem;
      text-decoration: none;
      color: #495057;
      border-radius: 4px 4px 0 0;
    }

    .navbar a:hover,
    .navbar a.active {
      background: white;
      color: #007bff;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  roles: string[] = [];

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit() {
    this.roles = this.keycloakService.getRoles();
  }

  logout() {
    this.keycloakService.logout();
  }

  showNavbar(): boolean {
    return this.keycloakService.isAuthenticated();
  }

  canViewEmployees(): boolean {
    return this.keycloakService.isAdmin() || this.keycloakService.isStaff() || this.keycloakService.isManager();
  }
}


