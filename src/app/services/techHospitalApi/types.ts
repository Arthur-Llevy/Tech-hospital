type DataValuesType = {
    patientCpf: string,
    patientName: string,
    patientAge: string,
    patientBirthDate: string,
    patientObservations?: string,
    appointmentPatientId: number,
    appointmentDoctorAvailableDayId: number,
    appointmentDoctorId: number,
    appointmentStatus: number,
    appointmentType: number
};

export type { DataValuesType }