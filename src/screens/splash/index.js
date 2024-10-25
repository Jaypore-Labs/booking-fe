import React, { useEffect } from "react";
import { ImageBackground, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { getCurrentSession } from "../../endpoints/auth";
import { userLogout, clearSession, userLogin } from "../../store/actions";
import { registerForPushNotificationsAsync } from "../../services/notification";

const Splash = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const clearStackAndMoveToPage = (page) => {
        navigation.reset({
            index: 0,
            routes: [{ name: page }],
        });
    };

    const checkAuth = async () => {
        try {
            const access_token = await AsyncStorage.getItem("access_token");

            if (access_token) {
                const res = await getCurrentSession();
                if (res) {
                    dispatch(userLogin({ user: res }));
                    let expoPushToken = await AsyncStorage.getItem("expoPushToken");
                    if (!expoPushToken) {
                        expoPushToken = await registerForPushNotificationsAsync();
                        await AsyncStorage.setItem("expoPushToken", expoPushToken);
                    }
                    clearStackAndMoveToPage("home");
                } else {
                    handleSessionInvalid();
                }
            } else {
                handleSessionInvalid();
            }
        } catch (error) {
            console.error("Error during session check:", error);
            handleSessionInvalid();
        }
    };

    const handleSessionInvalid = async () => {
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        dispatch(userLogout());
        dispatch(clearSession());
        clearStackAndMoveToPage("Login");
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            checkAuth();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground
                source={require("../../../resource/images/splash.png")}
                style={styles.backgroundImage}
                resizeMode="contain"
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    backgroundImage: {
        width: "80%",
        height: "50%",
    },
});

export default Splash;
