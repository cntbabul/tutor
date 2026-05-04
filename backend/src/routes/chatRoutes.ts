import { Router } from "express";
import { protectRoute } from "@/middleware/auth.js";
import { getChats, getOrCreateChat, getMessages } from "@/controllers/chatController.js";

const router = Router();

// Get all chats for the current user
router.get("/", protectRoute, getChats);

// Get or create a chat with a specific participant
router.post("/with/:participantId", protectRoute, getOrCreateChat);

// Get messages for a specific chat
router.get("/chat/:chatId", protectRoute, getMessages);

export default router;