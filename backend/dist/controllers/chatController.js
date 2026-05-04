import prisma from "@/config/db.js";
export async function getChats(req, res, next) {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const chats = await prisma.chat.findMany({
            where: {
                participants: {
                    some: { id: userId }
                }
            },
            include: {
                participants: true,
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
    }
    catch (error) {
        res.status(500);
        next(error);
    }
}
export async function getOrCreateChat(req, res, next) {
    try {
        const userId = req.headers["x-user-id"];
        const participantId = req.params["participantId"];
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        if (!participantId)
            return res.status(400).json({ error: "participantId is required" });
        // Check if chat exists
        let chat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: userId } } },
                    { participants: { some: { id: participantId } } }
                ]
            },
            include: {
                participants: true,
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
                    participants: true,
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
    }
    catch (error) {
        res.status(500);
        next(error);
    }
}
export async function getMessages(req, res, next) {
    try {
        const userId = req.headers["x-user-id"];
        const chatId = req.params["chatId"];
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                participants: { some: { id: userId } }
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
        res.json(messages);
    }
    catch (error) {
        res.status(500);
        next(error);
    }
}
//# sourceMappingURL=chatController.js.map