import { api } from "./axiosInstance";

export const login = async (username: string, password: string) => {
  const response = await api.post("/users/login", { username, password });
  return response.data;
};

export const checkUsername = async (username: string) => {
  const response = await api.get(`/users/check_username/${username}`);
  return response.data;
};

export const register = async (
  username: string,
  password: string,
  full_name: string,
  date_of_birth: string,
  phone_number: string,
  license_number: string
) => {
  const response = await api.post("/users/register", {
    username,
    password,
    full_name,
    date_of_birth,
    phone_number,
    license_number
  });
  return response.data;
};

export const updateUserInfo = async (
  account_id: string,
  full_name: string,
  date_of_birth: string,
  phone_number: string,
  license_number: string
) => {
  const response = await api.put("/users/update", {
    account_id,
    full_name,
    date_of_birth,
    phone_number,
    license_number
  });
  return response.data;
}

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