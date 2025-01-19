"use client"

import { administratorLogin, createNewAppointment, getAllDaysAvaiable, getAllDoctors, getPatientByCpf } from "@/app/services/techHospitalApi/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DoctorType, DoctorAvaiableDayType } from "./types"
import { useCookies } from "react-cookie"
import { formatDateFromDatabaseToInterface } from "@/app/utils/formaters/formatDate"

export default function FindAppointment() {
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [doctorsDaysAvailable, setdoctorsDaysAvailable] = useState<DoctorAvaiableDayType[]>([]);
    const [cookies] = useCookies(["token"]);
    const [isPatientRegistred, setIsPatientRegistred] = useState(false);

    const formSchema = z.object({
        patientCpf: z.string({
            message: "Preencha este campo."
        }).min(11, {
          message: "O campo precisa de no mínimo ter 11 caracteres",
        }),
        patientName: z.string({
            message: "Preencha este campo."
        }).min(3, {
          message: "O campo precisa de no mínimo ter 3 caracteres",
        }),
        patientAge: z.string(),
        patientBirthDate: z.string({
            message: "Preencha este campo."
        }).min(8, {
          message: "O campo precisa de no mínimo ter 8 caracteres",
        }),
        patientGender: z.number(),
        patientObservations: z.string(),
        appointmentDoctorId: z.number(),
        appointmentStatus: z.number({
            message: "Preencha este campo."
        }),
        appointmentType: z.number({
            message: "Preencha este campo."
        }),
        appointmentDoctorAvailableDayId: z.number({
            message: "Preencha este campo."
        }),
        appointmentPatientId: z.number()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            appointmentDoctorAvailableDayId: 0,
            appointmentDoctorId: 0,
            appointmentStatus: 0,
            appointmentType: 0,
            patientAge: "",
            patientBirthDate: "",
            patientCpf: "",
            patientGender: 0,
            patientName: "",
            patientObservations: "",
            appointmentPatientId: 0,
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createNewAppointment(cookies.token, isPatientRegistred, values)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearchDoctors = async () => {
        const result = await getAllDoctors();
        setDoctors(result);
    }

    const handleSearchDoctorsAvailableDays = async () => {
        const result = await getAllDaysAvaiable();
        setdoctorsDaysAvailable(result);
    }

    const searchPatientByCpf = async () => {
        if (form.getValues("patientCpf") !== null && form.getValues("patientCpf") !== undefined && form.getValues("patientCpf") !== ""){
            const result = await getPatientByCpf(cookies.token, form.getValues("patientCpf"));
    
            if (result !== null) {
                setIsPatientRegistred(true);
                form.setValue("appointmentPatientId", result.id);
                form.setValue("patientName", result.name);
                form.setValue("patientAge", result.age.toString());
                form.setValue("patientBirthDate", formatDateFromDatabaseToInterface(result.birth_Date));
                form.setValue("patientGender", result.gender === "Masculino" ? 0 : 1);
                form.setValue("patientObservations", result.observations);
            } else {
                setIsPatientRegistred(false);
            }
        }
    }

    useEffect(() => {
        handleSearchDoctors();
        handleSearchDoctorsAvailableDays();
    }, [])

    return (
        <div>
            <Link href="/"><Button className="m-8 w-28 h-12 font-bold text-sm">Voltar</Button></Link>   
            <Card className="w-11/12 m-auto p-4 mt-10">
                <h1 className="text-3xl font-bold pb-4">Criar novo exame</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="patientCpf"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>CPF do paciente:</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Ex.: 12345678900"
                                        {...field}
                                        onBlur={searchPatientByCpf}
                                    />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.patientCpf?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="patientName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome do paciente:</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.patientName?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="patientAge"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Idade do paciente:</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.patientAge?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="patientBirthDate"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Data de nascimento do paciente:</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.patientBirthDate?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="patientGender"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Gênero do paciente:</FormLabel>
                                <FormControl>
                                    <Select value={form.getValues("patientGender").toString()} name="patientGender">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o gênero" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem onClick={e => form.setValue("patientGender", 0)} value="0">Masculino</SelectItem>
                                            <SelectItem onClick={e => form.setValue("patientGender", 1)} value="1">Feminino</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.patientGender?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="patientObservations"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Observações do paciente:</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                               </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="appointmentDoctorId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Doutor responsável:</FormLabel>
                                <FormControl>
                                    <Select name="appointmentDoctorId">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o médico" />
                                        </SelectTrigger>
                                         <SelectContent>
                                            {doctors !== undefined && doctors.map(doctor => (
                                                <SelectItem 
                                                    onClick={e => form.setValue("appointmentDoctorId", Number(doctor.id))}
                                                    key={doctor.id} 
                                                    value={doctor.id.toString()}
                                                >{doctor.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.appointmentDoctorId?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="appointmentType"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tipo do exame:</FormLabel>
                                <FormControl>
                                    <Select name="appointmentType">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status do exame" />
                                        </SelectTrigger>
                                         <SelectContent>
                                            <SelectItem 
                                                onClick={e => form.setValue("appointmentType", 0)}
                                                value="Consulta"
                                            >Consulta
                                            </SelectItem>
                                            <SelectItem 
                                                onClick={e => form.setValue("appointmentType", 1)}
                                                value="Exame laboratorial"
                                            >Exame laboratorial
                                            </SelectItem>
                                            <SelectItem 
                                                onClick={e => form.setValue("appointmentType", 2)}
                                                value="Exame de imagem"
                                            >Exame de imagem
                                            </SelectItem>
                                            <SelectItem 
                                                onClick={e => form.setValue("appointmentType", 3)}
                                                value="Procedimento cirúrgico"
                                            >Procedimento cirúrgico
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.appointmentType?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="appointmentStatus"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Status do exame:</FormLabel>
                                <FormControl>
                                    <Select name="appointmentStatus">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo do exame" />
                                        </SelectTrigger>
                                         <SelectContent>
                                            <SelectItem 
                                                onClick={e => form.setValue("appointmentStatus", 0)}
                                                value="Marcado"
                                            >Marcado
                                            </SelectItem>
                                            <SelectItem 
                                                onClick={e => form.setValue("appointmentStatus", 1)}
                                                value="Indeferido"
                                            >Indeferido
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.appointmentStatus?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="appointmentDoctorAvailableDayId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Data para marcação:</FormLabel>
                                <FormControl>
                                    <Select name="appointmentDoctorAvailableDayId">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a data" />
                                        </SelectTrigger>
                                         <SelectContent>
                                            {doctorsDaysAvailable !== undefined && doctorsDaysAvailable.map(availableDay => (
                                                <SelectItem 
                                                    onClick={e => form.setValue("appointmentDoctorAvailableDayId", availableDay.id)}
                                                    key={availableDay.id} 
                                                    value={availableDay.date}
                                                >{availableDay.date}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.appointmentDoctorAvailableDayId?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <Button className="m-auto block w-full" type="submit">Entrar</Button>
                    </form>
                </Form>
            </Card>
        </div>
    )
}