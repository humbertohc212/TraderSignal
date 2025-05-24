import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, TrendingUp, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bankConfigSchema = z.object({
  initialBalance: z.string().min(1, "Banca inicial é obrigatória"),
  monthlyGoal: z.string().min(1, "Meta mensal é obrigatória"),
  defaultLotSize: z.string().min(1, "Tamanho do lote é obrigatório"),
});

type BankConfigFormData = z.infer<typeof bankConfigSchema>;

interface BankConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BankConfigModal({ isOpen, onClose }: BankConfigModalProps) {
  const { toast } = useToast();

  // Carregar dados do localStorage
  const initialBanca = parseFloat(localStorage.getItem('initialBanca') || '2000');
  const monthlyTarget = parseFloat(localStorage.getItem('monthlyGoal') || '800');
  const currentProgress = parseFloat(localStorage.getItem('currentProgress') || '200');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BankConfigFormData>({
    resolver: zodResolver(bankConfigSchema),
    defaultValues: {
      initialBalance: initialBanca.toString(),
      monthlyGoal: monthlyTarget.toString(),
      defaultLotSize: "0.1",
    },
  });

  const onSubmit = (data: BankConfigFormData) => {
    // Salvar no localStorage
    localStorage.setItem('initialBanca', data.initialBalance);
    localStorage.setItem('monthlyGoal', data.monthlyGoal);
    localStorage.setItem('defaultLotSize', data.defaultLotSize);
    
    toast({
      title: "Configurações Salvas!",
      description: "Sua banca e meta foram configuradas com sucesso.",
      className: "bg-green-600 text-white border-green-700"
    });
    
    onClose();
    reset();
    
    // Forçar atualização da página para refletir mudanças
    window.location.reload();
  };

  // Calcular progresso atual
  const progressPercentage = monthlyTarget > 0 ? (currentProgress / monthlyTarget) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <DollarSign className="h-5 w-5" />
            Configuração da Banca e Meta
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Configure sua banca inicial, meta mensal e tamanho padrão do lote para acompanhar seu progresso personalizado.
          </DialogDescription>
        </DialogHeader>

        {/* Resumo Atual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gray-700/50 border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-300">
                <DollarSign className="h-4 w-4 text-blue-400" />
                Banca Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-blue-400">
                R$ {(initialBanca + currentProgress).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700/50 border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-300">
                <Target className="h-4 w-4 text-purple-400" />
                Meta Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-purple-400">
                R$ {monthlyTarget.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700/50 border-gray-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-300">
                <TrendingUp className="h-4 w-4 text-green-400" />
                Progresso
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-400">
                {progressPercentage.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialBalance" className="text-gray-300">Banca Inicial (R$)</Label>
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                placeholder="2000.00"
                className="bg-gray-700 border-gray-600 text-white"
                {...register("initialBalance")}
              />
              {errors.initialBalance && (
                <p className="text-sm text-red-400">{errors.initialBalance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyGoal" className="text-gray-300">Meta Mensal (R$)</Label>
              <Input
                id="monthlyGoal"
                type="number"
                step="0.01"
                placeholder="800.00"
                className="bg-gray-700 border-gray-600 text-white"
                {...register("monthlyGoal")}
              />
              {errors.monthlyGoal && (
                <p className="text-sm text-red-400">{errors.monthlyGoal.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultLotSize" className="text-gray-300">Tamanho Padrão do Lote</Label>
            <Input
              id="defaultLotSize"
              type="number"
              step="0.01"
              placeholder="0.1"
              className="bg-gray-700 border-gray-600 text-white"
              {...register("defaultLotSize")}
            />
            {errors.defaultLotSize && (
              <p className="text-sm text-red-400">{errors.defaultLotSize.message}</p>
            )}
            <p className="text-xs text-gray-400">
              Defina o tamanho padrão do lote que você geralmente usa (ex: 0.01, 0.1, 1.0)
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Salvar Configurações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}