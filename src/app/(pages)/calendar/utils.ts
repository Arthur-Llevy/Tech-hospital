import { z } from "zod"

export const formSchema = z.object({
  doctorId: z.number({
    message: "Por favor, escolha um médico."
  }).min(1, {
    message: "Por favor, escolha um médico."
  })
})


