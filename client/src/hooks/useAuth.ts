import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        return null;
      }

      try {
        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('auth-token');
          }
          return null;
        }

        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('auth-token');
        return null;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const logout = async () => {
    // Clear local storage immediately
    localStorage.removeItem('auth-token');
    
    // Clear React Query cache
    queryClient.clear();
    
    // Force immediate redirect to login page
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout
  };
}
