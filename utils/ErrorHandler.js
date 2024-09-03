import { showMessage } from "react-native-flash-message";

export default function (errorCode) {
    switch (errorCode) {
        case "auth/invalid-email":
            return "Correo electrónico inválido";

        case "auth/email-already-in-use":
            return "El usuario ya está registrado";

        case "auth/user-not-found":
            return "Usuario no encontrado";

        case "auth/wrong-password":
            return "Contraseña incorrecta";

        case "auth/weak-password":
            return "La contraseña es muy débil";

        case "auth/admin-restricted-operation":
            return "El formulario no puede estar vacío";

        case "auth/missing-password":
            return "La contraseña no puede estar vacía";

        case "auth/missing-email":
            return "El correo electrónico no puede estar vacío";
            
        default:
            return errorCode;
    }
}

export function showTopMessage(messageText, messageType) {
    showMessage({
        message: messageText,
        type: messageType,
    });
}
