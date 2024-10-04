import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store";
import { userLogout } from "../store/actions";
const { dispatch } = store;

const axiosInstance = axios.create({
    // baseURL: " https://kings.weboscy.com/api/v1",
    baseURL: "http://192.168.116.168:3000/v1",
    timeout: 30000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

axiosInstance.interceptors.request.use(async function (config) {
    if (config && config.url.includes("login")) {
        return config;
    }
    const access_token = await AsyncStorage.getItem("access_token");
    if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error &&
            error.response &&
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest.url.includes("login") &&
            !originalRequest._retry &&
            !originalRequest.url.includes("refresh-tokens")
        ) {
            originalRequest._retry = true;
            const refreshToken = await AsyncStorage.getItem("refresh_token");
            await refreshTokens({
                refreshToken,
            });
            return axiosInstance(originalRequest);
        } else if (
            error &&
            error.response &&
            error.response.status === 401 &&
            originalRequest._retry
        ) {
            dispatch(userLogout());
            return Promise.reject(error.response.data);
        } else if (error && error.response && error.response.data) {
            return Promise.reject(error.response.data);
        } else {
            return Promise.reject(error);
        }
    }
);

const refreshTokens = async (payload) => {
    return axiosInstance
        .post("/auth/refresh-tokens", payload)
        .then(async (res) => {
            const access = res.data.access.token;
            const refresh = res.data.refresh.token;
            await AsyncStorage.setItem("access_token", access);
            await AsyncStorage.setItem("refresh_token", refresh);
            return true;
        })
        .catch((err) => {
            return new Error(err);
        });
};

export default axiosInstance;
