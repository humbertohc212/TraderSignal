import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Save, RotateCcw, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LayoutCustomizer() {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    siteName: "TradeSignal Pro",
    primaryColor: "#1E3A8A",
    secondaryColor: "#F59E0B",
    backgroundColor: "#F5F7FA",
    textColor: "#0F172A",
    heroTitle: "Maximize seus Resultados no Trading",
    heroSubtitle: "Acesse sinais profissionais de trading, educação de qualidade e ferramentas avançadas para transformar sua jornada no mercado financeiro.",
    logoUrl: "",
    faviconUrl: "",
    customCSS: "",
    footerText: "© 2024 TradeSignal Pro. Todos os direitos reservados."
  });

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyChanges = () => {
    // Aplicar mudanças de cor em tempo real
    const root = document.documentElement;
    root.style.setProperty('--primary', settings.primaryColor);
    root.style.setProperty('--accent', settings.secondaryColor);
    root.style.setProperty('--background', settings.backgroundColor);
    root.style.setProperty('--foreground', settings.textColor);
    
    // Aplicar CSS customizado
    let customStyleElement = document.getElementById('custom-styles');
    if (!customStyleElement) {
      customStyleElement = document.createElement('style');
      customStyleElement.id = 'custom-styles';
      document.head.appendChild(customStyleElement);
    }
    customStyleElement.textContent = settings.customCSS;

    toast({
      title: "Layout atualizado!",
      description: "As alterações foram aplicadas com sucesso.",
    });
  };

  const resetToDefault = () => {
    setSettings({
      siteName: "TradeSignal Pro",
      primaryColor: "#1E3A8A",
      secondaryColor: "#F59E0B",
      backgroundColor: "#F5F7FA",
      textColor: "#0F172A",
      heroTitle: "Maximize seus Resultados no Trading",
      heroSubtitle: "Acesse sinais profissionais de trading, educação de qualidade e ferramentas avançadas para transformar sua jornada no mercado financeiro.",
      logoUrl: "",
      faviconUrl: "",
      customCSS: "",
      footerText: "© 2024 TradeSignal Pro. Todos os direitos reservados."
    });
    
    toast({
      title: "Configurações restauradas",
      description: "O layout voltou às configurações padrão.",
    });
  };

  const previewTheme = (theme: string) => {
    const themes = {
      dark: {
        primaryColor: "#3B82F6",
        secondaryColor: "#F59E0B",
        backgroundColor: "#0F172A",
        textColor: "#F8FAFC"
      },
      green: {
        primaryColor: "#10B981",
        secondaryColor: "#F59E0B",
        backgroundColor: "#F0FDF4",
        textColor: "#064E3B"
      },
      purple: {
        primaryColor: "#8B5CF6",
        secondaryColor: "#F59E0B",
        backgroundColor: "#FAF5FF",
        textColor: "#3C1361"
      }
    };

    if (themes[theme as keyof typeof themes]) {
      setSettings(prev => ({ ...prev, ...themes[theme as keyof typeof themes] }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Personalizar Layout</span>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
          <Button size="sm" onClick={applyChanges}>
            <Save className="h-4 w-4 mr-2" />
            Aplicar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="branding" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="branding">Marca</TabsTrigger>
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                  placeholder="TradeSignal Pro"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL do Logo</Label>
                <Input
                  id="logoUrl"
                  value={settings.logoUrl}
                  onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="faviconUrl">URL do Favicon</Label>
                <Input
                  id="faviconUrl"
                  value={settings.faviconUrl}
                  onChange={(e) => handleInputChange("faviconUrl", e.target.value)}
                  placeholder="https://exemplo.com/favicon.ico"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footerText">Texto do Rodapé</Label>
                <Input
                  id="footerText"
                  value={settings.footerText}
                  onChange={(e) => handleInputChange("footerText", e.target.value)}
                  placeholder="© 2024 Sua Empresa"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Temas Pré-definidos</Label>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => previewTheme('dark')}>
                    Escuro
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => previewTheme('green')}>
                    Verde
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => previewTheme('purple')}>
                    Roxo
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      id="primaryColor"
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      placeholder="#1E3A8A"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      id="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      placeholder="#F59E0B"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      id="backgroundColor"
                      value={settings.backgroundColor}
                      onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.backgroundColor}
                      onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                      placeholder="#F5F7FA"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="textColor">Cor do Texto</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      id="textColor"
                      value={settings.textColor}
                      onChange={(e) => handleInputChange("textColor", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.textColor}
                      onChange={(e) => handleInputChange("textColor", e.target.value)}
                      placeholder="#0F172A"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Título Principal (Hero)</Label>
                <Input
                  id="heroTitle"
                  value={settings.heroTitle}
                  onChange={(e) => handleInputChange("heroTitle", e.target.value)}
                  placeholder="Maximize seus Resultados no Trading"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Subtítulo (Hero)</Label>
                <Textarea
                  id="heroSubtitle"
                  value={settings.heroSubtitle}
                  onChange={(e) => handleInputChange("heroSubtitle", e.target.value)}
                  placeholder="Descrição atrativa da sua plataforma..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCSS">CSS Personalizado</Label>
                <Textarea
                  id="customCSS"
                  value={settings.customCSS}
                  onChange={(e) => handleInputChange("customCSS", e.target.value)}
                  placeholder="/* Adicione seu CSS personalizado aqui */
.custom-header { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}"
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Cuidado com CSS Personalizado</h4>
                <p className="text-sm text-yellow-700">
                  CSS personalizado pode afetar a funcionalidade da plataforma. 
                  Teste sempre em ambiente de desenvolvimento primeiro.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Prévia das Cores</h4>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded" 
                style={{ backgroundColor: settings.primaryColor }}
              ></div>
              <span className="text-sm">Primária</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded" 
                style={{ backgroundColor: settings.secondaryColor }}
              ></div>
              <span className="text-sm">Secundária</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded border" 
                style={{ backgroundColor: settings.backgroundColor }}
              ></div>
              <span className="text-sm">Fundo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-6 h-6 rounded border" 
                style={{ backgroundColor: settings.textColor }}
              ></div>
              <span className="text-sm">Texto</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}