import express from "express";
import jwt from "jsonwebtoken";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Simple auth middleware
function authenticateToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  
  const { email, password } = req.body;
  
  if (email === 'homercavalcanti@gmail.com' && password === 'Betinho21@') {
    const userData = {
      id: 'admin-user-id',
      email: email,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User'
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

// User endpoint
app.get('/api/auth/user', authenticateToken, (req: any, res) => {
  res.json(req.user);
});

// Protected example
app.get('/api/signals', authenticateToken, (req, res) => {
  res.json([]);
});

const httpServer = createServer(app);

(async () => {
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  httpServer.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();