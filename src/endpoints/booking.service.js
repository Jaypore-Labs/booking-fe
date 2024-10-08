import axiosInstance from "../services/axios";

export const fetchBooking = async (sortBy, limit, page, apartment, userId) => {
    return axiosInstance
        .get("/bookings", {
            params: {
                sortBy,
                limit,
                page,
                apartment,
                userId,
            },
        })
        .then((res) => res?.data);
};

export const createBooking = async (payload) => {
    return axiosInstance.post("/bookings", payload).then((res) => res?.data);
};

export const updateBooking = async (bookingId, payload) => {
    return axiosInstance
        .patch(`/bookings/${bookingId}`, payload)
        .then((res) => res?.data);
};
export const deleteBooking = async (bookingId) => {
    return axiosInstance
        .delete(`/bookings/${bookingId}`)
        .then((res) => res?.data);
};

export const fetchBookingById = async (bookingId) => {
    return axiosInstance.get(`/bookings/${bookingId}`).then((res) => res?.data);
};

export const fetchBookingsByUserId = async (userId, sortBy, limit, page) => {
    return axiosInstance
        .get(`/bookings/user/${userId}`, {
            params: {
                sortBy,
                limit,
                page,
            },
        })
        .then((res) => res?.data);
};
