import React, { useState, useRef } from "react";
import {
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    View,
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
import { Eye, EyeOff } from "react-native-feather";
import { userLogout, userLogin } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../endpoints/auth";

export default function Signup() {
    const form = useRef(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [focus, setFocus] = useState(false);
    const [loader, setLoader] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const [initialValue, setInitialValue] = useState({
        username: "",
        email: "",
        password: "",
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
                FlashAlert({
                    title: error?.message,
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
                                <Pressable onPress={() => navigation.navigate("Login")}>
                                    <Text style={styles.paraHighlighted}>
                                        Already have account?
                                    </Text>
                                </Pressable>
                            </Text>
                        </View>
                        <Formik
                            innerRef={form}
                            initialValues={initialValue}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().required("Username is required."),
                                email: Yup.string()
                                    .email("Invalid email")
                                    .required("Email is required."),
                                password: Yup.string()
                                    .min(6, "Password must be at least 6 characters")
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
                                            placeholder="UserName"
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
                                        <View style={{ position: "relative" }}>
                                            <View
                                                style={{
                                                    marginBottom: 8,
                                                    marginTop: 10,
                                                    backgroundColor: focus
                                                        ? "rgba(0,102,255,0.08)"
                                                        : touched.password && errors.password
                                                            ? "rgba(241,84,63,0.12)"
                                                            : colors.light,
                                                    padding: Platform.OS === "ios" ? 14 : 8,
                                                    borderRadius: 8,
                                                    borderWidth: 0.5,
                                                    borderColor: focus
                                                        ? colors.primary
                                                        : touched.password && errors.password
                                                            ? "rgba(241,84,63,0.9)"
                                                            : colors.light,
                                                }}
                                            >
                                                <TextInput
                                                    value={values.password}
                                                    onChangeText={handleChange("password")}
                                                    placeholder="Password"
                                                    placeholderTextColor={colors.disabled}
                                                    selectionColor={colors.primary}
                                                    secureTextEntry={secureTextEntry}
                                                    onFocus={() => {
                                                        setFocus(true);
                                                    }}
                                                    onBlur={() => {
                                                        setFieldTouched("password");
                                                        setFocus(false);
                                                    }}
                                                    style={{
                                                        padding: 0,
                                                        fontSize: 14,
                                                        flex: 1,
                                                        color: colors.black,
                                                    }}
                                                />
                                                <Pressable
                                                    style={{
                                                        position: "absolute",
                                                        right: 20,
                                                        bottom: 14,
                                                    }}
                                                    onPress={() => {
                                                        setSecureTextEntry(!secureTextEntry);
                                                    }}
                                                >
                                                    {secureTextEntry ? (
                                                        <EyeOff
                                                            stroke={colors.disabled}
                                                            fill="none"
                                                            width={18}
                                                            height={18}
                                                        />
                                                    ) : (
                                                        <Eye
                                                            stroke={colors.disabled}
                                                            fill="none"
                                                            width={18}
                                                            height={18}
                                                        />
                                                    )}
                                                </Pressable>
                                            </View>
                                            {touched.password && errors.password && (
                                                <Text
                                                    style={{
                                                        fontSize: 10,
                                                        position: "absolute",
                                                        top: 58,
                                                        left: 4,
                                                        color: colors.danger,
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {touched.password && errors.password}
                                                </Text>
                                            )}
                                        </View>
                                        <CustomInput
                                            value={values.confirmPassword}
                                            onChangeText={handleChange("confirmPassword")}
                                            onBlur={() => setFieldTouched("confirmPassword")}
                                            placeholder="Confirm Password"
                                            autoCapitalize="none"
                                            error={touched.confirmPassword && errors.confirmPassword}
                                            errorMessage={
                                                touched.confirmPassword && errors.confirmPassword
                                            }
                                        />
                                        <View
                                            style={{
                                                width: "100%",
                                                alignItems: "center",
                                                marginTop: 40,
                                            }}
                                        >
                                            <Button
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
