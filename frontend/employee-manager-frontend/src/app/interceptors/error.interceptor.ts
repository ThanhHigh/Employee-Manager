import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { KeycloakService } from '../auth/keycloak.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const keycloakService = inject(KeycloakService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        const keycloakInstance = keycloakService.getInstance();
        if (keycloakInstance && typeof window !== 'undefined') {
          keycloakInstance.login({
            redirectUri: window.location.origin + router.url
          });
        }
      } else if (error.status === 403) {
        // Forbidden - redirect to home
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};

