"use client"

import { getAllDaysAvaiableById, getAllDoctors } from "@/app/services/techHospitalApi/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import "react-day-picker/style.css";
import { DoctorAvaiableDayType, DoctorType } from "./types"
import { formatDateToString } from "@/app/utils/formaters/formatDate"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"
import { useForm } from "react-hook-form"
import { formSchema } from "./utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

export default function Calendar(){
    const [selected, setSelected] = useState<Date[]>();
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [isPopupVisible, setIsPopupvisible] = useState<boolean>(false);
    const [popupMessage, setPopupmessage] = useState<string>("");

    const handleSearchDoctors = async () => {
        const result = await getAllDoctors();
        setDoctors(result);
    }

    const searchDoctorsDaysAvaiable = async (doctorId: number) => {
        setSelected(undefined);
        try {
            const result: DoctorAvaiableDayType[] = await getAllDaysAvaiableById(doctorId);

            if (result.length === 0) {
                setIsPopupvisible(true);
                setPopupmessage("Não foi encontrado nenhuma data disponível para este médico.");
            } else {
                setIsPopupvisible(false);
                const dates = result.map(data => new Date(`${data.date}T12:00:00Z`));
                dates.sort((a, b) => {
                    const today = new Date();
                    const diffA = Math.abs(a.getTime() - today.getTime());
                    const diffB = Math.abs(b.getTime() - today.getTime());
                    return diffA - diffB;
                  });
                setSelected(dates);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 500) {
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
            doctorId: 0
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
       await searchDoctorsDaysAvaiable(values.doctorId);
    }

    useEffect(() => {
        handleSearchDoctors();
    }, [])

    return (
        <div>
            <Link href="/"><Button className="m-8 w-28 h-12 font-bold text-sm">Voltar</Button></Link>   
            <main className="flex flex-col gap-8">
                <Card className="w-11/12 m-auto">
                    <CardHeader>
                        <CardTitle className="text-center">Escolha o médico para ver seus dias disponíveis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="doctorId"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormControl>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o médico" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors !== undefined && doctors.map(doctor => (
                                                    <SelectItem 
                                                        onClick={e => form.setValue("doctorId", doctor.id)}
                                                        key={doctor.id} 
                                                        value={doctor.id.toString()}
                                                    >
                                                        {doctor.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage>
                                            {form.formState.errors?.doctorId?.message}
                                        </FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <Button 
                                    className="w-28 h-12 font-bold text-sm block my-8 mx-auto"
                                    type="submit"
                                >
                                    Buscar
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    </Card>
                    {isPopupVisible && (
                        <Alert variant={"destructive"} className="w-11/12 m-auto">
                            <AlertTitle>Mensagem</AlertTitle>
                            <AlertDescription>
                                {popupMessage}
                            </AlertDescription>
                        </Alert>
                    )}
                    {selected !== undefined && selected.length > 0 && (<>
                        <DayPicker
                            className="m-auto"
                            mode="multiple"
                            locale={ptBR}
                            selected={selected}
                            onSelect={setSelected}
                        />
        
                        <h2 className="font-bold text-2xl p-4">Datas próximas disponíveis</h2>
                        {selected.map((date, index) => (
                            <div key={index}>
                                <h3                                 
                                    className="px-4"
                                >{formatDateToString(date.getDate(), date.getMonth(), date.getFullYear())}</h3>
                                <hr />
                            </div>
                        ))}
                    </>)}
            </main>
        </div>
    )
}