import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Signal, 
  Video, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  FileX
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/admin"],
  });

  const { data: signals } = useQuery({
    queryKey: ["/api/signals"],
  });

  const { data: lessons } = useQuery({
    queryKey: ["/api/lessons"],
  });

  const { data: plans } = useQuery({
    queryKey: ["/api/plans"],
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <FileX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h1>
            <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="mt-2 text-gray-600">
              Gerencie conteúdo, usuários e configurações da plataforma
            </p>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Usuários</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? "..." : adminStats?.totalUsers || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <Signal className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Sinais Ativos</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? "..." : adminStats?.activeSignals || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                      <Video className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Aulas</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? "..." : adminStats?.totalLessons || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Receita Mensal</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {statsLoading ? "..." : `R$ ${adminStats?.monthlyRevenue || 0}k`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="signals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="signals">Sinais</TabsTrigger>
              <TabsTrigger value="lessons">Aulas</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="plans">Planos</TabsTrigger>
            </TabsList>

            {/* Signals Management */}
            <TabsContent value="signals">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gerenciar Sinais</CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Sinal
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Par</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>TP/SL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {signals?.slice(0, 10).map((signal: any) => (
                        <TableRow key={signal.id}>
                          <TableCell className="font-medium">{signal.pair}</TableCell>
                          <TableCell>
                            <Badge variant={signal.direction === 'BUY' ? 'default' : 'destructive'}>
                              {signal.direction}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{signal.entryPrice}</TableCell>
                          <TableCell className="text-sm">
                            {signal.takeProfitPrice} / {signal.stopLossPrice}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              signal.status === 'active' ? 'default' : 
                              signal.status === 'closed' ? 'secondary' : 'destructive'
                            }>
                              {signal.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lessons Management */}
            <TabsContent value="lessons">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gerenciar Aulas</CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Aula
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Lesson Upload Form */}
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload de Nova Aula</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título da Aula
                        </label>
                        <Input placeholder="Ex: Introdução ao Forex" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoria
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fundamentals">Fundamentos</SelectItem>
                            <SelectItem value="technical_analysis">Análise Técnica</SelectItem>
                            <SelectItem value="psychology">Psicologia</SelectItem>
                            <SelectItem value="strategies">Estratégias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nível
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediário</SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duração (minutos)
                        </label>
                        <Input type="number" placeholder="30" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <Textarea placeholder="Descrição da aula..." />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload do Vídeo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Arraste e solte o arquivo de vídeo ou clique para selecionar
                        </p>
                        <p className="text-sm text-gray-500 mt-1">MP4, MOV, AVI até 1GB</p>
                      </div>
                    </div>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      Publicar Aula
                    </Button>
                  </div>

                  {/* Lessons Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Nível</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessons?.slice(0, 10).map((lesson: any) => (
                        <TableRow key={lesson.id}>
                          <TableCell className="font-medium">{lesson.title}</TableCell>
                          <TableCell>{lesson.category}</TableCell>
                          <TableCell>{lesson.level}</TableCell>
                          <TableCell>{lesson.duration}min</TableCell>
                          <TableCell>
                            <Badge variant={lesson.isPublished ? 'default' : 'secondary'}>
                              {lesson.isPublished ? 'Publicado' : 'Rascunho'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <div className="flex space-x-2">
                    <Input placeholder="Buscar usuário..." className="w-64" />
                    <Button>Buscar</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium">Usuário</span>
                          </div>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <Badge>Ativo</Badge>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Plans Management */}
            <TabsContent value="plans">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Gerenciar Planos</CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Plano
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans?.map((plan: any) => (
                      <Card key={plan.id} className="relative">
                        {plan.isPopular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-amber-500 text-slate-900">Popular</Badge>
                          </div>
                        )}
                        <CardHeader className="text-center">
                          <CardTitle>{plan.name}</CardTitle>
                          <div className="mt-4">
                            <span className="text-3xl font-bold">R$ {plan.price}</span>
                            <span className="text-gray-600">/mês</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <p>• {plan.signalsPerWeek} sinais por semana</p>
                            {plan.hasEducationalAccess && <p>• Acesso às aulas</p>}
                            {plan.hasPrioritySupport && <p>• Suporte prioritário</p>}
                            {plan.hasExclusiveAnalysis && <p>• Análises exclusivas</p>}
                            {plan.hasMentoring && <p>• Mentoria em grupo</p>}
                            {plan.hasWhatsappSupport && <p>• Suporte WhatsApp</p>}
                            {plan.hasDetailedReports && <p>• Relatórios detalhados</p>}
                          </div>
                          <div className="space-y-2">
                            <Button className="w-full" variant="outline">
                              Editar Plano
                            </Button>
                            <p className="text-xs text-gray-500 text-center">
                              {Math.floor(Math.random() * 200)} assinantes ativos
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
