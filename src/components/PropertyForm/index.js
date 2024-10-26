import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Switch,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "../Button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../Header";
import {
    createApartment,
    updateApartment,
} from "../../endpoints/apartment.service";
import { setApartments } from "../../store/actions";
import { FlashAlert } from "../../components/FlashAlert";
import colors from "../../config/colors";

export default function PropertyForm() {
    const navigation = useNavigation();
    const { apartments } = useSelector(({ apartments }) => apartments);
    const route = useRoute();
    const dispatch = useDispatch();
    const { apartment } = route.params || {};
    const [loader, setLoader] = useState(false);
    const [isActive, setIsActive] = useState(
        apartment ? apartment.isActive : true
    );

    const _createApartment = async (values) => {
        setLoader(true);
        createApartment({
            name: values.name,
            price: Number(values.price),
            type: values.type,
            isActive: isActive,
            description: values.comments,
        })
            .then((res) => {
                if (res) {
                    dispatch(setApartments([res, ...apartments]));
                    navigation.navigate("PropertyList");
                    FlashAlert({
                        title: "Apartment created successfully",
                        notIcon: true,
                        duration: 1500,
                    });
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

    const _updateApartment = async (values) => {
        setLoader(true);
        updateApartment(apartment.id, {
            name: values.name,
            price: Number(values.price),
            type: values.type,
            isActive: isActive,
            description: values.comments,
        })
            .then((res) => {
                if (res) {
                    const updatedApartments = apartments.map((item) =>
                        item.id === res.id ? res : item
                    );
                    dispatch(setApartments(updatedApartments));
                    navigation.navigate("PropertyList");
                    FlashAlert({ title: "Apartment updated successfully" });
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
        <SafeAreaView style={{ flex: 1 }}>
            <Header title="Property Form" />
            <ScrollView contentContainerStyle={styles.container}>
                <Formik
                    initialValues={{
                        name: apartment ? apartment.name : "",
                        price: apartment ? apartment.price : "",
                        type: apartment ? apartment.type : "studio",
                        comments: apartment ? apartment.comments : "",
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required("Property name is required"),
                        price: Yup.number()
                            .required("Price is required")
                            .typeError("Price must be a number"),
                        type: Yup.string().required("Property type is required"),
                        comments: Yup.string().max(
                            50,
                            "Comments must be less than 50 characters"
                        ),
                    })}
                    onSubmit={apartment ? _updateApartment : _createApartment}
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
                            <Text style={styles.labeltext}>Property Name</Text>
                            <TextInput
                                value={values.name}
                                onChangeText={handleChange("name")}
                                onBlur={handleBlur("name")}
                                style={[
                                    styles.input,
                                    touched.name && errors.name ? styles.inputError : {},
                                ]}
                                placeholder="Enter property name"
                                placeholderTextColor="#aaa"
                            />
                            {touched.name && errors.name && (
                                <Text style={styles.error}>{errors.name}</Text>
                            )}

                            <Text style={styles.labeltext}>Price</Text>
                            <TextInput
                                value={values.price}
                                onChangeText={handleChange("price")}
                                onBlur={handleBlur("price")}
                                style={[
                                    styles.input,
                                    touched.price && errors.price ? styles.inputError : {},
                                ]}
                                placeholder="Enter price"
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                            {touched.price && errors.price && (
                                <Text style={styles.error}>{errors.price}</Text>
                            )}

                            <Text style={styles.labeltext}>Type</Text>
                            <Picker
                                selectedValue={values.type}
                                onValueChange={handleChange("type")}
                                style={styles.input}
                            >
                                <Picker.Item label="Studio" value="studio" />
                                <Picker.Item label="1 Bed" value="1bed" />
                                <Picker.Item label="2 Bed" value="2bed" />
                            </Picker>
                            {touched.type && errors.type && (
                                <Text style={styles.error}>{errors.type}</Text>
                            )}

                            <Text style={styles.labeltext}>Comments</Text>
                            <TextInput
                                value={values.comments}
                                onChangeText={handleChange("comments")}
                                onBlur={handleBlur("comments")}
                                style={[
                                    styles.input,
                                    touched.comments && errors.comments ? styles.inputError : {},
                                    styles.textArea,
                                ]}
                                placeholder="Add additional details (optional)"
                                placeholderTextColor="#aaa"
                                multiline
                            />
                            {touched.comments && errors.comments && (
                                <Text style={styles.error}>{errors.comments}</Text>
                            )}

                            <View style={styles.switchContainer}>
                                <Text style={styles.labeltext}>Active</Text>
                                <Switch
                                    value={isActive}
                                    onValueChange={setIsActive}
                                    trackColor={{ false: "#D9DBDC", true: "#7b68ee" }}
                                    thumbColor={isActive ? "#ffffff" : "#f4f3f4"}
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Save"
                                    loader={loader}
                                    onPress={() => handleSubmit()}
                                    disabled={loader}
                                    style={{ width: "100%" }}
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f5f5f5",
        flexGrow: 1,
        justifyContent: "center",
    },
    form: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    form: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#dcdcdc",
    },
    labeltext: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#D9DBDC",
        padding: 12,
        fontSize: 14,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#fafafa",
    },
    inputError: {
        borderColor: "red",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 6,
        backgroundColor: "#7b68ee",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginBottom: 8,
    },
});
