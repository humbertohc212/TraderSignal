import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function Plans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Planos fixos temporariamente até resolvermos a API
  const plans = [
    {
      id: 4,
      name: "Free Trial",
      price: 0,
      currency: "BRL",
      isPopular: false,
      features: [
        "21 sinais por semana",
        "Acesso ao conteúdo educacional"
      ]
    },
    {
      id: 1,
      name: "Básico", 
      price: 47,
      currency: "BRL",
      isPopular: false,
      features: [
        "5 sinais por semana",
        "Acesso ao conteúdo educacional"
      ]
    },
    {
      id: 2,
      name: "Premium",
      price: 97,
      currency: "BRL", 
      isPopular: true,
      features: [
        "15 sinais por semana",
        "Acesso ao conteúdo educacional",
        "Suporte prioritário",
        "Análises exclusivas"
      ]
    },
    {
      id: 3,
      name: "VIP",
      price: 197,
      currency: "BRL",
      isPopular: false,
      features: [
        "Sinais ilimitados",
        "Acesso ao conteúdo educacional",
        "Suporte prioritário", 
        "Análises exclusivas",
        "Mentoria personalizada",
        "Suporte via WhatsApp",
        "Relatórios detalhados"
      ]
    }
  ];
  
  const isLoading = false;

  const handleSubscribe = async (planId: number, planName: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para solicitar um plano",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    // Redirecionar para checkout com o ID do plano
    setLocation(`/checkout?planId=${planId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Botão Home */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="bg-transparent border-gray-600 text-white hover:bg-gray-700">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Escolha seu plano
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Entre em contato conosco para ativar seu plano e ter acesso aos melhores sinais de trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans?.map((plan: any) => (
            <Card key={plan.id} className="bg-gray-800/90 border-gray-700 overflow-hidden relative">
              <div className="p-6">
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline text-white">
                  <span className="text-4xl font-bold">
                    R$ {typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}
                  </span>
                  <span className="text-gray-400 ml-1">/mês</span>
                </div>

                <ul className="mt-6 space-y-4">
                  {plan.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-8 bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleSubscribe(plan.id, plan.name)}
                  disabled={user?.subscriptionPlan === plan.name}
                >
                  {user?.subscriptionPlan === plan.name
                    ? "Plano Atual"
                    : "Solicitar Assinatura"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Precisa de ajuda ou tem dúvidas sobre os planos?
          </p>
          <Button variant="outline" className="bg-transparent border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
            Entre em Contato
          </Button>
        </div>
      </div>
    </div>
  );
}