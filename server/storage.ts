import {
  users,
  signals,
  lessons,
  plans,
  userLessons,
  subscriptionRequests,
  tradingEntries,
  type User,
  type UpsertUser,
  type Signal,
  type InsertSignal,
  type Lesson,
  type InsertLesson,
  type Plan,
  type InsertPlan,
  type UserLesson,
  type InsertUserLesson,
  type SubscriptionRequest,
  type InsertSubscriptionRequest,
  type TradingEntry,
  type InsertTradingEntry,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, count, sql, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  createUser(user: Partial<UpsertUser>): Promise<User>;

  // Signal operations
  getSignals(): Promise<Signal[]>;
  getSignalById(id: number): Promise<Signal | undefined>;
  createSignal(signal: InsertSignal): Promise<Signal>;
  updateSignal(id: number, updates: Partial<InsertSignal>): Promise<Signal>;
  deleteSignal(id: number): Promise<void>;
  closeSignal(id: number, result: number): Promise<Signal>;

  // Lesson operations
  getLessons(): Promise<Lesson[]>;
  getPublishedLessons(): Promise<Lesson[]>;
  getLessonById(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, updates: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: number): Promise<void>;

  // Plan operations
  getPlans(): Promise<Plan[]>;
  getActivePlans(): Promise<Plan[]>;
  getPlanById(id: number): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: number, updates: Partial<InsertPlan>): Promise<Plan>;
  deletePlan(id: number): Promise<void>;

  // User lesson progress
  getUserLessonProgress(userId: string): Promise<UserLesson[]>;
  markLessonCompleted(userId: string, lessonId: number): Promise<UserLesson>;

  // Statistics
  getUserStats(userId: string): Promise<{
    totalUsers: number;
    activeSignals: number;
    completedLessons: number;
    winRate: number;
    totalProfit: number;
  }>;
  getAdminStats(): Promise<{
    totalUsers: number;
    activeSignals: number;
    totalLessons: number;
    monthlyRevenue: number;
  }>;
  
  // User management for admin
  getUsers(): Promise<User[]>;
  
  // Subscription request operations
  createSubscriptionRequest(request: InsertSubscriptionRequest): Promise<SubscriptionRequest>;
  getSubscriptionRequests(): Promise<SubscriptionRequest[]>;
  getSubscriptionRequest(id: number): Promise<SubscriptionRequest | undefined>;
  updateSubscriptionRequest(id: number, updates: Partial<InsertSubscriptionRequest>): Promise<SubscriptionRequest>;
  
  // Trading entries operations
  getTradingEntriesByUser(userId: string): Promise<TradingEntry[]>;
  createTradingEntry(entry: InsertTradingEntry): Promise<TradingEntry>;
  updateTradingEntry(id: number, updates: Partial<InsertTradingEntry>): Promise<TradingEntry>;
  deleteTradingEntry(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      return result[0] || undefined;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  async createUser(userData: Partial<UpsertUser>): Promise<User> {
    try {
      const [newUser] = await db.insert(users).values({
        id: userData.id || `user_${Date.now()}`,
        email: userData.email?.toLowerCase(),
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'user',
        subscriptionStatus: userData.subscriptionStatus || 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      console.log('Novo usuário criado:', newUser.email);
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Signal operations
  async getSignals(): Promise<Signal[]> {
    return await db.select().from(signals).orderBy(desc(signals.createdAt));
  }

  async getSignalById(id: number): Promise<Signal | undefined> {
    const [signal] = await db.select().from(signals).where(eq(signals.id, id));
    return signal;
  }

  async createSignal(signal: InsertSignal): Promise<Signal> {
    const [newSignal] = await db.insert(signals).values(signal).returning();
    return newSignal;
  }

  async updateSignal(id: number, updates: Partial<InsertSignal>): Promise<Signal> {
    const [updated] = await db
      .update(signals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(signals.id, id))
      .returning();
    return updated;
  }

  async deleteSignal(id: number): Promise<void> {
    await db.delete(signals).where(eq(signals.id, id));
  }

  async closeSignal(id: number, result: number): Promise<Signal> {
    const [updated] = await db
      .update(signals)
      .set({ 
        status: "closed", 
        result: result.toString(),
        updatedAt: new Date() 
      })
      .where(eq(signals.id, id))
      .returning();
    return updated;
  }

  // Lesson operations
  async getLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons).orderBy(desc(lessons.createdAt));
  }

  async getPublishedLessons(): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.isPublished, true))
      .orderBy(desc(lessons.createdAt));
  }

  async getLessonById(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  async updateLesson(id: number, updates: Partial<InsertLesson>): Promise<Lesson> {
    const [updated] = await db
      .update(lessons)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lessons.id, id))
      .returning();
    return updated;
  }

  async deleteLesson(id: number): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // Plan operations
  async getPlans(): Promise<Plan[]> {
    return await db.select().from(plans).orderBy(plans.price);
  }

  async getActivePlans(): Promise<Plan[]> {
    return await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true))
      .orderBy(plans.price);
  }

  async getPlanById(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan;
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const [newPlan] = await db.insert(plans).values(plan).returning();
    return newPlan;
  }

  async updatePlan(id: number, updates: Partial<InsertPlan>): Promise<Plan> {
    const [updated] = await db
      .update(plans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(plans.id, id))
      .returning();
    return updated;
  }

  async deletePlan(id: number): Promise<void> {
    await db.delete(plans).where(eq(plans.id, id));
  }

  // User lesson progress
  async getUserLessonProgress(userId: string): Promise<UserLesson[]> {
    return await db
      .select()
      .from(userLessons)
      .where(eq(userLessons.userId, userId));
  }

  async markLessonCompleted(userId: string, lessonId: number): Promise<UserLesson> {
    const [existingProgress] = await db
      .select()
      .from(userLessons)
      .where(
        and(eq(userLessons.userId, userId), eq(userLessons.lessonId, lessonId))
      );

    if (existingProgress) {
      const [updated] = await db
        .update(userLessons)
        .set({ isCompleted: true, completedAt: new Date() })
        .where(eq(userLessons.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userLessons)
        .values({
          userId,
          lessonId,
          isCompleted: true,
          completedAt: new Date(),
        })
        .returning();
      return newProgress;
    }
  }

  // Statistics
  async getUserStats(userId: string): Promise<{
    totalUsers: number;
    activeSignals: number;
    completedLessons: number;
    winRate: number;
    totalProfit: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [activeSignalsCount] = await db
      .select({ count: count() })
      .from(signals)
      .where(eq(signals.status, "active"));

    const userProgress = await db
      .select()
      .from(userLessons)
      .where(and(eq(userLessons.userId, userId), eq(userLessons.isCompleted, true)));

    const completedLessons = userProgress.length;

    // Calculate win rate and profit from closed signals
    const closedSignals = await db
      .select()
      .from(signals)
      .where(eq(signals.status, "closed"));

    const winningSignals = closedSignals.filter(s => parseFloat(s.result || "0") > 0).length;
    const winRate = closedSignals.length > 0 ? (winningSignals / closedSignals.length) * 100 : 0;
    
    const totalProfit = closedSignals.reduce((sum, signal) => {
      return sum + parseFloat(signal.result || "0");
    }, 0);

    return {
      totalUsers: userCount.count,
      activeSignals: activeSignalsCount.count,
      completedLessons,
      winRate: Math.round(winRate),
      totalProfit: Math.round(totalProfit),
    };
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    activeSignals: number;
    totalLessons: number;
    monthlyRevenue: number;
    totalPips: number;
    winRate: number;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [activeSignalsCount] = await db
      .select({ count: count() })
      .from(signals)
      .where(eq(signals.status, "active"));
    const [lessonsCount] = await db.select({ count: count() }).from(lessons);

    // Calculate monthly revenue based on active subscriptions
    const activeUsers = await db
      .select()
      .from(users)
      .where(eq(users.subscriptionStatus, "active"));

    const monthlyRevenue = activeUsers.reduce((total, user) => {
      const plan = user.subscriptionPlan;
      if (plan === "basic") return total + 47;
      if (plan === "premium") return total + 97;
      if (plan === "vip") return total + 197;
      return total;
    }, 0);

    // Calculate win rate and total pips from closed signals
    const closedSignals = await db
      .select()
      .from(signals)
      .where(eq(signals.status, "closed"));

    const winningSignals = closedSignals.filter(s => parseFloat(s.result || "0") > 0).length;
    const winRate = closedSignals.length > 0 ? (winningSignals / closedSignals.length) * 100 : 85; // Default 85% if no signals
    
    const totalPips = closedSignals.reduce((sum, signal) => {
      return sum + parseFloat(signal.result || "0");
    }, 0);

    return {
      totalUsers: userCount.count,
      activeSignals: activeSignalsCount.count,
      totalLessons: lessonsCount.count,
      monthlyRevenue: Math.round(monthlyRevenue),
      totalPips: Math.round(totalPips),
      winRate: Math.round(winRate),
    };
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Subscription request operations
  async createSubscriptionRequest(request: InsertSubscriptionRequest): Promise<SubscriptionRequest> {
    const [subscriptionRequest] = await db
      .insert(subscriptionRequests)
      .values(request)
      .returning();
    return subscriptionRequest;
  }

  async getSubscriptionRequests(): Promise<SubscriptionRequest[]> {
    return await db.select().from(subscriptionRequests).orderBy(desc(subscriptionRequests.requestDate));
  }

  async getSubscriptionRequest(id: number): Promise<SubscriptionRequest | undefined> {
    const [request] = await db
      .select()
      .from(subscriptionRequests)
      .where(eq(subscriptionRequests.id, id));
    return request;
  }

  async updateSubscriptionRequest(id: number, updates: Partial<InsertSubscriptionRequest>): Promise<SubscriptionRequest> {
    const [updated] = await db
      .update(subscriptionRequests)
      .set(updates)
      .where(eq(subscriptionRequests.id, id))
      .returning();
    return updated;
  }

  // Trading entries operations
  async getTradingEntriesByUser(userId: string): Promise<TradingEntry[]> {
    return await db
      .select()
      .from(tradingEntries)
      .where(eq(tradingEntries.userId, userId))
      .orderBy(desc(tradingEntries.date));
  }

  async createTradingEntry(entry: InsertTradingEntry): Promise<TradingEntry> {
    const [tradingEntry] = await db
      .insert(tradingEntries)
      .values(entry)
      .returning();
    return tradingEntry;
  }

  async updateTradingEntry(id: number, updates: Partial<InsertTradingEntry>): Promise<TradingEntry> {
    const [tradingEntry] = await db
      .update(tradingEntries)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(tradingEntries.id, id))
      .returning();
    return tradingEntry;
  }

  async deleteTradingEntry(id: number): Promise<void> {
    await db.delete(tradingEntries).where(eq(tradingEntries.id, id));
  }
}

export const storage = new DatabaseStorage();