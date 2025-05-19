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
}

export const getFeedback = async (id: string) => {
    const response = await api.get(`/feedback/items/${id}`);
    return response.data;
}

export const getFeedbackList = async () => {
    const response = await api.get("/feedback/all_items");
    return response.data;
}

export const getUserFeedbackList = async () => {
    const response = await api.get("/feedback/processed");
    return response.data;
}

export const sendFeedback = async (feedbackData: FeedbackArticle) => {
    const response = await api.post("/feedback/item", feedbackData);
    return response.data;
}

// count feedback by userr

/**
 * Đếm số lượng phản ánh theo danh sách người dùng.
 * @param users Danh sách gồm username và account_id
 * @returns object dạng { account_id: số lượng phản ánh }
 */

export const countFeedbackByUsers = (data: { username: string; account_id: string }[]) => {
  return api.post("/feedback/count-by", data);
};
// export const countFeedbackByUsers = async (data: any) => {
//   console.log("📤 Gửi feedback count request:", data);

//   try {
//     const res = await api.post("/feedback/count-by", data);
//     console.log("✅ Nhận phản hồi:", res.data);
//     return res;
//   } catch (err: any) {
//     console.error("❌ Lỗi gọi API count:", err?.response?.status, err?.response?.data);
//     throw err;
//   }
// };