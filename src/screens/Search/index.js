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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fetchApartment } from "../../endpoints/apartment.service";
import { useDispatch, useSelector } from "react-redux";
import { setApartments } from "../../store/actions";
import Header from "../../components/Header";

export default function Search() {
    const dispatch = useDispatch();
    const { apartments = [] } = useSelector(({ apartments }) => apartments);
    const [filteredData, setFilteredData] = useState(apartments);
    const [searchQuery, setSearchQuery] = useState("");
    const [loader, setLoader] = useState(false);
    const { navigate } = useNavigation();

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
    const handleApartmentPress = (item) => {
        navigate("apartmentDetails", {
            apartment: item,
        });
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Search Apartments" navigation="home" />
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
                                <TouchableOpacity onPress={() => handleApartmentPress(item)}>
                                    <View style={styles.propertyCard}>
                                        <View style={styles.propertyInfoRow}>
                                            <Text style={styles.name}>Name: {item.name}</Text>
                                            <Text style={styles.price}>
                                                Price: {"\u20B9"}
                                                {item.price}/DAY
                                            </Text>
                                        </View>
                                        <Text style={styles.typetext}>Type: {item.type}</Text>
                                        <Text
                                            style={[
                                                styles.typetext,
                                                {
                                                    color: item.active ? "#00FF00" : "#FF0000",
                                                },
                                            ]}
                                        >
                                            Status: {item.active ? "Active" : "Inactive"}
                                        </Text>
                                        <Text style={styles.comments}>{item.description}</Text>
                                    </View>
                                    {/* <View style={styles.card}>
                    <View style={styles.cardRow}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.price}>
                        {"\u20B9"}
                        {item.price}/DAY
                      </Text>
                    </View>
                    <View>
                      <Icon name="bed" size={18} color="#C5C5C5" />
                      <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    <Text style={styles.status}>
                      {item.active ? "Active" : "Inactive"}
                    </Text>
                  </View> */}
                                </TouchableOpacity>
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
    propertyCard: {
        padding: 14,
        backgroundColor: "#FFFFFF",
        borderColor: "#E9EAEC",
        borderWidth: 1,
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
        fontSize: 14,
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
        marginVertical: 2,
        fontSize: 14,
        color: "#808080",
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginHorizontal: 5,
        elevation: 2,
    },
});
