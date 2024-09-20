import axiosInstance from "../services/axios";

export const fetchBooking = async () => {
    return axiosInstance.get("/bookings", {
        params: {
            sortBy,
            limit,
            page,
            apartment,
            user
        },
    }).then((res) => res?.data);
};

export const createBooking = async (payload) => {
    return axiosInstance.post("/bookings", payload).then((res) => res?.data);
};


export const updateBooking = async (bookingId, payload) => {
    return axiosInstance.patch(`/bookings/${bookingId}`, payload).then((res) => res?.data);
};
export const deleteBooking = async (bookingId) => {
    return axiosInstance.delete(`/bookings/${bookingId}`).then((res) => res?.data);
};
