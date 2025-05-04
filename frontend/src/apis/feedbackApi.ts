import { api } from "./axiosInstance";

export interface FeedbackArticle {
    _id?: string;
    location: string;
    issueType: string;
    severity: "slight" | "medium" | "serious";
    status?: string;
    author?: string;
    phone?: string;
    email?: string;
    date?: string;
    time?: string;
    description: string;
    images?: string[];
    created_at?: Date;
    updated_at?: Date;
}

export const sendFeedback = async (
    fullName: string,
    email: string,
    phone: string,
    location: {
        lat: number,
        lng: number,
    },
    date: Date,
    time: string,
    issue: string,
    severity: "low" | "medium" | "high",
    description: string,
    attachments?: any,
    isDeleted: boolean = false,
    isProcessed: boolean = false,
) => {
    const response = await api.post("/feedback/items", { fullName, email, phone, location, date, time, issue, severity, description, attachments, isDeleted, isProcessed });
    return response.data;
}

export const getFeedback = async (id: string) => {
    const response = await api.get(`/feedback/items/${id}`);
    return response.data;
}

export const getFeedbackList = async ({}) => {
    const response = await api.get("/feedback/all_items");
    return response.data;
}

export const getUserFeedbackList = async ({}) => {
    const response = await api.get("/feedback/processed");
    return response.data;
}