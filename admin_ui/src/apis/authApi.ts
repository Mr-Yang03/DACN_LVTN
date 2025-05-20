import { api } from "./axiosInstance";

export const login = async (username: string, password: string) => {
  const response = await api.post("/admin/login", { username, password });
  return response.data;
};

export const register = async (
  username: string,
  password: string,
  full_name: string,
  date_of_birth: string,
  phone_number: string,
  citizen_id: string
) => {
  const response = await api.post("/admin/register", {
    username,
    password,
    full_name,
    date_of_birth,
    phone_number,
    citizen_id
  });
  return response.data;
};

// Upload an image for avatar
export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  // Using multipart/form-data for file uploads
  const response = await api.post("/avatar/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

export const updateAvatar = async (account_id: string, avatar: string) => {
  const response = await api.put("/account/update_avt", {
    account_id,
    avatar
  });
  return response.data;
}

export const updateAdminInfo = async (
  account_id: string,
  full_name: string,
  date_of_birth: string,
  phone_number: string,
  citizen_id: string
) => {
  const response = await api.put("/admin/update", {
    account_id,
    full_name,
    date_of_birth,
    phone_number,
    citizen_id
  });
  return response.data;
}