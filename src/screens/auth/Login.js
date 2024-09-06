import React, { useState, useRef } from "react";
import {
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Pressable,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./styles";
import colors from "../../config/colors";
import Header from "../../components/Header";
import CustomInput from "../../components/Input";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { Eye, EyeOff } from "react-native-feather";
import { FlashAlert } from "../../components/FlashAlert";
import { useDispatch } from "react-redux";
import { userLogin, userLogout } from "../../store/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../../endpoints/auth";

export default function Login() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const formikRef = useRef(null);
    const [loader, setLoader] = useState(false);
    const [focus, setFocus] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const clearStore = () => {
        dispatch(userLogout());
    };

    const _loginUser = async (value) => {
        try {
            setLoader(true);
            const res = await loginUser({
                email: value.email,
                password: value.password,
            });
            if (res) {
                clearStore();
                AsyncStorage.setItem(
                    "login_creds",
                    JSON.stringify({
                        email: value.email,
                        password: value.password,
                    })
                );
                AsyncStorage.setItem("access_token", res.tokens.access.token);
                AsyncStorage.setItem("refresh_token", res.tokens.refresh.token);
                dispatch(userLogin({ user: res.user, tokens: res.tokens }));
                navigation.navigate("home");
            }
        } catch (error) {
            FlashAlert({
                title: error?.message,
                notIcon: true,
                duration: 1500,
                error: true,
            });
        } finally {
            setLoader(false);
        }
    };

    const restoreCreds = async () => {
        let login_cred = await AsyncStorage.getItem("login_creds");
        if (login_cred && formikRef.current) {
            login_cred = JSON.parse(login_cred);
            formikRef.current.setFieldValue("email", login_cred.email);
            formikRef.current.setFieldValue("password", login_cred.password);
        }
    };

    React.useEffect(() => {
        restoreCreds();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={styles.wrapper}>
                    {/* <Header navigation={() => navigation.navigate("onboarding")} /> */}
                    <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
                        <Text style={styles.heading}>Welcome to EasyBookings</Text>
                        <View style={{ width: "78%", marginBottom: 30 }}>
                            <Text>Log in via Email </Text>
                        </View>
                        <Formik
                            innerRef={formikRef}
                            initialValues={{
                                email: "",
                                password: "",
                            }}
                            validationSchema={Yup.object().shape({
                                email: Yup.string().email().required("Your email is required."),
                                password: Yup.string().required("A password is required."),
                            })}
                            onSubmit={(values) => {
                                _loginUser(values);
                            }}
                        >
                            {({
                                values,
                                errors,
                                handleChange,
                                handleSubmit,
                                setFieldTouched,
                                touched,
                            }) => {
                                return (
                                    <>
                                        <CustomInput
                                            value={values.email}
                                            onChangeText={handleChange("email")}
                                            onBlur={() => setFieldTouched("email")}
                                            placeholder="Email Address"
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            autoComplete="email"
                                            autoCorrect={false}
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
                                                    }}
                                                >
                                                    {touched.password && errors.password}
                                                </Text>
                                            )}
                                        </View>
                                        <View
                                            style={{
                                                width: "100%",
                                                alignItems: "center",
                                                marginTop: 20,
                                            }}
                                        >
                                            <Button onPress={() => handleSubmit()} title="Sign in" />
                                        </View>
                                    </>
                                );
                            }}
                        </Formik>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    backgroundColor: colors.lightDisabled,
                                    width: "100%",
                                    justifyContent: "space-around",
                                    marginTop: 10,
                                    padding: 13,
                                    borderRadius: 8,
                                }}
                                onPress={() => navigation.navigate("signup")}
                            >
                                <Text
                                    style={{
                                        alignItems: "center",
                                        marginTop: 2,
                                        fontWeight: "600",
                                        flex: 5,
                                        textAlign: "center",
                                        color: colors.primary,
                                    }}
                                >
                                    Create Account with Email
                                </Text>
                                <View
                                    style={{
                                        flex: 0.5,
                                    }}
                                ></View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
