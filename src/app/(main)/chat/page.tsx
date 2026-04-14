import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip, Smile } from "lucide-react";
import { MOCK_CHATS, MOCK_MESSAGES } from "@/lib/mock-data";

export default function ChatPage() {
  const activeChat = MOCK_CHATS[0];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">채팅</h1>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[600px]">
          {/* 방 리스트 */}
          <div className="border-r border-border overflow-y-auto">
            {MOCK_CHATS.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 border-b border-border ${
                  chat.id === activeChat.id ? "bg-primary/5" : ""
                }`}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold truncate">{chat.name}</div>
                    <div className="text-[10px] text-muted-foreground shrink-0">{chat.lastAt}</div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{chat.lastMessage}</div>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center shrink-0">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 메시지 영역 */}
          <div className="flex flex-col">
            <div className="p-3 border-b border-border flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={activeChat.avatar} />
                <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">{activeChat.name}</div>
                <div className="text-xs text-green-600">● 온라인</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/50">
              {MOCK_MESSAGES.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      m.fromMe
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-background border border-border rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                    <div className={`text-[10px] mt-1 ${m.fromMe ? "text-white/70" : "text-muted-foreground/70"}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="w-4 h-4" />
              </Button>
              <Input placeholder="메시지를 입력하세요" className="flex-1" />
              <Button className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
