import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Award, 
  ArrowRight, 
  Star,
  CheckCircle,
  BarChart3,
  Zap,
  Globe,
  Target,
  Home
} from "lucide-react";
import { Link } from "wouter";

export default function ModernLanding() {
  const features = [
    {
      icon: TrendingUp,
      title: "Sinais Precisos",
      description: "Análises técnicas profissionais com alta taxa de acerto",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Shield,
      title: "Totalmente Seguro",
      description: "Plataforma criptografada com proteção bancária",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Milhares de traders compartilhando estratégias",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Award,
      title: "Resultados Comprovados",
      description: "Histórico transparente de performance",
      color: "from-orange-500 to-amber-600"
    }
  ];

  const stats = [
    { number: "95%", label: "Taxa de Satisfação", icon: Star },
    { number: "12k+", label: "Traders Ativos", icon: Users },
    { number: "87%", label: "Win Rate Médio", icon: Target },
    { number: "24/7", label: "Suporte", icon: Shield }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Trader Profissional",
      text: "Os sinais são incrivelmente precisos. Minha carteira cresceu 150% em 6 meses!",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Investidora",
      text: "Finalmente encontrei uma plataforma confiável. Recomendo para todos!",
      rating: 5
    },
    {
      name: "Pedro Santos",
      role: "Day Trader",
      text: "A melhor decisão que tomei foi assinar. Resultados consistentes todos os dias.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

      {/* Header with Home Button */}
      <header className="relative z-20 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <Button className="bg-black border-black hover:bg-gray-800 text-white px-6 py-2 rounded-full">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/plans">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Planos
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-6 py-2 text-sm font-semibold">
            🚀 Nova Plataforma de Trading
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
            Transforme Seus
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Investimentos
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Receba sinais de trading profissionais, aprenda com especialistas e 
            multiplique seus resultados no mercado financeiro
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/demo">
              <Button className="bg-white border-2 border-white text-black hover:bg-gray-100 hover:border-gray-200 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300">
                Ver Demonstração
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-purple-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-gradient-to-r from-slate-900/50 to-purple-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Por Que Escolher Nossa Plataforma?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tecnologia avançada, resultados comprovados e suporte especializado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              O Que Nossos Clientes Dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-purple-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Pronto Para Começar?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Junte-se a milhares de traders que já transformaram seus resultados
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                Começar Agora - Grátis
                <Zap className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              Sem compromisso
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              Cancele quando quiser
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              Suporte 24/7
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}