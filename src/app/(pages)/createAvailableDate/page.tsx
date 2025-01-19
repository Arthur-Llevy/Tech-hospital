"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { Input } from "@/components/ui/input"
import { getAllDaysAvaiable, registerNewAvailableDay } from "@/app/services/techHospitalApi/api"
import { useCookies } from "react-cookie"
import { DoctorAvaiableDayType } from "./types"
import { formatDateToString } from "@/app/utils/formaters/formatDate"

export default function Calendar(){
    const [cookies] = useCookies(["token"]);
    const [selected, setSelected] = useState<Date[]>();
    const [arrivalTime, setArrivalTime] = useState<string>("");
    const [departureTime, setDepartureTime] = useState<string>("");
    const doctorId = localStorage.getItem("doctorId");

    const registerDate = async () => {
        if (selected !== undefined) {
            const lastDate = selected[selected.length -1];

            function padZero(value: number) {
                return (value < 10 ? '0' : '') + value;
            }
              
            const data = {
                doctor_Id: doctorId,
                arrival_Time: arrivalTime,
                departure_Time: departureTime,
                date: `${lastDate.getFullYear()}-${padZero(lastDate.getMonth() + 1)}-${padZero(lastDate.getDate())}`
            }

           const result = await registerNewAvailableDay(cookies.token, data);

            setSelected([...selected, new Date(lastDate)]);
            selected.sort((a, b) => {
                const today = new Date();
                const diffA = Math.abs(a.getTime() - today.getTime());
                const diffB = Math.abs(b.getTime() - today.getTime());
                return diffA - diffB;
            });
       }
    }

    const searchDoctorsDaysAvaiable = async () => {
        const result: DoctorAvaiableDayType[] = await getAllDaysAvaiable();
        const filteredResult: DoctorAvaiableDayType[] = result.filter(availableDay => availableDay.doctor.id === Number(doctorId));
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
        searchDoctorsDaysAvaiable();
    }, [])

    return (
        <div>
            <Link href="/"><Button className="m-8 w-28 h-12 font-bold text-sm">Voltar</Button></Link>   
            <main className="flex flex-col gap-8">
                <Card className="w-11/12 m-auto">
                        <CardHeader>
                            <CardTitle className="text-center">Escolha datas para registrá-las</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <DayPicker
                                className="m-auto"
                                mode="multiple"
                                locale={ptBR}
                                selected={selected}
                                onSelect={setSelected}
                            />
                            <div className="flex flex-col gap-4">
                                <label>Horário de entrada</label>
                                <Input type="time" onChange={e => setArrivalTime(e.target.value)} />
                                <label>Horário de saída</label>
                                <Input type="time" onChange={e => setDepartureTime(e.target.value)}/>
                            </div>
                            <Button 
                                className="w-28 h-12 font-bold text-sm block my-8 mx-auto"
                                onClick={registerDate}
                            >Registrar
                            </Button>
                        </CardContent>
                    </Card>
                    <h2 className="font-bold text-2xl p-4">Datas já registradas</h2>
                    {selected !== undefined && selected.map((date, index) => (
                        <div key={index} className="flex justify-between w-screen px-4">
                            <h3                                 
                                className="px-4"
                            >{formatDateToString(date.getDate(), date.getMonth(), date.getFullYear())}</h3>
                            <Button variant="destructive">X</Button>
                        </div>
                    ))}
            </main>
        </div>
    )
}