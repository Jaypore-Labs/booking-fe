import React, { useState, useRef } from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import ApartmentDropdown from "../../../../components/ApartmentDropdown";
import { fetchBooking } from "../../endpoints/booking.service";
import { setBookings } from "../../store/actions/booking";

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

    const dispatch = useDispatch();
    const { bookings } = useSelector(({ bookings }) => bookings);
    const [apartments, setApartments] = useState(bookings);
    const [selectedApartment, setSelectedApartment] = useState(bookings[0].id);
    const [showInfo, setShowInfo] = useState(false);
    const [showAvailabel, setShowAvailabel] = useState(false);

    const markAsCompleted = (id) => {
        setApartments(
            apartments.map((item) =>
                item.id === id ? { ...item, completed: true } : item
            )
        );
    };

    const selectedApt = apartments.find((item) => item.id === selectedApartment);

    React.useEffect(() => {
        _fetchBookings();
    }, []);

    const _fetchBookings = useCallback(async () => {
        setLoader(true);
        await fetchBooking()
            .then((res) => {
                if (res) {
                    dispatch(setBookings([...bookings, ...res?.results]));
                }
            })
            .catch((e) => {
                FlashAlert({
                    title: e?.message || "Something went wrong. Try again later.",
                    notIcon: true,
                    duration: 1500,
                    error: true,
                });
            })
            .finally(() => {
                setLoader(false);
            });
    }, [bookings]);

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
