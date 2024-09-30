import axiosInstance from "../services/axios";

export const updateUser = async (userId, payload) => {
    return axiosInstance
        .patch(`users/${userId}`, payload)
        .then((res) => res.data);
};
export const getUserProfile = async (userId) => {
    return axiosInstance.patch(`users/${userId}`).then((res) => res.data);
};

export const deleteUser = async (userId) => {
    return axiosInstance.delete(`users/${userId}`).then((res) => res.data);
};
