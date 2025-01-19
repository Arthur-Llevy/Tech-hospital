type DoctorType = {
    id: number, 
    name: string,
    specialty: string
};

type DoctorAvaiableDayType = {
    id: number,
    date: string,
    arrival_Time: string,
    departure_Time: string,
    doctor: Doctor
}

type Doctor = {
    id: number
}

type DoctorsAvailableDays = {
    id: number,
    date: string,
}

export type { DoctorType, DoctorAvaiableDayType, DoctorsAvailableDays};