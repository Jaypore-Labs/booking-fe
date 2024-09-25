import { combineReducers } from "redux";
import user from "./user";
import bookings from "./booking";
import apartments from "./apartment";

export default combineReducers({
    user,
    bookings,
    apartments,
});
