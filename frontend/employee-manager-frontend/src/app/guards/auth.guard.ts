import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from '../auth/keycloak.service';

export const authGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return true; // Allow during SSR
  }

  if (keycloakService.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  const keycloakInstance = keycloakService.getInstance();
  if (keycloakInstance) {
    try {
      keycloakInstance.login({
        redirectUri: window.location.origin + state.url
      });
    } catch (error) {
      console.error('Keycloak login error:', error);
      // If Keycloak is not available, allow access (for development)
      // In production, you might want to show an error page
      return true;
    }
  } else {
    // If Keycloak instance is not available, allow access (for development)
    console.warn('Keycloak instance not available. Allowing access for development.');
    return true;
  }
  return false;
};

