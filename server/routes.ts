import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Check hardcoded password
      if (password !== "456") {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Check if username already exists and is online
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser && existingUser.isOnline) {
        return res.status(409).json({ message: "Username already taken by an online user" });
      }

      let user = existingUser;
      if (!user) {
        // Create new user
        user = await storage.createUser({ username });
        
        // Create join message
        await storage.createMessage({
          content: `${username} joined the chat`,
          senderId: user.id,
          senderUsername: username,
          type: "join",
        });
      } else {
        // User exists but was offline, mark as online
        await storage.updateUserOnlineStatus(user.id, true);
        
        // Create rejoin message
        await storage.createMessage({
          content: `${username} rejoined the chat`,
          senderId: user.id,
          senderUsername: username,
          type: "join",
        });
      }

      res.json({ user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { userId, username } = req.body;
      
      if (userId) {
        await storage.updateUserOnlineStatus(userId, false);
        
        // Create leave message
        await storage.createMessage({
          content: `${username} left the chat`,
          senderId: userId,
          senderUsername: username,
          type: "leave",
        });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get messages endpoint
  app.get("/api/messages", async (req, res) => {
    try {
      const after = req.query.after as string;
      let messages;
      
      if (after) {
        messages = await storage.getMessagesAfter(new Date(after));
      } else {
        messages = await storage.getMessages();
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Send message endpoint
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get online users count
  app.get("/api/users/online", async (req, res) => {
    try {
      const onlineUsers = await storage.getOnlineUsers();
      res.json({ count: onlineUsers.length, users: onlineUsers });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
