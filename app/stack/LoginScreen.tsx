import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "@/components/Button/Button";
import InputBar from "@/components/InputBar";
import { Formik, FormikHelpers } from "formik";
import ErrorHandler, { showTopMessage } from "../../utils/ErrorHandler";
import { colors } from "@/styles/colores";
import { useRouter } from "expo-router";
import useAuthStore from "@/hooks/useAuth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface LoginFormValues {
  usermail: string;
  password: string;
}

const initialFormValues: LoginFormValues = {
  usermail: "lopez@gmail.com",
  password: "12345678",
};

const LoginScreen: React.FC = () => {
  const { login, googleLogin, isLoading, error } = useAuthStore();
  const router = useRouter();
  
  // Configuración de Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "506155190530-u0agrso3i5dj6bqbtgvbms01uvc43pkl.apps.googleusercontent.com",
    androidClientId: "506155190530-v29v63b81gh5ghl7i2ho80tnsc6q2bmv.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.params.id_token;
    //   console.log('$$$$$$$$$$$$$$$$',idToken)
      googleLogin(idToken)
        .then(() => {
          showTopMessage("Google Login successful!", "success");
          router.replace("/profile");  // Redirigir a la página de perfil
        })
        .catch((err) => {
          showTopMessage(ErrorHandler(err.message), "danger");
        });
    }
  }, [response]);

  const handleFormSubmit = async (
    formValues: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      await login(formValues.usermail, formValues.password);
      showTopMessage("Login successful!", "success");
      router.replace("/"); // Redirigir a la página principal
    } catch (err: any) {
      showTopMessage(ErrorHandler(err.message), "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    promptAsync(); // Iniciar el flujo de autenticación con Google
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
                <Text style={styles.detail}>Forgot your password?</Text>
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
                  onPress={handleGoogleLogin}
                  loading={isLoading}
                  theme="blueaway"
                />
              </View>
              <View style={styles.button}>
                <Button
                  text="Register"
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
