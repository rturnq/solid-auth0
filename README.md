# solid-auth0

Auth0 integration for [solid-js](https://github.com/ryansolid/solid) which wraps `@auth0/auth0-spa-js`

## Getting Started

### Installation

```
> npm i @rturnq/solid-auth0
```

### Usage

Wrap the root of you application with the provider element

```tsx
import { Auth0 } from '@rturnq/solid-auth0';

() => {
  return (
    <Auth0
      domain="..." // domain from Auth0
      clientId="..." // client_id from Auth0
      audience="..." // audience from Auth0
      logoutRedirectUri={`${window.location.origin}/logout`} // Absolute URI Auth0 logout redirect
      loginRedirectUri={`${window.location.origin}/`} // Absolute URI Auth0 login
    >
      <MyApp />
    </Auth0>
  )
}
```

Access the auth context elsewhere in your application

```tsx
import { useAuth0 } from '@rturn/solid-auth0';

() => {
  const auth = useAuth0();

  return (
    // ...
  )
}
```


## API

### useAuth0
Access the auth context provided by the `<Auth0>` component.

```typescript
useAuth0(): Auth0

interface Auth0 {
  // Signal containing the Auth0 client provided by @auth0/auth0-spa-js. Will be undefined until it
  // finishes initializing and checking authentication status.
  auth0Client: () => Auth0Client | undefined

  // Signal indicating if the Auth0 client is being initialized.
  isInitialized: () => boolean;

  // Signal indicating if the user is authenticated
  isAuthenticated: () => boolean;

  // Signal containing the user object when authenticated or undefined when not authenticated
  user: () => any;

  // Action to login using a Auth0's universal login page then redirect to the login URI configured
  // in the provider
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;

  // Action to log the user out and redirect to the logout URI configured in the provider
  logout: (options?: LogoutOptions) => Primise<void>;

  // Get an auth token using they client's `getTokenSilently` method. Note, this method can be
  // called before the client is initialized and it will wait for it to initialize.
  getToken(): Promise<string>;
}
```

## Components

### \<Auth0>
Wraps your applcation with the Auth0 context

```typescript
interface Props {
  // Domain as configured in Auth0
  domain: string;
  
  // Audience as configured in Auth0
  audience: string;

  // Client_Id as configured in Auth0
  clientId: string;

  // Absolute URI Auth0 will redirect to after successfully logging in
  loginRedirectUri: string;

  // Absolute URI Auth0 will redirect to after logging out
  logoutRedirectUri: string;

  // Provide a way to get the current URL. Used for checking if the current URL represents a login
  // callback. By default this is impleted using `window location.href and exposed to isolate
  // browser API dependencies.
  getUrl?: () => string;

  // Callback called when Auth0 redirects the user back to your application. Auth0 includes a query
  // string containing `state` and `code`. Normally you want to redirect to a route without the
  // query string. By default this this is implemented with `window.history.replace` and is exposed
  // to isolate browser API dependencies and give you and integration point to your router.
  onLoginCallback?: (appState: any, loginRedirectUri: string) => void;
  
  // Children
  children: JSX.Children;
}
```
