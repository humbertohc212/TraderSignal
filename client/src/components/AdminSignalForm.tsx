import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const signalFormSchema = z.object({
  pair: z.string().min(1, "Par de moedas é obrigatório"),
  direction: z.enum(["BUY", "SELL", "BUY_LIMIT", "SELL_LIMIT"]),
  entryPrice: z.string().min(1, "Preço de entrada é obrigatório"),
  takeProfitPrice: z.string().min(1, "Take Profit 1 é obrigatório"),
  takeProfit2Price: z.string().optional(),
  stopLossPrice: z.string().min(1, "Stop Loss é obrigatório"),
  analysis: z.string().optional(),
  tradingViewLink: z.string().optional(),
  allowedPlans: z.array(z.string()).min(1, "Selecione pelo menos um plano"),
});

type SignalFormData = z.infer<typeof signalFormSchema>;

interface AdminSignalFormProps {
  signal?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminSignalForm({ signal, onClose, onSuccess }: AdminSignalFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SignalFormData>({
    resolver: zodResolver(signalFormSchema),
    defaultValues: {
      pair: signal?.pair || "",
      direction: signal?.direction || "BUY",
      entryPrice: signal?.entryPrice || "",
      takeProfitPrice: signal?.takeProfitPrice || "",
      takeProfit2Price: signal?.takeProfit2Price || "",
      stopLossPrice: signal?.stopLossPrice || "",
      analysis: signal?.analysis || "",
      tradingViewLink: signal?.tradingViewLink || "",
      allowedPlans: signal?.allowedPlans || ["free", "basic", "premium", "vip"],
    },
  });

  const createSignalMutation = useMutation({
    mutationFn: async (data: SignalFormData) => {
      const token = localStorage.getItem('auth-token');
      const url = signal?.id ? `/api/signals/${signal.id}` : '/api/signals';
      const method = signal?.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          status: signal?.status || "active"
        }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar sinal');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/admin"] }); // Atualiza estatísticas
      toast({
        title: "Sucesso!",
        description: signal?.id ? "Sinal editado com sucesso!" : "Sinal criado com sucesso!",
      });
      onSuccess();
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: signal?.id ? "Falha ao editar sinal" : "Falha ao criar sinal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignalFormData) => {
    // Convert empty strings to undefined for optional numeric fields
    const cleanedData = {
      ...data,
      takeProfit2Price: data.takeProfit2Price?.trim() === "" ? undefined : data.takeProfit2Price,
    };
    createSignalMutation.mutate(cleanedData);
  };

  const currencies = [
    "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD",
    "EUR/GBP", "EUR/JPY", "GBP/JPY", "CHF/JPY", "AUD/JPY", "CAD/JPY", "NZD/JPY",
    "XAU/USD", "XAG/USD", "BTC/USD", "ETH/USD", "LTC/USD", "BNB/USD", "SOL/USD"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Novo Sinal de Trading</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pair"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Par de Moedas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o par" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direção</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a direção" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BUY">COMPRA (BUY)</SelectItem>
                          <SelectItem value="SELL">VENDA (SELL)</SelectItem>
                          <SelectItem value="BUY_LIMIT">COMPRA LIMITADA (BUY LIMIT)</SelectItem>
                          <SelectItem value="SELL_LIMIT">VENDA LIMITADA (SELL LIMIT)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="entryPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Entrada</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0850" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="takeProfitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Take Profit 1</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="takeProfit2Price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Take Profit 2 (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0950" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stopLossPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stop Loss</FormLabel>
                      <FormControl>
                        <Input placeholder="1.0800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tradingViewLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do TradingView (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.tradingview.com/chart/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowedPlans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Planos Permitidos</FormLabel>
                    <div className="grid grid-cols-2 gap-4 p-6 bg-gray-900/80 border border-gray-700/50 rounded-lg backdrop-blur-sm">
                      {[
                        { 
                          id: "free", 
                          label: "Free Trial", 
                          description: "Usuários em período gratuito",
                          color: "from-gray-600 to-gray-700"
                        },
                        { 
                          id: "basic", 
                          label: "Básico", 
                          description: "Plano básico (R$ 47)",
                          color: "from-blue-600 to-blue-700"
                        },
                        { 
                          id: "premium", 
                          label: "Premium", 
                          description: "Plano premium (R$ 97)",
                          color: "from-purple-600 to-purple-700"
                        },
                        { 
                          id: "vip", 
                          label: "VIP", 
                          description: "Plano VIP (R$ 197)",
                          color: "from-yellow-600 to-yellow-700"
                        }
                      ].map((plan) => (
                        <div key={plan.id} className="group">
                          <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                            field.value?.includes(plan.id) 
                              ? `bg-gradient-to-r ${plan.color} border-white/20 shadow-lg` 
                              : 'bg-gray-800/40 border-gray-600/50 hover:border-gray-500/60'
                          }`}>
                            <Checkbox
                              id={plan.id}
                              checked={field.value?.includes(plan.id)}
                              onCheckedChange={(checked) => {
                                const updatedPlans = checked
                                  ? [...(field.value || []), plan.id]
                                  : (field.value || []).filter((p) => p !== plan.id);
                                field.onChange(updatedPlans);
                              }}
                              className="mt-1 data-[state=checked]:bg-white data-[state=checked]:border-white"
                            />
                            <div className="space-y-1 flex-1">
                              <Label 
                                htmlFor={plan.id} 
                                className="text-sm font-semibold text-white cursor-pointer block group-hover:text-gray-100"
                              >
                                {plan.label}
                              </Label>
                              <p className="text-xs text-gray-300 group-hover:text-gray-200">
                                {plan.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Selecione quais planos terão acesso a este sinal. Admin sempre tem acesso completo.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="analysis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Análise (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva a análise técnica ou fundamentalista para este sinal..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createSignalMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {createSignalMutation.isPending ? "Criando..." : "Criar Sinal"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}