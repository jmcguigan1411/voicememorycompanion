import {
  users,
  audioFiles,
  voiceModels,
  chats,
  messages,
  memoryCapsules,
  personalities,
  type User,
  type UpsertUser,
  type AudioFile,
  type InsertAudioFile,
  type VoiceModel,
  type InsertVoiceModel,
  type Chat,
  type InsertChat,
  type Message,
  type InsertMessage,
  type MemoryCapsule,
  type InsertMemoryCapsule,
  type Personality,
  type InsertPersonality,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Audio file operations
  createAudioFile(audioFile: InsertAudioFile): Promise<AudioFile>;
  getUserAudioFiles(userId: string): Promise<AudioFile[]>;
  getAudioFile(id: number): Promise<AudioFile | undefined>;
  deleteAudioFile(id: number): Promise<void>;
  
  // Voice model operations
  createVoiceModel(model: InsertVoiceModel): Promise<VoiceModel>;
  getUserVoiceModel(userId: string): Promise<VoiceModel | undefined>;
  updateVoiceModel(userId: string, updates: Partial<VoiceModel>): Promise<VoiceModel>;
  
  // Chat operations
  createChat(chat: InsertChat): Promise<Chat>;
  getUserChats(userId: string): Promise<Chat[]>;
  getChat(id: number): Promise<Chat | undefined>;
  updateChat(id: number, updates: Partial<Chat>): Promise<Chat>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getChatMessages(chatId: number): Promise<Message[]>;
  
  // Memory capsule operations
  createMemoryCapsule(capsule: InsertMemoryCapsule): Promise<MemoryCapsule>;
  getUserMemoryCapsules(userId: string): Promise<MemoryCapsule[]>;
  getMemoryCapsule(id: number): Promise<MemoryCapsule | undefined>;
  
  // Personality operations
  createPersonality(personality: InsertPersonality): Promise<Personality>;
  getUserPersonality(userId: string): Promise<Personality | undefined>;
  updatePersonality(userId: string, updates: Partial<Personality>): Promise<Personality>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
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

  // Audio file operations
  async createAudioFile(audioFile: InsertAudioFile): Promise<AudioFile> {
    const [file] = await db.insert(audioFiles).values(audioFile).returning();
    return file;
  }

  async getUserAudioFiles(userId: string): Promise<AudioFile[]> {
    return await db
      .select()
      .from(audioFiles)
      .where(eq(audioFiles.userId, userId))
      .orderBy(desc(audioFiles.createdAt));
  }

  async getAudioFile(id: number): Promise<AudioFile | undefined> {
    const [file] = await db.select().from(audioFiles).where(eq(audioFiles.id, id));
    return file;
  }

  async deleteAudioFile(id: number): Promise<void> {
    await db.delete(audioFiles).where(eq(audioFiles.id, id));
  }

  // Voice model operations
  async createVoiceModel(model: InsertVoiceModel): Promise<VoiceModel> {
    const [voiceModel] = await db.insert(voiceModels).values(model).returning();
    return voiceModel;
  }

  async getUserVoiceModel(userId: string): Promise<VoiceModel | undefined> {
    const [model] = await db
      .select()
      .from(voiceModels)
      .where(eq(voiceModels.userId, userId));
    return model;
  }

  async updateVoiceModel(userId: string, updates: Partial<VoiceModel>): Promise<VoiceModel> {
    const [model] = await db
      .update(voiceModels)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(voiceModels.userId, userId))
      .returning();
    return model;
  }

  // Chat operations
  async createChat(chat: InsertChat): Promise<Chat> {
    const [newChat] = await db.insert(chats).values(chat).returning();
    return newChat;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));
  }

  async getChat(id: number): Promise<Chat | undefined> {
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    return chat;
  }

  async updateChat(id: number, updates: Partial<Chat>): Promise<Chat> {
    const [chat] = await db
      .update(chats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(chats.id, id))
      .returning();
    return chat;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);
  }

  // Memory capsule operations
  async createMemoryCapsule(capsule: InsertMemoryCapsule): Promise<MemoryCapsule> {
    const [newCapsule] = await db.insert(memoryCapsules).values(capsule).returning();
    return newCapsule;
  }

  async getUserMemoryCapsules(userId: string): Promise<MemoryCapsule[]> {
    return await db
      .select()
      .from(memoryCapsules)
      .where(eq(memoryCapsules.userId, userId))
      .orderBy(desc(memoryCapsules.createdAt));
  }

  async getMemoryCapsule(id: number): Promise<MemoryCapsule | undefined> {
    const [capsule] = await db.select().from(memoryCapsules).where(eq(memoryCapsules.id, id));
    return capsule;
  }

  // Personality operations
  async createPersonality(personality: InsertPersonality): Promise<Personality> {
    const [newPersonality] = await db.insert(personalities).values(personality).returning();
    return newPersonality;
  }

  async getUserPersonality(userId: string): Promise<Personality | undefined> {
    const [personality] = await db
      .select()
      .from(personalities)
      .where(eq(personalities.userId, userId));
    return personality;
  }

  async updatePersonality(userId: string, updates: Partial<Personality>): Promise<Personality> {
    const [personality] = await db
      .update(personalities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(personalities.userId, userId))
      .returning();
    return personality;
  }
}

export const storage = new DatabaseStorage();
