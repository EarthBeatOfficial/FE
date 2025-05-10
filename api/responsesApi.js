import axiosInstance from "./axiosInstance";

export const getResponses = async (signalId) => {
  const response = await axiosInstance.get(`/responses/${signalId}`);
  return response.data;
};

export const sendResponse = async (signalId, responseData) => {
  const response = await axiosInstance.post(
    `/responses/respond/${signalId}`,
    responseData
  );
  return response.data;
};
