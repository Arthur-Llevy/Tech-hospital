"use client"

import { getAllDaysAvaiable, getAllDoctors } from "@/app/services/techHospitalApi/api"
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

export default function Calendar(){
    const [selected, setSelected] = useState<Date[]>();
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [doctorId, setDoctorId] = useState<number>(0);

    const handleSearchDoctors = async () => {
        const result = await getAllDoctors();
        setDoctors(result);
    }

    const searchDoctorsDaysAvaiable = async () => {
        const result: DoctorAvaiableDayType[] = await getAllDaysAvaiable(doctorId);
        const filteredResult: DoctorAvaiableDayType[] = result.filter(availableDay => availableDay.doctor.id === doctorId);
        const dates = filteredResult.map(data => new Date(`${data.date}T12:00:00Z`));
        dates.sort((a, b) => {
            const today = new Date();
            const diffA = Math.abs(a.getTime() - today.getTime());
            const diffB = Math.abs(b.getTime() - today.getTime());
            return diffA - diffB;
          });
        setSelected(dates);
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
                        <Select onValueChange={e => setDoctorId(Number(e))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o médico" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors !== undefined && doctors.map(doctor => (
                                    <SelectItem 
                                        key={doctor.id} 
                                        value={doctor.id.toString()}
                                    >{doctor.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                            <Button 
                                className="w-28 h-12 font-bold text-sm block my-8 mx-auto"
                                onClick={searchDoctorsDaysAvaiable}
                                >Buscar</Button>
                        </CardContent>
                    </Card>
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