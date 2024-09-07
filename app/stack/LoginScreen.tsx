import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/Button/Button";
import InputBar from "@/components/InputBar";
import { Formik, FormikHelpers } from "formik";
import ErrorHandler, { showTopMessage } from "../../utils/ErrorHandler";
import { colors } from "@/styles/colores";
import { useRouter } from "expo-router";
import useAuthStore from "@/hooks/useAuth";

interface LoginFormValues {
    usermail: string;
    password: string;
}

const initialFormValues: LoginFormValues = {
    usermail: "lopez@gmail.com",
    password: "12345678",
};

const LoginScreen: React.FC = () => {
    const { login, isLoading, error } = useAuthStore(); 
    const router = useRouter();
    const handleFormSubmit = async (
        formValues: LoginFormValues,
        { setSubmitting }: FormikHelpers<LoginFormValues>
    ) => {
        try {
            await login(formValues.usermail, formValues.password);
            showTopMessage("Login successful!", "success");
            router.replace("/profile");
        } catch (err: any) {
            showTopMessage(ErrorHandler(err.code), "danger");
        } finally {
            setSubmitting(false);
        }
    };

    const goToMemberSignUp = () => {
        router.push("/stack/SignUpScreen");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Iniciar Sesión</Text>
            <Formik
                initialValues={initialFormValues}
                onSubmit={handleFormSubmit}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <>
                        <View style={styles.input_container}>
                            <InputBar
                                onType={handleChange("usermail")}
                                value={values.usermail}
                                placeholder={"Correo electrónico"}
                            />
                            <InputBar
                                onType={handleChange("password")}
                                value={values.password}
                                placeholder={"Contraseña"}
                                isSecure
                            />
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.detail}>
                                    Forgot your password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.button_container}>
                            <View style={styles.button}>
                                <Button
                                    text="Log In"
                                    onPress={handleSubmit}
                                    loading={isLoading} 
                                />
                            </View>
                            <View style={styles.button}>
                                <Button
                                    text="Log in with Google"
                                    loading={null}
                                    onPress={goToMemberSignUp}
                                    theme="blueaway"
                                />
                            </View>
                            <View style={styles.button}>
                                <Button
                                    text="Register"
                                    loading={null}
                                    onPress={goToMemberSignUp}
                                    theme="secondary"
                                />
                            </View>
                           
                        </View>
                        {error && <Text style={{ color: 'red' }}>{error}</Text>}
                    </>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        marginTop: 48,
        paddingHorizontal: 24,
    },
    text: {
        marginVertical: 32,
        fontSize: 30,
        fontFamily: "Mulish-Medium",
    },
    detail: {
        fontSize: 14,
        fontFamily: "Mulish-Medium",
        color: colors.color_gray,
    },
    button_container: {
        paddingVertical: 8,
    },
    button: {
        paddingVertical: 8,
        flexDirection: "row",
    },
    input_container: {
        marginBottom: 16,
    },
});

export default LoginScreen;
