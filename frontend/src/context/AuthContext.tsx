import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Admin, AuthResponse } from '../types';
import api from '../utils/api';

interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { admin: Admin; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  admin: null,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload.admin,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const adminData = localStorage.getItem('admin');

      if (token && adminData) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const response = await api.get('/auth/me');
          
          if (response.data.admin) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                admin: response.data.admin,
                token,
              },
            });
          } else {
            // Invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
          }
        } catch (error) {
          // Token is invalid
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { token, admin } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { admin, token },
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message,
      });
      throw new Error(message);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
