import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, TrendingUp, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const bankConfigSchema = z.object({
  initialBalance: z.string().min(1, "Banca inicial é obrigatória").transform((val) => parseFloat(val)),
  monthlyGoal: z.string().min(1, "Meta mensal é obrigatória").transform((val) => parseFloat(val)),
  defaultLotSize: z.string().min(1, "Tamanho do lote é obrigatório").transform((val) => parseFloat(val)),
});

type BankConfigFormData = z.infer<typeof bankConfigSchema>;

interface BankConfigModalProps {
  user: any;
  children?: React.ReactNode;
}

export default function BankConfigModal({ user, children }: BankConfigModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BankConfigFormData>({
    resolver: zodResolver(bankConfigSchema),
    defaultValues: {
      initialBalance: user?.initialBalance || "",
      monthlyGoal: user?.monthlyGoal || "",
      defaultLotSize: user?.defaultLotSize || "0.01",
    },
  });

  const updateBankConfigMutation = useMutation({
    mutationFn: async (data: BankConfigFormData) => {
      return await apiRequest("PUT", "/api/user/bank-config", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/admin"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Configurações Salvas!",
        description: "Sua banca e meta foram configuradas com sucesso.",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BankConfigFormData) => {
    updateBankConfigMutation.mutate(data);
  };

  // Calcular progresso atual
  const currentBalance = user?.currentBalance || user?.initialBalance || 0;
  const initialBalance = user?.initialBalance || 0;
  const monthlyGoal = user?.monthlyGoal || 0;
  const profit = currentBalance - initialBalance;
  const progressPercentage = monthlyGoal > 0 ? (profit / monthlyGoal) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar Banca
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuração da Banca e Meta
          </DialogTitle>
          <DialogDescription>
            Configure sua banca inicial, meta mensal e tamanho padrão do lote para acompanhar seu progresso personalizado.
          </DialogDescription>
        </DialogHeader>

        {/* Resumo Atual */}
        {user?.initialBalance && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  Banca Atual
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-blue-600">
                  R$ {currentBalance.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  Meta Mensal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-purple-600">
                  R$ {monthlyGoal.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Progresso
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold text-green-600">
                  {progressPercentage.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialBalance">Banca Inicial (R$)</Label>
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                placeholder="1000.00"
                {...register("initialBalance")}
              />
              {errors.initialBalance && (
                <p className="text-sm text-red-500">{errors.initialBalance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyGoal">Meta Mensal (R$)</Label>
              <Input
                id="monthlyGoal"
                type="number"
                step="0.01"
                placeholder="500.00"
                {...register("monthlyGoal")}
              />
              {errors.monthlyGoal && (
                <p className="text-sm text-red-500">{errors.monthlyGoal.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultLotSize">Tamanho Padrão do Lote</Label>
            <Input
              id="defaultLotSize"
              type="number"
              step="0.01"
              placeholder="0.01"
              {...register("defaultLotSize")}
            />
            {errors.defaultLotSize && (
              <p className="text-sm text-red-500">{errors.defaultLotSize.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Defina o tamanho padrão do lote que você geralmente usa (ex: 0.01, 0.1, 1.0)
            </p>
          </div>

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
              disabled={updateBankConfigMutation.isPending}
            >
              {updateBankConfigMutation.isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}