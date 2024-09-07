import {create} from 'zustand';
import { child, get, ref, remove } from "firebase/database";
import { getDatabase } from "firebase/database";
import { showTopMessage } from "../utils/ErrorHandler";
import { sortAppointmentsByDateAndTime } from "@/utils/calendarUtils";
import { handleNotification } from "../utils/NotificationService";
import parseContentData from "@/utils/parseContentData";

interface Appointment {
    id: string;
    serviceId: string;
    serviceInfo?: any;
    [key: string]: any;
}

interface CalendarState {
    appointmentList: Appointment[];
    loading: boolean;
    fetchAppointments: (uid: string) => Promise<void>;
    removeAppointment: (uid: string, appointmentId: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
    appointmentList: [],
    loading: true,
    fetchAppointments: async (uid) => {
        set({ loading: true });
        const dbRef = ref(getDatabase());

        try {
            const snapshot = await get(child(dbRef, `userAppointments/${uid}`));
            if (snapshot.exists()) {
                const data = parseContentData(snapshot.val());

                const servicePromises = data.map((appointment: Appointment) =>
                    fetchServiceInfo(appointment.serviceId)
                );

                const serviceInfos = await Promise.all(servicePromises);

                const appointmentList = data.map((appointment: Appointment, index: number) => ({
                    ...appointment,
                    serviceInfo: serviceInfos[index],
                }));

                set({
                    appointmentList: sortAppointmentsByDateAndTime(appointmentList),
                    loading: false,
                });
            } else {
                set({ appointmentList: [], loading: false });
            }
        } catch (error) {
            console.error(error);
            set({ loading: false });
        }
    },
    removeAppointment: async (uid, appointmentId) => {
        const appointmentsRef = ref(getDatabase(), `userAppointments/${uid}/${appointmentId}`);
        try {
            await remove(appointmentsRef);
            showTopMessage("Appointment Deleted!", "success");
            handleNotification("Appointment Cancellation", "Your appointment has been cancelled.");
            
            await useCalendarStore.getState().fetchAppointments(uid);

        } catch (error) {
            showTopMessage("There was an error trying to delete the appointment!", "info");
        }
    },
}));

async function fetchServiceInfo(id: string) {
    const dbRef = ref(getDatabase(), `services/${id}`);
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val();
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}
