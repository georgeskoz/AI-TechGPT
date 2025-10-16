import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import ProviderLayout from "../components/ProviderLayout";
import { useState } from "react";

export default function ProviderMessages() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const { data: conversations } = useQuery({
    queryKey: ["/api/provider/messages"],
  });

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400">Communicate with your customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardContent className="p-4 space-y-2">
              {conversations?.length > 0 ? (
                conversations.map((conv: any) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedChat === conv.id
                        ? "bg-green-100 dark:bg-green-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedChat(conv.id)}
                    data-testid={`chat-${conv.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{conv.customerName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No conversations yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="md:col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {/* Chat messages would go here */}
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[70%]">
                        <p>Hi, I need help with my computer.</p>
                        <span className="text-xs text-gray-500">10:30 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-green-600 text-white rounded-lg p-3 max-w-[70%]">
                        <p>Sure, I'd be happy to help! What seems to be the issue?</p>
                        <span className="text-xs text-green-100">10:32 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      data-testid="input-message"
                    />
                    <Button className="bg-green-600 hover:bg-green-700" data-testid="button-send">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProviderLayout>
  );
}
