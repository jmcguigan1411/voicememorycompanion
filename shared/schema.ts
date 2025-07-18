import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audio files uploaded by users for voice training
export const audioFiles = pgTable("audio_files", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  filePath: varchar("file_path").notNull(),
  duration: real("duration"), // in seconds
  fileSize: integer("file_size"), // in bytes
  quality: varchar("quality"), // "poor", "good", "excellent"
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Voice models for each user
export const voiceModels = pgTable("voice_models", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status").notNull().default("training"), // "training", "ready", "failed"
  progress: integer("progress").default(0), // 0-100
  totalAudioFiles: integer("total_audio_files").default(0),
  totalDuration: real("total_duration").default(0), // in seconds
  modelData: jsonb("model_data"), // for storing model parameters
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat conversations
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual messages in chats
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chats.id),
  role: varchar("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  audioUrl: varchar("audio_url"), // URL to generated audio file
  audioDuration: real("audio_duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Memory capsules - saved conversations
export const memoryCapsules = pgTable("memory_capsules", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  chatId: integer("chat_id").notNull().references(() => chats.id),
  title: varchar("title").notNull(),
  description: text("description"),
  icon: varchar("icon"), // icon class name
  messageCount: integer("message_count").default(0),
  totalDuration: real("total_duration").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Personality traits and memories for AI customization
export const personalities = pgTable("personalities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  lovedOneName: varchar("loved_one_name"),
  lovedOneRelation: varchar("loved_one_relation"), // "grandmother", "father", etc.
  traits: jsonb("traits"), // personality traits
  memories: jsonb("memories"), // key memories and phrases
  preferences: jsonb("preferences"), // speaking style, topics, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  audioFiles: many(audioFiles),
  voiceModel: one(voiceModels),
  chats: many(chats),
  memoryCapsules: many(memoryCapsules),
  personality: one(personalities),
}));

export const audioFilesRelations = relations(audioFiles, ({ one }) => ({
  user: one(users, { fields: [audioFiles.userId], references: [users.id] }),
}));

export const voiceModelsRelations = relations(voiceModels, ({ one }) => ({
  user: one(users, { fields: [voiceModels.userId], references: [users.id] }),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, { fields: [chats.userId], references: [users.id] }),
  messages: many(messages),
  memoryCapsule: one(memoryCapsules),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, { fields: [messages.chatId], references: [chats.id] }),
}));

export const memoryCapsulesRelations = relations(memoryCapsules, ({ one }) => ({
  user: one(users, { fields: [memoryCapsules.userId], references: [users.id] }),
  chat: one(chats, { fields: [memoryCapsules.chatId], references: [chats.id] }),
}));

export const personalitiesRelations = relations(personalities, ({ one }) => ({
  user: one(users, { fields: [personalities.userId], references: [users.id] }),
}));

// Insert schemas
export const insertAudioFileSchema = createInsertSchema(audioFiles).omit({
  id: true,
  createdAt: true,
});

export const insertVoiceModelSchema = createInsertSchema(voiceModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatSchema = createInsertSchema(chats).omit({
  id: true,
  userId: true, // userId is added server-side from authentication
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertMemoryCapsuleSchema = createInsertSchema(memoryCapsules).omit({
  id: true,
  createdAt: true,
});

export const insertPersonalitySchema = createInsertSchema(personalities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertAudioFile = z.infer<typeof insertAudioFileSchema>;
export type AudioFile = typeof audioFiles.$inferSelect;

export type InsertVoiceModel = z.infer<typeof insertVoiceModelSchema>;
export type VoiceModel = typeof voiceModels.$inferSelect;

export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertMemoryCapsule = z.infer<typeof insertMemoryCapsuleSchema>;
export type MemoryCapsule = typeof memoryCapsules.$inferSelect;

export type InsertPersonality = z.infer<typeof insertPersonalitySchema>;
export type Personality = typeof personalities.$inferSelect;
