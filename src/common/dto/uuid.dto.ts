import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const schema = z.object({
  id: z.uuidv4(),
})

export class UUIDDto extends createZodDto(schema) {}
