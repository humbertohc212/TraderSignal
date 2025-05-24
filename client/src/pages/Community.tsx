import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Users, TrendingUp, Award, Heart, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function Community() {
  const { user } = useAuth();

  const communityStats = [
    { icon: Users, label: "Membros Ativos", value: "2,847", color: "text-blue-500" },
    { icon: MessageCircle, label: "Discussões", value: "1,205", color: "text-green-500" },
    { icon: TrendingUp, label: "Sinais Compartilhados", value: "450", color: "text-amber-500" },
    { icon: Award, label: "Top Traders", value: "125", color: "text-purple-500" },
  ];

  const discussionTopics = [
    {
      id: 1,
      title: "Estratégias para XAUUSD esta semana",
      author: "Carlos Silva",
      avatar: "CS",
      replies: 23,
      likes: 45,
      time: "2h atrás",
      category: "Análise Técnica",
      isHot: true
    },
    {
      id: 2,
      title: "Como gerenciar risco em operações de scalping",
      author: "Ana Santos",
      avatar: "AS",
      replies: 18,
      likes: 32,
      time: "4h atrás",
      category: "Gestão de Risco",
      isHot: false
    },
    {
      id: 3,
      title: "Resultados da semana - Compartilhem seus trades!",
      author: "João Trader",
      avatar: "JT",
      replies: 67,
      likes: 89,
      time: "6h atrás",
      category: "Resultados",
      isHot: true
    },
    {
      id: 4,
      title: "Dicas para iniciantes no Forex",
      author: "Maria Educadora",
      avatar: "ME",
      replies: 34,
      likes: 78,
      time: "1d atrás",
      category: "Iniciantes",
      isHot: false
    }
  ];

  const topTraders = [
    { name: "ProTrader2024", profit: "+15.2%", trades: 45, avatar: "PT" },
    { name: "GoldMaster", profit: "+12.8%", trades: 38, avatar: "GM" },
    { name: "ForexKing", profit: "+11.5%", trades: 52, avatar: "FK" },
    { name: "TradingAce", profit: "+10.9%", trades: 41, avatar: "TA" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Comunidade TradeSignal Pro
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Conecte-se com traders profissionais, compartilhe estratégias e aprenda com os melhores
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityStats.map((stat, index) => (
            <Card key={index} className="bg-gray-800/90 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Discussões Principais */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Discussões em Alta
                  </CardTitle>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Nova Discussão
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {discussionTopics.map((topic) => (
                  <div key={topic.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-600 text-white text-sm">
                            {topic.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-white font-medium hover:text-blue-400 transition-colors">
                            {topic.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            por {topic.author} • {topic.time}
                          </p>
                        </div>
                      </div>
                      {topic.isHot && (
                        <Badge variant="destructive" className="bg-red-600">
                          🔥 Hot
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-gray-500 text-gray-300">
                        {topic.category}
                      </Badge>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {topic.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {topic.likes}
                        </span>
                        <Share2 className="h-4 w-4 cursor-pointer hover:text-blue-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Traders */}
            <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Top Traders do Mês
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topTraders.map((trader, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 font-bold">#{index + 1}</span>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-600 text-white text-xs">
                            {trader.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{trader.name}</p>
                        <p className="text-gray-400 text-xs">{trader.trades} trades</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">
                      {trader.profit}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Regras da Comunidade */}
            <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Regras da Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Respeite todos os membros</li>
                  <li>• Compartilhe conhecimento genuíno</li>
                  <li>• Não faça spam ou autopromoção</li>
                  <li>• Use linguagem adequada</li>
                  <li>• Compartilhe resultados reais</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}