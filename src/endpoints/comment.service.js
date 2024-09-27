import axiosInstance from "../services/axios";

export const fetchComment = async () => {
    return axiosInstance.get("/comments").then((res) => res?.data);
};

export const createComment = async (payload) => {
    return axiosInstance.post("/comments", payload).then((res) => res?.data);
};
