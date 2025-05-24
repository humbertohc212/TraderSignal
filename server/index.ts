import express from "express";
import jwt from "jsonwebtoken";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import { storage } from "./storage";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Simple auth middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'homercavalcanti@gmail.com' && password === 'Betinho21@') {
    const userData = {
      id: 'admin-user-id',
      email: email,
      role: 'admin',
      firstName: 'Homer',
      lastName: 'Cavalcanti'
    };
    
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      success: true, 
      user: userData,
      token: token
    });
  } else if (email === 'alessandrabertoo2001@gmail.com' && password === '1339Ale@') {
    const userData = {
      id: 'user-alessandra-id',
      email: email,
      role: 'user',
      firstName: 'Alessandra',
      lastName: 'Berto'
    };
    
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      success: true, 
      user: userData,
      token: token
    });
  } else {
    res.status(401).json({ 
      success: false,
      message: 'Credenciais inválidas' 
    });
  }
});

app.get('/api/auth/user', authenticateToken, (req: any, res) => {
  res.json(req.user);
});

// In-memory storage for demonstration
let signals = [
  {
    id: 1,
    pair: "EUR/USD",
    direction: "BUY",
    entryPrice: "1.0850",
    takeProfitPrice: "1.0900",
    stopLossPrice: "1.0800",
    status: "active",
    analysis: "Breakout acima da resistência de 1.0830. RSI mostra momentum bullish.",
    tradingViewLink: "https://tradingview.com/chart",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    pair: "GBP/USD",
    direction: "SELL",
    entryPrice: "1.2650",
    takeProfitPrice: "1.2600",
    stopLossPrice: "1.2700",
    status: "active",
    analysis: "Padrão de reversão formado. MACD divergente no H4.",
    tradingViewLink: "https://tradingview.com/chart",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

let lessons = [
  {
    id: 1,
    title: "Introdução ao Forex",
    description: "Conceitos básicos do mercado de câmbio",
    category: "Básico",
    level: "Iniciante",
    duration: 30,
    rating: "4.8",
    thumbnailUrl: "",
    videoUrl: "",
    isPublished: true,
    createdAt: new Date().toISOString()
  }
];

let plans = [
  {
    id: 1,
    name: "Free Trial",
    description: "Experimente gratuitamente por 7 dias",
    price: 0,
    currency: "BRL",
    interval: "weekly",
    signalsPerWeek: 21,
    features: ["3 sinais por dia", "7 dias grátis", "Suporte básico"],
    hasEducationalAccess: false,
    hasPrioritySupport: false,
    hasExclusiveAnalysis: false,
    hasMentoring: false,
    hasWhatsappSupport: false,
    hasDetailedReports: false,
    isActive: true,
    isPopular: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Básico",
    description: "Plano ideal para iniciantes",
    price: 47,
    currency: "BRL",
    interval: "monthly",
    signalsPerWeek: 35,
    features: ["5 sinais por dia", "Análises básicas", "Suporte padrão"],
    hasEducationalAccess: true,
    hasPrioritySupport: false,
    hasExclusiveAnalysis: false,
    hasMentoring: false,
    hasWhatsappSupport: true,
    hasDetailedReports: false,
    isActive: true,
    isPopular: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Premium",
    description: "Para traders experientes",
    price: 97,
    currency: "BRL",
    interval: "monthly",
    signalsPerWeek: 84,
    features: ["12 sinais por dia", "Análises detalhadas", "Suporte prioritário", "Acesso educacional"],
    hasEducationalAccess: true,
    hasPrioritySupport: true,
    hasExclusiveAnalysis: true,
    hasMentoring: false,
    hasWhatsappSupport: true,
    hasDetailedReports: true,
    isActive: true,
    isPopular: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "VIP",
    description: "Máximo nível de acesso",
    price: 197,
    currency: "BRL",
    interval: "monthly",
    signalsPerWeek: 140,
    features: ["20 sinais por dia", "Mentoria exclusiva", "Relatórios personalizados", "Suporte 24/7"],
    hasEducationalAccess: true,
    hasPrioritySupport: true,
    hasExclusiveAnalysis: true,
    hasMentoring: true,
    hasWhatsappSupport: true,
    hasDetailedReports: true,
    isActive: true,
    isPopular: false,
    createdAt: new Date().toISOString()
  }
];

let users = [
  {
    id: "admin-user-id",
    email: "homercavalcanti@gmail.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    subscriptionPlan: "premium",
    subscriptionStatus: "active",
    createdAt: new Date().toISOString()
  }
];

// SIGNALS CRUD
app.get('/api/signals', authenticateToken, (req, res) => {
  res.json(signals);
});

app.post('/api/signals', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const newSignal = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  signals.push(newSignal);
  res.json(newSignal);
});

app.put('/api/signals/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const id = parseInt(req.params.id);
  const index = signals.findIndex(s => s.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Sinal não encontrado' });
  }
  
  signals[index] = { ...signals[index], ...req.body };
  res.json(signals[index]);
});

