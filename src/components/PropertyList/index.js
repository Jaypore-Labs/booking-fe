import React, { useState, useCallback } from "react";
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import Button from "../Button";
import { FlashAlert } from "../FlashAlert";
import {
    fetchApartment,
    deleteApartment,
} from "../../endpoints/apartment.service";
import { useDispatch, useSelector } from "react-redux";
import { setApartments } from "../../store/actions/apartment";
import colors from "../../config/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import Header from "../Header";

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
                    const uniqueApartments = [
                        ...new Map(res?.results.map((item) => [item.id, item])).values(),
                    ];
                    dispatch(setApartments(uniqueApartments));
                    // dispatch(setApartments([...apartments, ...res?.results]));
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
            const updatedApartments = apartments.filter(
                (apartment) => apartment.id !== id
            );
            dispatch(setApartments(updatedApartments));
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
            <Header title="Properties" />
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
                                <Text style={styles.name}>Name: {item.name}</Text>
                                <Text style={styles.price}>
                                    Price: {"\u20AC"} {item.price}/DAY
                                </Text>
                            </View>
                            <Text style={styles.typetext}>Type: {item.type}</Text>
                            <Text
                                style={[
                                    styles.typetext,
                                    {
                                        color: item.isActive ? "#3E904A" : "#FF0000",
                                    },
                                ]}
                            >
                                Status: {item.isActive ? "Active" : "Inactive"}
                            </Text>
                            <Text style={styles.comments}>{item.description}</Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.button, styles.editButton]}
                                    onPress={() => updateApartment(item)}
                                >
                                    <Icon
                                        name="edit"
                                        size={16}
                                        color="#fff"
                                        style={styles.icon}
                                    />
                                    <Text style={styles.text}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => _deleteApartment(item.id)}
                                >
                                    <Icon
                                        name="delete"
                                        size={16}
                                        color="#fff"
                                        style={styles.icon}
                                    />
                                    <Text style={styles.text}>Delete</Text>
                                </TouchableOpacity>
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
        // marginTop: 4,
    },
    addButton: {
        backgroundColor: colors.primary,
    },
    container: {
        flex: 1,
        padding: 18,
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
    icon: {
        marginRight: 6,
    },
    editButton: {
        backgroundColor: colors.primary,
    },
    deleteButton: {
        backgroundColor: "#808080",
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
