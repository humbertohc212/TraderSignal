import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading } = useQuery({
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
    try {
      // Limpar token do localStorage
      localStorage.removeItem('auth-token');
      
      // Fazer request para limpar cookie no servidor
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Atualizar o estado forçando um refetch
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo com erro, limpar localmente e redirecionar
      localStorage.removeItem('auth-token');
      window.location.href = '/';
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
