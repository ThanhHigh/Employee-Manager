import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from '../auth/keycloak.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);

    if (!keycloakService.isAuthenticated()) {
      const keycloakInstance = keycloakService.getInstance();
      if (keycloakInstance && typeof window !== 'undefined') {
        keycloakInstance.login({
          redirectUri: window.location.origin + state.url
        });
      }
      return false;
    }

    const userRoles = keycloakService.getRoles();
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
};

