import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('🚀 Iniciando migração do banco de dados...');

  try {
    // Criar tabela de usuários se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        subscription_status VARCHAR(20) NOT NULL DEFAULT 'inactive',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Tabela users criada/verificada');

    // Verificar se o usuário já existe
    const existingUser = await sql`
      SELECT id FROM users WHERE email = 'alessandrabertoo2001@gmail.com'
    `;

    if (existingUser.length === 0) {
      // Hash da senha
      const hashedPassword = await bcrypt.hash('1339Ale@', 10);
      
      // Inserir usuário de teste
      await sql`
        INSERT INTO users (email, password, first_name, last_name, role, subscription_status)
        VALUES ('alessandrabertoo2001@gmail.com', ${hashedPassword}, 'Alessandra', 'Berto', 'user', 'active')
      `;
      console.log('✅ Usuário Alessandra criado com sucesso');
    } else {
      console.log('ℹ️ Usuário Alessandra já existe');
    }

    // Verificar se o admin já existe
    const existingAdmin = await sql`
      SELECT id FROM users WHERE email = 'homercavalcanti@gmail.com'
    `;

    if (existingAdmin.length === 0) {
      // Hash da senha
      const hashedAdminPassword = await bcrypt.hash('Betinho21@', 10);
      
      // Inserir admin
      await sql`
        INSERT INTO users (email, password, first_name, last_name, role, subscription_status)
        VALUES ('homercavalcanti@gmail.com', ${hashedAdminPassword}, 'Homer', 'Cavalcanti', 'admin', 'active')
      `;
      console.log('✅ Usuário Admin criado com sucesso');
    } else {
      console.log('ℹ️ Usuário Admin já existe');
    }

    console.log('🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

migrate();