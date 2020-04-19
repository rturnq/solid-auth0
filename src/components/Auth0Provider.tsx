import createAuth0Client, { Auth0Client } from '@auth0/auth0-spa-js';
import { createResource } from 'solid-js';
import { Auth0Context } from '../auth0Context';

export interface Props {
  children: JSX.Children;
  domain: string;
  audience: string;
  clientId: string;
  loginRedirectUri: string;
  logoutRedirectUri: string;
  getUrl?: () => string;
  onLoginCallback?: (appState: any, loginRedirectUri: string) => void;
  onAuthenticated?: (auth0Client: Auth0Client, user: any, appState: any) => void;
}

function isRedirectCallback(url: string) {
  const [, queryString] = url.split('?');
  return queryString && queryString.includes('code=') && queryString.includes('state=');
}

function defaultGetUrl() {
  return window.location.href;
}

function defaultHandleRedirectCallback(_appState: any, loginRedirectUri: string) {
  history.replaceState(undefined, '', loginRedirectUri);
}

export default (props: Props) => {
  const [auth0Client, init] = createResource<Auth0Client>();
  let isAuthenticated = false;
  let user: any;
  let appState: any;
  let isInitializing = init(
    createAuth0Client({
      domain: props.domain,
      client_id: props.clientId,
      audience: props.audience,
      redirect_uri: props.loginRedirectUri
    }).then(async (auth0Client) => {
      const url = (props.getUrl || defaultGetUrl)();
      if (isRedirectCallback(url)) {
        const result = await auth0Client.handleRedirectCallback(url);
        appState = result.appState;
        (props.onLoginCallback || defaultHandleRedirectCallback)(appState, props.loginRedirectUri);
      }

      isAuthenticated = await auth0Client.isAuthenticated();

      if (isAuthenticated) {
        user = await auth0Client.getUser();
        props.onAuthenticated && props.onAuthenticated(auth0Client, user, appState);
      }


      return auth0Client;
    })
  );

  return (
    <Auth0Context.Provider
      value={{
        isInitialized: () => !isInitializing(),
        isAuthenticated: () => isAuthenticated,
        user: () => user,
        appState: () => appState,
        loginWithRedirect: (options = {}) => {
          auth0Client()!.loginWithRedirect({
            redirect_uri: props.loginRedirectUri,
            ...options
          });
        },
        logout: (options = {}) => {
          auth0Client()!.logout({
            returnTo: props.logoutRedirectUri,
            ...options
          });
        },
        auth0Client: () => auth0Client()!
      }}
    >
      {props.children}
    </Auth0Context.Provider>
  );
};
