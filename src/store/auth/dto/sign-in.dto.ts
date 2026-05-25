import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(5),
})

export class SignInDto extends createZodDto(schema) {}
