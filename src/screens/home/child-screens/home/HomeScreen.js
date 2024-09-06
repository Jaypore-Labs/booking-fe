import React, { useState, useRef, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import * as Notifications from "expo-notifications";
import {
    registerForPushNotificationsAsync,
    sendPushNotification,
} from "../../../../services/notification";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import ApartmentDropdown from "../../../../components/ApartmentDropdown";


const dummyData = [
    {
        id: "1",
        name: "102",
        checkout: "10:00",
        checkin: "15:00",
        comments: "",
        completed: false,
    },
    {
        id: "2",
        name: "203",
        checkout: "12:00",
        checkin: "14:00",
        comments: "",
        completed: false,
    },
    {
        id: "3",
        name: "305",
        checkout: "11:00",
        checkin: "16:00",
        comments: "",
        completed: false,
    },
];

const AvailabilityData = [
    { id: "1", name: "102", availability: true },
    { id: "2", name: "203", availability: true },
    { id: "3", name: "305", availability: false },
    { id: "4", name: "104", availability: true },
    { id: "5", name: "203", availability: true },
    { id: "6", name: "305", availability: true },
    { id: "7", name: "108", availability: false },
    { id: "8", name: "203", availability: true },
    { id: "9", name: "305", availability: true },
];
const availableRooms = AvailabilityData.filter((room) => room.availability);

export default function HomeScreen() {
    const navigation = useNavigation();
    const [apartments, setApartments] = useState(dummyData);
    const [selectedApartment, setSelectedApartment] = useState(dummyData[0].id);
    const [showInfo, setShowInfo] = useState(false);
    const [showAvailabel, setShowAvailabel] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const handleCommentChange = (id, text) => {
        setApartments(
            apartments.map((item) =>
                item.id === id ? { ...item, comments: text } : item
            )
        );
    };

    const onSave = (text) => {
        handleCommentChange();
        sendPushNotification(expoPushToken, text);
    };

    const markAsCompleted = (id) => {
        setApartments(
            apartments.map((item) =>
                item.id === id ? { ...item, completed: true } : item
            )
        );
    };

    const selectedApt = apartments.find((item) => item.id === selectedApartment);

    //testing notification

    // const handlesendNotification = (msg) => {
    //     // Send push notification to all users
    //     if (expoPushToken) {
    //         sendPushNotification(expoPushToken, msg);
    //     } else {
    //         console.log("Push token is not available");
    //     }
    // };

    //   useEffect(() => {
    //     registerForPushNotificationsAsync().then(
    //       (token) => token && setExpoPushToken(token)
    //     );

    //     notificationListener.current =
    //       Notifications.addNotificationReceivedListener((notification) => {
    //         setNotification(notification);
    //       });

    //     responseListener.current =
    //       Notifications.addNotificationResponseReceivedListener((response) => {
    //         console.log(response);
    //       });

    //     return () => {
    //       notificationListener.current &&
    //         Notifications.removeNotificationSubscription(
    //           notificationListener.current
    //         );
    //       responseListener.current &&
    //         Notifications.removeNotificationSubscription(responseListener.current);
    //     };
    //   }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={{ fontSize: 16, marginBottom: 8 }}>Today</Text>
                <TouchableOpacity
                    onPress={() => setShowInfo(!showInfo)}
                    style={[
                        styles.dropdownBox,
                        { backgroundColor: showInfo ? "#E9EAEC" : "#fff" },
                    ]}
                >
                    <View style={styles.dropdownHeader}>
                        <Text style={styles.dropdownText}>
                            Apt 102 checkout 10:00 / checkin 15:00
                        </Text>
                        <Icon
                            name={showInfo ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#000"
                        />
                    </View>
                </TouchableOpacity>
                {showInfo && (
                    <ApartmentDropdown
                        apartment={selectedApt}
                        onCommentChange={handleCommentChange}
                        onComplete={markAsCompleted}
                        onSave={onSave}
                    />
                )}
                <TouchableOpacity
                    onPress={() => setShowAvailabel(!showAvailabel)}
                    style={[styles.dropdownBox, { backgroundColor: "#fff" }]}
                >
                    <View style={styles.dropdownHeader}>
                        <Text style={styles.dropdownText}>Available Rooms (5)</Text>
                        <Icon
                            name={showInfo ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#000"
                        />
                    </View>
                </TouchableOpacity>
                {showAvailabel && (
                    <View style={styles.expandedBox}>
                        {availableRooms.map((item, i) => (
                            <Text key={item.id} style={{ fontSize: 14 }}>
                                {i + 1} Apartment Room {item.name}
                            </Text>
                        ))}
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomBox}></View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    topBox: {
        backgroundColor: "mediumslateblue",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    bottomBox: {
        backgroundColor: "mediumslateblue",
        height: 50,
    },
    scrollView: {
        flexGrow: 1,
        padding: 16,
    },
    rightIcons: {
        flexDirection: "row",
    },
    iconButton: {
        marginLeft: 16,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 16,
        marginTop: 16,
    },

    dropdownBox: {
        padding: 15,
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
    },
    dropdownHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dropdownText: {
        fontSize: 16,
        fontWeight: "400",
    },
    expandedBox: {
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
