import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Signal, 
  TrendingUp, 
  GraduationCap,
  DollarSign,
  Settings,
  RefreshCw,
  CreditCard,
  CheckCircle,
  Clock,
  Users,
  Plus
} from "lucide-react";
import BankConfigModal from "@/components/BankConfigModal";
import TradingEntryForm from "@/components/TradingEntryForm";

// Componente simples para registro de operações
function TradingForm() {
  const [formData, setFormData] = useState({
    pair: '',
    direction: '',
    pips: '',
    profit: ''
  });
  const { toast } = useToast();
  
  // Buscar sinais para mostrar os pares disponíveis
  const { data: signals } = useQuery({
    queryKey: ["/api/signals"],
  });
  
  // Extrair pares únicos dos sinais
  const availablePairs = signals ? Array.from(new Set(signals.map((signal: any) => signal.pair))) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salvar no localStorage
    const userPips = localStorage.getItem('userTotalPips') || '0';
    const newTotalPips = parseInt(userPips) + Math.abs(parseInt(formData.pips || '0'));
    localStorage.setItem('userTotalPips', newTotalPips.toString());
    
    // Salvar operação
    const operations = JSON.parse(localStorage.getItem('userOperations') || '[]');
    operations.push({
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('userOperations', JSON.stringify(operations));
    
    toast({
      title: "Operação Registrada!",
      description: `+${Math.abs(parseInt(formData.pips || '0'))} pips adicionados`,
    });

    setFormData({ pair: '', direction: '', pips: '', profit: '' });
    window.location.reload(); // Força atualização
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="pair" className="text-gray-300">Par</Label>
        <Select value={formData.pair} onValueChange={(value) => setFormData({...formData, pair: value})}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Escolha um par dos sinais" />
          </SelectTrigger>
          <SelectContent>
            {availablePairs.length > 0 && (
              <>
                <SelectItem value="" disabled className="text-gray-400 font-semibold">
                  🎯 Pares dos Sinais Ativos
                </SelectItem>
                {availablePairs.map((pair: string) => (
                  <SelectItem key={`signal-${pair}`} value={pair}>
                    📈 {pair}
                  </SelectItem>
                ))}
                <SelectItem value="" disabled className="text-gray-400 font-semibold">
                  ━━━━━━━━━━━━━━━━
                </SelectItem>
              </>
            )}
            <SelectItem value="" disabled className="text-gray-400 font-semibold">
              💰 Outros Pares Populares
            </SelectItem>
            <SelectItem value="EUR/USD">EUR/USD</SelectItem>
            <SelectItem value="GBP/USD">GBP/USD</SelectItem>
            <SelectItem value="USD/JPY">USD/JPY</SelectItem>
            <SelectItem value="XAU/USD">XAU/USD (Ouro)</SelectItem>
            <SelectItem value="BTC/USD">BTC/USD</SelectItem>
            <SelectItem value="ETH/USD">ETH/USD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="direction" className="text-gray-300">Direção</Label>
        <Select value={formData.direction} onValueChange={(value) => setFormData({...formData, direction: value})}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BUY">BUY</SelectItem>
            <SelectItem value="SELL">SELL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="pips" className="text-gray-300">Pips</Label>
        <Input
          id="pips"
          type="number"
          value={formData.pips}
          onChange={(e) => setFormData({...formData, pips: e.target.value})}
          placeholder="40, 25..."
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="profit" className="text-gray-300">Lucro (R$)</Label>
        <Input
          id="profit"
          type="number"
          step="0.01"
          value={formData.profit}
          onChange={(e) => setFormData({...formData, profit: e.target.value})}
          placeholder="400.00..."
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        <Plus className="h-4 w-4 mr-2" />
        Registrar
      </Button>
    </form>
  );
}

// Componente para mostrar operações recentes
function RecentTrades() {
  const operations = JSON.parse(localStorage.getItem('userOperations') || '[]');
  
  return (
    <div className="space-y-3 max-h-60 overflow-y-auto">
      {operations.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Nenhuma operação registrada</p>
      ) : (
        operations.slice(-5).reverse().map((op: any) => (
          <div key={op.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
            <div>
              <div className="font-medium text-white">{op.pair} {op.direction}</div>
              <div className="text-sm text-gray-400">{op.date}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-400">+{op.pips} pips</div>
              <div className="text-sm text-green-400">R$ +{op.profit}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Dados das estatísticas
  const { data: stats = {}, error: statsError } = useQuery({
    queryKey: ["/api/stats", refreshKey],
    refetchInterval: 2000,
    retry: 1,
    onError: (error) => {
      console.error('Erro na API de stats:', error);
    },
    onSuccess: (data) => {
      console.log('Stats recebidas:', data);
    }
  });

  // Dados dos sinais
  const { data: signals = [] } = useQuery({
    queryKey: ["/api/signals", refreshKey],
    refetchInterval: 30000,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload();
  };

  // Função para obter dados da banca (localStorage + usuário)
  const getBankData = () => {
    const storedConfig = localStorage.getItem('bankConfig');
    const bankConfig = storedConfig ? JSON.parse(storedConfig) : null;
    
    return {
      initialBalance: parseFloat(bankConfig?.initialBalance || user?.initialBalance || "2000"),
      currentBalance: parseFloat(bankConfig?.currentBalance || user?.currentBalance || bankConfig?.initialBalance || user?.initialBalance || "2000"),
      monthlyGoal: parseFloat(bankConfig?.monthlyGoal || user?.monthlyGoal || "800"),
      isConfigured: !!(bankConfig || user?.initialBalance)
    };
  };

  const bankData = getBankData();
  const profit = bankData.currentBalance - bankData.initialBalance;
  const progressPercentage = bankData.monthlyGoal > 0 ? (profit / bankData.monthlyGoal) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard TradeSignal Pro
            </h1>
            <p className="text-gray-300">
              Bem-vindo de volta, {user?.firstName || "Trader"}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <Button 
                onClick={() => window.location.href = '/admin'}
                variant="outline" 
                size="sm"
                className="bg-purple-600/20 border-purple-400/30 text-purple-300 hover:bg-purple-600/40"
              >
                <Settings className="h-4 w-4 mr-2" />
                Painel Admin
              </Button>
            )}
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinatura</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Cards de estatísticas */}
              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total de Pips</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {(parseInt(localStorage.getItem('userTotalPips') || '0') + 130)}
                  </div>
                  <p className="text-xs text-gray-400">
                    {localStorage.getItem('userTotalPips') || 0} suas + 130 sinais
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Sinais Ativos</CardTitle>
                  <Signal className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.activeSignals || 0}</div>
                  <p className="text-xs text-gray-400">Sinais em andamento</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Taxa de Acerto</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.winRate || 87}%</div>
                  <p className="text-xs text-gray-400">
                    {stats?.winningSignals || 0} de {stats?.closedSignals || 0} sinais
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Aulas Concluídas</CardTitle>
                  <GraduationCap className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.completedLessons || 0}</div>
                  <p className="text-xs text-gray-400">De {stats?.totalLessons || 0} disponíveis</p>
                </CardContent>
              </Card>
            </div>

            {/* Seção de acompanhamento de banca */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Acompanhamento da Banca
                    <BankConfigModal user={user}>
                      <Button variant="ghost" size="sm" className="ml-auto text-gray-400 hover:text-white">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </BankConfigModal>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progresso visual */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">
                        {bankData.isConfigured ? "Progresso da Meta" : "Progresso (Configure sua banca)"}
                      </span>
                      <span className="text-2xl font-bold text-green-400">
                        R$ {profit.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-white/20 rounded-full h-4 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-4 rounded-full shadow-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                        style={{ 
                          width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` 
                        }}
                      >
                        {progressPercentage > 0 && (
                          <span className="text-xs font-bold text-white">
                            {Math.round(progressPercentage)}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>R$ {bankData.initialBalance.toFixed(2)}</span>
                      <span>Meta: R$ {(bankData.initialBalance + bankData.monthlyGoal).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Métricas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-400">
                        R$ {bankData.currentBalance.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {bankData.isConfigured ? "Banca Atual" : "Banca (exemplo)"}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-purple-400">
                        R$ {bankData.monthlyGoal.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {bankData.isConfigured ? "Meta Mensal" : "Meta (exemplo)"}
                      </div>
                    </div>
                  </div>

                  {!bankData.isConfigured && (
                    <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                      <div className="text-center">
                        <h4 className="text-sm font-semibold text-blue-300 mb-1">
                          🎯 Configure sua Banca Real
                        </h4>
                        <p className="text-xs text-blue-200 mb-3">
                          Defina valores reais para acompanhar seu progresso
                        </p>
                        <BankConfigModal user={user}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Settings className="h-4 w-4 mr-2" />
                            Configurar Agora
                          </Button>
                        </BankConfigModal>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sinais recentes */}
              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Sinais Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {signals?.slice(0, 4)?.map((signal: any) => (
                      <div key={signal.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{signal.pair}</div>
                          <div className="text-sm text-gray-400">{signal.direction}</div>
                        </div>
                        <Badge 
                          variant={signal.status === 'active' ? 'default' : 'secondary'}
                          className={signal.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                        >
                          {signal.status === 'active' ? 'Ativo' : 'Fechado'}
                        </Badge>
                      </div>
                    )) || (
                      <div className="text-center text-gray-400 py-4">
                        Nenhum sinal disponível
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5" />
                  Minha Assinatura Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {user?.subscriptionPlan?.toUpperCase() || 'FREE'}
                        </h3>
                        <p className="text-gray-300">
                          Status: {user?.subscriptionStatus === 'active' ? 'Ativo' : 'Inativo'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">R$ 97,00</div>
                      <div className="text-sm text-gray-400">/ mês</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário Simplificado */}
              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Registrar Nova Operação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TradingForm />
                </CardContent>
              </Card>

              {/* Operações Recentes */}
              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Operações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentTrades />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}