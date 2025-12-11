import Keycloak from 'keycloak-js';

export function initializeKeycloak(keycloak: Keycloak) {
  return () =>
    keycloak.init({
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
    });
}