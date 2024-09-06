import React, { useState, useMemo, useCallback } from "react";
import {
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Search() {
    const [data, setData] = useState([
        {
            id: 1,
            name: "Apartment 101",
            price: 1200,
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
            price: 2000,
            type: "Room1",
            active: true,
            comments: "comment here show",
        },
        {
            id: 4,
            name: "Apartment 105",
            price: 1800,
            type: "Room2",
            active: true,
            comments: "comment here show",
        },
        {
            id: 5,
            name: "Apartment 106",
            price: 2500,
            type: "Room1",
            active: false,
            comments: "comment here show",
        },
        {
            id: 6,
            name: "Apartment 107",
            price: 1700,
            type: "Room2",
            active: true,
            comments: "comment here show",
        },
    ]);
    const [filteredData, setFilteredData] = useState(data);
    const [searchQuery, setSearchQuery] = useState("");
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };
    const debouncedSearch = useMemo(
        () =>
            debounce((query) => {
                const lowercasedFilter = query.toLowerCase();
                const filtered = data.filter(
                    (item) =>
                        item.name.toLowerCase().includes(lowercasedFilter) ||
                        item.price.toString().includes(lowercasedFilter) ||
                        item.type.toLowerCase().includes(lowercasedFilter)
                );
                setFilteredData(filtered);
            }, 300),
        [data]
    );

    const handleSearch = (text) => {
        setSearchQuery(text);
        debouncedSearch(text);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.inner}>
                    <View style={styles.inputbox}>
                        <TouchableOpacity onPress={() => navigation.navigate("search")}>
                            <Icon name="search" size={28} color="#000000" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Search for Apartments"
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                    <View>
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.Card}>
                                    <Text style={styles.price}>
                                        {"\u20B9"}
                                        {item.price}/DAY
                                    </Text>
                                    <Text style={styles.name}>{item.name}</Text>

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    ></View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Icon name="bed" size={18} color="#C5C5C5" />
                                        <Text style={styles.typetext}>{item.type}</Text>
                                        <Text style={styles.typetext}>
                                            {item.active ? "Active" : "Inactive"}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    inner: {
        flex: 1,
        paddingBottom: 20,
    },

    inputbox: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        width: "80%",
        marginLeft: 6,
    },
    Card: {
        padding: 16,
        backgroundColor: "#f8f9fa",
        margin: 10,
        borderRadius: 10,
        elevation: 1,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#3E904A",
    },
    name: {
        fontSize: 14,
        color: "#000000",
        fontWeight: "600",
    },
    comments: {
        fontSize: 10,
        color: "grey",
    },
    typetext: {
        marginVertical: 6,
        fontSize: 11,
        color: "grey",
        marginHorizontal: 6,
    },
});
