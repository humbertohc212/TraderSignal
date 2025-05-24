import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface CheckoutProps {
  planId?: string;
}

export default function Checkout() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [plan, setPlan] = useState<any>(null);
  
  // Extrair planId da URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const planId = urlParams.get('planId');

  useEffect(() => {
    if (planId) {
      fetchPlan(planId);
    }
  }, [planId]);

  const fetchPlan = async (id: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/plans/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const planData = await response.json();
        setPlan(planData);
      } else {
        console.error('Erro ao buscar plano:', response.status);
        // Fallback com dados básicos se a busca falhar
        setPlan({
          id: id,
          name: 'Plano Premium',
          price: 97.00,
          description: 'Acesso completo aos sinais'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      // Fallback com dados básicos se houver erro de rede
      setPlan({
        id: id,
        name: 'Plano Premium',
        price: 97.00,
        description: 'Acesso completo aos sinais'
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Chave PIX copiada para a área de transferência",
    });
  };

  const sendToWhatsApp = () => {
    if (!user || !plan) return;
    
    const message = `Olá! Gostaria de ativar o plano *${plan.name}* no valor de *R$ ${plan.price}*.

📧 Email: ${user.email}
📱 Nome: ${user.firstName} ${user.lastName}
💰 Plano: ${plan.name} - R$ ${plan.price}

Enviarei o comprovante do PIX em seguida.`;
    
    const whatsappUrl = `https://wa.me/5581920327778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const pixKey = "homercavalcanti@gmail.com"; // Sua chave PIX

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Finalizar Assinatura</h1>
          <p className="text-gray-300">Complete seu pagamento via PIX</p>
        </div>

        {/* Plano Selecionado */}
        <Card className="mb-6 border-blue-500/20 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Plano Selecionado
              {plan.isPopular && <Badge className="bg-blue-600">Popular</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="text-gray-300">
                  {plan.signalsPerWeek} sinais por semana
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-400">
                  R$ {plan.price}
                </div>
                <div className="text-sm text-gray-400">por mês</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                {plan.hasEducationalAccess && "Acesso educacional"}
              </div>
              {plan.hasPrioritySupport && (
                <div className="flex items-center text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Suporte prioritário
                </div>
              )}
              {plan.hasWhatsappSupport && (
                <div className="flex items-center text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Suporte via WhatsApp
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagamento PIX */}
        <Card className="mb-6 border-green-500/20 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white">💳 Pagamento via PIX</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Chave PIX */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chave PIX
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-gray-700 rounded-lg font-mono text-white">
                  {pixKey}
                </div>
                <Button
                  onClick={() => copyToClipboard(pixKey)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white rounded-lg">
                <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="text-sm">QR Code PIX</div>
                    <div className="text-xs mt-1">R$ {plan.price}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">📋 Instruções:</h4>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Copie a chave PIX ou escaneie o QR Code</li>
                <li>Faça o pagamento no seu banco ou app</li>
                <li>Tire print do comprovante</li>
                <li>Clique no botão abaixo para enviar via WhatsApp</li>
                <li>Aguarde a liberação do seu acesso (até 2 horas)</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Botão WhatsApp */}
        <Card className="border-green-500/20 bg-green-900/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Enviar Comprovante
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Após fazer o pagamento, envie o comprovante para liberar seu acesso
              </p>
              
              {/* QR Code do WhatsApp */}
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img 
                  src="/attached_assets/WhatsApp Image 2025-05-24 at 03.32.03.jpeg" 
                  alt="QR Code WhatsApp" 
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-xs text-gray-600 mt-2">Escaneie para contato direto</p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={sendToWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Enviar Comprovante via WhatsApp
                </Button>
                
                <p className="text-xs text-gray-400">
                  WhatsApp: (81) 92032778
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Seu acesso será liberado em até 2 horas após confirmação do pagamento</p>
          <p className="mt-2">Dúvidas? Entre em contato via WhatsApp</p>
        </div>
      </div>
    </div>
  );
}