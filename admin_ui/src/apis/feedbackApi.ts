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
    status?: string;
    author_username?: string;
}

export const getFeedback = async (id: string) => {
    const response = await api.get(`/feedback/${id}`);
    return response.data;
}

export const getFeedbackList = async () => {
    const response = await api.get("/feedback/all_items");
    return response.data;
}

export const sendFeedback = async (feedbackData: FeedbackArticle) => {
    const response = await api.post("/feedback/item", feedbackData);
    return response.data;
}