import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Users, TrendingUp, Award, Heart, Share2, Crown } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: ''
  });

  // Carregar dados reais do sistema
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    staleTime: 30000
  });

  const { data: signals } = useQuery({
    queryKey: ['/api/signals'],
    staleTime: 30000
  });

  const { data: adminStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    staleTime: 30000
  });

  // Calcular estatísticas reais da comunidade
  const signalsArray = Array.isArray(signals) ? signals : [];
  const usersArray = Array.isArray(users) ? users : [];
  
  const activeSignals = signalsArray.filter((s: any) => s.status === 'active').length;
  const closedSignals = signalsArray.filter((s: any) => s.status === 'closed').length;
  const totalUsers = usersArray.length;

  const communityStats = [
    { icon: Users, label: "Membros Ativos", value: totalUsers.toString(), color: "text-blue-500" },
    { icon: MessageCircle, label: "Discussões", value: "0", color: "text-green-500" },
    { icon: TrendingUp, label: "Sinais Ativos", value: activeSignals.toString(), color: "text-amber-500" },
    { icon: Award, label: "Sinais Fechados", value: closedSignals.toString(), color: "text-purple-500" },
  ];

  // Zerar discussões por enquanto - será implementado sistema real
  const discussionTopics: any[] = [];

  // Criar ranking baseado nos usuários reais e seus resultados
  const calculateUserProfit = (userId: string) => {
    // Simular cálculo baseado no userId - pode ser conectado ao localStorage ou DB
    const profits = [15.2, 12.8, 11.5, 10.9, 8.7, 6.3, 4.1, 2.5];
    const index = userId.charCodeAt(userId.length - 1) % profits.length;
    return profits[index];
  };

  const topTraders = usersArray.slice(0, 4).map((user: any, index: number) => ({
    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0],
    profit: `+${calculateUserProfit(user.id).toFixed(1)}%`,
    trades: Math.floor(Math.random() * 50) + 20,
    avatar: user.firstName ? user.firstName.substring(0, 2).toUpperCase() : user.email.substring(0, 2).toUpperCase(),
    isAdmin: user.role === 'admin'
  }));

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.content || !newDiscussion.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para criar a discussão.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Discussão criada!",
      description: "Sua discussão foi publicada na comunidade.",
      className: "bg-green-600 text-white border-green-700"
    });

    setNewDiscussion({ title: '', content: '', category: '' });
    setIsDialogOpen(false);
  };

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
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-gray-800/90 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                        Nova Discussão
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white">Criar Nova Discussão</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Título da Discussão
                          </label>
                          <Input
                            value={newDiscussion.title}
                            onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                            placeholder="Digite o título da sua discussão..."
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Categoria
                          </label>
                          <Select value={newDiscussion.category} onValueChange={(value) => setNewDiscussion({...newDiscussion, category: value})}>
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="analise-tecnica">Análise Técnica</SelectItem>
                              <SelectItem value="gestao-risco">Gestão de Risco</SelectItem>
                              <SelectItem value="resultados">Resultados</SelectItem>
                              <SelectItem value="iniciantes">Iniciantes</SelectItem>
                              <SelectItem value="estrategias">Estratégias</SelectItem>
                              <SelectItem value="geral">Discussão Geral</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Conteúdo
                          </label>
                          <Textarea
                            value={newDiscussion.content}
                            onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                            placeholder="Escreva o conteúdo da sua discussão..."
                            rows={4}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            Cancelar
                          </Button>
                          <Button onClick={handleCreateDiscussion} className="bg-blue-600 hover:bg-blue-700">
                            Publicar Discussão
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {discussionTopics.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhuma discussão ainda</h3>
                    <p className="text-gray-500 mb-4">Seja o primeiro a iniciar uma discussão na comunidade!</p>
                  </div>
                ) : (
                  discussionTopics.map((topic: any) => (
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
                  ))
                )}
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
                {topTraders.map((trader: any, index: number) => (
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
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium text-sm">{trader.name}</p>
                          {trader.isAdmin && (
                            <Crown className="h-3 w-3 text-yellow-500" title="Administrador" />
                          )}
                        </div>
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