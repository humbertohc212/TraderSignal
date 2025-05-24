import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import { storage } from "./simpleStorage";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// PLANS - Rota pública DEVE vir primeiro
app.get('/api/plans', (req, res) => {
  console.log('=== ROTA /api/plans CHAMADA ===');
  
  const plans = [
    {
      id: 4,
      name: "Free Trial",
      price: 0,
      currency: "BRL",
      isPopular: false,
      features: [
        "21 sinais por semana",
        "Acesso ao conteúdo educacional"
      ]
    },
    {
      id: 1,
      name: "Básico", 
      price: 47,
      currency: "BRL",
      isPopular: false,
      features: [
        "5 sinais por semana",
        "Acesso ao conteúdo educacional"
      ]
    },
    {
      id: 2,
      name: "Premium",
      price: 97,
      currency: "BRL", 
      isPopular: true,
      features: [
        "15 sinais por semana",
        "Acesso ao conteúdo educacional",
        "Suporte prioritário",
        "Análises exclusivas"
      ]
    },
    {
      id: 3,
      name: "VIP",
      price: 197,
      currency: "BRL",
      isPopular: false,
      features: [
        "Sinais ilimitados",
        "Acesso ao conteúdo educacional",
        "Suporte prioritário", 
        "Análises exclusivas",
        "Mentoria personalizada",
        "Suporte via WhatsApp",
        "Relatórios detalhados"
      ]
    }
  ];
  
  console.log('Enviando planos:', plans.length);
  res.json(plans);
});

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
app.post('/api/auth/login', async (req, res) => {
  console.log('=== LOGIN ENDPOINT HIT ===');
  console.log('Request body:', req.body);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha são obrigatórios' 
      });
    }
  
  try {
    console.log('Login attempt for:', email);
    
    // Primeiro, verifica se o usuário já existe no banco
    let user = await storage.getUserByEmail(email);
    console.log('User found in database:', user ? 'Yes' : 'No');
    
    if (user) {
      // Usuário existe, verifica a senha
      const isValidPassword = await bcrypt.compare(password, user.password || '');
      
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false,
          message: 'Credenciais inválidas' 
        });
      }
      
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role || 'user',
        firstName: user.firstName,
        lastName: user.lastName
      };
      
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
      
      return res.json({ 
        success: true, 
        user: userData,
        token: token
      });
    } else {
      // Usuário não existe, cria automaticamente com a senha fornecida
      console.log('Creating new user for:', email);
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Define role baseado no email
      const role = email === 'homercavalcanti@gmail.com' ? 'admin' : 'user';
      
      // Extrai nome do email
      const emailPrefix = email.split('@')[0];
      const firstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      
      console.log('Attempting to create user with data:', {
        id: `user_${Date.now()}`,
        email: email,
        role: role,
        firstName: firstName,
        lastName: 'User'
      });
      
      const newUser = await storage.createUser({
        email: email,
        password: hashedPassword,
        role: role,
        firstName: firstName,
        lastName: 'User'
      });
      
      console.log('User created successfully:', newUser.id);
      
      const userData = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role || 'user',
        firstName: newUser.firstName,
        lastName: newUser.lastName
      };
      
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
      
      return res.json({ 
        success: true, 
        user: userData,
        token: token
      });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
});

// Simple register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Create new user
    const newUser = await storage.createUser({
      email,
      password, // Adicionando a senha
      firstName,
      lastName,
      role: 'user',
      subscriptionStatus: 'inactive'
    });

    // Create JWT token
    const userData = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    };
    
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
    
    // Set cookie for additional security
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    res.json({ 
      success: true, 
      user: userData,
      token: token 
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Erro ao criar conta" });
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