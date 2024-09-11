import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    Pressable,
} from "react-native";
import Button from "../Button";

export default function PropertiesList({ navigation }) {
    const [properties, setProperties] = useState([
        {
            id: 1,
            name: "Apartment 101",
            price: 1500,
            type: "Room2",
            active: true,
            comments: "comment here show",
        },
        {
            id: 2,
            name: "Apartment 103",
            price: 1500,
            type: "Room2",
            active: true,
            comments: "comment here show",
        },
        {
            id: 3,
            name: "Apartment 104",
            price: 1500,
            type: "Room1",
            active: true,
            comments: "comment here show",
        },
        {
            id: 4,
            name: "Apartment 105",
            price: 1500,
            type: "Room2",
            active: true,
            comments: "comment here show",
        },
        {
            id: 5,
            name: "Apartment 106",
            price: 1500,
            type: "Room1",
            active: false,
            comments: "comment here show",
        },
        {
            id: 6,
            name: "Apartment 107",
            price: 1500,
            type: "Room2",
            active: true,
            comments: "comment here show",
        },
    ]);

    const handleEdit = (property) => {
        navigation.navigate("PropertyForm", { property });
    };

    const handleDelete = async (id) => {
        // try {
        //     await axios.delete(`/properties/${id}`);
        //     fetchProperties();
        // } catch (error) {
        //     console.error(error);
        // }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Button
                    title={"Add Property"}
                    style={styles.addButton}
                    onPress={() => navigation.navigate("PropertyForm")}
                />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={properties}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.propertyCard}>
                            <View style={styles.propertyInfoRow}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.price}>
                                    {"\u20B9"}
                                    {item.price}/DAY
                                </Text>
                            </View>
                            <View style={styles.propertyStatusRow}>
                                <Text style={styles.typetext}>{item.type}</Text>
                                <Text style={styles.typetext}>
                                    {item.active ? "Active" : "Inactive"}
                                </Text>
                            </View>

                            <Text style={styles.comments}>{item.comments}</Text>
                            <View style={styles.buttonRow}>
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
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        alignItems: "center",
        marginTop: 40,
    },
    addButton: {
        backgroundColor: "#000000",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    propertyCard: {
        padding: 16,
        backgroundColor: "#E9EAEC",
        margin: 10,
        borderRadius: 10,
        elevation: 1,
    },
    propertyInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#3E904A",
    },
    name: {
        fontSize: 16,
        color: "#000000",
        fontWeight: "600",
    },
    comments: {
        fontSize: 10,
        color: "grey",
    },
    typetext: {
        marginVertical: 6,
        fontSize: 12,
        color: "grey",
    },
    propertyStatusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
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
    text: {
        fontSize: 12,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
});
