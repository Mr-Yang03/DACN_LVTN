import { api } from "./axiosInstance";

interface ChatbotResponse {
  answer: string; // Markdown formatted response
}

export const chatbotApi = {
  sendMessage: async (prompt: string): Promise<ChatbotResponse> => {
    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await api.post("/chatbot/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  }
};