import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS para permitir requisições do Vite em desenvolvimento
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.repl.co', 'https://*.replit.dev'] 
    : ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing de JSON e cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Tratamento de erros de JSON
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ 
      success: false,
      message: 'JSON inválido' 
    });
  }
  next();
});

// Registra as rotas da API
registerRoutes(app).then(server => {
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log('URLs de desenvolvimento:');
      console.log(`- API: http://localhost:${PORT}`);
      console.log('- Cliente: http://localhost:5173');
    }
  });
}).catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
});