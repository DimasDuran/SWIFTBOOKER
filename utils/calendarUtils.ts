function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

interface Appointment {
    bookedDate: string;
    bookedTime: string;
}

export function sortAppointmentsByDateAndTime(appointmentList: Appointment[]): Appointment[] {
    return appointmentList.slice().sort((a, b) => {
        const dateComparison = parseDate(a.bookedDate).getTime() - parseDate(b.bookedDate).getTime();
        if (dateComparison === 0) {
            return a.bookedTime.localeCompare(b.bookedTime);
        }
        return dateComparison;
    });
}
