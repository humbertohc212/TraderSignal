import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Subscribe() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redireciona automaticamente para a página de planos
    setLocation('/plans');
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <Card className="bg-gray-800/90 border-gray-700 p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Redirecionando para os planos...
        </h2>
        <p className="text-gray-400 mb-6">
          Você será redirecionado para escolher seu plano ideal.
        </p>
        <Button 
          onClick={() => setLocation('/plans')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Ver Planos Agora
        </Button>
      </Card>
    </div>
  );
};