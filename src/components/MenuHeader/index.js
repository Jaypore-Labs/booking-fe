import React from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import {
    userLogout,
    resetApartments,
    resetBookings,
} from "../../store/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../hooks/useUser";

export default function MenuHeader({ title }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { userRole, username } = useUser();
    const [loader, setLoader] = React.useState(false);

    const _LOGOUT = async () => {
        setLoader(true);
        const creds = await AsyncStorage.getItem("login_creds");
        await AsyncStorage.clear();
        if (creds) AsyncStorage.setItem("login_creds", creds);
        clearStore();
        setLoader(false);
        clearStackAndGoToLogin();
    };

    const clearStackAndGoToLogin = () => {
        navigation.navigate("Login");
    };

    const clearStore = () => {
        dispatch(userLogout());
        dispatch(resetApartments());
        dispatch(resetBookings());
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBox}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.openDrawer()}
                >
                    <Icon name="menu" size={28} color="#fff" />
                </TouchableOpacity>
                <View style={styles.rightIcons}>
                    {userRole !== "user" && (
                        <>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => navigation.navigate("search")}
                            >
                                <Icon name="search" size={28} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => navigation.navigate("notification")}
                            >
                                <Icon name="notifications" size={28} color="#fff" />
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity style={styles.iconButton} onPress={_LOGOUT}>
                        <Icon name="logout" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 0,
        backgroundColor: "mediumslateblue",
    },
    topBox: {
        backgroundColor: "mediumslateblue",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rightIcons: {
        flexDirection: "row",
    },
    iconButton: {
        marginLeft: 6,
    },
});
