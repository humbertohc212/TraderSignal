import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Target, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Share2, 
  Star,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";

export default function LaunchStrategy() {
  const launchPhases = [
    {
      phase: "Fase 1: Pré-Lançamento",
      duration: "1-2 semanas",
      color: "bg-blue-100 text-blue-800",
      tasks: [
        "Configurar Google Analytics e Facebook Pixel",
        "Criar contas nas redes sociais (Instagram, Twitter, TikTok)",
        "Preparar 10-15 sinais de exemplo com bons resultados",
        "Criar landing page de captura de leads",
        "Configurar sistema de email marketing"
      ]
    },
    {
      phase: "Fase 2: Lançamento Soft",
      duration: "2-3 semanas",
      color: "bg-yellow-100 text-yellow-800",
      tasks: [
        "Lançar para lista de conhecidos (50-100 pessoas)",
        "Coletar feedback e fazer ajustes",
        "Criar primeiros casos de sucesso",
        "Iniciar produção de conteúdo educativo",
        "Configurar sistema de suporte via WhatsApp"
      ]
    },
    {
      phase: "Fase 3: Lançamento Público",
      duration: "Ongoing",
      color: "bg-green-100 text-green-800",
      tasks: [
        "Campanha de marketing digital completa",
        "Parcerias com influenciadores de trading",
        "Sistema de afiliados (implementar depois)",
        "Webinars e lives educativas",
        "Otimização contínua baseada em dados"
      ]
    }
  ];

  const marketingChannels = [
    {
      channel: "Instagram",
      strategy: "Posts diários com resultados de sinais",
      investment: "R$ 500-1000/mês",
      roi: "Alto potencial",
      icon: MessageCircle
    },
    {
      channel: "YouTube",
      strategy: "Análises técnicas e educação",
      investment: "Tempo + R$ 200/mês",
      roi: "Médio-Alto prazo",
      icon: Target
    },
    {
      channel: "TikTok",
      strategy: "Vídeos curtos sobre trading",
      investment: "Tempo + R$ 300/mês",
      roi: "Alto para público jovem",
      icon: TrendingUp
    },
    {
      channel: "Google Ads",
      strategy: "Anúncios para palavras-chave específicas",
      investment: "R$ 1000-2000/mês",
      roi: "Alto com boa conversão",
      icon: Star
    }
  ];

  const keyMetrics = [
    { metric: "Taxa de Conversão", target: "3-5%", description: "Visitantes que se tornam assinantes" },
    { metric: "CAC (Custo por Cliente)", target: "< R$ 150", description: "Quanto custa adquirir um cliente" },
    { metric: "LTV (Valor Vitalício)", target: "> R$ 500", description: "Receita total por cliente" },
    { metric: "Churn Rate", target: "< 10%/mês", description: "Taxa de cancelamento mensal" },
    { metric: "Win Rate dos Sinais", target: "> 65%", description: "Porcentagem de sinais lucrativos" }
  ];

  const pricingStrategy = [
    {
      tier: "Freemium",
      price: "Grátis",
      features: ["2 sinais/semana", "Acesso básico às aulas"],
      purpose: "Atrair e converter leads"
    },
    {
      tier: "Básico",
      price: "R$ 47/mês",
      features: ["10 sinais/semana", "Suporte email", "Aulas completas"],
      purpose: "Entrada acessível"
    },
    {
      tier: "Premium",
      price: "R$ 97/mês",
      features: ["Sinais ilimitados", "Suporte WhatsApp", "Análises exclusivas"],
      purpose: "Maior margem e valor"
    },
    {
      tier: "VIP",
      price: "R$ 197/mês",
      features: ["Tudo do Premium", "Mentoria em grupo", "Relatórios detalhados"],
      purpose: "Clientes premium"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Estratégia de Lançamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>Roadmap de Lançamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {launchPhases.map((phase, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{phase.phase}</h3>
                  <Badge className={phase.color}>{phase.duration}</Badge>
                </div>
                <div className="space-y-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Canais de Marketing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>Estratégia de Marketing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketingChannels.map((channel, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <channel.icon className="h-5 w-5" />
                    <CardTitle className="text-lg">{channel.channel}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">{channel.strategy}</p>
                  <div className="flex justify-between text-xs">
                    <span><strong>Investimento:</strong> {channel.investment}</span>
                  </div>
                  <Badge variant="outline">{channel.roi}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Métricas de Sucesso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyMetrics.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm">{item.metric}</h4>
                <p className="text-2xl font-bold text-blue-600 my-1">{item.target}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estratégia de Preços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Estratégia de Monetização</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {pricingStrategy.map((tier, index) => (
              <Card key={index} className={index === 1 ? "ring-2 ring-blue-500" : ""}>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{tier.tier}</CardTitle>
                  <p className="text-2xl font-bold text-blue-600">{tier.price}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tier.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-600 mt-2 italic">{tier.purpose}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Primeiros Passos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Próximos Passos Imediatos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">🚨 Urgente (Esta Semana)</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• Criar pelo menos 10 sinais de exemplo com bons resultados</li>
                <li>• Configurar Google Analytics no site</li>
                <li>• Criar conta comercial no Instagram e TikTok</li>
                <li>• Preparar conteúdo educativo inicial (5-10 posts)</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚡ Importante (Próximas 2 Semanas)</h4>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Configurar sistema de email marketing (Mailchimp/ConvertKit)</li>
                <li>• Criar página de captura de leads</li>
                <li>• Preparar primeiro webinar ou live</li>
                <li>• Definir calendário de postagens nas redes</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">📈 Crescimento (Próximo Mês)</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Lançar campanhas pagas no Google e Facebook</li>
                <li>• Buscar parcerias com influenciadores</li>
                <li>• Implementar programa de indicação</li>
                <li>• Otimizar conversões baseado nos dados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}