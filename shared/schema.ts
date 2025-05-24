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
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"), // 'admin' or 'user'
  subscriptionPlan: varchar("subscription_plan").default("free"), // 'free', 'basic', 'premium', 'vip'
  subscriptionStatus: varchar("subscription_status").default("inactive"), // 'active', 'inactive', 'cancelled'
  subscriptionExpiry: timestamp("subscription_expiry"),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  signals: many(signals),
  lessons: many(lessons),
  userLessons: many(userLessons),
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
