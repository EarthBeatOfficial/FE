import axiosInstance from "./axiosInstance";

export const getAutoCompleteSet = async (input) => {
  const response = await axiosInstance.get(`/auto-complete?input=${input}`);
  return response.data;
};

export const getPlaceDetail = async (placeId) => {
  const response = await axiosInstance.get(`/place-detail?placeId=${placeId}`);
  return response.data;
};
