"use client"

import { doctorLogin } from "@/app/services/techHospitalApi/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCookies } from "react-cookie"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function DoctorLogin() {
    const [, setCookies] = useCookies(["token"]);

    const formSchema = z.object({
        user: z.string({
            message: "Preencha este campo."
        }).min(2, {
          message: "O usuário precisa ter no mínimo 3 caracteres.",
        }),
        password: z.string({
            message: "Preencha este campo."
        }).min(3, { 
            message: "A senha precisa ter no mínimo 3 caracteres."
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const result = await doctorLogin(values.user, values.password);
            if ("Token" in result) {
                setCookies("token", result.Token, {
                    path: "/",
                    maxAge: 3600
                });
                localStorage.setItem("doctorId", result.Doctor_Id)
                location.href = "/createAvailableDate";
            }
        } catch (error) {
            console.log(error);
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
        </div>
    )
}