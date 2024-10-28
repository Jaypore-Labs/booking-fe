import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
} from "react-native";
import Header from "../../components/Header";
import * as Notifications from "expo-notifications";
import Icon from "react-native-vector-icons/MaterialIcons";
import getNotifications, {
    markNotificationAsRead,
} from "../../endpoints/notification.service";
import { FlashAlert } from "../../components/FlashAlert";

export default function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [loader, setLoader] = useState(false);

    const _fetchNotifications = async () => {
        try {
            setLoader(true);
            const result = await getNotifications();
            setNotifications(result.results);
        } catch (error) {
            FlashAlert({
                title: e?.message || "Something went wrong. Try again later.",
                notIcon: true,
                duration: 1500,
                error: true,
            });
        } finally {
            setLoader(false);
        }
    };

    const handleNotificationClick = async (notificationId) => {
        await markNotificationAsRead(notificationId);
        _fetchNotifications();
    };

    useEffect(() => {
        _fetchNotifications();
    }, []);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(
            (notification) => {
                if (notification && notification.request) {
                    setNotifications((prev) => [...prev, notification.request.content]);
                }
            }
        );

        return () => subscription.remove();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View>
                    <Header title={"Notifications"} />
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.container}>
                            {notifications && notifications.length > 0 ? (
                                <View style={styles.notifications}>
                                    {notifications.map((notification) => (
                                        <TouchableOpacity
                                            key={notification.id}
                                            onPress={() => handleNotificationClick(notification.id)}
                                            style={[
                                                styles.notificationItem,
                                                {
                                                    backgroundColor: notification.read
                                                        ? "lightblue"
                                                        : "#f8f9fa",
                                                },
                                            ]}
                                        >
                                            <Icon
                                                name="notifications"
                                                size={20}
                                                color="#000"
                                                style={styles.icon}
                                            />
                                            <Text style={styles.notificationText}>
                                                {notification.message}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <Text style={styles.noNotificationText}>
                                    No notifications found
                                </Text>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },

    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: "center",
    },
    notifications: {
        marginTop: 2,
    },
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        margin: 10,
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
        flexWrap: "wrap",
        alignSelf: "stretch",
    },
    icon: {
        marginRight: 10,
    },
    notificationText: {
        fontSize: 16,
        color: "#333",
        flexShrink: 1,
        flexWrap: "wrap",
        flex: 1,
    },
    noNotificationText: {
        textAlign: "center",
        fontSize: 16,
        color: "#6C757D",
        fontWeight: "500",
    },
});
