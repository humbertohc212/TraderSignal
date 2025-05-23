import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Trophy,
  Clock
} from "lucide-react";
import { Link } from "wouter";

export default function ModernDashboard() {
  const { data: userStats } = useQuery({
    queryKey: ["/api/stats/user"],
  });

  const { data: signals } = useQuery({
    queryKey: ["/api/signals"],
  });

  const recentSignals = signals?.slice(0, 5) || [];

  const statsCards = [
    {
      title: "Sinais Ativos",
      value: userStats?.activeSignals || 0,
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Taxa de Acerto",
      value: "87.5%",
      change: "+5.2%",
      trend: "up",
      icon: Target,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Lucro Total",
      value: "R$ 12.450",
      change: "+24.8%",
      trend: "up",
      icon: DollarSign,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Ranking",
      value: "#127",
      change: "↑15",
      trend: "up",
      icon: Trophy,
      color: "from-orange-500 to-amber-500"
    }
  ];

  const quickActions = [
    {
      title: "Ver Sinais",
      description: "Confira os sinais mais recentes",
      href: "/signals",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Educação",
      description: "Aprimore suas habilidades",
      href: "/education",
      icon: Star,
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Upgrade Plan",
      description: "Desbloqueie mais recursos",
      href: "/plans",
      icon: Zap,
      color: "from-orange-500 to-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Bem-vindo de volta! Aqui está o resumo da sua performance hoje.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge className={`${stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.title}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Signals */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-xl">Sinais Recentes</CardTitle>
                <Link href="/signals">
                  <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                    Ver Todos
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSignals.map((signal: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        signal.direction === 'BUY' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-red-500 to-rose-500'
                      }`}>
                        {signal.direction === 'BUY' ? (
                          <TrendingUp className="h-5 w-5 text-white" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {signal.pair}
                        </div>
                        <div className="text-sm text-gray-400">
                          {signal.direction} • {signal.entryPrice}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${
                        signal.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                        signal.status === 'closed' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      } border-0`}>
                        {signal.status}
                      </Badge>
                      <div className="text-sm text-gray-400 mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        2h atrás
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-xl">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group hover:scale-105">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">
                            {action.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {action.description}
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  Performance do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Trades Vencedores</span>
                    <span className="text-green-400 font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Profit Factor</span>
                    <span className="text-purple-400 font-semibold">2.4x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Melhor Streak</span>
                    <span className="text-cyan-400 font-semibold">12 wins</span>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        +R$ 3.247
                      </div>
                      <div className="text-green-400 text-sm">
                        Lucro este mês
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}