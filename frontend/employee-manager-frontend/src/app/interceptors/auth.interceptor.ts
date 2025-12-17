import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from '../auth/keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  const token = keycloakService.getToken();

  console.log('Auth Interceptor - URL:', req.url);
  console.log('Auth Interceptor - Token:', token ? 'EXISTS (length: ' + token.length + ')' : 'MISSING');
  console.log('Auth Interceptor - Authenticated:', keycloakService.isAuthenticated());

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  console.warn('No token available for request:', req.url);
  return next(req);
};


