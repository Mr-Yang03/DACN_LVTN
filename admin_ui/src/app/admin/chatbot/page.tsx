"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Bot,
  User,
  Send,
  MessageSquare,
  Settings,
  History,
  Clock,
  Users,
  BarChart4,
  Percent,
} from "lucide-react";
import { chatbotApi } from "@/apis/chatbotApi";
import ReactMarkdown from "react-markdown";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "Xin chào, tôi là trợ lý ảo của hệ thống. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending messages using the API
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call the chatbot API
      const response = await chatbotApi.sendMessage(inputMessage);
      
      const botResponse = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      
      // Handle error with a message to the user
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "Xin lỗi, có lỗi xảy ra khi kết nối với chatbot. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <Bot className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Trò chuyện với chatbot</h2>
      </div>

      <div className="flex-1">
        <div className="bg-white rounded-lg flex-1 flex flex-col overflow-hidden h-full">
          <div className="lg:mx-auto lg:w-2/3 h-full flex flex-col">
            {/* Message area with fixed height and scrollable content */}
            <div
              className="flex-1 overflow-y-auto p-4"
              ref={scrollRef}
              style={{
                height: "calc(100vh - 200px)",
                maxHeight: "calc(100vh - 200px)",
              }}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className={`${message.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`flex items-center space-x-2 mb-1 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                        {message.sender === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs font-medium">
                          {message.sender === "user" ? "Admin" : "Chatbot"}
                        </span>
                      </div>

                      <div
                        className={`max-w-md rounded-lg px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted mr-auto"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <p>{message.content}</p>
                        ) : (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                        <div className={`text-xs opacity-70 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-full px-4 py-2 bg-muted">
                      <div className="flex space-x-2 items-center p-1">
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input area - fixed at bottom */}
            <div className="p-4 mt-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
