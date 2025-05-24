import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import { storage } from "./simpleStorage";

const app = express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Login endpoint
app.post('/login-user', async (req, res) => {
  console.log('=== API SERVER - LOGIN ENDPOINT HIT ===');
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

const port = 5001;
app.listen(port, '0.0.0.0', () => {
  console.log(`API Server running on port ${port}`);
});