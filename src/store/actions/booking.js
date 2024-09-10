import { BOOKINGS, RESET_BOOKINGS } from "../ActionTypes";

export const setBookings = (payload) => ({
    type: BOOKINGS,
    payload,
});

export const resetBookings = () => ({
    type: RESET_BOOKINGS,
});
