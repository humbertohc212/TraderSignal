import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const lessonFormSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  videoUrl: z.string().url("URL do vídeo inválida").optional().or(z.literal("")),
  category: z.string().min(1, "Categoria é obrigatória"),
  level: z.enum(["Iniciante", "Intermediário", "Avançado"]),
  duration: z.number().min(1, "Duração deve ser maior que 0").optional(),
  thumbnailUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  isPublished: z.boolean(),
});

type LessonFormData = z.infer<typeof lessonFormSchema>;

interface AdminLessonFormProps {
  lesson?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLessonForm({ lesson, isOpen, onClose, onSuccess }: AdminLessonFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: lesson?.title || "",
      description: lesson?.description || "",
      content: lesson?.content || "",
      videoUrl: lesson?.videoUrl || "",
      category: lesson?.category || "",
      level: lesson?.level || "Iniciante",
      duration: lesson?.duration || 0,
      thumbnailUrl: lesson?.thumbnailUrl || "",
      isPublished: lesson?.isPublished || false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LessonFormData) => {
      const token = localStorage.getItem('auth-token');
      const url = lesson ? `/api/lessons/${lesson.id}` : "/api/lessons";
      const method = lesson ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao salvar aula');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      toast({
        title: "Sucesso",
        description: lesson ? "Aula atualizada com sucesso!" : "Aula criada com sucesso!",
      });
      onSuccess();
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar aula",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LessonFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lesson ? "Editar Aula" : "Nova Aula"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Ex: Introdução ao Forex"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Breve descrição da aula..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo *</Label>
            <Textarea
              id="content"
              {...form.register("content")}
              placeholder="Conteúdo completo da aula..."
              rows={8}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL do Vídeo</Label>
            <Input
              id="videoUrl"
              {...form.register("videoUrl")}
              placeholder="https://youtube.com/watch?v=... ou outro link de vídeo"
            />
            {form.formState.errors.videoUrl && (
              <p className="text-sm text-red-600">{form.formState.errors.videoUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                {...form.register("category")}
                placeholder="Ex: Trading Básico"
              />
              {form.formState.errors.category && (
                <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Nível *</Label>
              <Select
                value={form.watch("level")}
                onValueChange={(value) => form.setValue("level", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Iniciante">Iniciante</SelectItem>
                  <SelectItem value="Intermediário">Intermediário</SelectItem>
                  <SelectItem value="Avançado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                {...form.register("duration", { valueAsNumber: true })}
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">URL da Thumbnail</Label>
              <Input
                id="thumbnailUrl"
                {...form.register("thumbnailUrl")}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={form.watch("isPublished")}
              onCheckedChange={(checked) => form.setValue("isPublished", checked)}
            />
            <Label htmlFor="isPublished">Publicar aula</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : lesson ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}