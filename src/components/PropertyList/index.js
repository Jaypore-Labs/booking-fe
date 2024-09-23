import React, { useState, useCallback } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    Pressable,
} from "react-native";
import Button from "../Button";
import { FlashAlert } from "../FlashAlert";
import {
    fetchApartment,
    deleteApartment,
} from "../../endpoints/apartment.service";
import { useDispatch, useSelector } from "react-redux";
import { setApartments } from "../../store/actions/apartment";

export default function PropertiesList({ navigation }) {
    const dispatch = useDispatch();
    const { apartments } = useSelector(({ apartments }) => apartments);
    const [loader, setLoader] = useState(false);

    React.useEffect(() => {
        _fetchApartment();
    }, []);

    const _fetchApartment = useCallback(async () => {
        setLoader(true);
        await fetchApartment()
            .then((res) => {
                if (res) {
                    dispatch(setApartments([...apartments, ...res?.results]));
                }
            })
            .catch((e) => {
                FlashAlert({
                    title: e?.message || "Something went wrong. Try again later.",
                    notIcon: true,
                    duration: 1500,
                    error: true,
                });
            })
            .finally(() => {
                setLoader(false);
            });
    }, [apartments]);

    const updateApartment = (item) => {
        navigation.navigate("PropertyForm", { apartment: item });
    };

    const _deleteApartment = async (id) => {
        try {
            await deleteApartment(id);
            FlashAlert({
                title: "Apartment deleted successfully",
                duration: 1500,
                error: false,
            });
            _fetchApartment();
        } catch (error) {
            FlashAlert({
                title: error.message || "Error deleting Apartment",
                error: true,
            });
        }
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
                    data={apartments}
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
                                    onPress={() => updateApartment(item)}
                                >
                                    <Text style={styles.text}>EDIT</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => _deleteApartment(item.id)}
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
