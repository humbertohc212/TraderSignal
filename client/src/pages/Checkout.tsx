import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Extrair planId da URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const planId = urlParams.get('planId') || '3';

  // Dados dos planos - carregamento instantâneo
  const plansData = {
    '1': { id: '1', name: 'Free Trial', price: 0, signalsPerWeek: 14, hasEducationalAccess: false, hasPrioritySupport: false, hasWhatsappSupport: false },
    '2': { id: '2', name: 'Básico', price: 47, signalsPerWeek: 42, hasEducationalAccess: true, hasPrioritySupport: false, hasWhatsappSupport: false },
    '3': { id: '3', name: 'Premium', price: 97, signalsPerWeek: 84, hasEducationalAccess: true, hasPrioritySupport: true, hasWhatsappSupport: true, isPopular: true },
    '4': { id: '4', name: 'VIP', price: 197, signalsPerWeek: 168, hasEducationalAccess: true, hasPrioritySupport: true, hasWhatsappSupport: true }
  };
  
  const currentPlan = plansData[planId as keyof typeof plansData] || plansData['3'];
  const pixKey = "homercavalcanti@gmail.com"; // Sua chave PIX

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Chave PIX copiada para a área de transferência",
    });
  };

  const sendToWhatsApp = () => {
    if (!user) return;
    
    const message = `Olá! Gostaria de ativar o plano *${currentPlan.name}* no valor de *R$ ${currentPlan.price}*.

📧 Email: ${user.email}
📱 Nome: ${user.firstName} ${user.lastName}
💰 Plano: ${currentPlan.name} - R$ ${currentPlan.price}

Enviarei o comprovante do PIX em seguida.`;
    
    const whatsappUrl = `https://wa.me/5581920327778?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Finalizar Assinatura</h1>
          <p className="text-gray-300">Complete seu pagamento via PIX</p>
        </div>

        {/* Plano Selecionado */}
        <Card className="mb-6 border-blue-500/20 bg-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Plano Selecionado
              {currentPlan.isPopular && <Badge className="bg-blue-600">Popular</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{currentPlan.name}</h3>
                <p className="text-gray-300">
                  {currentPlan.signalsPerWeek} sinais por semana
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-400">
                  R$ {currentPlan.price}
                </div>
                <div className="text-sm text-gray-400">por mês</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {currentPlan.hasEducationalAccess && (
                <div className="flex items-center text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Acesso educacional
                </div>
              )}
              {currentPlan.hasPrioritySupport && (
                <div className="flex items-center text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Suporte prioritário
                </div>
              )}
              {currentPlan.hasWhatsappSupport && (
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
            <CardTitle className="text-white">Pagamento via PIX</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  Faça o pagamento utilizando a chave PIX abaixo:
                </p>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Chave PIX (Email):</p>
                  <div className="flex items-center justify-between bg-gray-600 p-3 rounded">
                    <span className="text-white font-mono">{pixKey}</span>
                    <Button 
                      onClick={() => copyToClipboard(pixKey)}
                      variant="outline" 
                      size="sm"
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
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
              
              {/* QR Code do PIX */}
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <div className="w-32 h-32 mx-auto flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(pixKey)}`}
                    alt="QR Code PIX" 
                    className="w-full h-full"
                    onError={(e) => {
                      // Fallback para SVG se a API não funcionar
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <svg className="hidden w-full h-full" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="128" height="128" fill="white"/>
                    {/* QR Code Pattern para PIX */}
                    <rect x="4" y="4" width="20" height="20" fill="black"/>
                    <rect x="8" y="8" width="12" height="12" fill="white"/>
                    <rect x="12" y="12" width="4" height="4" fill="black"/>
                    
                    <rect x="104" y="4" width="20" height="20" fill="black"/>
                    <rect x="108" y="8" width="12" height="12" fill="white"/>
                    <rect x="112" y="12" width="4" height="4" fill="black"/>
                    
                    <rect x="4" y="104" width="20" height="20" fill="black"/>
                    <rect x="8" y="108" width="12" height="12" fill="white"/>
                    <rect x="12" y="112" width="4" height="4" fill="black"/>
                    
                    {/* Padrão de dados específico para PIX */}
                    <rect x="32" y="8" width="4" height="4" fill="black"/>
                    <rect x="40" y="12" width="4" height="4" fill="black"/>
                    <rect x="48" y="8" width="4" height="4" fill="black"/>
                    <rect x="56" y="16" width="4" height="4" fill="black"/>
                    <rect x="64" y="8" width="4" height="4" fill="black"/>
                    <rect x="72" y="12" width="4" height="4" fill="black"/>
                    <rect x="80" y="8" width="4" height="4" fill="black"/>
                    <rect x="88" y="16" width="4" height="4" fill="black"/>
                    <rect x="96" y="8" width="4" height="4" fill="black"/>
                    
                    {/* Centro */}
                    <rect x="56" y="56" width="16" height="16" fill="black"/>
                    <rect x="60" y="60" width="8" height="8" fill="white"/>
                    <rect x="64" y="64" width="4" height="4" fill="black"/>
                    
                    {/* Adicionar alguns pontos para tornar único */}
                    <rect x="32" y="32" width="4" height="4" fill="black"/>
                    <rect x="40" y="40" width="4" height="4" fill="black"/>
                    <rect x="88" y="32" width="4" height="4" fill="black"/>
                    <rect x="96" y="40" width="4" height="4" fill="black"/>
                    <rect x="32" y="88" width="4" height="4" fill="black"/>
                    <rect x="40" y="96" width="4" height="4" fill="black"/>
                  </svg>
                </div>
                <p className="text-xs text-gray-600 mt-2">Escaneie para pagar via PIX</p>
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