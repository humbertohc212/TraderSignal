import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TradingJournal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    pair: '',
    direction: '',
    pips: '',
    profit: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry = {
      id: Date.now(),
      ...formData,
      pips: parseFloat(formData.pips || "0"),
      profit: parseFloat(formData.profit || "0"),
      date: new Date().toLocaleDateString()
    };

    setEntries(prev => [...prev, newEntry]);
    
    // Atualizar localStorage com os pips totais
    const currentPips = entries.reduce((sum, entry) => sum + Math.abs(entry.pips), 0);
    const newTotalPips = currentPips + Math.abs(newEntry.pips);
    
    localStorage.setItem('userTotalPips', newTotalPips.toString());
    
    toast({
      title: "Operação Registrada!",
      description: `+${Math.abs(newEntry.pips)} pips adicionados ao total`,
    });

    setFormData({ pair: '', direction: '', pips: '', profit: '' });
    
    // Recarregar página para atualizar dashboard
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const totalPips = entries.reduce((sum, entry) => sum + Math.abs(entry.pips), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Diário de Trading</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="bg-gray-800/90 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Registrar Nova Operação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="pair" className="text-gray-300">Par</Label>
                  <Input
                    id="pair"
                    value={formData.pair}
                    onChange={(e) => setFormData({...formData, pair: e.target.value})}
                    placeholder="EUR/USD, BTC/USD, etc."
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="direction" className="text-gray-300">Direção</Label>
                  <Select value={formData.direction} onValueChange={(value) => setFormData({...formData, direction: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione a direção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">BUY (Compra)</SelectItem>
                      <SelectItem value="SELL">SELL (Venda)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pips" className="text-gray-300">Pips Ganhos/Perdidos</Label>
                  <Input
                    id="pips"
                    type="number"
                    value={formData.pips}
                    onChange={(e) => setFormData({...formData, pips: e.target.value})}
                    placeholder="40, -25, etc."
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="profit" className="text-gray-300">Lucro/Prejuízo (R$)</Label>
                  <Input
                    id="profit"
                    type="number"
                    step="0.01"
                    value={formData.profit}
                    onChange={(e) => setFormData({...formData, profit: e.target.value})}
                    placeholder="400.00, -150.00, etc."
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Operação
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resumo e Lista */}
          <div className="space-y-6">
            {/* Resumo */}
            <Card className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{totalPips}</div>
                    <div className="text-sm text-gray-400">Total de Pips</div>
                  </div>
                  <div className="text-center p-4 bg-blue-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{entries.length}</div>
                    <div className="text-sm text-gray-400">Operações</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Operações */}
            <Card className="bg-gray-800/90 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Operações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {entries.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Nenhuma operação registrada</p>
                  ) : (
                    entries.slice(-5).reverse().map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{entry.pair} {entry.direction}</div>
                          <div className="text-sm text-gray-400">{entry.date}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${entry.pips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {entry.pips > 0 ? '+' : ''}{entry.pips} pips
                          </div>
                          <div className={`text-sm ${entry.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            R$ {entry.profit > 0 ? '+' : ''}{entry.profit}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}