import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  Play,
  CheckCircle
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
    { label: "Taxa de Acerto Mensal", value: "87.3%", trend: "up" },
    { label: "Lucro Médio por Sinal", value: "R$ 247", trend: "up" },
    { label: "Sinais por Semana", value: "12-15", trend: "neutral" },
    { label: "Tempo Médio de Operação", value: "4.2h", trend: "neutral" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Demonstração da Plataforma
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Veja como nossos sinais profissionais podem transformar seus resultados no trading
          </p>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {performanceStats.map((stat, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
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
          ))}
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

        {/* Features Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-400" />
                Precisão Comprovada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Janeiro 2025</span>
                <span className="text-green-400 font-bold">89.2% de acerto</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Dezembro 2024</span>
                <span className="text-green-400 font-bold">87.8% de acerto</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Novembro 2024</span>
                <span className="text-green-400 font-bold">91.3% de acerto</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">87.3%</div>
                  <div className="text-purple-400 text-sm">Taxa média dos últimos 3 meses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                Resultados Financeiros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Lucro médio por trade</span>
                <span className="text-green-400 font-bold">R$ 247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Maior sequência de ganhos</span>
                <span className="text-green-400 font-bold">15 trades</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">ROI médio mensal</span>
                <span className="text-green-400 font-bold">+24.8%</span>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">R$ 12.450</div>
                  <div className="text-green-400 text-sm">Lucro total dos últimos 30 dias</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 text-center">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Junte-se a mais de 12.000 traders que já transformaram seus resultados
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/api/login">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                  Começar Agora - Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Sem compromisso
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Resultados reais
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Suporte 24/7
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}