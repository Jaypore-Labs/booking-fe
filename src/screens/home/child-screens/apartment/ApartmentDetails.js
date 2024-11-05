import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Button from "../../../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../../hooks/useUser";

const ApartmentDetails = ({ route }) => {
    const { apartment } = route.params;
    const { navigate } = useNavigation();
    const { userRole } = useUser();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>Name - {apartment.name}</Text>
                    <Text style={styles.price}>
                        Price - {"\u20AC"} {apartment.price}
                    </Text>
                    <Text style={styles.type}>Type - {apartment.type}</Text>
                    <Text style={styles.description}>
                        Description - {apartment.description}
                    </Text>

                    <View style={styles.statusContainer}>
                        <Text
                            style={[
                                styles.status,
                                {
                                    color: apartment.isActive ? "#3E904A" : "#FF0000",
                                },
                            ]}
                        >
                            Status: {apartment.isActive ? "Active" : "Inactive"}
                        </Text>
                    </View>

                    {userRole !== "user" && (
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                marginTop: 20,
                            }}
                        >
                            <Button
                                onPress={() => navigate("bookingForm")}
                                title="Book Now"
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        padding: 16,
    },

    detailsContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderColor: "#E9EAEC",
        borderWidth: 1,
        padding: 16,
        elevation: 3,
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 6,
    },
    price: {
        fontSize: 14,
        fontWeight: "500",
        color: "#3E904A",
        marginBottom: 6,
    },
    type: {
        fontSize: 14,
        color: "#757575",
        marginBottom: 6,
    },
    description: {
        fontSize: 12,
        lineHeight: 24,
        color: "#424242",
        marginBottom: 6,
    },
    statusContainer: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    status: {
        fontSize: 14,
        color: "#ff9800",
    },
});

export default ApartmentDetails;
