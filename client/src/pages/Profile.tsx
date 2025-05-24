import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User, Settings, TrendingUp, TrendingDown, Plus, Calendar, DollarSign } from "lucide-react";

// Schema para atualização de perfil
const profileSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

// Schema para registro de trading
const tradingEntrySchema = z.object({
  pair: z.string().min(1, "Par de moedas é obrigatório"),
  type: z.enum(["gain", "loss"]),
  amount: z.number().min(0.01, "Valor deve ser maior que 0"),
  notes: z.string().min(1, "Notas são obrigatórias"),
  date: z.string().min(1, "Data é obrigatória"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type TradingEntryData = z.infer<typeof tradingEntrySchema>;

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form para perfil
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: "",
      bio: "",
    },
  });

  // Form para trading
  const tradingForm = useForm<TradingEntryData>({
    resolver: zodResolver(tradingEntrySchema),
    defaultValues: {
      pair: "",
      type: "gain",
      amount: 0,
      notes: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Query para buscar entradas de trading
  const { data: tradingEntries = [] } = useQuery({
    queryKey: ["/api/trading-entries"],
    enabled: !!user,
  });

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("PUT", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para adicionar entrada de trading
  const addTradingEntryMutation = useMutation({
    mutationFn: async (data: TradingEntryData) => {
      const response = await apiRequest("POST", "/api/trading-entries", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Entrada registrada!",
        description: "Seu resultado foi adicionado ao diário.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/trading-entries"] });
      tradingForm.reset({
        pair: "",
        type: "gain",
        amount: 0,
        notes: "",
        date: new Date().toISOString().split('T')[0],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao registrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onTradingSubmit = (data: TradingEntryData) => {
    addTradingEntryMutation.mutate(data);
  };

  // Calcular estatísticas
  const totalGains = tradingEntries
    .filter((entry: any) => entry.type === "gain")
    .reduce((sum: number, entry: any) => sum + entry.amount, 0);

  const totalLosses = tradingEntries
    .filter((entry: any) => entry.type === "loss")
    .reduce((sum: number, entry: any) => sum + entry.amount, 0);

  const netProfit = totalGains - totalLosses;
  const winRate = tradingEntries.length > 0 
    ? (tradingEntries.filter((entry: any) => entry.type === "gain").length / tradingEntries.length * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
          <p className="text-gray-300">Gerencie suas informações e acompanhe seus resultados</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-blue-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Diário de Trading
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-blue-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          {/* Aba do Perfil */}
          <TabsContent value="profile">
            <Card className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Atualize suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">Nome</Label>
                      <Input
                        {...profileForm.register("firstName")}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Seu nome"
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">
                          {profileForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">Sobrenome</Label>
                      <Input
                        {...profileForm.register("lastName")}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Seu sobrenome"
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">
                          {profileForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Telefone (opcional)</Label>
                    <Input
                      {...profileForm.register("phone")}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-white">Bio (opcional)</Label>
                    <Textarea
                      {...profileForm.register("bio")}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Conte um pouco sobre você..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba do Trading */}
          <TabsContent value="trading">
            <div className="space-y-6">
              {/* Formulário para nova entrada */}
              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Registrar Novo Resultado
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Adicione seus ganhos ou perdas de trading
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={tradingForm.handleSubmit(onTradingSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pair" className="text-white">Par de Moedas</Label>
                        <Input
                          {...tradingForm.register("pair")}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Ex: EURUSD, BTCUSD"
                        />
                      </div>
                      <div>
                        <Label htmlFor="date" className="text-white">Data</Label>
                        <Input
                          {...tradingForm.register("date")}
                          type="date"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Tipo</Label>
                        <div className="flex gap-2 mt-2">
                          <Button
                            type="button"
                            variant={tradingForm.watch("type") === "gain" ? "default" : "outline"}
                            className={`flex-1 ${
                              tradingForm.watch("type") === "gain" 
                                ? "bg-green-600 hover:bg-green-700" 
                                : "border-gray-600 text-gray-300"
                            }`}
                            onClick={() => tradingForm.setValue("type", "gain")}
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Ganho
                          </Button>
                          <Button
                            type="button"
                            variant={tradingForm.watch("type") === "loss" ? "default" : "outline"}
                            className={`flex-1 ${
                              tradingForm.watch("type") === "loss" 
                                ? "bg-red-600 hover:bg-red-700" 
                                : "border-gray-600 text-gray-300"
                            }`}
                            onClick={() => tradingForm.setValue("type", "loss")}
                          >
                            <TrendingDown className="w-4 h-4 mr-2" />
                            Perda
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="amount" className="text-white">Valor (R$)</Label>
                        <Input
                          {...tradingForm.register("amount", { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-white">Notas</Label>
                      <Textarea
                        {...tradingForm.register("notes")}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Descreva sua estratégia, o que funcionou, o que pode melhorar..."
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={addTradingEntryMutation.isPending}
                    >
                      {addTradingEntryMutation.isPending ? "Registrando..." : "Registrar Entrada"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Lista de entradas */}
              <Card className="bg-gray-800/90 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Histórico de Trading</CardTitle>
                  <CardDescription className="text-gray-300">
                    Suas últimas operações registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tradingEntries.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">
                        Nenhuma entrada registrada ainda. Adicione sua primeira operação!
                      </p>
                    ) : (
                      tradingEntries.slice(0, 10).map((entry: any) => (
                        <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {entry.type === "gain" ? (
                              <TrendingUp className="w-5 h-5 text-green-400" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-400" />
                            )}
                            <div>
                              <p className="text-white font-medium">{entry.pair}</p>
                              <p className="text-gray-400 text-sm">{entry.notes}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              entry.type === "gain" ? "text-green-400" : "text-red-400"
                            }`}>
                              {entry.type === "gain" ? "+" : "-"}R$ {entry.amount.toFixed(2)}
                            </p>
                            <p className="text-gray-400 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba de Estatísticas */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800/90 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Total de Ganhos</p>
                      <p className="text-2xl font-bold text-green-400">
                        R$ {totalGains.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/90 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-8 h-8 text-red-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Total de Perdas</p>
                      <p className="text-2xl font-bold text-red-400">
                        R$ {totalLosses.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/90 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Lucro Líquido</p>
                      <p className={`text-2xl font-bold ${
                        netProfit >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        R$ {netProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/90 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-purple-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Taxa de Acerto</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {winRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/90 border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Resumo Mensal</CardTitle>
                <CardDescription className="text-gray-300">
                  Acompanhe sua evolução ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  📊 Gráficos de performance em desenvolvimento
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}