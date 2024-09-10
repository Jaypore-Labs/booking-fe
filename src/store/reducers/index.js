import { combineReducers } from 'redux';
import user from './user';
import bookings from './booking'

export default combineReducers({
    user, bookings
});