// Custom hooks for API calls

import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient.js';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>(asyncFunction: () => Promise<any>, immediate = true) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({
        data: response.data || response,
        loading: false,
        error: null,
      });
      return response.data || response;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  }, [asyncFunction]);

  if (immediate) {
    execute();
  }

  return { ...state, execute };
}

// Specific hooks for common operations
export function useUserProfile() {
  return useApi(() => apiClient.getUserProfile());
}

export function useDestinations() {
  return useApi(() => apiClient.getDestinations());
}

export function useDestination(destinationId: string) {
  return useApi(() => apiClient.getDestination(destinationId));
}

export function useBookings() {
  return useApi(() => apiClient.getBookings());
}

export function useUserConversations() {
  return useApi(() => apiClient.getUserConversations());
}
