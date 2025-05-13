import { api } from "./axiosInstance";

// Interface for news article
export interface NewsArticle {
  _id?: string;
  title: string;
  content: string;
  image_url: string;
  status?: string;
  category?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  publishDate?: string;
  publishTime?: string;
  summary?: string;
  created_at?: Date;
  updated_at?: Date;
  views?: number;
}

// Get public news articles (for public news page)
export const getPublicNews = async () => {
  const response = await api.get("/news");
  return response.data;
};

// Get featured news articles (for popular news section)
export const getFeaturedNews = async (limit?: number) => {
  const response = await api.get(`/news/featured${limit ? `?limit=${limit}` : ''}`);
  return response.data;
};

// Get public news by category
export const getNewsByCategory = async (category: string) => {
  const response = await api.get(`/news/category/${category}`);
  return response.data;
};

// Get public news article by ID
export const getPublicNewsById = async (newsId: string) => {
  const response = await api.get(`/news/${newsId}`);
  return response.data;
};

// Get all news articles (admin)
export const getAllNews = async () => {
  const response = await api.get("/admin/news");
  return response.data;
};

// Get news article by ID (admin)
export const getNewsById = async (newsId: string) => {
  const response = await api.get(`/admin/news/${newsId}`);
  return response.data;
};

// Create a new news article (admin)
export const createNews = async (newsData: NewsArticle) => {
  const response = await api.post("/admin/news", newsData);
  return response.data;
};

// Update a news article (admin)
export const updateNews = async (newsId: string, newsData: Partial<NewsArticle>) => {
  const response = await api.put(`/admin/news/${newsId}`, newsData);
  return response.data;
};

// Delete a news article (admin)
export const deleteNews = async (newsId: string) => {
  await api.delete(`/admin/news/${newsId}`);
  return true;
};

// Upload an image for news
export const uploadNewsImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  // Using multipart/form-data for file uploads
  const response = await api.post("/news/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};