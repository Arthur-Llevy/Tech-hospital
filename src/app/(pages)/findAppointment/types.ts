type AppointmentDate = {
    id: number,
    date: string,
    arrival_Time: string,
    departure_Time: string,
    doctor_id: string
}

type Doctor = {
    id: number,
    name: string,
    user: string,
    specialty: string,
}

type Patient = {
    id: number,
    cpf: string,
    age: number,
    birth_Date: string,
    gender: number,
    name: string,
    user: string,
    specialty: string,
    observations: string
}

type AppointmentType = {
    id: number,
    patient_Id: number,
    doctor_Id: number,
    doctors_Days_Available_Id: number,
    status: "Indeferido" | "Marcado",
    type: string,
    doctor: Doctor,
    patient: Patient,
    date: AppointmentDate
};

export type { AppointmentType }