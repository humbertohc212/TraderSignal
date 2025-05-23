import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

const signalFormSchema = z.object({
  pair: z.string().min(1, "Par de moedas é obrigatório"),
  direction: z.enum(["BUY", "SELL"], { required_error: "Direção é obrigatória" }),
  entryPrice: z.string().min(1, "Preço de entrada é obrigatório"),
  takeProfitPrice: z.string().min(1, "Take Profit é obrigatório"),
  stopLossPrice: z.string().min(1, "Stop Loss é obrigatório"),
  analysis: z.string().optional(),
});

type SignalFormData = z.infer<typeof signalFormSchema>;

interface AdminSignalFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminSignalForm({ onClose, onSuccess }: AdminSignalFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignalFormData>({
    resolver: zodResolver(signalFormSchema),
  });

  const createSignalMutation = useMutation({
    mutationFn: async (data: SignalFormData) => {
      const response = await apiRequest("POST", "/api/signals", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signals"] });
      toast({
        title: "Sinal criado com sucesso",
        description: "O novo sinal foi publicado na plataforma.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar sinal",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignalFormData) => {
    createSignalMutation.mutate(data);
  };

  const currencyPairs = [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "GBP/JPY",
    "USD/CAD",
    "AUD/USD",
    "USD/CHF",
    "NZD/USD",
    "EUR/GBP",
    "EUR/JPY",
  ];

  const calculateRiskReward = () => {
    const entry = parseFloat(watch("entryPrice") || "0");
    const tp = parseFloat(watch("takeProfitPrice") || "0");
    const sl = parseFloat(watch("stopLossPrice") || "0");
    const direction = watch("direction");

    if (!entry || !tp || !sl || !direction) return "N/A";

    let profit, loss;
    
    if (direction === "BUY") {
      profit = Math.abs(tp - entry);
      loss = Math.abs(entry - sl);
    } else {
      profit = Math.abs(entry - tp);
      loss = Math.abs(sl - entry);
    }

    if (loss === 0) return "N/A";
    const ratio = profit / loss;
    return `1:${ratio.toFixed(1)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">Novo Sinal</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Currency Pair */}
            <div className="space-y-2">
              <Label htmlFor="pair">Par de Moedas</Label>
              <Select
                value={watch("pair")}
                onValueChange={(value) => setValue("pair", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o par de moedas" />
                </SelectTrigger>
                <SelectContent>
                  {currencyPairs.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pair && (
                <p className="text-sm text-red-600">{errors.pair.message}</p>
              )}
            </div>

            {/* Direction */}
            <div className="space-y-2">
              <Label htmlFor="direction">Direção</Label>
              <Select
                value={watch("direction")}
                onValueChange={(value) => setValue("direction", value as "BUY" | "SELL")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a direção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">
                    <span className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>BUY (Compra)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="SELL">
                    <span className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>SELL (Venda)</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.direction && (
                <p className="text-sm text-red-600">{errors.direction.message}</p>
              )}
            </div>

            {/* Price Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Preço de Entrada</Label>
                <Input
                  {...register("entryPrice")}
                  type="number"
                  step="0.00001"
                  placeholder="1.0820"
                  className="font-mono"
                />
                {errors.entryPrice && (
                  <p className="text-sm text-red-600">{errors.entryPrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="takeProfitPrice">Take Profit</Label>
                <Input
                  {...register("takeProfitPrice")}
                  type="number"
                  step="0.00001"
                  placeholder="1.0850"
                  className="font-mono"
                />
                {errors.takeProfitPrice && (
                  <p className="text-sm text-red-600">{errors.takeProfitPrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stopLossPrice">Stop Loss</Label>
                <Input
                  {...register("stopLossPrice")}
                  type="number"
                  step="0.00001"
                  placeholder="1.0780"
                  className="font-mono"
                />
                {errors.stopLossPrice && (
                  <p className="text-sm text-red-600">{errors.stopLossPrice.message}</p>
                )}
              </div>
            </div>

            {/* Risk/Reward Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Relação Risco/Recompensa:</span>
                <span className="text-lg font-semibold text-blue-600">{calculateRiskReward()}</span>
              </div>
            </div>

            {/* Analysis */}
            <div className="space-y-2">
              <Label htmlFor="analysis">Análise Técnica (Opcional)</Label>
              <Textarea
                {...register("analysis")}
                placeholder="Descreva a análise técnica que justifica este sinal..."
                rows={4}
                className="resize-none"
              />
              {errors.analysis && (
                <p className="text-sm text-red-600">{errors.analysis.message}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={createSignalMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {createSignalMutation.isPending ? "Publicando..." : "Publicar Sinal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={createSignalMutation.isPending}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
