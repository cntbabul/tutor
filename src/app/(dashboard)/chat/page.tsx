"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { chatApi, useApiClient } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, ChevronRight, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { formatDistanceToNow } from "date-fns";

export default function ChatListPage() {
  const { user, isLoaded } = useUser();
  const api = useApiClient();
  const socket = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats", user?.id],
    queryFn: () => chatApi.getChats(api, user?.id || ""),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("online-users", (data: { userIds: string[] }) => {
      setOnlineUsers(data.userIds);
    });

    socket.on("user-online", (data: { userId: string }) => {
      setOnlineUsers((prev) => Array.from(new Set([...prev, data.userId])));
    });

    socket.on("user-offline", (data: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
    });

    return () => {
      socket.off("online-users");
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [socket]);

  const filteredChats = chats?.data.filter((chat: any) =>
    chat.participant?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <main className="max-w-4xl mx-auto p-4 pb-24 md:pt-8">
        {/* Page Title & Search */}
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#002F34] tracking-tight">Messages</h1>
            <p className="text-gray-500 font-medium">Connect with tutors and students</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search conversations..."
              className="pl-12 h-14 bg-white border-gray-100 shadow-sm rounded-2xl text-base focus:ring-2 focus:ring-[#3A77FF]/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-[#3A77FF] border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-500 font-medium">Loading chats...</p>
            </div>
          ) : filteredChats?.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                {search ? "No conversations match your search." : "Start a conversation by visiting a tutor's listing!"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredChats?.map((chat: any) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-all group"
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                      <AvatarImage src={chat.participant?.image} />
                      <AvatarFallback className="bg-[#3A77FF] text-white font-bold">
                        {chat.participant?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {onlineUsers.includes(chat.participant?.id) && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 truncate group-hover:text-[#3A77FF] transition-colors">
                        {chat.participant?.name}
                      </h4>
                      {chat.lastMessageAt && (
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate font-medium">
                      {chat.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
