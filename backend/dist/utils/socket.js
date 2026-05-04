import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import prisma from "@/config/db.js";
// Store online users in memory: userId -> socketId
export const onlineUsers = new Map();
export const initializeSocket = (httpServer) => {
    const allowedOrigins = [
        "*",
        process.env.FRONTEND_URL || ""
    ].filter((url) => url !== "");
    const io = new SocketServer(httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"]
        }
    });
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
            const userId = session.sub;
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return next(new Error("User not found"));
            }
            socket.data.userId = user.id;
            next();
        }
        catch (error) {
            next(new Error(error));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        if (!userId) {
            console.log("No userId found(socket.ts)");
            return;
        }
        // Store user in the onlineUsers map
        onlineUsers.set(userId, socket.id);
        // Send list of currently online users to the newly connected client
        socket.emit("online-users", { userIds: Array.from(onlineUsers.keys()) });
        // Notify others that this current user is online
        socket.broadcast.emit("user-online", { userId });
        socket.join(`user:${userId}`);
        socket.on("join-chat", (chatId) => {
            socket.join(`chat:${chatId}`);
        });
        socket.on("leave-chat", (chatId) => {
            socket.leave(`chat:${chatId}`);
        });
        // Handle sending message 
        socket.on("send-message", async (data) => {
            try {
                const { chatId, text } = data;
                const chat = await prisma.chat.findFirst({
                    where: {
                        id: chatId,
                        participants: { some: { id: userId } }
                    },
                    include: { participants: true }
                });
                if (!chat) {
                    socket.emit("socket-error", { message: "Chat not found." });
                    return;
                }
                const message = await prisma.message.create({
                    data: {
                        chatId: chatId,
                        senderId: userId,
                        text
                    },
                    include: {
                        sender: {
                            select: { id: true, name: true, image: true }
                        }
                    }
                });
                // Update chat lastMessageAt
                await prisma.chat.update({
                    where: { id: chatId },
                    data: { lastMessageAt: new Date() }
                });
                // Emit to chat room (for users currently viewing the chat)
                io.to(`chat:${chatId}`).emit("new-message", message);
                // Also emit to participants' personal rooms
                for (const participant of chat.participants) {
                    if (participant.id !== userId) {
                        io.to(`user:${participant.id}`).emit("new-message", message);
                    }
                }
            }
            catch (error) {
                console.log("Error in send-message:", error);
                socket.emit("socket-error", { message: "Failed to send message" });
            }
        });
        socket.on("typing", async (data) => {
            const typingPayload = {
                userId,
                chatId: data.chatId,
                isTyping: data.isTyping
            };
            // Emit to chat room
            socket.to(`chat:${data.chatId}`).emit("typing", typingPayload);
            try {
                const chat = await prisma.chat.findUnique({
                    where: { id: data.chatId },
                    include: { participants: true }
                });
                if (chat) {
                    const otherParticipant = chat.participants.find((p) => p.id !== userId);
                    if (otherParticipant) {
                        socket.to(`user:${otherParticipant.id}`).emit("typing", typingPayload);
                    }
                }
            }
            catch (error) {
                // Silently fail
            }
        });
        socket.on("disconnect", () => {
            onlineUsers.delete(userId);
            socket.broadcast.emit("user-offline", { userId });
            console.log("User disconnected:", userId);
        });
    });
    return io;
};
//# sourceMappingURL=socket.js.map