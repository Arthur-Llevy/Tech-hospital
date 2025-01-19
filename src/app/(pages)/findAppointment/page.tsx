"use client"

import { getAllAppointments } from "@/app/services/techHospitalApi/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { AppointmentType } from "./types"
import { formatDateTimeWithSlashes } from "@/app/utils/formaters/formatDate"
import { formatTime } from "@/app/utils/formaters/formatTime"
import AppointmentStatus from "@/app/components/appointmentStatus"

export default function FindExam(){
    const [appointment, setAppointment] = useState<AppointmentType>();
    const [id, setId] = useState<number>(0);

    const handleClick = async () => {
        try {
            const result = await getAllAppointments(id);
            console.log(result.patient.name)
            setAppointment(result);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Link href="/"><Button className="m-8 w-28 h-12 font-bold text-sm">Voltar</Button></Link>   
            <main className="flex flex-col gap-8">
                <Card className="w-11/12 m-auto">
                    <CardHeader>
                        <CardTitle>Digite o ID da sua consulta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder="Ex.: 312" type="number" onChange={e => setId(Number(e.target.value))}/>
                        <Button 
                            onClick={handleClick} 
                            className="w-28 h-12 font-bold text-sm block my-8 mx-auto">Buscar</Button>
                    </CardContent>
                </Card>
                    {appointment !== undefined && (
                        <Card className="w-11/12 m-auto py-8">
                            <CardContent className="flex flex-col">
                                <h2 className="text-2xl font-bold">Dados pessoais</h2>
                                <span><span className="font-bold">Nome:</span> {appointment.patient.name}</span>
                                <span><span className="font-bold">CPF:</span> {appointment.patient.cpf}</span>
                                <span><span className="font-bold">Nome:</span> {appointment.patient.gender}</span>
                                <span><span className="font-bold">Idade:</span> {appointment.patient.age}</span>
                                <span><span className="font-bold">Data de nascimento:</span> {formatDateTimeWithSlashes(appointment.patient.birth_Date)}</span>
                            </CardContent>
                            <CardContent className="flex flex-col">
                                <h2 className="text-2xl font-bold">Dados da consulta</h2>
                                <span><span className="font-bold">ID:</span> {appointment.id}</span>
                                <span><span className="font-bold">Médico responsável:</span> {appointment.doctor.name}</span>
                                <span><span className="font-bold">Especialidade:</span> {appointment.doctor.specialty}</span>
                                <span><span className="font-bold">Tipo:</span> {appointment.type}</span>
                                <span><span className="font-bold">Data:</span> {formatDateTimeWithSlashes(appointment.date.date)}</span>
                                <span><span className="font-bold">Horário de início:</span> {formatTime(appointment.date.arrival_Time)}</span>
                                <span><span className="font-bold">Status:</span> <AppointmentStatus type={appointment.status}></AppointmentStatus></span>
                            </CardContent>
                        </Card>
                    )}
            </main>
        </div>
    )
}