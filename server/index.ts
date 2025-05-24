import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import { storage } from "./storage";
import { registerRoutes } from "./routes";

const app = express();

// Middleware especial para interceptar login ANTES de qualquer outro processamento
app.use('/api', express.json());

// Rota especifica de login que não conflita com Vite
app.post('/api/auth/login', async (req, res) => {
  console.log('=== API LOGIN REQUEST INTERCEPTED ===');
  console.log('Request body:', req.body);
    
    res.setHeader('Content-Type', 'application/json');
    
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Email e senha são obrigatórios' 
        });
      }
      
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Email:', email);
      console.log('Password provided:', !!password);
      
      // Primeiro, verifica se o usuário já existe no banco
      console.log('Checking database for user...');
      let user = await storage.getUserByEmail(email);
      console.log('User found in database:', user ? 'Yes' : 'No');
      if (user) {
        console.log('User details:', { id: user.id, email: user.email, role: user.role });
      }
      
      if (user) {
        console.log('User exists, proceeding with login...');
        
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
    } catch (error: any) {
      console.error('Erro no login:', error);
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor: ' + error.message
      });
    }
});

app.use(express.json());

// IMPORTANTE: Rotas de API devem vir ANTES do Vite para evitar interceptação
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// ================== TODAS AS ROTAS DE API AQUI ==================

// Login route (DEVE vir antes do Vite)
app.post('/login-user', async (req, res) => {
  console.log('=== LOGIN ENDPOINT HIT ===');
  console.log('Request body:', req.body);
  
  // Força o header de resposta JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha são obrigatórios' 
      });
    }
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password provided:', !!password);
    
    // Primeiro, verifica se o usuário já existe no banco
    console.log('Checking database for user...');
    let user = await storage.getUserByEmail(email);
    console.log('User found in database:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User details:', { id: user.id, email: user.email, role: user.role });
    }
    
    if (user) {
      // Usuário existe, verifica a senha
      const isValidPassword = await bcrypt.compare(password, user.password || '');
      console.log('Password validation:', isValidPassword ? 'SUCCESS' : 'FAILED');
      
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
  } catch (error: any) {
    console.error('Erro no login:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
});

// PLANS - Rota pública
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
  console.log('=== AUTHENTICATE TOKEN ===');
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  console.log('JWT_SECRET exists:', !!JWT_SECRET);
  console.log('Token length:', token.length);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log('Token verification error:', err.message);
      console.log('Error type:', err.name);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Token verified successfully, user:', user);
    req.user = user;
    next();
  });
}

// Login route with different path to avoid Vite conflicts
app.post('/login-user', async (req, res) => {
  console.log('=== LOGIN ENDPOINT HIT ===');
  console.log('Request body:', req.body);
  
  // Força o header de resposta JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email e senha são obrigatórios' 
      });
    }
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password provided:', !!password);
    
    // Primeiro, verifica se o usuário já existe no banco
    console.log('Checking database for user...');
    let user = await storage.getUserByEmail(email);
    console.log('User found in database:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User details:', { id: user.id, email: user.email, role: user.role });
    }
    
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
  } catch (error: any) {
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
    result: null,
    analysis: "Breakout acima da resistência de 1.0830. RSI mostra momentum bullish.",
    tradingViewLink: "https://tradingview.com/chart",
    allowedPlans: ["basic", "premium", "vip"], // Sinal exclusivo para planos pagos
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
    result: null,
    analysis: "Padrão de reversão formado. MACD divergente no H4.",
    tradingViewLink: "https://tradingview.com/chart",
    allowedPlans: ["free", "basic", "premium", "vip"], // Sinal disponível para todos
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
app.get('/api/signals', authenticateToken, async (req: any, res) => {
  try {
    const user = await storage.getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Admin vê todos os sinais
    if (user.role === 'admin') {
      const allSignals = await storage.getSignals();
      return res.json(allSignals);
    }

    // Filtrar sinais baseado no plano do usuário
    const userPlan = user.subscriptionPlan || 'free';
    const allSignals = await storage.getSignals();
    const filteredSignals = allSignals.filter(signal => {
      // Se o sinal não tem allowedPlans definido, permitir para todos
      if (!signal.allowedPlans || signal.allowedPlans.length === 0) {
        return true;
      }
      // Verificar se o plano do usuário está na lista de planos permitidos
      return signal.allowedPlans.includes(userPlan);
    });

    res.json(filteredSignals);
  } catch (error) {
    console.error('Erro ao buscar sinais:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/signals', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const newSignal = await storage.createSignal({
      ...req.body,
      allowedPlans: req.body.allowedPlans || ['free', 'basic', 'premium', 'vip'],
      createdBy: req.user.id
    });
    
    res.json(newSignal);
  } catch (error) {
    console.error('Erro ao criar sinal:', error);
    res.status(500).json({ message: 'Erro ao criar sinal' });
  }
});

app.put('/api/signals/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const id = Number(req.params.id);
    const updatedSignal = await storage.updateSignal(id, req.body);
    res.json(updatedSignal);
  } catch (error) {
    console.error('Erro ao atualizar sinal:', error);
    res.status(500).json({ message: 'Erro ao atualizar sinal' });
  }
});

