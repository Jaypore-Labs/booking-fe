import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    FlatList,
    ActivityIndicator,
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
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 5;

    const _fetchNotifications = async (page = 1) => {
        try {
            setLoader(true);
            const result = await getNotifications({
                page,
                limit,
                sortBy: "createdAt:desc",
            });
            setNotifications((prevNotifications) =>
                page === 1 ? result.results : [...prevNotifications, ...result.results]
            );
            setHasMore(
                result.totalResults > notifications.length + result.results.length
            );
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

    const handleLoadMore = () => {
        if (hasMore && !loader) {
            setPage((prevPage) => prevPage + 1);
            _fetchNotifications(page + 1);
        }
    };
    const formatDate = (date) => {
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };
        return new Date(date).toLocaleString("en-GB", options).replace(",", "");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View style={{ flex: 1 }}>
                    <Header title={"Notifications"} />
                    {notifications && notifications.length > 0 ? (
                        <FlatList
                            data={notifications}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleNotificationClick(item.id)}
                                    style={[
                                        styles.notificationItem,
                                        {
                                            backgroundColor: item.read ? "lightblue" : "#f8f9fa",
                                        },
                                    ]}
                                >
                                    <View style={styles.notificationhead}>
                                        <Icon
                                            name="notifications"
                                            size={20}
                                            color="#000"
                                            style={styles.icon}
                                        />
                                        <Text
                                            style={[styles.notificationText, { fontWeight: "bold" }]}
                                        >
                                            {item.messageBy || "Anonymous"}
                                        </Text>
                                    </View>
                                    <View style={styles.notificationContent}>
                                        <Text style={styles.notificationText}>{item.message}</Text>
                                        <Text style={styles.time}>
                                            {formatDate(item.timestamp)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.scrollView}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                loader ? (
                                    <ActivityIndicator size="small" color="#0000ff" />
                                ) : null
                            }
                        />
                    ) : (
                        <Text style={styles.noNotificationText}>
                            No notifications found
                        </Text>
                    )}
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
        padding: 16,
        flexGrow: 1,
        paddingBottom: 20,
    },
    notificationItem: {
        // flexDirection: "row",
        flexDirection: "column",
        margin: 10,
        padding: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
        flexWrap: "wrap",
        marginVertical: 8,
    },
    notificationhead: {
        flex: 1, //
        flexDirection: "row",
        alignItems: "center",
    },
    notificationContent: {
        flex: 1, //
        flexDirection: "row",
        justifyContent: "space-between",
        // alignItems: "center",
    },
    icon: {
        marginRight: 10,
    },
    notificationText: {
        color: "#000000",
        flex: 1,
        fontSize: 14,
        marginRight: 8,
        flexWrap: "wrap",
    },
    time: {
        fontSize: 12,
        marginLeft: 10,
        color: "#777",
    },
    noNotificationText: {
        textAlign: "center",
        fontSize: 14,
        color: "#6C757D",
        fontWeight: "500",
    },
});
