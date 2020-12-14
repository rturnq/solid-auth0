import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import {
  createContext,
  useContext,
  createResource,
  createSignal,
  JSX
} from 'solid-js';
import { assignProps } from 'solid-js/web';
import { Auth0State } from './types';

export const Auth0Context = createContext<Auth0State>();
export const useAuth0 = () => useContext(Auth0Context);

export interface Auth0Props {
  children: JSX.Element;
  domain: string;
  audience: string;
  clientId: string;
  loginRedirectUri: string;
  logoutRedirectUri: string;
  getUrl?: () => string;
  onLoginCallback?: (appState: any, loginRedirectUri: string) => void;
}

export function Auth0(props: Auth0Props) {
  props = assignProps(
    {},
    {
      onLoginCallback: onLoginCallback,
      getUrl: getUrl
    },
    props
  );
  const [auth0Client, init] = createResource<Auth0Client>();
  const [isAuthenticated, setIsAuthenticated] = createSignal<boolean | undefined>(undefined);
  const [user, setUser] = createSignal();
  const auth0ClientPromise = createAuth0Client({
    domain: props.domain,
    client_id: props.clientId,
    audience: props.audience,
    redirect_uri: props.loginRedirectUri
  });

  init(async () => {
    const client = await auth0ClientPromise;
    const url = props.getUrl!();

    if (isRedirectCallback(url)) {
      const { appState } = await client.handleRedirectCallback(url);
      props.onLoginCallback!(appState, props.loginRedirectUri);
    }
    if (setIsAuthenticated(await client.isAuthenticated())) {
      setUser(await client.getUser());
    }

    return client;
  });
  return (
    <Auth0Context.Provider
      value={{
        auth0Client,
        isInitialized: () => isAuthenticated() !== undefined,
        isAuthenticated: () => !!isAuthenticated(),
        user,
        loginWithRedirect(options?: RedirectLoginOptions) {
          return auth0ClientPromise.then((client) =>
            client.loginWithRedirect({
              redirect_uri: props.loginRedirectUri,
              ...options
            })
          );
        },
        logout(options?: LogoutOptions) {
          return auth0ClientPromise.then((client) =>
            client.logout({
              returnTo: props.logoutRedirectUri,
              ...options
            })
          );
        },
        getToken() {
          return auth0ClientPromise.then((client) => client.getTokenSilently());
        }
      }}
    >
      {props.children}
    </Auth0Context.Provider>
  );
}

function isRedirectCallback(url: string) {
  const [, query] = url.split('?');
  return query && query.includes('code=') && query.includes('state=');
}

function getUrl() {
  return window.location.href;
}

function onLoginCallback(_appState: any, loginRedirectUri: string) {
  window.history.replaceState(undefined, '', loginRedirectUri);
}
