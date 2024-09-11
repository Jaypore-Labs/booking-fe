import React from "react";
import {
    SafeAreaView,
    StatusBar,
    Text,
    View,
    StyleSheet,
    Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
    Login,
    Signup,
    ForgotPassword,
    Home,
    Notification,
    Search,
    Apartment,
} from "../screens";
import { useUser } from "../hooks/useUser";
import FlashMessage from "react-native-flash-message";
import { Check } from "react-native-feather";
import { useDispatch, useSelector } from "react-redux";
import { clearSession } from "../store/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

function AppNavigator() {
    const navigation = useNavigation();
    const routeName = navigation.getCurrentRoute()?.name;
    const { navigate } = navigation;
    const { userRole } = useUser();
    const dispatch = useDispatch();
    const { user, isActiveSession } = useSelector(({ user }) => user);

    React.useEffect(() => {
        const checkSession = async () => {
            if (user === null && isActiveSession) {
                dispatch(clearSession());
                const creds = await AsyncStorage.getItem("login_creds");
                AsyncStorage.clear();
                if (creds) AsyncStorage.setItem("login_creds", creds);
                navigate("Login");
            }
        };
        checkSession();
    }, [user]);
    return (
        <>
            <FlashMessage
                MessageComponent={({ message }) => (
                    <SafeAreaView>
                        <Pressable
                            onPress={message.onPress}
                            style={[
                                styles.snackbarStyles,
                                {
                                    borderColor: message.error
                                        ? "rgba(241,84,63,0.9)"
                                        : "#A1C7FF",
                                    backgroundColor: message.error ? "#ffeeee" : "#EAF2FF",
                                },
                            ]}
                        >
                            <View style={styles.row}>
                                {message.icon && (
                                    <Check
                                        width={20}
                                        style={{ marginRight: 6 }}
                                        color="#16C793"
                                    />
                                )}
                                <Text>{message.message}</Text>
                            </View>
                            <Text style={styles.undoStyle}>{message.action}</Text>
                        </Pressable>
                    </SafeAreaView>
                )}
                position="top"
            />
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="signup"
                    component={Signup}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="forgotPassword"
                    component={ForgotPassword}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="home"
                    component={Home}
                    options={{ headerShown: false }}
                />
                {userRole !== "user" && (
                    <>
                        <Stack.Screen
                            name="search"
                            component={Search}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="apartment"
                            component={Apartment}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="notification"
                            component={Notification}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </>
    );
}

export default AppNavigator;

const styles = StyleSheet.create({
    snackbarStyles: {
        padding: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 10,
        borderWidth: 0.5,
        marginHorizontal: 14,
        shadowColor: "rgba(0,0,0,0.1)",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.3,
        elevation: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    message: {
        color: "#242424",
    },
    undoStyle: {
        fontWeight: "bold",
        color: "#0066FF",
        height: "100%",
        width: 60,
        textAlign: "right",
        marginTop: 8,
        textTransform: "uppercase",
    },
});
