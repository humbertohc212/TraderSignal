import { db } from './db';
import { users, type User } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const storage = {
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      return result[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    subscriptionStatus?: string;
  }): Promise<User> {
    try {
      const [newUser] = await db.insert(users).values({
        id: `user_${Date.now()}`,
        email: userData.email.toLowerCase(),
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'user',
        subscriptionStatus: userData.subscriptionStatus || 'inactive',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      console.log('Novo usuário criado:', newUser.email);
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const [updatedUser] = await db.update(users)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(users.id, id))
        .returning();

      console.log('Usuário atualizado:', updatedUser.email);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      console.log('Usuário removido:', id);
      return true;
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      throw error;
    }
  }
};