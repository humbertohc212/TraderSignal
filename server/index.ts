import express from "express";
import jwt from "jsonwebtoken";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

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

app.get('/api/auth/user', authenticateToken, (req: any, res) => {
  res.json(req.user);
});

// Signals endpoint with multiple active signals
app.get('/api/signals', authenticateToken, (req, res) => {
  res.json([
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
    },
    {
      id: 3,
      pair: "USD/JPY",
      direction: "BUY",
      entryPrice: "150.20",
      takeProfitPrice: "151.00",
      stopLossPrice: "149.50",
      status: "closed",
      result: "+80 pips",
      analysis: "Bounce na support importante. Momentum forte.",
      tradingViewLink: "https://tradingview.com/chart",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);
});

app.get('/api/lessons', authenticateToken, (req, res) => {
  res.json([]);
});

app.get('/api/plans', authenticateToken, (req, res) => {
  res.json([]);
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