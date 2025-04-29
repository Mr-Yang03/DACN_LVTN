import { api } from "./axiosInstance";

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