import { AxiosResponse } from "axios";
import { api } from "./config";

const getAllAppointments = async (id: number) => {
    const result = await api.get(`/appointments/${id}`);

    if (result.status !== 500) {
        return result.data;
    } 

    return result;
}

export { getAllAppointments };