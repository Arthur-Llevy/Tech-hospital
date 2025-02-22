import { api } from "./config";
import { DataValuesType } from "./types";

const getAllAppointments = async (id: number) => {
    const result = await api.get(`/appointments/${id}`);

    if (result.status !== 500) {
        return result.data;
    } 

    return result;
}

const getAllDoctors = async () => {
    const result = await api.get(`/doctors/`);

    if (result.status !== 500) {
        return result.data;
    } 

    return result;
}

const getAllDaysAvaiableById = async (id: number) => {
    const result = await api.get(`/doctors-available-days/${id}`);

    if (result.status !== 500) {
        return result.data;
    } 

    return result;
}

const administratorLogin = async (user: string, password: string) => {
    const result = await api.post("/administrators/login", {
        user, 
        password
    })

    if (result.status !== 500){
        return result.data;
    }

    return result;
}

const getPatientByCpf = async (token: string, cpf: string) => {
    const result = await api.get(`/patientCpf/${cpf}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (result.status !== 500){
        return result.data;
    }

    return result;
}

const createNewAppointment = async (token: string, isPatientAlreadyRegistredd: boolean, data: DataValuesType) => {
    if (!isPatientAlreadyRegistredd) {
        const newPatient = await api.post("/patients", {
            cpf: data.patientCpf,
            name: data.patientName,
            age: data.patientAge,
            birth_date: data.patientBirthDate,
            observations: data.patientObservations
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const patientData = newPatient.data;
    } else {
        const newAppointment = await api.post("/appointments", {
            patient_Id: data.appointmentPatientId,
            doctor_Id: data.appointmentDoctorId,
            doctors_Days_Available_Id: data.appointmentDoctorAvailableDayId,
            status: data.appointmentStatus,
            type: data.appointmentType
        },  {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }
}

const doctorLogin = async (user: string, password: string) => {
    const result = await api.post("/doctors/login", {
        user, 
        password
    })

    if (result.status !== 500){
        return result.data;
    }
    return result;
}

const registerNewAvailableDay = async (token: string, data: any) => {
    const result = await api.post("doctors-available-days", {
        date: data.date,
        doctor_Id: data.doctor_Id,
        arrival_Time: data.arrival_Time,
        departure_Time: data.departure_Time
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (result.status !== 500){
        return result.data;
    }
    return result;
}

export { getAllAppointments, getAllDoctors, getAllDaysAvaiableById, administratorLogin, getPatientByCpf, createNewAppointment, doctorLogin, registerNewAvailableDay };