import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Award,
  BarChart3,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-amber-400" />
              <h1 className="text-xl font-bold text-white">TradeSignal Pro</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'} 
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-amber-500/10 text-amber-400 border-amber-500/20">
              Plataforma Profissional de Trading
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Maximize seus <span className="text-amber-400">Resultados</span> no Trading
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Acesse sinais profissionais de trading, educação de qualidade e ferramentas 
              avançadas para transformar sua jornada no mercado financeiro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/api/login'}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8"
              >
                Começar Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Por que escolher o TradeSignal Pro?
            </h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Nossa plataforma oferece tudo que você precisa para ter sucesso no trading
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-amber-400 mb-4" />
                <CardTitle className="text-white">Sinais Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Sinais de alta qualidade com análise técnica detalhada e 
                  taxa de acerto comprovada superior a 75%.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-amber-400 mb-4" />
                <CardTitle className="text-white">Educação Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Cursos estruturados desde o básico até estratégias avançadas, 
                  com aulas práticas e teóricas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Users className="h-10 w-10 text-amber-400 mb-4" />
                <CardTitle className="text-white">Comunidade Ativa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Faça parte de uma comunidade de traders profissionais e 
                  compartilhe experiências e estratégias.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Shield className="h-10 w-10 text-amber-400 mb-4" />
                <CardTitle className="text-white">Suporte Especializado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Suporte técnico e educacional especializado para tirar 
                  todas suas dúvidas sobre trading.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Clock className="h-10 w-10 text-amber-400 mb-4" />
                <CardTitle className="text-white">Sinais em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Receba sinais instantaneamente através da nossa plataforma 
                  web e notificações em tempo real.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <Award className="h-10 w-10 text-amber-400 mb-4" />
                <CardTitle className="text-white">Resultados Comprovados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Histórico transparente de resultados com relatórios 
                  detalhados de performance dos sinais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Planos para Todos os Perfis
            </h2>
            <p className="text-slate-300 text-lg">
              Escolha o plano ideal para sua estratégia de trading
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-xl">Básico</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">R$ 47</span>
                  <span className="text-slate-400">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">5 sinais por semana</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Acesso às aulas básicas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Suporte por email</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={() => window.location.href = '/api/login'}
                >
                  Começar
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-slate-800/50 border-amber-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-500 text-slate-900">Mais Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-white text-xl">Premium</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">R$ 97</span>
                  <span className="text-slate-400">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">15 sinais por semana</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Acesso completo às aulas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Suporte prioritário</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Análises exclusivas</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Começar
                </Button>
              </CardContent>
            </Card>

            {/* VIP Plan */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-xl">VIP</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">R$ 197</span>
                  <span className="text-slate-400">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Sinais ilimitados</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Mentoria em grupo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Suporte WhatsApp</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">Relatórios detalhados</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Começar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold text-white">TradeSignal Pro</span>
            </div>
            <p className="text-slate-400">
              © 2024 TradeSignal Pro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
