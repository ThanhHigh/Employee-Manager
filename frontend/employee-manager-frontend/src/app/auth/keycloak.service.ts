import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak from 'keycloak-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: Keycloak | null = null;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      this.keycloak = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      });
    }
  }

  init(): Promise<boolean> {
    if (!this.isBrowser || !this.keycloak) {
      console.warn('Keycloak init skipped - not in browser or keycloak is null');
      return Promise.resolve(false);
    }
    try {
      console.log('Initializing Keycloak with config:', {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      });
      
      return this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        redirectUri: window.location.origin + '/',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      }).then((authenticated) => {
        console.log('Keycloak initialized. Authenticated:', authenticated);
        console.log('Token:', this.keycloak?.token ? 'EXISTS' : 'MISSING');
        return authenticated;
      }).catch((error) => {
        console.error('Keycloak initialization error:', error);
        // Return false to allow app to continue loading even if Keycloak fails
        return false;
      });
    } catch (error) {
      console.error('Keycloak initialization error:', error);
      return Promise.resolve(false);
    }
  }

  getInstance(): Keycloak | null {
    return this.keycloak;
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  isAuthenticated(): boolean {
    return this.keycloak?.authenticated ?? false;
  }

  logout(): void {
    if (this.keycloak) {
      this.keycloak.logout();
    }
  }

  getRoles(): string[] {
    if (this.keycloak?.tokenParsed) {
      // console.log('Token parsed:', this.keycloak.tokenParsed);
      const realmAccess = (this.keycloak.tokenParsed as any).realm_access;
      return realmAccess?.roles || [];
    }
    return [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('hr_admin');
  }

  isManager(): boolean {
    return this.hasRole('hr_manager');
  }

  isStaff(): boolean {
    return this.hasRole('hr_staff');
  }

  isUser(): boolean {
    return this.hasRole('role_user');
  }
}

