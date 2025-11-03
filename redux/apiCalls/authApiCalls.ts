// src/store/apiCalls/authApiCalls.ts
import { LoginCredentials, RegisterCredentials, User } from '../slices/authSlice';
import { request } from '@/services/api';
import { authActions } from '../slices/authSlice';
import { tokenStorage } from '@/services/api';
import type { AppDispatch } from '../store';

// Import the toast type from your toast component
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// The type for the toast function that will be passed
type ToastFunction = (toast: Omit<ToastData, 'id'>) => void;

export const registerUser =
  (
    formData: RegisterCredentials,
    setLoading: (value: boolean) => void,
    setValidationErrors: (validationError: any) => void,
    toast: ToastFunction,
    cb?: () => void
  ) =>
  async (dispatch: AppDispatch) => {
    setLoading(true);
    try {
      const res = await request.post(`/auth/register`, formData);

      if (res.status === 201) {
        const { user, token, message } = res.data;

        dispatch(authActions.setLoginUser(user));
        dispatch(authActions.setLoginUserId(user.id));
        dispatch(authActions.setToken(token));
        
        await tokenStorage.setToken(token);

        toast({
          title: 'Registration Successful',
          description: message,
          variant: 'success',
        });

        if (cb) cb();
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setValidationErrors(error.response.data.errors);
          toast({
            title: 'Invalid Credentials',
            description: error.response.data.message,
            variant: 'error',
          });
        } else if (status === 500) {
          toast({
            title: 'Server Error',
            description: error.response.data.message || 'Something went wrong on the server.',
            variant: 'error',
          });
        } else {
          toast({
            title: 'Error',
            description: error.response.data.message || 'An unexpected error occurred.',
            variant: 'error',
          });
        }
      } else {
        toast({
          title: 'Network Error',
          description: error.message,
          variant: 'error',
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

export const loginUser =
  (
    formData: LoginCredentials,
    setLoading: (value: boolean) => void,
    setValidationErrors: (validationError: any) => void,
    toast: ToastFunction,
    cb?: () => void
  ) =>
  async (dispatch: AppDispatch) => {
    setLoading(true);
    try {
      const res = await request.post(`/auth/login`, formData);

      if (res.status === 200 || res.status === 201) {
        const { user, token, message } = res.data;

        dispatch(authActions.setLoginUser(user));
        dispatch(authActions.setLoginUserId(user.id));
        dispatch(authActions.setToken(token));
        
        await tokenStorage.setToken(token);

        toast({
          title: 'Login Successful',
          description: message,
          variant: 'success',
        });

        if (cb) cb();
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setValidationErrors(error.response.data.errors);
          toast({
            title: 'Invalid Credentials',
            description: error.response.data.message,
            variant: 'error',
          });
        } else if (status === 500) {
          toast({
            title: 'Server Error',
            description: error.response.data.message || 'Something went wrong on the server.',
            variant: 'error',
          });
        } else {
          toast({
            title: 'Error',
            description: error.response.data.message || 'An unexpected error occurred.',
            variant: 'error',
          });
        }
      } else {
        toast({
          title: 'Network Error',
          description: error.message,
          variant: 'error',
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

export const getCurrentUser =
  (
    setLoading: (value: boolean) => void,
    toast: ToastFunction
  ) =>
  async (dispatch: AppDispatch) => {
    setLoading(true);
    try {
      const res = await request.get("/auth/profile");

      if (res.status === 200) {
        dispatch(authActions.setLoginUser(res.data.user));
      }
    } catch (error: any) {
      dispatch(authActions.setLoginUser(null));

      if (!error.response) {
        toast({
          title: 'Network Error',
          description: 'Please check your internet connection and try again.',
          variant: 'error',
        });
      } else {
        toast({
          title: 'Authentication Error',
          description: error.response.data?.message || 'Failed to fetch current user.',
          variant: 'error',
        });

        dispatch(authActions.setLoginUser(null));
      }

      console.error("Fetch current user error:", error);
    } finally {
      setLoading(false);
    }
  };

export const logoutUser =
  (
    toast: ToastFunction,
    setModalOpen?: (value: boolean) => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      await request.post("/auth/logout", {});
    } catch (error: any) {
      if (!error.response) {
        toast({
          title: 'Network Error',
          description: 'Please check your internet connection and try again.',
          variant: 'error',
        });
      } else {
        toast({
          title: 'Logout Error',
          description: error.response.data?.message || 'Failed to log out.',
          variant: 'error',
        });
      }
      console.error("Logout error:", error);
    } finally {
      dispatch(authActions.logout());
      await tokenStorage.clearTokens();
      
      if (setModalOpen) {
        setModalOpen(false);
      }

      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
        variant: 'success',
      });
    }
  };

export const forgotPassword =
  (
    formData: { email: string },
    setLoading: (value: boolean) => void,
    setValidationErrors: (validationError: any) => void,
    toast: ToastFunction,
    cb?: () => void
  ) =>
  async (dispatch: AppDispatch) => {
    setLoading(true);

    try {
      const res = await request.post("/auth/forgot-password", formData);

      if (res.status === 200) {
        toast({
          title: 'Email Sent',
          description: res.data.message,
          variant: 'success',
        });
        if (cb) cb();
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          setValidationErrors(error.response.data.errors);
          toast({
            title: 'Validation Error',
            description: error.response.data.message,
            variant: 'error',
          });
        } else if (status === 404) {
          setValidationErrors(error.response.data.errors);
          toast({
            title: 'Not Found',
            description: error.response.data.message,
            variant: 'error',
          });
        } else if (status === 500) {
          toast({
            title: 'Server Error',
            description: error.response.data.message || 'Something went wrong on the server.',
            variant: 'error',
          });
        } else {
          toast({
            title: 'Error',
            description: error.response.data.message || 'An unexpected error occurred.',
            variant: 'error',
          });
        }
      } else {
        toast({
          title: 'Network Error',
          description: error.message,
          variant: 'error',
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };