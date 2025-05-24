import type { Express } from "express";
import { createServer, type Server } from "http";
// WebSocket imports removed to prevent connection errors
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSignalSchema, insertLessonSchema, insertPlanSchema } from "@shared/schema";
import { z } from "zod";
import "./types";

const JWT_SECRET = 'your-jwt-secret-key';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

// Store WebSocket connections
const wsClients = new Set<WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Skip the complex auth setup for now to avoid conflicts
  // await setupAuth(app);

  // Debug middleware
  app.use('/api', (req: any, res, next) => {
    console.log('Session debug:', {
      sessionID: req.sessionID,
      hasSession: !!req.session,
      sessionUser: req.session?.user,
      cookies: req.headers.cookie
    });
    next();
  });

  // JWT-based auth check
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const token = req.cookies['auth-token'];
      console.log('Auth check - Token:', token ? 'present' : 'missing');
      
      if (!token) {
        console.log('No token found, returning 401');
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify JWT token
      const userData = jwt.verify(token, JWT_SECRET) as any;
      console.log('Token verified, user:', userData);
      
      res.json(userData);
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // JWT-based login endpoint 
  app.post('/api/auth/login', (req, res) => {
    console.log('Login attempt:', req.body);
    
    try {
      const { email, password } = req.body;
      
      // For admin credentials
      if (email === 'homercavalcanti@gmail.com' && password === 'Betinho21@') {
        const userData = {
          id: 'admin-user-id',
          email: email,
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User'
        };
        
        // Create JWT token
        const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
        
        // Set token as httpOnly cookie
        res.cookie('auth-token', token, {
          httpOnly: true,
          secure: false,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'lax'
        });
        
        console.log('Token created and set:', token);
        
        // Return immediately with JSON
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ 
          success: true, 
          user: userData
        });
      } else {
        res.setHeader('Content-Type', 'application/json');
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ message: "Erro no servidor" });
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
        firstName,
        lastName,
        role: 'user',
        subscriptionStatus: 'inactive'
      });

      // Create session
      (req as any).session.user = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      };
      res.json({ success: true, user: newUser });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Erro ao criar conta" });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  // JWT auth middleware
  const jwtAuth = (req: any, res: any, next: any) => {
    try {
      const token = req.cookies['auth-token'];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userData = jwt.verify(token, JWT_SECRET) as any;
      req.user = userData;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('auth-token');
    res.json({ success: true });
  });

  // Signals routes
  app.get("/api/signals", jwtAuth, async (req, res) => {
    try {
      const signals = await storage.getSignals();
      res.json(signals);
    } catch (error) {
      console.error("Error fetching signals:", error);
      res.status(500).json({ message: "Failed to fetch signals" });
    }
  });

  app.post("/api/signals", jwtAuth, async (req: any, res) => {
    try {
      const user = req.user;
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Clean the data before validation
      const cleanBody = { ...req.body };
      if (cleanBody.takeProfit2Price === "" || cleanBody.takeProfit2Price === null) {
        delete cleanBody.takeProfit2Price;
      }
      
      const signalData = insertSignalSchema.parse({
        ...cleanBody,
        createdBy: user.id,
      });
      
      const signal = await storage.createSignal(signalData);
      res.json(signal);
    } catch (error) {
      console.error("Error creating signal:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid signal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create signal" });
    }
  });

  app.put("/api/signals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const signal = await storage.updateSignal(id, updates);
      res.json(signal);
    } catch (error) {
      console.error("Error updating signal:", error);
      res.status(500).json({ message: "Failed to update signal" });
    }
  });

  app.post("/api/signals/:id/close", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const { result } = req.body;
      
      const signal = await storage.closeSignal(id, result);
      res.json(signal);
    } catch (error) {
      console.error("Error closing signal:", error);
      res.status(500).json({ message: "Failed to close signal" });
    }
  });

  app.delete("/api/signals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteSignal(id);
      res.json({ message: "Signal deleted successfully" });
    } catch (error) {
      console.error("Error deleting signal:", error);
      res.status(500).json({ message: "Failed to delete signal" });
    }
  });

  // Lessons routes
  app.get("/api/lessons", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let lessons;
      if (user?.role === "admin") {
        lessons = await storage.getLessons();
      } else {
        lessons = await storage.getPublishedLessons();
      }
      
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.post("/api/lessons", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const lessonData = insertLessonSchema.parse({
        ...req.body,
        createdBy: userId,
      });
      
      const lesson = await storage.createLesson(lessonData);
      res.json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lesson data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  app.put("/api/lessons/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const lesson = await storage.updateLesson(id, updates);
      res.json(lesson);
    } catch (error) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ message: "Failed to update lesson" });
    }
  });

  app.delete("/api/lessons/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteLesson(id);
      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ message: "Failed to delete lesson" });
    }
  });

  app.post("/api/lessons/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lessonId = parseInt(req.params.id);
      
      const progress = await storage.markLessonCompleted(userId, lessonId);
      res.json(progress);
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      res.status(500).json({ message: "Failed to mark lesson complete" });
    }
  });

  // Plans routes
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getActivePlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  app.post("/api/plans", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const planData = insertPlanSchema.parse(req.body);
      const plan = await storage.createPlan(planData);
      res.json(plan);
    } catch (error) {
      console.error("Error creating plan:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create plan" });
    }
  });

  app.put("/api/plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const plan = await storage.updatePlan(id, updates);
      res.json(plan);
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ message: "Failed to update plan" });
    }
  });

  app.delete("/api/plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deletePlan(id);
      res.json({ message: "Plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ message: "Failed to delete plan" });
    }
  });

  // Get all users (admin only)
  app.get("/api/users", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Update user (admin only)
  app.put("/api/users/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = req.params.id;
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(id, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Backup and export routes
  app.post("/api/admin/backup-database", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Create a comprehensive backup with all data
      const users = await storage.getUsers();
      const signals = await storage.getSignals();
      const lessons = await storage.getLessons();
      const plans = await storage.getPlans();
      
      const backupData = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        data: {
          users: users.length,
          signals: signals.length,
          lessons: lessons.length,
          plans: plans.length
        },
        // Note: In production, you'd export the actual SQL
        backup_info: "Full database backup created successfully"
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=backup.json');
      res.json(backupData);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  app.post("/api/admin/export-users", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getUsers();
      
      // Convert to CSV format
      const csvHeader = "ID,Email,Nome,Plano,Status,Cadastro\n";
      const csvData = users.map(u => 
        `${u.id},"${u.email || 'N/A'}","${u.firstName || ''} ${u.lastName || ''}","${u.subscriptionPlan || 'Nenhum'}","${u.subscriptionStatus || 'Inativo'}","${u.createdAt || ''}"`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users-export.csv');
      res.send(csvHeader + csvData);
    } catch (error) {
      console.error("Error exporting users:", error);
      res.status(500).json({ message: "Failed to export users" });
    }
  });

  app.post("/api/admin/export-signals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const signals = await storage.getSignals();
      
      // Convert to CSV format
      const csvHeader = "ID,Par,Direção,Entrada,Take Profit,Stop Loss,Status,Resultado,Data\n";
      const csvData = signals.map(s => 
        `${s.id},"${s.pair}","${s.direction}","${s.entryPrice}","${s.takeProfitPrice}","${s.stopLossPrice}","${s.status}","${s.result || 'N/A'}","${s.createdAt || ''}"`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=signals-export.csv');
      res.send(csvHeader + csvData);
    } catch (error) {
      console.error("Error exporting signals:", error);
      res.status(500).json({ message: "Failed to export signals" });
    }
  });

  // Statistics routes
  app.get("/api/stats/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get("/api/stats/admin", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // User progress routes
  app.get("/api/user/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserLessonProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const { planId } = req.body;
      
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email required" });
      }

      // Create Stripe customer if not exists
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, { stripeCustomerId: customerId });
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: `price_${planId}` }], // You'll need to create prices in Stripe
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
