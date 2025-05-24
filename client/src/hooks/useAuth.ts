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
    // Always clear local state first
    localStorage.removeItem('auth-token');
    await queryClient.clear();
    
    try {
      // Try to call logout endpoint, but don't fail if it doesn't work
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.log('Logout endpoint failed, but continuing with local cleanup');
    }
    
    // Always redirect to login page
    setLocation('/login');
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout
  };
}
