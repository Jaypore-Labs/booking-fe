import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import Button from "../Button";
// import axios from 'axios';

export default function BookingsList({ navigation }) {
    const [bookings, setBookings] = useState([
        { id: 1, apartmentName: '102', price: 1500, deposit: 500, description: 'best', fromDate: '15-10-2024', toDate: '17-10-2024', customerName: 'tester', phone: 5993929393 }
    ]);

    // useEffect(() => {
    //     fetchBookings();
    // }, []);

    // const fetchBookings = async () => {
    //     try {
    //         const response = await axios.get('/bookings');
    //         setBookings(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const handleEdit = (booking) => {
        navigation.navigate('BookingForm', { booking });
    };

    const handleDelete = async (id) => {
        // try {
        //     await axios.delete(`/bookings/${id}`);
        //     fetchBookings();
        // } catch (error) {
        //     console.error(error);
        // }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View
                style={{
                    // width: "100%",
                    alignItems: "center",
                    marginTop: 40,
                }}
            >
                <Button
                    title={"Add Booking"}
                    style={{ backgroundColor: "#000000" }}
                    onPress={() => navigation.navigate("BookingForm")}
                />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.bookingCard}>
                            <Text>Property Name : {item.apartmentName}</Text>
                            <Text>Property Price : {item.price}</Text>
                            <Text>Deposit Amount : {item.deposit}</Text>
                            <Text>{item.description}</Text>
                            <Text>From {item.fromDate} - To{item.toDate}</Text>
                            <Text>Name :{item.customerName}</Text>
                            <Text>Phone No:{item.phone}</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Pressable
                                    style={styles.button}
                                    onPress={() => handleEdit(item)}
                                >
                                    <Text style={styles.text}>EDIT</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => handleDelete(item.id)}
                                >
                                    <Text style={styles.text}>DEL</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                />

            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    bookingCard: {
        padding: 16,
        backgroundColor: "#E9EAEC",
        // marginBottom: 8,
        margin: 10,
        borderRadius: 10,
        elevation: 1,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 4,
        elevation: 3,
        margin: 6,
        borderRadius: 6,
        padding: 8,
        backgroundColor: "#3E904A",
    },
    text: {
        fontSize: 12,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
});
