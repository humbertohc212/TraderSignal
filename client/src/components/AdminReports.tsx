import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Users,
  Signal,
  BookOpen,
  DollarSign,
  ArrowUp,
  TrendingUp,
  Percent,
  Download
} from "lucide-react";

export default function AdminReports() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: userStats } = useQuery({
    queryKey: ["/api/admin/reports/users"],
    enabled: user?.role === "admin"
  });

  const { data: signalStats } = useQuery({
    queryKey: ["/api/admin/reports/signals"],
    enabled: user?.role === "admin"
  });

  const { data: revenueStats } = useQuery({
    queryKey: ["/api/admin/reports/revenue"],
    enabled: user?.role === "admin"
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 mb-4">
            Você não tem permissão para acessar esta página.
          </p>
          <Button onClick={() => setLocation("/")}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  const exportReport = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export-${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-export.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Relatórios Administrativos
          </h1>
          <p className="mt-2 text-gray-600">
            Análise detalhada das métricas do sistema
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => exportReport('users')}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Usuários</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => exportReport('signals')}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Sinais</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Usuários</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userStats?.totalUsers || 0}
                </p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {userStats?.newUsers || 0} novos (30 dias)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <Signal className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taxa de Acerto</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {signalStats?.winRate?.toFixed(1) || 0}%
                </p>
                <p className="text-sm text-gray-600">
                  {signalStats?.winningSignals || 0} de {signalStats?.closedSignals || 0} sinais
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Receita Mensal</p>
                <p className="text-2xl font-semibold text-gray-900">
                  R$ {revenueStats?.monthlyRevenue?.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm text-gray-600">
                  {revenueStats?.activeSubscriptions || 0} assinaturas ativas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <Percent className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {revenueStats?.conversionRate?.toFixed(1) || 0}%
                </p>
                <p className="text-sm text-gray-600">
                  Usuários que assinaram
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Distribuição de Usuários por Plano</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats?.usersByPlan && Object.entries(userStats.usersByPlan).map(([plan, count]: [string, any]) => (
                <div key={plan} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{plan}</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                      <div 
                        className={`h-2 rounded-full ${
                          plan === 'Básico' ? 'bg-blue-400' :
                          plan === 'Premium' ? 'bg-purple-400' :
                          plan === 'VIP' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}
                        style={{ 
                          width: `${userStats.totalUsers ? (count / userStats.totalUsers) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance dos Sinais</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  R$ {signalStats?.totalProfit?.toFixed(2) || "0.00"}
                </div>
                <p className="text-sm text-gray-600">Lucro Total Acumulado</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {signalStats?.winningSignals || 0}
                  </div>
                  <p className="text-sm text-gray-600">Sinais Vencedores</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {(signalStats?.closedSignals || 0) - (signalStats?.winningSignals || 0)}
                  </div>
                  <p className="text-sm text-gray-600">Sinais Perdedores</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sinais Ativos</span>
                  <span>{signalStats?.activeSignals || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total de Sinais</span>
                  <span>{signalStats?.totalSignals || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Análise de Receita</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                R$ {revenueStats?.monthlyRevenue?.toFixed(2) || "0.00"}
              </div>
              <p className="text-sm text-gray-600">Receita Mensal</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                R$ {revenueStats?.averageRevenuePerUser?.toFixed(2) || "0.00"}
              </div>
              <p className="text-sm text-gray-600">Receita Média por Usuário</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {revenueStats?.activeSubscriptions || 0}
              </div>
              <p className="text-sm text-gray-600">Assinaturas Ativas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}