app.delete('/api/signals/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const id = Number(req.params.id);
    await storage.deleteSignal(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar sinal:', error);
    res.status(500).json({ message: 'Erro ao deletar sinal' });
  }
});

// Close signal with TP1/TP2/SL
app.post('/api/signals/:id/close', authenticateToken, async (req: any, res) => {
  console.log(`=== ROTA CLOSE SIGNAL CHAMADA ===`);
  console.log(`ID recebido: ${req.params.id}`);
  console.log(`Body recebido:`, req.body);
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const signalId = Number(req.params.id);
    const { result, type } = req.body;
    
    console.log(`Fechando sinal ${signalId} com tipo ${type} e resultado ${result} pips`);
    
    // Encontrar o sinal
    const signalIndex = signals.findIndex(s => s.id === signalId);
    
    if (signalIndex === -1) {
      return res.status(404).json({ message: 'Sinal não encontrado' });
    }
    
    // Atualizar o sinal para fechado
    const updatedSignal = {
      ...signals[signalIndex],
      status: 'closed',
      result: result,
      closedAt: new Date().toISOString()
    };
    
    signals[signalIndex] = updatedSignal;
    
    console.log(`Sinal ${signalId} fechado com sucesso. Status: ${updatedSignal.status}`);
    console.log('Sinal atualizado:', JSON.stringify(updatedSignal, null, 2));
    
    res.json(updatedSignal);
  } catch (error) {
    console.error('Erro ao fechar sinal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// LESSONS CRUD
app.get('/api/lessons', authenticateToken, async (req, res) => {
  try {
    const allLessons = await storage.getLessons();
    res.json(allLessons);
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    res.status(500).json({ message: 'Erro ao buscar aulas' });
  }
});

app.post('/api/lessons', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const newLesson = await storage.createLesson(req.body);
    res.json(newLesson);
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ message: 'Erro ao criar aula' });
  }
});

app.put('/api/lessons/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const id = Number(req.params.id);
    const updatedLesson = await storage.updateLesson(id, req.body);
    res.json(updatedLesson);
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    res.status(500).json({ message: 'Erro ao atualizar aula' });
  }
});

app.delete('/api/lessons/:id', authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  
  try {
    const id = Number(req.params.id);
    await storage.deleteLesson(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar aula:', error);
    res.status(500).json({ message: 'Erro ao deletar aula' });
  }
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
    // Usar estatísticas do banco de dados
    const adminStats = await storage.getAdminStats();
    console.log('Admin stats from database:', adminStats);
    
    res.json(adminStats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
});

app.get('/api/stats/user', authenticateToken, async (req: any, res) => {
  try {
    const userStats = await storage.getUserStats(req.user.id);
    res.json(userStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas do usuário' });
  }
});



// PROFILE UPDATE - ROTA FUNCIONAL (caminho diferente para evitar Vite)
app.put('/profile-update', authenticateToken, async (req: any, res) => {
  try {
    console.log('=== PROFILE UPDATE REQUEST ===');
    console.log('Body:', req.body);
    console.log('User:', req.user);

    const { firstName, lastName, phone, bio } = req.body;
    const userId = req.user.id;

    const updatedUser = await storage.updateUser(userId, {
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || '',
      bio: bio || ''
    });

    console.log('User updated:', updatedUser);

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil'
    });
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

// Atualizar dados do perfil
app.put('/api/profile', authenticateToken, async (req: any, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;
    const userId = req.user.id;
    
    console.log('Atualizando perfil do usuário:', userId, {
      firstName,
      lastName,
      phone,
      bio
    });

    const updatedUser = await storage.updateUser(userId, {
      firstName,
      lastName,
      phone,
      bio
    });

    res.json({ 
      success: true, 
      message: 'Perfil atualizado com sucesso',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Create HTTP server
const httpServer = createServer(app);

// Register essential routes BEFORE Vite setup
console.log('Registering API routes before Vite...');

// Start server - reorganized to avoid Vite conflicts
(async () => {
  const port = process.env.PORT || 5000;
  
  // First start the server
  httpServer.listen(port, '0.0.0.0', () => {
    log(`TradeSignal Pro server running on port ${port}`);
    log(`Login endpoint available at: /login-user`);
  });
  
  // Then setup Vite AFTER the server is listening
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }
})();