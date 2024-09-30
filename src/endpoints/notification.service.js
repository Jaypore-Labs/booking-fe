import axiosInstance from "../services/axios";

const getNotifications = async () => {
    return axiosInstance.get("/notifications").then((res) => res.data);
};

export const createNotification = async (payload) => {
    return axiosInstance.post("/notifications", payload).then((res) => res?.data);
};

export const markNotificationsAsRead = (notificationId) => {
    return axiosInstance.patch(`/notifications/${notificationId}`);
};

export const markAllAsRead = () => {
    return axiosInstance.patch("/notifications/markAllAsRead");
};

export default getNotifications;
