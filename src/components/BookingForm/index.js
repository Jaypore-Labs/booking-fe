import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Platform,
    ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createBooking, updateBooking } from "../../endpoints/booking.service";
import { useDispatch, useSelector } from "react-redux";
import { setBookings } from "../../store/actions/booking";
import { FlashAlert } from "../FlashAlert";
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
    customerName: Yup.string().required("Customer name is required"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must be digits"),
});

export default function BookingForm() {
    const { user } = useSelector(({ user }) => user);
    const { bookings } = useSelector(({ bookings }) => bookings);
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { booking } = route.params;

    const [loader, setLoader] = useState(false);
    const [fromDate, setFromDate] = useState(
        booking ? new Date(booking.checkIn) : new Date()
    );
    const [toDate, setToDate] = useState(
        booking ? new Date(booking.checkOut) : new Date()
    );
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    useEffect(() => {
        if (booking) {
            setFromDate(new Date(booking.checkIn));
            setToDate(new Date(booking.checkOut));
        }
    }, [booking]);

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
                name: values.customerName,
                phone: values.phone,
            },
            userId: user?.id,
            bookedBy: user?.id,
        })
            .then((res) => {
                if (res) {
                    dispatch(setBookings([res, ...bookings]));
                    navigation.navigate("home");
                    FlashAlert({ title: "Booking created successfully" });
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

    const _updateBooking = async (values) => {
        setLoader(true);
        updateBooking(booking.id, {
            apartmentId: values.apartmentId,
            price: Number(values.price),
            deposit: Number(values.deposit),
            description: values.description,
            checkIn: fromDate.toISOString(),
            checkOut: toDate.toISOString(),
            customerDetail: { name: values.customerName, phone: values.phone },
            userId: user?.id,
            bookedBy: user?.id,
        })
            .then((res) => {
                if (res) {
                    const updatedBookings = bookings.map((item) =>
                        item.id === res.id ? res : item
                    );
                    dispatch(setBookings(updatedBookings));
                    navigation.navigate("home");
                    FlashAlert({ title: "Booking updated successfully" });
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
        <ScrollView contentContainerStyle={styles.container}>
            <Formik
                initialValues={{
                    apartmentId: booking ? booking.apartmentId : "",
                    price: booking ? booking.price : "",
                    deposit: booking ? booking.deposit : "",
                    description: booking ? booking.description : "",
                    customerName: booking ? booking.customerName : "",
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
                        <Text style={styles.label}>Apartment Name</Text>
                        <TextInput
                            value={values.apartmentId}
                            onChangeText={handleChange("apartmentId")}
                            onBlur={handleBlur("apartmentId")}
                            style={[
                                styles.input,
                                touched.apartmentId && errors.apartmentId
                                    ? styles.inputError
                                    : {},
                            ]}
                            placeholder="Enter apartment name"
                        />
                        {touched.apartmentId && errors.apartmentId && (
                            <Text style={styles.error}>{errors.apartmentId}</Text>
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
                                touched.deposit && errors.deposit ? styles.inputError : {},
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
                                display={Platform.OS === "ios" ? "spinner" : "default"}
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
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={(event, selectedDate) => {
                                    setShowToDatePicker(false);
                                    if (selectedDate) setToDate(selectedDate);
                                }}
                            />
                        )}

                        <Text style={styles.label}>Customer Name</Text>
                        <TextInput
                            value={values.customerName}
                            onChangeText={handleChange("customerName")}
                            onBlur={handleBlur("customerName")}
                            style={[
                                styles.input,
                                touched.customerName && errors.customerName
                                    ? styles.inputError
                                    : {},
                            ]}
                            placeholder="Enter customer name"
                        />
                        {touched.customerName && errors.customerName && (
                            <Text style={styles.error}>{errors.customerName}</Text>
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

                        <Pressable onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Save</Text>
                        </Pressable>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f0f0f0",
        padding: 16,
        justifyContent: "center",
    },
    form: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#dcdcdc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
        backgroundColor: "#fafafa",
    },
    inputError: {
        borderColor: "red",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
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
    button: {
        backgroundColor: "#0066cc",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
