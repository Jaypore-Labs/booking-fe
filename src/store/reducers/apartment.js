import { APARTMENTS, RESET_APARTMENTS } from "../ActionTypes";

const INITIAL_STATE = {
    apartments: [],
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case APARTMENTS:
            return {
                ...state,
                apartments: action.payload,
            };

        case RESET_APARTMENTS:
            return {
                state: INITIAL_STATE,
            };
        default:
            return state;
    }
};
