import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

export interface Auth0 {
  isInitialized: () => boolean;
  isAuthenticated: () => boolean;
  user: () => any;
  appState: () => any;
  loginWithRedirect: (options?: RedirectLoginOptions) => void;
  logout: (options?: LogoutOptions) => void;
  auth0Client: () => Auth0Client;
}
