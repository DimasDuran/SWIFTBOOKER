export const loadNotifications = (appointmentList: any[], setIsReady: (value: boolean) => void, setCount: (value: number) => void) => {
    setTimeout(() => {
        setIsReady(true); // Cambiar el estado a listo después de 2 segundos
        setCount(appointmentList.length); // Actualizar el conteo de notificaciones
    }, 2000);
};
