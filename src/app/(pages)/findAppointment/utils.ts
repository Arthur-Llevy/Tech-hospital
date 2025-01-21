import { z } from "zod"

export const formSchema = z.object({
    id: z.string()
    .nonempty({ 
      message: "Preecha o campo."
    })
    .transform(value => Number(value))
})


