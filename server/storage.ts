import {
  users,
  signals,
  lessons,
  plans,
  userLessons,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

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
}

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
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
    const [updatedSignal] = await db
      .update(signals)
      .set(updates)
      .where(eq(signals.id, id))
      .returning();
    return updatedSignal;
  }

  async deleteSignal(id: number): Promise<void> {
    await db.delete(signals).where(eq(signals.id, id));
  }

  async closeSignal(id: number, result: number): Promise<Signal> {
    const [closedSignal] = await db
      .update(signals)
      .set({
        status: "closed",
        result: result.toString(),
        closedAt: new Date(),
      })
      .where(eq(signals.id, id))
      .returning();
    return closedSignal;
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
    const [updatedLesson] = await db
      .update(lessons)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson;
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
    const [updatedPlan] = await db
      .update(plans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(plans.id, id))
      .returning();
    return updatedPlan;
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
    
    const userProgress = await this.getUserLessonProgress(userId);
    const completedLessons = userProgress.filter(p => p.isCompleted).length;

    // Calculate win rate and profit from closed signals
    const closedSignals = await db
      .select()
      .from(signals)
      .where(eq(signals.status, "closed"));
    
    const winningSignals = closedSignals.filter(s => 
      s.result && parseFloat(s.result) > 0
    );
    const winRate = closedSignals.length > 0 
      ? (winningSignals.length / closedSignals.length) * 100 
      : 0;
    
    const totalProfit = closedSignals.reduce((sum, signal) => 
      sum + (signal.result ? parseFloat(signal.result) : 0), 0
    );

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
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [activeSignalsCount] = await db
      .select({ count: count() })
      .from(signals)
      .where(eq(signals.status, "active"));
    const [lessonsCount] = await db.select({ count: count() }).from(lessons);

    // Calculate estimated monthly revenue based on subscription plans
    const activeUsers = await db
      .select()
      .from(users)
      .where(eq(users.subscriptionStatus, "active"));
    
    const allPlans = await this.getPlans();
    const planPriceMap = allPlans.reduce((map, plan) => {
      map[plan.name.toLowerCase()] = parseFloat(plan.price);
      return map;
    }, {} as Record<string, number>);

    const monthlyRevenue = activeUsers.reduce((sum, user) => {
      const planPrice = planPriceMap[user.subscriptionPlan || ""] || 0;
      return sum + planPrice;
    }, 0);

    return {
      totalUsers: userCount.count,
      activeSignals: activeSignalsCount.count,
      totalLessons: lessonsCount.count,
      monthlyRevenue: Math.round(monthlyRevenue),
    };
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }
}

export const storage = new DatabaseStorage();
