import {create} from 'zustand';

interface Appointment {
    serviceId: string;
    bookedDate: string;
    bookedTime: string;
    appType: string;
}

interface ServiceStore {
    loading: boolean;
    selectedDate: string | null;
    selectedTime: string | null;
    timeList: any[];
    serviceTimeList: any[];
    bookedApps: Appointment[];
    setLoading: (loading: boolean) => void;
    setSelectedDate: (date: string | null) => void;
    setSelectedTime: (time: string | null) => void;
    setTimeList: (list: any[]) => void;
    setServiceTimeList: (list: any[]) => void;
    setBookedApps: (appointments: Appointment[]) => void;
}

export const useServiceStoreBooking = create<ServiceStore>((set) => ({
    loading: true,
    selectedDate: null,
    selectedTime: null,
    timeList: [],
    serviceTimeList: [],
    bookedApps: [],
    setLoading: (loading) => set({ loading }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setSelectedTime: (time) => set({ selectedTime: time }),
    setTimeList: (list) => set({ timeList: list }),
    setServiceTimeList: (list) => set({ serviceTimeList: list }),
    setBookedApps: (appointments) => set({ bookedApps: appointments }),
}));
