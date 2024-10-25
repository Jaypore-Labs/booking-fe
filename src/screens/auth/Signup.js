import React, { useState, useRef } from "react";
import {
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Platform,
    Pressable,
} from "react-native";
import { Formik } from "formik";
import Header from "../../components/Header";
import CustomInput from "../../components/Input";
import Button from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";
import styles from "./styles";
import colors from "../../config/colors";
import { userLogout, userLogin } from "../../store/actions";
import { useDispatch } from "react-redux";
import { registerUser } from "../../endpoints/auth";
import { FlashAlert } from "../../components/FlashAlert";

export default function Signup() {
    const form = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [focus, setFocus] = useState(false);
    const [loader, setLoader] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

    const [initialValue, setInitialValue] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const clearStore = () => {
        dispatch(userLogout());
    };

    const register = async (values) => {
        setLoader(true);
        registerUser({
            name: values.username,
            email: values.email,
            password: values.password,
            role: "admin",
        })
            .then(async (res) => {
                if (res) {
                    clearStore();
                    dispatch(userLogin({ user: res?.user, tokens: res.tokens }));
                    await AsyncStorage.setItem("access_token", res.tokens.access.token);
                    await AsyncStorage.setItem("refresh_token", res.tokens.refresh.token);
                    navigation.navigate("Login");
                }
            })
            .catch((error) => {
                console.log(error);
                FlashAlert({
                    title: error?.message || "Registration failed",
                    notIcon: true,
                    duration: 1500,
                    error: true,
                });
            })
            .finally(() => {
                setLoader(false);
            });
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={styles.wrapper}>
                    <Header />
                    <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
                        <Text style={styles.heading}>Create Account</Text>
                        <View style={{ width: "78%", marginBottom: 30 }}>
                            <Text style={styles.para}>
                                Enter your details below for sign up
                                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                    <Text
                                        style={[
                                            styles.paraHighlighted,
                                            {
                                                textDecorationLine: "underline",
                                                color: colors.primary,
                                            },
                                        ]}
                                    >
                                        Already have account?
                                    </Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                        <Formik
                            innerRef={form}
                            initialValues={initialValue}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().required("Full Name is required."),
                                email: Yup.string()
                                    .email("Invalid email")
                                    .required("Email is required."),
                                password: Yup.string()
                                    .min(8, "Password must be at least 8 characters")
                                    .required("Password is required."),
                                confirmPassword: Yup.string()
                                    .oneOf([Yup.ref("password"), null], "Passwords must match")
                                    .required("Confirm password is required."),
                            })}
                            onSubmit={register}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleSubmit,
                                setFieldTouched,
                            }) => {
                                return (
                                    <>
                                        <CustomInput
                                            autoFocus={true}
                                            value={values.name}
                                            onChangeText={handleChange("username")}
                                            onBlur={() => setFieldTouched("username")}
                                            placeholder="Full Name"
                                            autoCapitalize="none"
                                            error={touched.name && errors.name}
                                            errorMessage={touched.name && errors.name}
                                        />

                                        <CustomInput
                                            value={values.email}
                                            onChangeText={handleChange("email")}
                                            onBlur={() => setFieldTouched("email")}
                                            placeholder="Email Address"
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            autoComplete="email"
                                            error={touched.email && errors.email}
                                            errorMessage={touched.email && errors.email}
                                        />

                                        <CustomInput
                                            value={values.password}
                                            onChangeText={handleChange("password")}
                                            onBlur={() => setFieldTouched("password")}
                                            placeholder="Password"
                                            autoCapitalize="none"
                                            secureTextEntry={secureTextEntry}
                                            toggleSecureEntry={() =>
                                                setSecureTextEntry(!secureTextEntry)
                                            }
                                            error={touched.password && errors.password}
                                            errorMessage={touched.password && errors.password}
                                        />

                                        <CustomInput
                                            value={values.confirmPassword}
                                            onChangeText={handleChange("confirmPassword")}
                                            onBlur={() => setFieldTouched("confirmPassword")}
                                            placeholder="Confirm Password"
                                            autoCapitalize="none"
                                            secureTextEntry={confirmSecureTextEntry}
                                            toggleSecureEntry={() =>
                                                setConfirmSecureTextEntry(!confirmSecureTextEntry)
                                            }
                                            error={touched.confirmPassword && errors.confirmPassword}
                                            errorMessage={
                                                touched.confirmPassword && errors.confirmPassword
                                            }
                                        />
                                        <View
                                            style={{
                                                width: "100%",
                                                alignItems: "center",
                                                marginTop: 20,
                                            }}
                                        >
                                            <Button
                                                loader={loader}
                                                disabled={loader}
                                                onPress={() => handleSubmit()}
                                                title="Sign up"
                                            />
                                        </View>
                                    </>
                                );
                            }}
                        </Formik>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
