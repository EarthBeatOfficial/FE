import axiosInstance from "./axiosInstance";

export const getUserProfile = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post("/users", userData);
  return response.data;
};
