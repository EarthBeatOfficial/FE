import axiosInstance from "./axiosInstance";

export const getActiveWalkSession = async (userId) => {
  const response = await axiosInstance.get(`/walk-sessions/active/${userId}`);
  return response.data;
};

export const startWalkSession = async (userData) => {
  const response = await axiosInstance.post("/walk-sessions/start", userData);
  return response.data;
};

export const endWalkSession = async (sessionId, userData) => {
  const response = await axiosInstance.post(
    `/walk-sessions/${sessionId}/end`,
    userData
  );
  return response.data;
};
