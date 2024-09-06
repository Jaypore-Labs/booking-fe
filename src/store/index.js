import { applyMiddleware, compose, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import storage from '@react-native-async-storage/async-storage';

import reducer from "./reducers";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
};


const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export { store, persistor };

