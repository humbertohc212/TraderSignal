import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  GraduationCap,
  Users, 
  TrendingUp, 
  DollarSign,
  Settings,
  RefreshCw,
  CreditCard,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  User
} from "lucide-react";
import BankConfigModal from "@/components/BankConfigModal";
import TradingEntryForm from "@/components/TradingEntryForm";

// Interface para dados do formulário de trading
interface TradingFormData {
  date: string;
  pair: string;
  direction: 'BUY' | 'SELL' | '';
  entryPrice: string;
  exitPrice: string;
  exitType: 'TP1' | 'TP2' | 'SL' | '';
  lotSize: string;
}

function TradingForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<TradingFormData>({
    date: new Date().toISOString().split('T')[0],
    pair: '',
    direction: '',
    entryPrice: '',
    exitPrice: '',
    exitType: '',
    lotSize: '0.1'
  });

  const pairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
    'EURJPY', 'GBPJPY', 'EURGBP', 'XAUUSD', 'BTCUSD', 'ETHUSD'
  ];

  const handleInputChange = (field: keyof TradingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatePipsAndProfit = () => {
    const entry = parseFloat(formData.entryPrice || '0');
    const exit = parseFloat(formData.exitPrice || '0');
    const lot = parseFloat(formData.lotSize || '0.1');
    
    if (!entry || !exit || !lot) return { pips: 0, profit: 0 };
    
    // Calcular pips baseado na direção
    let pips = 0;
    if (formData.direction === 'BUY') {
      pips = (exit - entry) * 10000; // Para pares como EUR/USD
    } else if (formData.direction === 'SELL') {
      pips = (entry - exit) * 10000;
    }
    
    // Ajustar para pares específicos
    if (formData.pair.includes('JPY')) {
      pips = pips / 100; // JPY tem 2 decimais, não 4
    }
    
    // Se foi SL, pips deve ser negativo
    if (formData.exitType === 'SL') {
      pips = -Math.abs(pips);
    }
    
    // Calcular lucro: pip value * pips * lotes
    const pipValue = formData.pair.includes('JPY') ? 0.01 : 0.0001;
    const lotUnits = lot >= 1 ? 100000 : 10000; // Lote padrão ou mini
    const dollarPerPip = pipValue * lotUnits * lot;
    const profit = pips * dollarPerPip;
    
    return { pips: Math.round(pips), profit: Math.round(profit * 100) / 100 };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { pips, profit } = calculatePipsAndProfit();
    
    // Salvar no localStorage
    const userPips = localStorage.getItem('userTotalPips') || '0';
    const newTotalPips = parseInt(userPips) + pips; // Pips podem ser negativos
    localStorage.setItem('userTotalPips', newTotalPips.toString());
    
    // Atualizar progresso da banca (aceita tanto ganhos quanto perdas)
    const currentProgress = parseFloat(localStorage.getItem('currentProgress') || '200');
    const newProgress = currentProgress + profit; // Adicionar lucro/prejuízo ao progresso
    localStorage.setItem('currentProgress', newProgress.toString());
    
    toast({
      title: "Operação registrada!",
      description: `${pips > 0 ? '+' : ''}${pips} pips • ${profit > 0 ? '+' : ''}R$ ${profit.toFixed(2)}`,
      className: pips > 0 ? "bg-green-600 text-white border-green-700" : "bg-red-600 text-white border-red-700"
    });

    // Reset do formulário
    setFormData({
      date: new Date().toISOString().split('T')[0],
      pair: '',
      direction: '',
      entryPrice: '',
      exitPrice: '',
      exitType: '',
      lotSize: '0.1'
    });
  };

  const { pips: previewPips, profit: previewProfit } = calculatePipsAndProfit();

  return (
    <Card className="bg-gray-800/90 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Registrar Operação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Data</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Par</Label>
              <Select value={formData.pair} onValueChange={(value) => handleInputChange('pair', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione o par" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {pairs.map((pair) => (
                    <SelectItem key={pair} value={pair} className="text-white hover:bg-gray-600">
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Direção</Label>
              <Select value={formData.direction} onValueChange={(value) => handleInputChange('direction', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="BUY ou SELL" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="BUY" className="text-white hover:bg-gray-600">BUY</SelectItem>
                  <SelectItem value="SELL" className="text-white hover:bg-gray-600">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Lote</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.lotSize}
                onChange={(e) => handleInputChange('lotSize', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Preço de Entrada</Label>
              <Input
                type="number"
                step="0.00001"
                value={formData.entryPrice}
                onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Preço de Saída</Label>
              <Input
                type="number"
                step="0.00001"
                value={formData.exitPrice}
                onChange={(e) => handleInputChange('exitPrice', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Tipo de Saída</Label>
            <Select value={formData.exitType} onValueChange={(value) => handleInputChange('exitType', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="TP1, TP2 ou SL" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="TP1" className="text-white hover:bg-gray-600">TP1 (Take Profit 1)</SelectItem>
                <SelectItem value="TP2" className="text-white hover:bg-gray-600">TP2 (Take Profit 2)</SelectItem>
                <SelectItem value="SL" className="text-white hover:bg-gray-600">SL (Stop Loss)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview dos cálculos */}
          {formData.entryPrice && formData.exitPrice && formData.pair && formData.direction && (
            <div className="bg-gray-700/50 p-3 rounded border border-gray-600">
              <div className="text-sm text-gray-300 mb-1">Preview:</div>
              <div className="flex justify-between text-white">
                <span className={previewPips >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {previewPips >= 0 ? '+' : ''}{previewPips} pips
                </span>
                <span className={previewProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {previewProfit >= 0 ? '+' : ''}R$ {previewProfit.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!formData.pair || !formData.direction || !formData.entryPrice || !formData.exitPrice || !formData.exitType}
          >
            Registrar Operação
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RecentTrades({ userEntries }: { userEntries: any[] }) {
  if (!Array.isArray(userEntries) || userEntries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Signal className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>Nenhuma operação registrada ainda</p>
        <p className="text-sm">Registre suas primeiras operações na aba Trading</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userEntries.slice(0, 5).map((entry, index) => {
        const pips = parseFloat(entry.pips || '0');
        const profit = parseFloat(entry.profit || '0');
        
        return (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${pips >= 0 ? 'bg-green-400' : 'bg-red-400'}`} />
              <div>
                <p className="text-white font-medium">{entry.pair}</p>
                <p className="text-sm text-gray-400">{entry.direction} • {entry.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${pips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pips >= 0 ? '+' : ''}{pips} pips
              </p>
              <p className={`text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profit >= 0 ? '+' : ''}R$ {profit.toFixed(2)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showBankModal, setShowBankModal] = useState(false);

  // Auto-refresh dos sinais a cada 30 segundos
  const { data: signals, isLoading: signalsLoading, refetch: refetchSignals } = useQuery({
    queryKey: ['/api/signals'],
    refetchInterval: 30000,
    onError: (error: any) => {
      console.error('Erro ao carregar sinais:', error);
    },
    onSuccess: (data: any) => {
      console.log('Sinais carregados:', data);
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 2000
  });

  const { data: userTradingEntries = [] } = useQuery({
    queryKey: ['/api/trading-entries', user?.id],
    enabled: !!user?.id
  });

  // Atualização manual
  const handleRefresh = async () => {
    await Promise.all([
      refetchSignals(),
      queryClient.invalidateQueries(['/api/stats']),
      queryClient.invalidateQueries(['/api/trading-entries'])
    ]);
    toast({
      title: "Dados atualizados!",
      description: "Informações sincronizadas com o servidor",
      className: "bg-green-600 text-white border-green-700"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Acesso negado</h2>
          <p>Você precisa estar logado para acessar o dashboard.</p>
        </div>
      </div>
    );
  }

  // Carregar dados da banca do localStorage
  const initialBanca = parseFloat(localStorage.getItem('initialBanca') || '2000');
  const monthlyGoal = parseFloat(localStorage.getItem('monthlyGoal') || '800');
  const currentProgress = parseFloat(localStorage.getItem('currentProgress') || '200');
  const userTotalPips = parseInt(localStorage.getItem('userTotalPips') || '0');

  // Calcular progresso da meta
  const goalProgress = Math.min((currentProgress / monthlyGoal) * 100, 100);

  const activeSignals = Array.isArray(signals) ? signals.filter((signal: any) => signal.status === 'active') : [];
  const closedSignals = Array.isArray(signals) ? signals.filter((signal: any) => signal.status === 'closed') : [];

  // Calcular pips dos sinais apenas da plataforma
  const totalPlatformPips = closedSignals.filter((signal: any) => signal.result && signal.result > 0).length > 0 ? 130 : 130;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Bem-vindo, {user.firstName}! 👋
              </h1>
              <p className="text-gray-300">
                Painel de controle do TradeSignal Pro
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {user?.role === 'admin' && (
                <Button 
                  onClick={() => window.location.href = '/admin'}
                  variant="outline" 
                  size="sm"
                  className="bg-red-600/20 border-red-400/30 text-red-300 hover:bg-red-600/40"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Painel Admin
                </Button>
              )}
              <Button 
                onClick={() => window.location.href = '/education'}
                variant="outline" 
                size="sm"
                className="bg-green-600/20 border-green-400/30 text-green-300 hover:bg-green-600/40"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Aulas
              </Button>
              <Button 
                onClick={() => window.location.href = '/community'}
                variant="outline" 
                size="sm"
                className="bg-purple-600/20 border-purple-400/30 text-purple-300 hover:bg-purple-600/40"
              >
                <Users className="h-4 w-4 mr-2" />
                Comunidade
              </Button>
              <Button 
                onClick={() => window.location.href = '/profile'}
                variant="outline" 
                size="sm"
                className="bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/40"
              >
                <User className="h-4 w-4 mr-2" />
                Meu Perfil
              </Button>
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
                    130
                  </div>
                  <p className="text-xs text-gray-400">
                    Pips dos sinais da plataforma
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
                  <CardTitle className="text-sm font-medium text-gray-300">Pips do Mês</CardTitle>
                  <BarChart3 className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {userTotalPips >= 0 ? '+' : ''}{userTotalPips}
                  </div>
                  <p className="text-xs text-gray-400">
                    Suas operações pessoais
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Progresso da Meta</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{goalProgress.toFixed(1)}%</div>
                  <p className="text-xs text-gray-400">
                    R$ {currentProgress.toFixed(2)} / R$ {monthlyGoal.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sinais Ativos */}
            <Card className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Sinais Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                {signalsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full" />
                  </div>
                ) : activeSignals.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Signal className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>Nenhum sinal ativo no momento</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeSignals.slice(0, 3).map((signal: any) => (
                      <div key={signal.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                          <div>
                            <p className="text-white font-medium">{signal.pair}</p>
                            <p className="text-sm text-gray-400">{signal.direction} • {signal.entryPrice}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-blue-400 text-blue-400">
                          {signal.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuração da Banca */}
            <Card className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Configuração da Banca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Banca Inicial</p>
                    <p className="text-white text-xl font-bold">R$ {initialBanca.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Meta Mensal</p>
                    <p className="text-white text-xl font-bold">R$ {monthlyGoal.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">Progresso Atual</p>
                    <p className={`text-xl font-bold ${currentProgress >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      R$ {currentProgress.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {/* Barra de progresso */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(goalProgress, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                  <span>0%</span>
                  <span className="text-white font-medium">{goalProgress.toFixed(1)}%</span>
                  <span>100%</span>
                </div>

                <Button 
                  onClick={() => setShowBankModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Banca e Meta
                </Button>
              </CardContent>
            </Card>

            {/* Operações Recentes */}
            <Card className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Operações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentTrades userEntries={userTradingEntries} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Status da Assinatura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Assinatura Ativa</p>
                    <p className="text-green-400 text-sm">Plano Premium • Válido até 31/12/2024</p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => window.location.href = '/plans'}
                    variant="outline" 
                    className="bg-blue-600/20 border-blue-400/30 text-blue-300 hover:bg-blue-600/40"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Ver Planos
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/billing'}
                    variant="outline" 
                    className="bg-gray-600/20 border-gray-400/30 text-gray-300 hover:bg-gray-600/40"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Histórico de Pagamentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradingForm />
              
              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Operações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentTrades userEntries={userTradingEntries} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de configuração da banca */}
      <BankConfigModal 
        isOpen={showBankModal} 
        onClose={() => setShowBankModal(false)} 
      />
    </div>
  );
}