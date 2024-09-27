import React, { useCallback, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
} from "react-native";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooking, deleteBooking } from "../../endpoints/booking.service";
import { fetchApartmentById } from "../../endpoints/apartment.service";
import { FlashAlert } from "../FlashAlert";
import { setBookings } from "../../store/actions/booking";

export default function BookingsList({ navigation }) {
    const dispatch = useDispatch();
    const { bookings } = useSelector(({ bookings }) => bookings);
    const [loader, setLoader] = useState(false);
    const [apartments, setApartments] = useState({});

    React.useEffect(() => {
        _fetchBookings();
    }, []);

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

    return (
        <SafeAreaView style={styles.safeArea}>
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
                                <Text>
                                    Name: {apartments[item.apartmentId] || "Loading..."}
                                </Text>
                                <Text>Price: {item.price}</Text>
                                <Text>Deposit: {item.deposit}</Text>
                                <Text>Description: {item.description}</Text>
                                <Text>Check-In: {formatDate(item.checkIn)}</Text>
                                <Text>Check-Out: {formatDate(item.checkOut)}</Text>
                                <Text>Customer Name: {item.customerDetail?.name}</Text>
                                <Text>Phone No: {item.customerDetail?.phone}</Text>
                                <View style={styles.buttonContainer}>
                                    <Pressable
                                        style={styles.button}
                                        onPress={() => updateBooking(item)}
                                    >
                                        <Text style={styles.buttonText}>EDIT</Text>
                                    </Pressable>
                                    <Pressable
                                        style={styles.button}
                                        onPress={() => _deleteBooking(item.id)}
                                    >
                                        <Text style={styles.buttonText}>DEL</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )}
                    />
                ) : (
                    <Text>No Booking Available</Text>
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
        marginTop: 40,
    },
    addButton: {
        backgroundColor: "#000000",
    },
    container: {
        padding: 16,
    },
    bookingCard: {
        padding: 16,
        backgroundColor: "#E9EAEC",
        margin: 10,
        borderRadius: 10,
        elevation: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 6,
        margin: 6,
        backgroundColor: "#3E904A",
        elevation: 3,
    },
    buttonText: {
        fontSize: 12,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
});
