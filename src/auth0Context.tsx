import { createContext, useContext } from 'solid-js';
import { Auth0 } from './types';

export const Auth0Context = createContext<Auth0>();

export const useAuth0 = () => useContext(Auth0Context);