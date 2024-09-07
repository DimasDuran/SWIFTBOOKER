import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/Button/Button";
import InputBar from "@/components/InputBar";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { Formik, FormikHelpers } from "formik";
import ErrorHandler, { showTopMessage } from "../../utils/ErrorHandler";
import { colors } from "@/styles/colores";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth"; 

interface LoginFormValues {
    usermail: string;
    password: string;
}

const initialFormValues: LoginFormValues = {
    usermail: "lopez@gmail.com",
    password: "12345678",
};

const LoginScreen: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { user, token, getToken } = useAuth(); 
    const router = useRouter();

    const handleFormSubmit = async (
        formValues: LoginFormValues,
        { setSubmitting }: FormikHelpers<LoginFormValues>
    ) => {
        const auth = getAuth(app);
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formValues.usermail,
                formValues.password
            );
            showTopMessage("Login successful!", "success");
            router.replace("/profile");
        } catch (err: any) {
            showTopMessage(ErrorHandler(err.code), "danger");
        } finally {
            setLoading(false);
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
                                    text="Iniciar Sesión"
                                    onPress={handleSubmit} 
                                    loading={loading}
                                />
                            </View>
                            <View style={styles.button}>
                                <Button
                                    text="Registrarse"
                                    loading={null}
                                    onPress={goToMemberSignUp}
                                    theme="secondary"
                                />
                            </View>
                        </View>
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
