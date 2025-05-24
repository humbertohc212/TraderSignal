import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import { eq, and, sql as sqlBuilder } from 'drizzle-orm';
import * as schema from './schema';

// Configuração do NeonDB
neonConfig.fetchConnectionCache = true;

// Certifique-se de definir DATABASE_URL no arquivo .env
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Funções auxiliares para operações com usuários
export async function getUserByEmail(email: string) {
  try {
    const users = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()));
    return users[0] || null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  subscriptionStatus?: string;
}) {
  try {
    const users = await db.insert(schema.users)
      .values({
        ...userData,
        email: userData.email.toLowerCase(),
        role: userData.role || 'user',
        subscriptionStatus: userData.subscriptionStatus || 'inactive'
      })
      .returning();
    return users[0];
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

export async function updateUser(id: number, updates: Partial<typeof schema.users.$inferSelect>) {
  try {
    const users = await db.update(schema.users)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(schema.users.id, id))
      .returning();
    return users[0];
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

export async function deleteUser(id: number) {
  try {
    const users = await db.delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();
    return users[0];
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
}