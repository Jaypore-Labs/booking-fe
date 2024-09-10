import { BOOKINGS, RESET_BOOKINGS } from "../ActionTypes";

const INITIAL_STATE = {
    bookings: [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BOOKINGS:
            return {
                ...state,
                bookings: action.payload,
            };

        case RESET_BOOKINGS:
            return {
                state: INITIAL_STATE,
            };
        default:
            return state;
    }
};
