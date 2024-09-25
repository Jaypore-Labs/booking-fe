import { APARTMENTS, RESET_APARTMENTS } from "../ActionTypes";

export const setApartments = (payload) => ({
    type: APARTMENTS,
    payload,
});

export const resetApartments = () => ({
    type: RESET_APARTMENTS,
});
