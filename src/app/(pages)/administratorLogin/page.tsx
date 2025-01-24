"use client"

import { administratorLogin } from "@/app/services/techHospitalApi/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCookies } from "react-cookie"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { formSchema } from "./utils"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"

export default function AdministratorLogin() {
    const [, setCookies] = useCookies(["token"]);
    const [isPopupVisible, setIsPopupvisible] = useState<boolean>(false);
    const [popupMessage, setPopupmessage] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user: "",
            password: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const result = await administratorLogin(values.user, values.password);
            if ("Token" in result) {
                setCookies("token", result.Token, {
                    path: "/",
                    maxAge: 3600
                });
                location.href = "/createAppointment";
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 404) {
                    setIsPopupvisible(true);
                    setPopupmessage("Credenciais incorretas.");

                    setTimeout(() => setIsPopupvisible(false), 3500);
                } else if (error.response.status === 500) {
                    setIsPopupvisible(true);
                    setPopupmessage("Um erro ocorreu em nossos servidores. Por favor, tente novamente mais tarde.");

                    setTimeout(() => setIsPopupvisible(false), 3500);
                }
            }
        }
    }

    return (
        <div>
            <Link href="/"><Button className="m-8 w-28 h-12 font-bold text-sm">Voltar</Button></Link>   
            <Card className="w-11/12 m-auto p-4 mt-10">
                <h1 className="text-3xl font-bold pb-4">Login</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="user"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Usuário:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex.: arthur" {...field} />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.user?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Senha:</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage>
                                    {form.formState.errors?.password?.message}
                                </FormMessage>
                                </FormItem>
                            )}
                        />
                        <Button className="m-auto block w-full" type="submit">Entrar</Button>
                    </form>
                </Form>
            </Card>
            {isPopupVisible && (
                <Alert variant={"destructive"} className="w-11/12 my-8 mx-auto">
                    <AlertTitle>Mensagem</AlertTitle>
                    <AlertDescription>
                        {popupMessage}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}