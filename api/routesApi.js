import axiosInstance from "./axiosInstance";

export const recommendRoute = async (trailData) => {
  const response = await axiosInstance.post("/routes/recommend", trailData);
  return response.data;
};
