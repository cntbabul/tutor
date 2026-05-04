"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi, useApiClient } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState, useRef, use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, MoreVertical, Phone, Video, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: chatId } = use(params);
  const { user, isLoaded } = useUser();
  const api = useApiClient();
  const socket = useSocket();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages and chat info
  const { data: response, isLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => chatApi.getMessages(api, user?.id || "", chatId),
    enabled: !!user?.id && !!chatId,
  });

  const chat = response?.data?.chat;
  const messages = response?.data?.messages || [];

  // Socket management
  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("join-chat", chatId);

    socket.on("new-message", (message: any) => {
      if (message.chatId === chatId) {
        queryClient.setQueryData(["messages", chatId], (old: any) => {
          if (!old) return { data: { chat: {}, messages: [message] } };

          // Deduplicate
          const exists = old.data.messages.some((m: any) => m.id === message.id);
          if (exists) return old;

          return {
            ...old,
            data: {
              ...old.data,
              messages: [...old.data.messages, message]
            }
          };
        });
      }
    });

    socket.on("typing", (data: { chatId: string, isTyping: boolean }) => {
      if (data.chatId === chatId) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      socket.emit("leave-chat", chatId);
      socket.off("new-message");
      socket.off("typing");
    };
  }, [socket, chatId, queryClient]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !socket) return;

    socket.emit("send-message", { chatId, text: inputText });
    setInputText("");
    socket.emit("typing", { chatId, isTyping: false });
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!socket) return;

    socket.emit("typing", { chatId, isTyping: e.target.value.length > 0 });
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-[#3A77FF] border-t-transparent rounded-full" />
      </div>
    );
  }

  const otherParticipant = chat?.participants?.find((p: any) => p.id !== user?.id) || {};

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-3 md:p-4 flex items-center gap-3 sticky top-0 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/chat")}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex flex-1 items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 md:h-11 md:w-11 border-2 border-white shadow-sm">
              <AvatarImage src={otherParticipant.image} />
              <AvatarFallback className="bg-[#3A77FF] text-white font-bold text-lg">
                {otherParticipant.name?.[0] || "C"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-900 leading-none">
                {otherParticipant.name || "Conversation"}
              </h3>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">
              Online
            </p>
          </div>
        </div>

        <div className="flex gap-0.5 md:gap-1">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary"><Phone className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary"><Video className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary"><MoreVertical className="w-5 h-5" /></Button>
        </div>
      </header>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth"
      >
        <div className="flex flex-col items-center py-4 mb-4">
          <div className="bg-blue-50/50 px-4 py-1.5 rounded-full border border-blue-100/50 mb-3">

          </div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Conversation Started
          </p>
        </div>

        {messages.map((msg: any) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%] md:max-w-[75%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "px-5 py-3.5 text-[15px] font-medium leading-relaxed shadow-sm transition-all",
                isMe
                  ? "bg-[#3A77FF] text-white rounded-[24px] rounded-tr-sm"
                  : "bg-white text-gray-800 border border-gray-100 rounded-[24px] rounded-tl-sm"
              )}>
                {msg.text}
              </div>
              <span className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3 text-gray-400 px-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#3A77FF]/40 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#3A77FF]/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-[#3A77FF]/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#3A77FF]/60 italic">Tutor is typing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-white p-1.5 rounded-[32px] border-2 border-gray-100 focus-within:border-[#3A77FF]/30 transition-all shadow-sm">
          <Input
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-base py-6 pl-5 font-medium text-gray-700"
            value={inputText}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="rounded-full w-12 h-12 bg-[#3A77FF] hover:bg-[#2d63e0] shadow-lg shadow-blue-200 p-0 shrink-0 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest opacity-60">
          Powered by TutorMarket Chat
        </p>
      </footer>
    </div>
  );
}
