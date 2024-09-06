import React from "react";
import {
    SafeAreaView,
    StatusBar,
    Text,
    View,
    StyleSheet,
    Pressable,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/auth/Login";
import Signup from "../screens/auth/Signup";
import Home from "../screens/home/index";
import Notification from "../screens/notification";
import Search from "../screens/Search";
import Apartment from "../screens/home/child-screens/apartment";
import { useUser } from "../hooks/useUser";
import FlashMessage from "react-native-flash-message";
import { Check } from "react-native-feather";

const Stack = createStackNavigator();

function AppNavigator() {
    const { userRole } = useUser();
    return (
        <>
            <NavigationContainer>
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
            </NavigationContainer>
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