app.delete('/api/signals/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const id = parseInt(req.params.id);
  signals = signals.filter(s => s.id !== id);
  res.json({ success: true });
});

// LESSONS CRUD
app.get('/api/lessons', authenticateToken, (req, res) => {
  res.json(lessons);
});

app.post('/api/lessons', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const newLesson = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  lessons.push(newLesson);
  res.json(newLesson);
});

app.put('/api/lessons/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const id = parseInt(req.params.id);
  const index = lessons.findIndex(l => l.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Aula não encontrada' });
  }
  
  lessons[index] = { ...lessons[index], ...req.body };
  res.json(lessons[index]);
});

app.delete('/api/lessons/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const id = parseInt(req.params.id);
  lessons = lessons.filter(l => l.id !== id);
  res.json({ success: true });
});

// PLANS CRUD
app.get('/api/plans', authenticateToken, (req, res) => {
  res.json(plans);
});

app.get('/api/plans/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const plan = plans.find(p => p.id === id);
  
  if (!plan) {
    return res.status(404).json({ message: 'Plano não encontrado' });
  }
  
  res.json(plan);
});

app.post('/api/plans', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const newPlan = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  plans.push(newPlan);
  res.json(newPlan);
});

app.put('/api/plans/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const id = parseInt(req.params.id);
  console.log('Updating plan with ID:', id, 'Data:', req.body);
  
  const index = plans.findIndex(p => p.id === id);
  
  if (index === -1) {
    console.log('Plan not found with ID:', id);
    return res.status(404).json({ message: 'Plano não encontrado' });
  }
  
  const oldPlan = plans[index];
  plans[index] = { ...oldPlan, ...req.body };
  console.log('Plan updated successfully:', plans[index]);
  
  res.json(plans[index]);
});

app.delete('/api/plans/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const id = parseInt(req.params.id);
  plans = plans.filter(p => p.id !== id);
  res.json({ success: true });
});

// STATISTICS ROUTES
app.get('/api/stats/admin', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const adminStats = await storage.getAdminStats();
    console.log('Admin stats from database:', adminStats);
    
    res.json(adminStats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

app.get('/api/stats/user', authenticateToken, (req: any, res) => {
  const activeSignals = signals.filter(s => s.status === 'active').length;
  const totalUsers = users.length;
  const completedLessons = 0; // User-specific data would go here
  const winRate = 85; // Placeholder win rate
  const totalProfit = 1250; // Placeholder profit
  
  res.json({
    totalUsers,
    activeSignals,
    completedLessons,
    winRate,
    totalProfit
  });
});

// PLANS - Rota pública (não requer autenticação)
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await storage.getActivePlans();
    
    // Formatando os planos para o frontend
    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      isPopular: plan.isPopular,
      features: [
        `${plan.signalsPerWeek === 999 ? 'Sinais ilimitados' : `${plan.signalsPerWeek} sinais por semana`}`,
        ...(plan.hasEducationalAccess ? ['Acesso ao conteúdo educacional'] : []),
        ...(plan.hasPrioritySupport ? ['Suporte prioritário'] : []),
        ...(plan.hasExclusiveAnalysis ? ['Análises exclusivas'] : []),
        ...(plan.hasMentoring ? ['Mentoria personalizada'] : []),
        ...(plan.hasWhatsappSupport ? ['Suporte via WhatsApp'] : []),
        ...(plan.hasDetailedReports ? ['Relatórios detalhados'] : [])
      ]
    }));
    
    res.json(formattedPlans);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// USERS CRUD
app.get('/api/users', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const dbUsers = await storage.getUsers();
    res.json(dbUsers);
  } catch (error) {
    console.error('Error fetching users from database:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});

app.post('/api/users', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const newUser = {
    id: `user-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  res.json(newUser);
});

app.put('/api/users/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const id = req.params.id;
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  
  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
});

app.delete('/api/users/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  const id = req.params.id;
  users = users.filter(u => u.id !== id);
  res.json({ success: true });
});

// Create HTTP server
const httpServer = createServer(app);

// Start server
(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  httpServer.listen(port, '0.0.0.0', () => {
    log(`TradeSignal Pro server running on port ${port}`);
  });
})();