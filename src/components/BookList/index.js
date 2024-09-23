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
import { FlashAlert } from "../FlashAlert";
import { setBookings } from "../../store/actions/booking";

export default function BookingsList({ navigation }) {
    const dispatch = useDispatch();
    const { bookings } = useSelector(({ bookings }) => bookings);
    const [loader, setLoader] = useState(false);

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
            _fetchBookings();
        } catch (error) {
            FlashAlert({
                title: error.message || "Error deleting booking",
                error: true,
            });
        }
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
                                <Text>Property Name : {item.apartmentName}</Text>
                                <Text>Property Price : {item.price}</Text>
                                <Text>Deposit Amount : {item.deposit}</Text>
                                <Text>{item.description}</Text>
                                <Text>
                                    From {item.fromDate} - To {item.toDate}
                                </Text>
                                <Text>Name : {item.customerName}</Text>
                                <Text>Phone No: {item.phone}</Text>
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
