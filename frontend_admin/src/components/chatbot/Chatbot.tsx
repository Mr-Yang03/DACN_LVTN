"use client";

import { useState, useRef, useEffect } from "react";
import { X, Maximize2, Minimize2, Send } from "lucide-react";

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Cảm ơn bạn đã gửi tin nhắn. Đây là phản hồi tự động từ hệ thống.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`bg-white flex flex-col shadow-xl border-l transition-all duration-300 z-50 ${
        isFullScreen 
          ? "fixed inset-0 w-full h-full" 
          : "fixed top-0 right-0 h-full w-96"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-blue-50">
        <h3 className="font-medium">Chatbot Hỗ Trợ</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleFullScreen}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label={isFullScreen ? "Thu nhỏ" : "Mở rộng"}
          >
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser 
                  ? "bg-blue-500 text-white rounded-tr-none" 
                  : "bg-white border rounded-tl-none"
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs mt-1 block opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn của bạn..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          disabled={input.trim() === ""}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}