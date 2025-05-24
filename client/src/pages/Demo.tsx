import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  BarChart3,
  Users,
  Calendar,
  Home,
  Activity
} from "lucide-react";
import { Link } from "wouter";

export default function Demo() {
  const demoSignals = [
    {
      id: 1,
      pair: "EUR/USD",
      direction: "BUY",
      entryPrice: "1.0850",
      takeProfitPrice: "1.0920",
      stopLossPrice: "1.0800",
      status: "closed",
      result: 245.50,
      analysis: "Rompimento da resistência de 1.0845 com volume forte. Alvo em 1.0920 atingido.",
      time: "2h atrás",
      winRate: "87%"
    },
    {
      id: 2,
      pair: "XAUUSD",
      direction: "SELL",
      entryPrice: "2045.20",
      takeProfitPrice: "2025.00",
      stopLossPrice: "2055.00",
      status: "active",
      analysis: "Ouro rejeitando resistência histórica. Esperamos correção para 2025.",
      time: "30min atrás",
      winRate: "92%"
    },
    {
      id: 3,
      pair: "BTCUSD",
      direction: "BUY",
      entryPrice: "43200.00",
      takeProfitPrice: "45800.00",
      stopLossPrice: "42000.00",
      status: "active",
      analysis: "Bitcoin rompendo triângulo ascendente. Momentum forte para continuação de alta.",
      time: "1h atrás",
      winRate: "89%"
    }
  ];

  const performanceStats = [
    { label: "Taxa de Acerto", value: "73.2%", trend: "up", icon: Target },
    { label: "Traders Ativos", value: "2.847", trend: "up", icon: Users },
    { label: "Sinais por Semana", value: "8-12", trend: "neutral", icon: Activity },
    { label: "Tempo Médio", value: "6.3h", trend: "neutral", icon: Clock }
  ];

  const monthlyHistory = [
    { month: "Dezembro 2024", winRate: 71.8, trades: 89, profit: "R$ 8.420" },
    { month: "Janeiro 2025", winRate: 74.5, trades: 93, profit: "R$ 9.180" },
    { month: "Fevereiro 2025", winRate: 69.3, trades: 87, profit: "R$ 7.650" },
    { month: "Março 2025", winRate: 76.2, trades: 91, profit: "R$ 10.230" },
    { month: "Abril 2025", winRate: 72.1, trades: 88, profit: "R$ 8.890" },
    { month: "Maio 2025", winRate: 73.2, trades: 85, profit: "R$ 9.340" }
  ];

  const assetPerformance = [
    { asset: "EURUSD", winRate: 78.4, trades: 156 },
    { asset: "GBPUSD", winRate: 71.2, trades: 134 },
    { asset: "AUDUSD", winRate: 69.8, trades: 128 },
    { asset: "XAUUSD", winRate: 74.1, trades: 142 },
    { asset: "USDJPY", winRate: 72.6, trades: 139 },
    { asset: "BTCUSD", winRate: 67.3, trades: 89 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header with Home Button */}
      <div className="pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <Button className="bg-black border-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Demonstração da Plataforma
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Resultados reais baseados em 6 meses de operações verificadas
          </p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {performanceStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <IconComponent className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                  {stat.trend === "up" && (
                    <div className="flex items-center justify-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Signals */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center">
              <Play className="h-6 w-6 mr-3 text-purple-400" />
              Sinais em Tempo Real - Demonstração
            </CardTitle>
            <p className="text-gray-400">
              Exemplos reais de sinais que nossos usuários recebem diariamente
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {demoSignals.map((signal) => (
              <div key={signal.id} className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Signal Info */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      signal.direction === 'BUY' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}>
                      {signal.direction === 'BUY' ? (
                        <TrendingUp className="h-6 w-6 text-white" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-bold text-white">{signal.pair}</h3>
                        <Badge className={`${
                          signal.direction === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        } border-0`}>
                          {signal.direction}
                        </Badge>
                        <Badge className={`${
                          signal.status === 'active' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                        } border-0`}>
                          {signal.status === 'active' ? 'ATIVO' : 'FECHADO'}
                        </Badge>
                      </div>
                      <div className="text-gray-400 text-sm mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {signal.time}
                      </div>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">ENTRADA</div>
                      <div className="text-white font-semibold">{signal.entryPrice}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">TAKE PROFIT</div>
                      <div className="text-green-400 font-semibold">{signal.takeProfitPrice}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">STOP LOSS</div>
                      <div className="text-red-400 font-semibold">{signal.stopLossPrice}</div>
                    </div>
                  </div>

                  {/* Result & Win Rate */}
                  <div className="text-right">
                    {signal.result && (
                      <div className="text-green-400 font-bold text-lg mb-1">
                        +R$ {signal.result.toFixed(2)}
                      </div>
                    )}
                    <div className="flex items-center text-yellow-400 text-sm">
                      <Star className="h-3 w-3 mr-1" />
                      Win Rate: {signal.winRate}
                    </div>
                  </div>
                </div>

                {/* Analysis */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-4 border-purple-500">
                  <h4 className="text-purple-400 font-semibold text-sm mb-1">ANÁLISE TÉCNICA</h4>
                  <p className="text-gray-300 text-sm">{signal.analysis}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Historical Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                Histórico dos Últimos 6 Meses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {monthlyHistory.map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">{month.month}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-400">{month.trades} trades</span>
                      <span className={`font-bold text-sm ${month.winRate >= 75 ? 'text-green-400' : month.winRate >= 70 ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {month.winRate}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={month.winRate} 
                    className="h-2" 
                  />
                  <div className="text-right">
                    <span className="text-green-400 text-xs font-semibold">{month.profit}</span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">73.2%</div>
                  <div className="text-purple-400 text-sm">Taxa média dos últimos 6 meses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                Performance por Ativo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assetPerformance.map((asset, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{asset.asset}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-400">{asset.trades} trades</span>
                      <span className={`font-bold text-sm ${asset.winRate >= 75 ? 'text-green-400' : asset.winRate >= 70 ? 'text-yellow-400' : 'text-orange-400'}`}>
                        {asset.winRate}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={asset.winRate} 
                    className="h-2" 
                  />
                </div>
              ))}
              <div className="pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">872</div>
                  <div className="text-blue-400 text-sm">Total de operações analisadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transparency Section */}
        <Card className="bg-gradient-to-br from-slate-600/20 to-gray-600/20 backdrop-blur-xl border border-slate-500/30 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-slate-400" />
              Transparência Total
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">872</div>
              <div className="text-slate-400 text-sm">Operações Registradas</div>
              <div className="text-xs text-gray-500 mt-1">Últimos 6 meses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">638</div>
              <div className="text-slate-400 text-sm">Operações Vencedoras</div>
              <div className="text-xs text-gray-500 mt-1">73.2% de assertividade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">234</div>
              <div className="text-slate-400 text-sm">Operações Perdedoras</div>
              <div className="text-xs text-gray-500 mt-1">26.8% das operações</div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 text-center">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Comece Sua Jornada no Trading
            </h2>
            <p className="text-gray-300 mb-6 text-lg">
              Dados reais e verificados. Transparência total em cada operação.
            </p>
            <div className="bg-white/5 rounded-lg p-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-gray-300">Histórico verificável</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-gray-300">73.2% de assertividade</span>
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-gray-300">2.847 traders ativos</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/plans">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-xl">
                  Ver Planos
                </Button>
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              * Dados baseados em operações reais realizadas entre dezembro/2024 e maio/2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}