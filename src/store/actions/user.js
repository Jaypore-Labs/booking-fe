import {
    USER_LOGIN,
    USER_LOGOUT,
    CLEAR_SESSION,
    RESET_USER,
} from "../ActionTypes";

export const userLogin = (payload) => ({
    type: USER_LOGIN,
    payload,
});
export const userLogout = () => ({
    type: USER_LOGOUT,
});

export const clearSession = () => ({
    type: CLEAR_SESSION,
});

export const resetUser = () => ({
    type: RESET_USER,
});
