import axiosInstance from "../services/axios";

const getNotifications = (userId, sortBy, limit, page) => {
    return axiosInstance
        .get('/notification/notification', {
            params: {
                sortBy,
                limit,
                page,
                userId,
            },
        })
        .then((res) => res.data);
};

export const createNotification = async (payload) => {
    return axiosInstance.post("/notification", payload).then((res) => res?.data);
};

export const markNotificationsAsRead = (notificationId) => {
    return axiosInstance.patch(`/notification/notification/${notificationId}`);
};

export const markAllAsRead = () => {
    return axiosInstance.patch('/notification/markAllAsRead');
};

export default getNotifications;
