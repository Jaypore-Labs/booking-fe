import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ApartmentDropdown from "../../../../components/ApartmentDropdown";
import {
    fetchAvailableApartments,
    fetchApartmentById,
} from "../../../../endpoints/apartment.service";
import {
    fetchBookingsByUserId,
    fetchBooking,
} from "../../../../endpoints/booking.service";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../../../../components/Button";
import { useSelector } from "react-redux";
import { useUser } from "../../../../hooks/useUser";

export default function HomeScreen() {
    const { user } = useSelector(({ user }) => user);
    const userId = user?.id;
    const { userRole } = useUser();
    const [loader, setLoader] = useState(false);
    const [showAvailable, setShowAvailable] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [expandedBookingIds, setExpandedBookingIds] = useState([]);
    const [apartments, setApartments] = useState({});

    const getApartmentName = async (apartmentId) => {
        if (!apartments[apartmentId]) {
            try {
                const apartment = await fetchApartmentById(apartmentId);
                setApartments((prev) => ({
                    ...prev,
                    [apartmentId]: apartment.name,
                }));
            } catch (error) {
                console.error("Failed to fetch apartment name", error);
            }
        }
    };

    const _fetchBookings = async () => {
        setLoader(true);
        try {
            let userBookings;

            if (userRole !== "user") {
                userBookings = await fetchBooking();
            } else {
                userBookings = await fetchBookingsByUserId(userId);
            }
            setBookings(userBookings.results);
            await Promise.all(
                userBookings.results.map((booking) =>
                    getApartmentName(booking.apartmentId)
                )
            );
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoader(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                _fetchBookings();
            }
        }, [userId, userRole])
    );

    const _fetchAvailableApartments = async () => {
        setLoader(true);
        try {
            const checkIn = checkInDate.toISOString();
            const checkOut = checkOutDate.toISOString();
            const apartments = await fetchAvailableApartments(checkIn, checkOut);
            setAvailableRooms(apartments);
        } catch (error) {
            console.error("Error fetching available apartments:", error);
        } finally {
            setLoader(false);
        }
    };

    const handleCheckInDateChange = (event, selectedDate) => {
        setShowFromDatePicker(false);
        if (selectedDate) setCheckInDate(selectedDate);
    };

    const handleCheckOutDateChange = (event, selectedDate) => {
        setShowToDatePicker(false);
        if (selectedDate) setCheckOutDate(selectedDate);
    };

    const toggleBookingDetails = (id) => {
        setExpandedBookingIds((prev) =>
            prev.includes(id)
                ? prev.filter((bookingId) => bookingId !== id)
                : [...prev, id]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollView}>
                {loader ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <View key={booking.id}>
                                    <TouchableOpacity
                                        onPress={() => toggleBookingDetails(booking.id)}
                                        style={[
                                            styles.dropdownBox,
                                            {
                                                backgroundColor: expandedBookingIds.includes(booking.id)
                                                    ? "#E9EAEC"
                                                    : "#fff",
                                            },
                                        ]}
                                    >
                                        <View style={styles.dropdownHeader}>
                                            {/* <Text style={styles.dropdownText}>
                        Booking Name -
                        {apartments[booking.apartmentId] || "Loading..."}{" "}
                        Check-in: 10.00 PM / Check-out: 15.00 AM
                      </Text> */}
                                            <Text style={styles.dropdownText}>
                                                {/* Booking Name -{" "} */}
                                                {apartments[booking.apartmentId] || "Loading..."} -
                                                CheckOut{" "}
                                                {new Date(booking.checkOut).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}{" "}
                                                / CheckIn{" "}
                                                {new Date(booking.checkIn).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </Text>
                                            <Icon
                                                name={
                                                    expandedBookingIds.includes(booking.id)
                                                        ? "chevron-up"
                                                        : "chevron-down"
                                                }
                                                size={20}
                                                color="#000"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    {expandedBookingIds.includes(booking.id) && (
                                        <ApartmentDropdown
                                            apartment={booking}
                                            name={apartments[booking.apartmentId] || "Loading..."}
                                        />
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noBookingText}>
                                Currently, you have no booked apartments. Start exploring and
                                book one now!
                            </Text>
                        )}

                        <TouchableOpacity
                            onPress={() => setShowAvailable(!showAvailable)}
                            style={[styles.dropdownBox, { backgroundColor: "#fff" }]}
                        >
                            <View style={styles.dropdownHeader}>
                                <Text style={styles.dropdownText}>
                                    Find Available Apartments
                                </Text>
                                <Icon
                                    name={showAvailable ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#000"
                                />
                            </View>
                        </TouchableOpacity>

                        {showAvailable && (
                            <View>
                                <View style={styles.datePickerContainer}>
                                    <Text>Check-in:</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowFromDatePicker(true)}
                                        style={styles.dateButton}
                                    >
                                        <Text>{checkInDate.toDateString()}</Text>
                                    </TouchableOpacity>
                                    {showFromDatePicker && (
                                        <DateTimePicker
                                            value={checkInDate}
                                            mode="date"
                                            display="default"
                                            onChange={handleCheckInDateChange}
                                        />
                                    )}
                                </View>

                                <View style={styles.datePickerContainer}>
                                    <Text>Check-out:</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowToDatePicker(true)}
                                        style={styles.dateButton}
                                    >
                                        <Text>{checkOutDate.toDateString()}</Text>
                                    </TouchableOpacity>
                                    {showToDatePicker && (
                                        <DateTimePicker
                                            value={checkOutDate}
                                            mode="date"
                                            display="default"
                                            onChange={handleCheckOutDateChange}
                                        />
                                    )}
                                </View>
                                <View
                                    style={{
                                        width: "100%",
                                        alignItems: "center",
                                        marginTop: 20,
                                    }}
                                >
                                    <Button
                                        loader={loader}
                                        onPress={_fetchAvailableApartments}
                                        title="Find"
                                    />
                                </View>
                                <View style={styles.expandedBox}>
                                    {availableRooms.length > 0 ? (
                                        availableRooms.map((item, i) => (
                                            <Text key={i} style={{ fontSize: 14 }}>
                                                {i + 1} Apartment Room {item.name} - ₹{item.price}
                                            </Text>
                                        ))
                                    ) : (
                                        <Text>No available apartments</Text>
                                    )}
                                </View>
                            </View>
                        )}
                    </>
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
    scrollView: {
        flexGrow: 1,
        padding: 16,
    },
    dropdownBox: {
        padding: 14,
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
        fontSize: 14,
        fontWeight: "400",
        flexWrap: "wrap",
    },
    expandedBox: {
        marginVertical: 8,
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    noBookingText: {
        padding: 16,
        textAlign: "center",
        fontSize: 16,
        color: "#6C757D",
        fontWeight: "500",
        backgroundColor: "#F8F9FA",
        borderRadius: 8,
        marginVertical: 20,
    },
    datePickerContainer: {
        marginVertical: 10,
    },
    dateButton: {
        padding: 10,
        backgroundColor: "#E9EAEC",
        borderRadius: 5,
        marginTop: 5,
    },
    fetchButton: {
        backgroundColor: "#0066cc",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    fetchButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
