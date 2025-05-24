import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Plans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: plans, isLoading } = useQuery({
    queryKey: ["/api/plans"],
    queryFn: async () => {
      const token = localStorage.getItem('auth-token');
      const response = await fetch("/api/plans", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }
      return response.json();
    },
    staleTime: 0, // Sempre buscar dados frescos
    refetchOnMount: true, // Recarregar ao montar
  });

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
                    R$ {plan.price?.toFixed(2) || plan.price}
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