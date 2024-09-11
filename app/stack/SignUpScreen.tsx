import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import Button from "@/components/Button/Button";
import InputBar from "@/components/InputBar";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { Formik, FormikHelpers } from "formik";
import ErrorHandler, { showTopMessage } from "@/utils/ErrorHandler";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";

interface SignUpFormValues {
    usermail: string;
    password: string;
    passwordre: string;
}

const initialFormValues: SignUpFormValues = {
    usermail: "",
    password: "",
    passwordre: "",
};

const SignUpScreen: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { token } = useAuth(); // use getToken from the hook

    const handleFormSubmit = async (
        formValues: SignUpFormValues,
        { setSubmitting }: FormikHelpers<SignUpFormValues>
    ) => {
        const auth = getAuth(app);

        setLoading(true);

        if (!formValues.usermail || !formValues.password || !formValues.passwordre) {
            showTopMessage("Please complete all fields.", "warning");
            setLoading(false);
            setSubmitting(false);
            return;
        }

        if (formValues.password !== formValues.passwordre) {
            showTopMessage("Passwords do not match, please try again!", "warning");
            setLoading(false);
            setSubmitting(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formValues.usermail, formValues.password);
            const user = userCredential.user;
            const token = await user.getIdToken(); // Ensure you get the token after registration
            showTopMessage("Registration successful!", "success");

            // Optionally use getToken here if needed
            const storedToken = token
            console.log("Stored Token:", storedToken);

            router.replace('/stack/LoginScreen');
        } catch (err: any) {
            showTopMessage(ErrorHandler(err.code), "danger");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.text}>Regístrate</Text>
                <Formik initialValues={initialFormValues} onSubmit={handleFormSubmit}>
                    {({ values, handleChange, handleSubmit }) => (
                        <>
                            <View style={styles.input_container}>
                                <InputBar
                                    onType={handleChange("usermail")}
                                    value={values.usermail}
                                    placeholder="Email"
                                />
                                <InputBar
                                    onType={handleChange("password")}
                                    value={values.password}
                                    placeholder="Password"
                                    isSecure
                                />
                                <InputBar
                                    onType={handleChange("passwordre")}
                                    value={values.passwordre}
                                    placeholder="Sub-Password"
                                    isSecure
                                />
                            </View>
                            <View style={styles.button_container}>
                                <Button
                                    text="Register"
                                    onPress={handleSubmit}
                                    loading={loading}
                                />
                            </View>
                        </>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 16,
    },
    text: {
        fontSize: 30,
        fontFamily: "Mulish-Medium",
        marginBottom: 32,
        textAlign: "center",
    },
    input_container: {
        marginBottom: 24,
    },
    button_container: {
        marginTop: 16,
    },
});

export default SignUpScreen;
