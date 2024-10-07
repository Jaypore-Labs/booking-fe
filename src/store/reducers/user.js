import {
    USER_LOGIN,
    USER_LOGOUT,
    CLEAR_SESSION,
    RESET_USER,
} from "../ActionTypes";

const INITIAL_STATE = {
    user: null,
    tokens: null,
    userId: null,
    isActiveSession: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOGIN:
            return {
                ...state,
                user: action.payload.user,
                tokens: action.payload.tokens,
                userId: action.payload.userId,
                isActiveSession: true,
            };

        case USER_LOGOUT:
            return {
                ...state,
                user: null,
                tokens: null,
            };

        case CLEAR_SESSION:
            return {
                ...state,
                isActiveSession: false,
            };

        case RESET_USER:
            return {
                ...INITIAL_STATE,
            };
        default:
            return state;
    }
};
