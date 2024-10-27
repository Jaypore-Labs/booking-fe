import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooking, deleteBooking } from "../../endpoints/booking.service";
import { fetchApartmentById } from "../../endpoints/apartment.service";
import { FlashAlert } from "../FlashAlert";
import { setBookings } from "../../store/actions/booking";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../Header";
import colors from "../../config/colors";

export default function BookingsList({ navigation }) {
    const dispatch = useDispatch();
    const { bookings } = useSelector(({ bookings }) => bookings);
    const [loader, setLoader] = useState(false);
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

    const _fetchBookings = useCallback(async () => {
        setLoader(true);
        await fetchBooking()
            .then(async (res) => {
                if (res) {
                    const uniqueBookings = [
                        ...new Map(res?.results.map((item) => [item.id, item])).values(),
                    ];
                    dispatch(setBookings(uniqueBookings));
                    await Promise.all(
                        uniqueBookings.map((booking) =>
                            getApartmentName(booking.apartmentId)
                        )
                    );
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

    const updateBooking = (item) => {
        navigation.navigate("BookingForm", { booking: item });
    };

    const _deleteBooking = async (id) => {
        try {
            await deleteBooking(id);
            FlashAlert({
                title: "Booking deleted successfully",
                duration: 1500,
                error: false,
            });
            const updatedBookings = bookings.filter((booking) => booking.id !== id);
            dispatch(setBookings(updatedBookings));
            _fetchBookings();
        } catch (error) {
            FlashAlert({
                title: error.message || "Error deleting booking",
                error: true,
            });
        }
    };

    const formatDate = (dateStr) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    useFocusEffect(
        useCallback(() => {
            _fetchBookings();
        }, [_fetchBookings])
    );
    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Bookings" />
            <View style={styles.addButtonContainer}>
                <Button
                    title={"Add Booking"}
                    style={styles.addButton}
                    onPress={() => navigation.navigate("BookingForm")}
                />
            </View>
            <View style={styles.container}>
                {bookings && bookings.length > 0 ? (
                    <FlatList
                        data={bookings}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.bookingCard}>
                                <Text style={styles.name}>
                                    Name: {apartments[item.apartmentId] || "Loading..."}
                                </Text>
                                <Text style={styles.price}>Price: {item.price}</Text>
                                <Text style={styles.light}>Deposit: {item.deposit}</Text>
                                <Text style={styles.light}>
                                    Description: {item.description}
                                </Text>
                                <Text style={styles.date}>
                                    Check-In: {formatDate(item.checkIn)}
                                </Text>
                                <Text style={styles.date}>
                                    Check-Out: {formatDate(item.checkOut)}
                                </Text>
                                <Text style={styles.detail}>
                                    Customer Name: {item.customerDetail?.name}
                                </Text>
                                <Text style={styles.detail}>
                                    Phone No: {item.customerDetail?.phone}
                                </Text>

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.editButton]}
                                        onPress={() => updateBooking(item)}
                                    >
                                        <Icon
                                            name="edit"
                                            size={16}
                                            color="#fff"
                                            style={styles.icon}
                                        />
                                        <Text style={styles.text}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.deleteButton]}
                                        onPress={() => _deleteBooking(item.id)}
                                    >
                                        <Icon
                                            name="delete"
                                            size={16}
                                            color="#fff"
                                            style={styles.icon}
                                        />
                                        <Text style={styles.text}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={{ textAlign: "center" }}>No Booking Available</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    addButtonContainer: {
        alignItems: "center",
        // marginTop: 40,
    },
    addButton: {
        backgroundColor: colors.primary,
    },
    container: {
        flex: 1,
        padding: 18,
    },
    bookingCard: {
        padding: 14,
        backgroundColor: "#ffffff",
        borderColor: "#E9EAEC",
        borderWidth: 1,
        margin: 10,
        borderRadius: 10,
        elevation: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#3E904A",
    },
    name: {
        fontSize: 16,
        color: "#000000",
        fontWeight: "600",
    },
    light: {
        fontSize: 14,
        color: "#000000",
        fontWeight: "600",
    },
    date: {
        fontSize: 14,
        color: "#000000",
        fontWeight: "600",
    },
    detail: {
        fontSize: 12,
        color: "grey",
        fontWeight: "600",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginHorizontal: 5,
        elevation: 2,
    },
    icon: {
        marginRight: 6,
    },
    editButton: {
        backgroundColor: colors.primary,
    },
    deleteButton: {
        backgroundColor: "#808080",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 4,
        elevation: 3,
        margin: 6,
        backgroundColor: "#3E904A",
    },
    buttonText: {
        fontSize: 12,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
    text: {
        fontSize: 12,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
});
