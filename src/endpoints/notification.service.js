import axiosInstance from "../services/axios";

export const addTokenToUserAccount = async (userId, token) => {
    return axiosInstance.post('/notifications', { userId, token }).then((res) => res?.data);
};