import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !!localStorage.getItem('auth-token'), // Only run if token exists
  });

  // Check if token exists but user fetch failed
  const hasToken = !!localStorage.getItem('auth-token');
  
  return {
    user,
    isLoading: hasToken ? isLoading : false,
    isAuthenticated: !!user && hasToken,
    hasToken,
  };
}
