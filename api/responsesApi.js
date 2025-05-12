import axiosInstance from "./axiosInstance";

export const getResponses = async (userId) => {
  const response = await axiosInstance.get(
    `/responses/mysignalresponses/${userId}`
  );
  return response.data;
};

export const sendResponse = async (signalId, responseData) => {
  const response = await axiosInstance.post(
    `/responses/respond/${signalId}`,
    responseData
  );
  return response.data;
};

export const markResponseAsRead = async (responseId) => {
  const response = await axiosInstance.patch(
    `/responses/mark-read`,
    responseId
  );
  return response.data;
};
