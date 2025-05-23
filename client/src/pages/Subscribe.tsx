import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = ({ planId }: { planId: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?success=true`,
      },
    });

    if (error) {
      toast({
        title: "Falha no Pagamento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Pagamento Realizado!",
        description: "Sua assinatura foi ativada com sucesso!",
      });
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processando..." : "Confirmar Assinatura"}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  const { data: plans } = useQuery({
    queryKey: ["/api/plans"],
  });

  useEffect(() => {
    if (selectedPlan) {
      // Create subscription when plan is selected
      apiRequest("POST", "/api/create-subscription", { planId: selectedPlan })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            toast({
              title: "Erro",
              description: "Não foi possível criar a assinatura. Tente novamente.",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          console.error("Error creating subscription:", error);
          toast({
            title: "Erro",
            description: "Erro ao processar pagamento. Tente novamente.",
            variant: "destructive",
          });
        });
    }
  }, [selectedPlan, toast]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Você precisa estar logado para assinar um plano.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedPlan && clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Finalizar Assinatura</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm planId={selectedPlan} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-gray-600">
            Comece sua jornada de trading com sinais profissionais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans?.map((plan: any) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.isPopular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white flex items-center space-x-1 px-3 py-1">
                    <Crown className="h-3 w-3" />
                    <span>Mais Popular</span>
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">
                    R$ {plan.price}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{plan.signalsPerWeek} sinais por semana</span>
                  </div>
                  
                  {plan.hasEducationalAccess && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Acesso completo às aulas</span>
                    </div>
                  )}
                  
                  {plan.hasPrioritySupport && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Suporte prioritário</span>
                    </div>
                  )}
                  
                  {plan.hasExclusiveAnalysis && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Análises exclusivas</span>
                    </div>
                  )}
                  
                  {plan.hasMentoring && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Mentoria em grupo</span>
                    </div>
                  )}
                  
                  {plan.hasWhatsappSupport && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Suporte via WhatsApp</span>
                    </div>
                  )}
                  
                  {plan.hasDetailedReports && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Relatórios detalhados</span>
                    </div>
                  )}
                </div>

                <Button 
                  className={`w-full ${
                    plan.isPopular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.isPopular && <Star className="h-4 w-4 mr-2" />}
                  Assinar Agora
                </Button>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    <span>Pagamento seguro via Stripe</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Todos os planos incluem acesso aos sinais em tempo real e suporte técnico.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Cancele a qualquer momento. Sem taxa de cancelamento.
          </p>
        </div>
      </div>
    </div>
  );
}