import axiosInstance from "../services/axios";

export const fetchComments = async (postId, userId) => {
    return axiosInstance
        .get("/comments", {
            params: {
                postId, // Filtering by postId
                userId, // Filtering by userId
            },
        })
        .then((res) => res?.data);
};
export const createComment = async (data) => {
    const response = await axiosInstance.post("/comments", data);
    return response.data;
};
