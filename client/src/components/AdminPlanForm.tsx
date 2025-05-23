import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

const planFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório"),
  currency: z.string().default("BRL"),
  signalsPerWeek: z.number().min(1, "Mínimo 1 sinal por semana"),
  hasEducationalAccess: z.boolean(),
  hasPrioritySupport: z.boolean(),
  hasExclusiveAnalysis: z.boolean(),
  hasMentoring: z.boolean(),
  hasWhatsappSupport: z.boolean(),
  hasDetailedReports: z.boolean(),
  isPopular: z.boolean(),
});

type PlanFormData = z.infer<typeof planFormSchema>;

interface AdminPlanFormProps {
  plan?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminPlanForm({ plan, onClose, onSuccess }: AdminPlanFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!plan;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: plan ? {
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      signalsPerWeek: plan.signalsPerWeek,
      hasEducationalAccess: plan.hasEducationalAccess,
      hasPrioritySupport: plan.hasPrioritySupport,
      hasExclusiveAnalysis: plan.hasExclusiveAnalysis,
      hasMentoring: plan.hasMentoring,
      hasWhatsappSupport: plan.hasWhatsappSupport,
      hasDetailedReports: plan.hasDetailedReports,
      isPopular: plan.isPopular,
    } : {
      currency: "BRL",
      signalsPerWeek: 5,
      hasEducationalAccess: false,
      hasPrioritySupport: false,
      hasExclusiveAnalysis: false,
      hasMentoring: false,
      hasWhatsappSupport: false,
      hasDetailedReports: false,
      isPopular: false,
    }
  });

  const planMutation = useMutation({
    mutationFn: async (data: PlanFormData) => {
      const url = isEditing ? `/api/plans/${plan.id}` : "/api/plans";
      const method = isEditing ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({
        title: isEditing ? "Plano atualizado" : "Plano criado",
        description: `O plano foi ${isEditing ? "atualizado" : "criado"} com sucesso.`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PlanFormData) => {
    planMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            {isEditing ? "Editar Plano" : "Novo Plano"}
          </CardTitle>
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
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano</Label>
                <Input
                  {...register("name")}
                  placeholder="Ex: Premium"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  placeholder="97.00"
                />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signalsPerWeek">Sinais por Semana</Label>
                <Input
                  {...register("signalsPerWeek", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  placeholder="15"
                />
                {errors.signalsPerWeek && (
                  <p className="text-sm text-red-600">{errors.signalsPerWeek.message}</p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Recursos Incluídos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasEducationalAccess">Acesso Educacional</Label>
                  <Switch
                    checked={watch("hasEducationalAccess")}
                    onCheckedChange={(checked) => setValue("hasEducationalAccess", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasPrioritySupport">Suporte Prioritário</Label>
                  <Switch
                    checked={watch("hasPrioritySupport")}
                    onCheckedChange={(checked) => setValue("hasPrioritySupport", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasExclusiveAnalysis">Análises Exclusivas</Label>
                  <Switch
                    checked={watch("hasExclusiveAnalysis")}
                    onCheckedChange={(checked) => setValue("hasExclusiveAnalysis", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasMentoring">Mentoria em Grupo</Label>
                  <Switch
                    checked={watch("hasMentoring")}
                    onCheckedChange={(checked) => setValue("hasMentoring", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasWhatsappSupport">Suporte WhatsApp</Label>
                  <Switch
                    checked={watch("hasWhatsappSupport")}
                    onCheckedChange={(checked) => setValue("hasWhatsappSupport", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hasDetailedReports">Relatórios Detalhados</Label>
                  <Switch
                    checked={watch("hasDetailedReports")}
                    onCheckedChange={(checked) => setValue("hasDetailedReports", checked)}
                  />
                </div>
              </div>
            </div>

            {/* Special Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPopular">Marcar como Popular</Label>
                  <p className="text-sm text-gray-500">Destacar este plano na página de preços</p>
                </div>
                <Switch
                  checked={watch("isPopular")}
                  onCheckedChange={(checked) => setValue("isPopular", checked)}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={planMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {planMutation.isPending 
                  ? (isEditing ? "Atualizando..." : "Criando...") 
                  : (isEditing ? "Atualizar Plano" : "Criar Plano")
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={planMutation.isPending}
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