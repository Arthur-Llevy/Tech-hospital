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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"
import { z } from "zod"
import { formSchema } from "./utils"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


export default function FindExam(){
    const [appointment, setAppointment] = useState<AppointmentType>();
    const [isPopupVisible, setIsPopupvisible] = useState<boolean>(false);
    const [popupMessage, setPopupmessage] = useState<string>("");

    const handleSubmit = async (id: number) => {
        try {
            const result = await getAllAppointments(id);
            setAppointment(result);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    setIsPopupvisible(true);
                    setPopupmessage("Não foi encontrado nenhum exame com esse Id.");

                    setTimeout(() => setIsPopupvisible(false), 3500);
                } else if (error.response.status === 500) {
                    setIsPopupvisible(true);
                    setPopupmessage("Um erro ocorreu em nossos servidores. Por favor, tente novamente mais tarde.");

                    setTimeout(() => setIsPopupvisible(false), 3500);
                }
            }
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          id: 0,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await handleSubmit(values.id);
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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="id"
                                    render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button 
                                    type="submit"
                                    className="w-28 h-12 font-bold text-sm block my-8 mx-auto"
                                >
                                    Buscar
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                {isPopupVisible && (
                    <Alert variant={"destructive"} className="w-11/12 m-auto">
                        <AlertTitle>Ops!</AlertTitle>
                        <AlertDescription>
                            {popupMessage}
                        </AlertDescription>
                    </Alert>
                )}
                {appointment !== undefined && (
                    <Card className="w-11/12 m-auto py-8">
                        <CardContent className="flex flex-col">
                            <h2 className="text-2xl font-bold">Dados pessoais</h2>
                            <span><span className="font-bold">Nome:</span> {appointment.patient.name}</span>
                            <span><span className="font-bold">CPF:</span> {appointment.patient.cpf}</span>
                            <span><span className="font-bold">Sexo:</span> {appointment.patient.gender === 0 ? "Masculino": "Feminino"}</span>
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