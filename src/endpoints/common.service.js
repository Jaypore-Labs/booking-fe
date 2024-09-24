import axiosInstance from "../services/axios";

export const addTokenToUserAccount = async (userId, token) => {
    return axiosInstance
        .post("/notifications", { userId, token })
        .then((res) => {
            console.log("Token sent successfully:", token);
            console.log("Response from server:", res.data);
            return res?.data;
        })
        .catch((error) => {
            console.error("Error sending token to backend:", error);
        });
};