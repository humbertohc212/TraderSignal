import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
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
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        console.log('User not found in database, returning token data');
        return res.json(req.user);
      }

      // Log para debug
      console.log('User data from database:', {
        id: user.id,
        initialBalance: user.initialBalance,
        monthlyGoal: user.monthlyGoal,
        currentBalance: user.currentBalance
      });

      // Não retornar a senha
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao buscar usuário do banco:', error);
      // Fallback para dados do token se houver erro
      res.json(req.user);
    }
  });

  // Rota de estatísticas do usuário
  app.get('/api/stats', jwtAuth, async (req: any, res) => {
    try {
      console.log('=== ROTA /api/stats CHAMADA ===');
      const userId = req.user.id;
      
      // Buscar todos os sinais
      const allSignals = await storage.getSignals();
      const userTradingEntries = await storage.getTradingEntriesByUser(userId);
      
      // Calcular sinais ativos
      const activeSignals = allSignals.filter(signal => signal.status === 'active').length;
      
      // Calcular sinais fechados
      const closedSignals = allSignals.filter(signal => signal.status === 'closed');
      
      // Calcular total de pips dos sinais fechados
      const totalPips = closedSignals.reduce((sum, signal) => {
        const result = parseFloat(signal.result || "0");
        // Converter valores altos em pips (BTC 13000 -> 130 pips)
        const pips = result > 1000 ? Math.round(result / 100) : result;
        console.log(`Signal ${signal.id} - Result: ${result}, Converted Pips: ${pips}`);
        return sum + (pips > 0 ? pips : 0);
      }, 0);
      
      // Calcular taxa de acerto dos sinais
      const winningSignals = closedSignals.filter(signal => {
        const result = parseFloat(signal.result || "0");
        return result > 0;
      });
      const winRate = closedSignals.length > 0 ? Math.round((winningSignals.length / closedSignals.length) * 100) : 87;
      
      // Calcular pips das operações do usuário
      const userPips = userTradingEntries.reduce((sum, entry) => {
        const pips = parseFloat(entry.pips || "0");
        console.log(`User entry - Pips: ${pips}`);
        return sum + Math.abs(pips); // Contar todos os pips, positivos e negativos
      }, 0);
      
      // Total de pips (sinais + operações do usuário)
      const totalUserPips = totalPips + userPips;
      
      // Calcular número de lições (mock por enquanto)
      const completedLessons = 8;
      const totalLessons = 25;
      
      const statsResponse = {
        totalPips: Math.round(totalUserPips),
        activeSignals,
        winRate,
        completedLessons,
        totalLessons,
        userPips: Math.round(userPips),
        signalPips: Math.round(totalPips),
        totalSignals: allSignals.length,
        closedSignals: closedSignals.length,
        winningSignals: winningSignals.length
      };
      
      console.log('Stats Response:', statsResponse);
      res.json(statsResponse);
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
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

  // Atualizar configurações da banca do usuário
  app.put('/api/user/bank-config', jwtAuth, async (req: any, res) => {
    try {
      const { initialBalance, monthlyGoal, defaultLotSize } = req.body;
      const userId = req.user.id;
      
      console.log('Updating bank config for user:', userId, {
        initialBalance,
        monthlyGoal, 
        defaultLotSize
      });
      
      if (!initialBalance || !monthlyGoal || !defaultLotSize) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      // Atualizar usando o storage corretamente
      const user = await storage.updateUser(userId, {
        initialBalance: initialBalance.toString(),
        currentBalance: initialBalance.toString(), 
        monthlyGoal: monthlyGoal.toString(),
        defaultLotSize: defaultLotSize.toString()
      });
      
      console.log('User updated successfully:', {
        id: user.id,
        initialBalance: user.initialBalance,
        currentBalance: user.currentBalance,
        monthlyGoal: user.monthlyGoal
      });
      
      res.json({ 
        message: 'Configurações da banca atualizadas com sucesso',
        user: user
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações da banca:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
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

  // ========== ROTAS DO PERFIL ==========
  
  // Atualizar dados do perfil
  app.put('/api/profile', jwtAuth, async (req: any, res) => {
    try {
      const { userId, firstName, lastName, phone, bio } = req.body;
      const authenticatedUserId = req.user.id;
      
      // Usar o ID do usuário autenticado se não foi fornecido
      const targetUserId = userId || authenticatedUserId;
      
      if (!targetUserId) {
        return res.status(400).json({ message: 'ID do usuário é obrigatório' });
      }

      console.log('Atualizando perfil do usuário:', targetUserId, {
        firstName,
        lastName,
        phone,
        bio
      });

      const updatedUser = await storage.updateUser(targetUserId, {
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

  // Buscar entradas de trading do usuário
  app.get('/api/trading-entries/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ message: 'ID do usuário é obrigatório' });
      }

      const entries = await storage.getTradingEntriesByUser(userId);
      res.json(entries);
    } catch (error) {
      console.error('Erro ao buscar entradas de trading:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Criar nova entrada de trading
  app.post('/api/trading-entries', async (req, res) => {
    try {
      const { userId, pair, type, amount, pips, notes, date } = req.body;
      
      if (!userId || !pair || !type || !amount || !notes || !date) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const newEntry = await storage.createTradingEntry({
        userId,
        pair,
        type,
        amount: amount.toString(),
        pips: pips ? pips.toString() : null,
        notes,
        date
      });

      res.json({ 
        success: true, 
        message: 'Entrada de trading criada com sucesso',
        entry: newEntry 
      });
    } catch (error) {
      console.error('Erro ao criar entrada de trading:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Atualizar entrada de trading
  app.put('/api/trading-entries/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { pair, type, amount, notes, date } = req.body;
      
      const updatedEntry = await storage.updateTradingEntry(parseInt(id), {
        pair,
        type,
        amount: amount?.toString(),
        notes,
        date
      });

      res.json({ 
        success: true, 
        message: 'Entrada de trading atualizada com sucesso',
        entry: updatedEntry 
      });
    } catch (error) {
      console.error('Erro ao atualizar entrada de trading:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Deletar entrada de trading
  app.delete('/api/trading-entries/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteTradingEntry(parseInt(id));

      res.json({ 
        success: true, 
        message: 'Entrada de trading removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar entrada de trading:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  return server;
}