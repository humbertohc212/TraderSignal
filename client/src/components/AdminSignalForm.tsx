import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    },
  });

  const createSignalMutation = useMutation({
    mutationFn: async (data: SignalFormData) => {
      if (signal?.id) {
        // Edit existing signal
        return await apiRequest("PUT", `/api/signals/${signal.id}`, data);
      } else {
        // Create new signal
        return await apiRequest("POST", "/api/signals", {
          ...data,
          status: "active"
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signals"] });
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