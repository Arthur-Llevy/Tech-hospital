import { z } from "zod";

export const formSchema = z.object({
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
});