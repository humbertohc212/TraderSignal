import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Signal, 
  Percent, 
  GraduationCap,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/user"],
  });

  const { data: signals, isLoading: signalsLoading } = useQuery({
    queryKey: ["/api/signals"],
  });

  const recentSignals = signals?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Bem-vindo de volta, {user?.firstName || 'Trader'}! Aqui está um resumo da sua atividade.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Lucro Total</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? "..." : `${stats?.totalProfit || 0} pips`}
                    </p>
                    <p className="text-sm text-green-600">
                      <ArrowUp className="h-3 w-3 inline mr-1" />
                      +15.3% este mês
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <Signal className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Sinais Ativos</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? "..." : stats?.activeSignals ?? 1}
                    </p>
                    <p className="text-sm text-gray-600">Em andamento</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                      <Percent className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Taxa de Acerto</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? "..." : `${stats?.winRate || 0}%`}
                    </p>
                    <p className="text-sm text-green-600">
                      <ArrowUp className="h-3 w-3 inline mr-1" />
                      +2% vs. mês anterior
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
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Aulas Concluídas</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? "..." : stats?.completedLessons || 0}
                    </p>
                    <p className="text-sm text-blue-600">Esta semana</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Signals & Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Sinais Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {signalsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSignals.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        Nenhum sinal disponível
                      </p>
                    ) : (
                      recentSignals.map((signal: any) => (
                        <div 
                          key={signal.id} 
                          className={`p-4 rounded-lg border ${
                            signal.status === 'active' 
                              ? 'bg-blue-50 border-blue-200' 
                              : signal.result && parseFloat(signal.result) > 0
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                signal.status === 'active' 
                                  ? 'bg-blue-500 animate-pulse' 
                                  : signal.result && parseFloat(signal.result) > 0
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              }`}></div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {signal.pair} - {signal.direction}
                                </p>
                                <p className="text-sm text-gray-600">
                                  TP: {signal.takeProfitPrice} | SL: {signal.stopLossPrice}
                                </p>
                              </div>
                            </div>
                            <Badge variant={
                              signal.status === 'active' 
                                ? 'default'
                                : signal.result && parseFloat(signal.result) > 0
                                ? 'secondary'
                                : 'destructive'
                            }>
                              {signal.status === 'active' 
                                ? 'Em andamento'
                                : signal.result 
                                ? `${signal.result > 0 ? '+' : ''}${signal.result} pips`
                                : 'Fechado'
                              }
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Gráfico de Performance</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Acompanhe sua evolução mensal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
