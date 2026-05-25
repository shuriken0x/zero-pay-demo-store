import { z } from "zod"
import { Blockchain, Token } from "@share"
import { createZodDto } from "nestjs-zod"


const schema = z.object({
  token: z.enum(Token),
  blockchain: z.enum(Blockchain),
  amount: z.number().positive().min(5),
})

export class CreateTopUpDto extends createZodDto(schema) {}