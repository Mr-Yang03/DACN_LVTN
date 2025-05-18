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
