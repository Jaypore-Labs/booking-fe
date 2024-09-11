import axiosInstance from "../services/axios";

export const fetchBooking = async () => {
    return axiosInstance.get("/bookings").then((res) => res?.data);
};

export const createBooking = async (payload) => {
    return axiosInstance.post("/bookings", payload).then((res) => res?.data);
};

// export const updateBooking = async (id, payload) => {
//     return axiosInstance.patch(`/bookings/${id}`, payload).then((res) => res?.data);
// };
// export const deleteBooking = async (id) => {
//     return axiosInstance.delete(`/bookings/${id}`).then((res) => res?.data);
// };
