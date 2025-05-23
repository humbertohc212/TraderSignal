import { useSubscription } from "@/hooks/useSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock, Clock, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature?: string;
  showExpiredContent?: boolean;
}

export default function SubscriptionGuard({ 
  children, 
  feature = "este recurso",
  showExpiredContent = false 
}: SubscriptionGuardProps) {
  const { isActive, status, daysUntilExpiry, plan } = useSubscription();

  // Admin sempre tem acesso
  if (status === "admin") {
    return <>{children}</>;
  }

  // Usuário com assinatura ativa
  if (isActive) {
    // Mostrar aviso se está próximo do vencimento (menos de 7 dias)
    if (daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      return (
        <div className="space-y-4">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Sua assinatura expira em {daysUntilExpiry} dias. 
                  <Link href="/plans" className="ml-1 underline font-medium">
                    Renovar agora
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
          {children}
        </div>
      );
    }
    
    return <>{children}</>;
  }

  // Usuário sem assinatura ou com assinatura expirada
  const isExpired = status === "expired";
  
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {isExpired ? (
            <AlertTriangle className="h-12 w-12 text-red-500" />
          ) : (
            <Lock className="h-12 w-12 text-red-500" />
          )}
        </div>
        <CardTitle className="text-red-800">
          {isExpired ? "Assinatura Expirada" : "Assinatura Necessária"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-red-700">
          {isExpired 
            ? `Sua assinatura expirou. Renove para continuar acessando ${feature}.`
            : `Você precisa de uma assinatura ativa para acessar ${feature}.`
          }
        </p>
        
        {plan && (
          <Badge variant="outline" className="border-red-300 text-red-700">
            Plano: {plan}
          </Badge>
        )}
        
        <div className="space-y-2">
          <Link href="/plans">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Crown className="h-4 w-4 mr-2" />
              {isExpired ? "Renovar Assinatura" : "Ver Planos"}
            </Button>
          </Link>
          
          {showExpiredContent && (
            <p className="text-xs text-gray-600">
              Conteúdo limitado disponível abaixo
            </p>
          )}
        </div>
      </CardContent>
      
      {showExpiredContent && (
        <div className="border-t border-red-200 p-4 bg-white">
          <div className="opacity-60 pointer-events-none">
            {children}
          </div>
        </div>
      )}
    </Card>
  );
}