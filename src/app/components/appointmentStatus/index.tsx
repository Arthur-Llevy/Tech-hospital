import { AppointmentStatusProps } from "./types"

export default function AppointmentStatus({ type }: AppointmentStatusProps) {
    if (type === "Indeferido") {
        return (            
            <span className="bg-red-500 text-white p-1 rounded-sm">Indeferido</span>
        )
    } else if (type === "Marcado") {
        return (            
            <span className="bg-emerald-500 text-white p-1 rounded-sm">Marcado</span>
        )
    }

    return <></>
}