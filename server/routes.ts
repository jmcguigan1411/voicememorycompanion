import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertAudioFileSchema, 
  insertChatSchema, 
  insertMessageSchema, 
  insertMemoryCapsuleSchema,
  insertPersonalitySchema 
} from "@shared/schema";
import { setupFileUpload } from "./services/fileUpload";
import { generateAIResponse } from "./services/openai";
import { generateSpeech } from "./services/tts";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // File upload setup
  const upload = setupFileUpload();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Audio file routes
  app.post('/api/audio/upload', isAuthenticated, upload.single('audio'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No audio file provided" });
      }

      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a'];
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type. Only MP3 and M4A files are allowed." });
      }

      // Create audio file record
      const audioFile = await storage.createAudioFile({
        userId,
        filename: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        quality: "good", // Default quality, could be analyzed
        metadata: {
          mimetype: file.mimetype,
          encoding: file.encoding,
        }
      });

      // Update voice model progress
      let voiceModel = await storage.getUserVoiceModel(userId);
      if (!voiceModel) {
        voiceModel = await storage.createVoiceModel({
          userId,
          status: "training",
          progress: 0,
          totalAudioFiles: 1,
          totalDuration: 0,
        });
      } else {
        voiceModel = await storage.updateVoiceModel(userId, {
          totalAudioFiles: (voiceModel.totalAudioFiles || 0) + 1,
          progress: Math.min(100, (voiceModel.progress || 0) + 10), // Simulate progress
          status: (voiceModel.totalAudioFiles || 0) >= 5 ? "ready" : "training",
        });
      }

      res.json({ audioFile, voiceModel });
    } catch (error) {
      console.error("Error uploading audio:", error);
      res.status(500).json({ message: "Failed to upload audio file" });
    }
  });

  app.get('/api/audio/files', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = await storage.getUserAudioFiles(userId);
      res.json(files);
    } catch (error) {
      console.error("Error fetching audio files:", error);
      res.status(500).json({ message: "Failed to fetch audio files" });
    }
  });

  app.delete('/api/audio/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const fileId = parseInt(req.params.id);
      
      const audioFile = await storage.getAudioFile(fileId);
      if (!audioFile || audioFile.userId !== userId) {
        return res.status(404).json({ message: "Audio file not found" });
      }

      // Delete file from filesystem
      try {
        fs.unlinkSync(audioFile.filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }

      await storage.deleteAudioFile(fileId);
      res.json({ message: "Audio file deleted successfully" });
    } catch (error) {
      console.error("Error deleting audio file:", error);
      res.status(500).json({ message: "Failed to delete audio file" });
    }
  });

  // Voice model routes
  app.get('/api/voice-model', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const voiceModel = await storage.getUserVoiceModel(userId);
      res.json(voiceModel);
    } catch (error) {
      console.error("Error fetching voice model:", error);
      res.status(500).json({ message: "Failed to fetch voice model" });
    }
  });

  // Chat routes
  app.post('/api/chats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chatData = insertChatSchema.parse(req.body);
      
      const chat = await storage.createChat({
        ...chatData,
        userId,
        title: chatData.title || "New Conversation",
      });
      
      res.json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      res.status(500).json({ message: "Failed to create chat" });
    }
  });

  app.get('/api/chats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chats = await storage.getUserChats(userId);
      res.json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "Failed to fetch chats" });
    }
  });

  app.get('/api/chats/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const chatId = parseInt(req.params.id);
      const messages = await storage.getChatMessages(chatId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/chats/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chatId = parseInt(req.params.id);
      const messageData = insertMessageSchema.parse(req.body);
      
      // Create user message
      const userMessage = await storage.createMessage({
        chatId,
        role: "user",
        content: messageData.content,
      });

      // Get user's personality for context
      const personality = await storage.getUserPersonality(userId);
      
      // Generate AI response
      const aiResponse = await generateAIResponse(messageData.content, personality);
      
      // Generate speech for AI response
      const audioUrl = await generateSpeech(aiResponse);
      
      // Create AI message
      const aiMessage = await storage.createMessage({
        chatId,
        role: "assistant",
        content: aiResponse,
        audioUrl,
        audioDuration: 0, // Will be set by TTS service
      });

      // Update chat timestamp
      await storage.updateChat(chatId, { updatedAt: new Date() });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Memory capsule routes
  app.post('/api/memory-capsules', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const capsuleData = insertMemoryCapsuleSchema.parse(req.body);
      
      const capsule = await storage.createMemoryCapsule({
        ...capsuleData,
        userId,
      });
      
      res.json(capsule);
    } catch (error) {
      console.error("Error creating memory capsule:", error);
      res.status(500).json({ message: "Failed to create memory capsule" });
    }
  });

  app.get('/api/memory-capsules', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const capsules = await storage.getUserMemoryCapsules(userId);
      res.json(capsules);
    } catch (error) {
      console.error("Error fetching memory capsules:", error);
      res.status(500).json({ message: "Failed to fetch memory capsules" });
    }
  });

  // Personality routes
  app.post('/api/personality', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const personalityData = insertPersonalitySchema.parse(req.body);
      
      let personality = await storage.getUserPersonality(userId);
      if (personality) {
        personality = await storage.updatePersonality(userId, personalityData);
      } else {
        personality = await storage.createPersonality({
          ...personalityData,
          userId,
        });
      }
      
      res.json(personality);
    } catch (error) {
      console.error("Error saving personality:", error);
      res.status(500).json({ message: "Failed to save personality" });
    }
  });

  app.get('/api/personality', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const personality = await storage.getUserPersonality(userId);
      res.json(personality);
    } catch (error) {
      console.error("Error fetching personality:", error);
      res.status(500).json({ message: "Failed to fetch personality" });
    }
  });

  // Serve audio files
  app.get('/api/audio/play/:filename', (req, res) => {
    const filename = req.params.filename;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).json({ message: "Audio file not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
