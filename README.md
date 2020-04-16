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
import { Auth0Provider } from '@rturnq/solid-auth0';

() => {
  return (
    <Auth0Provider
      domain="..." // domain from Auth0
      clientId="..." // client_id from Auth0
      audience="..." // audience from Auth0
      logoutRedirectUri="..." // URI Auth0 logout will redirect back to
      loginRedirectUri="..." // URI Auth0 login will redirect back to
    >
      <MyApp />
    </Auth0Provider>
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
Access the auth context provided by the `<Auth0Provider>` component.

```typescript
useAuth0(): Auth0

interface Auth0 {
  // Signal indicating if the Auth0 client is being initialized.
  // Note: while the client is being initialized:
  //  - `isAuthenticated` will be false
  //  - `user`and `appState` and `auth0Client` will be undefined
  //  - Calling the login or logout actions will throw an exception
  isInitialized: () => boolean;

  // Signal indicating if the user is authenticated
  isAuthenticated: () => boolean;

  // Signal containing the user object when authenticated or undefined when not
  // authenticated
  user: () => any;

  // Signal containing the app state object from Auth0 when authenticated or
  // undefined when not authenticated
  appState: () => any;

  // Action to login using a Auth0's universal login page then redirect to the
  // login URI configured in the provider
  loginWithRedirect: (options?: RedirectLoginOptions) => void;

  // Action to log the user out and redirect to the logout URI configured in
  // the provider
  logout: (options?: LogoutOptions) => void;

  // Signal containing the Auth0 client provided by @auth0/auth0-spa-js
  auth0Client: () => Auth0Client
}
```

## Components

### \<Auth0Provider>
Wraps your applcation with the AUth0 context

```typescript
interface Props {
  // Domain as configured in Auth0
  domain: string;
  
  // Audience as configured in Auth0
  audience: string;

  // Client_Id as configured in Auth0
  clientId: string;

  // URI Auth0 will redirect to after successfully logging in
  loginRedirectUri: string;

  // URI Auth0 will redirect to after logging out
  logoutRedirectUri: string;

  // Provide a way to get the current URL. Used for checking if the current URL
  // represents a login callback. By default this is impleted using `window
  // location.href and exposed to isolate browser API dependencies.
  getUrl?: () => string;

  // Callback called when Auth0 redirects the user back to your application.
  // Auth0 includes a query string containing `state` and `code`. Normally you
  // want to redirect to a route without the query string. By default this this
  // is implemented with `history.replace` and is exposed to isolate browser
  // API dependencies and give you and integration point to your router.
  onLoginCallback?: (appState: any, loginRedirectUri: string) => void;

  // Callback called when the user is authenticated. This is a great place to
  // do things like set auth tokens for APIs.
  onAuthenticated?: (auth0Client: Auth0Client, user: any, appState: any) => void;
  
  // Children
  children: JSX.Children;
}
```
