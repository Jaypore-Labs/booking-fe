import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';
import DatePicker from 'react-native-datepicker';
// import axios from 'axios';

export default function BookingForm({ booking, onSave }) {
    const [apartmentId, setApartmentId] = useState(booking ? booking.apartmentId : '');
    const [price, setPrice] = useState(booking ? booking.price : '');
    const [deposit, setDeposit] = useState(booking ? booking.deposit : '');
    const [description, setDescription] = useState(booking ? booking.description : '');
    const [fromDate, setFromDate] = useState(booking ? booking.fromDate : '');
    const [toDate, setToDate] = useState(booking ? booking.toDate : '');
    const [customerName, setCustomerName] = useState(booking ? booking.customerName : '');
    const [phone, setPhone] = useState(booking ? booking.phone : '');
    const [apartments, setApartments] = useState([
        { id: 1, apartmentName: '102', price: 1500, deposit: 500, description: 'best', fromDate: '15-10-2024', toDate: '17-10-2024', customerName: 'tester', phone: 5993929393 },
        { id: 2, name: 'Apt 2' },
        { id: 3, name: 'Apt 3' },
        { id: 4, name: 'Apt 4' },
        { id: 5, name: 'Apt 5' },
    ]);

    // useEffect(() => {
    //     fetchApartments();
    // }, []);

    // const fetchApartments = async () => {
    //     try {
    //         const response = await axios.get('/properties');
    //         setApartments(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const handleSubmit = () => {
        const updatedBooking = { apartmentId, price, deposit, description, fromDate, toDate, customerName, phone };
        onSave(updatedBooking);
        console.log(updatedBooking)
    };

    return (
        <View style={styles.container}>
            <Text>Apartment Name</Text>
            <Picker selectedValue={apartmentId} onValueChange={(itemValue) => setApartmentId(itemValue)}>
                {apartments.map((apartment) => (
                    <Picker.Item key={apartment.id} label={apartment.name} value={apartment.id} />
                ))}
            </Picker>

            <Text>Price</Text>
            <TextInput value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />

            <Text>Deposit</Text>
            <TextInput value={deposit} onChangeText={setDeposit} style={styles.input} keyboardType="numeric" />

            <Text>Description</Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.textarea} multiline />

            <Text>From Date</Text>
            <DatePicker date={fromDate} onDateChange={setFromDate} />

            <Text>To Date</Text>
            <DatePicker date={toDate} onDateChange={setToDate} />

            <Text>Customer Name</Text>
            <TextInput value={customerName} onChangeText={setCustomerName} style={styles.input} />

            <Text>Phone</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />

            <Button title="Save" onPress={handleSubmit} />
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
