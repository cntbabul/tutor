import type { Request, Response, NextFunction } from "express";
import prisma from "@/config/db.js";

export async function getChats(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { id: userId }
                }
            },
            include: {
                participants: {
                    select: { id: true, name: true, image: true, role: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { lastMessageAt: 'desc' }
        });

        const formattedChats = chats.map((chat) => {
            const otherParticipant = chat.participants.find((p) => p.id !== userId);
            return {
                id: chat.id,
                participant: otherParticipant || null,
                lastMessage: chat.messages[0] || null,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,
            };
        });
        res.json(formattedChats);
    } catch (error) {
        res.status(500);
        next(error);
    }
}

export async function getOrCreateChat(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.headers["x-user-id"] as string;
        const participantId = req.params["participantId"] as string;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!participantId) return res.status(400).json({ error: "participantId is required" });

        // Check if chat exists
        let chat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: userId } } },
                    { participants: { some: { id: participantId } } }
                ]
            },
            include: {
                participants: {
                    select: { id: true, name: true, image: true, role: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    participants: {
                        connect: [
                            { id: userId },
                            { id: participantId }
                        ]
                    }
                },
                include: {
                    participants: {
                        select: { id: true, name: true, image: true, role: true }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                }
            });
        }

        const otherParticipant = chat.participants.find((p) => p.id !== userId);
        res.json({
            id: chat.id,
            participant: otherParticipant ?? null,
            lastMessage: chat.messages[0] || null,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
        });

    } catch (error) {
        res.status(500);
        next(error);
    }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.headers["x-user-id"] as string;
        const chatId = req.params["chatId"] as string;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                participants: { some: { id: userId } }
            },
            include: {
                participants: {
                    select: { id: true, name: true, image: true, role: true }
                }
            }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const messages = await prisma.message.findMany({
            where: { chatId: chatId },
            include: {
                sender: {
                    select: { id: true, name: true, image: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json({
            chat,
            messages
        });

    } catch (error) {
        res.status(500);
        next(error);
    }
}