import { authClient } from './auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured.');
}

export const apiRequest = async (endpoint, { auth = true, headers = {}, ...options } = {}) => {
  const requestHeaders = new Headers(headers);

  // Automatically retrieve and attach JWT
  if (auth) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(error?.message || 'Authentication required. Please log in.');
    }

    requestHeaders.set('Authorization', `Bearer ${data.token}`);
  }

  // Automatically handle JSON request bodies
  if (options.body && !(options.body instanceof FormData) && typeof options.body !== 'string') {
    requestHeaders.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(
    `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
    {
      ...options,
      headers: requestHeaders,
    }
  );

  // Handle empty responses
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong.');

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};
