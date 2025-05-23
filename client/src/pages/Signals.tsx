import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import SignalCard from "@/components/SignalCard";
import AdminSignalForm from "@/components/AdminSignalForm";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function Signals() {
  const { user } = useAuth();
  const { isActive, status } = useSubscription();
  const [showSignalForm, setShowSignalForm] = useState(false);
  const [filterPair, setFilterPair] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: signals, isLoading } = useQuery({
    queryKey: ["/api/signals"],
  });

  const filteredSignals = signals?.filter((signal: any) => {
    const pairMatch = filterPair === "all" || signal.pair === filterPair;
    const statusMatch = filterStatus === "all" || signal.status === filterStatus;
    return pairMatch && statusMatch;
  }) || [];

  const isAdmin = user?.role === "admin";
  
  // Limitar sinais para usuários sem assinatura ativa
  const displaySignals = isActive || isAdmin ? filteredSignals : filteredSignals.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sinais de Trading</h1>
              <p className="mt-2 text-gray-600">
                Sinais profissionais com análise técnica detalhada
              </p>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setShowSignalForm(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Sinal</span>
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Par de Moedas</label>
                  <Select value={filterPair} onValueChange={setFilterPair}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Pares</SelectItem>
                      <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                      <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                      <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                      <SelectItem value="GBP/JPY">GBP/JPY</SelectItem>
                      <SelectItem value="USD/CAD">USD/CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signals Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg shadow-sm border h-64"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSignals.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-gray-500 text-lg">Nenhum sinal encontrado</p>
                  <p className="text-gray-400 mt-2">
                    Ajuste os filtros ou aguarde novos sinais
                  </p>
                </div>
              ) : (
                filteredSignals.map((signal: any) => (
                  <SignalCard key={signal.id} signal={signal} isAdmin={isAdmin} />
                ))
              )}
            </div>
          )}

          {/* Admin Signal Form Modal */}
          {showSignalForm && (
            <AdminSignalForm 
              onClose={() => setShowSignalForm(false)}
              onSuccess={() => setShowSignalForm(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
