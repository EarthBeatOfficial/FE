import axiosInstance from "./axiosInstance";

export const createSignal = async (signalData) => {
  const response = await axiosInstance.post("/signals", signalData);
  return response.data;
};

export const acceptSignal = async (signalId, userData) => {
  const response = await axiosInstance.patch(
    `/signals/${signalId}/accept`,
    userData
  );
  return response.data;
};

export const cancelSignal = async (signalId, userData) => {
  const response = await axiosInstance.patch(
    `/signals/${signalId}/cancel`,
    userData
  );
  return response.data;
};

export const deleteSignal = async (signalId, userData) => {
  const response = await axiosInstance.delete(
    `/signals/${signalId}/cancel`,
    userData
  );
  return response.data;
};

export const getAllSignals = async () => {
  const response = await axiosInstance.get(`/signals/active`);
  return response.data;
};
