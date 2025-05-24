import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Check, X, Clock, Users } from "lucide-react";

interface SubscriptionRequest {
  id: number;
  userId: string;
  planId: number;
  planName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export default function AdminSubscriptionRequests() {
  const { toast } = useToast();
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["/api/admin/subscription-requests"],
    queryFn: async () => {
      const token = localStorage.getItem('auth-token');
      const response = await fetch("/api/admin/subscription-requests", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch subscription requests");
      }
      return response.json();
    },
  });

  const processRequestMutation = useMutation({
    mutationFn: async ({ requestId, action }: { requestId: number; action: 'approve' | 'reject' }) => {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/subscription-requests/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao processar solicitação');
      }
      
      return response.json();
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscription-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setProcessingRequest(null);
      toast({
        title: "Sucesso",
        description: `Solicitação ${action === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso!`,
      });
    },
    onError: () => {
      setProcessingRequest(null);
      toast({
        title: "Erro",
        description: "Falha ao processar solicitação",
        variant: "destructive",
      });
    },
  });

  const handleProcessRequest = (requestId: number, action: 'approve' | 'reject') => {
    setProcessingRequest(requestId);
    processRequestMutation.mutate({ requestId, action });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><Check className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Solicitações de Assinatura</h2>
      </div>

      {!requests || requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhuma solicitação de assinatura encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request: SubscriptionRequest) => (
            <Card key={request.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{request.planName}</CardTitle>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Usuário:</p>
                    <p className="font-medium">{request.user?.email || request.userId}</p>
                    {(request.user?.firstName || request.user?.lastName) && (
                      <p className="text-sm text-gray-600">
                        {request.user.firstName} {request.user.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Data da Solicitação:</p>
                    <p className="font-medium">
                      {new Date(request.requestDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleProcessRequest(request.id, 'approve')}
                      disabled={processingRequest === request.id}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleProcessRequest(request.id, 'reject')}
                      disabled={processingRequest === request.id}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                )}

                {request.processedDate && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Processado em: {new Date(request.processedDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}