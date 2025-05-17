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
