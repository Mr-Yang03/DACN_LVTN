import { api } from "./axiosInstance";

export interface FeedbackArticle {
    _id?: string;
    location?: string;
    type?: string;
    severity?: string;
    title?: string;
    author?: string;
    phone?: string;
    email?: string;
    date?: string;
    time?: string;
    description?: string;
    images?: string[];
    author_username?: string;
}

export const getFeedback = async (id: string) => {
    const response = await api.get(`/feedback/items/${id}`);
    return response.data;
}

export const getFeedbackList = async () => {
    const response = await api.get("/feedback/all_items");
    return response.data;
}

// export const getUserFeedbackList = async () => {
//     const response = await api.get("/feedback/processed");
//     return response.data;
// }

export const sendFeedback = async (feedbackData: FeedbackArticle) => {
    const response = await api.post("/feedback/item", feedbackData);
    return response.data;
}

// Upload multiple images/videos for feedback
export const uploadFeedbackFiles = async (files: File[]) => {
  const formData = new FormData();
  
  // Append all files with the same field name "files"
  // This matches the expected format in the gateway API
  files.forEach((file) => {
    formData.append("files", file);
  });

  // Using multipart/form-data for file uploads
  const response = await api.post("/feedback/upload", formData);
  
  return response.data;
};