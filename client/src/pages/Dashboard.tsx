import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import BankConfigModal from "@/components/BankConfigModal";
import TradingEntryForm from "@/components/TradingEntryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Signal, 
  Percent, 
  GraduationCap,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  DollarSign,
  Target,
  Settings
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/admin"],
    staleTime: 0, // Always get fresh data
    gcTime: 0, // Don't cache (updated property name)
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

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="subscriptions">Minhas Assinaturas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      +{stats?.totalPips || 0} pips
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                      <ArrowUp className="h-3 w-3 text-green-500" />
                      <span>+12% desde o mês passado</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sinais Ativos</CardTitle>
                    <Signal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.activeSignals || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sinais em andamento
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.winRate || 0}%
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                      <ArrowUp className="h-3 w-3 text-green-500" />
                      <span>+2% esta semana</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aulas Concluídas</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats?.completedLessons || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      de 24 disponíveis
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Signals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sinais Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {signalsLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                  <div className="space-y-2">
                                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-32 bg-gray-300 rounded"></div>
                                  </div>
                                </div>
                                <div className="h-6 w-16 bg-gray-300 rounded"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentSignals.map((signal: any) => (
                            <div key={signal.id} className="flex items-center justify-between">
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
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progresso Mensal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Progresso da Banca</h3>
                        <div className="flex gap-2">
                          <BankConfigModal user={user}>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </BankConfigModal>
                          <TradingEntryForm user={user}>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              + Operação
                            </Button>
                          </TradingEntryForm>
                        </div>
                      </div>
                      
                      {/* Debug: Mostrar valores atuais */}
                      <div className="mb-4 p-2 bg-yellow-100 text-xs rounded">
                        Debug - Banca: {user?.initialBalance || 'undefined'} | Meta: {user?.monthlyGoal || 'undefined'}
                      </div>
                      
                      {user?.initialBalance && user?.monthlyGoal ? (
                        <>
                          {/* Progresso Principal */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Progresso da Meta</span>
                              <span className="text-2xl font-bold text-green-600">
                                R$ {((parseFloat(user?.currentBalance || user?.initialBalance) || parseFloat(user?.initialBalance)) - parseFloat(user?.initialBalance)).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="w-full bg-white/50 rounded-full h-4 shadow-inner">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-emerald-400 h-4 rounded-full shadow-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                                style={{ 
                                  width: `${Math.min(
                                    Math.max(
                                      ((parseFloat(user?.currentBalance || user?.initialBalance) || parseFloat(user?.initialBalance)) - parseFloat(user?.initialBalance)) / parseFloat(user?.monthlyGoal) * 100, 
                                      0
                                    ), 
                                    100
                                  )}%` 
                                }}
                              >
                                {((parseFloat(user?.currentBalance || user?.initialBalance) || parseFloat(user?.initialBalance)) - parseFloat(user?.initialBalance)) > 0 && (
                                  <span className="text-xs font-bold text-white">
                                    {Math.round(((parseFloat(user?.currentBalance || user?.initialBalance) || parseFloat(user?.initialBalance)) - parseFloat(user?.initialBalance)) / parseFloat(user?.monthlyGoal) * 100)}%
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                              <span>R$ {parseFloat(user?.initialBalance).toFixed(2)}</span>
                              <span>Meta: R$ {(parseFloat(user?.initialBalance) + parseFloat(user?.monthlyGoal)).toFixed(2)}</span>
                            </div>
                          </div>
                          
                          {/* Métricas do Mês */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/60 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-blue-600">R$ {(parseFloat(user?.currentBalance || user?.initialBalance) || parseFloat(user?.initialBalance)).toFixed(2)}</div>
                              <div className="text-xs text-gray-600">Banca Atual</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-purple-600">R$ {parseFloat(user?.monthlyGoal).toFixed(2)}</div>
                              <div className="text-xs text-gray-600">Meta Mensal</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Configure sua Banca</h3>
                          <p className="text-gray-600 mb-4">
                            Defina sua banca inicial e meta mensal para acompanhar seu progresso personalizado.
                          </p>
                          <BankConfigModal user={user}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <Settings className="h-4 w-4 mr-2" />
                              Configurar Agora
                            </Button>
                          </BankConfigModal>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Minha Assinatura Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Premium</h3>
                          <p className="text-gray-600">R$ 97,00 / mês</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Ativo</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Próxima cobrança</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 mt-1">24 Jun 2025</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Signal className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Sinais por semana</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 mt-1">84 sinais</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Dias restantes</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 mt-1">30 dias</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-2">Benefícios inclusos:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">12 sinais por dia</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Análises detalhadas</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Suporte prioritário</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Acesso educacional</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Suporte WhatsApp</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Relatórios detalhados</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex space-x-3">
                        <Button variant="outline" className="flex-1">
                          Alterar Plano
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Cancelar Assinatura
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Pagamentos */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Plano Premium</p>
                        <p className="text-sm text-gray-600">24 Mai 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ 97,00</p>
                        <Badge variant="secondary" className="text-xs">Pago</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Plano Premium</p>
                        <p className="text-sm text-gray-600">24 Abr 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ 97,00</p>
                        <Badge variant="secondary" className="text-xs">Pago</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}