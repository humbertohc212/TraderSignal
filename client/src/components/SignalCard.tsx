import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, X, Trash2, CheckCircle } from "lucide-react";

interface SignalCardProps {
  signal: {
    id: number;
    pair: string;
    direction: string;
    entryPrice: string;
    takeProfitPrice: string;
    stopLossPrice: string;
    status: string;
    result?: string;
    analysis?: string;
    createdAt: string;
  };
  isAdmin: boolean;
}

export default function SignalCard({ signal, isAdmin }: SignalCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteSignalMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/signals/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signals"] });
      toast({
        title: "Sinal removido",
        description: "O sinal foi removido com sucesso.",
      });
    },
  });

  const closeSignalMutation = useMutation({
    mutationFn: async ({ id, result }: { id: number; result: number }) => {
      const response = await apiRequest("POST", `/api/signals/${id}/close`, { result });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signals"] });
      toast({
        title: "Sinal fechado",
        description: "O sinal foi fechado com sucesso.",
      });
    },
  });

  const handleCloseSignal = () => {
    const result = prompt("Digite o resultado em pips (ex: 25 para lucro, -15 para perda):");
    if (result !== null) {
      const numResult = parseFloat(result);
      if (!isNaN(numResult)) {
        closeSignalMutation.mutate({ id: signal.id, result: numResult });
      }
    }
  };

  const handleDeleteSignal = () => {
    if (window.confirm("Tem certeza que deseja remover este sinal?")) {
      deleteSignalMutation.mutate(signal.id);
    }
  };

  const getStatusColor = (status: string, result?: string) => {
    if (status === "active") return "bg-blue-100 text-blue-800";
    if (status === "closed") {
      if (result && parseFloat(result) > 0) return "bg-green-100 text-green-800";
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string, result?: string) => {
    if (status === "active") return "ATIVO";
    if (status === "closed") {
      if (result) return `${parseFloat(result) > 0 ? "+" : ""}${result} pips`;
      return "FECHADO";
    }
    return "CANCELADO";
  };

  const getRiskReward = () => {
    const entry = parseFloat(signal.entryPrice);
    const tp = parseFloat(signal.takeProfitPrice);
    const sl = parseFloat(signal.stopLossPrice);
    
    const profit = Math.abs(tp - entry);
    const loss = Math.abs(entry - sl);
    
    if (loss === 0) return "N/A";
    const ratio = profit / loss;
    return `1:${ratio.toFixed(1)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{signal.pair}</h3>
          <Badge className={getStatusColor(signal.status, signal.result)}>
            {getStatusText(signal.status, signal.result)}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Direção:</span>
            <span className={`text-sm font-medium ${
              signal.direction === 'BUY' ? 'text-green-600' : 'text-red-600'
            }`}>
              {signal.direction}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Entrada:</span>
            <span className="text-sm font-mono">{signal.entryPrice}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Take Profit:</span>
            <span className="text-sm font-mono text-green-600">{signal.takeProfitPrice}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Stop Loss:</span>
            <span className="text-sm font-mono text-red-600">{signal.stopLossPrice}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">R/R:</span>
            <span className="text-sm font-medium">{getRiskReward()}</span>
          </div>
          
          {signal.analysis && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Análise:</p>
              <p className="text-sm text-gray-700">{signal.analysis}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Publicado em {formatDate(signal.createdAt)}
          </p>
          
          {isAdmin && (
            <div className="flex space-x-2">
              {signal.status === "active" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleCloseSignal}
                  disabled={closeSignalMutation.isPending}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleDeleteSignal}
                disabled={deleteSignalMutation.isPending}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
