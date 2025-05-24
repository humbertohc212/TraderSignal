import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp, TrendingDown, Target } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const tradingEntrySchema = z.object({
  pair: z.string().min(1, "Par é obrigatório"),
  direction: z.string().min(1, "Direção é obrigatória"),
  lotSize: z.string().min(1, "Tamanho do lote é obrigatório").transform((val) => parseFloat(val)),
  entryPrice: z.string().min(1, "Preço de entrada é obrigatório").transform((val) => parseFloat(val)),
  exitPrice: z.string().min(1, "Preço de saída é obrigatório").transform((val) => parseFloat(val)),
  result: z.string().min(1, "Resultado é obrigatório"),
  notes: z.string().optional(),
});

type TradingEntryFormData = z.infer<typeof tradingEntrySchema>;

interface TradingEntryFormProps {
  user: any;
  children?: React.ReactNode;
}

export default function TradingEntryForm({ user, children }: TradingEntryFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<TradingEntryFormData>({
    resolver: zodResolver(tradingEntrySchema),
    defaultValues: {
      lotSize: user?.defaultLotSize || 0.01,
    },
  });

  const watchedValues = watch();

  const createTradingEntryMutation = useMutation({
    mutationFn: async (data: TradingEntryFormData) => {
      // Calcular pips corretamente
      const pipDifference = Math.abs(data.exitPrice - data.entryPrice);
      const pipsValue = data.pair.includes("JPY") ? pipDifference * 100 : pipDifference * 10000;
      
      // Determinar se foi lucro ou prejuízo baseado na direção
      let actualPips = 0;
      if (data.direction === "BUY") {
        actualPips = data.exitPrice > data.entryPrice ? pipsValue : -pipsValue;
      } else { // SELL
        actualPips = data.exitPrice < data.entryPrice ? pipsValue : -pipsValue;
      }
      
      // Ajustar sinal baseado no resultado
      if (data.result === "SL") {
        actualPips = -Math.abs(actualPips); // Stop Loss sempre é negativo
      } else if (data.result === "TP1" || data.result === "TP2") {
        actualPips = Math.abs(actualPips); // Take Profit sempre é positivo
      }
      
      // Calcular valor do pip: pip * lote * unidades da moeda base
      // Lote padrão = 100.000 unidades, mini lote = 10.000 unidades
      const lotUnits = data.lotSize >= 1 ? 100000 : 10000; // Lote padrão ou mini lote
      const pipValue = 0.0001 * data.lotSize * lotUnits;
      const profit = actualPips * pipValue;

      const entryData = {
        ...data,
        userId: user.id,
        pips: actualPips,
        profit,
        status: "closed",
        date: new Date().toISOString().split('T')[0],
      };

      return await apiRequest("POST", "/api/trading-entries", entryData);
    },
    onSuccess: () => {
      // Invalida todas as queries relevantes para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trading-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      
      toast({
        title: "Operação Registrada!",
        description: "Sua operação foi salva e os pips foram atualizados.",
      });
      setOpen(false);
      reset();
      
      // Força recarregamento da página para garantir atualização
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao registrar operação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TradingEntryFormData) => {
    createTradingEntryMutation.mutate(data);
  };

  // Calcular preview dos resultados
  const calculatePreview = () => {
    if (!watchedValues.entryPrice || !watchedValues.exitPrice || !watchedValues.lotSize || !watchedValues.direction) return null;
    
    // Calcular pips corretamente
    const pipDifference = Math.abs(watchedValues.exitPrice - watchedValues.entryPrice);
    const pipsValue = watchedValues.pair?.includes("JPY") ? pipDifference * 100 : pipDifference * 10000;
    
    // Determinar se foi lucro ou prejuízo baseado na direção
    let actualPips = 0;
    if (watchedValues.direction === "BUY") {
      actualPips = watchedValues.exitPrice > watchedValues.entryPrice ? pipsValue : -pipsValue;
    } else { // SELL
      actualPips = watchedValues.exitPrice < watchedValues.entryPrice ? pipsValue : -pipsValue;
    }
    
    // Ajustar sinal baseado no resultado
    if (watchedValues.result === "SL") {
      actualPips = -Math.abs(actualPips);
    } else if (watchedValues.result === "TP1" || watchedValues.result === "TP2") {
      actualPips = Math.abs(actualPips);
    }
    
    // Calcular valor do pip: pip * lote * unidades da moeda base
    const lotUnits = watchedValues.lotSize >= 1 ? 100000 : 10000;
    const pipValue = 0.0001 * watchedValues.lotSize * lotUnits;
    const profit = actualPips * pipValue;
    
    return { pips: actualPips, profit };
  };

  const preview = calculatePreview();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Operação
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Registrar Nova Operação
          </DialogTitle>
          <DialogDescription>
            Registre sua operação para acompanhar o progresso da sua meta mensal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pair">Par de Moedas</Label>
              <Select onValueChange={(value) => setValue("pair", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EURUSD">EUR/USD</SelectItem>
                  <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                  <SelectItem value="USDJPY">USD/JPY</SelectItem>
                  <SelectItem value="AUDUSD">AUD/USD</SelectItem>
                  <SelectItem value="USDCAD">USD/CAD</SelectItem>
                  <SelectItem value="XAUUSD">XAU/USD (Ouro)</SelectItem>
                  <SelectItem value="BTCUSD">BTC/USD</SelectItem>
                  <SelectItem value="US30">US30</SelectItem>
                </SelectContent>
              </Select>
              {errors.pair && (
                <p className="text-sm text-red-500">{errors.pair.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Direção</Label>
              <Select onValueChange={(value) => setValue("direction", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="BUY ou SELL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">BUY (Compra)</SelectItem>
                  <SelectItem value="SELL">SELL (Venda)</SelectItem>
                </SelectContent>
              </Select>
              {errors.direction && (
                <p className="text-sm text-red-500">{errors.direction.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lotSize">Tamanho do Lote</Label>
              <Input
                id="lotSize"
                type="number"
                step="0.01"
                placeholder="0.01"
                {...register("lotSize")}
              />
              {errors.lotSize && (
                <p className="text-sm text-red-500">{errors.lotSize.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="entryPrice">Preço de Entrada</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00001"
                placeholder="1.12345"
                {...register("entryPrice")}
              />
              {errors.entryPrice && (
                <p className="text-sm text-red-500">{errors.entryPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="exitPrice">Preço de Saída</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.00001"
                placeholder="1.12445"
                {...register("exitPrice")}
              />
              {errors.exitPrice && (
                <p className="text-sm text-red-500">{errors.exitPrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">Resultado</Label>
            <Select onValueChange={(value) => setValue("result", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Como foi o resultado?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TP1">TP1 (Take Profit 1)</SelectItem>
                <SelectItem value="TP2">TP2 (Take Profit 2)</SelectItem>
                <SelectItem value="SL">SL (Stop Loss)</SelectItem>
                <SelectItem value="manual">Fechamento Manual</SelectItem>
              </SelectContent>
            </Select>
            {errors.result && (
              <p className="text-sm text-red-500">{errors.result.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione suas observações sobre esta operação..."
              {...register("notes")}
            />
          </div>

          {/* Preview dos Resultados */}
          {preview && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Preview do Resultado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {preview.pips.toFixed(1)} pips
                    </div>
                    <div className="text-xs text-gray-500">Pips</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${preview.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {preview.profit.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Lucro/Prejuízo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createTradingEntryMutation.isPending}
            >
              {createTradingEntryMutation.isPending ? "Salvando..." : "Registrar Operação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}