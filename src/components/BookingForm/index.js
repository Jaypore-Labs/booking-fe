import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createBooking, updateBooking } from "../../endpoints/booking.service";
import { fetchAvailableApartments } from "../../endpoints/apartment.service";
import { useDispatch, useSelector } from "react-redux";
import { FlashAlert } from "../FlashAlert";
import { setBookings } from "../../store/actions";
import Button from "../Button";
import { Formik } from "formik";
import * as Yup from "yup";

const BookingSchema = Yup.object().shape({
    apartmentId: Yup.string().required("Apartment name is required"),
    price: Yup.number()
        .required("Price is required")
        .typeError("Price must be a number"),
    deposit: Yup.number()
        .required("Deposit is required")
        .typeError("Deposit must be a number"),
    description: Yup.string().max(
        250,
        "Description must be less than 250 characters"
    ),
    name: Yup.string().required("Customer name is required"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must be digits"),
});

export default function BookingForm() {
    const { user } = useSelector(({ user }) => user);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { bookings } = useSelector(({ bookings }) => bookings);
    const route = useRoute();

    const { booking } = route.params || {};
    const [loader, setLoader] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [availableApartments, setAvailableApartments] = useState([]);
    const [isFormEnabled, setIsFormEnabled] = useState(!!booking);

    const checkAvailability = async () => {
        setLoader(true);
        try {
            if (toDate < fromDate) {
                FlashAlert({
                    title: "Check-out date must be after check-in date.",
                    error: true,
                });
                return;
            }

            const availableApartments = await fetchAvailableApartments(
                fromDate.toISOString(),
                toDate.toISOString()
            );

            if (availableApartments.length > 0) {
                setAvailableApartments(availableApartments);
                setIsFormEnabled(true);
            }
            else {
                setAvailableApartments([]);
                setIsFormEnabled(false);
                FlashAlert({
                    title: "No apartments available for the selected dates",
                    error: true,
                });
            }
        } catch (error) {

            FlashAlert({
                title: "Error checking availability",
                error: true,
            });
        } finally {
            setLoader(false);
        }
    };

    const _createBooking = async (values) => {

        setLoader(true);
        createBooking({
            apartmentId: values.apartmentId,
            price: Number(values.price),
            deposit: Number(values.deposit),
            description: values.description,
            checkIn: fromDate.toISOString(),
            checkOut: toDate.toISOString(),
            customerDetail: {
                name: values.name,
                phone: values.phone,
            },
            userId: user?.id,
            bookedBy: user?.id,
        })
            .then((res) => {
                if (res) {
                    const updatedBookings = bookings.map((item) =>
                        item.id === res.id ? res : item
                    );
                    dispatch(setBookings(updatedBookings));
                    navigation.navigate("BookingsList");
                    FlashAlert({ title: "Booking created successfully" });
                }
            })
            .catch((error) => {
                FlashAlert({
                    title: "Booking failed",
                    error: true,
                });
            })
            .finally(() => setLoader(false));
    };
    const _updateBooking = async (values) => {
        console.log("Form values:", values);
        setLoader(true);
        updateBooking(booking.id, {
            apartmentId: values.apartmentId,
            price: Number(values.price),
            deposit: Number(values.deposit),
            description: values.description,
            checkIn: fromDate.toISOString(),
            checkOut: toDate.toISOString(),
            customerDetail: { name: values.name, phone: values.phone },
            userId: user?.id,
            bookedBy: user?.id,
        })
            .then((res) => {
                if (res) {
                    const updatedBookings = bookings.map((item) =>
                        item.id === res.id ? res : item
                    );
                    dispatch(setBookings(updatedBookings));
                    navigation.navigate("BookingsList");
                    FlashAlert({
                        title: "Booking updated successfully",
                        notIcon: true,
                        duration: 1500,
                    });
                }
            })
            .catch((error) => {
                FlashAlert({
                    title: error?.message,
                    notIcon: true,
                    duration: 1500,
                    error: true,
                });
            })
            .finally(() => setLoader(false));
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Formik
                    initialValues={{
                        apartmentId: booking ? booking.apartmentId : "",
                        price: booking ? booking.price.toString() : "",
                        deposit: booking ? booking.deposit.toString() : "",
                        description: booking ? booking.description : "",
                        name: booking ? booking.customerDetail?.name : "",
                        phone: booking ? booking.customerDetail?.phone : "",
                    }}
                    validationSchema={BookingSchema}
                    onSubmit={booking ? _updateBooking : _createBooking}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                    }) => (
                        <View style={styles.form}>
                            <Text style={styles.label}>From Date</Text>
                            <Pressable
                                onPress={() => setShowFromDatePicker(true)}
                                style={styles.dateButton}
                            >
                                <Text style={styles.dateText}>{fromDate.toDateString()}</Text>
                            </Pressable>
                            {showFromDatePicker && (
                                <DateTimePicker
                                    value={fromDate}
                                    mode="date"
                                    onChange={(event, selectedDate) => {
                                        setShowFromDatePicker(false);
                                        if (selectedDate) setFromDate(selectedDate);
                                    }}
                                />
                            )}

                            <Text style={styles.label}>To Date</Text>
                            <Pressable
                                onPress={() => setShowToDatePicker(true)}
                                style={styles.dateButton}
                            >
                                <Text style={styles.dateText}>{toDate.toDateString()}</Text>
                            </Pressable>
                            {showToDatePicker && (
                                <DateTimePicker
                                    value={toDate}
                                    mode="date"
                                    onChange={(event, selectedDate) => {
                                        setShowToDatePicker(false);
                                        if (selectedDate) setToDate(selectedDate);
                                    }}
                                />
                            )}

                            {!booking && (
                                <Button
                                    title="Check Availability"
                                    onPress={checkAvailability}
                                    loader={loader}
                                />
                            )}

                            {isFormEnabled && (
                                <>
                                    {!booking && (
                                        <>
                                            <Text style={[styles.label, { marginTop: 6 }]}>
                                                Select Apartment
                                            </Text>
                                            <Picker
                                                selectedValue={values.apartmentId}
                                                onValueChange={handleChange("apartmentId")}
                                                style={styles.picker}
                                            >
                                                <Picker.Item label="Select an apartment" value="" />
                                                {availableApartments.map((apartment) => (
                                                    <Picker.Item
                                                        key={apartment.id}
                                                        label={`${apartment.name} - ₹${apartment.price}`}
                                                        value={apartment.id}
                                                    />
                                                ))}
                                            </Picker>
                                            {touched.apartmentId && errors.apartmentId && (
                                                <Text style={styles.error}>{errors.apartmentId}</Text>
                                            )}
                                        </>
                                    )}

                                    <Text style={styles.label}>Price</Text>

                                    <TextInput
                                        value={values.price}
                                        onChangeText={handleChange("price")}
                                        onBlur={handleBlur("price")}
                                        style={[
                                            styles.input,
                                            touched.price && errors.price ? styles.inputError : {},
                                        ]}
                                        keyboardType="numeric"
                                        placeholder="Enter price"
                                    />
                                    {touched.price && errors.price && (
                                        <Text style={styles.error}>{errors.price}</Text>
                                    )}
                                    <Text style={styles.label}>Deposit</Text>
                                    <TextInput
                                        value={values.deposit}
                                        onChangeText={handleChange("deposit")}
                                        onBlur={handleBlur("deposit")}
                                        style={[
                                            styles.input,
                                            touched.deposit && errors.deposit
                                                ? styles.inputError
                                                : {},
                                        ]}
                                        keyboardType="numeric"
                                        placeholder="Enter deposit"
                                    />
                                    {touched.deposit && errors.deposit && (
                                        <Text style={styles.error}>{errors.deposit}</Text>
                                    )}

                                    <Text style={styles.label}>Description</Text>
                                    <TextInput
                                        value={values.description}
                                        onChangeText={handleChange("description")}
                                        onBlur={handleBlur("description")}
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Enter description"
                                        multiline
                                    />
                                    {touched.description && errors.description && (
                                        <Text style={styles.error}>{errors.description}</Text>
                                    )}
                                    <Text style={styles.label}>Customer Name</Text>
                                    <TextInput
                                        value={values.name}
                                        onChangeText={handleChange("name")}
                                        onBlur={handleBlur("name")}
                                        style={[
                                            styles.input,
                                            touched.name && errors.name ? styles.inputError : {},
                                        ]}
                                        placeholder="Enter customer name"
                                    />
                                    {touched.name && errors.name && (
                                        <Text style={styles.error}>{errors.name}</Text>
                                    )}

                                    <Text style={styles.label}>Phone</Text>
                                    <TextInput
                                        value={values.phone}
                                        onChangeText={handleChange("phone")}
                                        onBlur={handleBlur("phone")}
                                        style={[
                                            styles.input,
                                            touched.phone && errors.phone ? styles.inputError : {},
                                        ]}
                                        keyboardType="phone-pad"
                                        placeholder="Enter phone number"
                                    />
                                    {touched.phone && errors.phone && (
                                        <Text style={styles.error}>{errors.phone}</Text>
                                    )}

                                    <Button
                                        title="Save"
                                        loader={loader}
                                        onPress={() => handleSubmit()}
                                    />
                                </>
                            )}
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    form: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#dcdcdc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    inputError: {
        borderColor: "red",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginBottom: 8,
    },
    dateButton: {
        backgroundColor: "#fafafa",
        borderColor: "#dcdcdc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    dateText: {
        color: "#333",
    },
    picker: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#dcdcdc",
    },
});
