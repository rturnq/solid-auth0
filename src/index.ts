export { default as Auth0Provider } from './components/Auth0Provider';
export { Auth0Context, useAuth0 } from './auth0Context';
export * from './types';

// Workaround for Babel being unable to re-export types
import * as Auth0Provider from './components/Auth0Provider';
export type Auth0ProviderProps = Auth0Provider.Props;
