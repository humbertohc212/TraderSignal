import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  password: varchar("password"), // Campo para senha
  role: varchar("role").notNull().default("user"), // 'admin' or 'user'
  subscriptionPlan: varchar("subscription_plan").default("free"), // 'free', 'basic', 'premium', 'vip'
  subscriptionStatus: varchar("subscription_status").default("inactive"), // 'active', 'inactive', 'cancelled'
  subscriptionExpiry: timestamp("subscription_expiry"),
  isBanned: boolean("is_banned").default(false), // Para controle de banimento
  
  // Campos para progresso mensal baseado na banca
  initialBalance: decimal("initial_balance", { precision: 10, scale: 2 }), // Banca inicial do usuário
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }), // Banca atual
  monthlyGoal: decimal("monthly_goal", { precision: 10, scale: 2 }), // Meta financeira mensal
  defaultLotSize: decimal("default_lot_size", { precision: 3, scale: 2 }).default("0.01"), // Tamanho padrão do lote
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trading signals table
export const signals = pgTable("signals", {
  id: serial("id").primaryKey(),
  pair: varchar("pair").notNull(), // EUR/USD, GBP/USD, etc.
  direction: varchar("direction").notNull(), // BUY, SELL, BUY_LIMIT, SELL_LIMIT
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }).notNull(),
  takeProfitPrice: decimal("take_profit_price", { precision: 10, scale: 5 }).notNull(),
  takeProfit2Price: decimal("take_profit_2_price", { precision: 10, scale: 5 }),
  stopLossPrice: decimal("stop_loss_price", { precision: 10, scale: 5 }).notNull(),
  status: varchar("status").notNull().default("active"), // active, closed, cancelled
  result: decimal("result", { precision: 10, scale: 2 }), // pips gained/lost
  analysis: text("analysis"), // Technical analysis description
  tradingViewLink: varchar("trading_view_link"), // Link to TradingView chart
  allowedPlans: text("allowed_plans").array().default(['free', 'basic', 'premium', 'vip']), // Planos que podem ver este sinal
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
});

// Educational content/lessons table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // fundamentals, technical_analysis, psychology, strategies
  level: varchar("level").notNull(), // beginner, intermediate, advanced
  duration: integer("duration"), // duration in minutes
  videoUrl: varchar("video_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").notNull().references(() => users.id),
});

// Subscription plans table
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("BRL"),
  signalsPerWeek: integer("signals_per_week"),
  hasEducationalAccess: boolean("has_educational_access").default(false),
  hasPrioritySupport: boolean("has_priority_support").default(false),
  hasExclusiveAnalysis: boolean("has_exclusive_analysis").default(false),
  hasMentoring: boolean("has_mentoring").default(false),
  hasWhatsappSupport: boolean("has_whatsapp_support").default(false),
  hasDetailedReports: boolean("has_detailed_reports").default(false),
  isActive: boolean("is_active").default(true),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User progress on lessons
export const userLessons = pgTable("user_lessons", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription requests for manual approval
export const subscriptionRequests = pgTable("subscription_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: integer("plan_id").notNull().references(() => plans.id),
  planName: varchar("plan_name").notNull(),
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected
  requestDate: timestamp("request_date").defaultNow(),
  processedDate: timestamp("processed_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  signals: many(signals),
  lessons: many(lessons),
  userLessons: many(userLessons),
  subscriptionRequests: many(subscriptionRequests),
}));

export const signalsRelations = relations(signals, ({ one }) => ({
  creator: one(users, {
    fields: [signals.createdBy],
    references: [users.id],
  }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  creator: one(users, {
    fields: [lessons.createdBy],
    references: [users.id],
  }),
  userLessons: many(userLessons),
}));

export const userLessonsRelations = relations(userLessons, ({ one }) => ({
  user: one(users, {
    fields: [userLessons.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userLessons.lessonId],
    references: [lessons.id],
  }),
}));

export const subscriptionRequestsRelations = relations(subscriptionRequests, ({ one }) => ({
  user: one(users, {
    fields: [subscriptionRequests.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [subscriptionRequests.planId],
    references: [plans.id],
  }),
}));

// Trading entries table for user's personal trading diary
export const tradingEntries = pgTable("trading_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  signalId: integer("signal_id").references(() => signals.id), // Referência ao sinal seguido (opcional)
  pair: varchar("pair").notNull(), // Trading pair (EURUSD, BTCUSD, etc.)
  direction: varchar("direction").notNull(), // BUY ou SELL
  lotSize: decimal("lot_size", { precision: 5, scale: 2 }).notNull(), // Tamanho do lote
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }).notNull(), // Preço de entrada
  exitPrice: decimal("exit_price", { precision: 10, scale: 5 }), // Preço de saída
  result: varchar("result"), // "TP1", "TP2", "SL", "manual"
  pips: decimal("pips", { precision: 8, scale: 2 }), // Pips gained/lost
  profit: decimal("profit", { precision: 10, scale: 2 }), // Lucro/prejuízo em valor monetário
  notes: text("notes"), // User's notes about the trade
  status: varchar("status").notNull().default("open"), // open, closed
  date: date("date").notNull(), // Date of the trade
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradingEntriesRelations = relations(tradingEntries, ({ one }) => ({
  user: one(users, {
    fields: [tradingEntries.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertSignalSchema = createInsertSchema(signals).omit({
  id: true,
  createdAt: true,
  result: true,
  closedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserLessonSchema = createInsertSchema(userLessons).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionRequestSchema = createInsertSchema(subscriptionRequests).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof signals.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;
export type InsertUserLesson = z.infer<typeof insertUserLessonSchema>;
export type UserLesson = typeof userLessons.$inferSelect;
export type InsertSubscriptionRequest = z.infer<typeof insertSubscriptionRequestSchema>;
export type SubscriptionRequest = typeof subscriptionRequests.$inferSelect;

export const insertTradingEntrySchema = createInsertSchema(tradingEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTradingEntry = z.infer<typeof insertTradingEntrySchema>;
export type TradingEntry = typeof tradingEntries.$inferSelect;
