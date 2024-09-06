import axiosInstance from "../services/axios";

export const loginUser = (payload) => {
    return axiosInstance.post('/auth/login', payload).then((res) => res.data);
}
export const registerUser = async (payload) => {
    return axiosInstance.post('/auth/register', payload).then((res) => res.data);
};
export const logoutUser = async (payload) => {
    return axiosInstance.post('/auth/logout', payload).then((res) => res.data);
};