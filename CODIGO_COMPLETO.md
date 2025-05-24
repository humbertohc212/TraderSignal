# TradeSignal Pro - Código Completo

## Estrutura do Projeto

```
tradesignal-pro/
├── client/                 # Frontend React
├── server/                 # Backend Express
├── shared/                 # Schemas compartilhados
├── package.json           # Dependências
├── tsconfig.json          # Configuração TypeScript
├── tailwind.config.ts     # Configuração Tailwind
├── vite.config.ts         # Configuração Vite
└── drizzle.config.ts      # Configuração banco
```

## Arquivos Principais

### package.json
```json
{
  "name": "tradesignal-pro",
  "private": true,
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@neondatabase/serverless": "^0.9.1",
    "@radix-ui/react-*": "latest",
    "@stripe/react-stripe-js": "^2.7.0",
    "@stripe/stripe-js": "^3.3.0",
    "@tanstack/react-query": "^5.28.9",
    "drizzle-orm": "^0.30.8",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "jsonwebtoken": "^9.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "stripe": "^15.5.0",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.3",
    "vite": "^5.2.8",
    "wouter": "^3.1.2",
    "zod": "^3.23.6"
  }
}
```

### Credenciais de Admin
- **Email:** homercavalcanti@gmail.com
- **Senha:** Betinho21@

## Instruções de Instalação

1. **Extrair arquivos** em uma pasta
2. **Instalar dependências:**
   ```bash
   npm install
   ```
3. **Configurar variáveis de ambiente:**
   - DATABASE_URL (PostgreSQL)
   - STRIPE_SECRET_KEY
   - VITE_STRIPE_PUBLIC_KEY

4. **Executar aplicação:**
   ```bash
   npm run dev
   ```

## Funcionalidades Implementadas

✅ **Sistema de Autenticação JWT**
✅ **Dashboard Administrativo**
✅ **Gerenciamento de Sinais**
✅ **Seção Educacional**
✅ **Sistema de Planos/Assinatura**
✅ **Integração Stripe**
✅ **Interface Responsiva**
✅ **Backup Automatizado**

## Tecnologias Utilizadas

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Banco:** PostgreSQL + Drizzle ORM
- **Autenticação:** JWT
- **Pagamentos:** Stripe
- **Hospedagem:** Replit

---

*Este é o código completo da plataforma TradeSignal Pro desenvolvida para trading profissional.*