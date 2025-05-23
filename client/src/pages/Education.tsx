import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import LessonCard from "@/components/LessonCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Brain, Plus } from "lucide-react";

export default function Education() {
  const { user } = useAuth();
  
  const { data: lessons, isLoading } = useQuery({
    queryKey: ["/api/lessons"],
  });

  const isAdmin = user?.role === "admin";

  const categoryCounts = {
    fundamentals: lessons?.filter((l: any) => l.category === "fundamentals").length || 0,
    technical_analysis: lessons?.filter((l: any) => l.category === "technical_analysis").length || 0,
    psychology: lessons?.filter((l: any) => l.category === "psychology").length || 0,
    strategies: lessons?.filter((l: any) => l.category === "strategies").length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Centro Educacional</h1>
              <p className="mt-2 text-gray-600">
                Aprenda trading com nossos cursos profissionais
              </p>
            </div>
            {isAdmin && (
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nova Aula</span>
              </Button>
            )}
          </div>

          {/* Course Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fundamentos</h3>
                <p className="text-gray-600 mb-4">Aprenda os conceitos básicos do trading</p>
                <Badge variant="secondary">
                  {categoryCounts.fundamentals} aulas
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Análise Técnica</h3>
                <p className="text-gray-600 mb-4">Domine os indicadores e padrões</p>
                <Badge variant="secondary">
                  {categoryCounts.technical_analysis} aulas
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Psicologia</h3>
                <p className="text-gray-600 mb-4">Controle emocional e disciplina</p>
                <Badge variant="secondary">
                  {categoryCounts.psychology} aulas
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Estratégias</h3>
                <p className="text-gray-600 mb-4">Estratégias avançadas de trading</p>
                <Badge variant="secondary">
                  {categoryCounts.strategies} aulas
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Lessons List */}
          <Card>
            <CardHeader>
              <CardTitle>Aulas Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons?.length === 0 ? (
                    <div className="text-center py-16">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Nenhuma aula disponível</p>
                      <p className="text-gray-400 mt-2">
                        Novas aulas serão adicionadas em breve
                      </p>
                    </div>
                  ) : (
                    lessons?.map((lesson: any) => (
                      <LessonCard key={lesson.id} lesson={lesson} />
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
