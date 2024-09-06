import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import styles from './styles';
import Header from "../../components/Header";
import CustomInput from "../../components/Input";
import Button from "../../components/Button";
import { useNavigation } from '@react-navigation/native';
import colors from '../../config/colors';
import * as yup from 'yup';
import { Formik } from 'formik';
import { forgotPassword } from '../../endpoints/auth';
import { FlashAlert } from '../../components/FlashAlert';
import { useState } from 'react';

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);

    const _forgotPassword = async (values) => {
        try {
            setLoader(true);
            const res = await forgotPassword({
                email: values.email,
            });
            if (res) {
                FlashAlert({
                    title: res?.message,
                    notIcon: true,
                    duration: 1500,
                });
                navigation.goBack();
            }
        } catch (e) {
            FlashAlert({
                title: e?.message,
                notIcon: true,
                duration: 1500,
                error: true,
            });
        } finally {
            setLoader(false);
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View style={styles.wrapper}>
                    <Header />
                    <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
                        <View
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 40,
                                marginBottom: 20,
                            }}
                        >
                            <Text style={[styles.heading, { textAlign: 'center', fontSize: 24 }]}>
                                Reset Your Password
                            </Text>
                            <Text style={[styles.para, { textAlign: 'center' }]}>
                                Enter your email address to retrieve your password
                            </Text>
                        </View>
                        <Formik
                            initialValues={{
                                email: '',
                            }}
                            validationSchema={yup.object().shape({
                                email: yup.string().email().required('Your email is required.'),
                            })}
                            onSubmit={(values) => {
                                _forgotPassword(values);
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleSubmit, setFieldTouched }) => {
                                return (
                                    <>
                                        <CustomInput
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            placeholder="Email Address"
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            autoComplete="email"
                                            autoCorrect={false}
                                            onBlur={() => setFieldTouched('email')}
                                            error={touched.email && errors.email}
                                            errorMessage={errors.email}
                                        />
                                        <View
                                            style={{
                                                width: '100%',
                                                alignItems: 'center',
                                                marginTop: 30,
                                            }}
                                        >
                                            <Button
                                                disabled={loader && errors.email}
                                                loader={loader}
                                                onPress={() => handleSubmit()}
                                                title="Submit"
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
};
export default ForgotPassword;
