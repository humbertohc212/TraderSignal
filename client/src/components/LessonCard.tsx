import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, Clock, FileX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    description?: string;
    category: string;
    level: string;
    duration?: number;
    rating?: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    isPublished: boolean;
  };
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const { toast } = useToast();

  const handleWatchLesson = () => {
    if (!lesson.videoUrl || lesson.videoUrl.trim() === "") {
      toast({
        title: "Não há arquivos disponíveis",
        description: "Esta aula ainda não possui conteúdo em vídeo. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }
    
    // Abrir vídeo em nova aba
    window.open(lesson.videoUrl, '_blank');
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      fundamentals: "Fundamentos",
      technical_analysis: "Análise Técnica",
      psychology: "Psicologia",
      strategies: "Estratégias",
    };
    return labels[category] || category;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
    };
    return labels[level] || level;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-4">
        {/* Thumbnail */}
        <div className="w-24 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
          {lesson.thumbnailUrl ? (
            <img 
              src={lesson.thumbnailUrl} 
              alt={lesson.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Play className="h-6 w-6 text-blue-600" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-1">{lesson.title}</h4>
              {lesson.description && (
                <p className="text-gray-600 mb-2 line-clamp-2">{lesson.description}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {lesson.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Duração: {lesson.duration} min</span>
                  </div>
                )}
                
                <Badge className={getLevelColor(lesson.level)}>
                  Nível: {getLevelLabel(lesson.level)}
                </Badge>
                
                <Badge variant="outline">
                  {getCategoryLabel(lesson.category)}
                </Badge>
                
                {lesson.rating && parseFloat(lesson.rating) > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{lesson.rating}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              onClick={handleWatchLesson}
              className={`flex items-center space-x-2 ${
                lesson.videoUrl && lesson.videoUrl.trim() !== ""
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {lesson.videoUrl && lesson.videoUrl.trim() !== "" ? (
                <Play className="h-4 w-4" />
              ) : (
                <FileX className="h-4 w-4" />
              )}
              <span>
                {lesson.videoUrl && lesson.videoUrl.trim() !== "" ? "Assistir" : "Indisponível"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
