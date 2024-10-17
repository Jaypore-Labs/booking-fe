import React, { useState, useMemo, useCallback } from "react";
import {
    SafeAreaView,
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
import { fetchApartment } from "../../endpoints/apartment.service";
import { useDispatch, useSelector } from "react-redux";
import { setApartments } from "../../store/actions";

export default function Search() {
    const dispatch = useDispatch();
    const { apartments = [] } = useSelector(({ apartments }) => apartments);
    const [filteredData, setFilteredData] = useState(apartments);
    const [searchQuery, setSearchQuery] = useState("");
    const [loader, setLoader] = useState(false);

    React.useEffect(() => {
        _fetchApartment();
    }, []);

    // React.useEffect(() => {
    //     setFilteredData(apartments);
    // }, [apartments]);

    const _fetchApartment = useCallback(async () => {
        setLoader(true);
        try {
            const res = await fetchApartment();
            if (res) {
                const uniqueApartments = [
                    ...new Map(res?.results.map((item) => [item.id, item])).values(),
                ];
                dispatch(setApartments(uniqueApartments));
                setFilteredData(uniqueApartments);
            }
        } catch (e) {
            FlashAlert({
                title: e?.message || "Something went wrong. Try again later.",
                notIcon: true,
                duration: 1500,
                error: true,
            });
        } finally {
            setLoader(false);
        }
    }, [dispatch]);

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
                const filtered = apartments.filter(
                    (item) =>
                        item.name.toLowerCase().includes(lowercasedFilter) ||
                        item.price.toString().includes(lowercasedFilter) ||
                        item.type.toLowerCase().includes(lowercasedFilter)
                );
                setFilteredData(filtered);
            }, 300),
        [apartments]
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
                    <View style={styles.inputBox}>
                        <TouchableOpacity onPress={() => navigation.navigate("search")}>
                            <Icon name="search" size={28} color="#000" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Search for Apartments"
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                    {filteredData.length === 0 ? (
                        <Text style={styles.noDataText}>No apartments available</Text>
                    ) : (
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <Text style={styles.price}>
                                        {"\u20B9"}
                                        {item.price}/DAY
                                    </Text>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <View style={styles.cardRow}>
                                        <Icon name="bed" size={18} color="#C5C5C5" />
                                        <Text style={styles.typeText}>{item.type}</Text>
                                        <Text style={styles.status}>
                                            {item.active ? "Active" : "Inactive"}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}
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
    container: {
        flex: 1,
        padding: 16,
    },
    inner: {
        flex: 1,
        paddingBottom: 20,
    },
    inputBox: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        width: "80%",
        marginLeft: 6,
    },
    noDataText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    card: {
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
        color: "#000",
        fontWeight: "600",
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginVertical: 6,
    },
    typeText: {
        fontSize: 11,
        color: "grey",
        marginHorizontal: 6,
    },
    status: {
        fontSize: 11,
        color: "grey",
        marginHorizontal: 6,
    },
});
