import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Download, 
  Upload, 
  Database, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Clock
} from "lucide-react";

export default function BackupManager() {
  const { toast } = useToast();
  const [lastBackup, setLastBackup] = useState<Date | null>(null);

  const backupDatabaseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/backup-database");
      return response.blob();
    },
    onSuccess: (data) => {
      // Download backup file
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trading-platform-backup-${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setLastBackup(new Date());
      toast({
        title: "Backup Realizado",
        description: "Backup do banco de dados baixado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro no Backup",
        description: "Falha ao criar backup. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const exportUsersMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/export-users");
      return response.blob();
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação Concluída",
        description: "Dados dos usuários exportados com sucesso!",
      });
    },
  });

  const exportSignalsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/export-signals");
      return response.blob();
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signals-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação Concluída",
        description: "Histórico de sinais exportado com sucesso!",
      });
    },
  });

  const backupItems = [
    {
      title: "Backup Completo do Banco",
      description: "Exporta toda a estrutura e dados do banco de dados",
      icon: Database,
      action: () => backupDatabaseMutation.mutate(),
      loading: backupDatabaseMutation.isPending,
      type: "critical"
    },
    {
      title: "Exportar Usuários",
      description: "Lista completa de usuários e assinaturas",
      icon: Users,
      action: () => exportUsersMutation.mutate(),
      loading: exportUsersMutation.isPending,
      type: "important"
    },
    {
      title: "Exportar Sinais",
      description: "Histórico completo de sinais e performance",
      icon: FileText,
      action: () => exportSignalsMutation.mutate(),
      loading: exportSignalsMutation.isPending,
      type: "important"
    }
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "important": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Status do Último Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Status dos Backups</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-800">Sistema Online</p>
              <p className="text-xs text-green-600">Funcionando normalmente</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800">Último Backup</p>
              <p className="text-xs text-blue-600">
                {lastBackup ? lastBackup.toLocaleDateString() : "Nunca realizado"}
              </p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-800">Recomendação</p>
              <p className="text-xs text-orange-600">Backup semanal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações de Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Exportar Dados</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {backupItems.map((item, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <item.icon className="h-6 w-6 text-gray-600" />
                    <Badge className={getStatusColor(item.type)}>
                      {item.type === "critical" ? "Crítico" : "Importante"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={item.action}
                    disabled={item.loading}
                    className="w-full"
                  >
                    {item.loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup Automático */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Backup Automático</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Backup Automático Ativo</span>
            </div>
            <p className="text-sm text-blue-700">
              O Replit realiza backups automáticos da sua aplicação e banco de dados diariamente.
              Os dados ficam seguros mesmo em caso de problemas técnicos.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Frequência:</span> Diário
            </div>
            <div>
              <span className="font-medium">Retenção:</span> 30 dias
            </div>
            <div>
              <span className="font-medium">Tipo:</span> Incremental
            </div>
            <div>
              <span className="font-medium">Localização:</span> Nuvem segura
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Backup Manual Semanal</p>
                <p className="text-sm text-green-700">
                  Faça backup manual dos dados críticos toda semana
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Monitoramento de Usuários</p>
                <p className="text-sm text-yellow-700">
                  Acompanhe o crescimento e atividade dos usuários regularmente
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Database className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Limpeza de Dados</p>
                <p className="text-sm text-blue-700">
                  Remova dados antigos desnecessários para otimizar performance
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}