import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem('token');
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
            localStorage.removeItem('token');
            setLocation('/');
          }
          return null;
        }

        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        setLocation('/');
        return null;
      }
    },
    retry: 1,
    staleTime: 1000, // 1 segundo para atualizar rapidamente após mudanças
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5000, // Revalida a cada 5 segundos
  });

  const logout = async () => {
    try {
      // Primeiro faz a chamada para o servidor
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer logout no servidor');
      }

      // Depois limpa os dados locais
      localStorage.removeItem('token');
      
      // Limpa o cache do React Query
      await queryClient.clear();
      
      // Invalida a query do usuário especificamente
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Força um reload da página para limpar todo o estado
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpa os dados locais e redireciona
      localStorage.removeItem('token');
      await queryClient.clear();
      window.location.href = '/';
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout
  };
}
