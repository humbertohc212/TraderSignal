import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown } from "lucide-react";

export default function Plans() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["/api/plans"],
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(price));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Planos de Assinatura</h1>
            <p className="mt-2 text-gray-600">
              Escolha o plano ideal para sua jornada de trading
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg shadow-sm border h-96"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans?.map((plan: any) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${
                    plan.isPopular 
                      ? 'border-amber-500 shadow-lg' 
                      : 'border-gray-200'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-amber-500 text-slate-900 flex items-center space-x-1">
                        <Crown className="h-3 w-3" />
                        <span>Mais Popular</span>
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-gray-600">/mês</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          {plan.signalsPerWeek} sinais por semana
                        </span>
                      </div>
                      
                      {plan.hasEducationalAccess && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Acesso às aulas</span>
                        </div>
                      )}
                      
                      {plan.hasPrioritySupport && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Suporte prioritário</span>
                        </div>
                      )}
                      
                      {plan.hasExclusiveAnalysis && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Análises exclusivas</span>
                        </div>
                      )}
                      
                      {plan.hasMentoring && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Mentoria em grupo</span>
                        </div>
                      )}
                      
                      {plan.hasWhatsappSupport && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Suporte WhatsApp</span>
                        </div>
                      )}
                      
                      {plan.hasDetailedReports && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Relatórios detalhados</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        plan.isPopular 
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      Assinar Agora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Por que escolher nossos planos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Resultados Comprovados
                </h3>
                <p className="text-gray-600">
                  Taxa de acerto superior a 75% em nossos sinais
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Suporte Especializado
                </h3>
                <p className="text-gray-600">
                  Equipe de especialistas para tirar suas dúvidas
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Educação Completa
                </h3>
                <p className="text-gray-600">
                  Cursos do básico ao avançado para sua evolução
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
