import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";

export default function PerformanceDashboard() {
  const { data: performanceData } = useQuery({
    queryKey: ["/api/performance"],
  });

  const { data: signals } = useQuery({
    queryKey: ["/api/signals"],
  });

  // Calculate performance metrics
  const calculateMetrics = () => {
    if (!signals) return null;

    const closedSignals = signals.filter((s: any) => s.status === "closed");
    const winningSignals = closedSignals.filter((s: any) => s.result && s.result > 0);
    const losingSignals = closedSignals.filter((s: any) => s.result && s.result < 0);
    
    const winRate = closedSignals.length > 0 ? (winningSignals.length / closedSignals.length) * 100 : 0;
    const totalProfit = closedSignals.reduce((sum: number, s: any) => sum + (s.result || 0), 0);
    
    return {
      winRate,
      totalProfit,
      totalSignals: closedSignals.length,
      winningSignals: winningSignals.length,
      losingSignals: losingSignals.length
    };
  };

  const metrics = calculateMetrics();

  // Mock data for charts (in production, this would come from your API)
  const monthlyPerformance = [
    { month: "Jan", profit: 2400, signals: 12 },
    { month: "Fev", profit: 1398, signals: 15 },
    { month: "Mar", profit: 3200, signals: 18 },
    { month: "Abr", profit: 2800, signals: 14 },
    { month: "Mai", profit: 3890, signals: 22 },
  ];

  const instrumentPerformance = [
    { name: "EUR/USD", profit: 1200, count: 8 },
    { name: "GBP/USD", profit: 980, count: 6 },
    { name: "XAUUSD", profit: 1500, count: 4 },
    { name: "BTCUSD", profit: 2100, count: 5 },
    { name: "US30", profit: 750, count: 3 },
  ];

  const pieData = [
    { name: "Vitórias", value: metrics?.winningSignals || 0, color: "#10b981" },
    { name: "Perdas", value: metrics?.losingSignals || 0, color: "#ef4444" },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics?.winRate.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.winningSignals || 0} de {metrics?.totalSignals || 0} sinais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {metrics?.totalProfit.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Último mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sinais Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {signals?.filter((s: any) => s.status === "active").length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ 3.890
            </div>
            <p className="text-xs text-muted-foreground">
              Maio 2025
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, "Lucro"]} />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Win/Loss Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Vitórias ({metrics?.winningSignals || 0})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Perdas ({metrics?.losingSignals || 0})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instrument Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Instrumento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={instrumentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${value}`, "Lucro"]} />
              <Bar dataKey="profit" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sinais Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {signals?.slice(0, 5).map((signal: any) => (
              <div key={signal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={signal.direction === "BUY" ? "default" : "secondary"}>
                    {signal.direction}
                  </Badge>
                  <span className="font-medium">{signal.pair}</span>
                  <span className="text-sm text-gray-600">
                    Entry: {signal.entryPrice}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      signal.status === "closed" 
                        ? signal.result > 0 ? "default" : "destructive"
                        : "secondary"
                    }
                  >
                    {signal.status === "closed" 
                      ? signal.result > 0 ? "Ganho" : "Perda"
                      : signal.status
                    }
                  </Badge>
                  {signal.result && (
                    <span className={`text-sm font-medium ${signal.result > 0 ? "text-green-600" : "text-red-600"}`}>
                      {signal.result > 0 ? "+" : ""}R$ {signal.result.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}