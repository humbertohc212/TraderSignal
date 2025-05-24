import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import "./types";

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  // Debug middleware
  app.use('/api', (req: any, res, next) => {
    console.log('Debug da requisição:', {
      path: req.path,
      method: req.method,
      headers: req.headers,
      cookies: req.cookies,
      body: req.body
    });
    next();
  });

  // Rota de login
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
      
      // Verificação direta e simples
      let userData = null;
      
      if (email === 'alessandrabertoo2001@gmail.com' && password === '1339Ale@') {
        userData = {
          id: 'user_alessandra',
          email: 'alessandrabertoo2001@gmail.com',
          role: 'user',
          firstName: 'Alessandra',
          lastName: 'Berto'
        };
      } else if (email === 'homercavalcanti@gmail.com' && password === 'Betinho21@') {
        userData = {
          id: 'admin_homer',
          email: 'homercavalcanti@gmail.com',
          role: 'admin',
          firstName: 'Homer',
          lastName: 'Cavalcanti'
        };
      }
      
      if (!userData) {
        return res.status(401).json({ 
          success: false,
          message: 'Credenciais inválidas' 
        });
      }
      
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
      
      // Define o cookie de autenticação
      res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      
      return res.status(200).json({ 
        success: true, 
        user: userData,
        token: token
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ 
        success: false,
        message: "Erro no servidor" 
      });
    }
  });

  // Middleware de autenticação JWT
  const jwtAuth = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      let token = null;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = req.cookies['auth-token'];
      }
      
      if (!token) {
        return res.status(401).json({ message: "Não autorizado" });
      }
      
      const userData = jwt.verify(token, JWT_SECRET) as any;
      req.user = userData;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Não autorizado" });
    }
  };

  // Rota de verificação do usuário
  app.get('/api/auth/user', jwtAuth, async (req: any, res) => {
    console.log('User data from token:', req.user);
    res.json(req.user);
  });

  // Rota de logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });
    
    res.json({ 
      success: true,
      message: 'Logout realizado com sucesso',
      clearStorage: true
    });
  });

  // Rota pública para obter planos (não requer autenticação)
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

  return server;
}