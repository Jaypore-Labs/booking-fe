import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createBooking } from "../../endpoints/booking.service";
import { useDispatch, useSelector } from "react-redux";
import { setBookings } from "../../store/actions/booking";
import { FlashAlert } from "../FlashAlert";

export default function BookingForm({ booking, onSave }) {
    const { user } = useSelector(({ user }) => user);
    const { bookings } = useSelector(({ bookings }) => bookings);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [loader, setLoader] = useState(false);
    const [apartmentId, setApartmentId] = useState(
        booking ? booking.apartmentId : ""
    );
    const [price, setPrice] = useState(booking ? booking.price : "");
    const [deposit, setDeposit] = useState(booking ? booking.deposit : "");
    const [description, setDescription] = useState(
        booking ? booking.description : ""
    );
    const [fromDate, setFromDate] = useState(
        booking ? new Date(booking.fromDate) : new Date()
    );
    const [toDate, setToDate] = useState(
        booking ? new Date(booking.toDate) : new Date()
    );
    const [customerName, setCustomerName] = useState(
        booking ? booking.customerName : ""
    );
    const [phone, setPhone] = useState(booking ? booking.phone : "");
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    const _createBooking = async () => {
        setLoader(true);
        createBooking({
            apartmentId,
            price: Number(price),
            deposit: Number(deposit),
            description,
            checkIn: fromDate.toISOString(),
            checkOut: toDate.toISOString(),
            customerDetail: {
                name: customerName,
                phone,
            },
            userId: user?.id,
            bookedBy: user?.id,
        })
            .then((res) => {
                if (res) {
                    dispatch(setBookings([res, ...bookings]));
                    navigation.navigate("home");
                    FlashAlert({
                        title: "Booking created successfully",
                    });
                }
            })
            .catch((error) => {
                setLoader(false);
                FlashAlert({
                    title: error?.message,
                    notIcon: true,
                    duration: 1500,
                    error: true,
                });
            })
            .finally(() => {
                setLoader(false);
            });
    };

    return (
        <View style={styles.container}>
            <Text>Apartment Name</Text>
            <TextInput
                value={apartmentId}
                onChangeText={setApartmentId}
                style={styles.input}
            />

            <Text>Price</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                keyboardType="numeric"
            />

            <Text>Deposit</Text>
            <TextInput
                value={deposit}
                onChangeText={setDeposit}
                style={styles.input}
                keyboardType="numeric"
            />

            <Text>Description</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                style={styles.textarea}
                multiline
            />

            <Text>From Date</Text>
            <Button
                title="Select From Date"
                onPress={() => setShowFromDatePicker(true)}
            />
            {showFromDatePicker && (
                <DateTimePicker
                    value={fromDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                        setShowFromDatePicker(false);
                        if (selectedDate) setFromDate(selectedDate);
                    }}
                />
            )}

            <Text>To Date</Text>
            <Button
                title="Select To Date"
                onPress={() => setShowToDatePicker(true)}
            />
            {showToDatePicker && (
                <DateTimePicker
                    value={toDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                        setShowToDatePicker(false);
                        if (selectedDate) setToDate(selectedDate);
                    }}
                />
            )}

            <Text>Customer Name</Text>
            <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                style={styles.input}
            />

            <Text>Phone</Text>
            <TextInput
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
            />

            <Button title="Save" onPress={_createBooking} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    textarea: {
        borderBottomWidth: 1,
        marginBottom: 8,
        height: 100,
    },
});
