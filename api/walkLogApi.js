import axiosInstance from "./axiosInstance";

export const getWalkLogs = async (userId) => {
  const response = await axiosInstance.get(`/walk-logs/user/${userId}`);
  return response.data;
};

export const getWalkLogNum = async (userId) => {
  const response = await axiosInstance.get(`/walk-logs/count/${userId}`);
  return response.data;
};
