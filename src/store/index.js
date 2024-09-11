import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";

import storage from "@react-native-async-storage/async-storage";

import reducer from "./reducers";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user", "bookings"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export { store, persistor };
