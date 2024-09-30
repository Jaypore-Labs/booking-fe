import axiosInstance from "../services/axios";

export const fetchComment = async () => {
    return axiosInstance.get("/comments").then((res) => res?.data);
};

export const createComment = async (data) => {
    const response = await axiosInstance.post("/comments", data);
    return response.data;
};
